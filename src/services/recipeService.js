import { apiRequest } from './apiClient';

export async function listRecipes({ token, search, sort, filters }) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    if (filters?.length) params.append('tags', filters.join(','));

    const query = params.toString();
    const path = `/recipes${query ? `?${query}` : ''}`;
    return apiRequest(path, { token });
}

export async function createRecipe({ token, recipe }) {
    return apiRequest('/recipes', { method: 'POST', body: recipe, token });
}

export async function getRecipe({ token, id }) {
    return apiRequest(`/recipes/${id}`, { token });
}

export async function addFriendRecipeVisibility({ token, friendId }) {
    return apiRequest('/friends/share', { method: 'POST', body: { friendId }, token });
}
