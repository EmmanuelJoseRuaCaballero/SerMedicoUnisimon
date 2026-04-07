from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Estudiante
) 

class EstudianteView(APIView):
    # Utilizar token
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

            if not user.groups.filter(name="Profesor").exists():
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


class ValidacionEstudianteView(APIView):
    """
    API Validacion Estudiante
    """
    def post(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            estudiante = user.estudiante

            nuevo_estado = request.data.get("nuevo_estado")

            estado_estudiante = Estudiante.objects.filter(cedula_estudiante=estudiante.cedula_estudiante).first()

            if estado_estudiante:
                    estado_estudiante.estado = nuevo_estado
                    estado_estudiante.save()
            
            return Response(
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print("error", str(e))
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            estudiante = user.estudiante

            estado = Estudiante.objects.get(cedula_estudiante=estudiante.cedula_estudiante).estado

            return Response(
                {"estado": estado},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
