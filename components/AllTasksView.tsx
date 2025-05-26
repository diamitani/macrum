import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { FormattedTask, ProjectStatus, Business } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Input } from './shared/Input';
import { Select } from './shared/Select';
import { CheckCircleIcon, CircleIcon, CalendarDaysIcon, BriefcaseIcon, FolderIcon, PlusIcon } from './icons';
import { EmptyState } from './shared/EmptyState';
import { Modal } from './shared/Modal';
import { CreateTaskForm } from './forms/CreateTaskForm'; // New Import

const TaskItem: React.FC<{ task: FormattedTask; onNavigate: () => void, onToggleComplete: () => void }> = ({ task, onNavigate, onToggleComplete }) => {
  const now = new Date();
  now.setHours(0,0,0,0); // for date comparison
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < now && !task.completed;

  return (
    <Card className={`mb-3 shadow-sm hover:shadow-md transition-shadow ${task.completed ? 'bg-neutral-lightest opacity-70' : 'bg-white'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
             <button onClick={onToggleComplete} className="mr-3 focus:outline-none" aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}>
                {task.completed ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6 text-neutral-medium" />}
            </button>
            <div>
                <span className={`font-semibold ${task.completed ? 'line-through text-neutral-dark' : 'text-neutral-darkest'}`}>
                {task.name}
                </span>
                <p className="text-xs text-neutral-dark mt-0.5">
                <BriefcaseIcon className="w-3 h-3 inline-block mr-1" />{task.businessName} / <FolderIcon className="w-3 h-3 inline-block mr-1" />{task.projectName}
                </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={onNavigate}>
            View Project
          </Button>
        </div>
        {task.description && <p className="text-sm text-neutral-dark my-1">{task.description}</p>}
        {dueDate && (
          <p className={`text-xs mt-1 font-medium ${isOverdue ? 'text-red-600' : task.completed ? 'text-neutral-dark' : 'text-blue-600'}`}>
            <CalendarDaysIcon className="w-4 h-4 inline-block mr-1" />
            Due: {dueDate.toLocaleDateString()} {isOverdue ? '(Overdue)' : ''}
          </p>
        )}
      </div>
    </Card>
  );
};

export const AllTasksView: React.FC = () => {
  const { businesses, selectBusiness, selectProject, setCurrentView, toggleTaskComplete } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('incomplete');
  const [sortBy, setSortBy] = useState<'dueDateAsc' | 'dueDateDesc' | 'nameAsc'>('dueDateAsc');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const allProjectsExist = useMemo(() => businesses.some(b => b.projects.length > 0), [businesses]);

  const allTasks = useMemo((): FormattedTask[] => {
    return businesses.flatMap(business =>
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
  }, [businesses]);

  const filteredAndSortedTasks = useMemo(() => {
    let tasks = allTasks;

    if (filterStatus !== 'all') {
      tasks = tasks.filter(task => filterStatus === 'completed' ? task.completed : !task.completed);
    }

    if (searchTerm) {
      tasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return tasks.sort((a, b) => {
        switch (sortBy) {
            case 'dueDateAsc':
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            case 'dueDateDesc':
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            case 'nameAsc':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

  }, [allTasks, searchTerm, filterStatus, sortBy]);

  const handleNavigateToProject = (businessId: string, projectId: string) => {
    selectBusiness(businessId);
    selectProject(projectId);
    setCurrentView('projects');
  };

  const handleToggleTask = (businessId: string, projectId: string, taskId: string) => {
    toggleTaskComplete(businessId, projectId, taskId);
  };
  
  const statusOptions = [
      { value: 'incomplete', label: 'Incomplete' },
      { value: 'completed', label: 'Completed' },
      { value: 'all', label: 'All' },
  ];

  const sortOptions = [
      { value: 'dueDateAsc', label: 'Due Date (Oldest First)' },
      { value: 'dueDateDesc', label: 'Due Date (Newest First)' },
      { value: 'nameAsc', label: 'Name (A-Z)' },
  ];
  
  const renderEmptyState = () => {
    if (businesses.length === 0) {
      return (
        <EmptyState 
          Icon={BriefcaseIcon}
          title="No Businesses Found"
          message="You need to create a business first. Go to the 'Projects' section to add your first business, then a project, and then tasks."
          actionText="Go to Projects"
          onActionClick={() => setCurrentView('projects')}
        />
      );
    }
    if (!allProjectsExist) {
       return (
        <EmptyState 
          Icon={FolderIcon}
          title="No Projects Found"
          message="You need to create a project first. Go to the 'Projects' section, select a business, and add your first project."
          actionText="Go to Projects"
          onActionClick={() => setCurrentView('projects')}
        />
      );
    }
    if (allTasks.length === 0 && !searchTerm) {
        return (
            <EmptyState 
                Icon={CheckCircleIcon}
                title="No Tasks Yet!"
                message="There are no tasks across any of your projects. Click 'Add New Task' to create your first one."
                actionText="Add New Task"
                onActionClick={() => setIsAddTaskModalOpen(true)}
            />
        );
    }
    if (filteredAndSortedTasks.length === 0 && searchTerm) {
         return (
            <EmptyState 
                Icon={CheckCircleIcon}
                title="No Tasks Match Your Filters"
                message="Try adjusting your search or filter criteria, or add a new task."
                actionText="Add New Task"
                onActionClick={() => setIsAddTaskModalOpen(true)}
            />
        );
    }
    return null;
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-darkest">All Tasks</h1>
        <Button 
            variant="primary" 
            onClick={() => setIsAddTaskModalOpen(true)}
            leftIcon={<PlusIcon />}
            disabled={businesses.length === 0 || !allProjectsExist}
            title={businesses.length === 0 ? "Create a business first" : !allProjectsExist ? "Create a project first" : "Add a new task"}
        >
            Add New Task
        </Button>
      </div>
      
      <Card className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Search Tasks"
            placeholder="Search by name, project, business..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            label="Filter by Status"
            options={statusOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'incomplete')}
          />
          <Select
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dueDateAsc' | 'dueDateDesc' | 'nameAsc')}
          />
        </div>
      </Card>

      {filteredAndSortedTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredAndSortedTasks.map(task => (
            <TaskItem 
                key={task.id} 
                task={task} 
                onNavigate={() => handleNavigateToProject(task.businessId, task.projectId)}
                onToggleComplete={() => handleToggleTask(task.businessId, task.projectId, task.id)}
            />
          ))}
        </div>
      ) : (
        renderEmptyState()
      )}

      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Add New Task"
        size="md"
      >
        <CreateTaskForm onClose={() => setIsAddTaskModalOpen(false)} />
      </Modal>
    </div>
  );
};