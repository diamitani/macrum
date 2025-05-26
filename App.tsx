import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { BusinessColumn } from './components/BusinessColumn';
import { ProjectColumn } from './components/ProjectColumn';
import { DetailView } from './components/DetailView';
import { DashboardView } from './components/dashboard/DashboardView';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { NavigationSidebar } from './components/NavigationSidebar'; // New import
import { AllTasksView } from './components/AllTasksView'; // New import
import { APP_NAME } from './constants';
import { BriefcaseIcon } from './components/icons';

const AppContentLayout: React.FC = () => {
  return (
    // This div acts as the container for the 3-column layout.
    // Padding is handled by individual columns or the DetailView.
    <div className="flex h-full font-sans antialiased text-neutral-darkest">
      <BusinessColumn />
      <ProjectColumn />
      <DetailView />
    </div>
  );
};

const MainAppHeader: React.FC = () => {
  // Header is simplified, navigation moved to sidebar
  return (
    <header className="bg-macrum-primary text-white p-3 shadow-md h-16 flex items-center fixed top-0 left-0 right-0 z-30 md:left-60"> {/* Adjust left offset for sidebar */}
      <div className="container mx-auto flex justify-between items-center">
        {/* App name could be displayed here, or it could be part of the sidebar */}
        {/* For now, leave it minimal or optionally show app name for context if sidebar is collapsed */}
         <span className="text-xl font-bold">{/* Intentionally blank or context-specific title */}</span>
        {/* User-specific controls like profile dropdown could go here */}
      </div>
    </header>
  );
};


const AppCore: React.FC = () => {
  const { currentUser, currentView } = useAppContext();

  if (!currentUser) {
    if (currentView === 'login') return <LoginPage />;
    if (currentView === 'signup') return <SignupPage />;
    return <LandingPage />;
  }

  return (
    <div className="flex h-screen bg-neutral-lightest">
      <NavigationSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainAppHeader /> {/* Simplified header */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light pt-16 md:pt-16"> {/* Adjust top padding for fixed header */}
          {/* Conditional rendering of views based on currentView */}
          {currentView === 'dashboard' && <div className="p-4 md:p-6"><DashboardView /></div>}
          {currentView === 'projects' && <AppContentLayout />} {/* AppContentLayout manages its own padding via columns */}
          {currentView === 'allTasks' && <div className="p-4 md:p-6"><AllTasksView /></div>}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppCore />
    </AppProvider>
  );
};

export default App;