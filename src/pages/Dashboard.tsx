import React from 'react';
import { Users, UserCheck, UserX, Clock, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('dashboard.totalEmployees'),
      value: '124',
      icon: Users,
      color: 'text-cyber-neon-cyan',
      bgGradient: 'from-cyber-neon-cyan to-cyber-neon-blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: t('dashboard.presentToday'),
      value: '98',
      icon: UserCheck,
      color: 'text-cyber-neon-green',
      bgGradient: 'from-cyber-neon-green to-cyber-accent-matrix',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: t('dashboard.onLeave'),
      value: '12',
      icon: UserX,
      color: 'text-cyber-neon-yellow',
      bgGradient: 'from-cyber-neon-yellow to-cyber-neon-orange',
      change: '-8%',
      changeType: 'negative'
    },
    {
      title: t('dashboard.lateArrivals'),
      value: '4',
      icon: Clock,
      color: 'text-cyber-neon-pink',
      bgGradient: 'from-cyber-neon-pink to-cyber-neon-red',
      change: '-15%',
      changeType: 'positive'
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'SYSTEM.CHECKED_IN', time: '09:00:00', status: 'success', id: 'USR-001' },
    { user: 'Jane Smith', action: 'SYSTEM.CHECKED_OUT', time: '18:00:00', status: 'success', id: 'USR-002' },
    { user: 'Mike Johnson', action: 'ALERT.LATE_ARRIVAL', time: '09:30:00', status: 'warning', id: 'USR-003' },
    { user: 'Sarah Wilson', action: 'REQUEST.LEAVE_APPLIED', time: '08:45:00', status: 'info', id: 'USR-004' },
  ];

  const quickActions = [
    { 
      title: t('dashboard.markAttendance'), 
      icon: Clock, 
      color: 'text-cyber-neon-cyan',
      gradient: 'from-cyber-neon-cyan to-cyber-neon-blue',
      description: 'BIOMETRIC.SCAN'
    },
    { 
      title: t('dashboard.viewReports'), 
      icon: Activity, 
      color: 'text-cyber-neon-green',
      gradient: 'from-cyber-neon-green to-cyber-accent-matrix',
      description: 'DATA.ANALYTICS'
    },
    { 
      title: t('dashboard.manageEmployees'), 
      icon: Users, 
      color: 'text-cyber-neon-purple',
      gradient: 'from-cyber-neon-purple to-cyber-neon-pink',
      description: 'HR.MANAGEMENT'
    },
  ];

  return (
    <div className="space-y-8 cyberpunk:space-y-10">
      {/* Cyberpunk Header with Animated Effects */}
      <div className="mb-10 relative">
        {/* Animated background pattern */}
        <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-r cyberpunk:from-cyber-neon-cyan/10 cyberpunk:via-transparent cyberpunk:to-cyber-neon-pink/10 cyberpunk:animate-pulse cyberpunk:rounded-lg"></div>
        
        <div className="relative z-10 cyberpunk:cyber-card cyberpunk:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white cyberpunk:text-cyber-neon-cyan cyberpunk:font-cyber cyberpunk:text-neon-glow cyberpunk:animate-glow-pulse mb-3">
                {t('dashboard.welcome')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 cyberpunk:text-cyber-neon-green cyberpunk:font-matrix text-lg">
                <span className="cyberpunk:animate-digital-glitch">SYSTEM.MONITORING</span> - Neural network attendance tracking
              </p>
            </div>
            
            {/* System Status Indicator */}
            <div className="cyberpunk:flex cyberpunk:items-center cyberpunk:space-x-3 hidden">
              <div className="cyberpunk:flex cyberpunk:flex-col cyberpunk:items-end">
                <div className="cyberpunk:flex cyberpunk:items-center cyberpunk:space-x-2">
                  <div className="cyberpunk:w-3 cyberpunk:h-3 cyberpunk:bg-cyber-neon-green cyberpunk:rounded-full cyberpunk:animate-neon-flicker"></div>
                  <span className="cyberpunk:text-cyber-neon-green cyberpunk:font-matrix cyberpunk:text-sm">ONLINE</span>
                </div>
                <span className="cyberpunk:text-cyber-neon-cyan cyberpunk:font-matrix cyberpunk:text-xs cyberpunk:animate-quantum-shift">
                  QUANTUM.SYNC.ACTIVE
                </span>
              </div>
              <Zap className="cyberpunk:w-8 cyberpunk:h-8 cyberpunk:text-cyber-neon-yellow cyberpunk:animate-cyber-float" />
            </div>
          </div>
        </div>
      </div>

      {/* Cyberpunk Stats Grid with 3D Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 cyberpunk:gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 cyberpunk:cyber-stat-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cyberpunk:border-electric p-6 hover:shadow-md cyberpunk:hover:shadow-neon-cyan transition-all duration-300 group relative overflow-hidden"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Cyberpunk animated background */}
            <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-br cyberpunk:from-cyber-dark-400/50 cyberpunk:to-cyber-dark-300/30 cyberpunk:opacity-0 group-hover:cyberpunk:opacity-100 cyberpunk:transition-opacity cyberpunk:duration-500"></div>
            
            {/* Data stream animation */}
            <div className="cyberpunk:absolute cyberpunk:top-0 cyberpunk:left-0 cyberpunk:w-full cyberpunk:h-1 cyberpunk:bg-gradient-to-r cyberpunk:from-transparent cyberpunk:via-cyber-neon-cyan cyberpunk:to-transparent cyberpunk:animate-data-stream"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 cyberpunk:text-cyber-neon-cyan cyberpunk:font-matrix mb-2">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white cyberpunk:text-neon-glow cyberpunk:font-cyber cyberpunk:animate-glow-pulse">
                  <span className={`cyberpunk:${stat.color}`}>{stat.value}</span>
                </p>
                <div className="flex items-center mt-3">
                  <div className="flex items-center space-x-1">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600 cyberpunk:text-cyber-neon-green cyberpunk:animate-cyber-float" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 cyberpunk:text-cyber-neon-red cyberpunk:animate-cyber-float" />
                    )}
                    <span className={`text-sm font-medium cyberpunk:font-matrix ${
                      stat.changeType === 'positive' 
                        ? 'text-emerald-600 cyberpunk:text-cyber-neon-green' 
                        : 'text-red-600 cyberpunk:text-cyber-neon-red'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 cyberpunk:text-cyber-neon-cyan cyberpunk:font-matrix ml-2 cyberpunk:animate-neon-flicker">
                    vs.LAST_CYCLE
                  </span>
                </div>
              </div>
              
              {/* 3D Icon with Hologram Effect */}
              <div className={`p-4 rounded-lg bg-gradient-to-br cyberpunk:${stat.bgGradient} cyberpunk:shadow-cyber-glow cyberpunk:animate-hologram relative`}>
                <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-br cyberpunk:from-white/20 cyberpunk:to-transparent cyberpunk:rounded-lg"></div>
                <stat.icon className="w-8 h-8 text-white cyber-icon relative z-10" />
                
                {/* Particle effect */}
                <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:rounded-lg">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="cyberpunk:absolute cyberpunk:w-1 cyberpunk:h-1 cyberpunk:bg-white cyberpunk:rounded-full cyberpunk:animate-ping"
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${10 + i * 20}%`,
                        animationDelay: `${i * 0.5}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cyberpunk Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 cyberpunk:cyber-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cyberpunk:border-electric p-6 relative overflow-hidden">
          {/* Matrix rain effect */}
          <div className="cyberpunk:absolute cyberpunk:top-0 cyberpunk:right-0 cyberpunk:w-20 cyberpunk:h-full cyberpunk:pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="cyberpunk:absolute cyberpunk:w-px cyberpunk:h-8 cyberpunk:bg-cyber-neon-green cyberpunk:animate-matrix-rain cyberpunk:opacity-30"
                style={{
                  left: `${i * 20}%`,
                  animationDelay: `${i * 0.8}s`,
                }}
              ></div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white cyberpunk:text-cyber-neon-cyan cyberpunk:font-cyber cyberpunk:text-neon-glow">
              {t('dashboard.recentActivity')}
            </h3>
            <div className="cyberpunk:flex cyberpunk:items-center cyberpunk:space-x-2 hidden">
              <div className="cyberpunk:w-2 cyberpunk:h-2 cyberpunk:bg-cyber-neon-green cyberpunk:rounded-full cyberpunk:animate-neon-flicker"></div>
              <span className="cyberpunk:text-cyber-neon-green cyberpunk:font-matrix cyberpunk:text-sm">REAL_TIME</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-4 px-4 cyberpunk:cyber-card cyberpunk:border-cyber-dark-400 border-b border-gray-100 dark:border-gray-700 cyberpunk:border-b-0 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 cyberpunk:hover:shadow-neon-cyan transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  {/* Status indicator with pulse */}
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'success' ? 'bg-emerald-500 cyberpunk:bg-cyber-neon-green' :
                      activity.status === 'warning' ? 'bg-amber-500 cyberpunk:bg-cyber-neon-yellow' :
                      activity.status === 'info' ? 'bg-blue-500 cyberpunk:bg-cyber-neon-cyan' : 'bg-gray-500'
                    } cyberpunk:animate-neon-flicker`} />
                    <div className={`cyberpunk:absolute cyberpunk:inset-0 cyberpunk:rounded-full cyberpunk:animate-ping ${
                      activity.status === 'success' ? 'cyberpunk:bg-cyber-neon-green' :
                      activity.status === 'warning' ? 'cyberpunk:bg-cyber-neon-yellow' :
                      activity.status === 'info' ? 'cyberpunk:bg-cyber-neon-cyan' : 'cyberpunk:bg-gray-500'
                    }`}></div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white cyberpunk:text-cyber-neon-cyan cyberpunk:font-cyber">
                        {activity.user}
                      </p>
                      <span className="cyberpunk:text-cyber-neon-pink cyberpunk:font-matrix cyberpunk:text-xs cyberpunk:px-2 cyberpunk:py-1 cyberpunk:bg-cyber-dark-400 cyberpunk:rounded hidden cyberpunk:block">
                        {activity.id}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 cyberpunk:text-cyber-neon-green cyberpunk:font-matrix cyberpunk:animate-digital-glitch">
                      {activity.action}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400 cyberpunk:text-cyber-neon-yellow cyberpunk:font-matrix">
                    {activity.time}
                  </span>
                  <div className="cyberpunk:text-cyber-neon-cyan cyberpunk:font-matrix cyberpunk:text-xs cyberpunk:animate-quantum-shift">
                    TIMESTAMP.VERIFIED
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cyberpunk Quick Actions Panel */}
        <div className="bg-white dark:bg-gray-800 cyberpunk:cyber-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cyberpunk:border-electric p-6 relative">
          {/* Neural network background */}
          <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:opacity-20 cyberpunk:pointer-events-none">
            <div className="cyberpunk:absolute cyberpunk:top-4 cyberpunk:left-4 cyberpunk:w-16 cyberpunk:h-16 cyberpunk:border cyberpunk:border-cyber-neon-cyan cyberpunk:rounded-full cyberpunk:animate-neural-network"></div>
            <div className="cyberpunk:absolute cyberpunk:bottom-4 cyberpunk:right-4 cyberpunk:w-12 cyberpunk:h-12 cyberpunk:border cyberpunk:border-cyber-neon-pink cyberpunk:rounded-full cyberpunk:animate-neural-network" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white cyberpunk:text-cyber-neon-purple cyberpunk:font-cyber cyberpunk:text-neon-glow mb-6">
            {t('dashboard.quickActions')}
          </h3>
          
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 cyberpunk:cyber-button cyberpunk:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Scan line effect */}
                <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-r cyberpunk:from-transparent cyberpunk:via-white/10 cyberpunk:to-transparent cyberpunk:transform cyberpunk:-translate-x-full group-hover:cyberpunk:translate-x-full cyberpunk:transition-transform cyberpunk:duration-1000"></div>
                
                {/* 3D Icon */}
                <div className={`p-3 rounded-lg bg-gradient-to-br cyberpunk:${action.gradient} cyberpunk:shadow-cyber-glow cyberpunk:animate-cyber-breathe relative`}>
                  <action.icon className="w-6 h-6 text-white cyber-icon" />
                  
                  {/* Holographic overlay */}
                  <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-br cyberpunk:from-white/30 cyberpunk:to-transparent cyberpunk:rounded-lg"></div>
                </div>
                
                <div className="flex-1 text-left relative z-10">
                  <span className="text-sm font-medium text-gray-900 dark:text-white cyberpunk:text-cyber-neon-cyan cyberpunk:font-cyber block">
                    {action.title}
                  </span>
                  <span className="cyberpunk:text-cyber-neon-green cyberpunk:font-matrix cyberpunk:text-xs cyberpunk:animate-neon-flicker block">
                    {action.description}
                  </span>
                </div>
                
                {/* Arrow indicator */}
                <div className="cyberpunk:text-cyber-neon-pink cyberpunk:animate-cyber-float">
                  →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;