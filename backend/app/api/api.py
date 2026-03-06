from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..serializers import (
    CursoClinicoSerializer,
    DatosUsuarioSerializer,
    GrupoSerializer,
    ProfesorSerializer,
)

from ..models import (
    CursoClinico,
    DatosUsuario,
    Grupo,
    Profesor, 
)

class DatosUsuarioView(APIView):
    def get(self, request):
        datosusuario = DatosUsuario.objects.all()

        return Response(DatosUsuarioSerializer(datosusuario, many=True).data)

class CursoClinicoView(APIView):
    def get(self, request):
        cursoclinico = CursoClinico.objects.all()

        return Response(CursoClinicoSerializer(cursoclinico, many=True).data)

class GrupoView(APIView):
    def get(self, request):
        grupo = Grupo.objects.all()

        return Response(GrupoSerializer(grupo, many=True).data)

