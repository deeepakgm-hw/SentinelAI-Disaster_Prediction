import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LiveToast from '../components/LiveToast';
import ChatbotPanel from '../components/ChatbotPanel';
import NotificationDrawer from '../components/NotificationDrawer';
import EmergencyBroadcast from '../components/EmergencyBroadcast';
import PanicButton from '../components/PanicButton';
import EvacuationMode from '../components/EvacuationMode';

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-cyber-darker text-white overflow-hidden font-inter selection:bg-cyber-cyan/30">
      {/* Background styling for Enterprise Feel */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-darker via-black to-[#050B14] pointer-events-none z-0" />

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative z-10">
        <Navbar />
        
        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 overflow-hidden flex flex-col">
          <Outlet />
        </main>
      </div>

      <LiveToast />
      <ChatbotPanel />
      <NotificationDrawer />
      <EmergencyBroadcast />
      <EvacuationMode />
      <PanicButton />
    </div>
  );
}
