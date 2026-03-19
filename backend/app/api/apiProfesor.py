from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
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
            profesores = Profesor.objects.all()

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