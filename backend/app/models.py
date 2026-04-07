from django.db import models
from django.contrib.auth.models import User

# Create your models here.
    
class Profesor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    cedula_profesor = models.IntegerField(unique=True)
    nombre_1 = models.CharField(max_length=100)
    nombre_2 = models.CharField(max_length=100, null=True, blank=True)
    apellido_1 = models.CharField(max_length=100)
    apellido_2 = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_1} {self.apellido_1}"

class Estudiante(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    cedula_estudiante = models.IntegerField(unique=True)
    nombre_1 = models.CharField(max_length=100)
    nombre_2 = models.CharField(max_length=100, null=True, blank=True)
    apellido_1 = models.CharField(max_length=100)
    apellido_2 = models.CharField(max_length=100, null=True, blank=True)

    semestre = models.IntegerField()
    estado = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre_1} {self.apellido_1}"
    
class BorradorAutoevaluacion(models.Model):
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
    estudiante = models.OneToOneField (
        Estudiante,
        on_delete=models.CASCADE
    )

class Lugar(models.Model):
    nombre_lugar = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre_lugar

class Procedimientos(models.Model):
    id_procedimientos = models.IntegerField(primary_key=True)
    nombre_p = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre_p

class OpcionProcedimientos(models.Model):
    id_opcion_procedimientos = models.IntegerField(primary_key=True)
    nombre_op = models.CharField(max_length=255)
    id_procedimientos = models.ForeignKey(Procedimientos, on_delete=models.CASCADE)

class SubOpcionProcedimientos(models.Model):
    id_sub_opcion_procedimientos = models.IntegerField(primary_key=True)
    nombre_sop = models.CharField(max_length=255)
    id_opcion_procedimientos = models.ForeignKey(OpcionProcedimientos, on_delete=models.CASCADE)

class Autoevaluacion(models.Model):
    nivel_desempeño = models.CharField(max_length=100)

    actividad_real = models.IntegerField(null=True, blank=True)
    actividad_simulada = models.IntegerField(null=True, blank=True)

    hora_inicio = models.TimeField()
    hora_final = models.TimeField()
    fecha = models.DateField(auto_now_add=True)

    lugar = models.ForeignKey(Lugar, on_delete=models.CASCADE)
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)

    def __str__(self):
        return f"Autoevaluación {self.id}"

class Retroalimentacion(models.Model):
    nivel_desempeño = models.CharField(max_length=100)
    observaciones = models.TextField(null=True, blank=True)
    fecha = models.DateField(auto_now_add=True)

    autoevaluacion = models.OneToOneField(
        Autoevaluacion,
        on_delete=models.CASCADE
    )

class BorradorRetroalimentacion(models.Model):
    nivel_desempeño = models.IntegerField()
    observaciones = models.TextField()

    autoevaluacion = models.OneToOneField(
        Autoevaluacion,
        on_delete=models.CASCADE
    )

class ProcedimientoAutoevaluacion(models.Model):
    procedimiento = models.IntegerField()

    autoevaluacion = models.ForeignKey(Autoevaluacion, on_delete=models.CASCADE)
    procedimientos = models.ForeignKey(Procedimientos, on_delete=models.CASCADE)


