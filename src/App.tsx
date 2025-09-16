import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Main from "./pages/Main";
import Layout from "./layout/Layout";
import Lend from "./pages/Lend";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import LendState from "./pages/LendState";
import PwChange from "./pages/PwChange";
import EmailChange from "./pages/EmailChange";
import Notice from "./pages/Notice";
import Devices from "./pages/admin/device/Devices";
import Device from "./pages/admin/device/Device";
import Kits from "./pages/kit/Kits";
import Kit from "./pages/kit/kit";
import ManageDevices from "./pages/admin/device/ManageDevices";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      path: "/",
      children: [
        { element: <Main />, path: "/" },
        { element: <Lend />, path: "/lend" },
        { element: <Login />, path: "/login" },
        { element: <MyPage />, path: "/mypage" },
        { element: <LendState />, path: "/lending-state" },
        { element: <PwChange />, path: "/pw-change" },
        { element: <EmailChange />, path: "/email-change" },
        { element: <Notice />, path: "/notice" },
        {
          path: "admin",
          children: [
            { index: true, element: <Navigate to="devices" replace /> },
            { path: "devices", element: <Devices /> },
            { path: "devices/:deviceId", element: <Device /> },
            { path: "devices/manage", element: <ManageDevices /> },
            { path: "kits", element: <Kits /> },
            { path: "kits/:kitId", element: <Kit /> },
          ],
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
