from rest_framework import serializers # type: ignore
from .models import *

class DatosUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatosUsuario
        fields = "__all__"

class RolesSerialiazer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = "__all__"
        only_read = ["id_roles"]

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = "__all__"

class CursoClinicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoClinico
        fields = "__all__"

class PracticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Practica
        fields = "__all__"

class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = "__all__"

class DirectorProgramaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorPrograma
        fields = "__all__"

class CoordinadorPracticasSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoordinadorPracticas
        fields = "__all__"

class CoordinadorCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoordinadorCurso
        fields = "__all__"