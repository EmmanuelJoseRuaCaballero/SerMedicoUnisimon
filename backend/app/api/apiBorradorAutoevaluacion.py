from app.token.authentication import CustomJWTAuthentication
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
    authentication_classes = [CustomJWTAuthentication]
    """
    API Borrador Autoevaluacion
    """
    def post(self, request):
        """
        Crea un borrador de autoevaluacion para el estudiante
        
        Args:
            request (Request): objeto con los datos enviados en el body
            cedula_estudiante (int): cedula del estudiante
        Body:
            nombre_procedimiento (string): nombre del procedimiento
            procedimiento (int): codigo del procedimiento elegido
            id_procedimientos (int): id del procedimiento raiz
            id_lugar (int): id del lugar donde se realizara
            nivel_desempeño (int): nivel de desempeño del estudiante
            actividad (boolean): tipo de actividad
            cedula_profesor (int): cedula del profesor
            hora_inicio (time): hora de inicio de la actividad
            hora_final (time): hora de finalizacion de la actividad
            fecha (date): fecha de la actividad
        Returns:
            Response:
                200: No hay borrador
                200: Actualizar borrador
                201: Crear borrador
                500: Error interno del servidor
        """
        try:
            user = request.user

            cedula_estudiante = request.user.cedula

            if not hasattr(user, "id_roles") or user.id_roles.id_roles != 5:
                print("error")
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            data = request.data.copy()

            if data.get("fecha"):
                data["fecha"] = datetime.strptime(data["fecha"], "%Y-%m-%d").date()

            if data.get("hora_inicio"):
                data["hora_inicio"] = datetime.strptime(data["hora_inicio"], "%H:%M").time()

            if data.get("hora_final"):
                data["hora_final"] = datetime.strptime(data["hora_final"], "%H:%M").time()

            borrador = BorradorAutoevaluacion.objects.filter(
                cedula_estudiante_id=cedula_estudiante
            ).first()

            if borrador:
                serializer = BorradorAutoevaluacionSerializer(
                    borrador,
                    data=data,
                    partial=True
                )

                if serializer.is_valid():
                    # Verifica si existe el mismo borrador
                    cambios = False
                    for field, value in serializer.validated_data.items():
                        if getattr(borrador, field) != value:
                            cambios = True
                            break

                    if not cambios:
                        return Response({
                            "message": "Sin cambios, ya existe el mismo borrador",
                            "condition": True
                            },status=status.HTTP_200_OK
                        )

                    serializer.save()

                    return Response(
                        {"message": "Borrador actualizado"},
                        status=status.HTTP_200_OK
                    )
            else:
                data["cedula_estudiante"] = cedula_estudiante

                serializer = BorradorAutoevaluacionSerializer(data=data)

                if serializer.is_valid():
                    serializer.save()
                    return Response(
                        {"message": "Borrador creado"},
                        status=status.HTTP_201_CREATED
                    )

                return Response(
                    serializer.errors, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request):
        """
        Retornar Borrador Autoevaluacion del estudiante
        
        Args:
            cedula_estudiante (int): cedula del estudiante
        Returns:
            Response:
                200: No hay borrador
                200: Actualizar borrador
                201: Crear borrador
                500: Error interno del servidor
        """
        try:
            user = request.user

            cedula_estudiante = request.user.cedula

            if not hasattr(user, "id_roles") or user.id_roles.id_roles != 5:
                print("error")
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            borrador_autoevaluacion = BorradorAutoevaluacion.objects.filter(
                cedula_estudiante_id=cedula_estudiante
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
                    "fecha": borrador_autoevaluacion.fecha}, 
                status=status.HTTP_200_OK
                )
            else:
                return Response({
                    "verifiacion": False},
                    status=status.HTTP_200_OK
                )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )