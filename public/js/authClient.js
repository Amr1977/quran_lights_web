// Auth Microservice Client (vanilla JS, Fetch API)
// Usage: const client = createAuthClient();
// The base URL is determined in this order:
//   1. window.AUTH_BASE_URL (if set by a script or build tool)
//   2. .env file (if injected at build time, e.g., VITE_AUTH_BASE_URL)
//   3. Defaults to 'http://localhost:3000'

/**
 * Create an Auth Microservice client
 * @param {string} [baseUrl] - Base URL of the auth microservice (optional)
 */
export function createAuthClient(baseUrl) {
  // Determine base URL
  let url = baseUrl
    || (typeof window !== 'undefined' && window.AUTH_BASE_URL)
    || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_AUTH_BASE_URL)
    || 'http://localhost:3000';

  // Helper for POST requests
  async function post(path, body) {
    const res = await fetch(`${url}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include', // for cookies if needed
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || res.statusText), { response: data, status: res.status });
    return data;
  }

  return {
    /**
     * Register a new user
     * @param {Object} payload { email, primary_phone, secondary_phone?, password, role }
     */
    register: (payload) => post('/auth/register', payload),

    /**
     * Login with email/phone and password
     * @param {Object} payload { phoneOrEmail, password, role }
     */
    login: (payload) => post('/auth/login', payload),

    /**
     * Verify registration OTP
     * @param {Object} payload { phoneOrMail, emailOtp, password }
     */
    verifyRegistrationOtp: (payload) => post('/auth/register/verify-otp', payload),

    /**
     * Verify login OTP
     * @param {Object} payload { phoneOrEmail, otp, loginRole }
     */
    verifyLoginOtp: (payload) => post('/auth/login/verify-otp', payload),

    /**
     * Initiate password reset
     * @param {Object} payload { email }
     */
    initiatePasswordReset: (payload) => post('/auth/password-reset/initiate', payload),

    /**
     * Complete password reset
     * @param {Object} payload { phoneOrMail, otp, newPassword }
     */
    completePasswordReset: (payload) => post('/auth/password-reset/complete', payload),

    /**
     * Refresh authentication token
     * @param {Object} payload { refreshToken }
     */
    refreshToken: (payload) => post('/auth/token/refresh', payload),

    /**
     * Logout user
     * @param {Object} payload { uid }
     */
    logout: (payload) => post('/auth/logout', payload),
  };
} 