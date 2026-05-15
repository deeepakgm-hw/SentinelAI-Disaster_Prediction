import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Loader2, AlertTriangle, Navigation, Phone, Globe } from 'lucide-react'
import { useUIStore } from '../store/uiStore'
import { getChatHistory, sendChatMessage, clearChatHistory } from '../services/api'
import toast from 'react-hot-toast'

export default function ChatbotPanel() {
  const isChatOpen = useUIStore((s) => s.isChatOpen)
  const closeChat = useUIStore((s) => s.closeChat)
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getChatHistory()
        if (data.length === 0) {
          setMessages([
            {
              id: 'welcome',
              role: 'ai',
              content: "Greetings, Operator. I am SENTINEL AI. How may I assist your disaster intelligence operations today?",
              timestamp: new Date().toISOString()
            }
          ])
        } else {
          setMessages(data)
        }
      } catch (error) {
        console.error("Failed to load chat history", error)
      }
    }
    
    if (isChatOpen) {
      fetchHistory()
    }
  }, [isChatOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async (text) => {
    const msgText = text || input
    if (!msgText.trim()) return

    const tempId = 'temp-' + messages.length
    const userMsg = { id: tempId, role: 'user', content: msgText, timestamp: new Date().toISOString() }
    
    setMessages((prev) => [...prev, userMsg])
    if (!text) setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await sendChatMessage(msgText)
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error(error)
      toast.error("SENTINEL AI connection failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = async () => {
    try {
      await clearChatHistory()
      setMessages([{
        id: 'welcome',
        role: 'ai',
        content: "Memory wiped. Ready for new operations.",
        timestamp: new Date().toISOString()
      }])
      toast.success("History Cleared")
    } catch (error) {
      console.error(error)
      toast.error("Failed to clear history")
    }
  }

  const quickActions = [
    { label: "Active Alerts", icon: AlertTriangle, query: "Show active alerts" },
    { label: "Safe Zone", icon: Navigation, query: "Nearest safe zone" },
    { label: "Threat Status", icon: Globe, query: "Global threat status" },
    { label: "Emergency", icon: Phone, query: "Emergency contacts" }
  ]

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-16 right-0 bottom-0 w-full md:w-[400px] z-40 flex flex-col bg-cyber-dark/95 backdrop-blur-2xl border-l border-cyber-cyan/30 shadow-[-10px_0_30px_rgba(0,240,255,0.05)] font-mono text-sm"
        >
          {/* Animated Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <motion.div 
              animate={{ y: ['-100%', '1000%'] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-full h-8 bg-gradient-to-b from-transparent via-cyber-cyan to-transparent opacity-30"
            />
          </div>

          {/* Header */}
          <div className="p-4 border-b border-cyber-cyan/30 flex items-center justify-between bg-black/40 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-6 h-6 text-cyber-cyan animate-pulse-glow" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00F0FF] animate-ping" />
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-bold text-white tracking-widest text-sm">SENTINEL AI</span>
                <span className="text-[10px] text-cyber-cyan/70 tracking-widest uppercase">Tactical Assistant</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleClear} className="text-[10px] text-gray-500 hover:text-cyber-red transition-colors uppercase tracking-widest px-2 py-1 border border-transparent hover:border-cyber-red/30">
                Wipe
              </button>
              <button onClick={closeChat} className="p-1 text-gray-400 hover:text-cyber-cyan transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-cyber-cyan/30 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <motion.div 
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-sm flex items-center justify-center border ${msg.role === 'user' ? 'bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue' : 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-sm text-xs leading-relaxed border ${msg.role === 'user' ? 'bg-cyber-blue/5 border-cyber-blue/20 text-blue-100' : 'bg-cyber-cyan/5 border-cyber-cyan/20 text-cyan-50 whitespace-pre-wrap'}`}>
                  {msg.content}
                  <div className={`text-[9px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 w-8 h-8 rounded-sm flex items-center justify-center border bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="p-3 rounded-sm border bg-cyber-cyan/5 border-cyber-cyan/20 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-t border-cyber-cyan/10 bg-black/20 flex gap-2 overflow-x-auto no-scrollbar relative z-10">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action.query)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-cyber-cyan/20 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50 text-cyber-cyan text-[10px] uppercase tracking-widest transition-all rounded-sm whitespace-nowrap"
              >
                <action.icon size={12} /> {action.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/40 border-t border-cyber-cyan/30 relative z-10">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2 bg-black/60 border border-cyber-cyan/30 p-1 pl-3 rounded-sm focus-within:border-cyber-cyan/80 focus-within:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Request tactical intel..."
                className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder:text-gray-600"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="p-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan disabled:opacity-50 disabled:cursor-not-allowed rounded-sm transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
