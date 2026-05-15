import {
  Siren,
  TriangleAlert,
} from "lucide-react";

const AIResponseEngine = ({
  event,
}) => {

  if (!event) return null;

  const magnitude =
    Number(
      event.magnitude
    );

  // =====================================
  // AI ANALYSIS
  // =====================================

  let severity =
    "LOW";

  let evacuation =
    "NOT REQUIRED";

  let tsunamiRisk =
    "LOW";

  let emergencyColor =
    "text-green-400";

  let borderColor =
    "border-green-500/30";

  let recommendation =
    "Situation stable. Continue monitoring.";

  // =====================================
  // HIGH RISK
  // =====================================

  if (
    magnitude >= 5 &&
    magnitude < 7
  ) {

    severity =
      "HIGH";

    evacuation =
      "PREPARE";

    tsunamiRisk =
      "MEDIUM";

    emergencyColor =
      "text-yellow-400";

    borderColor =
      "border-yellow-500/30";

    recommendation =
      "Prepare emergency response teams and monitor aftershocks.";
  }

  // =====================================
  // EXTREME RISK
  // =====================================

  if (
    magnitude >= 7
  ) {

    severity =
      "EXTREME";

    evacuation =
      "IMMEDIATE";

    tsunamiRisk =
      "HIGH";

    emergencyColor =
      "text-red-400";

    borderColor =
      "border-red-500/30";

    recommendation =
      "Immediate evacuation advised. Activate disaster response protocol.";
  }

  return (

    <div
      className={`
      bg-[#091428]
      border ${borderColor}
      rounded-2xl
      p-6
      shadow-lg
      `}
    >

      {/* =========================
          HEADER
      ========================== */}

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
            text-2xl
            font-bold
            text-white
            "
          >
            AI Response Engine
          </h2>

          <p
            className="
            text-gray-400
            "
          >
            Autonomous emergency analysis
          </p>

        </div>

        <div
          className="
          bg-red-500/10
          p-3
          rounded-xl
          "
        >

          <Siren
            className="
            text-red-400
            "
            size={30}
          />

        </div>

      </div>

      {/* =========================
          CONTENT
      ========================== */}

      <div
        className="
        space-y-5
        "
      >

        {/* SEVERITY */}

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
            Severity
          </span>

          <span
            className={`
            font-bold
            text-lg
            ${emergencyColor}
            `}
          >
            {severity}
          </span>

        </div>

        {/* EVACUATION */}

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
            Evacuation
          </span>

          <span
            className="
            text-white
            font-semibold
            "
          >
            {evacuation}
          </span>

        </div>

        {/* TSUNAMI */}

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
            Tsunami Risk
          </span>

          <span
            className={`
            font-semibold
            ${emergencyColor}
            `}
          >
            {tsunamiRisk}
          </span>

        </div>

        {/* MAGNITUDE */}

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
            Magnitude
          </span>

          <span
            className="
            text-orange-400
            font-semibold
            "
          >
            {magnitude}
          </span>

        </div>

      </div>

      {/* =========================
          RECOMMENDATION
      ========================== */}

      <div
        className="
        mt-6
        p-4
        rounded-xl
        bg-black/30
        border border-white/5
        "
      >

        <div
          className="
          flex
          items-start
          gap-3
          "
        >

          <TriangleAlert
            className={emergencyColor}
            size={24}
          />

          <div>

            <h3
              className="
              text-white
              font-semibold
              mb-2
              "
            >
              AI Recommendation
            </h3>

            <p
              className="
              text-gray-300
              text-sm
              leading-relaxed
              "
            >
              {recommendation}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AIResponseEngine;
