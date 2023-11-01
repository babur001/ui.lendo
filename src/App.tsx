import Nasiya from "@/pages/nasiya";
import Auth from "@/pages/auth";
import {
  Navigate,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "@/tailwind.css";
import Admin from "@/pages/admin";
import CompanyUsersList from "@/pages/admin/company/companyUsers/CompanyUsersList.tsx";
import SalePoints from "@/pages/company";
import BankList from "@/pages/admin/bank/BankList.tsx";
import Buxgalteriya from "@/pages/buxgalteriya";
import AnalyticsByDate from "@/pages/analytics";
import AdminLayout from "@/pages/admin/AdminLayout";
import BusinessAnalytics from "@/pages/admin/business-analytics";
import Company from "@/pages/company";
import WrapperCompany from "@/pages/company";
import UsersList from "@/pages/company/admin/UsersList.tsx";

export type TAdminPages =
  | "business-analytics"
  | "clients"
  | "companies"
  | "company/:companyId";

const adminRoutes = [
  {
    path: "business-analytics",
    element: <Admin />,
  },
  {
    path: "clients",
    element: <Company />,
  },
  {
    path: "companies",
    element: <BankList />,
  },
  {
    path: "company/:companyId",
    element: <CompanyUsersList />,
  },
] satisfies (RouteObject & { path: TAdminPages })[];

const router = createBrowserRouter([
  {
    path: "/admin/",
    element: <AdminLayout />,
    children: adminRoutes,
  },
  {
    path: "/nasiya",
    element: <Nasiya />,
  },
  {
    path: "/business-analytics",
    element: <BusinessAnalytics />,
  },
  {
    path: "/buxgalter",
    element: <Buxgalteriya />,
  },
  {
    path: "/analytics",
    element: <AnalyticsByDate />,
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
