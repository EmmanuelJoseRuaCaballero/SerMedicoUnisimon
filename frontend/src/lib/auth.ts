export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("coord_practica");
  localStorage.removeItem("nombre");

  window.location.href = "/"; // redirige automáticamente
};
