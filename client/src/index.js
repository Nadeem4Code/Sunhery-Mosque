import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "./context/BooksContext";
import axios from "axios";

// Axios Interceptor for dynamic production backend API URL mapping
axios.interceptors.request.use(
  (config) => {
    const prodApiUrl = process.env.REACT_APP_API_URL;
    if (prodApiUrl && config.url && config.url.startsWith("http://localhost:3001")) {
      config.url = config.url.replace("http://localhost:3001", prodApiUrl);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
