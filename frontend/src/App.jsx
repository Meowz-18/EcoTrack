import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { Home, BarChart3, Calculator, Trophy, Calendar, MessageSquare, User, Leaf } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CalculatorPage = lazy(() => import('./pages/Calculator'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Assistant = lazy(() => import('./pages/Assistant'));

const iconMap = { Home, BarChart3, Calculator, Trophy, Calendar, MessageSquare };

const MainLayout = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/calculator', icon: Calculator, label: 'Calculator' },
    { path: '/challenges', icon: Trophy, label: 'Challenges' },
    { path: '/timeline', icon: Calendar, label: 'Timeline' },
    { path: '/assistant', icon: MessageSquare, label: 'AI Assistant', special: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f7fdf9] bg-mesh font-sans overflow-x-hidden m-0 p-0 relative">
      {/* Dynamic ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-emerald-200/25 blur-[120px] animate-blob" />
        <div className="absolute top-[25%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-teal-200/20 blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[10%] w-[65vw] h-[65vw] rounded-full bg-lime-200/20 blur-[130px] animate-blob animation-delay-4000" />
      </div>

      <a href="#main-content" className="skip-to-content relative z-[101]">Skip to Main Content</a>
      
      {/* Top Navigation (Translucent Glass) */}
      <header className="fixed top-0 left-0 right-0 w-full h-20 bg-white/40 backdrop-blur-3xl border-b border-emerald-100/40 flex items-center justify-between px-8 md:px-12 z-[100] shadow-glass transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-leaf flex items-center justify-center shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform duration-500">
            <Leaf size={24} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 hidden sm:block">
            <span className="text-gradient">Eco</span>Track
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 focus-ring flex items-center gap-2 ${
                isActive 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-brand-primary'
              }`}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={item.special && !isActive ? "text-brand-secondary" : ""} aria-hidden="true" />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <button className="hidden lg:flex glass-btn !py-2.5 !px-6 text-xs" aria-label="Sign In">
              Sign In
           </button>
           <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-emerald-100 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-white transition-colors shadow-sm" aria-label="User Profile">
              <User size={20} aria-hidden="true" />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 pt-20 focus:outline-none relative z-10" tabIndex="-1">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex h-full items-center justify-center p-20">
              <div className="eco-loader">
                <Leaf size={20} />
              </div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Mobile Nav Bar */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-2xl border border-emerald-100/40 rounded-[2.5rem] h-16 flex justify-around items-center px-4 shadow-2xl z-50" role="navigation" aria-label="Mobile Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `flex flex-col items-center justify-center w-12 h-12 transition-all rounded-2xl ${
              isActive ? "text-brand-primary scale-110" : "text-slate-400"
            }`}
            aria-label={item.label}
          >
            {({ isActive }) => (
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calculator" element={<CalculatorPage />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="assistant" element={<Assistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
