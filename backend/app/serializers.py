from rest_framework import serializers # type: ignore
from django.contrib.auth.models import User
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

class ProfesorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profesor
        fields = ["id", "user", "cedula_profesor", "nombre_1", "nombre_2", 
                  "apellido_1", "apellido_2",]

class BorradorAutoevaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorradorAutoevaluacion
        fields = "__all__"

class EstudianteSerializer(serializers.ModelSerializer):
    borradorautoevaluacion = BorradorAutoevaluacionSerializer(
        source="borradorAutoevaluacion",
        read_only=True
    )

    user = UserSerializer(read_only=True)

    class Meta:
        model = Estudiante
        fields = ["id", "user", "cedula_estudiante", "nombre_1", "nombre_2", 
                  "apellido_1", "apellido_2", "semestre", "estado",  "borradorautoevaluacion"]

class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = "__all__"

class ProcedimientosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedimientos
        fields = "__all__"

class OpcionProcedimientosSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcionProcedimientos
        fields = "__all__"

class SubOpcionProcedimientosSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubOpcionProcedimientos
        fields = "__all__"

class BorradorRetroalimentacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorradorRetroalimentacion
        fields = "__all__"


class RetroAlimentacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retroalimentacion
        fields = "__all__"

class AutoevaluacionSerializer(serializers.ModelSerializer):
    retroalimentacion = RetroAlimentacionSerializer(
        source="retroalimentacion",
        read_only=True
    )

    borradorretroalimentacion = BorradorRetroalimentacionSerializer(
        source="borradorRetroalimentacion",
        read_only=True
    )

    class Meta:
        model = Autoevaluacion
        fields = [
            "nivel_desempeño", "actividad_real", "actividad_simulada",
            "hora_inicio", "hora_final", "fecha", "lugar",
            "profesor", "estudiante", "retroalimentacion", "borradorretroalimentacion"
        ]

class ProcedimientoAutoevaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcedimientoAutoevaluacion
        fields = "__all__"

