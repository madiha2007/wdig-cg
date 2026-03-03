"""
WDIG ML Engine — Flask Server v4.1
Includes: /predict, /feedback, /health, /generate-pdf
Run: python app.py from the ml/ directory
"""
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import importlib.util
import os
import sys
import io

sys.path.insert(0, os.path.dirname(__file__))

app = Flask(__name__)
CORS(app)


def get_pipeline():
    spec = importlib.util.spec_from_file_location(
        "inference_pipeline",
        os.path.join(os.path.dirname(__file__), "pipelines", "inference_pipeline.py")
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def get_pdf_generator():
    spec = importlib.util.spec_from_file_location(
        "pdf_generator",
        os.path.join(os.path.dirname(__file__), "pdf_generator.py")
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@app.route("/health")
def health():
    return jsonify({"status": "ok", "version": "4.1"})


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        traits = data.get("traits", {})
        firebase_uid = data.get("firebase_uid")
        if not traits:
            return jsonify({"error": "traits object required"}), 400
        pipeline = get_pipeline()
        result = pipeline.predict(traits, firebase_uid)
        return jsonify(result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/feedback", methods=["POST"])
def feedback():
    try:
        data = request.get_json()
        pipeline = get_pipeline()
        pipeline.save_feedback(
            firebase_uid=data.get("firebase_uid"),
            top_career=data.get("top_career"),
            thinking_style_id=data.get("thinking_style_id"),
            rating=data.get("rating"),
            comment=data.get("comment", ""),
            traits=data.get("traits", {})
        )
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/generate-pdf", methods=["POST"])
def generate_pdf_endpoint():
    try:
        data = request.get_json()
        report_text = data.get("report", "")
        thinking_style = data.get("thinking_style_primary", "Your Profile")

        if not report_text:
            return jsonify({"error": "report text required"}), 400

        pdf_gen = get_pdf_generator()
        pdf_bytes = pdf_gen.generate_pdf(report_text, thinking_style)

        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name="wdig-report.pdf"
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🚀 WDIG ML Engine v4.1 running on port 8000")
    app.run(port=8000, debug=False)
