import re
import asyncio
from typing import Dict, Any

class SimulatedSentinelAI:
    def __init__(self):
        self.name = "SENTINEL AI"
        self.system_status = "ONLINE - All systems nominal."
        
    async def generate_response(self, user_message: str) -> str:
        """
        Simulates an intelligent response with a slight delay to mimic LLM latency.
        """
        # Simulate processing delay (1 to 2 seconds)
        await asyncio.sleep(1.5)
        
        msg = user_message.lower()
        
        # Keyword matching logic
        if re.search(r'\b(active alerts|threats|disasters)\b', msg):
            return (
                "CURRENT THREAT ASSESSMENT:\n"
                "- High-Risk Cyclone detected near Florida coast.\n"
                "- Severe flooding risk in Jakarta region.\n"
                "- Multiple seismic activities logged in the Pacific Rim.\n"
                "Please check your Alert Feeds for detailed intelligence."
            )
            
        elif re.search(r'\b(safe zone|nearest safe zone|evacuate)\b', msg):
            return (
                "EVACUATION PROTOCOL ACTIVE.\n"
                "Based on your IP location, the nearest verified safe zone is Sector 7 Municipal Shelter (2.4km away). "
                "Routes A and C are currently clear of debris and flooding."
            )
            
        elif re.search(r'\b(predict|risk|probability)\b', msg):
            return (
                "AI PREDICTION ENGINE STATUS:\n"
                "Our ML models indicate a 72% confidence of flash floods in low-elevation coastal zones over the next 48 hours. "
                "Structural integrity warnings have been issued for coastal infrastructure."
            )
            
        elif re.search(r'\b(emergency contacts|contact|help)\b', msg):
            return (
                "EMERGENCY CONTACTS:\n"
                "- FEMA Hotline: 1-800-621-3362\n"
                "- Medical Dispatch: 911\n"
                "- Regional Coast Guard: Ch. 16 VHF\n"
                "Keep comms channels open and conserve battery."
            )
            
        elif re.search(r'\b(global threat status|world|status)\b', msg):
            return (
                f"GLOBAL STATUS: {self.system_status}\n"
                "SENTINEL CORE is tracking 271 global events. "
                "Current DEFCON equivalent for natural disasters is elevated. Maintain vigilance."
            )
            
        elif re.search(r'\b(hello|hi|hey|greet)\b', msg):
            return "Greetings, Operator. I am SENTINEL AI. How may I assist your disaster intelligence operations today?"
            
        else:
            return (
                "Command unrecognized. I am programmed to provide tactical disaster intelligence. "
                "You can ask me about active alerts, nearest safe zones, emergency contacts, or disaster risk predictions."
            )

chat_engine = SimulatedSentinelAI()

async def process_chat_message(user_message: str) -> str:
    return await chat_engine.generate_response(user_message)
