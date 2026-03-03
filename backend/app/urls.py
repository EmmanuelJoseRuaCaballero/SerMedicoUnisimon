from django.urls import path
from .api import EstudianteAPIView, EstudianteDetailAPIView, GetCursosView, GetProfesoresView, GetUsuarioCompletoView, LoginView, RegisterView, GetUsersView

urlpatterns = [
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/getusers/", GetUsersView.as_view(), name="get-users"),
    path("api/getprofesores/", GetProfesoresView.as_view(), name="get-profesores"),
    path("api/getcursos/", GetCursosView.as_view(), name="get-cursos"),
    path("api/getUserCompleto/<int:user_id>/", GetUsuarioCompletoView.as_view(), name="get-user-completo"),
    path("api/estudiantes/", EstudianteAPIView.as_view()),
    path("api/estudiantes/<int:id>/", EstudianteDetailAPIView.as_view()),
]