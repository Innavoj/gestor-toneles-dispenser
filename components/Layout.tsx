import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
//import { APP_NAME } from '../../constants';
import { APP_NAME } from '@/constants';
import { HomeIcon, CubeIcon, DocumentTextIcon, WrenchScrewdriverIcon, ChartBarIcon } from './ui/Icon'; 
// Assuming BeakerIcon or similar for Dispensers if available, using CubeIcon as placeholder
// You might want to add a new specific icon for Dispensers, e.g., BeakerIcon or TapIcon.
// For now, reusing existing icons or creating placeholders.
import { BriefcaseIcon as DispenserIcon } from './ui/Icon'; // Placeholder, replace with actual icon

interface IconPropsSVG extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  // Adding className to IconPropsSVG to ensure it's accepted by React.cloneElement
  className?: string;
}

interface NavItemProps {
  to: string;
  icon: React.ReactElement<IconPropsSVG>; 
  label: string;
  onClick?: () => void; // Add optional onClick prop
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick} // Pass the onClick handler to NavLink
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors duration-150 ${
        isActive
          ? 'bg-brew-brown-500 text-white shadow-md'
          : 'text-brew-brown-100 hover:bg-brew-brown-600 hover:text-white'
      }`
    }
  >
    {React.cloneElement(icon, { className: "mr-3 h-5 w-5" })}
    {label}
  </NavLink>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to close the sidebar, primarily for mobile after navigation
  const closeSidebar = () => {
    // Check if sidebar is open (implies mobile view where it can be toggled)
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-brew-brown-100">
      {/* Hamburger menu button for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-1.5 text-brew-brown-700 bg-brew-brown-50 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-brew-brown-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-brew-brown-700 text-white flex flex-col shadow-lg z-40`}>
        <div className="flex items-center justify-center h-20 border-b border-brew-brown-600">
          <img src="/hatuey.jfif" alt="Logo Cervecería" className="h-10 w-10 mr-2 rounded-full" />
          <h1 className="text-lg md:text-xl font-bold text-brew-gold-500">{APP_NAME}</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavItem to="/dashboard" icon={<HomeIcon />} label="Panel Principal" onClick={closeSidebar} />
          <NavItem to="/toneles" icon={<CubeIcon />} label="Toneles" onClick={closeSidebar} />
          <NavItem to="/lotes" icon={<DocumentTextIcon />} label="Lotes de Producción" onClick={closeSidebar} />
          <NavItem to="/dispensadores" icon={<DispenserIcon size={20} />} label="Dispensadores" onClick={closeSidebar} />
          <NavItem to="/mantenimiento-toneles" icon={<WrenchScrewdriverIcon />} label="Mtto. Toneles" onClick={closeSidebar} />
          <NavItem to="/mantenimiento-dispensadores" icon={<WrenchScrewdriverIcon />} label="Mtto. Dispensadores" onClick={closeSidebar} />
          <NavItem to="/reportes" icon={<ChartBarIcon />} label="Reportes" onClick={closeSidebar} />
        </nav>
        <div className="p-4 border-t border-brew-brown-600">
          <p className="text-xs text-brew-brown-300 text-center">&copy; {new Date().getFullYear()} {APP_NAME}</p>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${isSidebarOpen ? 'md:ml-0 ml-64' : 'ml-0'}`}>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brew-brown-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Placeholder for BriefcaseIcon if not already in Icon.tsx
// You should add this to your actual Icon.tsx file
const BriefcaseIcon: React.FC<IconPropsSVG> = (props) => {
    const { size = 20, ...restProps } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...restProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25V14.15M17.25 7.5V5.25A2.25 2.25 0 0 0 15 3H9a2.25 2.25 0 0 0-2.25 2.25V7.5M21 10.5h-18" />
        </svg>
    );
};


export default Layout;
