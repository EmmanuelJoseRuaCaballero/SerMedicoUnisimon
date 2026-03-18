from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from datetime import datetime

from ..models import (
    BorradorAutoevaluacion, 
)

from ..serializers import (
    BorradorAutoevaluacionSerializer
)

class BorradorAutoevaluacionView(APIView):
    # "POST"
    # param JSON:
    # @nombre_procedimiento: string
    # @id_lugar: int
    # @nivel_desempeño: int
    # @actividad: boolean
    # @cedula_profesor: int
    # @hora_inicio: time
    # @hora_final: time
    # @fecha: date
    # param URL
    # @cedula: int
    def post(self, request, cedula):
        try:
            data = request.data.copy()

            if data.get("fecha"):
                data["fecha"] = datetime.strptime(data["fecha"], "%Y-%m-%d").date()

            if data.get("hora_inicio"):
                data["hora_inicio"] = datetime.strptime(data["hora_inicio"], "%H:%M").time()

            if data.get("hora_final"):
                data["hora_final"] = datetime.strptime(data["hora_final"], "%H:%M").time()

            borrador = BorradorAutoevaluacion.objects.filter(
                cedula_estudiante_id=cedula
            ).first()

            if borrador:

                serializer = BorradorAutoevaluacionSerializer(
                    borrador,
                    data=data,
                    partial=True
                )

                if serializer.is_valid():

                    cambios = False
                    for field, value in serializer.validated_data.items():
                        if getattr(borrador, field) != value:
                            cambios = True
                            break

                    if not cambios:
                        return Response(
                            {"message": "Sin cambios, ya existe el mismo borrador"},
                            status=status.HTTP_200_OK
                        )

                    serializer.save()

                    return Response(
                        {"message": "Borrador actualizado"},
                        status=status.HTTP_200_OK
                    )

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                data["cedula_estudiante"] = cedula

                serializer = BorradorAutoevaluacionSerializer(data=data)

                if serializer.is_valid():
                    serializer.save()
                    return Response(
                        {"message": "Borrador creado"},
                        status=status.HTTP_201_CREATED
                    )

                return Response(serializer.errors, status=400)

        except Exception as e:
            print("ERROR REAL:", e)
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    # "GET"
    def get(self, request, cedula):
        try:
            borrador_autoevaluacion = BorradorAutoevaluacion.objects.filter(
                cedula_estudiante_id=cedula
            ).first()

            if borrador_autoevaluacion:
                return Response({
                    "verificacion": True,
                    "id_borrador_autoevaluacion": borrador_autoevaluacion.id_borrador_autoevaluacion,
                    "nombre_procedimiento": borrador_autoevaluacion.nombre_procedimiento,
                    "procedimiento": borrador_autoevaluacion.procedimiento,
                    "id_procedimientos": borrador_autoevaluacion.id_procedimientos,
                    "id_lugar": borrador_autoevaluacion.id_lugar,
                    "nivel_desempeño": borrador_autoevaluacion.nivel_desempeño,
                    "actividad": borrador_autoevaluacion.actividad,
                    "cedula_profesor": borrador_autoevaluacion.cedula_profesor,
                    "hora_inicio": borrador_autoevaluacion.hora_inicio,
                    "hora_final": borrador_autoevaluacion.hora_final,
                    "fecha": borrador_autoevaluacion.fecha
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "verifiacion": False
                }, status=status.HTTP_200_OK)
        except Exception as e:
           return Response(
                {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )