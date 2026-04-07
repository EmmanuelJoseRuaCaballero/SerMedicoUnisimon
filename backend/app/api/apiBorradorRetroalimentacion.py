from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Autoevaluacion,
    BorradorRetroalimentacion,
)

class BorradorRetroalimentacionView(APIView):
    """
    API Borrador Retroalimentacion
    """
    def post(self, request):
        """
        Crear borrador de retroalimentacion para el profesor

        Args:
            request (Request): objeto con los datos enviados en el body           
        Body:
           id_autoevaluacion (int): id de la autoevaluacion
           nivel_desempeño (int): nivel de desempeño del estudiante
           observaciones (string): observaciones del estudiante
        Returns:
            Response:
                200: No hay borrador
                200: Actualizar borrador
                201: Crear borrador
                500: Error interno del servidor
        """
        try:
            user = request.user

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            id_autoevaluacion = request.data.get("id_autoevaluacion")
            nivel_desempeño = request.data.get("nivel_desempeño")
            observaciones = request.data.get("observaciones")

            borrador = BorradorRetroalimentacion.objects.filter(
                autoevaluacion_id=id_autoevaluacion
            ).first()

            if borrador:
                # Verifica si existe el mismo borrador
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
                    autoevaluacion_id=id_autoevaluacion
                )
                return Response(
                    {"message": "Borrador creado"},
                    status=status.HTTP_201_CREATED
                )
        except Exception as e:
            print("error", str(e))
            return Response(
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

            autoevaluacion = Autoevaluacion.objects.filter(profesor=profesor)
            borrador_retroalimentacion = BorradorRetroalimentacion.objects.filter(
                autoevaluacion__in=autoevaluacion)
            lista_borrador = []
                
            for borrador in borrador_retroalimentacion:
                if borrador:
                    lista_borrador.append({
                        "id_borrador_retroalimentacion": borrador.id,
                        "nivel_desempeño": borrador.nivel_desempeño,
                        "observaciones": borrador.observaciones,
                        "id_autoevaluacion": borrador.autoevaluacion_id
                    })     
            return Response(
                lista_borrador, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )    