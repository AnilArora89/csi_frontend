import { Navigate, createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardLayout from "@/Layouts/DashboardLayout";
import AuthLayout from "@/Layouts/AuthLayout";
import AgencyPage from "@/pages/AgencyPage";
import CreateAgency from "@/pages/CreateAgency";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/home" />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "agency",
        element: <AgencyPage />,
      },
      {
        path: "agency/create",
        element: <CreateAgency />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
