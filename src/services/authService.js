import { apiRequest } from './apiClient';

export async function login({ email, password }) {
    return apiRequest('/auth/login', { method: 'POST', body: { email, password } });
}

export async function signup({ name, email, password }) {
    return apiRequest('/auth/signup', { method: 'POST', body: { name, email, password } });
}

export async function fetchProfile(token) {
    return apiRequest('/auth/me', { token });
}
