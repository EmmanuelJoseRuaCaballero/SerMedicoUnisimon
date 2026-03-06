from django.urls import path

from app.api.api import CursoClinicoView, DatosUsuarioView, GrupoView
from app.api.login import LoginView
from app.api.practica import PracticaView 

urlpatterns = [
    # Login
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/register-datos-usuario/", DatosUsuarioView.as_view(), name="register-datos-usuario"),
    # Practica
    path("api/practica/<int:cedula>/", PracticaView.as_view(), name="practica"),
    # CursoClinico
    path("api/curso-clinico/", CursoClinicoView.as_view(), name="curso-clinico"),
    # Grupo
    path("api/grupo/", GrupoView.as_view(), name="grupo"),

]