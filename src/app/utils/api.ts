import axios from "axios";

const api = axios.create({
  baseURL: "/api/product",
});

export default api;