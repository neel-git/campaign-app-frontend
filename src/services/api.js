import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = "http://localhost:8000/api";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"),
  },
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

api.interceptors.request.use(
  async (config) => {
      if (config.method !== 'get') {
          try {
              await axios.get(`${API_BASE_URL}/auth/get_csrf_token/`, {
                  withCredentials: true
              });
              
              const csrfToken = getCookie('csrftoken');
              if (csrfToken) {
                  config.headers["X-CSRFToken"] = csrfToken;
              }
          } catch (error) {
              console.error('Error fetching CSRF token:', error);
          }
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
      if (error.response) {
          // Log the error details for debugging
          console.error('Response error:', {
              status: error.response.status,
              headers: error.response.headers,
              data: error.response.data
          });
      }
      return Promise.reject(error);
  }
);

export const authService = {
  signup: async (userData) => {
    try {
      await api.get("/auth/get_csrf_token/");
      const response = await api.post("/auth/signup/", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login/", credentials);
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
      const response = await api.get("/auth/pending_request/");
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
      const response = await api.get("/campaign/my_campaign/");
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
      const response = await api.patch(
        `/campaign/${campaignId}/`,
        campaignData
      );
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
      const response = await api.get("/message/");
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
  },
};
