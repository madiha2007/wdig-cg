"""
WDIG PDF Report Generator v10.0 — Ethereal Light Theme
Design: NO solid dark fills anywhere. Only soft washes, gentle tints,
delicate borders, refined ink-on-cream typography.
Editorial magazine aesthetic on warm cotton paper.
"""

from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
import io, re, math

# ─────────────────────────────────────────────────────────────────────────────
# PALETTE — soft washes only, never heavy fills
# ─────────────────────────────────────────────────────────────────────────────
PAGE_BG     = colors.HexColor("#FDFCF9")   # warm off-white
WARM_WHITE  = colors.HexColor("#FFFFFF")
GHOST       = colors.HexColor("#F8F7F3")   # subtle card bg
PARCHMENT   = colors.HexColor("#F3EDE3")   # warm tinted section

# Text — never pure black, always slightly warm/cool
INK         = colors.HexColor("#1E2230")   # headline
INK_MID     = colors.HexColor("#3A4055")   # body
INK_SOFT    = colors.HexColor("#6B7280")   # secondary
INK_FAINT   = colors.HexColor("#A0A8B8")   # captions

# Teal
TEAL_INK    = colors.HexColor("#0D7A6B")
TEAL_MID    = colors.HexColor("#12A88E")
TEAL_WASH   = colors.HexColor("#EBF8F5")
TEAL_TINT   = colors.HexColor("#CBF0E8")

# Gold
GOLD_INK    = colors.HexColor("#9C6B0E")
GOLD_WASH   = colors.HexColor("#FBF4E4")
GOLD_TINT   = colors.HexColor("#F2DFA8")

# Rose
ROSE_INK    = colors.HexColor("#9B3A50")
ROSE_WASH   = colors.HexColor("#FDF0F3")
ROSE_TINT   = colors.HexColor("#F5C8D5")

# Sky
SKY_INK     = colors.HexColor("#1A5A8A")
SKY_WASH    = colors.HexColor("#EBF4FB")
SKY_TINT    = colors.HexColor("#BEDDF5")

# Plum
PLUM_INK    = colors.HexColor("#4A3490")
PLUM_WASH   = colors.HexColor("#F2EEFA")
PLUM_TINT   = colors.HexColor("#CEBFEC")

# Career themes: (ink, wash, tint)
CAREER_THEMES = [
    (TEAL_INK, TEAL_WASH, TEAL_TINT),
    (SKY_INK,  SKY_WASH,  SKY_TINT),
    (PLUM_INK, PLUM_WASH, PLUM_TINT),
    (GOLD_INK, GOLD_WASH, GOLD_TINT),
    (ROSE_INK, ROSE_WASH, ROSE_TINT),
]

W, H    = A4
MARGIN  = 44
CW      = W - 2 * MARGIN
LINE_H  = 15.0
BODY_SZ = 9.4
FLOOR   = 70


# ─────────────────────────────────────────────────────────────────────────────
# LOW-LEVEL HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def _clean(text):
    t = re.sub(r'\*\*(.+?)\*\*', r'\1', text or "")
    return re.sub(r'\*(.+?)\*', r'\1', t).strip()

def wrap(c, text, font, size, max_w):
    words = _clean(text).split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip() if cur else w
        if c.stringWidth(test, font, size) <= max_w:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines or [""]

def hairline(c, x1, y1, x2, y2, col=None, lw=0.4):
    col = col or colors.HexColor("#E0DDD6")
    c.setStrokeColor(col)
    c.setLineWidth(lw)
    c.line(x1, y1, x2, y2)

def dot(c, x, y, r, col):
    c.setFillColor(col)
    c.circle(x, y, r, stroke=0, fill=1)

def filled_rr(c, x, y, w, h, r, fill_col, alpha=1.0):
    c.saveState()
    c.setFillColor(fill_col)
    c.setFillAlpha(alpha)
    c.roundRect(x, y, w, h, r, stroke=0, fill=1)
    c.restoreState()

def stroked_rr(c, x, y, w, h, r, stroke_col, lw=0.7):
    c.saveState()
    c.setStrokeColor(stroke_col)
    c.setLineWidth(lw)
    c.roundRect(x, y, w, h, r, stroke=1, fill=0)
    c.restoreState()

def card(c, x, y, w, h, r=12, bg=None, border=None, border_alpha=0.35):
    """Draw a light-theme card: ghost background + hairline border."""
    bg = bg or WARM_WHITE
    filled_rr(c, x, y, w, h, r, bg)
    if border:
        c.saveState()
        c.setStrokeColor(border)
        c.setStrokeAlpha(border_alpha)
        c.setLineWidth(0.7)
        c.roundRect(x, y, w, h, r, stroke=1, fill=0)
        c.restoreState()


# ─────────────────────────────────────────────────────────────────────────────
# PAGE FRAME
# ─────────────────────────────────────────────────────────────────────────────

def _page_bg(c):
    c.setFillColor(PAGE_BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    # Subtle warm vignette corners (very light parchment dots)
    for (cx, cy), size, alpha in [
        ((0, H), 120, 0.06), ((W, 0), 90, 0.04)
    ]:
        c.saveState()
        c.setFillColor(GOLD_INK)
        c.setFillAlpha(alpha)
        c.circle(cx, cy, size, stroke=0, fill=1)
        c.restoreState()

def draw_header(c, style_name):
    filled_rr(c, 0, H - 36, W, 36, 0, WARM_WHITE)
    # Teal hairline at very top
    c.saveState()
    c.setFillColor(TEAL_INK)
    c.setFillAlpha(0.45)
    c.rect(0, H - 37, W, 1.5, stroke=0, fill=1)
    c.restoreState()
    # Gold dot accent
    c.saveState()
    c.setFillColor(GOLD_INK)
    c.setFillAlpha(0.5)
    c.circle(MARGIN - 12, H - 18, 2, stroke=0, fill=1)
    c.restoreState()

    c.setFont("Helvetica-Bold", 6.2)
    c.setFillColor(TEAL_INK)
    c.drawString(MARGIN, H - 22, "W D I G  ·  APTITUDE REPORT")
    c.setFont("Helvetica", 6.2)
    c.setFillColor(INK_FAINT)
    c.drawRightString(W - MARGIN, H - 22, style_name[:58])
    return H - 52

def draw_footer(c, page_num):
    c.saveState()
    c.setStrokeColor(colors.HexColor("#E4E1D8"))
    c.setLineWidth(0.5)
    c.line(MARGIN, 34, W - MARGIN, 34)
    c.restoreStore = None
    c.restoreState()
    c.setFont("Helvetica", 6)
    c.setFillColor(INK_FAINT)
    c.drawCentredString(W / 2, 21, "WDIG Career Guidance  ·  Confidential  ·  For personal use only")
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(TEAL_INK)
    c.drawRightString(W - MARGIN, 21, str(page_num))

def new_page(c, style_name):
    c.showPage()
    _page_bg(c)
    return draw_header(c, style_name)


# ─────────────────────────────────────────────────────────────────────────────
# TEXT PRIMITIVES
# ─────────────────────────────────────────────────────────────────────────────

def draw_block(c, text, x, y, font, size, col, max_w,
               leading=LINE_H, style_name="", indent=0):
    lines = wrap(c, text, font, size, max_w - indent)
    c.setFont(font, size)
    c.setFillColor(col)
    for line in lines:
        if y < FLOOR:
            y = new_page(c, style_name)
            c.setFont(font, size)
            c.setFillColor(col)
        c.drawString(x + indent, y, line)
        y -= leading
    return y

def draw_body(c, body_text, x, y, max_w, style_name, col=None):
    col = col or INK_MID
    paras = [p.strip() for p in re.split(r'\n\n+', body_text) if p.strip()]
    for para in paras:
        if y - LINE_H * 2 < FLOOR:
            y = new_page(c, style_name)
        y = draw_block(c, para, x, y, "Helvetica", BODY_SZ, col, max_w,
                       style_name=style_name)
        y -= 8
    return y


# ─────────────────────────────────────────────────────────────────────────────
# SECTION HEADER — light wash band, colored ink title, no solid fill
# ─────────────────────────────────────────────────────────────────────────────

def section_head(c, y, title, accent_ink, wash, x=None, w=None):
    x = x if x is not None else MARGIN
    w = w if w is not None else CW
    h = 42
    if y - h < FLOOR:
        return y

    # Wash background
    filled_rr(c, x, y - h, w, h, 10, wash)
    # Thin left accent stroke (not fill — just a line)
    c.saveState()
    c.setStrokeColor(accent_ink)
    c.setStrokeAlpha(0.65)
    c.setLineWidth(2.5)
    c.line(x + 3.5, y - h + 6, x + 3.5, y - 6)
    c.restoreState()

    # Title in accent ink
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(accent_ink)
    c.drawString(x + 18, y - h + 14, title)

    # Decorative dots at right
    for i, alpha in enumerate([0.5, 0.3, 0.15]):
        c.saveState()
        c.setFillColor(accent_ink)
        c.setFillAlpha(alpha)
        c.circle(x + w - 18 - i * 10, y - h / 2, 3 - i * 0.5, stroke=0, fill=1)
        c.restoreState()

    return y - h - 12


def thin_rule(c, y, col=None):
    col = col or colors.HexColor("#E4E1D8")
    hairline(c, MARGIN, y, MARGIN + CW, y, col, 0.5)
    # Two tiny dots at center
    cx = MARGIN + CW / 2
    dot(c, cx - 6, y, 1.5, col)
    dot(c, cx, y, 1.5, col)
    dot(c, cx + 6, y, 1.5, col)
    return y - 12


# ─────────────────────────────────────────────────────────────────────────────
# PULL QUOTE — italic block on tinted wash
# ─────────────────────────────────────────────────────────────────────────────

def pull_quote(c, text, x, y, w, accent_ink, tint, style_name):
    paras = [p.strip() for p in re.split(r'\n\n+', text) if p.strip()]
    if not paras: return y
    snippet = paras[0][:240]
    lines = wrap(c, snippet, "Helvetica-Oblique", 10.5, w - 32)
    bh = len(lines) * 15 + 28
    if y - bh < FLOOR:
        y = new_page(c, style_name)

    # Light tint background
    filled_rr(c, x, y - bh, w, bh, 8, tint, alpha=0.55)
    # Left vertical line (not solid bar)
    c.saveState()
    c.setStrokeColor(accent_ink)
    c.setStrokeAlpha(0.5)
    c.setLineWidth(2)
    c.line(x + 4, y - bh + 8, x + 4, y - 8)
    c.restoreState()
    # Quotation mark glyph (very faint)
    c.saveState()
    c.setFont("Helvetica-Bold", 38)
    c.setFillColor(accent_ink)
    c.setFillAlpha(0.09)
    c.drawString(x + 12, y - 28, "\u201c")
    c.restoreState()

    c.setFont("Helvetica-Oblique", 10.5)
    c.setFillColor(INK_MID)
    ty = y - 14
    for line in lines:
        c.drawString(x + 20, ty, line)
        ty -= 15
    return y - bh - 14


# ─────────────────────────────────────────────────────────────────────────────
# COVER PAGE — all light, no dark backgrounds
# ─────────────────────────────────────────────────────────────────────────────

def draw_cover(c, thinking_style, secondary, top_careers, style_name):
    _page_bg(c)

    # ── Decorative geometric wash shapes ────────────────────────────────────
    # Large teal circle, top-right, very faint
    c.saveState()
    c.setFillColor(TEAL_INK)
    c.setFillAlpha(0.05)
    c.circle(W - MARGIN + 20, H - 80, 170, stroke=0, fill=1)
    c.restoreState()
    # Gold circle, bottom-left
    c.saveState()
    c.setFillColor(GOLD_INK)
    c.setFillAlpha(0.04)
    c.circle(MARGIN - 30, 120, 130, stroke=0, fill=1)
    c.restoreState()
    # Rose hint, mid-left
    c.saveState()
    c.setFillColor(ROSE_INK)
    c.setFillAlpha(0.03)
    c.circle(MARGIN - 20, H * 0.55, 90, stroke=0, fill=1)
    c.restoreState()

    # ── Top header band: ultra-thin teal wash ───────────────────────────────
    filled_rr(c, 0, H - 48, W, 48, 0, TEAL_WASH)
    c.saveState()
    c.setFillColor(TEAL_INK)
    c.setFillAlpha(0.35)
    c.rect(0, H - 49, W, 1.2, stroke=0, fill=1)
    c.restoreState()

    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(TEAL_INK)
    c.drawString(MARGIN, H - 28, "W D I G")
    c.setFont("Helvetica", 7)
    c.setFillColor(INK_SOFT)
    c.drawString(MARGIN + 48, H - 28, "CAREER GUIDANCE")

    # Report label chip
    chip_w = 104
    filled_rr(c, W - MARGIN - chip_w, H - 38, chip_w, 20, 10, TEAL_TINT)
    c.saveState()
    c.setStrokeColor(TEAL_INK)
    c.setStrokeAlpha(0.3)
    c.setLineWidth(0.6)
    c.roundRect(W - MARGIN - chip_w, H - 38, chip_w, 20, 10, stroke=1, fill=0)
    c.restoreState()
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(TEAL_INK)
    c.drawCentredString(W - MARGIN - chip_w / 2, H - 30, "APTITUDE REPORT")

    # ── Main title area ──────────────────────────────────────────────────────
    title_y = H - 140
    title = thinking_style or "Your Profile"

    # Label above title
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(TEAL_MID)
    c.drawString(MARGIN, title_y + 20, "YOUR THINKING STYLE")
    # Short rule
    c.saveState()
    c.setStrokeColor(TEAL_MID)
    c.setStrokeAlpha(0.5)
    c.setLineWidth(1)
    c.line(MARGIN, title_y + 14, MARGIN + 130, title_y + 14)
    c.restoreState()

    # Title text in deep ink (no background)
    words = title.split()
    fs = 30 if len(title) < 26 else 22 if len(title) < 40 else 18
    c.setFont("Helvetica-Bold", fs)
    c.setFillColor(INK)
    l1 = " ".join(words[:3])
    l2 = " ".join(words[3:])
    c.drawString(MARGIN, title_y - 8, l1)
    if l2:
        c.drawString(MARGIN, title_y - 8 - fs - 5, l2)

    # Decorative thin underline
    title_bot = title_y - 8 - (fs + 5 if l2 else 0) - 8
    c.saveState()
    c.setStrokeColor(TEAL_INK)
    c.setStrokeAlpha(0.2)
    c.setLineWidth(1)
    c.line(MARGIN, title_bot, MARGIN + CW * 0.55, title_bot)
    c.restoreState()

    # Secondary badge
    badge_y = title_bot - 20
    if secondary:
        bw = min(220, c.stringWidth(secondary, "Helvetica", 9.5) + 40)
        filled_rr(c, MARGIN, badge_y, bw, 22, 11, GHOST)
        c.saveState()
        c.setStrokeColor(INK_FAINT)
        c.setLineWidth(0.5)
        c.roundRect(MARGIN, badge_y, bw, 22, 11, stroke=1, fill=0)
        c.restoreState()
        c.setFont("Helvetica-Bold", 6)
        c.setFillColor(TEAL_MID)
        c.drawString(MARGIN + 10, badge_y + 8, "ALSO")
        c.setFont("Helvetica", 9.5)
        c.setFillColor(INK_MID)
        c.drawString(MARGIN + 38, badge_y + 7, secondary[:38])
        badge_y -= 34
    else:
        badge_y -= 14

    # ── Top-career chips ─────────────────────────────────────────────────────
    chip_x = MARGIN
    for i, career in enumerate(top_careers[:3]):
        ink, wash, tint = CAREER_THEMES[i]
        name = (career.get("name") or "")[:20]
        score = career.get("score", 0)
        cw = min(175, c.stringWidth(f"{name}  {score}%", "Helvetica-Bold", 8) + 28)
        filled_rr(c, chip_x, badge_y, cw, 24, 12, tint, alpha=0.7)
        c.saveState()
        c.setStrokeColor(ink)
        c.setStrokeAlpha(0.35)
        c.setLineWidth(0.7)
        c.roundRect(chip_x, badge_y, cw, 24, 12, stroke=1, fill=0)
        c.restoreState()
        dot(c, chip_x + 12, badge_y + 12, 3.5, ink)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(INK_MID)
        c.drawString(chip_x + 22, badge_y + 8, name)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(ink)
        c.drawRightString(chip_x + cw - 8, badge_y + 8, f"{score}%")
        chip_x += cw + 8

    # ── Stats ribbon ─────────────────────────────────────────────────────────
    ribbon_y = 160
    ribbon_h = 62
    # Light ghost card
    filled_rr(c, MARGIN, ribbon_y, CW, ribbon_h, 14, WARM_WHITE)
    c.saveState()
    c.setStrokeColor(colors.HexColor("#E0DDD6"))
    c.setLineWidth(0.6)
    c.roundRect(MARGIN, ribbon_y, CW, ribbon_h, 14, stroke=1, fill=0)
    c.restoreState()
    # Top tint strip
    filled_rr(c, MARGIN, ribbon_y + ribbon_h - 6, CW, 6, 0, TEAL_TINT, alpha=0.5)
    c.saveState()
    c.setFillColor(TEAL_WASH)
    c.roundRect(MARGIN, ribbon_y + ribbon_h - 14, CW, 14, 0, stroke=0, fill=1)
    c.rect(MARGIN, ribbon_y + ribbon_h - 14, CW, 7, stroke=0, fill=1)
    c.restoreState()

    stats = [
        ("Thinking Style", (thinking_style or "—").split()[:3]),
        ("Top Career",     [(top_careers[0]["name"] if top_careers else "—")]),
        ("Match Score",    [f"{top_careers[0].get('score','—')}%"] if top_careers else ["—"]),
        ("Dimensions",     ["6 analysed"]),
    ]
    cell_w = CW / 4
    for i, (label, vals) in enumerate(stats):
        sx = MARGIN + i * cell_w
        if i > 0:
            c.saveState()
            c.setStrokeColor(colors.HexColor("#ECEAE4"))
            c.setLineWidth(0.5)
            c.line(sx, ribbon_y + 10, sx, ribbon_y + ribbon_h - 18)
            c.restoreState()
        c.setFont("Helvetica-Bold", 5.5)
        c.setFillColor(INK_FAINT)
        c.drawString(sx + 12, ribbon_y + ribbon_h - 12, label.upper())
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(INK)
        c.drawString(sx + 12, ribbon_y + 20, " ".join(vals)[:22])
        dot(c, sx + 6, ribbon_y + 23, 2, TEAL_INK)

    # ── Bottom accent ─────────────────────────────────────────────────────────
    c.setFont("Helvetica", 7)
    c.setFillColor(INK_FAINT)
    c.drawCentredString(W / 2, 36, "Confidential  ·  For personal use only")
    hairline(c, MARGIN, 46, W - MARGIN, 46, colors.HexColor("#E4E1D8"))

    return ribbon_y - 22


# ─────────────────────────────────────────────────────────────────────────────
# RADAR CHART — uses only light fills and ink-colored strokes
# ─────────────────────────────────────────────────────────────────────────────

def draw_radar(c, scores, cx, cy, R=54):
    items = list(scores.items()); n = len(items)
    if not n: return

    def pt(i, frac):
        a = (math.pi * 2 * i / n) - math.pi / 2
        return cx + frac * R * math.cos(a), cy + frac * R * math.sin(a)

    # Grid rings — very light
    for lvl in [.25, .5, .75, 1.0]:
        pts = [pt(i, lvl) for i in range(n)]
        path = c.beginPath()
        path.moveTo(*pts[0])
        for p in pts[1:]: path.lineTo(*p)
        path.close()
        c.saveState()
        c.setStrokeColor(TEAL_INK if lvl == 1.0 else colors.HexColor("#D0D8DC"))
        c.setStrokeAlpha(0.3 if lvl == 1.0 else 0.4)
        c.setLineWidth(0.55)
        c.drawPath(path, stroke=1, fill=0)
        c.restoreState()

    # Spokes
    for i in range(n):
        ex, ey = pt(i, 1.0)
        c.saveState()
        c.setStrokeColor(colors.HexColor("#CACFD8"))
        c.setLineWidth(0.4)
        c.line(cx, cy, ex, ey)
        c.restoreState()

    # Data fill — teal wash, not solid
    data_pts = [pt(i, items[i][1] / 100.0) for i in range(n)]
    path = c.beginPath()
    path.moveTo(*data_pts[0])
    for p in data_pts[1:]: path.lineTo(*p)
    path.close()
    c.saveState()
    c.setFillColor(TEAL_INK)
    c.setFillAlpha(0.10)
    c.setStrokeColor(TEAL_INK)
    c.setStrokeAlpha(0.55)
    c.setLineWidth(1.5)
    c.drawPath(path, stroke=1, fill=1)
    c.restoreState()

    # Data point circles — white center + teal ring
    for px, py in data_pts:
        c.setFillColor(WARM_WHITE)
        c.circle(px, py, 3.8, stroke=0, fill=1)
        c.saveState()
        c.setStrokeColor(TEAL_INK)
        c.setStrokeAlpha(0.7)
        c.setLineWidth(1.2)
        c.circle(px, py, 3.2, stroke=1, fill=0)
        c.restoreState()

    # Labels
    c.setFont("Helvetica-Bold", 6)
    c.setFillColor(INK_SOFT)
    for i, (dim, val) in enumerate(items):
        lx, ly = pt(i, 1.35)
        lbl = dim[:5].upper()
        c.drawString(lx - c.stringWidth(lbl, "Helvetica-Bold", 6) / 2, ly - 2.5, lbl)


# ─────────────────────────────────────────────────────────────────────────────
# TRAIT BARS — light track, tinted fill, colored score label
# ─────────────────────────────────────────────────────────────────────────────

def draw_trait_bars(c, traits, x, y, bar_w=165, bar_h=9, gap=10):
    for i, trait in enumerate(traits[:6]):
        ink, wash, tint = CAREER_THEMES[i % len(CAREER_THEMES)]
        label = _clean(trait.get("label", trait.get("trait", "")))[:26]
        score = trait.get("score", 0)

        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(INK_MID)
        c.drawString(x, y + 2, label)

        # Track (very light)
        filled_rr(c, x + 118, y, bar_w, bar_h, bar_h / 2, tint, alpha=0.5)
        # Fill (tinted, not solid)
        fill_w = max(bar_h, (score / 100) * bar_w)
        filled_rr(c, x + 118, y, fill_w, bar_h, bar_h / 2, ink, alpha=0.55)

        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(ink)
        c.drawString(x + 118 + bar_w + 5, y + 1.5, f"{score}%")
        y -= bar_h + gap
    return y


# ─────────────────────────────────────────────────────────────────────────────
# DIMENSION PROFILE CARD
# ─────────────────────────────────────────────────────────────────────────────

def draw_dimension_card(c, dim_scores, dominant_traits, supp, y, style_name):
    if not dim_scores and not dominant_traits: return y
    card_h = 175
    if y - card_h < FLOOR: y = new_page(c, style_name)

    card(c, MARGIN, y - card_h, CW, card_h, r=14,
         bg=WARM_WHITE, border=TEAL_INK)

    # Very soft teal header tint
    filled_rr(c, MARGIN, y - 30, CW, 30, 0, TEAL_WASH, alpha=0.6)
    c.saveState()
    c.setFillColor(TEAL_WASH)
    c.roundRect(MARGIN, y - card_h, CW, card_h, 14, stroke=0, fill=1)
    c.restoreState()
    card(c, MARGIN, y - card_h, CW, card_h, r=14, bg=WARM_WHITE, border=TEAL_INK)
    filled_rr(c, MARGIN, y - 30, CW, 30, 0, TEAL_WASH, alpha=0.65)

    lx = MARGIN + 14
    rx = MARGIN + CW * 0.43 + 12

    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(TEAL_INK)
    if dim_scores:   c.drawString(lx, y - 20, "DIMENSION PROFILE")
    if dominant_traits: c.drawString(rx, y - 20, "DOMINANT TRAITS")

    # Vertical divider if both present
    if dim_scores and dominant_traits:
        hairline(c, MARGIN + CW * 0.43, y - card_h + 12,
                 MARGIN + CW * 0.43, y - 34,
                 colors.HexColor("#E4E1D8"), 0.5)

    if dim_scores:
        draw_radar(c, dim_scores, lx + 68, y - 98, R=58)

    if dominant_traits:
        draw_trait_bars(c, dominant_traits, rx, y - 44,
                        bar_w=int(CW * 0.48), bar_h=9, gap=9)

    if supp.get("has_suppression"):
        sx = rx; sy = y - card_h + 18
        lvl = supp.get("suppression_level", 0)
        c.setFont("Helvetica-Bold", 6.5)
        c.setFillColor(ROSE_INK)
        c.drawString(sx, sy + 11, f"SUPPRESSION SIGNAL  —  {lvl}/10")
        bw = int(CW * 0.48)
        filled_rr(c, sx, sy, bw, 8, 4, ROSE_TINT, alpha=0.5)
        filled_rr(c, sx, sy, max(4, (lvl / 10) * bw), 8, 4, ROSE_INK, alpha=0.5)

    return y - card_h - 18


# ─────────────────────────────────────────────────────────────────────────────
# CAREER CARDS — wash backgrounds, score in ink, no solid color headers
# ─────────────────────────────────────────────────────────────────────────────

def draw_career_cards(c, careers, y, style_name):
    n = min(len(careers), 3)
    if not n: return y
    gap = 10
    cw = (CW - gap * (n - 1)) / n
    card_h = 124
    if y - card_h < FLOOR: y = new_page(c, style_name)

    for i, career in enumerate(careers[:n]):
        ink, wash, tint = CAREER_THEMES[i]
        cx = MARGIN + i * (cw + gap)
        cy = y - card_h

        # Card base — white with tinted border
        card(c, cx, cy, cw, card_h, r=12, bg=WARM_WHITE, border=ink)

        # Soft wash header (no solid fill!)
        filled_rr(c, cx, cy + card_h - 52, cw, 52, 12, wash)
        c.saveState()
        c.setFillColor(wash)
        c.rect(cx, cy + card_h - 52, cw, 26, stroke=0, fill=1)
        c.restoreState()

        # Domain
        domain = (career.get("domain") or "")[:22].upper()
        c.setFont("Helvetica-Bold", 5.5)
        c.setFillColor(ink)
        c.saveState(); c.setFillAlpha(0.7)
        c.drawString(cx + 10, cy + card_h - 14, domain)
        c.restoreState()

        # Career name in ink (not white on solid)
        name = _clean(career.get("name") or "")
        words = name.split()
        l1 = " ".join(words[:3]); l2 = " ".join(words[3:])
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(INK)
        c.drawString(cx + 10, cy + card_h - 28, l1[:22])
        if l2: c.drawString(cx + 10, cy + card_h - 40, l2[:22])

        # Score in accent ink
        stxt = f"{career.get('score', 0)}%"
        c.setFont("Helvetica-Bold", 16)
        c.setFillColor(ink)
        c.drawRightString(cx + cw - 10, cy + card_h - 46, stxt)

        # Rank badge — tinted chip, not solid
        badges = ["1ST", "2ND", "3RD"]
        if i < 3:
            bw = 28
            filled_rr(c, cx + cw - bw - 8, cy + card_h - 17, bw, 13, 6, tint, alpha=0.8)
            c.setFont("Helvetica-Bold", 6)
            c.setFillColor(ink)
            c.drawCentredString(cx + cw - 8 - bw / 2, cy + card_h - 10, badges[i])

        # Society role — body text
        soc = _clean(career.get("society_role") or "")
        c.setFont("Helvetica", 6.8)
        c.setFillColor(INK_SOFT)
        sy = cy + card_h - 64
        for sl in wrap(c, soc, "Helvetica", 6.8, cw - 20)[:3]:
            c.drawString(cx + 10, sy, sl); sy -= 10

        # Emerging badge
        if career.get("emerging"):
            filled_rr(c, cx + 10, cy + 9, 62, 13, 6, SKY_TINT, alpha=0.8)
            c.setFont("Helvetica-Bold", 5.5)
            c.setFillColor(SKY_INK)
            c.drawString(cx + 17, cy + 13, "EMERGING")

    return y - card_h - 14


# ─────────────────────────────────────────────────────────────────────────────
# ROADMAP — light road, tinted flags, ink labels
# ─────────────────────────────────────────────────────────────────────────────

def draw_roadmap(c, careers, y, style_name):
    steps = careers[:4]; n = len(steps)
    if not n: return y
    infog_h = 138
    if y - infog_h < FLOOR: y = new_page(c, style_name)

    step_w = CW / n
    road_y = y - 64
    lane_h = 22
    rise = 18

    for i, step in enumerate(steps):
        ink, wash, tint = CAREER_THEMES[i]
        x0 = MARGIN + i * step_w
        x1 = MARGIN + (i + 1) * step_w
        y0 = road_y - i * rise
        y1 = road_y - (i + 1) * rise if i < n - 1 else y0
        half = lane_h / 2

        # Road — soft parchment fill
        pts = [x0, y0 - half, x1, y1 - half, x1, y1 + half, x0, y0 + half]
        path = c.beginPath()
        path.moveTo(pts[0], pts[1]); path.lineTo(pts[2], pts[3])
        path.lineTo(pts[4], pts[5]); path.lineTo(pts[6], pts[7])
        path.close()
        c.setFillColor(colors.HexColor("#E8E4DC"))
        c.drawPath(path, stroke=0, fill=1)
        c.saveState()
        c.setStrokeColor(colors.HexColor("#D0CBBF"))
        c.setLineWidth(0.5)
        c.drawPath(path, stroke=1, fill=0)
        c.restoreState()

        # Dashes in warm white
        seg_len = math.sqrt((x1-x0)**2 + (y1-y0)**2)
        nd = max(1, int(seg_len / 20))
        dx = (x1-x0)/nd; dy = (y1-y0)/nd
        c.saveState()
        c.setStrokeColor(WARM_WHITE)
        c.setLineWidth(1.5)
        for d in range(nd - 1):
            c.line(x0 + d*dx + dx*.2, y0 + d*dy,
                   x0 + d*dx + dx*.65, y0 + d*dy + dy*.4)
        c.restoreState()

        # Flag pole — dashed, in ink color
        mid_x = (x0 + x1) / 2; mid_y = (y0 + y1) / 2
        pole_bot = mid_y - half; pole_top = pole_bot - 36
        c.saveState()
        c.setStrokeColor(ink)
        c.setStrokeAlpha(0.6)
        c.setLineWidth(1.1)
        c.setDash(3, 2)
        c.line(mid_x, pole_bot, mid_x, pole_top + 5)
        c.restoreState()

        # Flag — tinted fill, ink stroke
        fpath = c.beginPath()
        fpath.moveTo(mid_x, pole_top)
        fpath.lineTo(mid_x + 22, (pole_top + pole_top + 18) / 2)
        fpath.lineTo(mid_x, pole_top + 18)
        fpath.close()
        c.saveState()
        c.setFillColor(tint)
        c.setFillAlpha(0.9)
        c.setStrokeColor(ink)
        c.setStrokeAlpha(0.5)
        c.setLineWidth(0.6)
        c.drawPath(fpath, stroke=1, fill=1)
        c.restoreState()

        # Step number
        num = f"0{i+1}"
        c.setFont("Helvetica-Bold", 15)
        c.setFillColor(ink)
        nw = c.stringWidth(num, "Helvetica-Bold", 15)
        c.drawString(mid_x - nw/2 - 8, pole_top - 8, num)

    # Label cards
    label_y = y - infog_h + 12
    lcard_w = step_w - 8
    for i, step in enumerate(steps):
        ink, wash, tint = CAREER_THEMES[i]
        lx = MARGIN + i * step_w + 4
        filled_rr(c, lx, label_y, lcard_w, 26, 7, wash)
        c.saveState()
        c.setStrokeColor(ink)
        c.setStrokeAlpha(0.3)
        c.setLineWidth(0.6)
        c.roundRect(lx, label_y, lcard_w, 26, 7, stroke=1, fill=0)
        c.restoreState()
        name = _clean(step.get("name") or f"Step {i+1}")[:22]
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(INK)
        c.drawString(lx + 8, label_y + 14, name)
        c.setFont("Helvetica", 7)
        c.setFillColor(ink)
        c.drawString(lx + 8, label_y + 5, f"{step.get('score', 0)}% match")

    return y - infog_h - 12


# ─────────────────────────────────────────────────────────────────────────────
# SKILL CHIPS
# ─────────────────────────────────────────────────────────────────────────────

def draw_chips(c, items, x, y, ink, tint, max_w, style_name):
    chip_h = 18; px = 10; gap = 6
    row_x = x; row_y = y
    for item in items:
        label = (item[:34] if isinstance(item, str) else item.get("label", "")[:34])
        c.setFont("Helvetica-Bold", 7.5)
        tw = c.stringWidth(label, "Helvetica-Bold", 7.5)
        cw = tw + 2 * px
        if row_x + cw > x + max_w:
            row_x = x; row_y -= chip_h + gap
            if row_y < FLOOR:
                row_y = new_page(c, style_name); row_x = x
        filled_rr(c, row_x, row_y, cw, chip_h, chip_h/2, tint, alpha=0.7)
        c.saveState()
        c.setStrokeColor(ink); c.setStrokeAlpha(0.35); c.setLineWidth(0.6)
        c.roundRect(row_x, row_y, cw, chip_h, chip_h/2, stroke=1, fill=0)
        c.restoreState()
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(ink)
        c.drawString(row_x + px, row_y + 4.5, label)
        row_x += cw + gap
    return row_y - chip_h - 8


def draw_moderate(c, moderate, x, y, max_w, style_name):
    if not moderate: return y
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(INK_FAINT)
    c.drawString(x, y, "ALSO WORTH EXPLORING")
    y -= 14
    items = [f"{m.get('name','')[:18]}  {m.get('score','')}%" for m in moderate[:6]]
    return draw_chips(c, items, x, y, PLUM_INK, PLUM_TINT, max_w, style_name)


# ─────────────────────────────────────────────────────────────────────────────
# CONCLUSION BANNER — teal-tinted wash, italic text, no dark bg
# ─────────────────────────────────────────────────────────────────────────────

def draw_conclusion(c, body, y, style_name):
    paras = [p.strip() for p in re.split(r'\n\n+', body) if p.strip()]
    if not paras: return y
    total = sum(len(wrap(c, p, "Helvetica-Oblique", 10, CW - 48)) for p in paras)
    banner_h = min(total * 16 + 88, H - MARGIN * 2 - 40)
    if y - banner_h < FLOOR:
        y = new_page(c, style_name)
        banner_h = min(total * 16 + 88, H - MARGIN * 2 - 40)

    by = y - banner_h
    # Outer wash — teal-tinted parchment
    filled_rr(c, MARGIN - 4, by, CW + 8, banner_h, 16, TEAL_WASH)
    c.saveState()
    c.setStrokeColor(TEAL_INK)
    c.setStrokeAlpha(0.25)
    c.setLineWidth(0.8)
    c.roundRect(MARGIN - 4, by, CW + 8, banner_h, 16, stroke=1, fill=0)
    c.restoreState()

    # Decorative circles — very faint
    c.saveState()
    c.setFillColor(TEAL_INK); c.setFillAlpha(0.05)
    c.circle(MARGIN + 40, by + banner_h - 28, 70, stroke=0, fill=1)
    c.restoreState()
    c.saveState()
    c.setFillColor(GOLD_INK); c.setFillAlpha(0.04)
    c.circle(W - MARGIN - 40, by + 28, 55, stroke=0, fill=1)
    c.restoreState()

    # Star + label
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(TEAL_INK)
    c.setFillAlpha(0.5)
    c.drawCentredString(W / 2, by + banner_h - 34, "+")
    c.setFillAlpha(1.0)
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(TEAL_INK)
    c.drawCentredString(W / 2, by + banner_h - 50, "CONCLUSION")

    ty = by + banner_h - 68
    for para in paras:
        lines = wrap(c, para, "Helvetica-Oblique", 10, CW - 48)
        for line in lines:
            if ty < by + 14: break
            lw = c.stringWidth(line, "Helvetica-Oblique", 10)
            c.setFont("Helvetica-Oblique", 10)
            c.setFillColor(INK_MID)
            c.drawString(MARGIN + (CW - lw) / 2, ty, line)
            ty -= 16
        ty -= 6

    return by - 14


# ─────────────────────────────────────────────────────────────────────────────
# PERSONAL NOTE CARD
# ─────────────────────────────────────────────────────────────────────────────

def draw_personal_note(c, note_body, y, style_name):
    if not note_body: return y
    paras = [p.strip() for p in re.split(r'\n\n+', note_body) if p.strip()]
    total = sum(len(wrap(c, p, "Helvetica-Oblique", 9.5, CW - 42)) for p in paras)
    card_h = min(total * 15 + 76, H - MARGIN * 2 - 40)
    if y - card_h < FLOOR:
        y = new_page(c, style_name)
        card_h = min(total * 15 + 76, H - MARGIN * 2 - 40)

    cy = y - card_h
    # Card bg — warm ghost
    card(c, MARGIN, cy, CW, card_h, r=14, bg=GHOST, border=TEAL_INK)

    # Tricolor top accent rule
    seg = CW / 3
    for i, (ink, _, tint) in enumerate(CAREER_THEMES[:3]):
        filled_rr(c, MARGIN + i * seg, cy + card_h - 4, seg, 4, 0, tint, alpha=0.9)

    # Header
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(TEAL_MID)
    c.drawString(MARGIN + 14, cy + card_h - 18, "WRITTEN FOR YOU SPECIFICALLY")
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(INK)
    c.drawString(MARGIN + 14, cy + card_h - 34, "A Personal Note")
    hairline(c, MARGIN + 14, cy + card_h - 38, MARGIN + 145, cy + card_h - 38,
             TEAL_TINT, 0.8)

    # Big quote mark (very faint)
    c.saveState()
    c.setFont("Helvetica-Bold", 52)
    c.setFillColor(TEAL_INK); c.setFillAlpha(0.06)
    c.drawString(MARGIN + 14, cy + card_h - 58, "\u201c")
    c.restoreState()

    ty = cy + card_h - 56
    for para in paras:
        lines = wrap(c, para, "Helvetica-Oblique", 9.5, CW - 40)
        for line in lines:
            if ty < cy + 20: break
            c.setFont("Helvetica-Oblique", 9.5)
            c.setFillColor(INK_MID)
            c.drawString(MARGIN + 24, ty, line)
            ty -= 15
        ty -= 6

    # Footer
    hairline(c, MARGIN + 14, cy + 20, MARGIN + CW - 14, cy + 20,
             colors.HexColor("#E4E1D8"))
    c.setFont("Helvetica-Bold", 6)
    c.setFillColor(INK_FAINT)
    c.drawString(MARGIN + 14, cy + 11, "Based on your aptitude test + personal profile")
    dot(c, MARGIN + CW - 26, cy + 13, 3, TEAL_MID)
    c.setFont("Helvetica-Bold", 6)
    c.setFillColor(TEAL_MID)
    c.drawString(MARGIN + CW - 22, cy + 11, "Personalised")

    return cy - 14


# ─────────────────────────────────────────────────────────────────────────────
# SECTION PARSERS
# ─────────────────────────────────────────────────────────────────────────────

def parse_sections(text):
    parts = re.split(r'(?m)^## ', text); out = []
    for part in parts:
        part = part.strip()
        if not part: continue
        nl = part.find('\n')
        head = part[:nl].strip().lstrip('0123456789. ').strip() if nl != -1 else part
        body = part[nl + 1:].strip() if nl != -1 else ''
        out.append({'heading': head, 'body': body})
    return out

def find_sec(sections, *keys):
    for s in sections:
        if any(k in s['heading'].lower() for k in keys): return s
    return {'heading': '', 'body': ''}


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def generate_pdf(report_text: str, thinking_style: str, payload: dict = None) -> bytes:
    payload      = payload or {}
    buf          = io.BytesIO()
    top_careers  = payload.get('top_careers', [])
    moderate     = payload.get('moderate_careers', [])
    dim_scores   = payload.get('dimension_scores', {})
    dominant     = payload.get('dominant_traits', [])
    supp         = payload.get('suppression', {})
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
    note_sec  = find_sec(sections, 'personal note', 'personal', 'a note')
    note_match = re.search(
        r'## (?:A )?Personal Note\n+([\s\S]+?)(?=\n## |$)', report_text, re.I)
    note_body = note_sec.get('body') or (note_match.group(1).strip() if note_match else '')

    style_name = thinking_style or "Your Profile"
    c = rl_canvas.Canvas(buf, pagesize=A4)
    c.setTitle("WDIG Aptitude Report")
    page_num = 1

    # ── PAGE 1: COVER ────────────────────────────────────────────────────────
    y = draw_cover(c, thinking_style, secondary, top_careers, style_name)
    draw_footer(c, page_num)

    # ── PAGE 2: PROFILE + WHO YOU ARE ───────────────────────────────────────
    c.showPage(); page_num += 1
    _page_bg(c)
    y = draw_header(c, style_name)

    y = draw_dimension_card(c, dim_scores, dominant, supp, y, style_name)
    y = thin_rule(c, y - 4)

    if who_sec.get('body'):
        if y < 160: y = new_page(c, style_name); page_num += 1
        y = section_head(c, y, who_sec['heading'] or "Who You Are",
                         TEAL_INK, TEAL_WASH)
        y = pull_quote(c, who_sec['body'], MARGIN, y, CW,
                       TEAL_INK, TEAL_TINT, style_name)
        rest = '\n\n'.join(
            [p.strip() for p in re.split(r'\n\n+', who_sec['body']) if p.strip()][1:])
        if rest: y = draw_body(c, rest, MARGIN, y, CW, style_name)
        y -= 12

    draw_footer(c, page_num)

    # ── PAGE 3: HOLDING BACK + WORLD OFFERING ───────────────────────────────
    c.showPage(); page_num += 1
    _page_bg(c)
    y = draw_header(c, style_name)

    if hold_sec.get('body'):
        y = section_head(c, y, hold_sec['heading'] or "What's Holding You Back",
                         ROSE_INK, ROSE_WASH)
        y = pull_quote(c, hold_sec['body'], MARGIN, y, CW,
                       ROSE_INK, ROSE_TINT, style_name)
        rest = '\n\n'.join(
            [p.strip() for p in re.split(r'\n\n+', hold_sec['body']) if p.strip()][1:])
        if rest: y = draw_body(c, rest, MARGIN, y, CW, style_name)
        y -= 12

    y = thin_rule(c, y)

    if world_sec.get('body'):
        if y < 150: y = new_page(c, style_name); page_num += 1
        y = section_head(c, y, world_sec['heading'] or "What You Offer the World",
                         GOLD_INK, GOLD_WASH)
        y = pull_quote(c, world_sec['body'], MARGIN, y, CW,
                       GOLD_INK, GOLD_TINT, style_name)
        rest = '\n\n'.join(
            [p.strip() for p in re.split(r'\n\n+', world_sec['body']) if p.strip()][1:])
        if rest: y = draw_body(c, rest, MARGIN, y, CW, style_name)
        y -= 12

    draw_footer(c, page_num)

    # ── PAGE 4: CAREERS ──────────────────────────────────────────────────────
    c.showPage(); page_num += 1
    _page_bg(c)
    y = draw_header(c, style_name)

    if top_careers:
        y = section_head(c, y, "Careers Suggested to You", SKY_INK, SKY_WASH)
        y = draw_career_cards(c, top_careers, y, style_name)
        if moderate: y = draw_moderate(c, moderate, MARGIN, y, CW, style_name); y -= 8
        if car_sec.get('body'):
            paras_ = [p.strip() for p in re.split(r'\n\n+', car_sec['body']) if p.strip()]
            for para_ in paras_[:4]:
                if y < FLOOR: y = new_page(c, style_name); page_num += 1
                y = draw_block(c, para_, MARGIN, y, "Helvetica",
                               BODY_SZ, INK_MID, CW, style_name=style_name)
                y -= 8
        y -= 12

    draw_footer(c, page_num)

    # ── PAGE 5: ROADMAP + EDUCATION ──────────────────────────────────────────
    c.showPage(); page_num += 1
    _page_bg(c)
    y = draw_header(c, style_name)

    y = section_head(c, y, "Career Roadmap", PLUM_INK, PLUM_WASH)
    y = draw_roadmap(c, top_careers, y, style_name)
    if road_sec.get('body'): y = draw_body(c, road_sec['body'], MARGIN, y, CW, style_name)
    y = thin_rule(c, y - 8)

    if edu_sec.get('body'):
        if y < 150: y = new_page(c, style_name); page_num += 1
        y = section_head(c, y, edu_sec['heading'] or "Educational Pathway",
                         TEAL_INK, TEAL_WASH)
        y = pull_quote(c, edu_sec['body'], MARGIN, y, CW,
                       TEAL_INK, TEAL_TINT, style_name)
        rest = '\n\n'.join(
            [p.strip() for p in re.split(r'\n\n+', edu_sec['body']) if p.strip()][1:])
        if rest: y = draw_body(c, rest, MARGIN, y, CW, style_name)
        streams = list({s for career in top_careers[:3] for s in (career.get('stream') or [])})
        if streams:
            c.setFont("Helvetica-Bold", 6.5)
            c.setFillColor(INK_FAINT)
            c.drawString(MARGIN, y, "RECOMMENDED STREAMS")
            y -= 13
            y = draw_chips(c, streams[:8], MARGIN, y, TEAL_INK, TEAL_TINT, CW, style_name)

    draw_footer(c, page_num)

    # ── PAGE 6: SKILLS + CONCLUSION + PERSONAL NOTE ──────────────────────────
    c.showPage(); page_num += 1
    _page_bg(c)
    y = draw_header(c, style_name)

    if skill_sec.get('body'):
        y = section_head(c, y, skill_sec['heading'] or "Skillset to Build",
                         GOLD_INK, GOLD_WASH)
        raw_lines = skill_sec['body'].split('\n')
        chip_items = [
            l.strip().lstrip('-•*0123456789. ')[:36]
            for l in raw_lines
            if l.strip().lstrip('-•*0123456789. ') and len(l.strip()) > 4
        ]
        if chip_items:
            c.setFont("Helvetica-Bold", 6.5)
            c.setFillColor(INK_FAINT)
            c.drawString(MARGIN, y, "KEY SKILLS TO DEVELOP")
            y -= 13
            y = draw_chips(c, chip_items[:8], MARGIN, y,
                           GOLD_INK, GOLD_TINT, CW, style_name)
            y -= 4
        y = draw_body(c, skill_sec['body'], MARGIN, y, CW, style_name)
        y -= 12

    y = thin_rule(c, y, TEAL_TINT)

    if conc_sec.get('body'):
        if y < 130: y = new_page(c, style_name); page_num += 1
        y = draw_conclusion(c, conc_sec['body'], y, style_name)

    if note_body:
        if y < 130: y = new_page(c, style_name); page_num += 1
        y = draw_personal_note(c, note_body, y, style_name)

    draw_footer(c, page_num)

    c.save()
    buf.seek(0)
    return buf.read()