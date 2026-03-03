"""
PDF Generator for WDIG Aptitude Reports
Add this endpoint to your existing ml/app.py
Or run as a separate Flask route alongside your existing app.py
"""

from flask import request, send_file
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
import io
import re


# ── Colour palette ─────────────────────────────────────────────────────────────
INDIGO      = colors.HexColor("#4F46E5")
INDIGO_LIGHT = colors.HexColor("#EEF2FF")
SLATE       = colors.HexColor("#1E293B")
SLATE_MID   = colors.HexColor("#475569")
SLATE_LIGHT = colors.HexColor("#94A3B8")
AMBER       = colors.HexColor("#D97706")
WHITE       = colors.white


def build_styles():
    base = getSampleStyleSheet()

    styles = {
        "cover_title": ParagraphStyle(
            "cover_title",
            fontName="Helvetica-Bold",
            fontSize=28,
            textColor=WHITE,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            fontName="Helvetica",
            fontSize=13,
            textColor=colors.HexColor("#C7D2FE"),
            alignment=TA_CENTER,
            spaceAfter=4,
        ),
        "section_heading": ParagraphStyle(
            "section_heading",
            fontName="Helvetica-Bold",
            fontSize=16,
            textColor=INDIGO,
            spaceBefore=18,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Helvetica",
            fontSize=10.5,
            textColor=SLATE,
            leading=16,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
        ),
        "closing": ParagraphStyle(
            "closing",
            fontName="Helvetica-BoldOblique",
            fontSize=11,
            textColor=INDIGO,
            leading=17,
            alignment=TA_CENTER,
            spaceBefore=12,
            spaceAfter=12,
        ),
        "footer": ParagraphStyle(
            "footer",
            fontName="Helvetica",
            fontSize=8,
            textColor=SLATE_LIGHT,
            alignment=TA_CENTER,
        ),
    }
    return styles


def parse_report_sections(report_text: str) -> list:
    """Split raw markdown report into (heading, body) tuples."""
    sections = []
    # Split on ## headings
    parts = re.split(r"(?m)^## ", report_text)
    for part in parts:
        part = part.strip()
        if not part:
            continue
        lines = part.split("\n", 1)
        heading = lines[0].strip().lstrip("0123456789. ").strip()
        body = lines[1].strip() if len(lines) > 1 else ""
        sections.append((heading, body))
    return sections


def make_cover(styles, thinking_style):
    """Returns flowables for the cover page."""
    story = []

    # Indigo background rectangle — simulated with a coloured paragraph block
    story.append(Spacer(1, 2 * cm))

    story.append(Paragraph("WDIG", ParagraphStyle(
        "logo", fontName="Helvetica-Bold", fontSize=14,
        textColor=colors.HexColor("#A5B4FC"), alignment=TA_CENTER
    )))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph("Your Aptitude Report", styles["cover_title"]))
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph(
        f"Thinking Style: <b>{thinking_style}</b>",
        ParagraphStyle("ts", fontName="Helvetica", fontSize=12,
                       textColor=colors.HexColor("#C7D2FE"), alignment=TA_CENTER)
    ))
    story.append(Spacer(1, 1 * cm))
    story.append(HRFlowable(width="60%", thickness=1,
                             color=colors.HexColor("#818CF8"), spaceAfter=12))
    story.append(Paragraph(
        "A deeply personal analysis of your personality, potential,<br/>and the path that's uniquely yours.",
        ParagraphStyle("tagline", fontName="Helvetica-Oblique", fontSize=11,
                       textColor=colors.HexColor("#E0E7FF"), alignment=TA_CENTER, leading=18)
    ))
    story.append(PageBreak())
    return story


def body_to_paragraphs(text: str, style) -> list:
    """Convert plain body text into Paragraph flowables, respecting newlines."""
    paras = []
    for para in text.split("\n\n"):
        para = para.strip()
        if para:
            # Clean up any remaining markdown bold (**text**)
            para = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", para)
            paras.append(Paragraph(para, style))
    return paras


def generate_pdf(report_text: str, thinking_style: str) -> bytes:
    buffer = io.BytesIO()
    styles = build_styles()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2.5 * cm,
        rightMargin=2.5 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title="WDIG Aptitude Report",
        author="WDIG Career Guidance",
    )

    story = []

    # Cover page
    story += make_cover(styles, thinking_style or "Your Unique Profile")

    # Parse sections
    sections = parse_report_sections(report_text)

    for i, (heading, body) in enumerate(sections):
        # Section heading with rule
        story.append(Paragraph(heading, styles["section_heading"]))
        story.append(HRFlowable(
            width="100%", thickness=0.5,
            color=colors.HexColor("#C7D2FE"), spaceAfter=8
        ))

        # Detect closing paragraph (last section or starts with specific phrases)
        is_closing = (i == len(sections) - 1 and len(sections) > 4)

        if is_closing:
            story += body_to_paragraphs(body, styles["closing"])
        else:
            story += body_to_paragraphs(body, styles["body"])

        story.append(Spacer(1, 0.4 * cm))

        # Page break after section 3 (mid-report)
        if i == 2:
            story.append(PageBreak())

    # Footer note
    story.append(Spacer(1, 1 * cm))
    story.append(HRFlowable(width="100%", thickness=0.5,
                             color=colors.HexColor("#E2E8F0"), spaceAfter=8))
    story.append(Paragraph(
        "Generated by WDIG Career Guidance System · Confidential · For personal use only",
        styles["footer"]
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()


# ── Flask endpoint — add this to your ml/app.py ────────────────────────────────
def register_pdf_route(app):
    @app.route("/generate-pdf", methods=["POST"])
    def generate_pdf_endpoint():
        data = request.get_json()
        report_text = data.get("report", "")
        thinking_style = data.get("thinking_style_primary", "Your Profile")

        if not report_text:
            return {"error": "report text required"}, 400

        try:
            pdf_bytes = generate_pdf(report_text, thinking_style)
            return send_file(
                io.BytesIO(pdf_bytes),
                mimetype="application/pdf",
                as_attachment=True,
                download_name="wdig-report.pdf"
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            return {"error": str(e)}, 500
