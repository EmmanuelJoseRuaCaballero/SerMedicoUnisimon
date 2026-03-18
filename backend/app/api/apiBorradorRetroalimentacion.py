from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Autoevaluacion,
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
            id_autoevaluacion = request.data.get("id_autoevaluacion")
            nivel_desempeño = request.data.get("nivel_desempeño")
            observaciones = request.data.get("observaciones")

            borrador = BorradorRetroalimentacion.objects.filter(
                id_autoevaluacion_id=id_autoevaluacion
            ).first()

            if borrador:
                if (str(borrador.nivel_desempeño) == str(nivel_desempeño)
                    and (borrador.observaciones or "") == (observaciones or "")):
                    return Response(
                        {"message": "Sin cambios, ya existe el mismo borrador"},
                        status=status.HTTP_200_OK
                    )
                
                if nivel_desempeño is not None:
                    borrador.nivel_desempeño = nivel_desempeño

                if observaciones is not None:
                    borrador.observaciones = observaciones

                borrador.save()

                return Response(
                    {"message": "Borrador actualizado"},
                    status=status.HTTP_200_OK
                )
            else:
                BorradorRetroalimentacion.objects.create(
                    nivel_desempeño=nivel_desempeño,
                    observaciones=observaciones,
                    id_autoevaluacion_id=id_autoevaluacion
                )
                return Response(
                    {"message": "Borrador creado"},
                    status=status.HTTP_201_CREATED
                )
        except Exception as e:
            print("ERROR:", e)
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR    
            )

class BorradorRetroalimentacionDatosView(APIView):
    # "GET"
    def get(self, request, cedula):
        try:
            autoevaluacion = Autoevaluacion.objects.filter(cedula_profesor_id=cedula)
            borrador_retroalimentacion = BorradorRetroalimentacion.objects.filter(id_autoevaluacion_id__in=autoevaluacion)
            lista_borrador = []
            
            for borrador in borrador_retroalimentacion:
                if borrador:
                    lista_borrador.append({
                        "id_borrador_retroalimentacion": borrador.id_borrador_retroalimentacion,
                        "nivel_desempeño": borrador.nivel_desempeño,
                        "observaciones": borrador.observaciones,
                        "id_autoevaluacion": borrador.id_autoevaluacion_id
                    })     
            return Response(lista_borrador, status=status.HTTP_200_OK)
        except Exception as e:
           return Response(
                {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )    