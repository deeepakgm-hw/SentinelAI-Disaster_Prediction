from sklearn.ensemble import RandomForestClassifier

from sklearn.model_selection import (
    train_test_split,
    cross_val_score
)

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

import joblib


class DisasterModel:

    def train(self, df):

        # Create balanced risk labels

        risk_levels = []

        for _, row in df.iterrows():

            score = (
                row["normalized_magnitude"] * 0.7 +
                row["severity_score"] * 0.0003
            )

            if score > 0.75:
                risk_levels.append("HIGH")

            elif score > 0.45:
                risk_levels.append("MEDIUM")

            else:
                risk_levels.append("LOW")

        df["risk_level"] = risk_levels

        # Features
        X = df[
            [
                "lat",
                "lon",
                "magnitude",
                "normalized_magnitude",
                "disaster_frequency",
                "severity_score",
                "recurrence_score"
            ]
        ]

        # Target
        y = df["risk_level"]

        # Split dataset
        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            stratify=y
        )

        # Create model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=12,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )

        # Train model
        model.fit(X_train, y_train)

        # Training predictions
        train_predictions = model.predict(X_train)

        # Testing predictions
        test_predictions = model.predict(X_test)

        # Training accuracy
        train_accuracy = accuracy_score(
            y_train,
            train_predictions
        )

        # Testing accuracy
        test_accuracy = accuracy_score(
            y_test,
            test_predictions
        )

        print("\nTraining Accuracy:", train_accuracy)

        print("Testing Accuracy:", test_accuracy)

        # Classification report
        print("\nClassification Report:")
        print(
            classification_report(
                y_test,
                test_predictions
            )
        )

        # Confusion matrix
        print("\nConfusion Matrix:")
        print(
            confusion_matrix(
                y_test,
                test_predictions
            )
        )

        # Cross validation
        scores = cross_val_score(
            model,
            X,
            y,
            cv=5
        )

        print("\nCross Validation Scores:", scores)

        print(
            "\nAverage CV Score:",
            scores.mean()
        )

        # Save trained model
        joblib.dump(
            model,
            "models/risk_model.joblib"
        )

        print("\nModel saved successfully")