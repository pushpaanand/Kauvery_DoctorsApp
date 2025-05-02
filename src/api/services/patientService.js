import apiClient from '../apiConfig';

export const patientService = {
  // Get Out Patients
  getOutPatients: async (doctorId) => {
    try {
      const response = await apiClient.post('/OutPatients', {
        Branch: 'DEV',
        DoctorId: doctorId
      });
      return response.OutPatients || [];
    } catch (error) {
      throw error;
    }
  },

  // Get In Patients
  getInPatients: async (doctorId) => {
    try {
      const response = await apiClient.post('/INPatients', {
        Branch: 'DEV',
        DoctorId: doctorId
      });
      return response.inpatients || [];
    } catch (error) {
      throw error;
    }
  },
    getOTPatients: async (doctorId) => {
    try {
      const response = await apiClient.post('/OperationTheatre', {
        Branch: 'DEV',
        DoctorId: doctorId
      });
      return response.otdl || [];
    } catch (error) {
      throw error;
    }
  }
}; 