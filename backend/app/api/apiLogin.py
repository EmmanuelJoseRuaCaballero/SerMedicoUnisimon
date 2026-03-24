from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore

from ..models import DatosUsuario, Estudiante, Profesor

class LoginView(APIView):
    """
    API Login
    """
    def post(self, request):
        """
        Permitir a los usuarios iniciar sesion

        Args:
            request (Request): objeto con los datos enviados en el body           
        Body:
           username (string): nombre de usuario
           password (string): contraseña
        Returns:
            Response:
                200: Inicio exitoso
                403: Rol no válido
                401: Credenciales inválidas
                500: Error interno del servidor
        """
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = DatosUsuario.objects.get(username=username)

            if not check_password(password, user.password):
                return Response(
                    {"error": "Credenciales inválidas"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if user.id_roles.id_roles == 5:
                perfil = Estudiante.objects.get(cedula_estudiante=user.cedula)
                cedula = perfil.cedula_estudiante
                nombre = f"{perfil.nombre_1} {perfil.nombre_2} {perfil.apellido_1} {perfil.apellido_2}"

            elif user.id_roles.id_roles == 4:
                perfil = Profesor.objects.get(cedula_profesor=user.cedula)
                cedula = perfil.cedula_profesor
                nombre = f"{perfil.nombre_1} {perfil.nombre_2} {perfil.apellido_1} {perfil.apellido_2}"
            else:
                return Response(
                    {"error": "Rol no válido"},
                    status=status.HTTP_403_FORBIDDEN
                )

            refresh = RefreshToken.for_user(user)

            refresh['cedula'] = user.cedula
            refresh['rol'] = user.id_roles.id_roles

            return Response({
                "message": "Login exitoso",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "cedula": cedula,
                "nombre": nombre,
                "rol": user.id_roles.id_roles
            }, status=status.HTTP_200_OK)

        except DatosUsuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )