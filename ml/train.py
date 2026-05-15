import pandas as pd

from pipeline.preprocess import DisasterPreprocessor
from pipeline.features import FeatureEngineer
from pipeline.model import DisasterModel


# Load datasets

earthquake_df = pd.read_csv(
    "data/raw/earthquakes.csv"
)

flood_df = pd.read_csv(
    "data/raw/floods.csv"
)
print(flood_df.columns)

cyclone_df = pd.read_csv(
    "data/raw/cyclones.csv"
)
print(cyclone_df.columns)

wildfire_df = pd.read_csv(
    "data/raw/wildfires.csv"
)
print(wildfire_df.columns)


# Standardize column names

earthquake_df = earthquake_df.rename(columns={
    "latitude": "lat",
    "longitude": "lon",
    "mag": "magnitude",
    "place": "type"
})



cyclone_df = cyclone_df.rename(columns={
    "LAT": "lat",
    "LONG": "lon",
    "WIND_KTS": "magnitude"
})

wildfire_df = wildfire_df.rename(columns={
    "X": "lat",
    "Y": "lon",
    "area": "magnitude"
})


# Add disaster labels

earthquake_df["type"] = "earthquake"

flood_df["type"] = "flood"
# Create dummy geographic values

flood_df["lat"] = 20.0

flood_df["lon"] = 78.0

# Use flood probability as magnitude

flood_df["magnitude"] = (
    flood_df["FloodProbability"] * 10
)

cyclone_df["type"] = "cyclone"

wildfire_df["type"] = "wildfire"


# Ensure magnitude exists

if "magnitude" not in flood_df.columns:
    flood_df["magnitude"] = 5

if "magnitude" not in cyclone_df.columns:
    cyclone_df["magnitude"] = 7

if "magnitude" not in wildfire_df.columns:
    wildfire_df["magnitude"] = 6


# Keep required columns only

earthquake_df = earthquake_df[
    ["lat", "lon", "magnitude", "type"]
]

flood_df = flood_df[
    ["lat", "lon", "magnitude", "type"]
]

cyclone_df = cyclone_df[
    ["lat", "lon", "magnitude", "type"]
]

wildfire_df = wildfire_df[
    ["lat", "lon", "magnitude", "type"]
]
# Remove duplicate columns

earthquake_df = earthquake_df.loc[
    :,
    ~earthquake_df.columns.duplicated()
]

flood_df = flood_df.loc[
    :,
    ~flood_df.columns.duplicated()
]

cyclone_df = cyclone_df.loc[
    :,
    ~cyclone_df.columns.duplicated()
]

wildfire_df = wildfire_df.loc[
    :,
    ~wildfire_df.columns.duplicated()
]

# Combine datasets

df = pd.concat(
    [
        earthquake_df,
        flood_df,
        cyclone_df,
        wildfire_df
    ],
    ignore_index=True
)

print("Combined Dataset Shape:", df.shape)


# Preprocessing

processor = DisasterPreprocessor()

df = processor.preprocess(df)


# Feature engineering

engineer = FeatureEngineer()

df = engineer.generate_features(df)


# Save processed dataset

df.to_csv(
    "data/processed/processed_disasters.csv",
    index=False
)

print("Processed dataset saved")


# Train model

model = DisasterModel()

model.train(df)