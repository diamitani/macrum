
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Business as BusinessType, ModalType } from '../types';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import { Modal } from './shared/Modal';
import { AddBusinessForm } from './forms/AddBusinessForm';
import { PlusIcon, BriefcaseIcon, TrashIcon, PencilIcon, EllipsisVerticalIcon } from './icons';

interface BusinessItemProps {
  business: BusinessType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (business: BusinessType) => void;
  onDelete: (id: string) => void;
}

const BusinessItem: React.FC<BusinessItemProps> = ({ business, isSelected, onSelect, onEdit, onDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
      <Card 
        className={`mb-3 border-l-4 ${isSelected ? 'border-primary shadow-primary/30' : 'border-transparent hover:border-primary-light'}`}
        onClick={() => onSelect(business.id)}
      >
        <div className="p-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-md font-semibold ${isSelected ? 'text-primary-dark' : 'text-neutral-darkest'}`}>{business.name}</h3>
                    {business.industry && <p className="text-xs text-neutral-dark">{business.industry}</p>}
                </div>
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
                                onClick={(e) => { e.stopPropagation(); onEdit(business); setDropdownOpen(false); }} 
                                className="w-full text-left px-4 py-2 text-sm text-neutral-darkest hover:bg-neutral-light flex items-center"
                            >
                                <PencilIcon className="w-4 h-4 mr-2" /> Edit
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(business.id); setDropdownOpen(false);}} 
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            >
                                <TrashIcon className="w-4 h-4 mr-2" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-sm text-neutral-dark mt-1 truncate">{business.description}</p>
        </div>
      </Card>
    );
};


export const BusinessColumn: React.FC = () => {
  const { businesses, selectedBusinessId, selectBusiness, deleteBusiness } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<BusinessType | null>(null);

  const handleAddBusiness = () => {
    setEditingBusiness(null);
    setIsModalOpen(true);
  };

  const handleEditBusiness = (business: BusinessType) => {
    setEditingBusiness(business);
    setIsModalOpen(true);
  };

  const handleDeleteBusiness = (id: string) => {
    if (window.confirm("Are you sure you want to delete this business and all its projects?")) {
      deleteBusiness(id);
    }
  };

  return (
    <div className="w-full md:w-1/4 lg:w-1/5 h-full bg-neutral-lightest border-r border-neutral-medium p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neutral-darkest flex items-center">
            <BriefcaseIcon className="w-6 h-6 mr-2 text-primary" /> Businesses
        </h2>
        <Button onClick={handleAddBusiness} size="sm" variant="primary" leftIcon={<PlusIcon />}>
          Add
        </Button>
      </div>
      {businesses.length === 0 ? (
        <p className="text-neutral-dark text-center mt-10">No businesses yet. Click "Add" to get started.</p>
      ) : (
        businesses.map((business) => (
          <BusinessItem 
            key={business.id} 
            business={business}
            isSelected={selectedBusinessId === business.id}
            onSelect={selectBusiness}
            onEdit={handleEditBusiness}
            onDelete={handleDeleteBusiness}
          />
        ))
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBusiness ? "Edit Business" : "Add New Business"}
      >
        <AddBusinessForm onClose={() => setIsModalOpen(false)} businessToEdit={editingBusiness} />
      </Modal>
    </div>
  );
};
    