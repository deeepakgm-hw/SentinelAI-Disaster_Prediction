import {
  AlertTriangle,
  Activity,
  ShieldAlert,
  Globe,
} from 'lucide-react'

const cards = [
  {
    title: 'Active Alerts',
    value: '12',
    icon: AlertTriangle,
    color: 'text-red-400',
  },

  {
    title: 'Monitoring Zones',
    value: '48',
    icon: Globe,
    color: 'text-cyan-400',
  },

  {
    title: 'Critical Events',
    value: '3',
    icon: ShieldAlert,
    color: 'text-orange-400',
  },

  {
    title: 'System Status',
    value: 'ONLINE',
    icon: Activity,
    color: 'text-green-400',
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.title}
            className="
              bg-[#131d35]
              border
              border-[#1e2d4a]
              rounded-2xl
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  {card.title}
                </p>

                <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
                  {card.value}
                </h2>
              </div>

              <Icon className={card.color} size={28} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
