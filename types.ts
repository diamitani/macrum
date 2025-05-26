export enum ProjectStatus {
  ACTIVE = 'Active',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  PLANNING = 'Planning'
}

export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string; // e.g., 'Document', 'Image', 'Link', 'Code Snippet'
  description?: string;
  link?: string; 
  content?: string; // For notes or code snippets
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Project {
  id:string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  tasks: Task[];
  contacts: Contact[];
  assets: Asset[];
  notes: Note[];
}

export interface Business {
  id: string;
  name: string;
  industry?: string;
  description: string;
  projects: Project[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  // Password hash would be stored in a real backend, not here.
  // For simulation, we might not even need to store a password here.
}

export type ViewMode = 'projects' | 'dashboard' | 'landing' | 'login' | 'signup' | 'allTasks';

// AppContext related types
export interface AppContextType {
  businesses: Business[];
  selectedBusinessId: string | null;
  selectedProjectId: string | null;
  isLoading: boolean; 
  error: string | null; 
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  currentUser: User | null;

  // Auth methods
  login: (email: string, password?: string) => Promise<boolean>; // Password for simulation
  signup: (name: string, email: string, password?: string) => Promise<boolean>; // Password for simulation
  logout: () => void;

  // Business methods
  addBusiness: (business: Omit<Business, 'id' | 'projects'>) => void;
  selectBusiness: (id: string | null) => void;
  updateBusiness: (id: string, updates: Partial<Omit<Business, 'id' | 'projects'>>) => void;
  deleteBusiness: (id: string) => void;

  // Project methods
  addProject: (businessId: string, project: Omit<Project, 'id' | 'tasks' | 'contacts' | 'assets' | 'notes'>) => void;
  selectProject: (id: string | null) => void;
  updateProject: (businessId: string, projectId: string, updates: Partial<Omit<Project, 'id' | 'tasks' | 'contacts' | 'assets' | 'notes'>>) => void;
  deleteProject: (businessId: string, projectId: string) => void;
  updateProjectStatus: (businessId: string, projectId: string, status: ProjectStatus) => void;

  // Task methods
  addTask: (businessId: string, projectId: string, task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTaskComplete: (businessId: string, projectId: string, taskId: string) => void;
  updateTask: (businessId: string, projectId: string, taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (businessId: string, projectId: string, taskId: string) => void;

  // Contact methods
  addContact: (businessId: string, projectId: string, contact: Omit<Contact, 'id'>) => void;
  updateContact: (businessId: string, projectId: string, contactId: string, updates: Partial<Omit<Contact, 'id'>>) => void;
  deleteContact: (businessId: string, projectId: string, contactId: string) => void;

  // Asset methods
  addAsset: (businessId: string, projectId: string, asset: Omit<Asset, 'id'>) => void;
  updateAsset: (businessId: string, projectId: string, assetId: string, updates: Partial<Omit<Asset, 'id'>>) => void;
  deleteAsset: (businessId: string, projectId: string, assetId: string) => void;

  // Note methods
  addNote: (businessId: string, projectId: string, note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (businessId: string, projectId: string, noteId: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (businessId: string, projectId: string, noteId: string) => void;
}

export type ModalType = 
  | 'addBusiness' 
  | 'addProject' 
  | 'addTask' 
  | 'addContact' 
  | 'addAsset' 
  | 'addNote' 
  | 'editBusiness'
  | 'editProject'
  | 'editTask'
  | 'editContact'
  | 'editAsset'
  | 'editNote'
  | null;

export interface ModalState {
  type: ModalType;
  data?: any; 
}

export interface FormattedTask extends Task {
  projectName: string;
  businessName: string;
  projectId: string;
  businessId: string;
}