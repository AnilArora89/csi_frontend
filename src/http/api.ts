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

export const updateAgencyServiceReport = async (data: {
    id: string;
    serviceReports: Array<{ serviceReportNo: string; date: string; description: string }>;
    calibrationDates: Array<string>;
}) => {
    const response = await axios.put(`/api/agency/${data.id}`, {
        serviceReports: data.serviceReports,
        calibrationDates: data.calibrationDates,
    });
    return response.data;
};

export const getAgencyById = (id: string) => {
    return api.get(`/api/agency/${id}`).then((response) => response.data);
};

export const doneAgency = async (payload: {
    id: string;
    serviceReports: string[];
    calibrationDates: string[];
    description: string;
}) => {
    const response = await axios.patch(`/api/agencies/${payload.id}`, payload);
    return response.data;
};
// Assuming you have a function like this in your `api.ts` file
export const doneeAgency = async (payload: {
    id: string;
    serviceReports: string[];
    calibrationDates: string[];
    description: string;
}) => {
    const response = await fetch(`/api/agency/${payload.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            serviceReports: payload.serviceReports,
            calibrationDates: payload.calibrationDates,
            description: payload.description,
        }),
    });
    if (!response.ok) {
        throw new Error('Error updating agency');
    }
    return response.json();
};
interface SaveAgencyData {
    lastCalibrationDates: string[]; // ISO strings
    serviceReportNo: string[];
}

export const saveAgency = async (data: SaveAgencyData) => {
    try {
        const response = await axios.post('/api/agency/done', data); // Adjust URL to match your backend endpoint
        return response.data;
    } catch (error) {
        console.error("Error saving agency data:", error);
        throw error;
    }
};

// export const updateAgency = ({ id, ...data }) => {
//     return api.put(`/api/agency/${id}`, data).then((response) => response.data);
// };