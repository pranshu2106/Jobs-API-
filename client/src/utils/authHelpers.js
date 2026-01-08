import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'jobs_api_token';

/**
 * Save JWT token to localStorage
 */
export const saveToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

/**
 * Get JWT token from localStorage
 */
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
};

/**
 * Check if token exists and is not expired
 */
export const isTokenValid = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token has expired
        if (decoded.exp && decoded.exp < currentTime) {
            removeToken();
            return false;
        }

        return true;
    } catch (error) {
        removeToken();
        return false;
    }
};

/**
 * Decode JWT token and return user data
 */
export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return {
            userId: decoded.userId,
            name: decoded.name,
            exp: decoded.exp,
            iat: decoded.iat,
        };
    } catch (error) {
        return null;
    }
};

/**
 * Get token expiration time as Date
 */
export const getTokenExpiration = () => {
    const user = getUserFromToken();
    if (!user || !user.exp) return null;
    return new Date(user.exp * 1000);
};
