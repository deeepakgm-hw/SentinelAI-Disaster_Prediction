import pandas as pd

from sklearn.preprocessing import (
    LabelEncoder,
    StandardScaler
)


class DisasterPreprocessor:

    def __init__(self):

        self.label_encoder = LabelEncoder()

        self.scaler = StandardScaler()

    def preprocess(self, df):

        # Remove missing values
        df = df.dropna()

        # Keep required columns
        df = df[
            [
                "lat",
                "lon",
                "magnitude",
                "type"
            ]
        ]

        # Encode disaster type
        df["type_encoded"] = (
            self.label_encoder.fit_transform(
                df["type"]
            )
        )

        # Normalize numeric columns
        df[
            [
                "lat",
                "lon",
                "magnitude"
            ]
        ] = self.scaler.fit_transform(
            df[
                [
                    "lat",
                    "lon",
                    "magnitude"
                ]
            ]
        )

        return df