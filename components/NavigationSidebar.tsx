
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { APP_NAME } from '../constants';
import { 
  BriefcaseIcon, 
  ViewGridIcon, 
  CheckCircleIcon, 
  ArrowRightOnRectangleIcon,
  FolderIcon // Using FolderIcon for "Projects/Workspace"
// FIX: Import IconProps for strong typing of icon components
} from './icons';
import type { IconProps } from './icons';

interface NavLinkProps {
  to: string; // Should be a ViewMode
  // FIX: Changed icon type from React.ReactNode to React.ReactElement<IconProps> for type safety with React.cloneElement
  icon: React.ReactElement<IconProps>;
  label: string;
  currentView: string;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, currentView, onClick }) => {
  const isActive = currentView === to;
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                  ${isActive 
                    ? 'bg-macrum-primary_hover text-white' 
                    : 'text-neutral-light hover:bg-macrum-primary_hover hover:text-white'
                  }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* FIX: Removed 'as React.ReactElement' cast; type inference is now correct due to updated NavLinkProps['icon'] type */}
      {React.cloneElement(icon, { className: 'w-6 h-6 mr-3' })}
      {label}
    </button>
  );
};

export const NavigationSidebar: React.FC = () => {
  const { currentView, setCurrentView, logout, selectBusiness, selectProject, currentUser } = useAppContext();

  const handleNavigate = (view: 'dashboard' | 'projects' | 'allTasks') => {
    if (view === 'projects') {
      selectBusiness(null); // Reset selections when going to the main projects (workspace) view
      selectProject(null);
    }
    setCurrentView(view);
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-60 bg-macrum-primary text-white flex flex-col shadow-lg z-40">
      {/* Logo/App Name */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-macrum-primary_hover">
        <BriefcaseIcon className="w-8 h-8 mr-2 text-white" />
        <span className="text-2xl font-bold">{APP_NAME}</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-2">
        <NavLink
          to="dashboard"
          icon={<ViewGridIcon />}
          label="Dashboard"
          currentView={currentView}
          onClick={() => handleNavigate('dashboard')}
        />
        <NavLink
          to="projects"
          icon={<FolderIcon />} // Changed icon for "Projects"
          label="Projects" // This is the 3-column workspace view
          currentView={currentView}
          onClick={() => handleNavigate('projects')}
        />
        <NavLink
          to="allTasks"
          icon={<CheckCircleIcon />}
          label="All Tasks"
          currentView={currentView}
          onClick={() => handleNavigate('allTasks')}
        />
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-macrum-primary_hover">
        {currentUser && (
          <div className="mb-3 text-center">
            <p className="text-sm font-medium text-white">{currentUser.name}</p>
            <p className="text-xs text-neutral-light">{currentUser.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium rounded-md bg-red-500 hover:bg-red-600 transition-colors duration-150 ease-in-out"
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};