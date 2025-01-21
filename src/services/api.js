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
