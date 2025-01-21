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
      const response = await api.post("/auth/signup/", {
        ...userData,
        role: "Practice User", // Default role
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
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
  getActivePractices: async () => {
    try {
      const response = await api.get("/practice/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Campaign service
// export const campaignService = {
//   createCampaign: async (campaignData) => {
//     try {
//       const response = await api.post("/campaigns/", campaignData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getCampaigns: async () => {
//     try {
//       const response = await api.get("/campaigns/");
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   updateCampaign: async (id, campaignData) => {
//     try {
//       const response = await api.put(`/campaigns/${id}/`, campaignData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   deleteCampaign: async (id) => {
//     try {
//       const response = await api.delete(`/campaigns/${id}/`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Add this for user approvals
//   approveUser: async (userId, practiceId) => {
//     try {
//       const response = await api.post(`/users/${userId}/approve/`, {
//         practice_id: practiceId,
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   rejectUser: async (userId, reason) => {
//     try {
//       const response = await api.post(`/users/${userId}/reject/`, { reason });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },
//   getPendingUsers: async () => {
//     try {
//       const response = await api.get("/users/pending/");
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   },
// };

export const campaignService = {
  createCampaign: async (campaignData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    return {
      ...campaignData,
      id: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
      status: campaignData.deliveryType === "SCHEDULED" ? "SCHEDULED" : "DRAFT",
    };
  },

  getCampaigns: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return DUMMY_CAMPAIGNS;
  },

  getPendingUsers: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return DUMMY_PENDING_USERS;
  },

  approveUser: async (userId, practiceId) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },

  rejectUser: async (userId, reason) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },
};
