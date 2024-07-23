import useTokenStore from "@/store";
import axios from "axios";
// make api

export interface Agency {
    person: string;
    description: string;
    routeNo: string;
    agencyNo: string;
    lastCalibrationDates: Date[];
}

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

export const login = async (data: { email: string, password: string, role: string }) => {
    return api.post('/api/users/login', data);
}

export const register = async (data: { name: string, email: string, password: string, role: string }) => {
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
        console.error('Error deleting agency:', error || "OK");
        throw new Error('Failed to delete agency');
    }
};

export const updateAgency = async (id: string, data: Partial<Agency>) => {
    try {
        const response = await api.patch(`/api/agency/${id}`, data); // Include data in the patch request
        return response.data; // Adjust this based on your response structure
    } catch (error) {
        console.error('Error updating agency:', error || "OK");
        throw new Error('Failed to update agency');
    }
};

export const getAgencyById = (id: string) => {
    return api.get(`/api/agency/${id}`).then((response) => response.data);
};

// export const saveAgency = async (agencyId: string, data: any) => {
//     try {
//         const response = await api.put(`/api/agency/${agencyId}`, data);
//         return response.data; // Adjust based on your response structure
//     } catch (error) {
//         console.error('Error saving agency:', error);
//         throw new Error('Failed to save agency');
//     }
// };
export const saveAgency = async (id: string, data: FormData) => {
    try {
        const response = await api.put(`/api/agency/done/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error saving agency:", error);
        throw error;
    }
};

// export const updateAgency = ({ id, ...data }) => {
//     return api.put(`/api/agency/${id}`, data).then((response) => response.data);
// };