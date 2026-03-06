from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    CoordinadorCurso, CoordinadorPracticas, DatosUsuario, 
    DirectorPrograma, Estudiante, Profesor,
)

# API inicio de sesion
# param JSON:
# @username: string
# @password: string
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = DatosUsuario.objects.get(
                    username=username,
                    password=password
                )
            
            if user.id_roles.id_roles == 5:
                user = Estudiante.objects.get(cedula_estu=user.cedula)
            elif user.id_roles.id_roles == 4:
                user = Profesor.objects.get(cedula_profesor=user.cedula)
            elif user.id_roles.id_roles == 3:
                user = CoordinadorCurso.objects.get(cedula_coord_curso=user.cedula)
            elif user.id_roles.id_roles == 2:
                user = CoordinadorPracticas.objects.get(cedula_coord_practica=user.cedula)
            elif user.id_roles.id_roles == 1:
                user = DirectorPrograma.objects.get(cedula=user.cedula)      
            
            return Response({
                "message": "Usuario Encontrando",
                "cedula": getattr(user, "cedula_estu", None)
                      or getattr(user, "cedula_profesor", None)
                      or getattr(user, "cedula_coord_curso", None)
                      or getattr(user, "cedula_coord_practica", None)
                      or getattr(user, "cedula", None),
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