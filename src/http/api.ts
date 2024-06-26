import axios from "axios";
// make api
const api = axios.create({
    // we will bring this value from env variables
    baseURL: "http://localhost:3000",
    headers: {
        'Content-Type': 'application/json'
    },

});

export const login = async (data: { email: string, password: string }) => {
    return api.post('/api/users/login', data);
}

export const register = async (data: { name: string, email: string, password: string }) => {
    return api.post('/api/users/register', data)
}

export const getBooks = async () => { api.get('/api/books') };