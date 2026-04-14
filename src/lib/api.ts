// API Client for Frontend - Connects to Backend
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Don't use window.location.href - app uses tab-based navigation
      // The auth store will handle redirect via isAuthenticated state
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/auth/change-password', data),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  verifyOTP: (email: string, otp: string) => apiClient.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email: string, otp: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { email, otp, newPassword }),
};

// Contacts API
export const contactsAPI = {
  list: (params?: any) => apiClient.get('/contacts', { params }),
  get: (id: string) => apiClient.get(`/contacts/${id}`),
  create: (data: any) => apiClient.post('/contacts', data),
  update: (id: string, data: any) => apiClient.put(`/contacts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/contacts/${id}`),
  import: (formData: FormData) => 
    apiClient.post('/contacts/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  search: (query: string) => apiClient.get('/contacts/search', { params: { q: query } }),
};

// WhatsApp API
export const whatsappAPI = {
  getConversations: (params?: any) => apiClient.get('/whatsapp/conversations', { params }),
  getMessages: (contactId: string, params?: any) => 
    apiClient.get(`/whatsapp/messages/${contactId}`, { params }),
  sendText: (data: { phone: string; message: string }) => 
    apiClient.post('/whatsapp/send/text', data),
  sendTemplate: (data: { phone: string; templateName: string; components?: any[] }) => 
    apiClient.post('/whatsapp/send/template', data),
  sendImage: (data: { phone: string; imageUrl: string; caption?: string }) => 
    apiClient.post('/whatsapp/send/image', data),
  getTemplates: () => apiClient.get('/whatsapp/templates'),
  connect: (data: { code: string }) => apiClient.post('/whatsapp/connect', data),
};

// Campaigns API
export const campaignsAPI = {
  list: (params?: any) => apiClient.get('/campaigns', { params }),
  get: (id: string) => apiClient.get(`/campaigns/${id}`),
  create: (data: any) => apiClient.post('/campaigns', data),
  update: (id: string, data: any) => apiClient.put(`/campaigns/${id}`, data),
  delete: (id: string) => apiClient.delete(`/campaigns/${id}`),
  schedule: (id: string, scheduledAt: string) => 
    apiClient.post(`/campaigns/${id}/schedule`, { scheduledAt }),
  start: (id: string) => apiClient.post(`/campaigns/${id}/start`),
  pause: (id: string) => apiClient.post(`/campaigns/${id}/pause`),
  stats: (id: string) => apiClient.get(`/campaigns/${id}/stats`),
};

// Social Posts API
export const postsAPI = {
  list: (params?: any) => apiClient.get('/posts', { params }),
  get: (id: string) => apiClient.get(`/posts/${id}`),
  create: (data: any) => apiClient.post('/posts', data),
  update: (id: string, data: any) => apiClient.put(`/posts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/posts/${id}`),
  schedule: (id: string, scheduledAt: string) => 
    apiClient.post(`/posts/${id}/schedule`, { scheduledAt }),
  publish: (id: string) => apiClient.post(`/posts/${id}/publish`),
  generateCaption: (data: any) => apiClient.post('/ai/caption', data),
};

// Posters API
export const postersAPI = {
  list: (params?: any) => apiClient.get('/posters', { params }),
  get: (id: string) => apiClient.get(`/posters/${id}`),
  create: (data: any) => apiClient.post('/posters', data),
  generate: (data: { templateId: string; userData: any }) => 
    apiClient.post('/posters/generate', data),
  download: (id: string) => apiClient.get(`/posters/${id}/download`, { responseType: 'blob' }),
};

// Chatbot API
export const chatbotAPI = {
  list: () => apiClient.get('/chatbot'),
  get: (id: string) => apiClient.get(`/chatbot/${id}`),
  create: (data: any) => apiClient.post('/chatbot', data),
  update: (id: string, data: any) => apiClient.put(`/chatbot/${id}`, data),
  delete: (id: string) => apiClient.delete(`/chatbot/${id}`),
  activate: (id: string) => apiClient.post(`/chatbot/${id}/activate`),
  deactivate: (id: string) => apiClient.post(`/chatbot/${id}/deactivate`),
  test: (id: string, message: string) => 
    apiClient.post(`/chatbot/${id}/test`, { message }),
};

// AI API
export const aiAPI = {
  generate: (data: { type: string; prompt: string; context?: any }) => 
    apiClient.post('/ai/generate', data),
  caption: (data: { topic: string; businessType: string; platform: string }) => 
    apiClient.post('/ai/caption', data),
  hashtags: (data: { topic: string; platform: string }) => 
    apiClient.post('/ai/hashtags', data),
  reviewReply: (data: { reviewText: string; rating: number; businessType: string }) => 
    apiClient.post('/ai/review-reply', data),
  contentCalendar: (data: { businessType: string; month: string; year: number }) => 
    apiClient.post('/ai/content-calendar', data),
};

// Analytics API
export const analyticsAPI = {
  dashboard: (params?: any) => apiClient.get('/analytics/dashboard', { params }),
  messages: (params?: any) => apiClient.get('/analytics/messages', { params }),
  campaigns: (params?: any) => apiClient.get('/analytics/campaigns', { params }),
  social: (params?: any) => apiClient.get('/analytics/social', { params }),
  contacts: (params?: any) => apiClient.get('/analytics/contacts', { params }),
};

// Reviews API
export const reviewsAPI = {
  list: (params?: any) => apiClient.get('/reviews', { params }),
  get: (id: string) => apiClient.get(`/reviews/${id}`),
  reply: (id: string, reply: string) => apiClient.post(`/reviews/${id}/reply`, { reply }),
  sync: () => apiClient.post('/reviews/sync'),
  stats: () => apiClient.get('/reviews/stats'),
};

// Business API
export const businessAPI = {
  get: () => apiClient.get('/business'),
  update: (data: any) => apiClient.put('/business', data),
  getSettings: () => apiClient.get('/business/settings'),
  updateSettings: (data: any) => apiClient.put('/business/settings', data),
  getPipelines: () => apiClient.get('/business/pipelines'),
  createPipeline: (data: any) => apiClient.post('/business/pipelines', data),
};

// Subscriptions API
export const subscriptionsAPI = {
  getCurrent: () => apiClient.get('/subscriptions/current'),
  getPlans: () => apiClient.get('/subscriptions/plans'),
  createCheckout: (data: { plan: string; period: string }) => 
    apiClient.post('/subscriptions/checkout', data),
  createSubscription: (data: any) => apiClient.post('/subscriptions/create', data),
  cancel: (reason?: string) => apiClient.post('/subscriptions/cancel', { reason }),
  upgrade: (plan: string) => apiClient.post('/subscriptions/upgrade', { plan }),
  verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; plan: string; period: string }) =>
    apiClient.post('/subscriptions/verify', data),
};

// Webhooks API
export const webhooksAPI = {
  list: () => apiClient.get('/webhooks'),
  create: (data: any) => apiClient.post('/webhooks', data),
  update: (id: string, data: any) => apiClient.put(`/webhooks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/webhooks/${id}`),
  test: (id: string) => apiClient.post(`/webhooks/${id}/test`),
};

export const auditLogAPI = {
  list: (params?: any) => apiClient.get('/team/audit-logs', { params }),
  export: (params?: any) => apiClient.get('/team/audit-logs/export', { params, responseType: 'blob' }),
};

export const apiKeysAPI = {
  list: () => apiClient.get('/team/api-keys'),
  create: (data: { name: string; permissions: string[] }) => apiClient.post('/team/api-keys', data),
  revoke: (id: string) => apiClient.delete(`/team/api-keys/${id}`),
};

export const billingAPI = {
  getCurrent: () => apiClient.get('/subscriptions/current'),
  getInvoices: (params?: any) => apiClient.get('/subscriptions/invoices', { params }),
  getPlans: () => apiClient.get('/subscriptions/plans'),
  changePaymentMethod: (data: any) => apiClient.put('/subscriptions/payment-method', data),
  cancelSubscription: (reason?: string) => apiClient.post('/subscriptions/cancel', { reason }),
  upgradeSubscription: (plan: string) => apiClient.post('/subscriptions/upgrade', { plan }),
};

export const teamAPI = {
  listMembers: () => apiClient.get('/team/members'),
  inviteMember: (data: { email: string; role: string }) => apiClient.post('/team/invite', data),
  updateMember: (id: string, data: any) => apiClient.put(`/team/members/${id}`, data),
  removeMember: (id: string) => apiClient.delete(`/team/members/${id}`),
};

export default apiClient;
