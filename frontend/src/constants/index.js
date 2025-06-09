// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: { 'image/*': [] },
  SUPPORTED_FORMATS: ['JPG', 'PNG']
};

// Animation timings
export const ANIMATION_TIMINGS = {
  ENTRANCE_DELAY: 300,
  LOADING_INTERVAL: 500,
  TRANSITION_DURATION: 500
};

// API endpoints
export const API_ENDPOINTS = {
  UPLOAD: '/upload'
};

// Loading progress thresholds
export const LOADING = {
  MAX_SIMULATED_PROGRESS: 90,
  COMPLETE_PROGRESS: 100
}; 