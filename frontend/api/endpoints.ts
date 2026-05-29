export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login/",
    register: "/api/auth/register/",
  },
  tasks: {
    list: "/api/tasks/",
    create: "/api/tasks/create/",
    detail: (id: number) => `/api/tasks/${id}/`,
    edit:   (id: number) => `/api/tasks/${id}/edit/`,
    delete: (id: number) => `/api/tasks/${id}/delete/`,
    toggle: (id: number) => `/api/tasks/${id}/toggle/`,
  },
} as const;
