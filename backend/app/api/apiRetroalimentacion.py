from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    BorradorRetroalimentacion,
    Retroalimentacion
)

class RetroalimentacionView(APIView):
    """
    API Retroalimentacion
    """
    def post(self, request):
        """
        Crea la retroalimentacion para el estudiante

        Args:
            request (Request): objeto con los datos enviados en el body
        Body:
            nivel_desempeño (int): nivel de desempeño del estudiante
            observaciones (string): observaciones del estudiante
            id_autoevaluacion (int): id de la autoevaluacion
            id_borrador_retroalimentacion (int): id del borrador de retroalimentacion
        Returns:
            Response:
                201: Crear retroalimentacion
                500: Error interno del servidor
        """
        try:
            nivel_desempeño = request.data.get("nivel_desempeño")
            observaciones = request.data.get("observaciones")
            id_autoevaluacion = request.data.get("id_autoevaluacion")  
            id_borrador_retroalimentacion = request.data.get("id_borrador_retroalimentacion")

            # Elegir el nivel de desempeño
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

            # Eliminar el borrador, si existe
            if id_borrador_retroalimentacion:
                BorradorRetroalimentacion.objects.get(
                    id_borrador_retroalimentacion=id_borrador_retroalimentacion
                ).delete()

            return Response(
                {"message": "Retroalimetacion Enviada"},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )