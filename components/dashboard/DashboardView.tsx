import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { StatCard } from './StatCard';
import { ProjectStatus, Task, FormattedTask } from '../../types';
import { 
    BriefcaseIcon, FolderIcon, CheckCircleIcon, CircleIcon, 
    ChartPieIcon, CalendarDaysIcon, ExclamationTriangleIcon 
} from '../icons';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

const statusColors: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: 'bg-green-500',
    [ProjectStatus.ON_HOLD]: 'bg-yellow-500',
    [ProjectStatus.COMPLETED]: 'bg-blue-500',
    [ProjectStatus.CANCELLED]: 'bg-red-500',
    [ProjectStatus.PLANNING]: 'bg-gray-500',
};
const statusTextColors: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: 'text-green-700 bg-green-100',
    [ProjectStatus.ON_HOLD]: 'text-yellow-700 bg-yellow-100',
    [ProjectStatus.COMPLETED]: 'text-blue-700 bg-blue-100',
    [ProjectStatus.CANCELLED]: 'text-red-700 bg-red-100',
    [ProjectStatus.PLANNING]: 'text-gray-700 bg-gray-100',
};


export const DashboardView: React.FC = () => {
  const { businesses, selectBusiness, selectProject, setCurrentView } = useAppContext();

  const allProjects = businesses.flatMap(b => b.projects);
  const allTasks: FormattedTask[] = businesses.flatMap(business => 
    business.projects.flatMap(project => 
      project.tasks.map(task => ({
        ...task,
        projectName: project.name,
        projectId: project.id,
        businessName: business.name,
        businessId: business.id,
      }))
    )
  );

  const totalBusinesses = businesses.length;
  const totalProjects = allProjects.length;
  const totalTasks = allTasks.length;
  
  const activeProjects = allProjects.filter(p => p.status === ProjectStatus.ACTIVE).length;
  const completedProjects = allProjects.filter(p => p.status === ProjectStatus.COMPLETED).length;

  const projectsByStatus = allProjects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<ProjectStatus, number>);

  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);

  const upcomingTasks = allTasks
    .filter(task => {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= sevenDaysFromNow;
    })
    .sort((a,b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  const overdueTasks = allTasks
    .filter(task => {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < now;
    })
    .sort((a,b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  const navigateToProjectItem = (businessId: string, projectId: string) => {
    selectBusiness(businessId);
    selectProject(projectId);
    setCurrentView('projects');
  };
  
  const TaskItem: React.FC<{task: FormattedTask, isOverdue?: boolean}> = ({ task, isOverdue }) => (
    <li className="p-3 bg-neutral-lightest rounded-md shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <span className={`font-medium ${task.completed ? 'line-through text-neutral-dark' : 'text-neutral-darkest'}`}>
                    {task.name}
                </span>
                <p className="text-xs text-neutral-dark">
                    {task.businessName} / {task.projectName}
                </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigateToProjectItem(task.businessId, task.projectId)}>
                View
            </Button>
        </div>
        {task.dueDate && (
            <p className={`text-xs mt-1 ${isOverdue && !task.completed ? 'text-red-600 font-semibold' : 'text-blue-500'}`}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
        )}
    </li>
  );


  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Total Businesses" value={totalBusinesses} icon={<BriefcaseIcon />} colorClassName="text-indigo-500" />
        <StatCard title="Total Projects" value={totalProjects} icon={<FolderIcon />} colorClassName="text-teal-500" />
        <StatCard title="Total Tasks" value={totalTasks} icon={<CheckCircleIcon />} colorClassName="text-amber-500" />
        <StatCard title="Active Projects" value={activeProjects} icon={<CircleIcon />} colorClassName="text-green-500" />
        <StatCard title="Completed Projects" value={completedProjects} icon={<CheckCircleIcon />} colorClassName="text-blue-500" />
      </div>

      {/* Main Content Area - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column / Main Column on smaller screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <div className="px-4 py-3 border-b border-neutral-light flex items-center">
              <CalendarDaysIcon className="w-5 h-5 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold text-neutral-darkest">Upcoming Tasks (Next 7 Days)</h3>
            </div>
            <div className="p-4">
              {upcomingTasks.length > 0 ? (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {upcomingTasks.map(task => <TaskItem key={task.id} task={task} />)}
                </ul>
              ) : (
                <p className="text-neutral-dark text-sm">No upcoming tasks in the next 7 days. Great job staying ahead!</p>
              )}
            </div>
          </Card>

          {/* Overdue Tasks */}
          <Card>
            <div className="px-4 py-3 border-b border-neutral-light flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-500" />
                <h3 className="text-lg font-semibold text-neutral-darkest">Overdue Tasks</h3>
            </div>
            <div className="p-4">
                {overdueTasks.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {overdueTasks.map(task => <TaskItem key={task.id} task={task} isOverdue={true} />)}
                    </ul>
                ) : (
                    <p className="text-neutral-dark text-sm">No overdue tasks. Everything is on track!</p>
                )}
            </div>
          </Card>
        </div>

        {/* Right Column / Second Column on smaller screens */}
        <div className="lg:col-span-1 space-y-6">
          {/* Project Status Summary */}
          <Card>
            <div className="px-4 py-3 border-b border-neutral-light flex items-center">
                <ChartPieIcon className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold text-neutral-darkest">Projects by Status</h3>
            </div>
            <div className="p-4 space-y-3">
              {Object.keys(ProjectStatus).length > 0 ? (
                Object.entries(projectsByStatus)
                  .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort for consistent order
                  .map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${statusColors[status as ProjectStatus]}`}></span>
                      <span className="text-sm text-neutral-darkest">{status}</span>
                    </div>
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${statusTextColors[status as ProjectStatus]}`}>{count}</span>
                  </div>
                ))
              ) : (
                 <p className="text-neutral-dark text-sm">No projects to display status for.</p>
              )}
               {totalProjects === 0 &&  <p className="text-neutral-dark text-sm">No projects found.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};