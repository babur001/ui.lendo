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
import CompanyList from "@/pages/admin/company/CompanyList";
import SalePointList from "@/pages/company/admin/SalePointList.tsx";
import CompanyLayout from "@/pages/company/CompanyLayout.tsx";
import UsersList from "@/pages/company/admin/UsersList.tsx";
import Buyers from "@/pages/buyers";
import EmployeeLayout from "@/pages/nasiya/EmployeeLayout.tsx";
import Nasiya from "@/pages/nasiya";
import AccountantLayout from "@/pages/buxgalteriya/AccountantLayout.tsx";

export type TAdminPages =
    | "business-analytics"
    | "clients"
    | "companies"
    | "company/:companyId";

const adminRoutes = [
    {
        path: "business-analytics",
        element: <BusinessAnalytics/>,
    },
    {
        path: "clients",
        element: <CompanyList/>,
    },
    {
        path: "companies",
        element: <BankList/>,
    },
    {
        path: "company/:companyId",
        element: <CompanyUsersList/>,
    },
    {
        path: "company/:companyId",
        element: <CompanyUsersList/>,
    },
] satisfies (RouteObject & { path: TAdminPages })[];


export type TCompanyPages =
    | "analytics"
    | "sale-points"
    | "company-users"
    | "sale-points/:salePointId";

const CompanyRoutes = [
    {
        path: "analytics",
        element: <AnalyticsByDate/>,
    },
    {
        path: "sale-points",
        element: <SalePointList/>,
    },
    {
        path: "company-users",
        element: <UsersList/>,
    },
    {
        path: "sale-points/:salePointId",
        element: <UsersList/>,
    },
] satisfies (RouteObject & { path: TCompanyPages })[];

export type TEmployeePages =
    | "analytics"
    | "nasiya"
    | "buyers";

const EmployeeRoutes = [
    {
        path: "analytics",
        element: <AnalyticsByDate/>,
    },
    {
        path: "nasiya",
        element: <Nasiya/>,
    },
    {
        path: "buyers",
        element: <Buyers/>,
    },
] satisfies (RouteObject & { path: TEmployeePages })[];


export type TAccountantPages =

    | "business-analytics"
    | "analytics"
    | "buyers";

const AccountantRoutes = [
    {
        path: "business-analytics",
        element: <BusinessAnalytics/>,
    },
    {
        path: "analytics",
        element: <AnalyticsByDate/>,
    },
    {
        path: "buyers",
        element: <Buyers/>,
    },
] satisfies (RouteObject & { path: TAccountantPages })[];

const router = createBrowserRouter([
    {
        path: "/admin/",
        element: <AdminLayout/>,
        children: adminRoutes,
    },
    {
        path: "/company-admin",
        element: <CompanyLayout/>,
        children: CompanyRoutes,
    },
    {
        path: "/nasiya",
        element: <EmployeeLayout/>,
        children: EmployeeRoutes,
    },
    {
        path: "/buxgalter",
        element: <AccountantLayout/>,
        children: AccountantRoutes,
    },

    {
        path: "/business-analytics",
        element: <BusinessAnalytics/>,
    },
    {
        path: "/analytics",
        element: <AnalyticsByDate/>,
    },
    {
        path: "/auth",
        element: <Auth/>,
    },
    {
        path: "/admin",
        element: <Admin/>,
    },
    {
        path: "/admin/company/:companyId",
        element: <CompanyUsersList/>,
    },
    {
        path: "/sale-points",
        element: <SalePoints/>,
    },
    {
        path: "/sale-points/users",
        element: <CompanyUsersList/>,
    },
    {
        path: "/admin/bank",
        element: <BankList/>,
    },
    {
        path: "/*",
        element: <Navigate to={"/auth"}/>,
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router}/>
        </>
    );
}

export default App;
