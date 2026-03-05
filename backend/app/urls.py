from django.urls import path

from .api import (
    DatosUsuarioView, LoginView, PracticaView
)

urlpatterns = [
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/register-datos-usuario/", DatosUsuarioView.as_view(), name="register-datos-usuario"),
    path("api/practica/<int:cedula>/", PracticaView.as_view(), name="practica")
]