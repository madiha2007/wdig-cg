"""
WDIG PDF Report Generator v9.0 — Beautiful Light Theme
Editorial magazine aesthetic: warm cream pages, refined typography,
elegant section dividers, soft accent washes, premium card layouts.
"""

from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
import io, re, math

# ── Refined Light Palette ──────────────────────────────────────────────────────
CREAM        = colors.HexColor("#FAFAF6")       # page background
WARM_WHITE   = colors.HexColor("#FFFFFF")
STONE        = colors.HexColor("#F4F1EB")       # card backgrounds
STONE_DARK   = colors.HexColor("#EDE9DF")       # borders / dividers
INK          = colors.HexColor("#1A1A2E")       # headlines
INK_MID      = colors.HexColor("#3D3D56")       # body text
INK_LIGHT    = colors.HexColor("#7A7A96")       # captions / labels
TEAL         = colors.HexColor("#0A7B6B")       # primary accent
TEAL_MID     = colors.HexColor("#14B89A")       # highlight
TEAL_WASH    = colors.HexColor("#EAF7F4")       # section wash
GOLD         = colors.HexColor("#B8821E")       # warm accent
GOLD_WASH    = colors.HexColor("#FDF6E8")
ROSE         = colors.HexColor("#A8364A")       # warning accent
ROSE_WASH    = colors.HexColor("#FDF0F3")
SKY          = colors.HexColor("#1A5F8A")
SKY_WASH     = colors.HexColor("#EBF4FB")
PLUM         = colors.HexColor("#4E3590")
PLUM_WASH    = colors.HexColor("#F2EEFA")

CAREER_PALETTE = [TEAL, SKY, PLUM, GOLD, ROSE]
ROAD_PALETTE   = [colors.HexColor("#2D9B6F"), colors.HexColor("#1A7BAA"),
                  colors.HexColor("#6B4BB5"), colors.HexColor("#B8821E")]
CAREER_WASHES  = [TEAL_WASH, SKY_WASH, PLUM_WASH, GOLD_WASH, ROSE_WASH]

W, H    = A4
MARGIN  = 42
CW      = W - 2 * MARGIN       # content width
LINE_H  = 15.0
BODY_SZ = 9.2
FLOOR   = 68

# ── Typography helpers ─────────────────────────────────────────────────────────

def sw(c, text, font, size):
    """stringWidth shorthand."""
    return c.stringWidth(text, font, size)

def wrap(c, text, font, size, max_w):
    """Accurate word-wrap. Returns list of lines."""
    clean = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    clean = re.sub(r'\*(.+?)\*',   r'\1', clean).strip()
    words = clean.split()
    lines, cur = [], ""
    for w_ in words:
        test = (cur + " " + w_).strip() if cur else w_
        if c.stringWidth(test, font, size) <= max_w:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = w_
    if cur: lines.append(cur)
    return lines

# ── Page management ────────────────────────────────────────────────────────────

def new_page(c, style_name):
    c.showPage()
    return draw_header(c, style_name)

def draw_header(c, style_name):
    """Elegant thin top bar. Returns y below."""
    # Full-width cream bar at top
    c.setFillColor(WARM_WHITE)
    c.rect(0, H - 36, W, 36, stroke=0, fill=1)
    # Thin teal rule
    c.setFillColor(TEAL)
    c.rect(0, H - 37, W, 1.5, stroke=0, fill=1)
    # Left: document label
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(TEAL)
    c.drawString(MARGIN, H - 22, "WDIG  APTITUDE REPORT")
    # Right: style name
    c.setFont("Helvetica", 6.5)
    c.setFillColor(INK_LIGHT)
    c.drawRightString(W - MARGIN, H - 22, style_name[:52])
    # Page-number placeholder (bottom)
    return H - 48

def draw_footer(c, page_num):
    """Refined footer with page number."""
    c.setStrokeColor(STONE_DARK)
    c.setLineWidth(0.5)
    c.line(MARGIN, 30, W - MARGIN, 30)
    c.setFont("Helvetica", 6.5)
    c.setFillColor(INK_LIGHT)
    c.drawCentredString(W / 2, 18, "WDIG Career Guidance  ·  Confidential  ·  For personal use only")
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(TEAL)
    c.drawRightString(W - MARGIN, 18, str(page_num))

# ── Low-level drawing ──────────────────────────────────────────────────────────

def filled_rr(c, x, y, w, h, r, fill_col, stroke_col=None, sw_=0.8):
    c.setFillColor(fill_col)
    if stroke_col:
        c.setStrokeColor(stroke_col)
        c.setLineWidth(sw_)
        c.roundRect(x, y, w, h, r, stroke=1, fill=1)
    else:
        c.roundRect(x, y, w, h, r, stroke=0, fill=1)

def stroke_rr(c, x, y, w, h, r, stroke_col, sw_=0.8):
    c.setStrokeColor(stroke_col)
    c.setLineWidth(sw_)
    c.roundRect(x, y, w, h, r, stroke=1, fill=0)

def hairline(c, x1, y1, x2, y2, col=STONE_DARK, lw=0.5):
    c.setStrokeColor(col)
    c.setLineWidth(lw)
    c.line(x1, y1, x2, y2)

def dot(c, x, y, r, col):
    c.setFillColor(col)
    c.circle(x, y, r, stroke=0, fill=1)

# ── Text drawing ───────────────────────────────────────────────────────────────

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
        est = max(1, int(c.stringWidth(para, "Helvetica", BODY_SZ) / max_w) + 1)
        if y - (min(3, est) * LINE_H) < FLOOR:
            y = new_page(c, style_name)
        y = draw_block(c, para, x, y, "Helvetica", BODY_SZ, col, max_w, style_name=style_name)
        y -= 8
    return y

# ── Section heading strip ──────────────────────────────────────────────────────

def section_head(c, y, title, accent, wash, x=MARGIN, w=CW):
    """Beautiful section header: wash bg, left accent bar, elegant label."""
    h = 44
    if y - h < FLOOR:
        return y  # caller handles page break
    filled_rr(c, x, y - h, w, h, 10, wash)
    # Left accent bar
    c.setFillColor(accent)
    c.roundRect(x, y - h, 5, h, 3, stroke=0, fill=1)
    # Title
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(INK)
    c.drawString(x + 20, y - h + 15, title)
    # Right decorative rule
    rule_x = x + w - 54
    c.setFillColor(accent)
    c.rect(rule_x, y - h + 20, 46, 2, stroke=0, fill=1)
    c.setFillColor(accent)
    c.setFillAlpha(0.4)
    c.rect(rule_x, y - h + 15, 32, 2, stroke=0, fill=1)
    c.setFillAlpha(1.0)
    return y - h - 10

def thin_rule(c, y, accent=STONE_DARK):
    hairline(c, MARGIN, y, MARGIN + CW, y, accent)
    return y - 10

# ── Pull quote ─────────────────────────────────────────────────────────────────

def pull_quote(c, text, x, y, w, accent, style_name):
    paras = [p.strip() for p in re.split(r'\n\n+', text) if p.strip()]
    if not paras: return y
    snippet = paras[0][:260]
    lines   = wrap(c, snippet, "Helvetica-Oblique", 10, w - 28)
    bh      = len(lines) * 14.5 + 22
    if y - bh < FLOOR:
        y = new_page(c, style_name)
    # Wash background
    filled_rr(c, x, y - bh, w, bh, 8, accent)
    # Actually draw the fill with proper alpha
    c.saveState()
    c.setFillColor(accent)
    c.setFillAlpha(0.07)
    c.roundRect(x, y - bh, w, bh, 8, stroke=0, fill=1)
    c.restoreState()
    # Left border bar
    c.setFillColor(accent)
    c.roundRect(x, y - bh, 4, bh, 2, stroke=0, fill=1)
    # Quotation mark
    c.setFont("Helvetica-Bold", 32)
    c.saveState(); c.setFillColor(accent); c.setFillAlpha(0.15)
    c.drawString(x + 10, y - 24, "\u201c"); c.restoreState()
    # Text
    c.setFont("Helvetica-Oblique", 10)
    c.setFillColor(INK_MID)
    ty = y - 13
    for line in lines:
        c.drawString(x + 18, ty, line); ty -= 14.5
    return y - bh - 12

# ── Hero / Cover page ──────────────────────────────────────────────────────────

def draw_cover(c, thinking_style, secondary, top_careers, style_name):
    """Full-page elegant cover with light theme."""
    # Page background
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # Top decorative band — subtle gradient simulation via overlapping rects
    for i in range(12):
        alpha = 0.06 - i * 0.005
        c.saveState()
        c.setFillColor(TEAL)
        c.setFillAlpha(max(0, alpha))
        c.rect(0, H - (i + 1) * 18, W, 18, stroke=0, fill=1)
        c.restoreState()

    # Thin teal accent line
    c.setFillColor(TEAL)
    c.rect(0, H - 6, W, 6, stroke=0, fill=1)

    # WDIG wordmark area
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(TEAL)
    c.drawString(MARGIN, H - 26, "W D I G")
    c.setFont("Helvetica", 7)
    c.setFillColor(INK_LIGHT)
    c.drawString(MARGIN + 42, H - 26, "CAREER GUIDANCE")

    # Top-right: report label chip
    chip_w = 110; chip_h = 18
    filled_rr(c, W - MARGIN - chip_w, H - 30, chip_w, chip_h, 9, TEAL_WASH,
               stroke_col=TEAL, sw_=0.7)
    c.setFont("Helvetica-Bold", 6.5); c.setFillColor(TEAL)
    c.drawCentredString(W - MARGIN - chip_w / 2, H - 24.5, "APTITUDE REPORT")

    # ── Main title area ────────────────────────────────────────────────────────
    title = thinking_style or "Your Profile"
    title_y = H - 120

    # Decorative circles — soft, elegant
    c.saveState()
    c.setFillColor(TEAL_WASH)
    c.setFillAlpha(0.7)
    c.circle(W - MARGIN - 30, title_y + 30, 90, stroke=0, fill=1)
    c.restoreState()
    c.saveState()
    c.setFillColor(GOLD_WASH)
    c.setFillAlpha(0.6)
    c.circle(MARGIN + 15, title_y - 60, 55, stroke=0, fill=1)
    c.restoreState()

    # "Who you are" label
    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(TEAL)
    c.drawString(MARGIN, title_y + 16, "YOUR THINKING STYLE")
    hairline(c, MARGIN, title_y + 10, MARGIN + 140, title_y + 10, TEAL, 1)

    # Title — split across lines nicely
    words = title.split()
    fs = 30 if len(title) < 28 else 22 if len(title) < 40 else 18
    c.setFont("Helvetica-Bold", fs)
    c.setFillColor(INK)
    line1 = " ".join(words[:3]); line2 = " ".join(words[3:])
    c.drawString(MARGIN, title_y - 10, line1)
    if line2:
        c.drawString(MARGIN, title_y - 10 - fs - 4, line2)

    # Secondary style badge
    badge_y = title_y - (10 + fs + 4 + (fs + 4 if line2 else 0)) - 18
    if secondary:
        bw = min(200, c.stringWidth(secondary, "Helvetica", 9) + 36)
        filled_rr(c, MARGIN, badge_y, bw, 22, 11, STONE, stroke_col=STONE_DARK, sw_=0.8)
        c.setFont("Helvetica-Bold", 6); c.setFillColor(TEAL_MID)
        c.drawString(MARGIN + 10, badge_y + 7, "ALSO")
        c.setFont("Helvetica", 9); c.setFillColor(INK_MID)
        c.drawString(MARGIN + 36, badge_y + 7, secondary[:36])
        badge_y -= 30
    else:
        badge_y -= 12

    # ── Top career chips ───────────────────────────────────────────────────────
    chip_x = MARGIN
    cols   = [TEAL, SKY, PLUM]
    washes = [TEAL_WASH, SKY_WASH, PLUM_WASH]
    for i, career in enumerate(top_careers[:3]):
        name  = (career.get("name") or "")[:22]
        score = career.get("score", 0)
        label = f"{name}  {score}%"
        cw_   = min(165, c.stringWidth(label, "Helvetica-Bold", 8) + 22)
        filled_rr(c, chip_x, badge_y, cw_, 22, 11, washes[i], stroke_col=cols[i], sw_=0.8)
        dot(c, chip_x + 11, badge_y + 11, 3, cols[i])
        c.setFont("Helvetica-Bold", 8); c.setFillColor(INK_MID)
        c.drawString(chip_x + 20, badge_y + 7, name)
        c.setFont("Helvetica-Bold", 8); c.setFillColor(cols[i])
        c.drawRightString(chip_x + cw_ - 8, badge_y + 7, f"{score}%")
        chip_x += cw_ + 8

    # ── Stats ribbon — elegant card row ───────────────────────────────────────
    ribbon_y = 155
    ribbon_h = 58
    filled_rr(c, MARGIN, ribbon_y, CW, ribbon_h, 12, WARM_WHITE,
               stroke_col=STONE_DARK, sw_=0.8)
    stats = [
        ("Thinking Style", (thinking_style or "—")[:22]),
        ("Top Career",     (top_careers[0]["name"] if top_careers else "—")[:22]),
        ("Match Score",    f"{top_careers[0].get('score','—')}%" if top_careers else "—"),
        ("Dimensions",     "6 analysed"),
    ]
    cell_w = CW / 4
    for i, (label, value) in enumerate(stats):
        sx = MARGIN + i * cell_w
        if i > 0:
            hairline(c, sx, ribbon_y + 10, sx, ribbon_y + ribbon_h - 10, STONE_DARK)
        c.setFont("Helvetica-Bold", 6); c.setFillColor(INK_LIGHT)
        c.drawString(sx + 12, ribbon_y + ribbon_h - 16, label.upper())
        c.setFont("Helvetica-Bold", 9.5); c.setFillColor(INK)
        c.drawString(sx + 12, ribbon_y + 16, value)
        # small accent dot
        dot(c, sx + 6, ribbon_y + 18, 2, TEAL)

    # ── Bottom decoration ──────────────────────────────────────────────────────
    c.setFont("Helvetica", 7); c.setFillColor(INK_LIGHT)
    c.drawCentredString(W / 2, 36, "Confidential  ·  For personal use only")
    hairline(c, MARGIN, 44, W - MARGIN, 44, STONE_DARK)

    return ribbon_y - 20


# ── Radar chart ────────────────────────────────────────────────────────────────

def draw_radar(c, scores, cx, cy, R=52):
    items = list(scores.items()); n = len(items)
    if not n: return

    def pt(i, frac):
        a = (math.pi * 2 * i / n) - math.pi / 2
        return cx + frac * R * math.cos(a), cy + frac * R * math.sin(a)

    # Grid rings
    for lvl in [.25, .5, .75, 1.0]:
        pts = [pt(i, lvl) for i in range(n)]
        path = c.beginPath(); path.moveTo(*pts[0])
        for p in pts[1:]: path.lineTo(*p)
        path.close()
        c.saveState()
        c.setStrokeColor(STONE_DARK); c.setLineWidth(0.6)
        if lvl == 1.0:
            c.setStrokeColor(TEAL); c.setStrokeAlpha(0.25)
        c.drawPath(path, stroke=1, fill=0); c.restoreState()

    # Spokes
    for i in range(n):
        ex, ey = pt(i, 1.0)
        c.saveState(); c.setStrokeColor(STONE_DARK); c.setLineWidth(0.4)
        c.line(cx, cy, ex, ey); c.restoreState()

    # Data fill
    data_pts = [pt(i, items[i][1] / 100.0) for i in range(n)]
    path = c.beginPath(); path.moveTo(*data_pts[0])
    for p in data_pts[1:]: path.lineTo(*p)
    path.close()
    c.saveState()
    c.setFillColor(TEAL); c.setFillAlpha(0.15)
    c.setStrokeColor(TEAL); c.setLineWidth(1.6)
    c.drawPath(path, stroke=1, fill=1); c.restoreState()

    # Data points
    for px, py in data_pts:
        c.setFillColor(WARM_WHITE); c.circle(px, py, 3.5, stroke=0, fill=1)
        c.setFillColor(TEAL); c.circle(px, py, 2.5, stroke=0, fill=1)

    # Labels
    c.setFont("Helvetica-Bold", 6); c.setFillColor(INK_MID)
    for i, (dim, val) in enumerate(items):
        lx, ly = pt(i, 1.32)
        label  = dim[:5].upper()
        lw_    = c.stringWidth(label, "Helvetica-Bold", 6)
        c.drawString(lx - lw_ / 2, ly - 2.5, label)


# ── Trait bars ─────────────────────────────────────────────────────────────────

def draw_trait_bars(c, traits, x, y, bar_w=165, bar_h=10, gap=9):
    cols = [TEAL, SKY, PLUM, GOLD, ROSE, TEAL_MID]
    for i, trait in enumerate(traits[:6]):
        label = re.sub(r'\*\*?', '', trait.get("label", trait.get("trait", "")))[:24]
        score = trait.get("score", 0)
        col   = cols[i % len(cols)]

        c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_MID)
        c.drawString(x, y + 3, label)

        # Track
        c.saveState(); c.setFillColor(STONE); c.roundRect(x + 115, y, bar_w, bar_h, bar_h / 2, stroke=0, fill=1); c.restoreState()
        # Fill
        fill = max(bar_h, (score / 100) * bar_w)
        c.saveState(); c.setFillColor(col); c.setFillAlpha(0.85)
        c.roundRect(x + 115, y, fill, bar_h, bar_h / 2, stroke=0, fill=1); c.restoreState()

        c.setFont("Helvetica-Bold", 7); c.setFillColor(col)
        c.drawString(x + 115 + bar_w + 5, y + 2, f"{score}%")
        y -= bar_h + gap
    return y


# ── Dimension profile card ─────────────────────────────────────────────────────

def draw_dimension_card(c, dim_scores, dominant_traits, supp, y, style_name):
    if not dim_scores and not dominant_traits:
        return y
    card_h = 168
    if y - card_h < FLOOR:
        y = new_page(c, style_name)

    # Card shell
    filled_rr(c, MARGIN, y - card_h, CW, card_h, 14, WARM_WHITE,
               stroke_col=STONE_DARK, sw_=0.8)
    # Teal top accent strip
    c.saveState(); c.setFillColor(TEAL); c.setFillAlpha(0.06)
    c.roundRect(MARGIN, y - 28, CW, 28, 14, stroke=0, fill=1); c.restoreState()
    c.roundRect(MARGIN, y - 28, CW, 14, 0, stroke=0, fill=1)  # square bottom half

    # Section labels
    left_x  = MARGIN + 14
    right_x = MARGIN + CW * 0.42 + 14

    c.setFont("Helvetica-Bold", 6.5); c.setFillColor(TEAL)
    if dim_scores:   c.drawString(left_x,  y - 18, "DIMENSION PROFILE")
    if dominant_traits: c.drawString(right_x, y - 18, "DOMINANT TRAITS")

    # Vertical divider
    if dim_scores and dominant_traits:
        hairline(c, MARGIN + CW * 0.42, y - card_h + 12, MARGIN + CW * 0.42, y - 32, STONE_DARK)

    # Radar
    if dim_scores:
        draw_radar(c, dim_scores, left_x + 70, y - 95, R=56)

    # Trait bars
    if dominant_traits:
        draw_trait_bars(c, dominant_traits, right_x, y - 38,
                        bar_w=int(CW * 0.50), bar_h=10, gap=8)

    # Suppression signal
    if supp.get("has_suppression"):
        sx = right_x; sy = y - card_h + 16
        lvl = supp.get("suppression_level", 0)
        c.setFont("Helvetica-Bold", 6.5); c.setFillColor(ROSE)
        c.drawString(sx, sy + 11, f"SUPPRESSION SIGNAL  —  {lvl}/10")
        bw_ = int(CW * 0.48)
        c.saveState(); c.setFillColor(ROSE); c.setFillAlpha(0.12)
        c.roundRect(sx, sy, bw_, 8, 4, stroke=0, fill=1); c.restoreState()
        fill_ = max(4, (lvl / 10) * bw_)
        c.saveState(); c.setFillColor(ROSE); c.setFillAlpha(0.7)
        c.roundRect(sx, sy, fill_, 8, 4, stroke=0, fill=1); c.restoreState()

    return y - card_h - 16


# ── Career cards ───────────────────────────────────────────────────────────────

def draw_career_cards(c, careers, y, style_name):
    n = min(len(careers), 3)
    if not n: return y
    gap   = 10
    cw_   = (CW - gap * (n - 1)) / n
    card_h = 118
    if y - card_h < FLOOR:
        y = new_page(c, style_name)

    for i, career in enumerate(careers[:n]):
        col   = CAREER_PALETTE[i % len(CAREER_PALETTE)]
        wash  = CAREER_WASHES[i % len(CAREER_WASHES)]
        cx_   = MARGIN + i * (cw_ + gap)
        cy_   = y - card_h

        # Card shell
        filled_rr(c, cx_, cy_, cw_, card_h, 12, WARM_WHITE, stroke_col=col, sw_=0.9)

        # Coloured top header band
        c.saveState(); c.setFillColor(col); c.setFillAlpha(1)
        c.roundRect(cx_, cy_ + card_h - 50, cw_, 50, 12, stroke=0, fill=1)
        c.rect(cx_, cy_ + card_h - 50, cw_, 24, stroke=0, fill=1)  # square bottom
        c.restoreState()

        # Domain label
        domain = (career.get("domain") or "")[:20].upper()
        c.setFont("Helvetica-Bold", 5.5); c.setFillColor(WARM_WHITE)
        c.saveState(); c.setFillAlpha(0.65); c.drawString(cx_ + 9, cy_ + card_h - 14, domain); c.restoreState()

        # Career name
        name = re.sub(r'\*\*?', '', career.get("name") or "")
        words_ = name.split()
        l1_ = " ".join(words_[:3]); l2_ = " ".join(words_[3:])
        c.setFont("Helvetica-Bold", 9.5); c.setFillColor(WARM_WHITE)
        c.drawString(cx_ + 9, cy_ + card_h - 28, l1_[:22])
        if l2_: c.drawString(cx_ + 9, cy_ + card_h - 39, l2_[:22])

        # Score — large, right-aligned
        stxt = f"{career.get('score', 0)}%"
        c.setFont("Helvetica-Bold", 16); c.setFillColor(WARM_WHITE)
        c.drawRightString(cx_ + cw_ - 9, cy_ + card_h - 44, stxt)

        # Society role (body section)
        soc   = re.sub(r'\*\*?', '', career.get("society_role") or "")
        c.setFont("Helvetica", 6.8); c.setFillColor(INK_MID)
        slines = wrap(c, soc, "Helvetica", 6.8, cw_ - 18)
        sy_   = cy_ + card_h - 62
        for sl in slines[:3]:
            c.drawString(cx_ + 9, sy_, sl); sy_ -= 10

        # Emerging badge
        if career.get("emerging"):
            filled_rr(c, cx_ + 9, cy_ + 9, 62, 13, 6, SKY_WASH, stroke_col=SKY, sw_=0.7)
            c.setFont("Helvetica-Bold", 5.5); c.setFillColor(SKY)
            c.drawString(cx_ + 16, cy_ + 13, "✦ EMERGING")

        # Rank number — subtle
        badges = ["1ST", "2ND", "3RD"]
        c.setFont("Helvetica-Bold", 6.5); c.setFillColor(WARM_WHITE)
        c.saveState(); c.setFillAlpha(0.5)
        c.drawString(cx_ + cw_ - 30, cy_ + card_h - 15, badges[i] if i < 3 else ""); c.restoreState()

    return y - card_h - 14


# ── Roadmap infographic ────────────────────────────────────────────────────────

def draw_roadmap(c, careers, y, style_name):
    steps = careers[:4]; n = len(steps)
    if not n: return y
    infog_h = 135
    if y - infog_h < FLOOR:
        y = new_page(c, style_name)

    step_w_ = CW / n
    road_y  = y - 62
    lane_h  = 22
    rise    = 18

    for i, step in enumerate(steps):
        col  = ROAD_PALETTE[i % len(ROAD_PALETTE)]
        wash = CAREER_WASHES[i % len(CAREER_WASHES)]
        x0_  = MARGIN + i * step_w_
        x1_  = MARGIN + (i + 1) * step_w_
        y0_  = road_y - i * rise
        y1_  = road_y - (i + 1) * rise if i < n - 1 else y0_

        # Road trapezoid — light gray
        half = lane_h / 2
        pts  = [x0_, y0_ - half, x1_, y1_ - half, x1_, y1_ + half, x0_, y0_ + half]
        path = c.beginPath()
        path.moveTo(pts[0], pts[1])
        path.lineTo(pts[2], pts[3])
        path.lineTo(pts[4], pts[5])
        path.lineTo(pts[6], pts[7])
        path.close()
        c.setFillColor(colors.HexColor("#DFE6ED"))
        c.drawPath(path, stroke=0, fill=1)

        # Road border
        c.saveState(); c.setStrokeColor(colors.HexColor("#C8D4DC")); c.setLineWidth(0.5)
        c.drawPath(path, stroke=1, fill=0); c.restoreState()

        # Dashed centre line
        seg_len = math.sqrt((x1_ - x0_) ** 2 + (y1_ - y0_) ** 2)
        nd = max(1, int(seg_len / 20))
        dx_ = (x1_ - x0_) / nd; dy_ = (y1_ - y0_) / nd
        c.setStrokeColor(WARM_WHITE); c.setLineWidth(1.5)
        c.saveState(); c.setDash(5, 4)
        for d in range(nd - 1):
            c.line(x0_ + d * dx_ + dx_ * .25, y0_ + d * dy_,
                   x0_ + d * dx_ + dx_ * .65, y0_ + d * dy_ + dy_ * .4)
        c.restoreState()

        # Flag pole
        mid_x    = (x0_ + x1_) / 2
        mid_y    = (y0_ + y1_) / 2
        pole_bot = mid_y - half
        pole_top = pole_bot - 36
        c.saveState(); c.setStrokeColor(col); c.setLineWidth(1.2); c.setDash(3, 2)
        c.line(mid_x, pole_bot, mid_x, pole_top + 5); c.restoreState()

        # Flag
        fpath = c.beginPath()
        fpath.moveTo(mid_x, pole_top)
        fpath.lineTo(mid_x + 22, (pole_top + pole_top + 18) / 2)
        fpath.lineTo(mid_x, pole_top + 18)
        fpath.close()
        c.setFillColor(col); c.drawPath(fpath, stroke=0, fill=1)

        # Step number
        num_ = f"0{i+1}"
        c.setFont("Helvetica-Bold", 15); c.setFillColor(col)
        nw_  = c.stringWidth(num_, "Helvetica-Bold", 15)
        c.drawString(mid_x - nw_ / 2 - 8, pole_top - 8, num_)

    # Label cards below road
    label_y = y - infog_h + 10
    lcard_w = step_w_ - 8
    for i, step in enumerate(steps):
        col   = ROAD_PALETTE[i % len(ROAD_PALETTE)]
        wash  = CAREER_WASHES[i % len(CAREER_WASHES)]
        lx_   = MARGIN + i * step_w_ + 4
        filled_rr(c, lx_, label_y, lcard_w, 24, 6, wash, stroke_col=col, sw_=0.6)
        name_ = re.sub(r'\*\*?', '', step.get("name") or f"Step {i+1}")[:22]
        c.setFont("Helvetica-Bold", 8); c.setFillColor(INK)
        c.drawString(lx_ + 7, label_y + 13, name_)
        c.setFont("Helvetica", 7); c.setFillColor(col)
        c.drawString(lx_ + 7, label_y + 4, f"{step.get('score', 0)}% match")

    return y - infog_h - 10


# ── Skill chips ────────────────────────────────────────────────────────────────

def draw_chips(c, items, x, y, accent, max_w, style_name):
    chip_h = 18; px = 11; gap = 6
    row_x = x; row_y = y
    for item in items:
        label = (item[:32] if isinstance(item, str) else item.get("label", "")[:32])
        c.setFont("Helvetica-Bold", 7.5)
        tw_  = c.stringWidth(label, "Helvetica-Bold", 7.5)
        cw_  = tw_ + 2 * px
        if row_x + cw_ > x + max_w:
            row_x = x; row_y -= chip_h + gap
            if row_y < FLOOR:
                row_y = new_page(c, style_name); row_x = x
        filled_rr(c, row_x, row_y, cw_, chip_h, chip_h / 2, accent)
        # Re-draw with proper alpha
        c.saveState(); c.setFillColor(accent); c.setFillAlpha(0.1)
        c.roundRect(row_x, row_y, cw_, chip_h, chip_h / 2, stroke=0, fill=1); c.restoreState()
        stroke_rr(c, row_x, row_y, cw_, chip_h, chip_h / 2, accent, 0.7)
        c.setFont("Helvetica-Bold", 7.5); c.setFillColor(accent)
        c.drawString(row_x + px, row_y + 4.5, label)
        row_x += cw_ + gap
    return row_y - chip_h - 8


# ── Moderate careers ───────────────────────────────────────────────────────────

def draw_moderate(c, moderate, x, y, max_w, style_name):
    if not moderate: return y
    c.setFont("Helvetica-Bold", 6.5); c.setFillColor(INK_LIGHT)
    c.drawString(x, y, "ALSO WORTH EXPLORING")
    y -= 14
    items = [f"{m.get('name','')[:18]}  {m.get('score','')}%" for m in moderate[:6]]
    return draw_chips(c, items, x, y, PLUM, max_w, style_name)


# ── Conclusion banner ──────────────────────────────────────────────────────────

def draw_conclusion(c, body, y, style_name):
    paras = [p.strip() for p in re.split(r'\n\n+', body) if p.strip()]
    if not paras: return y
    total_lines = sum(len(wrap(c, p, "Helvetica-Oblique", 10, CW - 52)) for p in paras)
    banner_h    = min(total_lines * 16 + 90, H - MARGIN * 2 - 40)
    if y - banner_h < FLOOR:
        y = new_page(c, style_name)
        banner_h = min(total_lines * 16 + 90, H - MARGIN * 2 - 40)

    by_ = y - banner_h
    # Light card with teal border
    filled_rr(c, MARGIN - 4, by_, CW + 8, banner_h, 16, TEAL_WASH,
               stroke_col=TEAL, sw_=1.2)

    # Decorative blobs
    c.saveState(); c.setFillColor(TEAL); c.setFillAlpha(0.08)
    c.circle(MARGIN + 40, by_ + banner_h - 28, 70, stroke=0, fill=1); c.restoreState()
    c.saveState(); c.setFillColor(GOLD); c.setFillAlpha(0.07)
    c.circle(W - MARGIN - 40, by_ + 28, 50, stroke=0, fill=1); c.restoreState()

    # Star + label
    c.setFont("Helvetica-Bold", 20); c.setFillColor(TEAL)
    c.drawCentredString(W / 2, by_ + banner_h - 34, "✦")
    c.setFont("Helvetica-Bold", 7); c.setFillColor(TEAL)
    c.drawCentredString(W / 2, by_ + banner_h - 50, "CONCLUSION")

    # Text
    ty_ = by_ + banner_h - 68
    for para in paras:
        lines_ = wrap(c, para, "Helvetica-Oblique", 10, CW - 52)
        for line_ in lines_:
            if ty_ < by_ + 14: break
            lw_ = c.stringWidth(line_, "Helvetica-Oblique", 10)
            c.setFont("Helvetica-Oblique", 10); c.setFillColor(INK_MID)
            c.drawString(MARGIN + (CW - lw_) / 2, ty_, line_); ty_ -= 16
        ty_ -= 6

    return by_ - 14


# ── Personal note ──────────────────────────────────────────────────────────────

def draw_personal_note(c, note_body, y, style_name):
    if not note_body: return y
    paras = [p.strip() for p in re.split(r'\n\n+', note_body) if p.strip()]
    total_lines = sum(len(wrap(c, p, "Helvetica-Oblique", 9.5, CW - 40)) for p in paras)
    card_h = min(total_lines * 15 + 72, H - MARGIN * 2 - 40)
    if y - card_h < FLOOR:
        y = new_page(c, style_name)
        card_h = min(total_lines * 15 + 72, H - MARGIN * 2 - 40)

    cy_ = y - card_h
    # Card bg
    filled_rr(c, MARGIN, cy_, CW, card_h, 14, WARM_WHITE, stroke_col=STONE_DARK, sw_=0.8)
    # Rainbow-ish top accent bar
    seg_ = CW / 3
    for i, col_ in enumerate([TEAL, TEAL_MID, GOLD]):
        c.setFillColor(col_)
        c.roundRect(MARGIN + i * seg_, cy_ + card_h - 5, seg_, 5, 0, stroke=0, fill=1)

    # Header
    c.setFont("Helvetica-Bold", 7); c.setFillColor(TEAL_MID)
    c.drawString(MARGIN + 14, cy_ + card_h - 20, "WRITTEN FOR YOU SPECIFICALLY")
    c.setFont("Helvetica-Bold", 12); c.setFillColor(INK)
    c.drawString(MARGIN + 14, cy_ + card_h - 36, "A Personal Note")
    hairline(c, MARGIN + 14, cy_ + card_h - 40, MARGIN + 140, cy_ + card_h - 40, TEAL_MID, 0.8)

    # Large quote mark
    c.setFont("Helvetica-Bold", 48); c.setFillColor(TEAL)
    c.saveState(); c.setFillAlpha(0.08)
    c.drawString(MARGIN + 14, cy_ + card_h - 58, "\u201c"); c.restoreState()

    # Body text
    ty_ = cy_ + card_h - 56
    for para in paras:
        lines_ = wrap(c, para, "Helvetica-Oblique", 9.5, CW - 40)
        for line_ in lines_:
            if ty_ < cy_ + 18: break
            c.setFont("Helvetica-Oblique", 9.5); c.setFillColor(INK_MID)
            c.drawString(MARGIN + 24, ty_, line_); ty_ -= 15
        ty_ -= 6

    # Footer
    hairline(c, MARGIN + 14, cy_ + 18, MARGIN + CW - 14, cy_ + 18, STONE_DARK)
    c.setFont("Helvetica-Bold", 6); c.setFillColor(INK_LIGHT)
    c.drawString(MARGIN + 14, cy_ + 9, "Based on your aptitude test + personal profile")
    dot(c, MARGIN + CW - 24, cy_ + 11, 3, TEAL_MID)
    c.setFont("Helvetica-Bold", 6); c.setFillColor(TEAL_MID)
    c.drawString(MARGIN + CW - 20, cy_ + 9, "Personalised")

    return cy_ - 14


# ── Section parsers ────────────────────────────────────────────────────────────

def parse_sections(text):
    parts = re.split(r'(?m)^## ', text)
    out   = []
    for part in parts:
        part = part.strip()
        if not part: continue
        nl   = part.find('\n')
        head = part[:nl].strip().lstrip('0123456789. ').strip() if nl != -1 else part
        body = part[nl + 1:].strip() if nl != -1 else ''
        out.append({'heading': head, 'body': body})
    return out

def find_sec(sections, *keys):
    for s in sections:
        h = s['heading'].lower()
        if any(k in h for k in keys): return s
    return {'heading': '', 'body': ''}


# ── MAIN ───────────────────────────────────────────────────────────────────────

def generate_pdf(report_text: str, thinking_style: str, payload: dict = None) -> bytes:
    payload       = payload or {}
    buf           = io.BytesIO()
    top_careers   = payload.get('top_careers',    [])
    moderate      = payload.get('moderate_careers', [])
    dim_scores    = payload.get('dimension_scores', {})
    dominant      = payload.get('dominant_traits', [])
    supp          = payload.get('suppression',    {})
    secondary     = payload.get('thinking_style_secondary', '')
    sections      = parse_sections(report_text)

    who_sec   = find_sec(sections, 'who you are', 'who')
    hold_sec  = find_sec(sections, 'holding', 'back')
    world_sec = find_sec(sections, 'offer', 'world')
    car_sec   = find_sec(sections, 'careers suggested', 'career match')
    road_sec  = find_sec(sections, 'roadmap')
    edu_sec   = find_sec(sections, 'educational', 'pathway')
    skill_sec = find_sec(sections, 'skillset', 'skill')
    conc_sec  = find_sec(sections, 'conclusion', 'closing')
    note_sec  = find_sec(sections, 'personal note', 'personal', 'a note')

    # Fallback for personal note
    note_match = re.search(r'## (?:A )?Personal Note\n+([\s\S]+?)(?=\n## |$)',
                            report_text, re.I)
    note_body  = note_sec.get('body') or (note_match.group(1).strip() if note_match else '')

    style_name = thinking_style or "Your Profile"
    c          = rl_canvas.Canvas(buf, pagesize=A4)
    c.setTitle("WDIG Aptitude Report")

    page_num = 1

    # ── PAGE 1: COVER ──────────────────────────────────────────────────────────
    # Set cream background
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    y = draw_cover(c, thinking_style, secondary, top_careers, style_name)
    draw_footer(c, page_num)

    # ── PAGE 2: PROFILE + WHO YOU ARE ─────────────────────────────────────────
    c.showPage(); page_num += 1
    c.setFillColor(CREAM); c.rect(0, 0, W, H, stroke=0, fill=1)
    y = draw_header(c, style_name)

    y = draw_dimension_card(c, dim_scores, dominant, supp, y, style_name)
    y = thin_rule(c, y - 4, STONE_DARK)

    if who_sec.get('body'):
        if y < 150: y = new_page(c, style_name); page_num += 1
        y = section_head(c, y, who_sec['heading'] or "Who You Are", TEAL, TEAL_WASH)
        y = pull_quote(c, who_sec['body'], MARGIN, y, CW, TEAL, style_name)
        rest = '\n\n'.join(p.strip() for p in re.split(r'\n\n+', who_sec['body']) if p.strip())[1:]
        rest_ = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', who_sec['body']) if p.strip()][1:])
        if rest_: y = draw_body(c, rest_, MARGIN, y, CW, style_name)
        y -= 12

    draw_footer(c, page_num)

    # ── PAGE 3: HOLDING BACK + WORLD OFFERING ─────────────────────────────────
    c.showPage(); page_num += 1
    c.setFillColor(CREAM); c.rect(0, 0, W, H, stroke=0, fill=1)
    y = draw_header(c, style_name)

    if hold_sec.get('body'):
        y = section_head(c, y, hold_sec['heading'] or "What's Holding You Back", ROSE, ROSE_WASH)
        y = pull_quote(c, hold_sec['body'], MARGIN, y, CW, ROSE, style_name)
        rest_ = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', hold_sec['body']) if p.strip()][1:])
        if rest_: y = draw_body(c, rest_, MARGIN, y, CW, style_name)
        y -= 12

    y = thin_rule(c, y, STONE_DARK)

    if world_sec.get('body'):
        if y < 140: y = new_page(c, style_name); page_num += 1
        y = section_head(c, y, world_sec['heading'] or "What You Offer the World", GOLD, GOLD_WASH)
        y = pull_quote(c, world_sec['body'], MARGIN, y, CW, GOLD, style_name)
        rest_ = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', world_sec['body']) if p.strip()][1:])
        if rest_: y = draw_body(c, rest_, MARGIN, y, CW, style_name)
        y -= 12

    draw_footer(c, page_num)

    # ── PAGE 4: CAREERS ────────────────────────────────────────────────────────
    c.showPage(); page_num += 1
    c.setFillColor(CREAM); c.rect(0, 0, W, H, stroke=0, fill=1)
    y = draw_header(c, style_name)

    if top_careers:
        y = section_head(c, y, "Careers Suggested to You", SKY, SKY_WASH)
        y = draw_career_cards(c, top_careers, y, style_name)
        if moderate:
            y = draw_moderate(c, moderate, MARGIN, y, CW, style_name)
            y -= 8
        if car_sec.get('body'):
            paras_ = [p.strip() for p in re.split(r'\n\n+', car_sec['body']) if p.strip()]
            for para_ in paras_[:4]:
                if y < FLOOR: y = new_page(c, style_name); page_num += 1
                y = draw_block(c, para_, MARGIN, y, "Helvetica", BODY_SZ,
                               INK_MID, CW, style_name=style_name)
                y -= 8
        y -= 12

    draw_footer(c, page_num)

    # ── PAGE 5: ROADMAP + EDUCATION ───────────────────────────────────────────
    c.showPage(); page_num += 1
    c.setFillColor(CREAM); c.rect(0, 0, W, H, stroke=0, fill=1)
    y = draw_header(c, style_name)

    y = section_head(c, y, "Career Roadmap", PLUM, PLUM_WASH)
    y = draw_roadmap(c, top_careers, y, style_name)
    if road_sec.get('body'):
        y = draw_body(c, road_sec['body'], MARGIN, y, CW, style_name)
    y = thin_rule(c, y - 8, STONE_DARK)

    if edu_sec.get('body'):
        if y < 140: y = new_page(c, style_name); page_num += 1
        y = section_head(c, y, edu_sec['heading'] or "Educational Pathway", TEAL, TEAL_WASH)
        y = pull_quote(c, edu_sec['body'], MARGIN, y, CW, TEAL, style_name)
        rest_ = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', edu_sec['body']) if p.strip()][1:])
        if rest_: y = draw_body(c, rest_, MARGIN, y, CW, style_name)
        # Stream chips
        streams = list({s for career in top_careers[:3] for s in (career.get('stream') or [])})
        if streams:
            c.setFont("Helvetica-Bold", 6.5); c.setFillColor(INK_LIGHT)
            c.drawString(MARGIN, y, "RECOMMENDED STREAMS")
            y -= 13
            y = draw_chips(c, streams[:8], MARGIN, y, TEAL, CW, style_name)

    draw_footer(c, page_num)

    # ── PAGE 6: SKILLS + CONCLUSION + PERSONAL NOTE ───────────────────────────
    c.showPage(); page_num += 1
    c.setFillColor(CREAM); c.rect(0, 0, W, H, stroke=0, fill=1)
    y = draw_header(c, style_name)

    if skill_sec.get('body'):
        y = section_head(c, y, skill_sec['heading'] or "Skillset to Build", GOLD, GOLD_WASH)
        raw_lines = skill_sec['body'].split('\n')
        chip_items = []
        for l_ in raw_lines:
            l_ = l_.strip().lstrip('-•*0123456789. ')
            if l_ and len(l_) > 4:
                chip_items.append(l_[:36])
        if chip_items:
            c.setFont("Helvetica-Bold", 6.5); c.setFillColor(INK_LIGHT)
            c.drawString(MARGIN, y, "KEY SKILLS TO DEVELOP")
            y -= 13
            y = draw_chips(c, chip_items[:8], MARGIN, y, GOLD, CW, style_name)
            y -= 4
        y = draw_body(c, skill_sec['body'], MARGIN, y, CW, style_name)
        y -= 12

    y = thin_rule(c, y, TEAL)

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