import axios from 'axios';
const API_URL = '/api';
const api = axios.create({
    baseURL: API_URL,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const authService = {
    register: (email, name, password) => api.post('/auth/register', { email, name, password }),
    login: (email, password) => api.post('/auth/login', { email, password }),
    getProfile: () => api.get('/auth/profile'),
};
export const taskService = {
    getTasks: () => api.get('/tasks'),
    createTask: (title, description) => api.post('/tasks', { title, description }),
    updateTask: (id, title, description, completed) => api.put(`/tasks/${id}`, { title, description, completed }),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
};
