import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Brain,
  ShieldAlert,
} from "lucide-react";

import {
  fetchPrediction,
} from "../services/predictionService";

const API_URL =
  "http://127.0.0.1:8000";

const AIPredictionCard = () => {

  const [prediction, setPrediction]
    = useState(null);

  const [event, setEvent]
    = useState(null);

  useEffect(() => {

    const loadPrediction =
      async () => {

        try {

          // =========================
          // FETCH LIVE EVENTS
          // =========================

          const response =
            await axios.get(
              `${API_URL}/api/events`
            );

          const events =
            response.data || [];

          if (!events.length) return;

          // =========================
          // USE LATEST EVENT
          // =========================

          const latestEvent =
            events[0];

          setEvent(latestEvent);

          // =========================
          // AI PREDICTION
          // =========================

          const predictionData =
            await fetchPrediction(
              latestEvent
            );

          setPrediction(
            predictionData
          );

        } catch (error) {

          console.error(
            "AI Prediction Error:",
            error
          );
        }
      };

    loadPrediction();

  }, []);

  const risk =
    prediction?.prediction
      ?.risk_level || "Loading";

  const confidence =
    prediction?.prediction
      ?.confidence || 0;

  return (

    <div
      className="
      bg-[#091428]
      border border-cyan-500/20
      rounded-2xl
      p-6
      shadow-lg
      shadow-cyan-500/10
      "
    >

      {/* HEADER */}

      <div
        className="
        flex
        items-center
        justify-between
        mb-6
        "
      >

        <div>

          <h2
            className="
            text-white
            text-2xl
            font-bold
            "
          >
            AI Prediction
          </h2>

          <p
            className="
            text-gray-400
            "
          >
            Realtime AI disaster analysis
          </p>

        </div>

        <div
          className="
          bg-cyan-500/10
          p-3
          rounded-xl
          "
        >
          <Brain
            className="
            text-cyan-400
            "
            size={30}
          />
        </div>

      </div>

      {/* CONTENT */}

      <div
        className="
        space-y-5
        "
      >

        <div
          className="
          flex
          justify-between
          "
        >

          <span
            className="
            text-gray-400
            "
          >
            Risk Level
          </span>

          <span
            className="
            text-cyan-400
            font-bold
            text-lg
            "
          >
            {risk}
          </span>

        </div>

        <div
          className="
          flex
          justify-between
          "
        >

          <span
            className="
            text-gray-400
            "
          >
            Confidence
          </span>

          <span
            className="
            text-white
            font-semibold
            "
          >
            {(confidence * 100)
              .toFixed(0)}%
          </span>

        </div>

        <div
          className="
          flex
          justify-between
          "
        >

          <span
            className="
            text-gray-400
            "
          >
            Event Magnitude
          </span>

          <span
            className="
            text-orange-400
            font-semibold
            "
          >
            {event?.magnitude || "N/A"}
          </span>

        </div>

        <div
          className="
          flex
          justify-between
          "
        >

          <span
            className="
            text-gray-400
            "
          >
            AI Status
          </span>

          <span
            className="
            text-green-400
            flex
            items-center
            gap-2
            "
          >

            <ShieldAlert
              size={18}
            />

            Active

          </span>

        </div>

      </div>

    </div>
  );
};

export default AIPredictionCard;
