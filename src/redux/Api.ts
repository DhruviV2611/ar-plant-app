import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.29.84:5000/api/', // Updated baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api