const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function saveTokens(access: string, refresh = "") {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("todo_access_token", access);
  localStorage.setItem("todo_refresh_token", refresh);

  document.cookie = `accessToken=${encodeURIComponent(access)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  document.cookie = `refreshToken=${encodeURIComponent(refresh)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function clearTokens() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("todo_access_token");
  localStorage.removeItem("todo_refresh_token");

  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
  document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
}

export function getTokens() {
  if (typeof window === "undefined") {
    return {
      access: null,
      refresh: null,
    };
  }

  return {
    access: localStorage.getItem("todo_access_token"),
    refresh: localStorage.getItem("todo_refresh_token"),
  };
}
