import axios from "axios";

const API_URL =
  "http://127.0.0.1:8000";

export const fetchPrediction =
  async (eventData) => {

    try {

      const magnitude =
        eventData?.magnitude || 5;

      const normalizedMagnitude =
        magnitude / 10;

      const payload = {

        lat:
          eventData?.lat || 0,

        lon:
          eventData?.lon || 0,

        magnitude,

        normalized_magnitude:
          normalizedMagnitude,

        disaster_frequency:
          4,

        severity_score:
          magnitude * 1.2,

        recurrence_score:
          magnitude * 0.8,
      };

      const response =
        await axios.post(
          `${API_URL}/api/predict/risk`,
          payload
        );

      return response.data;

    } catch (error) {

      console.error(
        "Prediction API Error:",
        error
      );

      return null;
    }
};
