export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  tasks: "/tasks",
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: "/api/login/",
    register: "/api/register/",
  },
  tasks: {
    list: "/api/tasks/",
    detail: (id: number) => `/api/tasks/${id}/`,
    toggle: (id: number) => `/api/tasks/${id}/toggle/`,
  },
} as const;

export const PUBLIC_ROUTES = [ROUTES.login, ROUTES.register] as const;
export const PRIVATE_ROUTES = [ROUTES.tasks] as const;
