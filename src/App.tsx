import Nasiya from "@/pages/nasiya";
import Auth from "@/pages/auth";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "@/tailwind.css";

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
    path: "/*",
    element: <Navigate to={"/nasiya"} />,
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
