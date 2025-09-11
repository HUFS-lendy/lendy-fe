import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./pages/Main";
import Layout from "./layout/Layout";
import Lend from "./pages/Lend";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import LendState from "./pages/LendState";
import PwChange from "./pages/PwChange";
import EmailChange from "./pages/EmailChange";

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
        // {
        //   path: "/community",
        //   children: [
        //     { element: <Community />, index: true },
        //     { element: <CommunityPost />, path: ":postId" },
        //   ],
        // },
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
