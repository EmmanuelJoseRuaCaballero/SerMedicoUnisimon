from django.urls import path
from .api import GetCursosView, GetProfesoresView, LoginView, RegisterView, GetUsersView

urlpatterns = [
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/getusers/", GetUsersView.as_view(), name="get-users"),
    path("api/getprofesores/", GetProfesoresView.as_view(), name="get-profesores"),
    path("api/getcursos/", GetCursosView.as_view(), name="get-cursos"),
    
]