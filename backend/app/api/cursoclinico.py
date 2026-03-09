from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..serializers import (
    CursoClinicoSerializer,
)

from ..models import (
    CursoClinico,
)

class CursoClinicoView(APIView):
    def get(self, request):
        cursoclinico = CursoClinico.objects.all()

        return Response(
            CursoClinicoSerializer(cursoclinico, many=True).data, 
            status=status.HTTP_200_OK
        )