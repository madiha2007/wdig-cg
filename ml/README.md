# Career Guidance ML System - Complete Documentation

## 🎯 Overview

This is a **self-learning, unsupervised machine learning system** that uses **hierarchical clustering** to automatically identify thinking styles and provide personalized career recommendations. The system learns from user data without requiring labeled examples.

### Key Features

- ✅ **Unsupervised Learning**: No manual labeling required
- ✅ **Hierarchical Clustering**: Discovers natural groupings in thinking patterns
- ✅ **Self-Learning**: Continuously improves with more data
- ✅ **8 Thinking Styles**: Analytically-derived career personality types
- ✅ **Career Recommendations**: Top, moderate, and least suitable careers per style
- ✅ **Production-Ready**: Complete API with validation and error handling

---

## 📁 Project Structure

```
ml/
├── data/
│   ├── ml.db                    # SQLite database
│   └── raw_exports/
│       └── dummy_traits.csv     # Training data (251 samples)
├── models/
│   ├── cluster_model.py         # Core clustering model
│   ├── train.py                 # Training script
│   ├── infer.py                 # Inference script
│   └── saved/                   # Saved models
│       ├── model.pkl
│       ├── scaler.pkl
│       └── metadata.json
├── features/
│   ├── feature_loader.py        # Data loading utilities
│   ├── normalizer.py            # Feature normalization
│   └── weights.py               # Feature weighting strategies
├── pipelines/
│   ├── train_pipeline.py        # Complete training pipeline
│   └── inference_pipeline.py   # Production inference API
├── utils/
│   ├── config.py                # Configuration
│   ├── logger.py                # Logging utilities
│   └── helpers.py               # Helper functions
└── requirements.txt             # Dependencies
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ml
pip install -r requirements.txt
```

### 2. Train the Model

Train on the dummy data (251 samples with 11 traits):

```bash
# Basic training
python models/train.py

# With custom parameters
python models/train.py --norm standard --weights career_focused --clusters 8 --remove-outliers

# Run complete pipeline with visualizations
python pipelines/train_pipeline.py
```

### 3. Make Predictions

```bash
# Interactive prediction
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

# From JSON file
python models/infer.py --input user_scores.json --format json

# Run example predictions
python pipelines/inference_pipeline.py --example all
```

---

## 📊 Data Format

### Input Features (11 Traits)

Each user is represented by 11 trait scores between 0 and 1:

| Trait          | Description                                    |
|----------------|------------------------------------------------|
| logical        | Logical reasoning ability                      |
| analytical     | Analytical thinking skills                     |
| numerical      | Numerical/mathematical aptitude                |
| verbal         | Verbal communication skills                    |
| spatial        | Spatial reasoning ability                      |
| creativity     | Creative thinking and innovation               |
| discipline     | Self-discipline and organization               |
| resilience     | Resilience and stress management               |
| independence   | Independent work preference                    |
| communication  | Interpersonal communication                    |
| leadership     | Leadership and team management                 |

### Example CSV Format

```csv
logical,analytical,numerical,verbal,spatial,creativity,discipline,resilience,independence,communication,leadership,confidence
0.82,0.85,0.79,0.45,0.71,0.38,0.76,0.68,0.73,0.42,0.51,0.89
0.48,0.51,0.44,0.78,0.39,0.82,0.58,0.71,0.69,0.81,0.64,0.85
```

---

## 🧠 Thinking Styles (8 Clusters)

The model automatically identifies these thinking styles:

1. **Analytical Thinker** - Strong logical, analytical, numerical
   - Top: Data Scientist, Software Engineer, Quant Analyst
   
2. **Creative Innovator** - High creativity, verbal, spatial
   - Top: UX Designer, Creative Director, Architect
   
3. **Strategic Leader** - Balanced analytical + leadership
   - Top: CEO, Strategy Director, Management Consultant
   
4. **Technical Specialist** - Technical, spatial, numerical
   - Top: Mechanical Engineer, Robotics Engineer
   
5. **Communicator** - Excellent verbal + communication
   - Top: PR Manager, Journalist, Educator
   
6. **Balanced Generalist** - Well-rounded across traits
   - Top: Product Manager, Entrepreneur
   
7. **Empathetic Organizer** - Discipline, communication, resilience
   - Top: Healthcare Admin, Social Worker
   
8. **Independent Problem Solver** - Independence + analytical
   - Top: Research Scientist, Independent Consultant

---

## 🔧 API Usage

### Python API

```python
from pipelines.inference_pipeline import CareerGuidanceAPI

# Initialize
api = CareerGuidanceAPI()
api.initialize()

# Single prediction
trait_scores = {
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
}

result = api.predict(trait_scores)
print(f"Thinking Style: {result['thinking_style']}")
print(f"Top Career: {result['top_careers'][0]}")

# Get detailed explanation
explanation = api.explain_prediction(trait_scores)
print(explanation['explanation_text'])

# Batch prediction
users = [trait_scores_1, trait_scores_2, ...]
results = api.predict_batch(users)
```

### Direct Inference

```python
from models.infer import ThinkingStylePredictor

predictor = ThinkingStylePredictor()
predictor.load()

result = predictor.predict_thinking_style(trait_scores)
```

---

## 🔄 Self-Learning / Model Updates

The system supports continuous learning:

### Option 1: Retrain with New Data

```python
from models.train import retrain_with_new_data

# Add new samples and retrain
retrain_with_new_data('path/to/new_data.csv')
```

### Option 2: Accumulate and Retrain Periodically

```python
from features.feature_loader import FeatureLoader
from models.train import train_model

# Load existing + new data
loader = FeatureLoader()
all_data = loader.load_from_database()  # or combine CSV files

# Retrain
model = train_model(save_model=True)
```

### Recommended Update Strategy

1. **Collect new user data** through your application
2. **Store in database** (ml_training_vectors table)
3. **Retrain weekly/monthly** depending on data volume
4. **Validate new model** using quality metrics
5. **Deploy updated model** if metrics improve

---

## 📈 Model Evaluation

### Quality Metrics

The model automatically calculates:

- **Silhouette Score** (0.4-0.6 is good): Measures cluster separation
- **Davies-Bouldin Index** (lower is better): Cluster similarity
- **Calinski-Harabasz Score** (higher is better): Cluster density

### Viewing Metrics

```python
from models.cluster_model import HierarchicalThinkingStyleModel
from utils.config import MODEL_PATH, MODEL_METADATA_PATH

model = HierarchicalThinkingStyleModel.load(MODEL_PATH, MODEL_METADATA_PATH)
summary = model.get_model_summary()

print(f"Silhouette Score: {summary['last_training']['metrics']['silhouette_score']}")
print(f"Clusters: {summary['n_clusters']}")
print(f"Samples: {summary['n_samples_seen']}")
```

---

## ⚙️ Configuration

Edit `utils/config.py` to customize:

```python
# Number of clusters
CLUSTERING_CONFIG = {
    "n_clusters": 8,  # Change this to experiment
    "method": "ward",
    "distance_threshold": None,
}

# Feature weights (emphasize certain traits)
FEATURE_WEIGHTS = {
    "logical": 1.2,      # Increase to emphasize
    "creativity": 1.3,   # Increase for creative careers
    ...
}
```

### Weight Strategies

- **default**: Balanced with slight emphasis on key traits
- **career_focused**: Heavy emphasis on job-critical skills
- **balanced**: Equal weights for all traits

---

## 🧪 Testing & Validation

### Test with Sample Data

```bash
# Test prediction
python -c "
from pipelines.inference_pipeline import example_single_prediction
example_single_prediction()
"

# Test batch processing
python -c "
from pipelines.inference_pipeline import example_batch_prediction
example_batch_prediction()
"
```

### Validate Model Quality

```python
from models.cluster_model import HierarchicalThinkingStyleModel
from features.feature_loader import FeatureLoader
from sklearn.metrics import silhouette_score

# Load model and data
model = HierarchicalThinkingStyleModel.load(MODEL_PATH, MODEL_METADATA_PATH)
loader = FeatureLoader()
X, _ = loader.load_training_data()

# Get predictions
labels = model.predict(X.values)

# Calculate score
score = silhouette_score(X.values, labels)
print(f"Silhouette Score: {score:.4f}")
```

---

## 🐛 Troubleshooting

### Model Not Found Error

```bash
# Train the model first
python models/train.py
```

### Missing Dependencies

```bash
pip install -r requirements.txt --upgrade
```

### Database Errors

```bash
# Recreate database
python db/create_db.py
python db/import_csv.py
```

### Low Quality Metrics

- Add more training data (aim for 500+ samples)
- Adjust number of clusters
- Try different normalization methods
- Review feature weights

---

## 📝 Next Steps for Production

1. **Integrate with your backend**:
   ```python
   from pipelines.inference_pipeline import CareerGuidanceAPI
   
   app = Flask(__name__)
   ml_api = CareerGuidanceAPI()
   ml_api.initialize()
   
   @app.route('/predict', methods=['POST'])
   def predict():
       scores = request.json
       result = ml_api.predict(scores)
       return jsonify(result)
   ```

2. **Add user feedback loop**:
   - Collect user satisfaction ratings
   - Store successful predictions
   - Use for model improvement

3. **Monitor performance**:
   - Track prediction distribution
   - Monitor confidence scores
   - Log prediction accuracy

4. **Scale data collection**:
   - Aim for 1000+ samples for robust clustering
   - Ensure diversity in trait combinations
   - Validate against real career outcomes

---

## 📚 Additional Resources

- **Scikit-learn Clustering**: https://scikit-learn.org/stable/modules/clustering.html
- **Hierarchical Clustering**: https://en.wikipedia.org/wiki/Hierarchical_clustering
- **Career Psychology**: Review trait-career mapping literature

---

## 🤝 Support

For issues or questions:
1. Check model quality metrics
2. Review training logs
3. Validate input data format
4. Test with example scripts

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready ✅
