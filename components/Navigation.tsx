import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap, Layers, MessageCircle, Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/explain", icon: BookOpen, label: "Deep Dive" },
    { to: "/quiz", icon: GraduationCap, label: "Quiz Master" },
    { to: "/flashcards", icon: Layers, label: "Flashcards" },
    { to: "/tutor", icon: MessageCircle, label: "AI Tutor" },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 py-6 mb-4">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">Nero Notes</span>
      </div>

      <nav className="space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={toggleMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md text-slate-600"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-slate-200 bg-white shadow-sm z-10">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-0 z-40 md:hidden bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} onClick={toggleMenu}>
        <aside className={`
          absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `} onClick={e => e.stopPropagation()}>
          <NavContent />
        </aside>
      </div>
    </>
  );
};