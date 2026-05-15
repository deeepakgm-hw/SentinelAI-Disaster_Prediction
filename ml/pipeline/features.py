import pandas as pd


class FeatureEngineer:

    def generate_features(self, df):

        # Normalized magnitude
        df["normalized_magnitude"] = (
            df["magnitude"] - df["magnitude"].min()
        ) / (
            df["magnitude"].max() - df["magnitude"].min()
        )

        # Disaster frequency
        frequency_map = df["type"].value_counts().to_dict()

        df["disaster_frequency"] = df["type"].map(frequency_map)

        # Severity score
        df["severity_score"] = (
            df["normalized_magnitude"] *
            df["disaster_frequency"]
        )

        # Historical recurrence score
        df["recurrence_score"] = (
            df["severity_score"] * 0.5
        )

        return df