from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..serializers import (
    CoordinadorCursoSerializer,
)

from ..models import (
    CoordinadorCurso,
)

class CoordinadorCursosView(APIView):
    def get(self, request):
        coord_curso = CoordinadorCurso.objects.all()

        return Response(
            CoordinadorCursoSerializer(coord_curso, many=True).data, 
            status=status.HTTP_200_OK
        )