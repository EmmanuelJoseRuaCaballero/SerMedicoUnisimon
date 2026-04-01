from django.db import models

# Create your models here.
class Roles(models.Model):
    ROLES = (
        (1, 'Director del programa'),
        (2, 'Coordinador de Prácticas e Internado'),
        (3, 'Coordinador de curso'),
        (4, 'Profesor'),
        (5, 'Estudiante'),
    )

    id_roles = models.IntegerField(primary_key=True, choices=ROLES)
    
class Profesor(models.Model):
    cedula_profesor = models.IntegerField(primary_key=True, unique=True)
    nombre_1 = models.CharField(max_length=100, null=False)
    nombre_2 = models.CharField(max_length=100, null=True)
    apellido_1 = models.CharField(max_length=100, null=False)
    apellido_2 = models.CharField(max_length=100, null=True)
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)

class Estudiante(models.Model):
    cedula_estudiante = models.IntegerField(primary_key=True, unique=True)
    nombre_1 = models.CharField(max_length=100, null=False)
    nombre_2 = models.CharField(max_length=100, null=True)
    apellido_1 = models.CharField(max_length=100, null=False)
    apellido_2 = models.CharField(max_length=100, null=True)
    semestre = models.IntegerField()
    estado = models.BooleanField(default=False)
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)

class BorradorAutoevaluacion(models.Model):
    id_borrador_autoevaluacion = models.AutoField(primary_key=True)
    nombre_procedimiento = models.CharField(max_length=255)
    procedimiento = models.IntegerField()
    id_procedimientos  = models.IntegerField()
    id_lugar = models.IntegerField()
    nivel_desempeño = models.IntegerField()
    actividad = models.BooleanField()
    cedula_profesor = models.IntegerField()
    hora_inicio = models.TimeField()
    hora_final = models.TimeField()
    fecha = models.DateField(auto_now_add=True)
    cedula_estudiante = models.OneToOneField (
        Estudiante,
        on_delete=models.CASCADE
    )

class Lugar(models.Model):
    id_lugar = models.AutoField(primary_key=True)
    nombre_lugar = models.CharField(max_length=255)

class Procedimientos(models.Model):
    id_procedimientos = models.IntegerField(primary_key=True)
    nombre_p = models.CharField(max_length=255)

class OpcionProcedimientos(models.Model):
    id_opcion_procedimientos = models.IntegerField(primary_key=True)
    nombre_op = models.CharField(max_length=255)
    id_procedimientos = models.ForeignKey(Procedimientos, on_delete=models.CASCADE)

class SubOpcionProcedimientos(models.Model):
    id_sub_opcion_procedimientos = models.IntegerField(primary_key=True)
    nombre_sop = models.CharField(max_length=255)
    id_opcion_procedimientos = models.ForeignKey(OpcionProcedimientos, on_delete=models.CASCADE)

class Autoevaluacion(models.Model):
    id_autoevaluacion = models.AutoField(primary_key=True)
    nivel_desempeño = models.CharField(max_length=100, null=False)
    actividad_real = models.IntegerField(null=True)
    actividad_simulada = models.IntegerField(null=True)
    hora_inicio = models.TimeField()
    hora_final = models.TimeField()
    fecha = models.DateField(auto_now_add=True)
    id_lugar = models.ForeignKey(Lugar, on_delete=models.CASCADE)
    cedula_profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    cedula_estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)

class Retroalimentacion(models.Model):
    id_retroalimentacion = models.AutoField(primary_key=True)
    nivel_desempeño = models.CharField(max_length=100, null=False)
    observaciones = models.TextField(null=True)
    fecha = models.DateField(auto_now_add=True)
    id_autoevaluacion = models.OneToOneField(
        Autoevaluacion,
        on_delete=models.CASCADE
    )

class BorradorRetroalimentacion(models.Model):
    id_borrador_retroalimentacion = models.AutoField(primary_key=True)
    nivel_desempeño = models.IntegerField()
    observaciones = models.TextField()
    id_autoevaluacion = models.OneToOneField(
        Autoevaluacion,
        on_delete=models.CASCADE
    )

class ProcedimientoAutoevaluacion(models.Model):
    id_procedimiento_autoevaluacion = models.AutoField(primary_key=True)
    procedimiento = models.IntegerField(null=False)
    id_autoevaluacion = models.ForeignKey(Autoevaluacion, on_delete=models.CASCADE)
    id_procedimientos = models.ForeignKey(Procedimientos, on_delete=models.CASCADE)

class DatosUsuario(models.Model):
    cedula = models.IntegerField(primary_key=True, unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)

