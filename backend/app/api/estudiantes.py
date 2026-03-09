from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Estudiante, Grupo, 
)

from ..serializers import (
    EstudiantesSerializer, 
)   

class EstudiantesView(APIView):
    # "GET"
    def get(self, request, codigo_grupo):
        try:
            grupo = Grupo.objects.get(codigo_grupo=codigo_grupo)
            estudiantes = Estudiante.objects.filter(id_grupo=grupo.id_grupo)

            data = []
            for estudiante in estudiantes:
                data.append({
                    "nombre_estudiante": f"{estudiante.nombre_1} {estudiante.apellido_1}",
                })

            return Response(
                data, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
