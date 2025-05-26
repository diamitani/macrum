import { ProjectStatus } from './types';

export const APP_NAME = "Macrum";

export const PROJECT_STATUS_OPTIONS = Object.values(ProjectStatus).map(status => ({
  value: status,
  label: status,
}));

export const ASSET_TYPES = ['Document', 'Image', 'Link', 'Code Snippet', 'Video', 'Audio', 'Archive', 'Other'];

// Old key, will be replaced by user-specific keys
// export const INITIAL_BUSINESSES_DATA_KEY = 'crmAppData_businesses'; 

export const MACRUM_USERS_KEY = 'macrum_users'; // Stores array of User objects
export const MACRUM_CURRENT_USER_KEY = 'macrum_currentUser'; // Stores the current User object or null

// User-specific data will be stored under keys like `macrum_data_{userId}`
export const getUserDataKey = (userId: string) => `macrum_data_${userId}`;
