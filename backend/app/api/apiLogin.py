from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    DatosUsuario, Estudiante, Profesor,
)

# API inicio de sesion
class LoginView(APIView):
    # "POST"
    # param JSON:
    # @username: string
    # @password: string
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = DatosUsuario.objects.get(
                    username=username,
                    password=password
                )
            
            if user.id_roles.id_roles == 5:
                user = Estudiante.objects.get(cedula_estudiante=user.cedula)
            elif user.id_roles.id_roles == 4:
                user = Profesor.objects.get(cedula_profesor=user.cedula)     
            
            return Response({
                "message": "Usuario Encontrando",
                "cedula": getattr(user, "cedula_estudiante", None)
                      or getattr(user, "cedula_profesor", None),
                "nombre": f"{user.nombre_1} {user.apellido_1}",
                "rol": user.id_roles.id_roles
            }, status=status.HTTP_200_OK) 
        
        except DatosUsuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)