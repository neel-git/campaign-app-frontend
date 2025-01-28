import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for handling cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// api.interceptors.request.use(
//   (config) => {
//     // Get the CSRF token from the cookie if it exists
//     const csrfToken = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("csrftoken="))
//       ?.split("=")[1];

//     if (csrfToken) {
//       config.headers["X-CSRFToken"] = csrfToken;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export const authService = {
  signup: async (userData) => {
    try {
      await api.get("/auth/get_csrf_token/");
      const response = await api.post("/auth/signup/", userData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login/", credentials);
      console.log("API Response", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post("/auth/change_password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveRequest: async (requestId, requestType) => {
    try {
      const response = await api.post(`/auth/${requestId}/approve_request/`, {
        request_type: requestType,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  rejectRequest: async (requestId, requestType, reason) => {
    try {
      const response = await api.post(`/auth/${requestId}/reject_request/`, {
        request_type: requestType,
        reason: reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPendingRequests: async () => {
    try {
      console.log('Making request to fetch pending requests');
      const response = await api.get("/auth/pending_request/");
      console.log('Pending requests response:', response);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  requestRoleChange: async (data) => {
    try {
      const response = await api.post("/auth/request_role_change/", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // login: async (credentials) => {
  //   try {
  //     // Send as regular JSON but with sensitive flag
  //     const response = await api.post(
  //       "/auth/login/",
  //       {
  //         username: credentials.username,
  //         password: credentials.password,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-Sensitive-Data": "true", // Optional flag for sensitive data
  //         },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // },
};

export const practiceService = {
  getPractices: async () => {
    try {
      const response = await api.get("/practice/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createPractice: async (practiceData) => {
    try {
      const response = await api.post("/practice/", practiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updatePractice: async (id, practiceData) => {
    try {
      const response = await api.put(`/practice/${id}/`, practiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deletePractice: async (id) => {
    try {
      await api.delete(`/practice/${id}/`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  togglePracticeStatus: async (id, isActive) => {
    try {
      const response = await api.patch(`/practice/${id}/`, {
        is_active: isActive,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserPractice: async () => {
    try {
      const response = await api.get("/practice/my_practice/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const campaignService = {
  getCampaigns: async () => {
    try {
      console.log("Making API request to /campaign/");
      // This will automatically include creator's campaigns
      const response = await api.get("/campaign/my_campaign/");
      console.log("API response received:", response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await api.post("/campaign/", campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.put(`/campaign/${campaignId}/`, campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCampaign: async (campaignId) => {
    try {
      await api.delete(`/campaign/${campaignId}/`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  sendCampaign: async (campaignId) => {
    try {
      const response = await api.post(`/campaign/${campaignId}/send/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCampaignHistory: async (campaignId) => {
    try {
      const response = await api.get(`/campaign/${campaignId}/history/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const messageService = {
  getMessages: async () => {
    try {
      const response = await api.get('/message/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (messageId) => {
    try {
      const response = await api.post(`/message/${messageId}/mark_read/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await api.delete(`/message/${messageId}/delete/`);
      return true;
    } catch (error) {
      throw error;
    }
  }
};