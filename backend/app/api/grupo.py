from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..serializers import (
    GrupoSerializer,
)

from ..models import (
    Grupo,
)

class GrupoView(APIView):
    def get(self, request):
        grupo = Grupo.objects.all()

        return Response(
            GrupoSerializer(grupo, many=True).data, 
            status=status.HTTP_200_OK
        )