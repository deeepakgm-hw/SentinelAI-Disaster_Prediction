import { Activity } from 'lucide-react'

import { useDisasterStore } from '../../store/disasterStore'

const levelColors = {
  CRITICAL:
    'border-red-500/30 bg-red-500/10 text-red-400',

  HIGH:
    'border-orange-500/30 bg-orange-500/10 text-orange-400',

  MEDIUM:
    'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',

  LOW:
    'border-green-500/30 bg-green-500/10 text-green-400',
}

export default function ActivityFeed() {
  const activities =
    useDisasterStore(
      (s) => s.activities
    )

  return (
    <div
      className="
        bg-[#081028]
        border
        border-[#11204a]
        rounded-3xl
        p-6
        shadow-2xl
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-cyan-500/10
              flex
              items-center
              justify-center
            "
          >
            <Activity
              size={24}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Live Activity Stream
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Realtime operational
              updates
            </p>
          </div>
        </div>

        <div
          className="
            px-4
            py-1.5
            rounded-full
            bg-cyan-500/10
            border
            border-cyan-500/20
            text-cyan-400
            text-sm
            font-semibold
          "
        >
          LIVE
        </div>
      </div>

      {/* FEED */}

      <div className="mt-6 space-y-4 max-h-[420px] overflow-y-auto pr-2">
        {activities.length === 0 && (
          <div className="text-slate-500">
            Waiting for live activity...
          </div>
        )}

        {activities.map(
          (activity) => (
            <div
              key={activity.id}
              className="
                flex
                gap-4
                items-start
              "
            >
              {/* TIMELINE */}

              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-3
                    h-3
                    rounded-full
                    animate-pulse

                    ${levelColors[
                      activity.level
                    ]}
                  `}
                />

                <div className="w-[2px] h-16 bg-[#1a2b52]" />
              </div>

              {/* CONTENT */}

              <div
                className="
                  flex-1
                  bg-[#0c1633]
                  border
                  border-[#1a2b52]
                  rounded-2xl
                  p-4
                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      border

                      ${levelColors[
                        activity.level
                      ]}
                    `}
                  >
                    {activity.level}
                  </span>

                  <span className="text-slate-500 text-sm">
                    {activity.time}
                  </span>
                </div>

                <p className="text-white mt-3 leading-relaxed">
                  {activity.message}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
