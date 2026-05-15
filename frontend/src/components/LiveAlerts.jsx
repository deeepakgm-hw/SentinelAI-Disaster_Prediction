export default function LiveAlerts({
    selectedType,
}) {

    // =====================================
    // MOCK ALERT DATA
    // =====================================

    const alerts = [

        {
            type: "Earthquake",
            title: "Earthquake Detected",
            location: "Ahmedabad, Gujarat",
            level: "CRITICAL",
        },

        {
            type: "Flood",
            title: "Flood Warning",
            location: "Assam",
            level: "HIGH",
        },

        {
            type: "Cyclone",
            title: "Cyclone Alert",
            location: "Odisha Coast",
            level: "MEDIUM",
        },

        {
            type: "Wildfire",
            title: "Wildfire Spread",
            location: "Uttarakhand",
            level: "HIGH",
        },
    ];

    // =====================================
    // FILTER ALERTS
    // =====================================

    const filteredAlerts =

        selectedType === "ALL"

        ? alerts

        : alerts.filter(

            (alert) =>

                alert.type === selectedType
        );

    // =====================================
    // LEVEL COLORS
    // =====================================

    const getLevelColor = (
        level
    ) => {

        if (level === "CRITICAL") {

            return "text-red-400 border-red-500/30";
        }

        if (level === "HIGH") {

            return "text-orange-400 border-orange-500/30";
        }

        return "text-yellow-400 border-yellow-500/30";
    };

    return (

        <div
            className="
            bg-[#08142d]
            rounded-2xl
            p-6
            border
            border-cyan-500/20
            "
        >

            {/* HEADER */}

            <div
                className="
                flex
                justify-between
                items-center
                mb-6
                "
            >

                <h2
                    className="
                    text-3xl
                    font-bold
                    "
                >

                    Live Alerts

                </h2>

                <div
                    className="
                    px-4
                    py-2
                    rounded-full
                    bg-red-500/20
                    text-red-400
                    text-sm
                    "
                >

                    LIVE

                </div>

            </div>

            {/* ALERTS */}

            <div className="space-y-5">

                {filteredAlerts.map(
                    (
                        alert,
                        index
                    ) => (

                        <div
                            key={index}

                            className="
                            bg-black/20
                            rounded-2xl
                            p-5
                            border
                            border-white/5
                            "
                        >

                            <div
                                className="
                                flex
                                justify-between
                                items-start
                                "
                            >

                                <div>

                                    <h3
                                        className="
                                        text-2xl
                                        font-semibold
                                        "
                                    >

                                        {alert.title}

                                    </h3>

                                    <p
                                        className="
                                        text-gray-400
                                        mt-3
                                        "
                                    >

                                        {alert.location}

                                    </p>

                                </div>

                                <div
                                    className={`
                                    px-4
                                    py-2
                                    rounded-full
                                    border
                                    text-sm
                                    ${getLevelColor(alert.level)}
                                    `}
                                >

                                    {alert.level}

                                </div>

                            </div>

                            <div
                                className="
                                flex
                                justify-between
                                mt-6
                                "
                            >

                                <p
                                    className="
                                    text-gray-500
                                    text-sm
                                    "
                                >

                                    Updated live

                                </p>

                                <button
                                    className="
                                    text-cyan-400
                                    hover:text-cyan-300
                                    "
                                >

                                    View Details

                                </button>

                            </div>

                        </div>
                    )
                )}

            </div>

        </div>
    );
}
