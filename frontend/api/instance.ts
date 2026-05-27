export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

type ApiErrorPayload = {
  detail?: string;
  [key: string]: unknown;
};

function getErrorMessage(data: ApiErrorPayload | null) {
  if (data?.detail) {
    return data.detail;
  }

  const fieldErrors = Object.values(data ?? {})
    .flat()
    .filter(Boolean)
    .join(" ");

  return fieldErrors || "Request failed";
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const accessToken =
    token === undefined && typeof window !== "undefined"
      ? localStorage.getItem("todo_access_token")
      : token;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as T;
}
