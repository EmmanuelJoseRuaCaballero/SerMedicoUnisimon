from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Autoevaluacion,
    BorradorRetroalimentacion,
    OpcionProcedimientos,
    ProcedimientoAutoevaluacion,
    SubOpcionProcedimientos,
    Retroalimentacion
)

class RetroalimentacionView(APIView):
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
            id_borrador_retroalimentacion = request.data.get("id_borrador_retroalimentacion")

            if nivel_desempeño == 1:
                desempeño = "Novato"
            elif nivel_desempeño == 2:
                desempeño = "Principiante Avanzado"
            elif nivel_desempeño == 3:
                desempeño = "Competente"
            elif nivel_desempeño == 4:
                desempeño = "Profesional"
            elif nivel_desempeño == 5:
                desempeño = "Experto"

            Retroalimentacion.objects.create(
                nivel_desempeño=desempeño,
                observaciones=observaciones,
                id_autoevaluacion_id=id_autoevaluacion
            )

            if id_borrador_retroalimentacion:
                BorradorRetroalimentacion.objects.get(
                    id_borrador_retroalimentacion=id_borrador_retroalimentacion
                ).delete()

            return Response(
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
           return Response(
                {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )