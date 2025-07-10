import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { 
  Zap, 
  Shield, 
  Cpu, 
  Database, 
  Network, 
  Brain,
  Eye,
  Fingerprint,
  Lock,
  Unlock
} from 'lucide-react';

const CyberpunkDemo: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isHacking, setIsHacking] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ONLINE');

  const cyberStats = [
    { label: 'CPU USAGE', value: '67%', color: 'text-cyber-neon-cyan', icon: Cpu },
    { label: 'MEMORY', value: '4.2GB', color: 'text-cyber-neon-green', icon: Database },
    { label: 'NETWORK', value: '890MB/s', color: 'text-cyber-neon-yellow', icon: Network },
    { label: 'SECURITY', value: 'PROTECTED', color: 'text-cyber-neon-pink', icon: Shield },
  ];

  const hackingSequence = [
    'INITIALIZING NEURAL INTERFACE...',
    'CONNECTING TO MAINFRAME...',
    'BYPASSING FIREWALL...',
    'ACCESSING EMPLOYEE DATABASE...',
    'QUANTUM ENCRYPTION DETECTED...',
    'BREAKING CIPHER...',
    'ACCESS GRANTED - WELCOME TO THE MATRIX'
  ];

  const [hackingStep, setHackingStep] = useState(0);

  useEffect(() => {
    if (isHacking && hackingStep < hackingSequence.length - 1) {
      const timer = setTimeout(() => {
        setHackingStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isHacking, hackingStep]);

  const startHacking = () => {
    setIsHacking(true);
    setHackingStep(0);
    setSystemStatus('HACKING');
  };

  const stopHacking = () => {
    setIsHacking(false);
    setHackingStep(0);
    setSystemStatus('ONLINE');
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Cyberpunk Background Effects */}
      <div className="cyber-background"></div>
      <div className="cyber-bg-grid fixed inset-0 opacity-30 pointer-events-none"></div>
      <div className="cyber-bg-circuit fixed inset-0 opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header with Theme Controls */}
        <div className="cyber-card p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-neon-cyan/10 via-transparent to-cyber-neon-pink/10 animate-pulse"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-cyber text-cyber-neon-cyan text-neon-glow animate-glow-pulse mb-4">
                CYBERPUNK 2077
              </h1>
              <p className="text-cyber-neon-green font-matrix text-xl animate-digital-glitch">
                ATTENDANCE.SYSTEM.NEURAL.INTERFACE
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="cyber-card p-4">
                <h3 className="text-cyber-neon-purple font-cyber mb-3">THEME SELECTOR</h3>
                <div className="flex space-x-2">
                  {['light', 'dark', 'cyberpunk'].map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeOption as any)}
                      className={`cyber-button px-4 py-2 text-sm ${
                        theme === themeOption ? 'shadow-neon-pink' : ''
                      }`}
                    >
                      {themeOption === 'light' ? '☀️' : themeOption === 'dark' ? '🌙' : '🔮'}
                      {themeOption.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {cyberStats.map((stat, index) => (
            <div
              key={index}
              className="cyber-stat-card hover-cyber group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyber-neon-cyan font-matrix text-sm mb-2">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-cyber ${stat.color} text-neon-glow animate-glow-pulse`}>
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyber-neon-cyan to-cyber-neon-pink shadow-cyber-glow animate-hologram">
                  <stat.icon className="w-6 h-6 text-white cyber-icon" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Hacking Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="cyber-card p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-cyber text-cyber-neon-green text-neon-glow">
                NEURAL TERMINAL
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full animate-neon-flicker ${
                  systemStatus === 'ONLINE' ? 'bg-cyber-neon-green' : 
                  systemStatus === 'HACKING' ? 'bg-cyber-neon-red' : 'bg-cyber-neon-yellow'
                }`}></div>
                <span className="font-matrix text-cyber-neon-cyan text-sm animate-digital-glitch">
                  STATUS: {systemStatus}
                </span>
              </div>
            </div>
            
            {/* Terminal Screen */}
            <div className="bg-cyber-dark-400 border border-cyber-neon-green rounded-lg p-4 h-64 overflow-y-auto font-matrix text-sm">
              <div className="text-cyber-neon-green">
                <div className="animate-neon-flicker">{'>'} QUANTUM SYSTEM INITIALIZED</div>
                <div className="animate-digital-glitch">{'>'} BIOMETRIC SCANNERS: ACTIVE</div>
                <div className="animate-quantum-shift">{'>'} NEURAL LINK: ESTABLISHED</div>
                
                {isHacking && (
                  <div className="mt-4 space-y-2">
                    {hackingSequence.slice(0, hackingStep + 1).map((step, index) => (
                      <div 
                        key={index} 
                        className={`text-cyber-neon-red animate-digital-glitch ${
                          index === hackingStep ? 'animate-neon-flicker' : ''
                        }`}
                      >
                        {'>'} {step}
                        {index === hackingStep && <span className="animate-ping">_</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Terminal Controls */}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={startHacking}
                disabled={isHacking}
                className="cyber-button flex items-center space-x-2"
              >
                <Lock className="w-4 h-4 cyber-icon" />
                <span>INITIATE HACK</span>
              </button>
              <button
                onClick={stopHacking}
                className="cyber-button flex items-center space-x-2"
              >
                <Unlock className="w-4 h-4 cyber-icon" />
                <span>RESET SYSTEM</span>
              </button>
            </div>
          </div>

          {/* Biometric Scanner */}
          <div className="cyber-card p-6 relative overflow-hidden">
            <h3 className="text-2xl font-cyber text-cyber-neon-purple text-neon-glow mb-6">
              BIOMETRIC SCANNER
            </h3>
            
            <div className="space-y-6">
              {/* Fingerprint Scanner */}
              <div className="relative">
                <div className="cyber-card p-8 text-center border-electric">
                  <Fingerprint className="w-24 h-24 text-cyber-neon-cyan mx-auto mb-4 animate-cyber-spin" />
                  <p className="font-matrix text-cyber-neon-green animate-neon-flicker">
                    PLACE FINGER ON SCANNER
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-neon-cyan/20 to-transparent animate-scan-line"></div>
              </div>
              
              {/* Retinal Scanner */}
              <div className="relative">
                <div className="cyber-card p-8 text-center border-plasma">
                  <Eye className="w-24 h-24 text-cyber-neon-pink mx-auto mb-4 animate-hologram" />
                  <p className="font-matrix text-cyber-neon-yellow animate-digital-glitch">
                    RETINAL SCAN ACTIVE
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyber-neon-pink/20 to-transparent animate-quantum-shift"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Network Visualization */}
        <div className="cyber-card p-8 relative overflow-hidden">
          <h3 className="text-3xl font-cyber text-cyber-neon-orange text-neon-glow mb-8 text-center">
            NEURAL NETWORK ACTIVITY
          </h3>
          
          <div className="relative h-64">
            {/* Network Nodes */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-cyber-neon-cyan rounded-full shadow-neon-cyan animate-neural-network"
                style={{
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              ></div>
            ))}
            
            {/* Connection Lines */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-gradient-to-r from-cyber-neon-green via-cyber-neon-cyan to-cyber-neon-pink animate-data-stream opacity-60"
                style={{
                  top: `${Math.random() * 90 + 5}%`,
                  left: '10%',
                  right: '10%',
                  animationDelay: `${i * 0.5}s`,
                }}
              ></div>
            ))}
            
            {/* Central Processing Unit */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon-purple to-cyber-neon-pink rounded-full shadow-cyber-glow animate-cyber-breathe flex items-center justify-center">
                <Brain className="w-8 h-8 text-white animate-hologram" />
              </div>
            </div>
          </div>
        </div>

        {/* Matrix Code Rain */}
        <div className="cyber-card p-8 relative overflow-hidden h-64">
          <h3 className="text-2xl font-cyber text-cyber-neon-green text-neon-glow mb-4">
            MATRIX CODE STREAM
          </h3>
          
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 text-cyber-neon-green font-matrix text-xs animate-matrix-rain opacity-70"
                style={{
                  left: `${i * 5}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {Array.from({ length: 20 }, () => 
                  String.fromCharCode(0x30A0 + Math.random() * 96)
                ).join('')}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="cyber-card p-6 text-center">
          <p className="font-matrix text-cyber-neon-cyan animate-neon-flicker">
            CYBERPUNK ATTENDANCE SYSTEM v2.0.77 - NEURAL INTERFACE ACTIVE
          </p>
          <p className="font-matrix text-cyber-neon-pink text-sm mt-2 animate-digital-glitch">
            WAKE THE F*CK UP, SAMURAI. WE'VE GOT ATTENDANCE TO TRACK.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkDemo;