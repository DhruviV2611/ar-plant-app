export interface JournalEntry {
  entryId: string;
  notes: string;
  photoUrl?: string;
  createdAt?: Date;
}

export interface Plant {
  _id?: string;
  name: string;
  scientificName?: string;
  careTips: {
    light?: string;
    water?: string;
    temperature?: string;
    humidity?: string;
  };
  toxicity: {
    severity?: string;
    symptoms?: string;
    notes?: string;
  };
  userId?: string;
  journalEntries?: JournalEntry[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlantIdentification {
  scientificName: string;
  commonName: string;
  confidenceScore: number;
}

// Basic CRUD actions
export const FETCH_PLANTS_REQUEST = 'FETCH_PLANTS_REQUEST';
export const FETCH_PLANTS_SUCCESS = 'FETCH_PLANTS_SUCCESS';
export const FETCH_PLANTS_FAILURE = 'FETCH_PLANTS_FAILURE';

export const ADD_PLANT_REQUEST = 'ADD_PLANT_REQUEST';
export const ADD_PLANT_SUCCESS = 'ADD_PLANT_SUCCESS';
export const ADD_PLANT_FAILURE = 'ADD_PLANT_FAILURE';

export const DELETE_PLANT_REQUEST = 'DELETE_PLANT_REQUEST';
export const DELETE_PLANT_SUCCESS = 'DELETE_PLANT_SUCCESS';
export const DELETE_PLANT_FAILURE = 'DELETE_PLANT_FAILURE';

export const UPDATE_PLANT_REQUEST = 'UPDATE_PLANT_REQUEST';
export const UPDATE_PLANT_SUCCESS = 'UPDATE_PLANT_SUCCESS';
export const UPDATE_PLANT_FAILURE = 'UPDATE_PLANT_FAILURE';

// Get single plant
export const GET_PLANT_BY_ID_REQUEST = 'GET_PLANT_BY_ID_REQUEST';
export const GET_PLANT_BY_ID_SUCCESS = 'GET_PLANT_BY_ID_SUCCESS';
export const GET_PLANT_BY_ID_FAILURE = 'GET_PLANT_BY_ID_FAILURE';

// Plant identification
export const IDENTIFY_PLANT_REQUEST = 'IDENTIFY_PLANT_REQUEST';
export const IDENTIFY_PLANT_SUCCESS = 'IDENTIFY_PLANT_SUCCESS';
export const IDENTIFY_PLANT_FAILURE = 'IDENTIFY_PLANT_FAILURE';

// Care tips
export const GET_CARE_TIPS_REQUEST = 'GET_CARE_TIPS_REQUEST';
export const GET_CARE_TIPS_SUCCESS = 'GET_CARE_TIPS_SUCCESS';
export const GET_CARE_TIPS_FAILURE = 'GET_CARE_TIPS_FAILURE';

// Toxicity info
export const GET_TOXICITY_INFO_REQUEST = 'GET_TOXICITY_INFO_REQUEST';
export const GET_TOXICITY_INFO_SUCCESS = 'GET_TOXICITY_INFO_SUCCESS';
export const GET_TOXICITY_INFO_FAILURE = 'GET_TOXICITY_INFO_FAILURE';

// Journal entries
export const ADD_JOURNAL_ENTRY_REQUEST = 'ADD_JOURNAL_ENTRY_REQUEST';
export const ADD_JOURNAL_ENTRY_SUCCESS = 'ADD_JOURNAL_ENTRY_SUCCESS';
export const ADD_JOURNAL_ENTRY_FAILURE = 'ADD_JOURNAL_ENTRY_FAILURE';

export const DELETE_JOURNAL_ENTRY_REQUEST = 'DELETE_JOURNAL_ENTRY_REQUEST';
export const DELETE_JOURNAL_ENTRY_SUCCESS = 'DELETE_JOURNAL_ENTRY_SUCCESS';
export const DELETE_JOURNAL_ENTRY_FAILURE = 'DELETE_JOURNAL_ENTRY_FAILURE';

// Export PDF
export const EXPORT_PDF_REQUEST = 'EXPORT_PDF_REQUEST';
export const EXPORT_PDF_SUCCESS = 'EXPORT_PDF_SUCCESS';
export const EXPORT_PDF_FAILURE = 'EXPORT_PDF_FAILURE';

