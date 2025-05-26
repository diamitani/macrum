
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Project as ProjectType, Business, ProjectStatus, ModalType } from '../types';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import { Modal } from './shared/Modal';
import { AddProjectForm } from './forms/AddProjectForm';
import { PlusIcon, FolderIcon, TrashIcon, PencilIcon, EllipsisVerticalIcon } from './icons';
import { EmptyState } from './shared/EmptyState';
import { PROJECT_STATUS_OPTIONS } from '../constants';
import { Select } from './shared/Select';

interface ProjectItemProps {
  project: ProjectType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (project: ProjectType) => void;
  onDelete: (id: string) => void;
  onStatusChange: (projectId: string, status: ProjectStatus) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, isSelected, onSelect, onEdit, onDelete, onStatusChange }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const statusColor = {
        [ProjectStatus.ACTIVE]: 'bg-green-100 text-green-700',
        [ProjectStatus.COMPLETED]: 'bg-blue-100 text-blue-700',
        [ProjectStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-700',
        [ProjectStatus.CANCELLED]: 'bg-red-100 text-red-700',
        [ProjectStatus.PLANNING]: 'bg-gray-100 text-gray-700',
    };

    return (
        <Card 
            className={`mb-4 border-l-4 ${isSelected ? 'border-secondary shadow-secondary/30' : 'border-transparent hover:border-secondary-light'}`}
            onClick={() => onSelect(project.id)}
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-lg font-semibold ${isSelected ? 'text-secondary-dark' : 'text-neutral-darkest'}`}>{project.name}</h4>
                    <div className="relative">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }} aria-label="Options">
                            <EllipsisVerticalIcon className="w-5 h-5" />
                        </Button>
                        {dropdownOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-neutral-medium"
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEdit(project); setDropdownOpen(false); }} 
                                    className="w-full text-left px-4 py-2 text-sm text-neutral-darkest hover:bg-neutral-light flex items-center"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" /> Edit
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDelete(project.id); setDropdownOpen(false);}} 
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-sm text-neutral-dark mb-3 h-10 overflow-hidden text-ellipsis">{project.description}</p>
                <div className="flex items-center justify-between text-xs text-neutral-dark">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[project.status] || statusColor[ProjectStatus.PLANNING]}`}>
                        {project.status}
                    </span>
                   {project.tasks && <span>{project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks</span>}
                </div>
                 {isSelected && (
                     <div className="mt-3 pt-3 border-t border-neutral-light">
                        <Select
                            label="Change Status"
                            options={PROJECT_STATUS_OPTIONS}
                            value={project.status}
                            onChange={(e) => onStatusChange(project.id, e.target.value as ProjectStatus)}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent card click when changing status
                        />
                     </div>
                 )}
            </div>
        </Card>
    );
};


export const ProjectColumn: React.FC = () => {
  const { businesses, selectedBusinessId, selectedProjectId, selectProject, deleteProject, updateProjectStatus } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);

  if (!selectedBusinessId || !selectedBusiness) {
    return (
      <div className="w-full md:w-1/2 lg:w-2/5 h-full bg-neutral-light border-r border-neutral-medium p-6 flex flex-col items-center justify-center">
        <FolderIcon className="w-16 h-16 text-neutral-medium mb-4" />
        <h3 className="text-xl font-semibold text-neutral-darkest">No Business Selected</h3>
        <p className="text-neutral-dark text-center">Please select a business from the left panel to view its projects.</p>
      </div>
    );
  }
  
  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: ProjectType) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project and all its data?")) {
      deleteProject(selectedBusinessId, projectId);
    }
  };

  const handleStatusChange = (projectId: string, status: ProjectStatus) => {
    updateProjectStatus(selectedBusinessId, projectId, status);
  };

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 h-full bg-neutral-light border-r border-neutral-medium p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neutral-darkest flex items-center">
            <FolderIcon className="w-6 h-6 mr-2 text-secondary" /> Projects for <span className="text-secondary ml-1">{selectedBusiness.name}</span>
        </h2>
        <Button onClick={handleAddProject} size="sm" variant="secondary" leftIcon={<PlusIcon />}>
          Add
        </Button>
      </div>
      {selectedBusiness.projects.length === 0 ? (
         <EmptyState
            Icon={FolderIcon}
            title="No Projects Yet"
            message={`There are no projects for ${selectedBusiness.name}. Get started by adding one.`}
            actionText="Add New Project"
            onActionClick={handleAddProject}
        />
      ) : (
        selectedBusiness.projects.map((project) => (
          <ProjectItem 
            key={project.id}
            project={project}
            isSelected={selectedProjectId === project.id}
            onSelect={selectProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onStatusChange={handleStatusChange}
          />
        ))
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Add New Project"}
      >
        <AddProjectForm 
            onClose={() => setIsModalOpen(false)} 
            businessId={selectedBusinessId}
            projectToEdit={editingProject}
        />
      </Modal>
    </div>
  );
};
    