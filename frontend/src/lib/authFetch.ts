const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
      logout();
      return null;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      const data = await response.json();

      if (!response.ok || !data.access) {
        logout();
        return null;
      }

      localStorage.setItem("access", data.access);
      return data.access;
    } catch (error) {
      console.error("Error refresh:", error);
      logout();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authFetch = async (url: string, options: any = {}) => {
  let token = localStorage.getItem("access");

  if (!token) {
    logout();
    return Promise.reject("No token");
  }

  // 🔥 VALIDAR ANTES DE HACER REQUEST
  if (isTokenExpired(token)) {
    token = await refreshToken();

    if (!token) {
      logout();
      return Promise.reject("No autorizado");
    }
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // 🔁 fallback por si expiró justo en ese momento
  if (response.status === 401 || response.status === 403) {
    const newToken = await refreshToken();

    if (!newToken) {
      logout();
      return Promise.reject("No autorizado");
    }

    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return response;
};