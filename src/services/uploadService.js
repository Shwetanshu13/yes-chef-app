import { API_BASE_URL } from './apiClient';

export async function uploadImage({ uri, token }) {
    if (!uri) throw new Error('No image selected');
    const formData = new FormData();

    const filename = uri.split('/').pop() || 'photo.jpg';
    const match = /\.([^.]+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
        uri,
        name: filename,
        type,
    });

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: 'POST',
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: formData,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message = payload?.message || payload || 'Upload failed';
        throw new Error(message);
    }

    // Expect payload to have a publicUrl or url
    return payload.url || payload.publicUrl || payload.secure_url || payload;
}
