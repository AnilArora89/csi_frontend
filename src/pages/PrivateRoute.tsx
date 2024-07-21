import React from "react";
import { Navigate } from "react-router-dom";
import useTokenStore from "@/store"; // Adjust the path as needed

interface PrivateRouteProps {
  children: React.ReactElement;
  requiredRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user } = useTokenStore((state) => state);

  if (!user) {
    // User not logged in
    return <Navigate to="/auth/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    // User does not have the required role
    return <Navigate to="/dashboard/home" />;
  }

  return children;
};

export default PrivateRoute;
