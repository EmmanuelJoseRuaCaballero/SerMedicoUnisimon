from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..serializers import (
    ProfesorSerializer
)

from ..models import (
    Profesor,
)

class ProfesoresView(APIView):
    def get(self, request):
        profesores = Profesor.objects.all()

        return Response(
            ProfesorSerializer(profesores, many=True).data, 
            status=status.HTTP_200_OK
        )