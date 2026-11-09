import React, { useState, useEffect } from 'react';
import { 
  Bus, MapPin, Navigation, CloudRain, Clock, 
  Footprints, Users, Compass, ChevronRight, CheckCircle2, Shield 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STOPS = [
  { id: 1, name: 'Main Gate 1 Terminal', etaMins: 2, distanceWalk: '14 min', x: 18, y: 30 },
  { id: 2, name: 'Central Library & Admin Block', etaMins: 7, distanceWalk: '8 min', x: 42, y: 22 },
  { id: 3, name: 'Academic Block 2 & CS Labs', etaMins: 12, distanceWalk: '10 min', x: 74, y: 35 },
  { id: 4, name: 'Hostel Quad (PG & J Hostel)', etaMins: 18, distanceWalk: '16 min', x: 80, y: 72 },
  { id: 5, name: 'Sports Complex & Swimming Pool', etaMins: 23, distanceWalk: '20 min', x: 50, y: 82 },
  { id: 6, name: 'Hostel H & G Girls Residence', etaMins: 28, distanceWalk: '24 min', x: 22, y: 68 },
];

export default function App() {
  const [stops, setStops] = useState(STOPS);
  const [selectedStop, setSelectedStop] = useState(STOPS[0]);
  const [isOnBus, setIsOnBus] = useState(false);
  const [crowdCount, setCrowdCount] = useState(14);
  const [busProgressPercent, setBusProgressPercent] = useState(24);
  const [weatherCondition, setWeatherCondition] = useState({ temp: '16°C', status: 'Breezy / Drizzle', isRaining: true });
  const [userLocation, setUserLocation] = useState('Detecting nearest gate...');

  // Live ETA countdown simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setStops(prev => prev.map(stop => ({
        ...stop,
        etaMins: stop.etaMins <= 1 ? 30 : stop.etaMins - 1
      })));

      setBusProgressPercent(prev => (prev >= 98 ? 2 : prev + 2));
    }, 4000); // Progress tick every 4 seconds for lively demo

    return () => clearInterval(interval);
  }, []);

  // Geolocation detector
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(`GPS Active (${pos.coords.latitude.toFixed(3)}°, ${pos.coords.longitude.toFixed(3)}°)`);
        },
        () => {
          setUserLocation('Main Campus Zone (Approx)');
        },
        { timeout: 4000 }
      );
    }
  }, []);

  const handleToggleOnBus = () => {
    if (!isOnBus) {
      setIsOnBus(true);
      setCrowdCount(prev => prev + 1);
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      setIsOnBus(false);
      setCrowdCount(prev => Math.max(1, prev - 1));
    }
  };

  const isWalkingFaster = (etaMins, distanceWalkStr) => {
    const walkMins = parseInt(distanceWalkStr.replace(/[^0-9]/g, ''));
    return walkMins + 2 < etaMins;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bus size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>LoopPacer</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Evening Campus Circular & Night Shuttle Pacer</p>
          </div>
        </div>

        {/* Weather advisory pill */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '999px',
          padding: '6px 14px',
          fontSize: '12px'
        }}>
          <CloudRain size={16} color="#60a5fa" />
          <span style={{ color: '#cbd5e1' }}>{weatherCondition.temp} · {weatherCondition.status}</span>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Left Column: Visual Circuit Map & Crowd Pacer */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Passenger Crowdsourcing Banner */}
          <div style={{
            background: isOnBus ? 'linear-gradient(135deg, #065f46 0%, #0f172a 100%)' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: isOnBus ? '1px solid #10b981' : '1px solid #334155',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: isOnBus ? '#6ee7b7' : '#93c5fd', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isOnBus ? 'Broadcasting Your Trip' : 'Riding the Circular Right Now?'}
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '4px 0 2px 0' }}>
                {isOnBus ? 'You are pacing Shuttle #02' : 'Help peers get accurate loop arrivals'}
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                {crowdCount} students currently sharing bus speed & loop location
              </p>
            </div>

            <button
              onClick={handleToggleOnBus}
              style={{
                background: isOnBus ? '#10b981' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isOnBus ? <CheckCircle2 size={16} /> : <Bus size={16} />}
              {isOnBus ? "I'm on the Van" : "I'm on the Bus"}
            </button>
          </div>

          {/* Interactive Route Loop Visualizer */}
          <div style={{
            background: '#0d1527',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            height: '360px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '14px', left: '16px', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
              CAMPUS PERIMETER CIRCULAR LOOP (LIVE TRACKING)
            </div>

            {/* SVG Loop Track */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <path
                d="M 100 120 C 250 50, 450 60, 520 140 C 580 230, 480 300, 320 310 C 180 320, 80 260, 100 120 Z"
                fill="none"
                stroke="#1e293b"
                strokeWidth="12"
              />
              <path
                d="M 100 120 C 250 50, 450 60, 520 140 C 580 230, 480 300, 320 310 C 180 320, 80 260, 100 120 Z"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeDasharray="6, 6"
              />
            </svg>

            {/* Interactive Stop Pins */}
            {stops.map(stop => {
              const isSelected = selectedStop.id === stop.id;
              return (
                <div
                  key={stop.id}
                  onClick={() => setSelectedStop(stop)}
                  style={{
                    position: 'absolute',
                    top: `${stop.y}%`,
                    left: `${stop.x}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 10
                  }}
                >
                  <div style={{
                    width: isSelected ? '40px' : '30px',
                    height: isSelected ? '40px' : '30px',
                    borderRadius: '50%',
                    background: isSelected ? '#3b82f6' : '#1e293b',
                    border: isSelected ? '3px solid #ffffff' : '2px solid #60a5fa',
                    boxShadow: isSelected ? '0 0 16px #3b82f6' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}>
                    {stop.etaMins}m
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#cbd5e1',
                    background: 'rgba(15, 23, 42, 0.9)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginTop: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    {stop.name.split(' & ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={13} color="#3b82f6" /> {userLocation}
          </div>
        </section>

        {/* Right Column: Station ETA Ledger & Walk vs. Wait Advisor */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Active Station Card */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Stop</span>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 12px 0' }}>{selectedStop.name}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#030712', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> Shuttle Arrival
                </span>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc', marginTop: '4px' }}>
                  {selectedStop.etaMins} <span style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}>min</span>
                </div>
              </div>

              <div style={{ background: '#030712', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Footprints size={13} /> Walk Duration
                </span>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc', marginTop: '4px' }}>
                  {selectedStop.distanceWalk}
                </div>
              </div>
            </div>

            {/* Smart Pacer Recommendation */}
            {isWalkingFaster(selectedStop.etaMins, selectedStop.distanceWalk) ? (
              <div style={{ background: '#3b2204', border: '1px solid #b45309', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Footprints size={20} color="#f59e0b" />
                <div style={{ fontSize: '12px', color: '#fef3c7' }}>
                  <strong>Walk Recommended!</strong> Walking takes {selectedStop.distanceWalk}, whereas waiting for the next circular shuttle is ~{selectedStop.etaMins} min.
                </div>
              </div>
            ) : (
              <div style={{ background: '#064e3b', border: '1px solid #059669', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bus size={20} color="#6ee7b7" />
                <div style={{ fontSize: '12px', color: '#ecfdf5' }}>
                  <strong>Wait for Shuttle!</strong> Arriving in just {selectedStop.etaMins} mins. Recommended over walking in current cold/drizzle.
                </div>
              </div>
            )}
          </div>

          {/* Sequential Stops Queue */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '18px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 12px 0', color: '#cbd5e1' }}>Upcoming Loop Stops</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stops.map(st => {
                const isSelected = st.id === selectedStop.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStop(st)}
                    style={{
                      background: isSelected ? '#1e293b' : '#030712',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid #1e293b',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <span style={{ fontWeight: isSelected ? '700' : '500', color: isSelected ? '#fff' : '#cbd5e1' }}>
                      {st.name}
                    </span>
                    <span style={{
                      background: st.etaMins <= 5 ? '#065f46' : '#1f2937',
                      color: st.etaMins <= 5 ? '#a7f3d0' : '#93c5fd',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '11px'
                    }}>
                      {st.etaMins} min
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}