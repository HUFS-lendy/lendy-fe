import { useEffect, useState } from "react";
import useAuth from "./hooks/useAuth";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Main from "./pages/Main";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import LendState from "./pages/LendState";
import PwChange from "./pages/PwChange";
import PwReset from "./pages/PwReset";
import EmailChange from "./pages/EmailChange";
import Notice from "./pages/Notice";
import Devices from "./pages/admin/device/Devices";
import Device from "./pages/admin/device/Device";
import Kits from "./pages/admin/kit/Kits";
import Kit from "./pages/admin/kit/Kit";
import ManageDevices from "./pages/admin/device/ManageDevices";
import Users from "./pages/admin/user/Users";
import User from "./pages/admin/user/User";
import SignUp from "./pages/admin/user/Signup";
import Otp from "./pages/Otp";
import SetLimit from "./pages/admin/limit/SetLimit";
import ViewLimit from "./pages/admin/limit/ViewLimit";
import Category from "./pages/admin/category/Category";
import CheckIn from "./pages/admin/checkin/CheckIn";
import ManualRental from "./pages/admin/checkin/ManualRental";
import Returns from "./pages/admin/checkin/Returns";
import Students from "./pages/ta/students/Students";
import KitCourseOffering from "./pages/ta/students/kitCourseOffering";
import Courses from "./pages/admin/kit/Courses";
import KitOffering from "./pages/ta/students/kitOffering";
import ReservationWaiting from "./pages/ReservationWaiting";

const router = createBrowserRouter([
  {
    element: <Layout />,
    path: "/",
    children: [
      { element: <Main />, path: "/" },
      {
        element: (
          <ProtectedRoute>
            <ReservationWaiting />
          </ProtectedRoute>
        ),
        path: "/reservation",
      },
      {
        element: (
          <ProtectedRoute>
            <ReservationWaiting preview />
          </ProtectedRoute>
        ),
        path: "/reservation-preview",
      },
      { element: <Navigate to="/reservation" replace />, path: "/lend" },
      { element: <Navigate to="/reservation" replace />, path: "/reservation-waiting" },
      {
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
        path: "/mypage",
      },
      { element: <Login />, path: "/login" },
      { element: <PwReset />, path: "/pw-reset" },
      { element: <LendState />, path: "/lending-state" },
      { element: <PwChange />, path: "/pw-change" },
      { element: <EmailChange />, path: "/email-change" },
      { element: <Notice />, path: "/notice" },
      { element: <Otp />, path: "/otp" },
      {
        path: "admin",
        children: [
          { index: true, element: <Navigate to="check-in" replace /> },
          { path: "devices", element: <Devices /> },
          { path: "devices/:modelId", element: <Device /> },
          { path: "devices/manage", element: <ManageDevices /> },
          { path: "kits", element: <Kits /> },
          { path: "kits/:itemId", element: <Kit /> },
          { path: "users", element: <Users /> },
          { path: "users/:userId", element: <User /> },
          { path: "sign-up", element: <SignUp /> },
          { path: "set-limit", element: <SetLimit /> },
          { path: "view-limit", element: <ViewLimit /> },
          { path: "category", element: <Category /> },
          { path: "check-in", element: <CheckIn /> },
          { path: "manual-rental", element: <ManualRental /> },
          { path: "returns", element: <Returns /> },
          { path: "courses", element: <Courses /> },
          { path: "course-operations", element: <KitCourseOffering /> },
          { path: "course-operations/:kitCourseOfferingId", element: <Students /> },
          { path: "course-operations/:kitCourseOfferingId/kits", element: <KitOffering /> },
        ],
      },
      {
        path: "ta",
        children: [
          {
            index: true,
            element: <Navigate to="kit-course-offering" replace />,
          },
          {
            path: "kit-course-offering/:kitCourseOfferingId",
            element: <Students />,
          },
          { path: "kit-course-offering", element: <KitCourseOffering /> },

          {
            path: "kit-course-offering/:kitCourseOfferingId/kits",
            element: <KitOffering />,
          },
        ],
      },
    ],
  },
]);

function AuthInitializer() {
  const { refreshAuth } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await refreshAuth();
      setIsInitialized(true);
    };

    init();
  }, [refreshAuth]);

  if (!isInitialized) return null;

  return <RouterProvider router={router} />;
}

function App() {
  return <AuthInitializer />;
}

export default App;
