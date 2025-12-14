import { apiRequest } from './apiClient';

export async function listFriends(token) {
    return apiRequest('/friends', { token });
}

export async function addFriend({ token, email }) {
    return apiRequest('/friends', { method: 'POST', body: { email }, token });
}
