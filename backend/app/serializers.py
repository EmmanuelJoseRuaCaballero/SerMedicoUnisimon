from rest_framework import serializers # type: ignore
from .models import *

class RolesSerialiazer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ["id_roles"]
        read_only_fields = ["id_roles"]

class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = ["cedula_profesor", "nombre_1", "nombre_2", 
                  "apellido_1", "apellido_2", "id_roles"]
        read_only_fields = ["cedula_profesor", "id_roles"]

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = ["cedula_estudiante", "nombre_1", "nombre_2", 
                  "apellido_1", "apellido_2", "semestre", "id_roles"]
        read_only_fields = ["cedula_estudiante", "id_roles"]

class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = ["id_lugar", "nombre_lugar"]
        read_only_fields = ["id_lugar"]

class ProcedimientosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedimientos
        fields = ["id_procedimientos", "nombre_p"]
        read_only_fields = ["id_procedimientos"]

class OpcionProcedimientosSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcionProcedimientos
        fields = ["id_opcion_procedimientos", "nombre_op", "id_procedimientos"]
        read_only_fields = ["id_opcion_procedimientos", "id_procedimientos"]

class SubOpcionProcedimientosSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubOpcionProcedimientos
        fields = ["id_sub_opcion_procedimientos", "nombre_sop", "id_opcion_procedimientos"]
        read_only_fields = ["id_sub_opcion_procedimientos", "id_opcion_procedimientos"]

class RetroAlimentacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retroalimentacion
        fields = [
            "id_retroalimentacion",
            "nivel_desempeño",
            "detalles",
            "id_autoevaluacion"
        ]

        read_only_fields = [
            "id_retroalimentacion"
        ]

class AutoevaluacionSerializer(serializers.ModelSerializer):
    retroalimentacion = RetroAlimentacionSerializer(
        source="retroalimentacion",
        read_only=True
    )

    class Meta:
        model = Autoevaluacion
        fields = [
            "id_autoevaluacion", "nivel_desempeño", "actividad_real", "actividad_simulada",
            "hora_inicio", "hora_final", "fecha", "id_lugar",
            "cedula_profesor", "cedula_estudiante", "retroalimentacion"
        ]

        read_only_fields = [
            "id_autoevaluacion"
        ]

class ProcedimientoAutoevaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcedimientoAutoevaluacion
        fields = ["id_procedimiento_autoevaluacion", "procedimiento", "id_autoevaluacion", "id_procedimientos"]
        read_only_fields = ["id_procedimiento_autoevaluacion"]

class DatosUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatosUsuario
        fields = ["cedula", "username", "password", "id_roles"]
        read_only_fields = ["cedula", "id_roles"]

