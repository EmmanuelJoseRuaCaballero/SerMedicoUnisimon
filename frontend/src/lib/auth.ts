export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("profesor");
  localStorage.removeItem("nombre");

  window.location.href = "/"; // redirige automáticamente
};
