export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("coord_practica");
  localStorage.removeItem("nombre");
  localStorage.removeItem("ruta")

  window.location.href = "/"; // redirige automáticamente
};
