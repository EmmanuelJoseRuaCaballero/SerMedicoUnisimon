from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Autoevaluacion,
    Profesor
) 

class ProfesorView(APIView):
    """
    API Profesor
    """
    def get(self, request):
        """
        Retornar todos los profesores
         
        Returns:
            Response:
                200: Retornar la lista de los profesores
                500: Error interno del servidor
        """
        try:
            profesores = Profesor.objects.all().order_by("nombre_1", "nombre_2", "apellido_1", "apellido_2")

            lista_profesores = []
            for profesor in profesores:
                lista_profesores.append({
                    "cedula_profesor": profesor.cedula_profesor,
                    "nombre": (
                        f"{profesor.nombre_1} " 
                        f"{profesor.nombre_2} " 
                        f"{profesor.apellido_1} "
                        f"{profesor.apellido_2} "
                    )
                })

            return Response(
                lista_profesores, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ValidacionProfesorView(APIView):
    """
    API Validacion Profesor
    """
    def post(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            cedula_profesor = request.data.get("cedula_profesor")
            nuevo_estado = request.data.get("nuevo_estado")

            estado_profesor = Profesor.objects.filter(cedula_profesor=cedula_profesor).first()

            if estado_profesor:
                    estado_profesor.estado = nuevo_estado
                    estado_profesor.save()
            
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

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            profesor = user.profesor
            
            contador = 0

            autoevaluaciones = Autoevaluacion.objects.filter(
                profesor_id=profesor
            )

            estado_profesor = Profesor.objects.filter(cedula_profesor=profesor.cedula_profesor).first()

            for autoevaluacion in autoevaluaciones:
                if not (getattr(autoevaluacion, "retroalimentacion", None) 
                    and autoevaluacion.retroalimentacion.nivel_desempeño):
                        contador += 1

            if contador == 0:
                estado_profesor.estado = True
                estado_profesor.save()

            return Response(
                {"estado": estado_profesor.estado},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )