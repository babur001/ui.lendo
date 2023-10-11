import Nasiya from "@/pages/nasiya";
import Auth from "@/pages/auth";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "@/tailwind.css";
import Admin from "@/pages/admin";
import SalePoints from "@/pages/sale-points";

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
    path: "/sale-points/:companyId",
    element: <SalePoints />,
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
