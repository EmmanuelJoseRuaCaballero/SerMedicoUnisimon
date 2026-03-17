from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from datetime import datetime

from ..models import (
    BorradorAutoevaluacion,
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
            nombre_procedimiento = request.data.get("nombre_procedimiento")
            id_lugar = request.data.get("id_lugar")
            nivel_desempeño = request.data.get("nivel_desempeño")
            procedimiento = request.data.get("procedimiento")
            id_procedimientos = request.data.get("id_procedimientos")
            actividad = request.data.get("actividad")
            cedula_profesor = request.data.get("cedula_profesor")
            hora_inicio = datetime.strptime(request.data.get("hora_inicio"), "%H:%M").time()
            hora_final = datetime.strptime(request.data.get("hora_final"), "%H:%M").time()
            fecha = request.data.get("fecha")

            if not BorradorAutoevaluacion.objects.filter(
                cedula_estudiante_id=cedula
            ).exists():
                BorradorAutoevaluacion.objects.create(
                    nombre_procedimiento=nombre_procedimiento,
                    id_lugar=id_lugar,
                    nivel_desempeño=nivel_desempeño,
                    procedimiento=procedimiento,
                    id_procedimientos=id_procedimientos,
                    actividad=actividad,
                    cedula_profesor=cedula_profesor,
                    hora_inicio=hora_inicio,
                    hora_final=hora_final,
                    fecha=fecha,
                    cedula_estudiante_id=cedula)
                
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