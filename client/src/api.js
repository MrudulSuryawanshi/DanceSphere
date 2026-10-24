const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('ds_token') ? { Authorization: `Bearer ${localStorage.getItem('ds_token')}` } : {}), ...(options.headers || {}) },
    ...options,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export const api = {
  health: () => request('/health'),
  cities: () => request('/cities'),
  categories: () => request('/categories'),
  classes: (params = {}) => request(`/classes?${new URLSearchParams(params)}`),
  classById: id => request(`/classes/${id}`),
  register: data => request('/auth/register', { method: 'POST', body: data }),
  login: data => request('/auth/login', { method: 'POST', body: data }),
  createEnquiry: data => request('/enquiries', { method: 'POST', body: data }),
  adminUsers: () => request('/admin/users'),
  adminStats: () => request('/admin/stats')
};
