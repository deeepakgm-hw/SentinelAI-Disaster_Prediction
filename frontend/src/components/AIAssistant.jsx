import { useState } from 'react'

import {
  Bot,
  Send,
  X,
  Sparkles,
} from 'lucide-react'

import { useAIStore } from '../store/aiStore'

export default function AIAssistant() {
  const [input, setInput] = useState('')

  const open = useAIStore((s) => s.open)
  const toggleAI = useAIStore((s) => s.toggleAI)

  const messages = useAIStore((s) => s.messages)
  const addMessage = useAIStore((s) => s.addMessage)

  function handleSend() {
    if (!input.trim()) return

    addMessage({
      role: 'user',
      content: input,
    })

    const userMessage = input.toLowerCase()

    let aiReply =
      'Emergency systems operational. Monitoring realtime disaster activity.'

    if (
      userMessage.includes('earthquake')
    ) {
      aiReply =
        'Recommended actions: move to open areas, avoid elevators, and prepare emergency medical kits.'
    }

    else if (
      userMessage.includes('flood')
    ) {
      aiReply =
        'Move citizens to elevated zones immediately. Avoid submerged roads and activate rescue teams.'
    }

    else if (
      userMessage.includes('wildfire')
    ) {
      aiReply =
        'Deploy evacuation routes southbound. Prioritize containment and medical response units.'
    }

    else if (
      userMessage.includes('cyclone')
    ) {
      aiReply =
        'Cyclone response initiated. Coastal evacuation and shelter activation recommended.'
    }

    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: aiReply,
      })
    }, 700)

    setInput('')
  }

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={toggleAI}
        className="
          fixed
          bottom-6
          right-6
          z-[99999]
          w-16
          h-16
          rounded-full
          bg-cyan-500
          text-black
          flex
          items-center
          justify-center
          shadow-2xl
          shadow-cyan-500/30
          hover:scale-105
          transition-all
        "
      >
        <Bot size={30} />
      </button>

      {/* Drawer */}
      <div
        className={`
          fixed
          top-0
          right-0
          h-screen
          w-[420px]
          bg-[#081028]
          border-l
          border-[#1e2d4a]
          z-[99998]
          transition-all
          duration-300
          flex
          flex-col
          ${
            open
              ? 'translate-x-0'
              : 'translate-x-full'
          }
        `}
      >
        {/* Header */}
        <div
          className="
            p-5
            border-b
            border-[#1e2d4a]
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                p-3
                rounded-xl
                bg-cyan-500/10
                text-cyan-400
              "
            >
              <Sparkles size={24} />
            </div>

            <div>
              <h2 className="font-bold text-xl">
                DisasterGuard AI
              </h2>

              <p className="text-sm text-slate-400">
                Emergency Intelligence System
              </p>
            </div>
          </div>

          <button
            onClick={toggleAI}
            className="
              p-2
              rounded-lg
              hover:bg-white/5
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`
                max-w-[85%]
                rounded-2xl
                p-4
                text-sm
                leading-relaxed
                ${
                  msg.role === 'assistant'
                    ? 'bg-[#131d35] text-slate-200'
                    : 'bg-cyan-500 text-black ml-auto'
                }
              `}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <div
          className="
            p-5
            border-t
            border-[#1e2d4a]
          "
        >
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend()
                }
              }}
              placeholder="Ask emergency AI..."
              className="
                flex-1
                bg-[#131d35]
                border
                border-[#1e2d4a]
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-cyan-500
              "
            />

            <button
              onClick={handleSend}
              className="
                w-14
                rounded-xl
                bg-cyan-500
                text-black
                flex
                items-center
                justify-center
                hover:bg-cyan-400
              "
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
