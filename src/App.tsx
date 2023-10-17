import Nasiya from "@/pages/nasiya";
import Auth from "@/pages/auth";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "@/tailwind.css";
import Admin from "@/pages/admin";
import CompanyUsersList from "@/pages/admin/CompanyUsersList.tsx";
import SalePoints from "@/pages/company";
import BankList from "@/pages/admin/BankList.tsx";

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
    path: "/admin/company/:companyId",
    element: <CompanyUsersList />,
  },
  {
    path: "/sale-points",
    element: <SalePoints />,
  },
  {
    path: "/sale-points/users",
    element: <CompanyUsersList />,
  },
  {
    path: "/admin/bank",
    element: <BankList />,
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
