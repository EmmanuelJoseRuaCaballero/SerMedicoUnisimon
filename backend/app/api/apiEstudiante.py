from app.token.authentication import CustomJWTAuthentication
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Estudiante
) 

class EstudianteView(APIView):
    # Utilizar token
    authentication_classes = [CustomJWTAuthentication]
    """
    API Estudiante
    """
    def get(self, request):
        """
        Retornar todos los estudiante
         
        Returns:
            Response:
                200: Retornar la lista de los estudiantes
                500: Error interno del servidor
        """
        try:
            estudiantes = Estudiante.objects.all().order_by("cedula_estudiante")

            lista_estudiantes = []
            for estudiante in estudiantes:
                lista_estudiantes.append({
                    "cedula_estudiante": estudiante.cedula_estudiante,
                    "nombre": (
                        f"{estudiante.nombre_1} " 
                        f"{estudiante.nombre_2} " 
                        f"{estudiante.apellido_1} "
                        f"{estudiante.apellido_2} "
                    ),
                    "semestre": estudiante.semestre,
                    "estado": estudiante.estado
                })

            return Response(
                lista_estudiantes, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def patch(self, request):
        """
       Actualizar el estado de múltiples estudiantes

        Args:
            request (Request): objeto con los datos enviados en el body
        Body:
            nuevo_estado (boolean): nuevo estado del estudiante
        Returns:
            Response:
                200: Estado actualizado correctamente
                403: Acceso prohibido (rol)
                500: Error interno del servidor
        """
        try:
            user = request.user
            data = request.data

            if not hasattr(user, "id_roles") or user.id_roles.id_roles != 4:
                print("error")
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            for item in data:
                cedula_estudiante = item.get("cedula_estudiante")
                nuevo_estado = item.get("nuevo_estado")

                estudiante = Estudiante.objects.filter(cedula_estudiante=cedula_estudiante).first()

                if estudiante:
                    estudiante.estado = nuevo_estado
                    estudiante.save()

            return Response(
                {"message": "Estado actualizado correctamente"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("error", str(e))
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


