
# # """
# # WDIG PDF Report Generator v5.0
# # Mirrors the immersive UI report layout exactly.
# # Registered as /generate-pdf on the Flask ML server.
# # """

# # from flask import Flask, request, jsonify, send_file
# # from reportlab.lib.pagesizes import A4
# # from reportlab.lib.styles import ParagraphStyle
# # from reportlab.lib.units import cm, mm
# # from reportlab.lib import colors
# # from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
# # from reportlab.platypus import (
# #     SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
# #     PageBreak, Table, TableStyle, KeepTogether, Flowable
# # )
# # from reportlab.graphics.shapes import (
# #     Drawing, Ellipse, Rect, Line, Polygon, String, Circle,
# #     PolyLine, Path
# # )
# # from reportlab.graphics.charts.spider import SpiderChart
# # from reportlab.graphics import renderPDF
# # import io
# # import re
# # import math

# # # ── Palette (mirrors frontend T tokens) ──────────────────────────────────────
# # INK          = colors.HexColor("#0D1B2A")
# # INK_MID      = colors.HexColor("#2C3E50")
# # INK_LIGHT    = colors.HexColor("#5D7A8A")
# # TEAL         = colors.HexColor("#0A7B6B")
# # TEAL_MID     = colors.HexColor("#14B89A")
# # TEAL_LIGHT   = colors.HexColor("#E8F8F5")
# # GOLD         = colors.HexColor("#C9962B")
# # GOLD_LIGHT   = colors.HexColor("#FEF9EC")
# # ROSE         = colors.HexColor("#C0445A")
# # ROSE_LIGHT   = colors.HexColor("#FDF0F2")
# # SKY          = colors.HexColor("#1A6B9A")
# # SKY_LIGHT    = colors.HexColor("#EDF5FB")
# # PURPLE       = colors.HexColor("#5B3FA0")
# # PURPLE_LIGHT = colors.HexColor("#F3EFFD")
# # CREAM        = colors.HexColor("#FAFAF8")
# # WHITE        = colors.white

# # SECTION_PALETTE = [
# #     (TEAL,   TEAL_LIGHT,   "Who You Are"),
# #     (ROSE,   ROSE_LIGHT,   "What's Holding You Back"),
# #     (GOLD,   GOLD_LIGHT,   "What You Offer the World"),
# #     (SKY,    SKY_LIGHT,    "Careers Suggested to You"),
# #     (PURPLE, PURPLE_LIGHT, "Career Roadmap"),
# #     (TEAL,   TEAL_LIGHT,   "Educational Pathway"),
# #     (GOLD,   GOLD_LIGHT,   "Skillset to Build"),
# # ]

# # CAREER_COLORS = [TEAL, SKY, PURPLE, GOLD, ROSE]

# # W, H = A4  # 595.27 x 841.89 pt

# # # ── Custom Flowables ──────────────────────────────────────────────────────────

# # class ColorBlock(Flowable):
# #     """Filled rectangle used as section headers and banners."""
# #     def __init__(self, width, height, bg_color, radius=12):
# #         super().__init__()
# #         self.width = width
# #         self.height = height
# #         self.bg_color = bg_color
# #         self.radius = radius

# #     def draw(self):
# #         self.canv.setFillColor(self.bg_color)
# #         self.canv.roundRect(0, 0, self.width, self.height, self.radius, stroke=0, fill=1)


# # class SectionHeader(Flowable):
# #     """Coloured header strip for each report section."""
# #     def __init__(self, title, icon, accent, light, page_width, icon_size=20):
# #         super().__init__()
# #         self.title = title
# #         self.icon = icon
# #         self.accent = accent
# #         self.light = light
# #         self.width = page_width
# #         self.height = 52
# #         self.icon_size = icon_size

# #     def draw(self):
# #         c = self.canv
# #         # background
# #         c.setFillColor(self.light)
# #         c.roundRect(0, 0, self.width, self.height, 10, stroke=0, fill=1)
# #         # accent left bar
# #         c.setFillColor(self.accent)
# #         c.roundRect(0, 0, 5, self.height, 3, stroke=0, fill=1)
# #         # icon box
# #         c.setFillColor(self.accent)
# #         c.setFillAlpha(0.18)
# #         c.roundRect(16, 10, 34, 34, 8, stroke=0, fill=1)
# #         c.setFillAlpha(1)
# #         # icon text
# #         c.setFont("Helvetica-Bold", 14)
# #         c.setFillColor(INK)
# #         c.drawString(22, 21, self.icon)
# #         # title
# #         c.setFont("Helvetica-Bold", 14)
# #         c.setFillColor(INK)
# #         c.drawString(62, 19, self.title)
# #         # decorative right bar
# #         c.setFillColor(self.accent)
# #         bar_w, bar_h = 40, 4
# #         c.roundRect(self.width - bar_w - 12, (self.height - bar_h) / 2, bar_w, bar_h, 2, stroke=0, fill=1)


# # class DimensionRadar(Flowable):
# #     """SVG-style radar chart for 6 dimensions."""
# #     def __init__(self, scores, size=150):
# #         super().__init__()
# #         self.scores = scores  # dict {dim: value}
# #         self.size = size
# #         self.width = size
# #         self.height = size

# #     def draw(self):
# #         c = self.canv
# #         dims = list(self.scores.items())
# #         n = len(dims)
# #         if n == 0:
# #             return
# #         cx = self.size / 2
# #         cy = self.size / 2
# #         R = self.size * 0.38

# #         def pt(i, frac):
# #             angle = (math.pi * 2 * i / n) - math.pi / 2
# #             return cx + frac * R * math.cos(angle), cy + frac * R * math.sin(angle)

# #         # Grid rings
# #         for lvl in [0.25, 0.5, 0.75, 1.0]:
# #             pts = [pt(i, lvl) for i in range(n)]
# #             path = c.beginPath()
# #             path.moveTo(*pts[0])
# #             for p in pts[1:]:
# #                 path.lineTo(*p)
# #             path.close()
# #             c.setStrokeColor(TEAL)
# #             c.setStrokeAlpha(0.25)
# #             c.setLineWidth(0.5)
# #             c.drawPath(path, stroke=1, fill=0)

# #         c.setStrokeAlpha(1)

# #         # Spokes
# #         for i in range(n):
# #             ox, oy = cx, cy
# #             ex, ey = pt(i, 1.0)
# #             c.setStrokeColor(TEAL)
# #             c.setStrokeAlpha(0.2)
# #             c.setLineWidth(0.5)
# #             c.line(ox, oy, ex, ey)

# #         c.setStrokeAlpha(1)

# #         # Data polygon
# #         data_pts = [pt(i, dims[i][1] / 100.0) for i in range(n)]
# #         path = c.beginPath()
# #         path.moveTo(*data_pts[0])
# #         for p in data_pts[1:]:
# #             path.lineTo(*p)
# #         path.close()
# #         c.setFillColor(TEAL)
# #         c.setFillAlpha(0.18)
# #         c.setStrokeColor(TEAL)
# #         c.setStrokeAlpha(0.9)
# #         c.setLineWidth(1.5)
# #         c.drawPath(path, stroke=1, fill=1)
# #         c.setFillAlpha(1)
# #         c.setStrokeAlpha(1)

# #         # Dots
# #         for px, py in data_pts:
# #             c.setFillColor(TEAL)
# #             c.circle(px, py, 3, stroke=0, fill=1)

# #         # Labels
# #         c.setFont("Helvetica", 6.5)
# #         c.setFillColor(INK_MID)
# #         for i, (dim, val) in enumerate(dims):
# #             lx, ly = pt(i, 1.22)
# #             label = dim[:4]
# #             c.drawCentredString(lx, ly - 3, label)


# # class TraitBars(Flowable):
# #     """Horizontal bar chart for dominant traits."""
# #     def __init__(self, traits, width=260, bar_h=14, gap=8):
# #         super().__init__()
# #         self.traits = traits[:7]
# #         self.bar_h = bar_h
# #         self.gap = gap
# #         self.label_w = 100
# #         self.bar_w = width - self.label_w - 45
# #         self.width = width
# #         self.height = len(self.traits) * (bar_h + gap) + 10
# #         COLORS_LIST = [TEAL, SKY, PURPLE, GOLD, ROSE, TEAL_MID, INK_MID]
# #         self.colors = COLORS_LIST

# #     def draw(self):
# #         c = self.canv
# #         for i, trait in enumerate(self.traits):
# #             label = trait.get("label", trait.get("trait", ""))[:20]
# #             score = trait.get("score", 0)
# #             col = self.colors[i % len(self.colors)]
# #             y = self.height - 10 - i * (self.bar_h + self.gap)

# #             # label
# #             c.setFont("Helvetica-Bold", 7.5)
# #             c.setFillColor(INK_MID)
# #             c.drawString(0, y + 3, label)

# #             # bg bar
# #             c.setFillColor(col)
# #             c.setFillAlpha(0.12)
# #             c.roundRect(self.label_w, y, self.bar_w, self.bar_h, self.bar_h / 2, stroke=0, fill=1)

# #             # value bar
# #             w = (score / 100) * self.bar_w
# #             c.setFillAlpha(0.82)
# #             c.roundRect(self.label_w, y, w, self.bar_h, self.bar_h / 2, stroke=0, fill=1)
# #             c.setFillAlpha(1)

# #             # score text
# #             c.setFont("Helvetica-Bold", 7.5)
# #             c.setFillColor(col)
# #             c.drawString(self.label_w + self.bar_w + 6, y + 4, f"{score}%")


# # class CareerMindmapFigure(Flowable):
# #     """Simplified mindmap figure for the Career Roadmap section."""
# #     def __init__(self, careers, width=320, height=200):
# #         super().__init__()
# #         self.careers = careers[:3]
# #         self.width = width
# #         self.height = height
# #         COLORS_LIST = [TEAL, SKY, PURPLE]
# #         self.colors = COLORS_LIST

# #     def draw(self):
# #         c = self.canv
# #         cx, cy = self.width / 2, self.height / 2

# #         # Centre node
# #         c.setFillColor(INK)
# #         c.roundRect(cx - 45, cy - 18, 90, 36, 10, stroke=0, fill=1)
# #         c.setFont("Helvetica-Bold", 8)
# #         c.setFillColor(WHITE)
# #         c.drawCentredString(cx, cy + 4, "Your Path")
# #         c.setFont("Helvetica", 6.5)
# #         c.setFillColor(TEAL_MID)
# #         c.drawCentredString(cx, cy - 7, "Career Matches")

# #         positions = [
# #             (cx - 120, cy + 60),
# #             (cx, cy + 80),
# #             (cx + 120, cy + 60),
# #         ]

# #         for i, career in enumerate(self.careers):
# #             nx, ny = positions[i]
# #             col = self.colors[i]
# #             name = (career.get("name") or "")[:18]
# #             score = career.get("score", 0)

# #             # connector line
# #             c.setStrokeColor(col)
# #             c.setStrokeAlpha(0.6)
# #             c.setLineWidth(1.2)
# #             c.setDash(4, 2)
# #             c.line(cx, cy + 18, nx, ny - 14)
# #             c.setDash()
# #             c.setStrokeAlpha(1)

# #             # career node
# #             c.setFillColor(col)
# #             c.setFillAlpha(0.12)
# #             c.setStrokeColor(col)
# #             c.setStrokeAlpha(0.8)
# #             c.setLineWidth(1.5)
# #             c.roundRect(nx - 52, ny - 20, 104, 36, 10, stroke=1, fill=1)
# #             c.setFillAlpha(1)
# #             c.setStrokeAlpha(1)

# #             c.setFont("Helvetica-Bold", 8)
# #             c.setFillColor(INK)
# #             c.drawCentredString(nx, ny - 2, name)
# #             c.setFont("Helvetica", 6.5)
# #             c.setFillColor(col)
# #             c.drawCentredString(nx, ny - 14, f"{score}% match")


# # class SuppBar(Flowable):
# #     """Suppression level bar."""
# #     def __init__(self, level, width=180):
# #         super().__init__()
# #         self.level = level
# #         self.width = width
# #         self.height = 22

# #     def draw(self):
# #         c = self.canv
# #         bar_w = self.width - 40
# #         fill_w = (self.level / 10) * bar_w

# #         c.setFillColor(ROSE)
# #         c.setFillAlpha(0.18)
# #         c.roundRect(0, 6, bar_w, 10, 5, stroke=0, fill=1)
# #         c.setFillAlpha(0.75)
# #         if fill_w > 0:
# #             c.roundRect(0, 6, fill_w, 10, 5, stroke=0, fill=1)
# #         c.setFillAlpha(1)

# #         c.setFont("Helvetica-Bold", 8)
# #         c.setFillColor(ROSE)
# #         c.drawString(bar_w + 6, 8, f"{self.level}/10")


# # class HeroBanner(Flowable):
# #     """Dark hero banner for cover page."""
# #     def __init__(self, thinking_style, secondary_style, top_careers, page_width, page_height=220):
# #         super().__init__()
# #         self.thinking_style = thinking_style
# #         self.secondary_style = secondary_style
# #         self.top_careers = top_careers[:3]
# #         self.width = page_width
# #         self.height = page_height

# #     def draw(self):
# #         c = self.canv
# #         h = self.height

# #         # Dark background
# #         c.setFillColor(INK)
# #         c.roundRect(0, 0, self.width, h, 14, stroke=0, fill=1)

# #         # Subtle gradient overlay circles
# #         for (ox, oy, r, col, alpha) in [
# #             (-40, h + 20, 160, TEAL, 0.07),
# #             (self.width + 30, -30, 130, GOLD, 0.06),
# #             (self.width * 0.55, h * 0.6, 100, SKY, 0.05),
# #         ]:
# #             c.setFillColor(col)
# #             c.setFillAlpha(alpha)
# #             c.circle(ox, oy, r, stroke=0, fill=1)
# #         c.setFillAlpha(1)

# #         # Top label
# #         c.setFont("Helvetica-Bold", 7)
# #         c.setFillColor(TEAL_MID)
# #         c.drawString(28, h - 30, "APTITUDE REPORT")

# #         # Main title
# #         title = self.thinking_style or "Your Profile"
# #         words = title.split()
# #         font_size = 28 if len(title) < 30 else 22
# #         c.setFont("Helvetica-Bold", font_size)
# #         c.setFillColor(WHITE)
# #         # word-wrap if needed
# #         line1 = " ".join(words[:3])
# #         line2 = " ".join(words[3:]) if len(words) > 3 else ""
# #         c.drawString(28, h - 60, line1)
# #         if line2:
# #             c.drawString(28, h - 60 - font_size - 4, line2)

# #         # Secondary style badge
# #         if self.secondary_style:
# #             by = h - 100
# #             c.setFillColor(WHITE)
# #             c.setFillAlpha(0.08)
# #             c.roundRect(28, by, 160, 22, 11, stroke=0, fill=1)
# #             c.setFillAlpha(1)
# #             c.setFont("Helvetica-Bold", 6.5)
# #             c.setFillColor(TEAL_MID)
# #             c.drawString(38, by + 7, "ALSO")
# #             c.setFont("Helvetica", 8)
# #             c.setFillColor(WHITE)
# #             c.setFillAlpha(0.85)
# #             c.drawString(62, by + 7, self.secondary_style[:30])
# #             c.setFillAlpha(1)

# #         # Career chips
# #         chip_x = 28
# #         chip_y = 28
# #         chip_colors = [TEAL_MID, GOLD, SKY]
# #         for i, career in enumerate(self.top_careers):
# #             name = (career.get("name") or "")[:20]
# #             score = career.get("score", 0)
# #             chip_text = f"  {name}  {score}%"
# #             tw = len(chip_text) * 5.5 + 12
# #             c.setFillColor(WHITE)
# #             c.setFillAlpha(0.07)
# #             c.setStrokeColor(chip_colors[i])
# #             c.setStrokeAlpha(0.45)
# #             c.setLineWidth(0.8)
# #             c.roundRect(chip_x, chip_y, tw, 20, 10, stroke=1, fill=1)
# #             c.setFillAlpha(1)
# #             c.setStrokeAlpha(1)
# #             c.setFont("Helvetica", 7)
# #             c.setFillColor(chip_colors[i])
# #             c.drawString(chip_x + 8, chip_y + 6, f"{'⭐🌟✨'[i]} {name}")
# #             c.setFillColor(WHITE)
# #             c.setFillAlpha(0.35)
# #             c.setFont("Helvetica", 6.5)
# #             c.drawString(chip_x + 8 + len(name) * 4.5 + 14, chip_y + 6, f"{score}%")
# #             c.setFillAlpha(1)
# #             chip_x += tw + 8


# # class CareerCard(Flowable):
# #     """Individual career card."""
# #     def __init__(self, career, rank, width=160, height=110):
# #         super().__init__()
# #         self.career = career
# #         self.rank = rank
# #         self.width = width
# #         self.height = height
# #         self.col = CAREER_COLORS[rank % len(CAREER_COLORS)]

# #     def draw(self):
# #         c = self.canv
# #         col = self.col
# #         h = self.height
# #         w = self.width
# #         name = (self.career.get("name") or "")[:22]
# #         domain = (self.career.get("domain") or "")[:18].upper()
# #         score = self.career.get("score", 0)
# #         society = (self.career.get("society_role") or "")[:80]
# #         emerging = self.career.get("emerging", False)

# #         # card bg
# #         c.setFillColor(WHITE)
# #         c.setStrokeColor(col)
# #         c.setStrokeAlpha(0.25)
# #         c.setLineWidth(1.5)
# #         c.roundRect(0, 0, w, h, 12, stroke=1, fill=1)
# #         c.setStrokeAlpha(1)

# #         # coloured top band
# #         c.setFillColor(col)
# #         # clip top band with rounded top
# #         c.roundRect(0, h - 52, w, 52, 12, stroke=0, fill=1)
# #         c.rect(0, h - 52, w, 26, stroke=0, fill=1)  # fill bottom half of band

# #         # domain label
# #         c.setFont("Helvetica-Bold", 6)
# #         c.setFillColor(WHITE)
# #         c.setFillAlpha(0.7)
# #         c.drawString(10, h - 17, domain)
# #         c.setFillAlpha(1)

# #         # career name
# #         c.setFont("Helvetica-Bold", 9)
# #         c.setFillColor(WHITE)
# #         # word wrap
# #         words = name.split()
# #         line1 = " ".join(words[:3])
# #         line2 = " ".join(words[3:])
# #         c.drawString(10, h - 30, line1)
# #         if line2:
# #             c.drawString(10, h - 41, line2)

# #         # score
# #         c.setFont("Helvetica-Bold", 16)
# #         c.setFillColor(WHITE)
# #         c.drawRightString(w - 10, h - 38, f"{score}%")

# #         # society role
# #         c.setFont("Helvetica", 7)
# #         c.setFillColor(INK_LIGHT)
# #         # wrap society text
# #         words_s = society.split()
# #         lines_s = []
# #         cur = ""
# #         for w_word in words_s:
# #             if len(cur) + len(w_word) + 1 < 28:
# #                 cur = (cur + " " + w_word).strip()
# #             else:
# #                 if cur:
# #                     lines_s.append(cur)
# #                 cur = w_word
# #         if cur:
# #             lines_s.append(cur)
# #         for j, line in enumerate(lines_s[:3]):
# #             c.drawString(10, h - 65 - j * 10, line)

# #         # emerging badge
# #         if emerging:
# #             c.setFillColor(SKY_LIGHT)
# #             c.roundRect(8, 8, 70, 14, 7, stroke=0, fill=1)
# #             c.setFont("Helvetica-Bold", 6)
# #             c.setFillColor(SKY)
# #             c.drawString(14, 12, "✨ EMERGING")


# # # ── Style builders ─────────────────────────────────────────────────────────────

# # def make_styles(page_w):
# #     return {
# #         "body": ParagraphStyle(
# #             "body", fontName="Helvetica", fontSize=10,
# #             textColor=INK_MID, leading=16.5, alignment=TA_JUSTIFY,
# #             spaceAfter=10,
# #         ),
# #         "body_italic": ParagraphStyle(
# #             "body_italic", fontName="Helvetica-Oblique", fontSize=10.5,
# #             textColor=INK_MID, leading=17, alignment=TA_JUSTIFY,
# #             spaceAfter=10,
# #         ),
# #         "section_title": ParagraphStyle(
# #             "section_title", fontName="Helvetica-Bold", fontSize=15,
# #             textColor=INK, spaceBefore=4, spaceAfter=6,
# #         ),
# #         "label_sm": ParagraphStyle(
# #             "label_sm", fontName="Helvetica-Bold", fontSize=7,
# #             textColor=INK_LIGHT, leading=10,
# #         ),
# #         "career_name": ParagraphStyle(
# #             "career_name", fontName="Helvetica-Bold", fontSize=12,
# #             textColor=WHITE, leading=14,
# #         ),
# #         "chip": ParagraphStyle(
# #             "chip", fontName="Helvetica-Bold", fontSize=8,
# #             textColor=TEAL, leading=10,
# #         ),
# #         "conclusion": ParagraphStyle(
# #             "conclusion", fontName="Helvetica-Oblique", fontSize=11,
# #             textColor=WHITE, leading=18, alignment=TA_CENTER,
# #             spaceAfter=12,
# #         ),
# #         "stat_val": ParagraphStyle(
# #             "stat_val", fontName="Helvetica-Bold", fontSize=14,
# #             textColor=WHITE, leading=16, fontFamily="serif",
# #         ),
# #         "stat_label": ParagraphStyle(
# #             "stat_label", fontName="Helvetica", fontSize=6.5,
# #             textColor=colors.HexColor("#FFFFFF"),
# #         ),
# #         "footer": ParagraphStyle(
# #             "footer", fontName="Helvetica", fontSize=7.5,
# #             textColor=INK_LIGHT, alignment=TA_CENTER,
# #         ),
# #     }


# # # ── Parser ────────────────────────────────────────────────────────────────────

# # def parse_sections(text):
# #     parts = re.split(r"(?m)^## ", text)
# #     sections = []
# #     for part in parts:
# #         part = part.strip()
# #         if not part:
# #             continue
# #         nl = part.find("\n")
# #         heading = part[:nl].strip().lstrip("0123456789. ").strip() if nl != -1 else part.strip()
# #         body = part[nl + 1:].strip() if nl != -1 else ""
# #         sections.append({"heading": heading, "body": body})
# #     return sections


# # def find_section(sections, *keys):
# #     for s in sections:
# #         h = s["heading"].lower()
# #         if any(k in h for k in keys):
# #             return s
# #     return {"heading": "", "body": ""}


# # def body_to_story(text, styles, accent=None):
# #     """Convert section body text to Paragraph flowables."""
# #     story = []
# #     paras = [p.strip() for p in re.split(r"\n\n+", text) if p.strip()]
# #     for para in paras:
# #         # clean markdown
# #         para = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", para)
# #         para = re.sub(r"\*(.+?)\*", r"<i>\1</i>", para)
# #         story.append(Paragraph(para, styles["body"]))
# #     return story


# # # ── Main generator ─────────────────────────────────────────────────────────────

# # def generate_pdf(report_text: str, thinking_style: str, payload: dict = None) -> bytes:
# #     payload = payload or {}
# #     buffer = io.BytesIO()

# #     margin = 2.2 * cm
# #     page_w = W - 2 * margin
# #     styles = make_styles(page_w)

# #     doc = SimpleDocTemplate(
# #         buffer, pagesize=A4,
# #         leftMargin=margin, rightMargin=margin,
# #         topMargin=1.8 * cm, bottomMargin=2 * cm,
# #         title="WDIG Aptitude Report",
# #         author="WDIG Career Guidance",
# #     )

# #     story = []

# #     # ── pull data ─────────────────────────────────────────────
# #     top_careers    = payload.get("top_careers",    [])
# #     moderate       = payload.get("moderate_careers", [])
# #     dim_scores     = payload.get("dimension_scores", {})
# #     dominant       = payload.get("dominant_traits", [])
# #     supp           = payload.get("suppression",    {})
# #     secondary      = payload.get("thinking_style_secondary", "")
# #     sections       = parse_sections(report_text)

# #     who_sec        = find_section(sections, "who you are", "who")
# #     hold_sec       = find_section(sections, "holding", "back")
# #     world_sec      = find_section(sections, "offer", "world")
# #     career_sec     = find_section(sections, "careers suggested", "career match")
# #     road_sec       = find_section(sections, "roadmap")
# #     edu_sec        = find_section(sections, "educational", "pathway")
# #     skill_sec      = find_section(sections, "skillset", "skill")
# #     conclusion_sec = find_section(sections, "conclusion", "closing")

# #     # ── 1. HERO BANNER ────────────────────────────────────────
# #     story.append(HeroBanner(
# #         thinking_style=thinking_style or "Your Profile",
# #         secondary_style=secondary,
# #         top_careers=top_careers,
# #         page_width=page_w,
# #         page_height=200,
# #     ))
# #     story.append(Spacer(1, 0.5 * cm))

# #     # Stats ribbon (Table)
# #     stats = [
# #         ("Thinking Style", (thinking_style or "—").split()[:2]),
# #         ("Top Career",     [(top_careers[0]["name"] if top_careers else "—")]),
# #         ("Dimensions",     [str(len(dim_scores))]),
# #         ("Top Match",      [f"{top_careers[0]['score']}%" if top_careers else "—"]),
# #     ]
# #     ribbon_data = [[Paragraph(f'<font size="9" color="#5D7A8A">{s[0]}</font>', styles["label_sm"]),
# #                     Paragraph(f'<font size="11"><b>{" ".join(s[1])}</b></font>', styles["body"])]
# #                    for s in stats]
# #     ribbon_t = Table([ribbon_data[0][1:] + ribbon_data[1][1:] + ribbon_data[2][1:] + ribbon_data[3][1:]],
# #                      colWidths=[page_w / 4] * 4)
# #     # Build a simple 2-row ribbon manually
# #     ribbon_rows = []
# #     for s in stats:
# #         ribbon_rows.append([
# #             Paragraph(s[0], styles["label_sm"]),
# #             Paragraph("<b>" + " ".join(s[1]) + "</b>", styles["body"]),
# #         ])
# #     ribbon = Table(
# #         [
# #             [Paragraph(s[0], styles["label_sm"]) for s in stats],
# #             [Paragraph("<b>" + " ".join(s[1]) + "</b>", styles["body"]) for s in stats],
# #         ],
# #         colWidths=[page_w / 4] * 4,
# #     )
# #     ribbon.setStyle(TableStyle([
# #         ("BACKGROUND", (0, 0), (-1, -1), CREAM),
# #         ("TOPPADDING",  (0, 0), (-1, -1), 6),
# #         ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
# #         ("LEFTPADDING",  (0, 0), (-1, -1), 10),
# #         ("RIGHTPADDING", (0, 0), (-1, -1), 10),
# #         ("LINEBELOW", (0, 1), (-1, 1), 0.5, colors.HexColor("#E2EBF0")),
# #         ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2EBF0")),
# #         ("INNERGRID", (0, 0), (-1, -1), 0, WHITE),
# #         ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
# #     ]))
# #     story.append(ribbon)
# #     story.append(Spacer(1, 0.8 * cm))

# #     # ── 2. DIMENSION RADAR + TRAIT BARS ──────────────────────
# #     if dim_scores or dominant:
# #         story.append(SectionHeader("Dimension Profile & Dominant Traits", "📊", TEAL, TEAL_LIGHT, page_w))
# #         story.append(Spacer(1, 0.35 * cm))
# #         radar = DimensionRadar(dim_scores, size=155) if dim_scores else Spacer(0, 0)
# #         bars  = TraitBars(dominant, width=int(page_w * 0.55)) if dominant else Spacer(0, 0)
# #         profile_data = [[radar, bars]]
# #         pt = Table(profile_data, colWidths=[int(page_w * 0.38), int(page_w * 0.60)])
# #         pt.setStyle(TableStyle([
# #             ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
# #             ("LEFTPADDING", (0, 0), (-1, -1), 4),
# #             ("RIGHTPADDING", (0, 0), (-1, -1), 4),
# #         ]))
# #         story.append(pt)
# #         if supp.get("has_suppression"):
# #             story.append(Spacer(1, 0.3 * cm))
# #             story.append(Paragraph(
# #                 f'<font color="#C0445A"><b>Suppression Signal: {supp.get("suppression_level", 0)}/10</b></font>',
# #                 styles["body"]
# #             ))
# #             story.append(SuppBar(supp.get("suppression_level", 0), width=200))
# #         story.append(Spacer(1, 0.8 * cm))

# #     # ── Helper: two-column section card ────────────────────────
# #     def section_card(header_title, header_icon, accent, light, body_text, figure=None, reversed_cols=False):
# #         story.append(SectionHeader(header_title, header_icon, accent, light, page_w))
# #         story.append(Spacer(1, 0.3 * cm))
# #         body_paras = body_to_story(body_text, styles, accent)
# #         if figure:
# #             col_w1 = int(page_w * 0.58)
# #             col_w2 = int(page_w * 0.38)
# #             if reversed_cols:
# #                 row = [[figure, body_paras]]
# #                 cw = [col_w2, col_w1]
# #             else:
# #                 row = [[body_paras, figure]]
# #                 cw = [col_w1, col_w2]
# #             t = Table(row, colWidths=cw)
# #             t.setStyle(TableStyle([
# #                 ("VALIGN", (0, 0), (-1, -1), "TOP"),
# #                 ("LEFTPADDING",  (0, 0), (-1, -1), 4),
# #                 ("RIGHTPADDING", (0, 0), (-1, -1), 4),
# #             ]))
# #             story.append(t)
# #         else:
# #             story.extend(body_paras)
# #         story.append(Spacer(1, 0.7 * cm))

# #     # ── 3. WHO YOU ARE ────────────────────────────────────────
# #     if who_sec["body"]:
# #         section_card("Who You Are", "🧬", TEAL, TEAL_LIGHT, who_sec["body"])

# #     # ── 4. WHAT'S HOLDING YOU BACK ───────────────────────────
# #     if hold_sec["body"]:
# #         section_card("What's Holding You Back", "🔓", ROSE, ROSE_LIGHT, hold_sec["body"], reversed_cols=True)

# #     # ── 5. WHAT YOU OFFER ─────────────────────────────────────
# #     if world_sec["body"]:
# #         section_card("What You Offer the World", "🌍", GOLD, GOLD_LIGHT, world_sec["body"])

# #     # ── 6. CAREER CARDS ───────────────────────────────────────
# #     story.append(SectionHeader("Careers Suggested to You", "🎯", SKY, SKY_LIGHT, page_w))
# #     story.append(Spacer(1, 0.35 * cm))

# #     if top_careers:
# #         card_w = int(page_w / 3) - 8
# #         cards = [CareerCard(c, i, width=card_w, height=115) for i, c in enumerate(top_careers[:3])]
# #         while len(cards) < 3:
# #             cards.append(Spacer(card_w, 115))
# #         ct = Table([cards], colWidths=[card_w + 8] * 3)
# #         ct.setStyle(TableStyle([
# #             ("VALIGN",   (0, 0), (-1, -1), "TOP"),
# #             ("LEFTPADDING",  (0, 0), (-1, -1), 4),
# #             ("RIGHTPADDING", (0, 0), (-1, -1), 4),
# #         ]))
# #         story.append(ct)

# #     if career_sec["body"]:
# #         story.append(Spacer(1, 0.4 * cm))
# #         story.extend(body_to_story(career_sec["body"], styles))

# #     if moderate:
# #         story.append(Spacer(1, 0.3 * cm))
# #         moderate_chips = "  ".join([f"{c.get('name','')[:16]} {c.get('score','')}%" for c in moderate[:5]])
# #         story.append(Paragraph(
# #             f'<font size="7" color="#5D7A8A">Also worth exploring: </font>'
# #             f'<font size="8" color="#5B3FA0"><b>{moderate_chips}</b></font>',
# #             styles["body"]
# #         ))

# #     story.append(Spacer(1, 0.8 * cm))

# #     # ── 7. CAREER ROADMAP (with mindmap figure) ───────────────
# #     story.append(PageBreak())
# #     story.append(SectionHeader("Career Roadmap", "🗺️", PURPLE, PURPLE_LIGHT, page_w))
# #     story.append(Spacer(1, 0.35 * cm))
# #     road_paras = body_to_story(road_sec["body"], styles) if road_sec["body"] else []
# #     mindmap = CareerMindmapFigure(top_careers, width=int(page_w * 0.40), height=185)
# #     road_t = Table(
# #         [[road_paras, mindmap]],
# #         colWidths=[int(page_w * 0.55), int(page_w * 0.42)]
# #     )
# #     road_t.setStyle(TableStyle([
# #         ("VALIGN",  (0, 0), (-1, -1), "TOP"),
# #         ("LEFTPADDING",  (0, 0), (-1, -1), 4),
# #         ("RIGHTPADDING", (0, 0), (-1, -1), 4),
# #     ]))
# #     story.append(road_t)
# #     story.append(Spacer(1, 0.8 * cm))

# #     # ── 8. EDUCATIONAL PATHWAY ────────────────────────────────
# #     if edu_sec["body"]:
# #         section_card("Educational Pathway", "🎓", TEAL, TEAL_LIGHT, edu_sec["body"])

# #     # ── 9. SKILLSET TO BUILD ──────────────────────────────────
# #     if skill_sec["body"]:
# #         section_card("Skillset to Build", "⚡", GOLD, GOLD_LIGHT, skill_sec["body"], reversed_cols=True)

# #     # ── 10. CONCLUSION ────────────────────────────────────────
# #     if conclusion_sec["body"]:
# #         story.append(PageBreak())
# #         # Dark closing block
# #         closing_paras = [p.strip() for p in re.split(r"\n\n+", conclusion_sec["body"]) if p.strip()]
# #         closing_content = []
# #         closing_content.append(Spacer(1, 0.5 * cm))
# #         closing_content.append(Paragraph("✦", ParagraphStyle(
# #             "star", fontName="Helvetica-Bold", fontSize=22,
# #             textColor=TEAL_MID, alignment=TA_CENTER, spaceAfter=12,
# #         )))
# #         closing_content.append(Paragraph("CONCLUSION", ParagraphStyle(
# #             "conc_label", fontName="Helvetica-Bold", fontSize=7,
# #             textColor=TEAL_MID, alignment=TA_CENTER,
# #             letterSpacing=8, spaceAfter=16,
# #         )))
# #         for cp in closing_paras:
# #             cp = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", cp)
# #             closing_content.append(Paragraph(cp, styles["conclusion"]))
# #         closing_content.append(Spacer(1, 0.5 * cm))

# #         # Wrap in dark table cell
# #         dark_t = Table(
# #             [[closing_content]],
# #             colWidths=[page_w],
# #         )
# #         dark_t.setStyle(TableStyle([
# #             ("BACKGROUND",    (0, 0), (-1, -1), INK),
# #             ("ROUNDEDCORNERS",(0, 0), (-1, -1), [14, 14, 14, 14]),
# #             ("TOPPADDING",    (0, 0), (-1, -1), 24),
# #             ("BOTTOMPADDING", (0, 0), (-1, -1), 24),
# #             ("LEFTPADDING",   (0, 0), (-1, -1), 28),
# #             ("RIGHTPADDING",  (0, 0), (-1, -1), 28),
# #         ]))
# #         story.append(dark_t)
# #         story.append(Spacer(1, 0.8 * cm))

# #     # ── FOOTER ────────────────────────────────────────────────
# #     story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
# #     story.append(Paragraph(
# #         "Generated by WDIG Career Guidance · Confidential · For personal use only",
# #         styles["footer"]
# #     ))

# #     doc.build(story)
# #     buffer.seek(0)
# #     return buffer.read()


# # # ── Flask app ─────────────────────────────────────────────────────────────────

# # app = Flask(__name__)

# # @app.route("/generate-pdf", methods=["POST"])
# # def generate_pdf_endpoint():
# #     try:
# #         data = request.get_json()
# #         report_text    = data.get("report", "")
# #         thinking_style = data.get("thinking_style_primary", "Your Profile")

# #         if not report_text:
# #             return jsonify({"error": "report text required"}), 400

# #         pdf_bytes = generate_pdf(report_text, thinking_style, payload=data)

# #         return send_file(
# #             io.BytesIO(pdf_bytes),
# #             mimetype="application/pdf",
# #             as_attachment=True,
# #             download_name="wdig-report.pdf",
# #         )
# #     except Exception as e:
# #         import traceback
# #         traceback.print_exc()
# #         return jsonify({"error": str(e)}), 500


# # @app.route("/health")
# # def health():
# #     return jsonify({"status": "ok", "version": "5.0"})


# # if __name__ == "__main__":
# #     print("🚀 WDIG PDF Generator v5.0 on port 8000")
# #     app.run(port=8000, debug=False)



# """
# WDIG PDF Report Generator v6.0
# Pure canvas-based drawing — no platypus nested-list bugs.
# Every section renders text directly to canvas with word-wrap.
# """

# from flask import Flask, request, jsonify, send_file
# from reportlab.pdfgen import canvas as rl_canvas
# from reportlab.lib.pagesizes import A4
# from reportlab.lib import colors
# import io, re, math, textwrap

# # ── Palette ────────────────────────────────────────────────────────────────────
# INK          = colors.HexColor("#0D1B2A")
# INK_MID      = colors.HexColor("#2C3E50")
# INK_LIGHT    = colors.HexColor("#5D7A8A")
# TEAL         = colors.HexColor("#0A7B6B")
# TEAL_MID     = colors.HexColor("#14B89A")
# TEAL_LIGHT   = colors.HexColor("#E8F8F5")
# GOLD         = colors.HexColor("#C9962B")
# GOLD_LIGHT   = colors.HexColor("#FEF9EC")
# ROSE         = colors.HexColor("#C0445A")
# ROSE_LIGHT   = colors.HexColor("#FDF0F2")
# SKY          = colors.HexColor("#1A6B9A")
# SKY_LIGHT    = colors.HexColor("#EDF5FB")
# PURPLE       = colors.HexColor("#5B3FA0")
# PURPLE_LIGHT = colors.HexColor("#F3EFFD")
# CREAM        = colors.HexColor("#FAFAF8")
# WHITE        = colors.white

# CAREER_COLORS = [TEAL, SKY, PURPLE, GOLD, ROSE]

# W, H = A4   # 595.27 x 841.89 pt
# MARGIN = 36
# CONTENT_W = W - 2 * MARGIN

# # ── Text helpers ───────────────────────────────────────────────────────────────

# def clean_md(text):
#     """Strip markdown bold/italic for plain canvas text."""
#     text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
#     text = re.sub(r'\*(.+?)\*', r'\1', text)
#     return text.strip()

# def wrap_text(text, font, size, max_w):
#     """Word-wrap text to fit max_w points. Returns list of lines."""
#     words = clean_md(text).split()
#     lines, cur = [], ""
#     # approximate char width as size * 0.52 for Helvetica
#     char_w = size * 0.52
#     max_chars = max(1, int(max_w / char_w))
#     for word in words:
#         test = (cur + " " + word).strip()
#         if len(test) <= max_chars:
#             cur = test
#         else:
#             if cur:
#                 lines.append(cur)
#             cur = word
#     if cur:
#         lines.append(cur)
#     return lines

# def draw_wrapped(c, text, x, y, font, size, color, max_w, leading=None, align="left"):
#     """Draw word-wrapped text. Returns final y position."""
#     if leading is None:
#         leading = size * 1.5
#     c.setFont(font, size)
#     c.setFillColor(color)
#     lines = wrap_text(text, font, size, max_w)
#     for line in lines:
#         if align == "center":
#             lw = c.stringWidth(line, font, size)
#             c.drawString(x + (max_w - lw) / 2, y, line)
#         else:
#             c.drawString(x, y, line)
#         y -= leading
#     return y

# def draw_para(c, text, x, y, font="Helvetica", size=10, color=None,
#               max_w=None, leading=None, align="left"):
#     """Draw a paragraph. Returns y after last line."""
#     if color is None:
#         color = INK_MID
#     if max_w is None:
#         max_w = CONTENT_W
#     if leading is None:
#         leading = size * 1.6
#     # split on existing newlines too
#     paras = [p.strip() for p in re.split(r'\n\n+', text) if p.strip()]
#     for para in paras:
#         y = draw_wrapped(c, para, x, y, font, size, color, max_w, leading, align)
#         y -= size * 0.5  # para gap
#     return y

# def draw_section_paras(c, body, x, start_y, max_w):
#     """Draw body text for a section. Returns final y."""
#     y = start_y
#     paras = [p.strip() for p in re.split(r'\n\n+', body) if p.strip()]
#     for para in paras:
#         if y < 80:
#             c.showPage()
#             y = H - MARGIN - 20
#         y = draw_wrapped(c, para, x, y, "Helvetica", 9.5, INK_MID, max_w, leading=15.5)
#         y -= 8
#     return y

# # ── Drawing primitives ─────────────────────────────────────────────────────────

# def rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None, stroke_w=1):
#     if fill_color:
#         c.setFillColor(fill_color)
#     if stroke_color:
#         c.setStrokeColor(stroke_color)
#         c.setLineWidth(stroke_w)
#     c.roundRect(x, y, w, h, r,
#                 stroke=1 if stroke_color else 0,
#                 fill=1 if fill_color else 0)

# def section_header(c, y, title, icon, accent, light, page_w=CONTENT_W, x=MARGIN):
#     """Draw coloured section header strip. Returns y below it."""
#     h = 48
#     rounded_rect(c, x, y - h, page_w, h, 10, fill_color=light)
#     c.setFillColor(accent)
#     c.roundRect(x, y - h, 5, h, 3, stroke=0, fill=1)
#     # icon box
#     c.setFillColor(accent)
#     c.saveState()
#     c.setFillAlpha(0.2)
#     c.roundRect(x + 14, y - h + 8, 32, 32, 7, stroke=0, fill=1)
#     c.restoreState()
#     c.setFont("Helvetica", 14)
#     c.setFillColor(INK)
#     c.drawString(x + 20, y - h + 15, icon)
#     c.setFont("Helvetica-Bold", 13)
#     c.setFillColor(INK)
#     c.drawString(x + 56, y - h + 18, title)
#     # right accent bar
#     c.setFillColor(accent)
#     c.roundRect(x + page_w - 48, y - h + 22, 38, 4, 2, stroke=0, fill=1)
#     return y - h - 10

# def divider(c, y, accent=None, x=MARGIN, w=CONTENT_W):
#     """Thin decorative divider line."""
#     col = accent or colors.HexColor("#E2EBF0")
#     c.setStrokeColor(col)
#     c.setLineWidth(0.5)
#     c.line(x, y, x + w, y)
#     return y - 8

# # ── FIGURE: Radar chart ────────────────────────────────────────────────────────

# def draw_radar(c, scores, cx, cy, R=55):
#     """Draw dimension radar chart centred at cx,cy."""
#     items = list(scores.items())
#     n = len(items)
#     if n == 0:
#         return

#     def pt(i, frac):
#         angle = (math.pi * 2 * i / n) - math.pi / 2
#         return cx + frac * R * math.cos(angle), cy + frac * R * math.sin(angle)

#     # grid
#     for lvl in [0.25, 0.5, 0.75, 1.0]:
#         pts = [pt(i, lvl) for i in range(n)]
#         path = c.beginPath()
#         path.moveTo(*pts[0])
#         for p in pts[1:]:
#             path.lineTo(*p)
#         path.close()
#         c.setStrokeColor(TEAL)
#         c.saveState(); c.setStrokeAlpha(0.2); c.setLineWidth(0.5)
#         c.drawPath(path, stroke=1, fill=0)
#         c.restoreState()

#     # spokes
#     for i in range(n):
#         ex, ey = pt(i, 1.0)
#         c.saveState(); c.setStrokeColor(TEAL); c.setStrokeAlpha(0.15); c.setLineWidth(0.4)
#         c.line(cx, cy, ex, ey)
#         c.restoreState()

#     # data
#     data_pts = [pt(i, items[i][1] / 100.0) for i in range(n)]
#     path = c.beginPath()
#     path.moveTo(*data_pts[0])
#     for p in data_pts[1:]:
#         path.lineTo(*p)
#     path.close()
#     c.saveState()
#     c.setFillColor(TEAL); c.setFillAlpha(0.18)
#     c.setStrokeColor(TEAL); c.setStrokeAlpha(0.9); c.setLineWidth(1.4)
#     c.drawPath(path, stroke=1, fill=1)
#     c.restoreState()

#     for px, py in data_pts:
#         c.setFillColor(TEAL)
#         c.circle(px, py, 2.5, stroke=0, fill=1)

#     # labels
#     c.setFont("Helvetica", 6)
#     c.setFillColor(INK_MID)
#     for i, (dim, val) in enumerate(items):
#         lx, ly = pt(i, 1.3)
#         label = dim[:4]
#         lw = c.stringWidth(label, "Helvetica", 6)
#         c.drawString(lx - lw / 2, ly - 3, label)

# # ── FIGURE: Trait bars ────────────────────────────────────────────────────────

# def draw_trait_bars(c, traits, x, y, bar_w=180, bar_h=11, gap=7):
#     """Draw horizontal trait bars. Returns final y."""
#     trait_colors = [TEAL, SKY, PURPLE, GOLD, ROSE, TEAL_MID, INK_MID]
#     for i, trait in enumerate(traits[:7]):
#         label = clean_md(trait.get("label", trait.get("trait", "")))[:22]
#         score = trait.get("score", 0)
#         col = trait_colors[i % len(trait_colors)]
#         # label
#         c.setFont("Helvetica-Bold", 7)
#         c.setFillColor(INK_MID)
#         c.drawString(x, y + 2, label)
#         # bg
#         c.setFillColor(col)
#         c.saveState(); c.setFillAlpha(0.12)
#         c.roundRect(x + 105, y, bar_w, bar_h, bar_h / 2, stroke=0, fill=1)
#         c.restoreState()
#         # fill
#         fill = max(4, (score / 100) * bar_w)
#         c.saveState(); c.setFillColor(col); c.setFillAlpha(0.85)
#         c.roundRect(x + 105, y, fill, bar_h, bar_h / 2, stroke=0, fill=1)
#         c.restoreState()
#         # score
#         c.setFont("Helvetica-Bold", 7)
#         c.setFillColor(col)
#         c.drawString(x + 105 + bar_w + 5, y + 2, f"{score}%")
#         y -= bar_h + gap
#     return y

# # ── FIGURE: Career cards row ──────────────────────────────────────────────────

# def draw_career_cards(c, careers, y, x=MARGIN, total_w=CONTENT_W):
#     """Draw a row of career cards. Returns y below them."""
#     n = min(len(careers), 3)
#     if n == 0:
#         return y
#     card_gap = 10
#     card_w = (total_w - card_gap * (n - 1)) / n
#     card_h = 110
#     for i, career in enumerate(careers[:n]):
#         col = CAREER_COLORS[i % len(CAREER_COLORS)]
#         cx_card = x + i * (card_w + card_gap)
#         cy_card = y - card_h
#         # card bg
#         c.setFillColor(WHITE)
#         c.setStrokeColor(col)
#         c.saveState(); c.setStrokeAlpha(0.3); c.setLineWidth(1.5)
#         c.roundRect(cx_card, cy_card, card_w, card_h, 10, stroke=1, fill=1)
#         c.restoreState()
#         # top band
#         c.setFillColor(col)
#         c.roundRect(cx_card, cy_card + card_h - 52, card_w, 52, 10, stroke=0, fill=1)
#         c.rect(cx_card, cy_card + card_h - 52, card_w, 26, stroke=0, fill=1)
#         # domain
#         c.setFont("Helvetica-Bold", 5.5)
#         c.setFillColor(WHITE); c.saveState(); c.setFillAlpha(0.75)
#         domain = (career.get("domain") or "")[:20].upper()
#         c.drawString(cx_card + 8, cy_card + card_h - 15, domain)
#         c.restoreState()
#         # name
#         name = clean_md(career.get("name") or "")
#         words = name.split()
#         line1 = " ".join(words[:3]); line2 = " ".join(words[3:])
#         c.setFont("Helvetica-Bold", 9); c.setFillColor(WHITE)
#         c.drawString(cx_card + 8, cy_card + card_h - 28, line1[:22])
#         if line2:
#             c.drawString(cx_card + 8, cy_card + card_h - 39, line2[:22])
#         # score
#         score_text = f"{career.get('score', 0)}%"
#         sw = c.stringWidth(score_text, "Helvetica-Bold", 15)
#         c.setFont("Helvetica-Bold", 15); c.setFillColor(WHITE)
#         c.drawString(cx_card + card_w - sw - 8, cy_card + card_h - 42, score_text)
#         # society role
#         society = clean_md(career.get("society_role") or "")
#         c.setFont("Helvetica", 6.5); c.setFillColor(INK_LIGHT)
#         slines = wrap_text(society, "Helvetica", 6.5, card_w - 16)
#         sy = cy_card + card_h - 62
#         for sl in slines[:3]:
#             c.drawString(cx_card + 8, sy, sl)
#             sy -= 10
#         # emerging
#         if career.get("emerging"):
#             c.setFillColor(SKY_LIGHT)
#             c.roundRect(cx_card + 8, cy_card + 8, 65, 13, 6, stroke=0, fill=1)
#             c.setFont("Helvetica-Bold", 5.5); c.setFillColor(SKY)
#             c.drawString(cx_card + 13, cy_card + 12, "EMERGING")

#     return y - card_h - 12

# # ── FIGURE: Roadmap infographic (like the image reference) ────────────────────

# def draw_roadmap_infographic(c, careers, y, x=MARGIN, total_w=CONTENT_W):
#     """Draw a step-by-step road infographic like the reference image."""
#     steps = careers[:4]
#     n = len(steps)
#     if n == 0:
#         return y

#     road_h = 130
#     step_w = total_w / n
#     road_y = y - road_h

#     STEP_COLORS = [
#         colors.HexColor("#8CC63F"),  # yellow-green
#         colors.HexColor("#00A88A"),  # teal-green
#         colors.HexColor("#1A6B9A"),  # blue
#         colors.HexColor("#0D1B2A"),  # dark navy
#     ]

#     # Draw road path
#     road_lane_y = road_y + road_h * 0.38
#     road_lane_h = 22
#     road_color = colors.HexColor("#C8D6DC")

#     # road background segments (each rises up at step markers)
#     # We'll draw a connected winding path
#     seg_w = step_w
#     seg_ups = [0, 18, 36, 54]  # cumulative rise per step

#     # Build road as a series of connected horizontal + transition segments
#     def road_segment(i, x0, y0, x1, y1, col):
#         # Draw filled trapezoid / rect between (x0,y0) and (x1,y1)
#         half = road_lane_h / 2
#         pts = [
#             (x0, y0 - half), (x1, y1 - half),
#             (x1, y1 + half), (x0, y0 + half)
#         ]
#         path = c.beginPath()
#         path.moveTo(*pts[0])
#         for p in pts[1:]:
#             path.lineTo(*p)
#         path.close()
#         c.setFillColor(col)
#         c.drawPath(path, stroke=0, fill=1)

#     # road center y positions per step
#     ry = [road_lane_y + i * 18 for i in range(n)]

#     for i in range(n):
#         col = STEP_COLORS[i % len(STEP_COLORS)]
#         rx0 = x + i * seg_w
#         rx1 = x + (i + 1) * seg_w
#         if i < n - 1:
#             # draw segment
#             road_segment(i, rx0, ry[i], rx1, ry[i + 1], road_color)
#             # dashed center line
#             c.saveState()
#             c.setStrokeColor(WHITE); c.setLineWidth(1.5)
#             c.setDash(5, 4)
#             for dash_x in range(int(rx0) + 8, int(rx1) - 8, 14):
#                 c.line(dash_x, ry[i], dash_x + 6, ry[i])
#             c.setDash()
#             c.restoreState()
#         # last segment
#         if i == n - 1:
#             road_segment(i, rx0, ry[i], rx1, ry[i], road_color)
#             c.saveState()
#             c.setStrokeColor(WHITE); c.setLineWidth(1.5)
#             c.setDash(5, 4)
#             for dash_x in range(int(rx0) + 8, int(rx1) - 8, 14):
#                 c.line(dash_x, ry[i], dash_x + 6, ry[i])
#             c.setDash()
#             c.restoreState()

#     # Now draw flags and step numbers
#     for i, step in enumerate(steps):
#         col = STEP_COLORS[i % len(STEP_COLORS)]
#         flag_x = x + i * seg_w + seg_w * 0.3
#         flag_base_y = ry[i] + road_lane_h / 2

#         # Dashed vertical pole
#         c.saveState()
#         c.setStrokeColor(col); c.setStrokeAlpha(0.6); c.setLineWidth(1)
#         c.setDash(3, 2)
#         c.line(flag_x, flag_base_y, flag_x, flag_base_y + 35)
#         c.setDash(); c.restoreState()

#         # Flag (triangle pointing right)
#         flag_tip_x = flag_x + 18
#         flag_top_y = flag_base_y + 50
#         flag_bot_y = flag_base_y + 34
#         path = c.beginPath()
#         path.moveTo(flag_x, flag_top_y)
#         path.lineTo(flag_tip_x, (flag_top_y + flag_bot_y) / 2)
#         path.lineTo(flag_x, flag_bot_y)
#         path.close()
#         c.setFillColor(col)
#         c.drawPath(path, stroke=0, fill=1)

#         # Step number above flag
#         num_text = f"0{i+1}"
#         c.setFont("Helvetica-Bold", 16)
#         c.setFillColor(col)
#         nw = c.stringWidth(num_text, "Helvetica-Bold", 16)
#         c.drawString(flag_x - nw / 2 - 10, flag_base_y + 56, num_text)

#     # Bottom labels
#     label_y = road_y - 14
#     for i, step in enumerate(steps):
#         col = STEP_COLORS[i % len(STEP_COLORS)]
#         lx = x + i * seg_w + 6
#         name = clean_md(step.get("name") or f"Step {i+1}")
#         c.setFont("Helvetica-Bold", 8.5)
#         c.setFillColor(INK)
#         # wrap name
#         wlines = wrap_text(name, "Helvetica-Bold", 8.5, seg_w - 10)
#         ly = label_y
#         for wl in wlines[:2]:
#             c.drawString(lx, ly, wl)
#             ly -= 11
#         # score
#         c.setFont("Helvetica", 7.5)
#         c.setFillColor(col)
#         c.drawString(lx, ly - 2, f"{step.get('score', 0)}% match")

#     return road_y - 55

# # ── FIGURE: Suppression gauge ─────────────────────────────────────────────────

# def draw_supp_gauge(c, level, x, y, w=160):
#     """Draw suppression level gauge bar."""
#     bar_h = 10
#     fill = (level / 10) * w
#     c.setFillColor(ROSE); c.saveState(); c.setFillAlpha(0.15)
#     c.roundRect(x, y, w, bar_h, bar_h / 2, stroke=0, fill=1)
#     c.restoreState()
#     if fill > 2:
#         c.setFillColor(ROSE); c.saveState(); c.setFillAlpha(0.75)
#         c.roundRect(x, y, fill, bar_h, bar_h / 2, stroke=0, fill=1)
#         c.restoreState()
#     c.setFont("Helvetica-Bold", 8)
#     c.setFillColor(ROSE)
#     c.drawString(x + w + 6, y + 2, f"{level}/10")

# # ── FIGURE: Skill chips ───────────────────────────────────────────────────────

# def draw_skill_chips(c, skills, x, y, accent, max_w):
#     """Draw pill-shaped skill chips. Returns final y."""
#     chip_h, pad_x, pad_y, gap = 18, 10, 4, 6
#     cx = x
#     row_y = y
#     for skill in skills:
#         label = clean_md(skill.get("label", skill) if isinstance(skill, dict) else skill)
#         c.setFont("Helvetica-Bold", 7.5)
#         tw = c.stringWidth(label, "Helvetica-Bold", 7.5)
#         cw = tw + 2 * pad_x
#         if cx + cw > x + max_w:
#             cx = x
#             row_y -= chip_h + gap
#         c.setFillColor(accent); c.saveState(); c.setFillAlpha(0.12)
#         c.roundRect(cx, row_y, cw, chip_h, chip_h / 2, stroke=0, fill=1)
#         c.restoreState()
#         c.setStrokeColor(accent); c.saveState(); c.setStrokeAlpha(0.3); c.setLineWidth(0.8)
#         c.roundRect(cx, row_y, cw, chip_h, chip_h / 2, stroke=1, fill=0)
#         c.restoreState()
#         c.setFillColor(accent); c.setFont("Helvetica-Bold", 7.5)
#         c.drawString(cx + pad_x, row_y + pad_y + 1, label)
#         cx += cw + gap
#     return row_y - chip_h - 8

# # ── FIGURE: Quote card ────────────────────────────────────────────────────────

# def draw_quote_card(c, text, x, y, w, accent):
#     """Draw a highlighted insight card. Returns y below it."""
#     paras = [p.strip() for p in re.split(r'\n\n+', clean_md(text)) if p.strip()]
#     snippet = paras[0][:220] if paras else ""
#     lines = wrap_text(snippet, "Helvetica-Oblique", 9.5, w - 30)
#     h = max(50, len(lines) * 14 + 24)
#     c.setFillColor(accent); c.saveState(); c.setFillAlpha(0.07)
#     c.roundRect(x, y - h, w, h, 10, stroke=0, fill=1)
#     c.restoreState()
#     c.setFillColor(accent)
#     c.roundRect(x, y - h, 4, h, 2, stroke=0, fill=1)
#     c.setFont("Helvetica-Oblique", 9.5); c.setFillColor(INK_MID)
#     ty = y - 14
#     for line in lines:
#         c.drawString(x + 14, ty, line)
#         ty -= 14
#     return y - h - 10

# # ── Page header (runs on each page) ──────────────────────────────────────────

# def page_header(c, style_name):
#     """Draw thin top bar and report title on each page."""
#     c.setFillColor(INK)
#     c.rect(0, H - 8, W, 8, stroke=0, fill=1)
#     c.setFillColor(TEAL_MID)
#     c.rect(0, H - 8, W * 0.35, 8, stroke=0, fill=1)
#     c.setFont("Helvetica", 7); c.setFillColor(INK_LIGHT)
#     c.drawString(MARGIN, H - 20, f"WDIG Aptitude Report  ·  {style_name[:40]}")
#     # right side
#     c.setFont("Helvetica", 7); c.setFillColor(INK_LIGHT)
#     c.drawRightString(W - MARGIN, H - 20, "Confidential")
#     return H - 32

# # ── Section renderer ──────────────────────────────────────────────────────────

# def render_section(c, title, icon, accent, light, body, y,
#                    extra_fn=None, style_name=""):
#     """Render a full section. Handles page breaks. Returns final y."""
#     if y < 160:
#         c.showPage()
#         y = page_header(c, style_name)
#         y -= 14

#     y = section_header(c, y, title, icon, accent, light)

#     if extra_fn:
#         y_before = y
#         y = extra_fn(c, y)
#         if y < 100:
#             c.showPage()
#             y = page_header(c, style_name)
#             y -= 20

#     if body:
#         paras = [p.strip() for p in re.split(r'\n\n+', body) if p.strip()]
#         for para in paras:
#             lines = wrap_text(para, "Helvetica", 9.5, CONTENT_W)
#             needed = len(lines) * 15.5 + 12
#             if y - needed < 80:
#                 c.showPage()
#                 y = page_header(c, style_name)
#                 y -= 20
#             y = draw_wrapped(c, para, MARGIN, y, "Helvetica", 9.5, INK_MID,
#                               CONTENT_W, leading=15.5)
#             y -= 8

#     return y - 14

# # ── Section parser ────────────────────────────────────────────────────────────

# def parse_sections(text):
#     parts = re.split(r'(?m)^## ', text)
#     out = []
#     for part in parts:
#         part = part.strip()
#         if not part:
#             continue
#         nl = part.find('\n')
#         heading = part[:nl].strip().lstrip('0123456789. ').strip() if nl != -1 else part
#         body = part[nl+1:].strip() if nl != -1 else ''
#         out.append({'heading': heading, 'body': body})
#     return out

# def find_sec(sections, *keys):
#     for s in sections:
#         h = s['heading'].lower()
#         if any(k in h for k in keys):
#             return s
#     return {'heading': '', 'body': ''}

# # ── Hero banner ───────────────────────────────────────────────────────────────

# def draw_hero(c, thinking_style, secondary, top_careers, style_name):
#     """Draw full-width dark hero on page 1. Returns y below it."""
#     bh = 195
#     by = H - bh

#     # Dark bg
#     c.setFillColor(INK)
#     c.rect(0, by, W, bh, stroke=0, fill=1)

#     # Decorative orbs
#     orbs = [(-30, H - 40, 150, TEAL, 0.08),
#             (W + 20, H - 80, 110, GOLD, 0.07),
#             (W * 0.55, H - 120, 90, SKY, 0.06)]
#     for ox, oy, r, col, alpha in orbs:
#         c.setFillColor(col); c.saveState(); c.setFillAlpha(alpha)
#         c.circle(ox, oy, r, stroke=0, fill=1)
#         c.restoreState()

#     # Top label
#     c.setFont("Helvetica-Bold", 7); c.setFillColor(TEAL_MID)
#     c.drawString(MARGIN, H - 22, "APTITUDE REPORT")

#     # Main title
#     title = thinking_style or "Your Profile"
#     words = title.split()
#     fs = 26 if len(title) < 32 else 20
#     c.setFont("Helvetica-Bold", fs); c.setFillColor(WHITE)
#     line1 = " ".join(words[:3])
#     line2 = " ".join(words[3:]) if len(words) > 3 else ""
#     c.drawString(MARGIN, H - 48, line1)
#     if line2:
#         c.drawString(MARGIN, H - 48 - fs - 4, line2)

#     # Secondary badge
#     if secondary:
#         badge_y = H - 95
#         bw = min(180, len(secondary) * 5.5 + 30)
#         c.setFillColor(WHITE); c.saveState(); c.setFillAlpha(0.08)
#         c.roundRect(MARGIN, badge_y, bw, 20, 10, stroke=0, fill=1)
#         c.restoreState()
#         c.setFont("Helvetica-Bold", 6.5); c.setFillColor(TEAL_MID)
#         c.drawString(MARGIN + 10, badge_y + 6, "ALSO")
#         c.setFont("Helvetica", 8); c.setFillColor(WHITE); c.saveState(); c.setFillAlpha(0.85)
#         c.drawString(MARGIN + 32, badge_y + 6, secondary[:35])
#         c.restoreState()

#     # Career chips
#     chip_x = MARGIN
#     chip_y = by + 18
#     chip_cols = [TEAL_MID, GOLD, SKY]
#     for i, career in enumerate(top_careers[:3]):
#         name = clean_md(career.get('name') or '')[:20]
#         score = career.get('score', 0)
#         chip_text = f"  {name}  {score}%"
#         cw = min(160, len(chip_text) * 5 + 18)
#         c.setFillColor(WHITE); c.saveState(); c.setFillAlpha(0.06)
#         c.setStrokeColor(chip_cols[i]); c.setStrokeAlpha(0.45); c.setLineWidth(0.8)
#         c.roundRect(chip_x, chip_y, cw, 18, 9, stroke=1, fill=1)
#         c.restoreState()
#         c.setFont("Helvetica", 7); c.setFillColor(chip_cols[i])
#         c.drawString(chip_x + 8, chip_y + 5, f"{'* * *'[i*2:i*2+1]} {name} {score}%")
#         chip_x += cw + 8

#     # Stats bar at bottom of hero
#     stats = [
#         ("Thinking Style", (thinking_style or "—")[:22]),
#         ("Top Match", top_careers[0]["name"][:20] if top_careers else "—"),
#         ("Match Score", f"{top_careers[0].get('score','—')}%" if top_careers else "—"),
#     ]
#     bar_y = by
#     seg_w = CONTENT_W / len(stats)
#     for i, (lbl, val) in enumerate(stats):
#         sx = MARGIN + i * seg_w
#         c.setFillColor(WHITE); c.saveState(); c.setFillAlpha(0.04)
#         c.rect(sx, bar_y, seg_w, 0, stroke=0, fill=0)  # no fill, just border
#         c.restoreState()
#         if i > 0:
#             c.setStrokeColor(WHITE); c.saveState(); c.setStrokeAlpha(0.08); c.setLineWidth(0.5)
#             c.line(sx, bar_y + 4, sx, bar_y + bh * 0.18)
#             c.restoreState()
#         c.setFont("Helvetica", 6); c.setFillColor(WHITE); c.saveState(); c.setFillAlpha(0.4)
#         c.drawString(sx + 8, bar_y + 14, lbl)
#         c.restoreState()
#         c.setFont("Helvetica-Bold", 8.5); c.setFillColor(WHITE); c.saveState(); c.setFillAlpha(0.85)
#         c.drawString(sx + 8, bar_y + 4, val)
#         c.restoreState()

#     return by - 16

# # ── Main generate function ─────────────────────────────────────────────────────

# def generate_pdf(report_text: str, thinking_style: str, payload: dict = None) -> bytes:
#     payload = payload or {}
#     buf = io.BytesIO()

#     top_careers  = payload.get('top_careers', [])
#     moderate     = payload.get('moderate_careers', [])
#     dim_scores   = payload.get('dimension_scores', {})
#     dominant     = payload.get('dominant_traits', [])
#     supp         = payload.get('suppression', {})
#     secondary    = payload.get('thinking_style_secondary', '')
#     sections     = parse_sections(report_text)

#     who_sec  = find_sec(sections, 'who you are', 'who')
#     hold_sec = find_sec(sections, 'holding', 'back')
#     world_sec= find_sec(sections, 'offer', 'world')
#     career_sec = find_sec(sections, 'careers suggested', 'career match')
#     road_sec = find_sec(sections, 'roadmap')
#     edu_sec  = find_sec(sections, 'educational', 'pathway')
#     skill_sec= find_sec(sections, 'skillset', 'skill')
#     conc_sec = find_sec(sections, 'conclusion', 'closing')

#     style_name = thinking_style or "Your Profile"

#     c = rl_canvas.Canvas(buf, pagesize=A4)
#     c.setTitle("WDIG Aptitude Report")
#     c.setAuthor("WDIG Career Guidance")

#     # ─────────── PAGE 1: HERO + PROFILE ────────────────────────────────
#     y = draw_hero(c, thinking_style, secondary, top_careers, style_name)

#     # Divider
#     y = divider(c, y, TEAL_MID)

#     # Radar + Trait bars side by side
#     col_mid = MARGIN + CONTENT_W * 0.42
#     col2_x  = col_mid + 10
#     col2_w  = CONTENT_W - CONTENT_W * 0.42 - 10

#     if dim_scores:
#         c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_LIGHT)
#         c.drawString(MARGIN, y, "DIMENSION PROFILE")
#         draw_radar(c, dim_scores, MARGIN + 65, y - 70, R=58)
#         y_after_radar = y - 145
#     else:
#         y_after_radar = y

#     if dominant:
#         c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_LIGHT)
#         c.drawString(col2_x, y, "DOMINANT TRAITS")
#         y_bars = draw_trait_bars(c, dominant, col2_x, y - 16, bar_w=165)
#     else:
#         y_bars = y_after_radar

#     if supp.get('has_suppression'):
#         sx = col2_x
#         sy = min(y_bars, y_after_radar) - 8
#         c.setFont("Helvetica-Bold", 7); c.setFillColor(ROSE)
#         c.drawString(sx, sy, f"SUPPRESSION SIGNAL  {supp.get('suppression_level',0)}/10")
#         draw_supp_gauge(c, supp.get('suppression_level', 0), sx, sy - 16)
#         y_bottom = sy - 36
#     else:
#         y_bottom = min(y_bars, y_after_radar)

#     y = y_bottom - 16
#     y = divider(c, y)

#     # ── WHO YOU ARE ────────────────────────────────────────────────────
#     if who_sec['body']:
#         y = render_section(c, "Who You Are", chr(0x1F9EC), TEAL, TEAL_LIGHT,
#                            who_sec['body'], y, style_name=style_name)

#     # ── WHAT'S HOLDING YOU BACK ────────────────────────────────────────
#     if hold_sec['body']:
#         # quote card for first paragraph
#         def hold_extra(c2, ey):
#             paras = [p.strip() for p in re.split(r'\n\n+', hold_sec['body']) if p.strip()]
#             if paras:
#                 ey = draw_quote_card(c2, paras[0], MARGIN, ey, CONTENT_W, ROSE)
#             return ey
#         remaining = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', hold_sec['body']) if p.strip()][1:])
#         y = render_section(c, "What's Holding You Back", "!", ROSE, ROSE_LIGHT,
#                            remaining, y, extra_fn=hold_extra, style_name=style_name)

#     # ─────────── PAGE 2: CAREERS + ROADMAP ────────────────────────────
#     c.showPage()
#     y = page_header(c, style_name)
#     y -= 10

#     # ── WHAT YOU OFFER ─────────────────────────────────────────────────
#     if world_sec['body']:
#         def world_extra(c2, ey):
#             paras = [p.strip() for p in re.split(r'\n\n+', world_sec['body']) if p.strip()]
#             if paras:
#                 ey = draw_quote_card(c2, paras[0], MARGIN, ey, CONTENT_W, GOLD)
#             return ey
#         remaining_world = '\n\n'.join([p.strip() for p in re.split(r'\n\n+', world_sec['body']) if p.strip()][1:])
#         y = render_section(c, "What You Offer the World", "G", GOLD, GOLD_LIGHT,
#                            remaining_world, y, extra_fn=world_extra, style_name=style_name)

#     # ── CAREER CARDS ───────────────────────────────────────────────────
#     if top_careers:
#         if y < 160:
#             c.showPage(); y = page_header(c, style_name); y -= 10
#         y = section_header(c, y, "Careers Suggested to You", "T", SKY, SKY_LIGHT)
#         y = draw_career_cards(c, top_careers, y)

#         # moderate chips
#         if moderate:
#             c.setFont("Helvetica-Bold", 7); c.setFillColor(INK_LIGHT)
#             c.drawString(MARGIN, y, "ALSO WORTH EXPLORING")
#             y -= 14
#             mod_skills = [{'label': f"{m.get('name','')[:16]}  {m.get('score','')}%"} for m in moderate[:6]]
#             y = draw_skill_chips(c, mod_skills, MARGIN, y, PURPLE, CONTENT_W)

#         if career_sec['body']:
#             y -= 6
#             paras = [p.strip() for p in re.split(r'\n\n+', career_sec['body']) if p.strip()]
#             for para in paras[:3]:   # first 3 paras of career section
#                 if y < 80:
#                     c.showPage(); y = page_header(c, style_name); y -= 20
#                 y = draw_wrapped(c, para, MARGIN, y, "Helvetica", 9.5, INK_MID,
#                                   CONTENT_W, leading=15.5)
#                 y -= 8

#     # ─────────── PAGE 3: ROADMAP + EDUCATION ──────────────────────────
#     c.showPage()
#     y = page_header(c, style_name)
#     y -= 10

#     # ── CAREER ROADMAP ─────────────────────────────────────────────────
#     if y < 200:
#         c.showPage(); y = page_header(c, style_name); y -= 10

#     y = section_header(c, y, "Career Roadmap", "M", PURPLE, PURPLE_LIGHT)

#     # ROADMAP INFOGRAPHIC
#     y = draw_roadmap_infographic(c, top_careers, y)
#     y -= 8

#     # roadmap prose text
#     if road_sec['body']:
#         paras = [p.strip() for p in re.split(r'\n\n+', road_sec['body']) if p.strip()]
#         for para in paras:
#             if y < 80:
#                 c.showPage(); y = page_header(c, style_name); y -= 20
#             y = draw_wrapped(c, para, MARGIN, y, "Helvetica", 9.5, INK_MID,
#                               CONTENT_W, leading=15.5)
#             y -= 8

#     y -= 10
#     y = divider(c, y, PURPLE)

#     # ── EDUCATIONAL PATHWAY ────────────────────────────────────────────
#     if edu_sec['body']:
#         y = render_section(c, "Educational Pathway", "D", TEAL, TEAL_LIGHT,
#                            edu_sec['body'], y, style_name=style_name)

#     # ─────────── PAGE 4: SKILLS + CONCLUSION ──────────────────────────
#     c.showPage()
#     y = page_header(c, style_name)
#     y -= 10

#     # ── SKILLSET TO BUILD ──────────────────────────────────────────────
#     if skill_sec['body']:
#         # Extract skill-like phrases from the body for chip display
#         skill_lines = [l.strip().lstrip('-•*') for l in skill_sec['body'].split('\n')
#                        if l.strip().startswith(('-', '•', '*')) or
#                        re.match(r'^\d+\.', l.strip())]
#         skill_chips_data = [{'label': sl[:28]} for sl in skill_lines[:8] if sl]

#         def skill_extra(c2, ey):
#             if skill_chips_data:
#                 c2.setFont("Helvetica-Bold", 7); c2.setFillColor(INK_LIGHT)
#                 c2.drawString(MARGIN, ey, "KEY SKILLS TO DEVELOP")
#                 ey -= 14
#                 ey = draw_skill_chips(c2, skill_chips_data, MARGIN, ey, GOLD, CONTENT_W)
#             return ey - 6

#         y = render_section(c, "Skillset to Build", "Z", GOLD, GOLD_LIGHT,
#                            skill_sec['body'], y, extra_fn=skill_extra, style_name=style_name)

#     y -= 10
#     y = divider(c, y, TEAL)

#     # ── CONCLUSION (dark banner) ───────────────────────────────────────
#     if conc_sec['body']:
#         if y < 160:
#             c.showPage()
#             y = page_header(c, style_name)
#             y -= 10

#         paras = [p.strip() for p in re.split(r'\n\n+', conc_sec['body']) if p.strip()]
#         # measure height
#         total_lines = sum(len(wrap_text(p, "Helvetica-Oblique", 10, CONTENT_W - 40)) for p in paras)
#         banner_h = total_lines * 16 + 80
#         banner_h = min(banner_h, y - 60)

#         banner_y = y - banner_h
#         # dark bg
#         c.setFillColor(INK)
#         c.roundRect(MARGIN - 4, banner_y, CONTENT_W + 8, banner_h, 14, stroke=0, fill=1)
#         # teal orb
#         c.setFillColor(TEAL); c.saveState(); c.setFillAlpha(0.12)
#         c.circle(MARGIN + 40, banner_y + banner_h - 30, 80, stroke=0, fill=1)
#         c.restoreState()
#         # gold orb
#         c.setFillColor(GOLD); c.saveState(); c.setFillAlpha(0.08)
#         c.circle(MARGIN + CONTENT_W - 40, banner_y + 30, 60, stroke=0, fill=1)
#         c.restoreState()

#         # star
#         c.setFont("Helvetica-Bold", 18); c.setFillColor(TEAL_MID)
#         star_x = MARGIN + CONTENT_W / 2 - 6
#         c.drawString(star_x, banner_y + banner_h - 32, "*")

#         # CONCLUSION label
#         c.setFont("Helvetica-Bold", 7); c.setFillColor(TEAL_MID)
#         cw = c.stringWidth("CONCLUSION", "Helvetica-Bold", 7)
#         c.drawString(MARGIN + (CONTENT_W - cw) / 2, banner_y + banner_h - 48, "CONCLUSION")

#         # text
#         ty = banner_y + banner_h - 66
#         for para in paras:
#             lines = wrap_text(para, "Helvetica-Oblique", 10, CONTENT_W - 40)
#             for line in lines:
#                 if ty < banner_y + 12:
#                     break
#                 lw = c.stringWidth(line, "Helvetica-Oblique", 10)
#                 c.setFont("Helvetica-Oblique", 10); c.setFillColor(WHITE); c.saveState(); c.setFillAlpha(0.88)
#                 c.drawString(MARGIN + (CONTENT_W - lw) / 2, ty, line)
#                 c.restoreState()
#                 ty -= 16
#             ty -= 6

#         y = banner_y - 16

#     # ── FOOTER ────────────────────────────────────────────────────────
#     c.setStrokeColor(colors.HexColor("#E2EBF0")); c.setLineWidth(0.5)
#     c.line(MARGIN, 28, W - MARGIN, 28)
#     c.setFont("Helvetica", 7); c.setFillColor(INK_LIGHT)
#     footer_text = "Generated by WDIG Career Guidance  ·  Confidential  ·  For personal use only"
#     fw = c.stringWidth(footer_text, "Helvetica", 7)
#     c.drawString((W - fw) / 2, 16, footer_text)

#     c.save()
#     buf.seek(0)
#     return buf.read()

# # ── Flask app ─────────────────────────────────────────────────────────────────

# app = Flask(__name__)

# @app.route("/generate-pdf", methods=["POST"])
# def generate_pdf_endpoint():
#     try:
#         data = request.get_json()
#         report_text    = data.get("report", "")
#         thinking_style = data.get("thinking_style_primary", "Your Profile")
#         if not report_text:
#             return jsonify({"error": "report text required"}), 400
#         pdf_bytes = generate_pdf(report_text, thinking_style, payload=data)
#         return send_file(
#             io.BytesIO(pdf_bytes),
#             mimetype="application/pdf",
#             as_attachment=True,
#             download_name="wdig-report.pdf",
#         )
#     except Exception as e:
#         import traceback; traceback.print_exc()
#         return jsonify({"error": str(e)}), 500

# @app.route("/health")
# def health():
#     return jsonify({"status": "ok", "version": "6.0"})

# if __name__ == "__main__":
#     print("WDIG PDF Generator v6.0 on port 8000")
#     app.run(port=8000, debug=False)


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