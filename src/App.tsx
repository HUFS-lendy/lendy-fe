import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./pages/Main";
import Layout from "./layout/Layout";
import Lend from "./pages/Lend";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";

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
