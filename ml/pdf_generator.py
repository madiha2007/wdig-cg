
"""
WDIG PDF Report Generator v7.0
- Fixed: page-break check inside every line of every paragraph (not just per-paragraph)
- Fixed: accurate stringWidth-based wrapping (no more character estimation)  
- Restored: dimension profile card with radar chart
- Fixed: conclusion blank page
- Fixed: roadmap infographic properly drawn
"""

from flask import Flask, request, jsonify, send_file
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
import io, re, math

# ── Palette ────────────────────────────────────────────────────────────────────
INK          = colors.HexColor("#0D1B2A")
INK_MID      = colors.HexColor("#2C3E50")
INK_LIGHT    = colors.HexColor("#5D7A8A")
TEAL         = colors.HexColor("#0A7B6B")
TEAL_MID     = colors.HexColor("#14B89A")
TEAL_LIGHT   = colors.HexColor("#E8F8F5")
GOLD         = colors.HexColor("#C9962B")
GOLD_LIGHT   = colors.HexColor("#FEF9EC")
ROSE         = colors.HexColor("#C0445A")
ROSE_LIGHT   = colors.HexColor("#FDF0F2")
SKY          = colors.HexColor("#1A6B9A")
SKY_LIGHT    = colors.HexColor("#EDF5FB")
PURPLE       = colors.HexColor("#5B3FA0")
PURPLE_LIGHT = colors.HexColor("#F3EFFD")
CREAM        = colors.HexColor("#FAFAF8")
WHITE        = colors.white
CAREER_COLORS = [TEAL, SKY, PURPLE, GOLD, ROSE]
ROAD_COLORS   = [colors.HexColor("#8CC63F"), colors.HexColor("#00A88A"),
                 colors.HexColor("#1A6B9A"), colors.HexColor("#0D1B2A")]

W, H = A4
MARGIN     = 38
CONTENT_W  = W - 2 * MARGIN
LINE_H     = 15.5   # leading for body text
BODY_SIZE  = 9.5
PAGE_FLOOR = 72     # never draw below this y

# ── Core: page-break-safe text drawing ────────────────────────────────────────

def do_page_break(c, style_name):
    """Issue showPage() and reset y with header."""
    c.showPage()
    return draw_page_header(c, style_name)

def draw_page_header(c, style_name):
    """Top bar + breadcrumb. Returns y just below header area."""
    c.setFillColor(INK)
    c.rect(0, H - 8, W, 8, stroke=0, fill=1)
    c.setFillColor(TEAL_MID)
    c.rect(0, H - 8, W * 0.38, 8, stroke=0, fill=1)
    c.setFont("Helvetica", 6.5); c.setFillColor(INK_LIGHT)
    c.drawString(MARGIN, H - 19, f"WDIG Aptitude Report  ·  {style_name[:44]}")
    c.drawRightString(W - MARGIN, H - 19, "Confidential")
    return H - 30

def safe_wrap(c, text, font, size, max_w):
    """Word-wrap using actual canvas.stringWidth — accurate, no estimation."""
    clean = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    clean = re.sub(r'\*(.+?)\*',   r'\1', clean)
    clean = clean.strip()
    words = clean.split()
    lines, cur = [], ""
    for word in words:
        test = (cur + " " + word).strip() if cur else word
        if c.stringWidth(test, font, size) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            # if single word wider than max_w, just add it
            cur = word
    if cur:
        lines.append(cur)
    return lines

def draw_text_block(c, text, x, start_y, font, size, color, max_w,
                    leading=LINE_H, style_name="", indent=0, italic=False):
    """
    Draw a multi-line text block with per-line page-break detection.
    Returns final y position.
    """
    actual_font = font
    if italic and "Bold" not in font:
        actual_font = font.replace("Helvetica", "Helvetica-Oblique") if "Oblique" not in font else font
    lines = safe_wrap(c, text, actual_font, size, max_w - indent)
    y = start_y
    c.setFont(actual_font, size)
    c.setFillColor(color)
    for line in lines:
        if y < PAGE_FLOOR:
            y = do_page_break(c, style_name)
            c.setFont(actual_font, size)
            c.setFillColor(color)
        c.drawString(x + indent, y, line)
        y -= leading
    return y

def draw_section_body(c, body_text, x, start_y, max_w, style_name, accent=None):
    """
    Draw all paragraphs of a section body. Page-break safe at line level.
    Returns final y.
    """
    y = start_y
    paras = [p.strip() for p in re.split(r'\n\n+', body_text) if p.strip()]
    for i, para in enumerate(paras):
        # Check if there's space for at least 3 lines; if not, break page first
        est_lines = max(1, int(c.stringWidth(para, "Helvetica", BODY_SIZE) / max_w) + 1)
        if y - (min(3, est_lines) * LINE_H) < PAGE_FLOOR:
            y = do_page_break(c, style_name)
        y = draw_text_block(c, para, x, y, "Helvetica", BODY_SIZE,
                            INK_MID, max_w, style_name=style_name)
        y -= 9  # inter-paragraph gap
    return y

# ── Drawing primitives ─────────────────────────────────────────────────────────

def rr(c, x, y, w, h, r=8, fill=None, stroke=None, sw=1):
    if fill:    c.setFillColor(fill)
    if stroke:  c.setStrokeColor(stroke); c.setLineWidth(sw)
    c.roundRect(x, y, w, h, r,
                stroke=1 if stroke else 0,
                fill=1  if fill   else 0)

def alpha(c, a):
    c.saveState(); c.setFillAlpha(a)

def end_alpha(c):
    c.restoreState()

# ── Section header strip ───────────────────────────────────────────────────────

def section_header(c, y, title, icon, accent, light, x=MARGIN, w=CONTENT_W):
    """Draws header strip. Returns y below it."""
    h = 48
    rr(c, x, y - h, w, h, 10, fill=light)
    c.setFillColor(accent)
    c.roundRect(x, y - h, 5, h, 3, stroke=0, fill=1)
    # icon circle
    alpha(c, 0.18); c.setFillColor(accent)
    c.roundRect(x + 14, y - h + 8, 32, 32, 8, stroke=0, fill=1)
    end_alpha(c)
    c.setFont("Helvetica-Bold", 13); c.setFillColor(INK)
    c.drawString(x + 57, y - h + 17, title)
    # right accent bar
    c.setFillColor(accent)
    c.roundRect(x + w - 50, y - h + 22, 40, 4, 2, stroke=0, fill=1)
    return y - h - 12

def divider(c, y, col=None, x=MARGIN, w=CONTENT_W):
    c.setStrokeColor(col or colors.HexColor("#E2EBF0"))
    c.setLineWidth(0.5)
    c.line(x, y, x + w, y)
    return y - 8

# ── Hero banner ────────────────────────────────────────────────────────────────

def draw_hero(c, thinking_style, secondary, top_careers, style_name):
    bh = 185
    by = H - bh
    c.setFillColor(INK); c.rect(0, by, W, bh, stroke=0, fill=1)
    # orbs
    for ox, oy, r, col, a in [(-30, H-30, 140, TEAL, .08),
                                (W+20, H-70, 110, GOLD, .07),
                                (W*.55, H-115, 90, SKY, .06)]:
        c.setFillColor(col); alpha(c, a); c.circle(ox, oy, r, stroke=0, fill=1); end_alpha(c)
    # label
    c.setFont("Helvetica-Bold", 7); c.setFillColor(TEAL_MID)
    c.drawString(MARGIN, H - 22, "APTITUDE REPORT")
    # title
    title = thinking_style or "Your Profile"
    words  = title.split()
    fs     = 26 if len(title) < 32 else 20
    c.setFont("Helvetica-Bold", fs); c.setFillColor(WHITE)
    line1  = " ".join(words[:3]); line2 = " ".join(words[3:]) if len(words) > 3 else ""
    c.drawString(MARGIN, H - 50, line1)
    if line2: c.drawString(MARGIN, H - 50 - fs - 4, line2)
    # secondary badge
    if secondary:
        bw = min(180, c.stringWidth(secondary, "Helvetica", 8) + 36)
        badge_y = H - 97
        alpha(c, .08); c.setFillColor(WHITE)
        c.roundRect(MARGIN, badge_y, bw, 20, 10, stroke=0, fill=1); end_alpha(c)
        c.setFont("Helvetica-Bold", 6); c.setFillColor(TEAL_MID)
        c.drawString(MARGIN + 10, badge_y + 6, "ALSO")
        c.setFont("Helvetica", 8); alpha(c, .85); c.setFillColor(WHITE)
        c.drawString(MARGIN + 32, badge_y + 6, secondary[:34]); end_alpha(c)
    # career chips
    chip_x = MARGIN; chip_y = by + 16
    chip_cols = [TEAL_MID, GOLD, SKY]
    for i, career in enumerate(top_careers[:3]):
        name  = (career.get("name") or "")[:20]
        score = career.get("score", 0)
        label = f"  {name}  {score}%"
        cw    = min(160, c.stringWidth(label, "Helvetica", 7) + 18)
        alpha(c, .06); c.setFillColor(WHITE)
        c.setStrokeColor(chip_cols[i]); c.saveState(); c.setStrokeAlpha(.4); c.setLineWidth(.8)
        c.roundRect(chip_x, chip_y, cw, 18, 9, stroke=1, fill=1); c.restoreState(); end_alpha(c)
        c.setFont("Helvetica", 7); c.setFillColor(chip_cols[i])
        c.drawString(chip_x + 8, chip_y + 5, label.strip())
        chip_x += cw + 8
    # stats bar
    stats = [("Thinking Style", (thinking_style or "—")[:22]),
             ("Top Career",     (top_careers[0]["name"] if top_careers else "—")[:22]),
             ("Match Score",    f"{top_careers[0].get('score','—')}%" if top_careers else "—"),
             ("Dimensions",     "6 analysed")]
    sw = CONTENT_W / 4
    for i, (lbl, val) in enumerate(stats):
        sx = MARGIN + i * sw
        if i > 0:
            alpha(c, .08); c.setStrokeColor(WHITE); c.setLineWidth(.5)
            c.line(sx, by + 4, sx, by + 28); end_alpha(c)
        c.setFont("Helvetica", 6); alpha(c, .38); c.setFillColor(WHITE)
        c.drawString(sx + 8, by + 16, lbl); end_alpha(c)
        c.setFont("Helvetica-Bold", 8.5); alpha(c, .85); c.setFillColor(WHITE)
        c.drawString(sx + 8, by + 6, val); end_alpha(c)
    return by - 14

# ── Dimension radar ────────────────────────────────────────────────────────────

def draw_radar(c, scores, cx, cy, R=52):
    items = list(scores.items()); n = len(items)
    if not n: return
    def pt(i, frac):
        a = (math.pi * 2 * i / n) - math.pi / 2
        return cx + frac * R * math.cos(a), cy + frac * R * math.sin(a)
    for lvl in [.25, .5, .75, 1.0]:
        pts = [pt(i, lvl) for i in range(n)]
        path = c.beginPath(); path.moveTo(*pts[0])
        for p in pts[1:]: path.lineTo(*p)
        path.close()
        alpha(c, .25); c.setStrokeColor(TEAL); c.setLineWidth(.5)
        c.drawPath(path, stroke=1, fill=0); end_alpha(c)
    for i in range(n):
        ex, ey = pt(i, 1.0)
        alpha(c, .15); c.setStrokeColor(TEAL); c.setLineWidth(.4)
        c.line(cx, cy, ex, ey); end_alpha(c)
    data_pts = [pt(i, items[i][1] / 100.0) for i in range(n)]
    path = c.beginPath(); path.moveTo(*data_pts[0])
    for p in data_pts[1:]: path.lineTo(*p)
    path.close()
    alpha(c, .18); c.setFillColor(TEAL); end_alpha(c)
    c.setFillColor(TEAL); c.saveState(); c.setFillAlpha(.18)
    c.setStrokeColor(TEAL); c.setLineWidth(1.4)
    c.drawPath(path, stroke=1, fill=1); c.restoreState()
    for px, py in data_pts:
        c.setFillColor(TEAL); c.circle(px, py, 2.8, stroke=0, fill=1)
    DIM_ICONS = {"cognitive":"brain","personality":"gear","motivational":"fire",
                 "social":"hands","suppression":"lock","contribution":"globe"}
    c.setFont("Helvetica", 6); c.setFillColor(INK_MID)
    for i, (dim, val) in enumerate(items):
        lx, ly = pt(i, 1.3)
        label = dim[:5]
        lw = c.stringWidth(label, "Helvetica", 6)
        c.drawString(lx - lw/2, ly - 3, label)

# ── Trait bars ─────────────────────────────────────────────────────────────────

def draw_trait_bars(c, traits, x, y, bar_w=175, bar_h=11, gap=8):
    cols = [TEAL, SKY, PURPLE, GOLD, ROSE, TEAL_MID, INK_MID]
    for i, trait in enumerate(traits[:7]):
        label = re.sub(r'\*\*?', '', trait.get("label", trait.get("trait", "")))[:22]
        score = trait.get("score", 0)
        col   = cols[i % len(cols)]
        c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_MID)
        c.drawString(x, y + 3, label)
        alpha(c, .12); c.setFillColor(col)
        c.roundRect(x + 105, y, bar_w, bar_h, bar_h/2, stroke=0, fill=1); end_alpha(c)
        fill = max(4, (score / 100) * bar_w)
        alpha(c, .85); c.setFillColor(col)
        c.roundRect(x + 105, y, fill, bar_h, bar_h/2, stroke=0, fill=1); end_alpha(c)
        c.setFont("Helvetica-Bold", 7); c.setFillColor(col)
        c.drawString(x + 105 + bar_w + 5, y + 3, f"{score}%")
        y -= bar_h + gap
    return y

# ── Dimension profile card (matches UI) ───────────────────────────────────────

def draw_dimension_card(c, dim_scores, dominant_traits, supp, y, style_name):
    """Draws the dimension profile + dominant traits side-by-side card.
       Returns y below the card."""
    if not dim_scores and not dominant_traits:
        return y
    card_h = 165
    if y - card_h < PAGE_FLOOR:
        y = do_page_break(c, style_name)
    # card bg
    rr(c, MARGIN, y - card_h, CONTENT_W, card_h, 16, fill=WHITE)
    c.setStrokeColor(TEAL); alpha(c, .12); c.setLineWidth(1)
    c.roundRect(MARGIN, y - card_h, CONTENT_W, card_h, 16, stroke=1, fill=0); end_alpha(c)

    col_split = CONTENT_W * 0.40
    left_x = MARGIN + 12
    right_x = MARGIN + col_split + 16

    # LEFT: radar
    if dim_scores:
        c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_LIGHT)
        c.drawString(left_x, y - 16, "DIMENSION PROFILE")
        draw_radar(c, dim_scores, left_x + 65, y - 90, R=55)

    # RIGHT: trait bars
    if dominant_traits:
        c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_LIGHT)
        c.drawString(right_x, y - 16, "DOMINANT TRAITS")
        draw_trait_bars(c, dominant_traits, right_x, y - 32,
                        bar_w=int(CONTENT_W * 0.52), bar_h=11, gap=7)

    # Suppression bar (bottom of card)
    if supp.get("has_suppression"):
        sx = right_x; sy = y - card_h + 14
        c.setFont("Helvetica-Bold", 7); c.setFillColor(ROSE)
        c.drawString(sx, sy + 12, f"SUPPRESSION SIGNAL  {supp.get('suppression_level',0)}/10")
        bar_w_s = int(CONTENT_W * 0.48)
        lvl = supp.get("suppression_level", 0)
        alpha(c, .15); c.setFillColor(ROSE)
        c.roundRect(sx, sy, bar_w_s, 8, 4, stroke=0, fill=1); end_alpha(c)
        fill_s = max(4, (lvl / 10) * bar_w_s)
        alpha(c, .75); c.setFillColor(ROSE)
        c.roundRect(sx, sy, fill_s, 8, 4, stroke=0, fill=1); end_alpha(c)

    return y - card_h - 16

# ── Career cards row ───────────────────────────────────────────────────────────

def draw_career_cards(c, careers, y, style_name):
    n = min(len(careers), 3)
    if not n: return y
    card_gap = 10; card_h = 112
    card_w = (CONTENT_W - card_gap * (n - 1)) / n
    if y - card_h < PAGE_FLOOR:
        y = do_page_break(c, style_name)
    for i, career in enumerate(careers[:n]):
        col  = CAREER_COLORS[i % len(CAREER_COLORS)]
        cx   = MARGIN + i * (card_w + card_gap)
        cy   = y - card_h
        # card bg + border
        rr(c, cx, cy, card_w, card_h, 10, fill=WHITE)
        c.setStrokeColor(col); alpha(c,.28); c.setLineWidth(1.5)
        c.roundRect(cx, cy, card_w, card_h, 10, stroke=1, fill=0); end_alpha(c)
        # top band
        c.setFillColor(col)
        c.roundRect(cx, cy + card_h - 52, card_w, 52, 10, stroke=0, fill=1)
        c.rect(cx, cy + card_h - 52, card_w, 26, stroke=0, fill=1)
        # domain
        c.setFont("Helvetica-Bold", 5.5); alpha(c,.7); c.setFillColor(WHITE)
        domain = (career.get("domain") or "")[:20].upper()
        c.drawString(cx + 8, cy + card_h - 15, domain); end_alpha(c)
        # name
        name = re.sub(r'\*\*?','', career.get("name") or "")
        words = name.split(); line1 = " ".join(words[:3]); line2 = " ".join(words[3:])
        c.setFont("Helvetica-Bold", 9); c.setFillColor(WHITE)
        c.drawString(cx + 8, cy + card_h - 29, line1[:22])
        if line2: c.drawString(cx + 8, cy + card_h - 40, line2[:22])
        # score
        stxt = f"{career.get('score',0)}%"
        sw_s = c.stringWidth(stxt, "Helvetica-Bold", 15)
        c.setFont("Helvetica-Bold", 15); c.setFillColor(WHITE)
        c.drawString(cx + card_w - sw_s - 8, cy + card_h - 44, stxt)
        # society role
        soc = re.sub(r'\*\*?','', career.get("society_role") or "")
        c.setFont("Helvetica", 6.5); c.setFillColor(INK_LIGHT)
        slines = safe_wrap(c, soc, "Helvetica", 6.5, card_w - 16)
        sy = cy + card_h - 64
        for sl in slines[:3]:
            c.drawString(cx + 8, sy, sl); sy -= 10
        # emerging
        if career.get("emerging"):
            rr(c, cx + 8, cy + 8, 62, 13, 6, fill=SKY_LIGHT)
            c.setFont("Helvetica-Bold", 5.5); c.setFillColor(SKY)
            c.drawString(cx + 14, cy + 12, "EMERGING")
    return y - card_h - 12

# ── Roadmap infographic ────────────────────────────────────────────────────────

def draw_roadmap_infographic(c, careers, y, style_name):
    """Reference-style road with numbered flags. Returns y below."""
    steps = careers[:4]; n = len(steps)
    if not n: return y
    infog_h = 130
    if y - infog_h < PAGE_FLOOR:
        y = do_page_break(c, style_name)
    step_w   = CONTENT_W / n
    road_y   = y - 60          # road centre
    lane_h   = 22
    rise     = 18              # road rises per step

    for i, step in enumerate(steps):
        col = ROAD_COLORS[i % len(ROAD_COLORS)]
        x0  = MARGIN + i * step_w
        x1  = MARGIN + (i + 1) * step_w
        y0  = road_y - i * rise
        y1  = road_y - (i + 1) * rise if i < n - 1 else y0

        # Road trapezoid
        half = lane_h / 2
        pts  = [x0, y0 - half, x1, y1 - half, x1, y1 + half, x0, y0 + half]
        path = c.beginPath()
        path.moveTo(pts[0], pts[1])
        path.lineTo(pts[2], pts[3])
        path.lineTo(pts[4], pts[5])
        path.lineTo(pts[6], pts[7])
        path.close()
        c.setFillColor(colors.HexColor("#CBD5DC"))
        c.drawPath(path, stroke=0, fill=1)

        # Dashed centre line
        seg_len = math.sqrt((x1 - x0)**2 + (y1 - y0)**2)
        nd = max(1, int(seg_len / 20))
        dx = (x1 - x0) / nd; dy = (y1 - y0) / nd
        c.setStrokeColor(WHITE); c.setLineWidth(1.8); c.saveState(); c.setDash(5, 4)
        for d in range(nd - 1):
            c.line(x0 + d*dx + dx*.25, y0 + d*dy, x0 + d*dx + dx*.65, y0 + d*dy + dy*.4)
        c.restoreState()

        # Flag pole + flag
        mid_x   = (x0 + x1) / 2
        mid_y   = (y0 + y1) / 2
        pole_base = mid_y - half
        pole_top  = pole_base - 36
        flag_top  = pole_top
        flag_bot  = pole_top + 18
        flag_tip  = mid_x + 22

        c.setStrokeColor(col); alpha(c,.75); c.setLineWidth(1.4); c.saveState(); c.setDash(3,2)
        c.line(mid_x, pole_base, mid_x, pole_top + 5); c.restoreState(); end_alpha(c)

        fpath = c.beginPath()
        fpath.moveTo(mid_x, flag_top)
        fpath.lineTo(flag_tip, (flag_top + flag_bot) / 2)
        fpath.lineTo(mid_x, flag_bot)
        fpath.close()
        c.setFillColor(col); c.drawPath(fpath, stroke=0, fill=1)

        # Step number
        num = f"0{i+1}"
        c.setFont("Helvetica-Bold", 16); c.setFillColor(col)
        nw = c.stringWidth(num, "Helvetica-Bold", 16)
        c.drawString(mid_x - nw/2 - 8, pole_top - 8, num)

    # Labels below road
    label_base = y - infog_h + 8
    for i, step in enumerate(steps):
        col  = ROAD_COLORS[i % len(ROAD_COLORS)]
        lx   = MARGIN + i * step_w + 8
        name = re.sub(r'\*\*?','', step.get("name") or f"Step {i+1}")[:24]
        c.setFont("Helvetica-Bold", 8.5); c.setFillColor(INK)
        # wrap name to step_w
        nlines = safe_wrap(c, name, "Helvetica-Bold", 8.5, step_w - 12)
        ly = label_base
        for nl in nlines[:2]:
            c.drawString(lx, ly, nl); ly -= 11
        c.setFont("Helvetica", 7.5); c.setFillColor(col)
        c.drawString(lx, ly - 2, f"{step.get('score',0)}% match")

    return y - infog_h - 12

# ── Pull-quote highlight box ───────────────────────────────────────────────────

def draw_pull_quote(c, text, x, y, w, accent, style_name):
    """First paragraph as italic pull-quote. Returns y below."""
    paras = [p.strip() for p in re.split(r'\n\n+', text) if p.strip()]
    if not paras: return y
    snippet = paras[0][:250]
    lines   = safe_wrap(c, snippet, "Helvetica-Oblique", 9.5, w - 26)
    box_h   = len(lines) * 14.5 + 22
    if y - box_h < PAGE_FLOOR:
        y = do_page_break(c, style_name)
    alpha(c, .08); c.setFillColor(accent)
    c.roundRect(x, y - box_h, w, box_h, 8, stroke=0, fill=1); end_alpha(c)
    c.setFillColor(accent)
    c.roundRect(x, y - box_h, 4, box_h, 2, stroke=0, fill=1)
    c.setFont("Helvetica-Oblique", 9.5); c.setFillColor(INK_MID)
    ty = y - 13
    for line in lines:
        c.drawString(x + 14, ty, line); ty -= 14.5
    return y - box_h - 10

# ── Skill chips ────────────────────────────────────────────────────────────────

def draw_chips(c, items, x, y, accent, max_w, style_name):
    chip_h, px, gap = 17, 10, 6
    row_x = x; row_y = y
    for item in items:
        label = item[:30] if isinstance(item, str) else item.get("label","")[:30]
        c.setFont("Helvetica-Bold", 7); tw = c.stringWidth(label, "Helvetica-Bold", 7)
        cw = tw + 2 * px
        if row_x + cw > x + max_w:
            row_x = x; row_y -= chip_h + gap
            if row_y < PAGE_FLOOR:
                row_y = do_page_break(c, style_name); row_x = x
        alpha(c,.12); c.setFillColor(accent)
        c.roundRect(row_x, row_y, cw, chip_h, chip_h/2, stroke=0, fill=1); end_alpha(c)
        c.setStrokeColor(accent); alpha(c,.3); c.setLineWidth(.8)
        c.roundRect(row_x, row_y, cw, chip_h, chip_h/2, stroke=1, fill=0); end_alpha(c)
        c.setFillColor(accent); c.drawString(row_x + px, row_y + 4, label)
        row_x += cw + gap
    return row_y - chip_h - 8

# ── Moderate career chips ──────────────────────────────────────────────────────

def draw_moderate_chips(c, moderate, x, y, max_w, style_name):
    if not moderate: return y
    c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_LIGHT)
    c.drawString(x, y, "ALSO WORTH EXPLORING")
    y -= 14
    chip_items = [f"{m.get('name','')[:16]}  {m.get('score','')}%" for m in moderate[:6]]
    return draw_chips(c, chip_items, x, y, PURPLE, max_w, "")

# ── Dark conclusion banner ─────────────────────────────────────────────────────

def draw_conclusion(c, body, y, style_name):
    paras = [p.strip() for p in re.split(r'\n\n+', body) if p.strip()]
    if not paras: return y
    # measure total height needed
    total_lines = sum(len(safe_wrap(c, p, "Helvetica-Oblique", 10, CONTENT_W - 48)) for p in paras)
    banner_h = min(total_lines * 16.5 + 80, H - MARGIN * 2 - 40)
    if y - banner_h < PAGE_FLOOR:
        y = do_page_break(c, style_name)
        # re-measure after page break
        banner_h = min(total_lines * 16.5 + 80, H - MARGIN * 2 - 40)
    by = y - banner_h
    c.setFillColor(INK); c.roundRect(MARGIN - 4, by, CONTENT_W + 8, banner_h, 14, stroke=0, fill=1)
    # orbs
    for ox, oy, r, col, a in [(MARGIN + 35, by + banner_h - 25, 75, TEAL, .12),
                               (MARGIN + CONTENT_W - 35, by + 25, 55, GOLD, .09)]:
        alpha(c, a); c.setFillColor(col); c.circle(ox, oy, r, stroke=0, fill=1); end_alpha(c)
    # star
    c.setFont("Helvetica-Bold", 18); c.setFillColor(TEAL_MID)
    c.drawCentredString(W/2, by + banner_h - 32, "*")
    c.setFont("Helvetica-Bold", 7); c.setFillColor(TEAL_MID)
    c.drawCentredString(W/2, by + banner_h - 48, "CONCLUSION")
    ty = by + banner_h - 66
    for para in paras:
        lines = safe_wrap(c, para, "Helvetica-Oblique", 10, CONTENT_W - 48)
        for line in lines:
            if ty < by + 12: break
            lw = c.stringWidth(line, "Helvetica-Oblique", 10)
            alpha(c, .88); c.setFont("Helvetica-Oblique", 10); c.setFillColor(WHITE)
            c.drawString(MARGIN + (CONTENT_W - lw)/2, ty, line); end_alpha(c)
            ty -= 16.5
        ty -= 6
    return by - 14

# ── Section parser ─────────────────────────────────────────────────────────────

def parse_sections(text):
    parts = re.split(r'(?m)^## ', text)
    out = []
    for part in parts:
        part = part.strip()
        if not part: continue
        nl   = part.find('\n')
        head = part[:nl].strip().lstrip('0123456789. ').strip() if nl != -1 else part
        body = part[nl+1:].strip() if nl != -1 else ''
        out.append({'heading': head, 'body': body})
    return out

def find_sec(sections, *keys):
    for s in sections:
        h = s['heading'].lower()
        if any(k in h for k in keys): return s
    return {'heading': '', 'body': ''}

# ── MAIN GENERATOR ─────────────────────────────────────────────────────────────

def generate_pdf(report_text: str, thinking_style: str, payload: dict = None) -> bytes:
    payload      = payload or {}
    buf          = io.BytesIO()
    top_careers  = payload.get('top_careers',    [])
    moderate     = payload.get('moderate_careers', [])
    dim_scores   = payload.get('dimension_scores', {})
    dominant     = payload.get('dominant_traits', [])
    supp         = payload.get('suppression',    {})
    secondary    = payload.get('thinking_style_secondary', '')
    sections     = parse_sections(report_text)

    who_sec   = find_sec(sections, 'who you are', 'who')
    hold_sec  = find_sec(sections, 'holding', 'back')
    world_sec = find_sec(sections, 'offer', 'world')
    car_sec   = find_sec(sections, 'careers suggested', 'career match')
    road_sec  = find_sec(sections, 'roadmap')
    edu_sec   = find_sec(sections, 'educational', 'pathway')
    skill_sec = find_sec(sections, 'skillset', 'skill')
    conc_sec  = find_sec(sections, 'conclusion', 'closing')

    style_name = thinking_style or "Your Profile"
    c = rl_canvas.Canvas(buf, pagesize=A4)
    c.setTitle("WDIG Aptitude Report")

    # ── PAGE 1: HERO + DIMENSION CARD ─────────────────────────────────────────
    y = draw_hero(c, thinking_style, secondary, top_careers, style_name)
    y = divider(c, y, TEAL_MID)
    y = draw_dimension_card(c, dim_scores, dominant, supp, y, style_name)
    y = divider(c, y)

    # ── WHO YOU ARE ────────────────────────────────────────────────────────────
    if who_sec['body']:
        if y < 160: y = do_page_break(c, style_name)
        y = section_header(c, y, who_sec['heading'] or "Who You Are", "W", TEAL, TEAL_LIGHT)
        y = draw_pull_quote(c, who_sec['body'], MARGIN, y, CONTENT_W, TEAL, style_name)
        rest = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', who_sec['body']) if p.strip()][1:])
        if rest:
            y = draw_section_body(c, rest, MARGIN, y, CONTENT_W, style_name)
        y -= 16

    # ── WHAT'S HOLDING YOU BACK ────────────────────────────────────────────────
    if hold_sec['body']:
        if y < 140: y = do_page_break(c, style_name)
        y = section_header(c, y, hold_sec['heading'] or "What's Holding You Back", "!", ROSE, ROSE_LIGHT)
        y = draw_pull_quote(c, hold_sec['body'], MARGIN, y, CONTENT_W, ROSE, style_name)
        rest = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', hold_sec['body']) if p.strip()][1:])
        if rest:
            y = draw_section_body(c, rest, MARGIN, y, CONTENT_W, style_name)
        y -= 16

    # ── PAGE 2: WHAT YOU OFFER + CAREERS ─────────────────────────────────────
    c.showPage(); y = draw_page_header(c, style_name); y -= 10

    if world_sec['body']:
        y = section_header(c, y, world_sec['heading'] or "What You Offer the World", "G", GOLD, GOLD_LIGHT)
        y = draw_pull_quote(c, world_sec['body'], MARGIN, y, CONTENT_W, GOLD, style_name)
        rest = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', world_sec['body']) if p.strip()][1:])
        if rest:
            y = draw_section_body(c, rest, MARGIN, y, CONTENT_W, style_name)
        y -= 16

    if top_careers:
        if y < 150: y = do_page_break(c, style_name)
        y = section_header(c, y, "Careers Suggested to You", "T", SKY, SKY_LIGHT)
        y = draw_career_cards(c, top_careers, y, style_name)
        if moderate:
            y = draw_moderate_chips(c, moderate, MARGIN, y, CONTENT_W, style_name)
            y -= 8
        if car_sec['body']:
            paras = [p.strip() for p in re.split(r'\n\n+', car_sec['body']) if p.strip()]
            for para in paras[:4]:
                if y < PAGE_FLOOR: y = do_page_break(c, style_name)
                y = draw_text_block(c, para, MARGIN, y, "Helvetica", BODY_SIZE,
                                    INK_MID, CONTENT_W, style_name=style_name)
                y -= 9
        y -= 16

    # ── PAGE 3: ROADMAP + EDUCATION ───────────────────────────────────────────
    c.showPage(); y = draw_page_header(c, style_name); y -= 10
    y = section_header(c, y, "Career Roadmap", "M", PURPLE, PURPLE_LIGHT)
    y = draw_roadmap_infographic(c, top_careers, y, style_name)
    y -= 8
    if road_sec['body']:
        y = draw_section_body(c, road_sec['body'], MARGIN, y, CONTENT_W, style_name)
    y = divider(c, y - 10, PURPLE)
    if edu_sec['body']:
        if y < 140: y = do_page_break(c, style_name)
        y = section_header(c, y, edu_sec['heading'] or "Educational Pathway", "D", TEAL, TEAL_LIGHT)
        y = draw_pull_quote(c, edu_sec['body'], MARGIN, y, CONTENT_W, TEAL, style_name)
        rest_edu = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', edu_sec['body']) if p.strip()][1:])
        if rest_edu:
            y = draw_section_body(c, rest_edu, MARGIN, y, CONTENT_W, style_name)
        y -= 16

    # ── PAGE 4: SKILLS + CONCLUSION ───────────────────────────────────────────
    c.showPage(); y = draw_page_header(c, style_name); y -= 10

    if skill_sec['body']:
        y = section_header(c, y, skill_sec['heading'] or "Skillset to Build", "Z", GOLD, GOLD_LIGHT)
        # Extract bullet-style lines for chips
        raw_lines = skill_sec['body'].split('\n')
        chip_items = []
        for l in raw_lines:
            l = l.strip().lstrip('-•*0123456789. ')
            if l and len(l) > 5:
                chip_items.append(l[:35])
        if chip_items:
            c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_LIGHT)
            c.drawString(MARGIN, y, "KEY SKILLS TO DEVELOP")
            y -= 14
            y = draw_chips(c, chip_items[:8], MARGIN, y, GOLD, CONTENT_W, style_name)
            y -= 6
        y = draw_section_body(c, skill_sec['body'], MARGIN, y, CONTENT_W, style_name)
        y -= 16

    y = divider(c, y, TEAL)

    # ── CONCLUSION ─────────────────────────────────────────────────────────────
    if conc_sec['body']:
        y = draw_conclusion(c, conc_sec['body'], y, style_name)

    # ── FOOTER ────────────────────────────────────────────────────────────────
    c.setStrokeColor(colors.HexColor("#E2EBF0")); c.setLineWidth(.5)
    c.line(MARGIN, 28, W - MARGIN, 28)
    c.setFont("Helvetica", 7); c.setFillColor(INK_LIGHT)
    ft = "Generated by WDIG Career Guidance  ·  Confidential  ·  For personal use only"
    c.drawCentredString(W/2, 16, ft)

    c.save()
    buf.seek(0)
    return buf.read()

# ── Flask ──────────────────────────────────────────────────────────────────────
app = Flask(__name__)

@app.route("/generate-pdf", methods=["POST"])
def generate_pdf_endpoint():
    try:
        data = request.get_json()
        report_text    = data.get("report", "")
        thinking_style = data.get("thinking_style_primary", "Your Profile")
        if not report_text:
            return jsonify({"error": "report text required"}), 400
        pdf_bytes = generate_pdf(report_text, thinking_style, payload=data)
        return send_file(io.BytesIO(pdf_bytes), mimetype="application/pdf",
                         as_attachment=True, download_name="wdig-report.pdf")
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/health")
def health():
    return jsonify({"status": "ok", "version": "7.0"})

if __name__ == "__main__":
    print("WDIG PDF Generator v7.0 on port 8000")
    app.run(port=8000, debug=False)