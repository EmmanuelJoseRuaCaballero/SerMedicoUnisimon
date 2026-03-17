from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    BorradorRetroalimentacion,
)

class BorradorRetroalimentacionView(APIView):
    # "POST"
    # param JSON:
    # @nivel_desempeño: int
    # @observaciones: string
    # @id_autoevaluacion: int
    def post(self, request):
        try:
            nivel_desempeño = request.data.get("nivel_desempeño")
            observaciones = request.data.get("observaciones")
            id_autoevaluacion = request.data.get("id_autoevaluacion")

            if not BorradorRetroalimentacion.objects.filter(
                id_autoevaluacion_id=id_autoevaluacion
            ).exists(): 
                BorradorRetroalimentacion.objects.create(
                    nivel_desempeño=nivel_desempeño,
                    observaciones=observaciones,
                    id_autoevaluacion_id=id_autoevaluacion
                )
                return Response(
                    {"message": "Borrador Creado"},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"error": "Ya existe un borrador"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
           return Response(
                {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # "GET"
    def get(self, request):
        try:
            id_autoevaluacion = request.data.get("id_autoevaluacion")

            borrador_retroalimentacion = BorradorRetroalimentacion.objects.filter(
                id_autoevaluacion_id=id_autoevaluacion).first()
            
            if borrador_retroalimentacion:
                return Response({
                    "verificacion": True,
                    "id_borrador_retroalimentacion": borrador_retroalimentacion.id_borrador_retroalimentacion,
                    "nivel_desempeño": borrador_retroalimentacion.nivel_desempeño,
                    "observaciones": borrador_retroalimentacion.observaciones,
                    "id_autoevaluacion": borrador_retroalimentacion.id_autoevaluacion_id
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "verificacion": False
                }, status=status.HTTP_200_OK)
        except Exception as e:
           return Response(
                {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )    