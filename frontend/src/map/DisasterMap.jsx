import { useEffect, useState, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import { motion, AnimatePresence } from "framer-motion";
import { useDisasterStore } from "../store/disasterStore";
import { useFilterStore } from "../store/filterStore";
import { useUIStore } from "../store/uiStore";
import { useEmergencyStore } from "../store/emergencyStore";

export default function DisasterMap() {
  const storeEvents = useDisasterStore((s) => s.events);
  const disasterType = useFilterStore((s) => s.disasterType);
  const severity = useFilterStore((s) => s.severity);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const globeRef = useRef();
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef();

  const isEvacuationMode = useUIStore((s) => s.isEvacuationMode);
  const liveLocation = useEmergencyStore((s) => s.liveLocation);
  const safeZones = useEmergencyStore((s) => s.safeZones);
  const activeDangerEvent = useEmergencyStore((s) => s.activeDangerEvent);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setGlobeSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const events = useMemo(() => {
    const formattedEvents = storeEvents
      .map((event) => ({
        ...event,
        lat: Number(event.lat || event.latitude || event.coordinates?.[0]),
        lng: Number(event.lon || event.longitude || event.coordinates?.[1]),
        magnitude: Number(event.magnitude || 1),
        type: String(event.type || event.category || event.disaster_type || "Unknown"),
        title: event.title || event.name || "Disaster Event",
        location: event.location || event.place || "Unknown Location",
      }))
      .filter((event) => !isNaN(event.lat) && !isNaN(event.lng));

    // Clean, sparse enterprise dummy data with Wildfires added
    const activeEvents = formattedEvents.length > 0 ? formattedEvents : [
      { id: 1, lat: 34.05, lng: -118.24, magnitude: 7.2, type: "Earthquake", title: "M 7.2 - Los Angeles", location: "California, USA" },
      { id: 2, lat: 35.68, lng: 139.69, magnitude: 6.8, type: "Earthquake", title: "M 6.8 - Tokyo", location: "Japan" },
      { id: 3, lat: -33.86, lng: 151.20, magnitude: 5.5, type: "Wildfire", title: "Severe Wildfire - Sydney", location: "Australia" },
      { id: 4, lat: 22.31, lng: 114.16, magnitude: 4.0, type: "Cyclone", title: "Category 4 Cyclone", location: "Hong Kong" },
      { id: 5, lat: 51.50, lng: -0.12, magnitude: 3.5, type: "Flood", title: "Thames Overflow", location: "London, UK" },
      { id: 6, lat: -23.55, lng: -46.63, magnitude: 4.8, type: "Flood", title: "Flash Floods - São Paulo", location: "Brazil" },
      { id: 7, lat: 55.75, lng: 37.61, magnitude: 3.2, type: "Earthquake", title: "M 3.2 Tremor - Moscow", location: "Russia" },
      { id: 8, lat: -1.29, lng: 36.82, magnitude: 4.5, type: "Wildfire", title: "Savannah Fire - Nairobi", location: "Kenya" },
      { id: 9, lat: 48.85, lng: 2.35, magnitude: 2.1, type: "Flood", title: "Seine Overflow - Paris", location: "France" },
      { id: 10, lat: 28.61, lng: 77.20, magnitude: 6.1, type: "Earthquake", title: "M 6.1 - New Delhi", location: "India" },
      { id: 11, lat: 39.07, lng: 21.82, magnitude: 4.2, type: "Wildfire", title: "Forest Fire - Athens", location: "Greece" },
      { id: 12, lat: -3.46, lng: -62.21, magnitude: 5.0, type: "Wildfire", title: "Amazon Rainforest Fire", location: "Brazil" },
      { id: 13, lat: 53.93, lng: -116.57, magnitude: 3.8, type: "Wildfire", title: "Alberta Forest Fire", location: "Canada" },
      { id: 14, lat: 30.06, lng: 79.01, magnitude: 3.0, type: "Wildfire", title: "Uttarakhand Forest Fire", location: "India" }
    ];

    const filteredEvents = activeEvents.filter((event) => {
      // 1. Filter by Type
      let typeMatch = true;
      if (disasterType && disasterType !== "ALL") {
        const type = event.type.toLowerCase();
        if (disasterType === "Earthquake") typeMatch = type.includes("earth") || type.includes("quake");
        else if (disasterType === "Flood") typeMatch = type.includes("flood") || type.includes("rain");
        else if (disasterType === "Cyclone") typeMatch = type.includes("cyclone") || type.includes("storm");
        else if (disasterType === "Wildfire") typeMatch = type.includes("fire") || type.includes("wild");
      }

      // 2. Filter by Severity
      let severityMatch = true;
      if (severity && severity !== 'ALL') {
        const mag = Number(event.magnitude || 0);
        if (severity === 'CRITICAL') severityMatch = mag >= 6.0;
        else if (severity === 'HIGH') severityMatch = mag >= 4.5 && mag < 6.0;
        else if (severity === 'MEDIUM') severityMatch = mag >= 3.0 && mag < 4.5;
        else if (severity === 'LOW') severityMatch = mag < 3.0;
      }

      return typeMatch && severityMatch;
    });

    return filteredEvents.slice(0, 15); // Strict limit for enterprise cleanliness
  }, [storeEvents, disasterType, severity]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.3; // Slower, elegant rotation
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 });
    }
  }, []);

  const getEventColor = (type) => {
    const t = type.toLowerCase();
    if (t.includes("fire")) return "#FFEA00"; // Yellow
    if (t.includes("storm") || t.includes("cyclone")) return "#FF5500"; // Neon orange/red
    if (t.includes("flood") || t.includes("rain")) return "#00F0FF"; // Neon blue
    return "#FF003C"; // Earthquake / default
  };

  const handlePointClick = (event) => {
    setSelectedEvent(event);
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      globeRef.current.pointOfView({ lat: event.lat, lng: event.lng, altitude: 0.8 }, 1500);
    }
  };

  const handleClose = () => {
    setSelectedEvent(null);
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
    }
  };

  const arcData = useMemo(() => {
    if (isEvacuationMode && liveLocation && safeZones.length > 0) {
      return safeZones.map(zone => ({
        startLat: liveLocation.lat,
        startLng: liveLocation.lng,
        endLat: zone.latitude,
        endLng: zone.longitude,
        color: ['#00F0FF', '#FF003C'] // Cyan to Red glow
      }))
    }
    return [
      { startLat: 34.05, startLng: -118.24, endLat: 35.68, endLng: 139.69, color: ['#00F0FF', '#transparent'] },
      { startLat: 51.50, startLng: -0.12, endLat: 22.31, endLng: 114.16, color: ['#00F0FF', '#transparent'] },
      { startLat: -33.86, startLng: 151.20, endLat: -23.55, endLng: -46.63, color: ['#00F0FF', '#transparent'] },
    ];
  }, [isEvacuationMode, liveLocation, safeZones])

  const mapElements = useMemo(() => {
    let elements = [...events];
    
    if (isEvacuationMode) {
      if (liveLocation) {
        elements.push({
          isUser: true,
          lat: liveLocation.lat,
          lng: liveLocation.lng,
          title: "YOUR LOCATION",
          type: "User"
        })
      }
      if (activeDangerEvent) {
        elements.push({
          isDangerZone: true,
          lat: activeDangerEvent.lat || activeDangerEvent.latitude,
          lng: activeDangerEvent.lon || activeDangerEvent.longitude,
          title: "DANGER ZONE",
          type: "Danger"
        })
      }
      if (safeZones.length > 0) {
        safeZones.forEach(zone => {
          elements.push({
            isShelter: true,
            lat: zone.latitude,
            lng: zone.longitude,
            title: zone.name,
            type: "Shelter"
          })
        })
      }
    }
    
    return elements;
  }, [events, isEvacuationMode, liveLocation, safeZones])

  return (
    <div ref={containerRef} className="w-full h-full relative group">
      {/* Target HUD Center Reticle - minimal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 w-48 h-48 opacity-[0.03] border border-cyber-cyan/50 rounded-full flex items-center justify-center">
        <div className="w-1 h-2 bg-cyber-cyan absolute top-0" />
        <div className="w-1 h-2 bg-cyber-cyan absolute bottom-0" />
        <div className="w-2 h-1 bg-cyber-cyan absolute left-0" />
        <div className="w-2 h-1 bg-cyber-cyan absolute right-0" />
      </div>

      <Globe
        ref={globeRef}
        width={globeSize.width}
        height={globeSize.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        atmosphereColor="#00F0FF"
        atmosphereAltitude={0.15}

        // Orbit lines or Evacuation Routes
        arcsData={arcData}
        arcColor="color"
        arcDashLength={isEvacuationMode ? 0.2 : 0.4}
        arcDashGap={isEvacuationMode ? 1 : 4}
        arcDashInitialGap={() => Math.random() * 5}
        arcDashAnimateTime={isEvacuationMode ? 2000 : 20000}
        arcStroke={isEvacuationMode ? 1.5 : 0.5}

        // Clean, small points
        htmlElementsData={mapElements}
        htmlElement={e => {
          const el = document.createElement('div');
          
          if (e.isUser) {
            el.innerHTML = `
              <div style="width: 30px; height: 30px; transform: translate(-50%, -50%); position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="background: #00F0FF; width: 8px; height: 8px; border-radius: 50%; position: absolute; z-index: 10; box-shadow: 0 0 15px #00F0FF;"></div>
                <div style="width: 100%; height: 100%; border-radius: 50%; border: 2px solid #00F0FF; animation: ripple 1.5s infinite;"></div>
              </div>
            `;
            return el;
          }
          
          if (e.isShelter) {
            el.innerHTML = `
              <div style="width: 24px; height: 24px; transform: translate(-50%, -50%); position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="background: #39FF14; width: 6px; height: 6px; border-radius: 50%; position: absolute; z-index: 10; box-shadow: 0 0 10px #39FF14;"></div>
                <div style="width: 100%; height: 100%; border-radius: 50%; border: 1px dashed #39FF14; animation: spin 4s linear infinite;"></div>
              </div>
            `;
            return el;
          }

          if (e.isDangerZone) {
            el.innerHTML = `
              <div style="width: 120px; height: 120px; transform: translate(-50%, -50%); position: relative; display: flex; align-items: center; justify-content: center; pointer-events: none;">
                <div style="width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle, rgba(255,0,60,0.5) 0%, transparent 70%); animation: pulseGlow 2s infinite alternate;"></div>
                <div style="position: absolute; border: 2px dashed #FF003C; width: 100%; height: 100%; border-radius: 50%; animation: spin 10s linear infinite; opacity: 0.8;"></div>
              </div>
            `;
            return el;
          }

          const color = getEventColor(e.type);
          const t = String(e.type).toLowerCase();
          
          let animationStyle;
          if (t.includes('cyclone') || t.includes('storm')) {
            // Pulsing storm animation
            animationStyle = `animation: spin 2s linear infinite, pulseGlow 1.5s infinite alternate; border: 2px dashed ${color}; opacity: 0.8;`;
          } else if (t.includes('flood') || t.includes('rain')) {
            // Blue heatmap ripple
            animationStyle = `animation: ripple 2s infinite; background: radial-gradient(circle, ${color}88 0%, transparent 70%); border: none;`;
          } else {
            // Default radar pulse
            animationStyle = `border: 1px solid ${color}; animation: pulseGlow 3s infinite; opacity: 0.3;`;
          }

          el.innerHTML = `
            <div class="cursor-pointer" style="width: 24px; height: 24px; transform: translate(-50%, -50%); position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="background: ${color}; width: 6px; height: 6px; border-radius: 50%; position: absolute; z-index: 10; box-shadow: 0 0 10px ${color};"></div>
              <div style="width: 100%; height: 100%; border-radius: 50%; ${animationStyle}"></div>
            </div>
          `;
          el.onclick = () => handlePointClick(e);
          el.style.pointerEvents = 'auto';
          return el;
        }}
      />

      <AnimatePresence>
        {selectedEvent && (
          <div className="absolute bottom-6 left-6 z-50">
            <motion.div 
              initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
              className="bg-black/80 backdrop-blur-md border border-cyber-border/30 p-4 rounded shadow-2xl w-[300px] font-mono text-white relative"
            >
              <h3 className="font-orbitron font-bold text-sm text-white mb-3 truncate border-b border-cyber-border/30 pb-2">
                {selectedEvent.title}
              </h3>
              
              <div className="space-y-2 text-xs text-gray-400 mb-4">
                <div className="flex justify-between items-center">
                  <span>CLASS</span>
                  <span className="text-white">{selectedEvent.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SEVERITY</span>
                  <span className="text-cyber-red font-bold">{selectedEvent.magnitude}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>COORDS</span>
                  <span className="text-cyber-cyan">{selectedEvent.lat.toFixed(2)}°, {selectedEvent.lng.toFixed(2)}°</span>
                </div>
              </div>

              <button 
                className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-cyber-border/30 text-white transition-all text-[10px] font-bold uppercase tracking-wider"
                onClick={handleClose}
              >
                Close Tracking
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
