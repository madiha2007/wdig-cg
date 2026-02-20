# 🚀 Quick Start Guide - Career Guidance ML System

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (1 min)

```bash
cd /path/to/your/project/ml
pip install -r requirements.txt
```

### Step 2: Train the Model (2 min)

```bash
# Train on dummy data (251 samples)
python models/train.py

# Expected output:
# ✅ Model fitted successfully with 8 clusters
# Silhouette Score: 0.4xxx
# Model saved to models/saved/model.pkl
```

### Step 3: Test Predictions (1 min)

```bash
# Test with example scores
python models/infer.py \
  --logical 0.85 \
  --analytical 0.88 \
  --numerical 0.82 \
  --verbal 0.45 \
  --spatial 0.71 \
  --creativity 0.38 \
  --discipline 0.76 \
  --resilience 0.68 \
  --independence 0.73 \
  --communication 0.42 \
  --leadership 0.51 \
  --format text

# Expected output:
# Thinking Style: Analytical Thinker
# Confidence: 87%
# Top Career Matches: Data Scientist, Software Engineer, ...
```

### Step 4: Integrate with Your Backend (1 min)

```python
from ml.ml_integration import CareerGuidanceService

# Initialize once
ml_service = CareerGuidanceService()
ml_service.startup()

# Use for predictions
result = ml_service.predict_career({
    "logical": 0.85,
    "analytical": 0.88,
    # ... other traits
})

print(result['data']['thinking_style'])  # "Analytical Thinker"
print(result['data']['careers']['top_matches'])  # ["Data Scientist", ...]
```

---

## 🎯 Common Tasks

### Make a Prediction

```python
from pipelines.inference_pipeline import CareerGuidanceAPI

api = CareerGuidanceAPI()
api.initialize()

result = api.predict({
    "logical": 0.85,
    "analytical": 0.88,
    "numerical": 0.82,
    "verbal": 0.45,
    "spatial": 0.71,
    "creativity": 0.38,
    "discipline": 0.76,
    "resilience": 0.68,
    "independence": 0.73,
    "communication": 0.42,
    "leadership": 0.51,
})

print(f"Style: {result['thinking_style']}")
print(f"Top Career: {result['top_careers'][0]}")
```

### Retrain with New Data

```python
from models.train import train_model

# Train on new CSV data
model = train_model(
    data_source='csv',  # or 'database'
    normalization_method='standard',
    feature_weight_strategy='default',
    n_clusters=8,
    remove_outliers=True,
    save_model=True
)
```

### Batch Process Users

```python
from pipelines.inference_pipeline import CareerGuidanceAPI

api = CareerGuidanceAPI()
api.initialize()

users = [
    {"logical": 0.85, ...},  # User 1
    {"logical": 0.45, ...},  # User 2
]

results = api.predict_batch(users)

for i, result in enumerate(results):
    print(f"User {i+1}: {result['thinking_style']}")
```

### Check Model Quality

```python
from models.cluster_model import HierarchicalThinkingStyleModel
from utils.config import MODEL_PATH, MODEL_METADATA_PATH

model = HierarchicalThinkingStyleModel.load(MODEL_PATH, MODEL_METADATA_PATH)
summary = model.get_model_summary()

print(f"Clusters: {summary['n_clusters']}")
print(f"Samples: {summary['n_samples_seen']}")
print(f"Silhouette: {summary['last_training']['metrics']['silhouette_score']:.4f}")
```

---

## 📊 Understanding the Output

### Prediction Response Structure

```json
{
  "cluster_id": 0,
  "thinking_style": "Analytical Thinker",
  "description": "Strong logical, analytical, and numerical skills",
  "confidence": 0.87,
  "top_careers": [
    "Data Scientist",
    "Software Engineer",
    "Quantitative Analyst",
    "Research Scientist",
    "Systems Architect"
  ],
  "moderate_careers": [
    "Business Analyst",
    "Financial Analyst",
    "Operations Manager",
    "Product Manager",
    "Consultant"
  ],
  "least_careers": [
    "Creative Writer",
    "Artist",
    "Social Worker",
    "Event Planner",
    "Marketing Specialist"
  ],
  "dominant_traits": [
    "analytical",
    "logical",
    "numerical"
  ]
}
```

### What Each Field Means

- **cluster_id**: Internal cluster number (0-7)
- **thinking_style**: Human-readable style name
- **description**: Brief description of the thinking style
- **confidence**: How confident the model is (0-1, higher is better)
  - > 0.8: High confidence
  - 0.6-0.8: Moderate confidence
  - < 0.6: Low confidence (borderline case)
- **top_careers**: Best career matches (aim for these)
- **moderate_careers**: Good but not perfect matches
- **least_careers**: Careers that may not suit this style
- **dominant_traits**: The 3 strongest traits for this user

---

## 🔧 Troubleshooting

### "Model not found" Error

```bash
# Solution: Train the model first
python models/train.py
```

### "Missing required columns" Error

Make sure your trait scores include all 11 required traits:
- logical, analytical, numerical, verbal, spatial
- creativity, discipline, resilience, independence
- communication, leadership

### Low Confidence Scores

This is normal for users with balanced trait profiles. It means:
- User doesn't strongly fit any single thinking style
- User is versatile (could succeed in multiple career paths)
- Consider showing multiple top career categories

### Import Errors

```bash
# Make sure you're in the ml directory or add to path
cd ml
python models/train.py

# Or from project root:
PYTHONPATH=$PYTHONPATH:./ml python ml/models/train.py
```

---

## 📝 Next Steps

### For Development

1. ✅ **Test the basic flow** (5 min)
   - Train model
   - Make prediction
   - Verify output

2. ✅ **Integrate with backend** (30 min)
   - Use `ml_integration.py` as template
   - Create API endpoints
   - Test end-to-end

3. ✅ **Connect to frontend** (1 hour)
   - Send user test results to backend
   - Call ML API
   - Display results to user

### For Production

1. **Collect Real Data** (ongoing)
   - Store all user test results
   - Aim for 500+ samples before first retrain

2. **Monitor Performance** (weekly)
   - Track prediction distribution
   - Check confidence scores
   - Gather user feedback

3. **Retrain Regularly** (monthly)
   - Use accumulated real data
   - Validate metrics
   - Deploy updated model

---

## 💡 Tips & Best Practices

### For Best Results

1. **Normalize Input**: Ensure all trait scores are 0-1
2. **Complete Data**: Always provide all 11 traits
3. **Cache Model**: Load model once, use many times
4. **Log Predictions**: Store for analysis and retraining

### Common Pitfalls to Avoid

❌ **Don't** retrain too frequently (wait for meaningful data)  
❌ **Don't** ignore low confidence scores (they're informative)  
❌ **Don't** hardcode thinking style IDs (they may change)  
✅ **Do** use thinking style names instead of IDs  
✅ **Do** handle errors gracefully  
✅ **Do** validate input before prediction

---

## 📚 Additional Resources

- **Full Documentation**: See `README.md`
- **Model Analysis**: See `ANALYSIS.md`
- **API Integration**: See `ml_integration.py`
- **Training Pipeline**: See `pipelines/train_pipeline.py`

---

## 🆘 Quick Reference

### File Structure
```
ml/
├── models/train.py          # Train the model
├── models/infer.py          # Make predictions
├── ml_integration.py        # Backend integration
└── pipelines/              
    ├── train_pipeline.py    # Complete training
    └── inference_pipeline.py # Production API
```

### Key Commands
```bash
# Train
python models/train.py

# Predict (CLI)
python models/infer.py --logical 0.85 ... --format text

# Test integration
python ml_integration.py

# Run examples
python pipelines/inference_pipeline.py --example all
```

### Import Patterns
```python
# For backend integration
from ml.ml_integration import CareerGuidanceService

# For direct model access
from ml.pipelines.inference_pipeline import CareerGuidanceAPI

# For training
from ml.models.train import train_model
```

---

**Ready to go!** 🚀

Start with the 5-minute setup above, then explore the full documentation for advanced features.
