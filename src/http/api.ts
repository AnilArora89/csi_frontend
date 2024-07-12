import useTokenStore from "@/store";
import axios from "axios";
// make api
const api = axios.create({
    // we will bring this value from env variables
    baseURL: "http://127.0.0.1:5513/",
    headers: {
        'Content-Type': 'application/json'
    },

});

api.interceptors.request.use((config) => {
    const token = useTokenStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (data: { email: string, password: string }) => {
    return api.post('/api/users/login', data);
}

export const register = async (data: { name: string, email: string, password: string }) => {
    return api.post('/api/users/register', data)
}


export const getAgency = async () => api.get('/api/agency');

export const createAgency = async (data: FormData) =>
    api.post('/api/agency', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const deleteAgency = async (id: string) => {
    try {
        const response = await api.delete(`/api/agency/${id}`);
        return response.data; // Adjust this based on your response structure
    } catch (error) {
        console.error('Error deleting book:', error || "OK");
        throw new Error('Failed to delete book');
    }
};