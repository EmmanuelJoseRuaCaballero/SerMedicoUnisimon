from rest_framework import serializers
from .models import Curso, Login, Profesor

class LoginSerializer(serializers.ModelSerializer):
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