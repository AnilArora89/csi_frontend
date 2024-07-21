// utils/auth.ts
import useTokenStore from "@/store"; // Adjust path as needed

export const isAuthenticated = (): boolean => {
    const token = useTokenStore.getState().token;
    return !!token; // Return true if token exists
};

export const userHasRole = (requiredRoles: string[]): boolean => {
    const user = useTokenStore.getState().user;
    return user ? requiredRoles.includes(user.role) : false;
};
