import joblib
import numpy as np

from pathlib import Path

# =====================================
# LOAD TRAINED MODEL
# =====================================

MODEL_PATH = (
    Path(__file__)
    .resolve()
    .parent.parent.parent
    / "ml"
    / "models"
    / "risk_model.joblib"
)

model = joblib.load(
    MODEL_PATH
)

print(
    "AI Risk Model Loaded"
)

# =====================================
# PREDICT DISASTER RISK
# =====================================


async def predict_risk(
    features
):
    data = np.array([
        features
    ])

    prediction = (
        model.predict(data)[0]
    )

    probabilities = (
        model.predict_proba(data)[0]
    )

    confidence = float(
        np.max(probabilities)
    )

    return {
        "risk_level": str(
            prediction
        ),

        "confidence": round(
            confidence,
            2,
        ),
    }
