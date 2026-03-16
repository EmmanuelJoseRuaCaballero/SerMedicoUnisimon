from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Lugar
) 

class LugarView(APIView):
    # "GET"
    def get(self, request):
        try:
            lugares = Lugar.objects.all()

            lista_lugares = []
            for lugar in lugares:
                lista_lugares.append({
                    "id_lugar": lugar.id_lugar,
                    "nombre": lugar.nombre_lugar
                })

            return Response(lista_lugares, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
