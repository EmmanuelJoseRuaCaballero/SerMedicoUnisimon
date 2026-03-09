from django.urls import path

from app.api.api import DatosUsuarioView
from app.api.login import LoginView
from app.api.practica import PracticaView
from app.api.estudiantes import EstudiantesView
from app.api.cursoclinico import CursoClinicoView
from app.api.grupo import GrupoView
from app.api.profesores import ProfesoresView 

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
    # Estudiantes
    path("api/estudiantes/<int:codigo_grupo>/", EstudiantesView.as_view(), name="estudiantes"),
    # Profesor
    path("api/profesores/", ProfesoresView.as_view(), name="profesores"),

]