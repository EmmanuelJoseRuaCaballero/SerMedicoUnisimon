from rest_framework import serializers # type: ignore
from .models import Curso, Estudiante, Login, Profesor

class LoginSerializer(serializers.ModelSerializer):
    rol = serializers.CharField(source='get_rol_display', read_only=True)

    class Meta:
        model = Login
        fields = ('id', 'username', 'password', 'rol')


class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = ('id', 'nombre', 'apellido', 'login')

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ('id', 'nombre', 'codigo', 'profesor') 

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = "__all__"