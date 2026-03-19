const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};

const refreshToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) {
    logout();
    return null;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    const data = await response.json();

    if (!response.ok || !data.access) {
      console.error("Refresh inválido");
      logout();
      return null;
    }

    localStorage.setItem("access", data.access);

    return data.access;

  } catch (error) {
    console.error("Error refresh:", error);
    logout();
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("access");

  if (!token) {
    logout();
    return Promise.reject("No token");
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      console.log("Token expirado, intentando refresh...");

      const newToken = await refreshToken();

      if (!newToken) {
        return Promise.reject("No autorizado");
      }

      response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...options.headers,
        },
      });
    }

    if (response.status === 401 || response.status === 403) {
      console.log("No autorizado (401/403)");
      logout();
      return Promise.reject("No autorizado");
    }

    return response;

  } catch (error) {
    console.error("Error en authFetch:", error);
    logout();
    return Promise.reject(error);
  }
};