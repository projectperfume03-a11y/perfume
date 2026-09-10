const BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://roya-parfum.onrender.com' : '');
const API = `${BASE_URL.replace(/\/$/, '')}/api`;

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : null;
  if (!data) {
    throw new Error('Réponse API invalide');
  }
  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message[0]
      : data.message || 'Une erreur est survenue';
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path, token) => request(path, { token }),
  post: (path, body, token) => request(path, { method: 'POST', body, token }),
  patch: (path, body, token) => request(path, { method: 'PATCH', body, token }),
  del: (path, token) => request(path, { method: 'DELETE', token }),
};

export const CLOUDINARY = {
  cloudName: 'hp4f3odw',
};

export async function getCloudinarySignature(token) {
  return api.get('/cloudinary/signature', token);
}

export async function uploadImage(file, onProgress, token) {
  const sig = await getCloudinarySignature(token);
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.api_key);
  form.append('timestamp', sig.timestamp);
  form.append('signature', sig.signature);
  form.append('upload_preset', sig.upload_preset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
    );
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 90));
      }
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          if (onProgress) onProgress(100);
          resolve(data.secure_url);
        } else {
          reject(new Error(data.error?.message || "Échec de l'upload de l'image"));
        }
      } catch {
        reject(new Error("Réponse Cloudinary invalide"));
      }
    };
    xhr.onerror = () => reject(new Error("Erreur réseau lors de l'upload"));
    xhr.send(form);
  });
}
