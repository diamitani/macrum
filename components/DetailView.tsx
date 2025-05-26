
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
// Fix: Import ProjectStatus
// FIX: Added ProjectStatus to the import statement below
import { Task, Contact, Asset, Note, Project, ModalType, ProjectStatus } from '../types';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import { Modal } from './shared/Modal';
import { ManageItemForm } from './forms/ManageItemForm';
import { EmptyState } from './shared/EmptyState';
import { DetailSection } from './DetailSection';
import { 
    CheckCircleIcon, CircleIcon, UserGroupIcon, PaperClipIcon, DocumentTextIcon, FolderIcon, TrashIcon, PencilIcon 
} from './icons';

type ItemType = 'task' | 'contact' | 'asset' | 'note';

export const DetailView: React.FC = () => {
  const { 
    businesses, selectedBusinessId, selectedProjectId, 
    toggleTaskComplete, deleteTask, deleteContact, deleteAsset, deleteNote
  } = useAppContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentItemType, setCurrentItemType] = useState<ItemType | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Task | Contact | Asset | Note | null>(null);

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);
  const selectedProject = selectedBusiness?.projects.find(p => p.id === selectedProjectId);

  if (!selectedBusinessId || !selectedBusiness) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center bg-neutral-light">
         <EmptyState Icon={FolderIcon} title="Select a Business" message="Choose a business from the left to see its details." />
      </div>
    );
  }
  if (!selectedProjectId || !selectedProject) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center bg-neutral-light">
        <EmptyState Icon={FolderIcon} title="Select a Project" message="Choose a project from the middle panel to see its details." />
      </div>
    );
  }

  const openModalForItem = (type: ItemType, item?: Task | Contact | Asset | Note) => {
    setCurrentItemType(type);
    setItemToEdit(item || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItemType(null);
    setItemToEdit(null);
  };
  
  const handleDelete = (type: ItemType, id: string) => {
    if (!selectedBusinessId || !selectedProjectId) return;
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    switch (type) {
      case 'task': deleteTask(selectedBusinessId, selectedProjectId, id); break;
      case 'contact': deleteContact(selectedBusinessId, selectedProjectId, id); break;
      case 'asset': deleteAsset(selectedBusinessId, selectedProjectId, id); break;
      case 'note': deleteNote(selectedBusinessId, selectedProjectId, id); break;
    }
  };

  const ItemActions: React.FC<{type: ItemType, item: any}> = ({type, item}) => (
    <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={() => openModalForItem(type, item)} aria-label="Edit">
            <PencilIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(type, item.id)} aria-label="Delete">
            <TrashIcon className="w-4 h-4 text-red-500" />
        </Button>
    </div>
  );

  const renderTask = (task: Task) => (
    <li key={task.id} className="flex items-center justify-between p-3 bg-neutral-lightest rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <button onClick={() => toggleTaskComplete(selectedBusinessId, selectedProjectId, task.id)} className="mr-3 focus:outline-none">
          {task.completed ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6 text-neutral-medium" />}
        </button>
        <div>
          <span className={`font-medium ${task.completed ? 'line-through text-neutral-dark' : 'text-neutral-darkest'}`}>{task.name}</span>
          <p className="text-xs text-neutral-dark">{task.description}</p>
          {task.dueDate && <p className="text-xs text-blue-500 mt-0.5">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
        </div>
      </div>
      <ItemActions type="task" item={task} />
    </li>
  );

  const renderContact = (contact: Contact) => (
    <li key={contact.id} className="p-3 bg-neutral-lightest rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-neutral-darkest">{contact.name}</h4>
          {contact.role && <p className="text-xs text-neutral-dark">{contact.role}</p>}
        </div>
        <ItemActions type="contact" item={contact} />
      </div>
      {contact.email && <p className="text-xs text-blue-500 mt-1">Email: {contact.email}</p>}
      {contact.phone && <p className="text-xs text-blue-500 mt-0.5">Phone: {contact.phone}</p>}
    </li>
  );

  const renderAsset = (asset: Asset) => (
    <li key={asset.id} className="p-3 bg-neutral-lightest rounded-md shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
             <div>
                <h4 className="font-medium text-neutral-darkest">{asset.name} <span className="text-xs bg-primary-light text-primary-dark font-mono px-1.5 py-0.5 rounded">{asset.type}</span></h4>
                {asset.description && <p className="text-xs text-neutral-dark mt-0.5">{asset.description}</p>}
             </div>
             <ItemActions type="asset" item={asset} />
        </div>
      {asset.link && <a href={asset.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block break-all">Link: {asset.link}</a>}
      {asset.content && asset.type === 'Code Snippet' && <pre className="text-xs bg-neutral-darkest text-white p-2 rounded mt-1 overflow-x-auto"><code>{asset.content}</code></pre>}
    </li>
  );

  const renderNote = (note: Note) => (
    <li key={note.id} className="p-3 bg-neutral-lightest rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-neutral-darkest">{note.title}</h4>
        <ItemActions type="note" item={note} />
      </div>
      <p className="text-xs text-neutral-dark whitespace-pre-wrap mt-1">{note.content}</p>
      <p className="text-xs text-neutral-medium mt-1">Created: {new Date(note.createdAt).toLocaleDateString()}</p>
    </li>
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-neutral-light">
      <Card className="mb-6 bg-white">
        <div className="p-4">
            <h2 className="text-2xl font-bold text-primary-dark mb-1">{selectedProject.name}</h2>
            <p className="text-sm text-neutral-dark mb-2">{selectedProject.description}</p>
            <div className="flex space-x-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedProject.status === ProjectStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    Status: {selectedProject.status}
                </span>
                {selectedProject.startDate && <span>Start: {new Date(selectedProject.startDate).toLocaleDateString()}</span>}
                {selectedProject.endDate && <span>End: {new Date(selectedProject.endDate).toLocaleDateString()}</span>}
            </div>
        </div>
      </Card>

      <DetailSection
        title="Tasks"
        Icon={CheckCircleIcon}
        items={selectedProject.tasks}
        renderItem={renderTask}
        onAddItem={() => openModalForItem('task')}
        emptyStateMessage="No tasks for this project yet. Add one!"
      />
      <DetailSection
        title="Contacts"
        Icon={UserGroupIcon}
        items={selectedProject.contacts}
        renderItem={renderContact}
        onAddItem={() => openModalForItem('contact')}
        emptyStateMessage="No contacts assigned to this project yet."
      />
      <DetailSection
        title="Assets"
        Icon={PaperClipIcon}
        items={selectedProject.assets}
        renderItem={renderAsset}
        onAddItem={() => openModalForItem('asset')}
        emptyStateMessage="No assets linked to this project yet."
      />
      <DetailSection
        title="Notes"
        Icon={DocumentTextIcon}
        items={selectedProject.notes}
        renderItem={renderNote}
        onAddItem={() => openModalForItem('note')}
        emptyStateMessage="No notes for this project yet."
      />
      
      {modalOpen && currentItemType && (
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={`${itemToEdit ? 'Edit' : 'Add'} ${currentItemType.charAt(0).toUpperCase() + currentItemType.slice(1)}`}
        >
          <ManageItemForm
            onClose={closeModal}
            businessId={selectedBusinessId}
            projectId={selectedProjectId}
            itemType={currentItemType}
            itemToEdit={itemToEdit}
          />
        </Modal>
      )}
    </div>
  );
};