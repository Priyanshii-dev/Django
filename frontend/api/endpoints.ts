export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  tasks: "/tasks",
  taskCreate: "/tasks/create",
  taskEdit: (id: number) => `/tasks/edit/${id}`,
  taskDelete: (id: number) => `/tasks/delete/${id}`,
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: "/api/login/",
    register: "/api/register/",
  },
  tasks: {
    list: "/api/tasks/",
    detail: (id: number) => `/api/tasks/${id}/`,
    edit:   (id: number) => `/api/tasks/${id}/`,
    delete: (id: number) => `/api/tasks/${id}/`,
    toggle: (id: number) => `/api/tasks/${id}/toggle/`,
  },
} as const;

export const PUBLIC_ROUTES = [ROUTES.login, ROUTES.register] as const;
export const PRIVATE_ROUTES = [ROUTES.tasks] as const;
