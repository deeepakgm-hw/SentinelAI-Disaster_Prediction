import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import (
    train_test_split,
)

from sklearn.ensemble import (
    RandomForestClassifier,
)

from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix,
)

# =====================================
# LOAD FLOOD DATASET
# =====================================

df = pd.read_csv(
    "data/raw/floods.csv"
)

print(
    "\n✅ Flood Dataset Loaded"
)

print(
    "\nDataset Shape:",
    df.shape
)

# =====================================
# SELECT IMPORTANT FEATURES
# =====================================

features = [

    "MonsoonIntensity",

    "TopographyDrainage",

    "RiverManagement",

    "Deforestation",

    "Urbanization",

    "ClimateChange",

    "DrainageSystems",

    "WetlandLoss",
]

# =====================================
# CREATE FLOOD RISK LABELS
# =====================================

def classify_risk(probability):

    if probability >= 0.75:
        return "EXTREME"

    elif probability >= 0.55:
        return "HIGH"

    elif probability >= 0.35:
        return "MEDIUM"

    return "LOW"

df["FloodRisk"] = (
    df["FloodProbability"]
    .apply(classify_risk)
)

print(
    "\n✅ Flood Risk Labels Created"
)

# =====================================
# FEATURES + TARGET
# =====================================

X = df[features]

y = df["FloodRisk"]

# =====================================
# TRAIN TEST SPLIT
# =====================================

X_train,
X_test,
y_train,
y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

print(
    "\n✅ Dataset Split Complete"
)

# =====================================
# RANDOM FOREST MODEL
# =====================================

model = (
    RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        random_state=42,
    )
)

# =====================================
# TRAIN MODEL
# =====================================

print(
    "\n🚀 Training Flood AI Model..."
)

model.fit(
    X_train,
    y_train,
)

print(
    "\n✅ Flood AI Model Trained"
)

# =====================================
# PREDICTIONS
# =====================================

predictions = (
    model.predict(X_test)
)

# =====================================
# ACCURACY
# =====================================

accuracy = accuracy_score(
    y_test,
    predictions,
)

print(
    f"\n✅ Accuracy: {accuracy}"
)

# =====================================
# CLASSIFICATION REPORT
# =====================================

print(
    "\n================================="
)

print(
    "CLASSIFICATION REPORT"
)

print(
    "=================================\n"
)

print(
    classification_report(
        y_test,
        predictions,
    )
)

# =====================================
# CONFUSION MATRIX
# =====================================

print(
    "\n================================="
)

print(
    "CONFUSION MATRIX"
)

print(
    "=================================\n"
)

print(
    confusion_matrix(
        y_test,
        predictions,
    )
)

# =====================================
# FEATURE IMPORTANCE
# =====================================

importance = pd.DataFrame({

    "Feature": features,

    "Importance":
        model.feature_importances_,
})

importance = (
    importance
    .sort_values(
        by="Importance",
        ascending=False,
    )
)

print(
    "\n================================="
)

print(
    "FEATURE IMPORTANCE"
)

print(
    "=================================\n"
)

print(
    importance
)

# =====================================
# SAVE MODEL
# =====================================

joblib.dump(
    model,
    "models/flood_model.joblib"
)

print(
    "\n✅ Flood Model Saved Successfully"
)

print(
    "\nSaved Path:"
)

print(
    "models/flood_model.joblib"
)
