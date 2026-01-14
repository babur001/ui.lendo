import axios, { AxiosRequestConfig } from 'axios';
import { mockApiRequest, isMockEnabled } from './mockApi';

export const baseUrl = `https://mp-api.techstack.uz/mp-client-api`;
export const clientApi = `https://mp-api.techstack.uz/mp-client-api`;

// Store mock responses by request signature
const mockResponseStore = new Map<string, { response: any; config: AxiosRequestConfig }>();

// Generate unique key for request
function getRequestKey(config: AxiosRequestConfig): string {
	return `${config.method || 'GET'}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(
		config.data || {}
	)}`;
}

const axiosInstance = axios.create({
	baseURL: clientApi,
	timeout: 5000,
});

// Request interceptor - intercept BEFORE request goes out
axiosInstance.interceptors.request.use(
	async function (config) {
		const requestKey = getRequestKey(config);
		console.log('[API INTERCEPTOR] Request intercepted:', config.method, config.url);

		// Check if mocking is enabled
		if (isMockEnabled()) {
			console.log('[API INTERCEPTOR] Mocking enabled, getting mock response for:', config.url);

			// Get mock response
			const mockResponse = await mockApiRequest(config);
			console.log('[API INTERCEPTOR] Got mock response, storing');

			// Store mock response with request key
			mockResponseStore.set(requestKey, { response: mockResponse, config });

			// Mark config as mocked and store key
			(config as any).__isMocked = true;
			(config as any).__mockKey = requestKey;

			// Throw a special error that we'll catch in response interceptor
			// This prevents the real request from going out
			const mockError: any = new Error('Mocked request');
			mockError.__isMockError = true;
			mockError.config = config;
			mockError.mockKey = requestKey;
			throw mockError;
		}

		// Normal flow - add auth token
		const accessToken = localStorage.getItem('token');
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	function (error) {
		// If it's our mock error, let it through to response interceptor
		if (error && (error as any).__isMockError) {
			return Promise.reject(error);
		}
		return Promise.reject(error);
	}
);

// Response interceptor - return mock data for mocked requests
axiosInstance.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error: any) {
		console.log('[API INTERCEPTOR] Response error:', error?.message);

		// Check if this is our mock error
		if (error && error.__isMockError && error.mockKey) {
			console.log('[API INTERCEPTOR] Mock error detected, getting stored response');
			const stored = mockResponseStore.get(error.mockKey);
			if (stored) {
				console.log('[API INTERCEPTOR] Returning mock response');
				mockResponseStore.delete(error.mockKey);
				return Promise.resolve({
					...stored.response,
					status: 200,
					statusText: 'OK',
					headers: {},
					config: stored.config,
				});
			}
		}

		// If error has config with mock key, get from store
		if (error.config && (error.config as any).__mockKey) {
			const requestKey = (error.config as any).__mockKey;
			const stored = mockResponseStore.get(requestKey);
			if (stored) {
				console.log('[API INTERCEPTOR] Found stored mock response');
				mockResponseStore.delete(requestKey);
				return Promise.resolve({
					...stored.response,
					status: 200,
					statusText: 'OK',
					headers: {},
					config: stored.config,
				});
			}
		}

		// If mocking enabled and network error, try mock
		if (isMockEnabled() && error.config && !error.response) {
			console.log('[API INTERCEPTOR] Network error, trying mock');
			try {
				const mockResponse = await mockApiRequest(error.config);
				return Promise.resolve({
					...mockResponse,
					status: 200,
					statusText: 'OK',
					headers: {},
					config: error.config,
				});
			} catch (mockError) {
				return Promise.reject(mockError);
			}
		}

		return Promise.reject(error);
	}
);

export const req = axiosInstance;
