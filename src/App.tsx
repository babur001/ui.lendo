import Nasiya from "@/pages/nasiya";
import Auth from "@/pages/auth";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "@/tailwind.css";
import Admin from "@/pages/admin";

const router = createBrowserRouter([
  {
    path: "/nasiya",
    element: <Nasiya />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/*",
    element: <Navigate to={"/auth"} />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
