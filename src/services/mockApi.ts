/**
 * Mock API service - returns static data for all API endpoints
 *
 * This service provides mock data for all API endpoints to allow the app to work
 * when the real API is down or unavailable (e.g., during presentations).
 *
 * HOW TO USE:
 * - Mocking is ENABLED by default (see isMockEnabled() function)
 * - To DISABLE mocking and use real API:
 *   1. Set localStorage.setItem('USE_MOCK_API', 'false')
 *   2. Or set environment variable VITE_USE_MOCK_API=false
 *   3. Or modify isMockEnabled() to return false
 *
 * - To ENABLE mocking:
 *   1. Set localStorage.setItem('USE_MOCK_API', 'true')
 *   2. Or set environment variable VITE_USE_MOCK_API=true
 *   3. Or ensure isMockEnabled() returns true (default)
 *
 * The mock service intercepts all axios requests and returns predefined mock data
 * with a simulated network delay (300ms) to make it feel realistic.
 */

import { AxiosRequestConfig } from 'axios';

// Helper to create a delayed promise (simulate network delay)
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data generators
const mockData = {
	// Auth endpoints
	'/auth/auth-info': {
		data: {
			success: true,
			data: {
				id: 1,
				fullName: 'Иванов Иван Иванович',
				company: {
					id: 1,
					name: 'Test Company',
				},
				roles: [
					{
						id: 1,
						name: 'ADMIN',
					},
				],
				companyId: 1,
			},
		},
	},

	'/auth/get-users-list': (params?: any) => ({
		data: {
			success: true,
			data: {
				content: [
					{
						id: 1,
						username: 'user1',
						fullName: 'User One',
						email: 'user1@example.com',
						enabled: true,
						createdAt: new Date().toISOString(),
					},
					{
						id: 2,
						username: 'user2',
						fullName: 'User Two',
						email: 'user2@example.com',
						enabled: false,
						createdAt: new Date().toISOString(),
					},
				],
				totalElements: 2,
			},
		},
	}),

	'/auth/register': (data?: any) => ({
		data: {
			success: true,
			data: {
				id: Date.now(),
				...data,
			},
		},
	}),

	'/auth/delete-users': (data?: any) => ({
		data: {
			success: true,
			data: { message: 'Users deleted successfully' },
		},
	}),

	'/auth/disables-users': (data?: any) => ({
		data: {
			success: true,
			data: { message: 'Users disabled successfully' },
		},
	}),

	'/auth/enable-users': (data?: any) => ({
		data: {
			success: true,
			data: { message: 'Users enabled successfully' },
		},
	}),

	'/auth/login': (data?: any) => ({
		data: {
			success: true,
			data: {
				token: 'mock-jwt-token-12345',
				user: {
					id: 1,
					username: data?.username || 'testuser',
					fullName: 'Test User',
				},
			},
		},
	}),

	// Registration endpoints
	'/registration/get-client-info': (params?: any) => ({
		data: {
			success: true,
			data: {
				id: 1,
				pinfl: params?.pinfl || '51704005120013',
				firstName: 'Иван',
				lastName: 'Иванов',
				middleName: 'Иванович',
				passportSerial: 'AB',
				passportNumber: '1234567',
				passportGivenBy: 'МВД Республики Узбекистан',
				gender: 'MALE',
				citizenship: 'UZ',
				createdAt: '2020-01-01',
				updatedAt: '2020-01-01',
			},
		},
	}),

	'/registration/create-profile': (data?: any) => ({
		data: {
			success: true,
			data: {
				id: 12345,
				...data,
			},
		},
	}),

	'/registration/set-application': (data?: any) => ({
		data: {
			success: true,
			data: {
				id: 67890,
				...data,
			},
		},
	}),

	'/registration/get-applications': (params?: any) => ({
		data: {
			success: true,
			data: {
				content: [
					{
						id: params?.id || 67890,
						paymentSumDeferral: 5000000,
						paymentPeriod: 6,
						paymentDayOfMonth: 1,
						initialPayment: 0,
						items: [
							{
								name: 'Test Product',
								amount: 1,
								price: 5000000,
								hasVat: 2,
								priceWithVat: 5000000,
							},
						],
					},
				],
				totalElements: 1,
			},
		},
	}),

	'/registration/get-scoring-status': (params?: any) => ({
		data: {
			success: true,
			data: {
				status: 'STATUS_SUCCESS',
				scoringSum: 10000000,
				scoringRate: 15,
			},
		},
	}),

	'/registration/check-scoring': (data?: any) => ({
		data: {
			success: true,
			data: {
				status: 'STATUS_SUCCESS',
				scoringSum: 10000000,
				scoringRate: 15,
			},
		},
	}),

	'/registration/set-client-info': (data?: any) => ({
		data: {
			success: true,
			data: {
				id: Date.now(),
				...data,
			},
		},
	}),

	'/registration/check-scoring-v2': (data?: any) => {
		// Return mock bank results - if bankIds provided, filter by them, otherwise return all
		const allBanks = [
			{
				id: 1,
				clientPinfl: data?.pinfl || '51704005120013',
				scoringRate: 15,
				scoringSum: 10000000,
				cardMask: '8600',
				cardExpiry: '12/25',
				cardId: 'card123',
				bankId: 1,
				bankName: 'Test Bank',
				applicationId: 67890,
				status: 'STATUS_SUCCESS',
				main: data?.main || false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 2,
				clientPinfl: data?.pinfl || '51704005120013',
				scoringRate: 12,
				scoringSum: 8000000,
				cardMask: '8600',
				cardExpiry: '12/25',
				cardId: 'card456',
				bankId: 2,
				bankName: 'Another Bank',
				applicationId: 67891,
				status: 'STATUS_SUCCESS',
				main: data?.main || false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		];

		// If bankIds provided, filter by them; otherwise return all banks
		const bankIds = data?.bankIds;
		const results = bankIds && bankIds.length > 0 ? allBanks.filter((bank) => bankIds.includes(bank.bankId)) : allBanks;

		return {
			data: {
				success: true,
				data: results,
			},
		};
	},

	// MyID endpoints
	'/my-id/get-guid': {
		data: {
			success: true,
			data: 'mock-guid-12345-abcdef',
		},
	},

	'/my-id/get-myid-code': (params?: any) => ({
		data: {
			success: true,
			data: {
				status: 'STATUS_SUCCESS',
				userProfile: {
					common_data: {
						pinfl: '51704005120013',
						first_name: 'Иван',
						last_name: 'Иванов',
						middle_name: 'Иванович',
						gender: '1',
						citizenship: 'UZ',
					},
					doc_data: {
						pass_data: 'AB1234567',
						issued_by: 'МВД Республики Узбекистан',
						issued_date: '2020-01-01',
					},
				},
			},
		},
	}),

	// Admin endpoints
	'/admin/get-banks': {
		data: {
			success: true,
			data: {
				data: [
					{
						id: 1,
						bankName: 'Test Bank',
						bankTin: '123456789',
						bankShare: 50,
						bankInsurance: 10,
						operatorShare: 40,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
					{
						id: 2,
						bankName: 'Another Bank',
						bankTin: '987654321',
						bankShare: 45,
						bankInsurance: 15,
						operatorShare: 40,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
				],
			},
		},
	},

	// PDF endpoints
	'/pdf/get-application-pdf': () => {
		// Return a mock blob (empty PDF)
		const blob = new Blob(['%PDF-1.4\n'], { type: 'application/pdf' });
		return {
			data: blob,
		};
	},

	// Company endpoints
	'/admin/get-companies': {
		data: {
			success: true,
			data: {
				content: [],
				totalElements: 0,
			},
		},
	},

	'/admin/get-company-users': {
		data: {
			success: true,
			data: {
				content: [],
				totalElements: 0,
			},
		},
	},

	'/admin/get-sale-points': {
		data: {
			success: true,
			data: {
				content: [],
				totalElements: 0,
			},
		},
	},

	'/admin/get-buyers': {
		data: {
			success: true,
			data: {
				content: [],
				totalElements: 0,
			},
		},
	},

	'/admin/get-applications': {
		data: {
			success: true,
			data: {
				content: [],
				totalElements: 0,
			},
		},
	},

	// Company admin endpoints
	'/company-admin/get-sale-points': (params?: any) => ({
		data: {
			success: true,
			data: {
				content: [
					{
						id: 1,
						name: 'Sale Point 1',
						address: 'Test Address 1',
						phone: '+998901234567',
						createdAt: new Date().toISOString(),
					},
					{
						id: 2,
						name: 'Sale Point 2',
						address: 'Test Address 2',
						phone: '+998901234568',
						createdAt: new Date().toISOString(),
					},
				],
				totalElements: 2,
			},
		},
	}),

	'/company-admin/save-sale-point': (data?: any) => ({
		data: {
			success: true,
			data: {
				id: Date.now(),
				...data,
			},
		},
	}),

	// Home endpoints
	'/home/get-clients': (params?: any) => ({
		data: {
			success: true,
			data: {
				content: [
					{
						id: 1,
						pinfl: '51704005120013',
						firstName: 'Иван',
						lastName: 'Иванов',
						middleName: 'Иванович',
						phone: '+998901234567',
						createdAt: new Date().toISOString(),
					},
				],
				totalElements: 1,
			},
		},
	}),

	// Excel endpoints
	'/excel/get-applications': () => {
		// Return a mock blob (empty Excel file)
		const blob = new Blob(['Mock Excel Data'], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		});
		return {
			data: blob,
		};
	},

	// Analytics endpoints
	'/analytics/get-statistics': {
		data: {
			success: true,
			data: {
				totalApplications: 100,
				totalAmount: 50000000,
				approvedApplications: 80,
				rejectedApplications: 20,
			},
		},
	},

	'/analytics/get-chart-data': {
		data: {
			success: true,
			data: {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
				values: [1000000, 2000000, 1500000, 3000000, 2500000, 4000000],
			},
		},
	},

	// Statistics endpoints
	'/stat/get-sale-point-stat': (params?: any) => ({
		data: {
			success: true,
			data: {
				totalApplications: 100,
				totalAmount: 50000000,
				approvedApplications: 80,
				rejectedApplications: 20,
			},
		},
	}),

	'/stat/get-sale-point-bank-stat': (params?: any) => ({
		data: {
			success: true,
			data: {
				banks: [
					{ bankName: 'Test Bank', totalAmount: 30000000, count: 50 },
					{ bankName: 'Another Bank', totalAmount: 20000000, count: 30 },
				],
			},
		},
	}),

	'/stat/get-card-stat': (params?: any) => ({
		data: {
			success: true,
			data: {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
				values: [1000000, 2000000, 1500000, 3000000, 2500000, 4000000],
			},
		},
	}),

	'/stat/get-stat-main': {
		data: {
			success: true,
			data: {
				totalApplications: 1000,
				totalAmount: 500000000,
				approvedApplications: 800,
				rejectedApplications: 200,
			},
		},
	},

	'/stat/get-this-period-card-stat': {
		data: {
			success: true,
			data: {
				totalAmount: 50000000,
				count: 100,
			},
		},
	},

	'/stat/get-analytic-stat-monthly': (params?: any) => ({
		data: {
			success: true,
			data: {
				months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
				amounts: [10000000, 20000000, 15000000, 30000000, 25000000, 40000000],
				counts: [10, 20, 15, 30, 25, 40],
			},
		},
	}),

	'/excel/get-sale-point-stat': () => {
		// Return a mock blob (empty Excel file)
		const blob = new Blob(['Mock Excel Data'], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		});
		return {
			data: blob,
		};
	},

	'/admin/get-korxonas': {
		data: {
			success: true,
			data: {
				content: [],
				totalElements: 0,
			},
		},
	},

	'/admin/create-company': (data?: any) => ({
		data: {
			success: true,
			data: {
				id: Date.now(),
				...data,
			},
		},
	}),

	'/admin/create-bank': (data?: any) => ({
		data: {
			success: true,
			data: {
				id: Date.now(),
				...data,
			},
		},
	}),

	// File endpoints
	'/files/set-file': (data?: any) => ({
		data: {
			success: true,
			data: {
				id: Date.now(),
				fileGuid: 'mock-file-guid-12345',
				fileName: data?.fileName || 'test.pdf',
			},
		},
	}),

	'/files/get-file': (params?: any) => {
		// Return a mock blob
		const blob = new Blob(['Mock file content'], { type: 'application/octet-stream' });
		return {
			data: blob,
		};
	},
};

// Main mock function
export const mockApiRequest = async (config: AxiosRequestConfig): Promise<any> => {
	console.log('[MOCK API] mockApiRequest called for:', config.method, config.url);
	await delay(300); // Simulate network delay

	const url = config.url || '';
	const method = config.method?.toUpperCase() || 'GET';
	const params = config.params;
	const data = config.data;

	console.log('[MOCK API] Looking for mock handler:', url);

	// Find matching mock handler - try exact match first
	let mockHandler = mockData[url as keyof typeof mockData];
	console.log('[MOCK API] Mock handler found:', !!mockHandler);

	// If no exact match, try to match URL patterns (e.g., /files/get-file/:id)
	if (!mockHandler) {
		// Check for dynamic routes like /files/get-file/{guid}
		if (url.startsWith('/files/get-file/')) {
			mockHandler = mockData['/files/get-file'];
		}
		// Add more pattern matching here if needed
	}

	// If handler is a function, call it with params/data
	if (typeof mockHandler === 'function') {
		const result = mockHandler(method === 'GET' ? params : data);
		return Promise.resolve(result);
	}

	// If handler is an object, return it directly
	if (mockHandler) {
		return Promise.resolve(mockHandler);
	}

	// Default response for unmocked endpoints
	console.warn(`[MOCK API] No mock data found for ${method} ${url}, returning default response`);
	return Promise.resolve({
		data: {
			success: true,
			data: null,
			message: `Mock response for ${url}`,
		},
	});
};

// Check if mocking is enabled
export const isMockEnabled = () => {
	// Priority order:
	// 1. Check localStorage first (user override)
	// 2. Check environment variable
	// 3. Default to true (enabled by default for presentation)

	const localStorageValue = localStorage.getItem('USE_MOCK_API');

	console.log('localStorageValue', localStorageValue);

	// If explicitly set in localStorage, use that value
	if (localStorageValue !== null && window.location.pathname === '/nasiya/default') {
		return localStorageValue === 'true';
	}

	// Default: enabled (for presentation)
	return false;
};
