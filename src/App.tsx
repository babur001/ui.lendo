import Auth from '@/pages/auth';
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import '@/tailwind.css';
import CompanyUsersList from '@/pages/admin/company/companyUsers/CompanyUsersList.tsx';
import BankList from '@/pages/admin/bank/BankList.tsx';
import AnalyticsByDate from '@/pages/analytics';
import AdminLayout from '@/pages/admin/AdminLayout';
import BusinessAnalytics from '@/pages/admin/business-analytics';
import CompanyList from '@/pages/admin/company/CompanyList';
import SalePointList from '@/pages/company/admin/SalePointList.tsx';
import CompanyLayout from '@/pages/company/CompanyLayout.tsx';
import UsersList from '@/pages/company/admin/UsersList.tsx';
import Buyers from '@/pages/buyers';
import EmployeeLayout from '@/pages/nasiya/EmployeeLayout.tsx';
import Nasiya from '@/pages/nasiya';
import AccountantLayout from '@/pages/buxgalteriya/AccountantLayout.tsx';
import Applications from '@/pages/buyers/applicationsList.tsx';
import BusinessReport from '@/pages/buxgalteriya/Report.tsx';
import CompanyBuyers from '@/pages/company/admin/CompanyBuyers.tsx';
import CompanyApplications from '@/pages/company/admin/CompanyApplicationsList.tsx';
import BusinessReportScoring from '@/pages/buxgalteriya/ReportScoring.tsx';
import ApplicationDetails from '@/pages/buyers/applicationsDetails.tsx';

export type TAdminPages = 'business-analytics' | 'clients' | 'companies' | 'company/:companyId';

const adminRoutes = [
	{
		path: 'business-analytics',
		element: <BusinessAnalytics />,
	},
	{
		path: 'clients',
		element: <CompanyList />,
	},
	{
		path: 'companies',
		element: <BankList />,
	},
	{
		path: 'company/:companyId',
		element: <CompanyUsersList />,
	},
] satisfies (RouteObject & { path: TAdminPages })[];

export type TCompanyPages =
	| 'business-report'
	| 'business-report-scoring'
	| 'applications/:sale_point_id/:salePointName'
	| 'applications/:applicationId'
	| 'analytics'
	| 'sale-points'
	| 'company-users'
	| 'sale-points/:salePointId/:salePointName'
	| 'company-buyers'
	| 'company-applications';

const CompanyRoutes = [
	{
		path: 'business-report',
		element: <BusinessReport />,
	},
	{
		path: 'business-report-scoring',
		element: <BusinessReportScoring />,
	},
	{
		path: 'applications/:sale_point_id/:salePointName',
		element: <Applications />,
	},
	{
		path: 'applications/:applicationId',
		element: <ApplicationDetails />,
	},
	{
		path: 'analytics',
		element: <AnalyticsByDate />,
	},
	{
		path: 'sale-points',
		element: <SalePointList />,
	},
	{
		path: 'company-users',
		element: <UsersList />,
	},
	{
		path: 'sale-points/:salePointId/:salePointName',
		element: <UsersList />,
	},
	{
		path: 'company-buyers',
		element: <CompanyBuyers />,
	},
	{
		path: 'company-applications',
		element: <CompanyApplications />,
	},
] satisfies (RouteObject & { path: TCompanyPages })[];

export type TEmployeePages = 'analytics' | 'default' | 'applications' | 'applications/:applicationId';

const EmployeeRoutes = [
	{
		path: 'analytics',
		element: <AnalyticsByDate />,
	},
	{
		path: 'default',
		element: <Nasiya />,
	},
	{
		path: 'applications',
		element: <Applications />,
	},
	{
		path: 'applications/:applicationId',
		element: <ApplicationDetails />,
	},
] satisfies (RouteObject & { path: TEmployeePages })[];

export type TAccountantPages = 'business-report' | 'analytics' | 'buyers' | 'buyers/:pinfl';

const AccountantRoutes = [
	{
		path: 'business-report',
		element: <BusinessReport />,
	},
	{
		path: 'analytics',
		element: <AnalyticsByDate />,
	},
	{
		path: 'buyers',
		element: <Buyers />,
	},
	{
		path: 'buyers/:pinfl',
		element: <Applications />,
	},
] satisfies (RouteObject & { path: TAccountantPages })[];

const router = createBrowserRouter([
	{
		path: '/admin/',
		element: <AdminLayout />,
		children: adminRoutes,
	},
	{
		path: '/company-admin',
		element: <CompanyLayout />,
		children: CompanyRoutes,
	},
	{
		path: '/nasiya',
		element: <EmployeeLayout />,
		children: EmployeeRoutes,
	},
	{
		path: '/buxgalter',
		element: <AccountantLayout />,
		children: AccountantRoutes,
	},

	{
		path: '/auth',
		element: <Auth />,
	},
	{
		path: '/*',
		element: <Navigate to={'/auth'} />,
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
