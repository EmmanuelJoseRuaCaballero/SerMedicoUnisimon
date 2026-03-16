from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Profesor
) 

class ProfesorView(APIView):
    # "GET"
    def get(self, request):
        try:
            profesores = Profesor.objects.all()

            lista_profesores = []
            for profesor in profesores:
                lista_profesores.append({
                    "cedula_profesor": profesor.cedula_profesor,
                    "nombre": f"{profesor.nombre_1} {profesor.nombre_2} {profesor.apellido_1} {profesor.apellido_2}"
                })

            return Response(lista_profesores, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )