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

class DirectorPrograma(models.Model):
    cedula = models.IntegerField(primary_key=True, unique=True)
    nombre_1 = models.CharField(max_length=100, null=False)
    nombre_2 = models.CharField(max_length=100, null=True)
    apellido_1 = models.CharField(max_length=100, null=False)
    apellido_2 = models.CharField(max_length=100, null=True)
    correo = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, unique=True)
    fecha_inicio = models.DateField()
    fecha_final = models.DateField() 
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)

class CoordinadorPracticas(models.Model):
    cedula_coord_practica = models.IntegerField(primary_key=True, unique=True)
    nombre_1 = models.CharField(max_length=100, null=False)
    nombre_2 = models.CharField(max_length=100, null=True)
    apellido_1 = models.CharField(max_length=100, null=False)
    apellido_2 = models.CharField(max_length=100, null=True)
    correo = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, unique=True)
    fecha_inicio = models.DateField()
    fecha_final = models.DateField()
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)
    cedula_dic_programa = models.ForeignKey(DirectorPrograma, on_delete=models.CASCADE)

class CoordinadorCurso(models.Model):
    cedula_coord_curso = models.IntegerField(primary_key=True, unique=True)
    nombre_1 = models.CharField(max_length=100, null=False)
    nombre_2 = models.CharField(max_length=100, null=True)
    apellido_1 = models.CharField(max_length=100, null=False)
    apellido_2 = models.CharField(max_length=100, null=True)
    correo = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, unique=True)
    fecha_inicio = models.DateField()
    fecha_final = models.DateField()
    cedula_coord_practica = models.ForeignKey(CoordinadorPracticas, on_delete=models.CASCADE)
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)

class CursoClinico(models.Model):
    id_cur_cli = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

class Profesor(models.Model):
    cedula_profesor = models.IntegerField(primary_key=True, unique=True)
    nombre_1 = models.CharField(max_length=100, null=False)
    nombre_2 = models.CharField(max_length=100, null=True)
    apellido_1 = models.CharField(max_length=100, null=False)
    apellido_2 = models.CharField(max_length=100, null=True)
    correo = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, unique=True)
    fecha_inicio = models.DateField()
    fecha_final = models.DateField()
    cedula_coord_curso = models.ForeignKey(CoordinadorCurso, on_delete=models.CASCADE)
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)

class Practica(models.Model):
    id_practica = models.AutoField(primary_key=True)
    estado = models.BooleanField(default=False)
    fecha_inicio = models.DateField()
    fecha_final = models.DateField()
    id_cur_cli = models.ForeignKey(CursoClinico, on_delete=models.CASCADE)
    cedula_coord_practica = models.ForeignKey(CoordinadorPracticas, on_delete=models.CASCADE)

class CompetenciaClinica(models.Model):
    id_comp_cli = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    nivel_esperado = models.CharField(max_length=100)

class ProcedimientoClinico(models.Model):
    id_proc_cli = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=100)
    id_comp_cli = models.ForeignKey(CompetenciaClinica, on_delete=models.CASCADE)

class ProcedimientoRealizado(models.Model):
    id_proc_real = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=100)
    fecha = models.DateField()
    id_practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    id_proc_cli = models.ForeignKey(ProcedimientoClinico, on_delete=models.CASCADE)

class EvaluacionDocente(models.Model):
    id_eva_doc = models.AutoField(primary_key=True)
    calificacion = models.FloatField()
    nivel_dreyfus = models.CharField(max_length=100)
    cedula_profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    id_proc_real = models.ForeignKey(ProcedimientoRealizado, on_delete=models.CASCADE)

class Grupo(models.Model):
    id_grupo = models.AutoField(primary_key=True)
    codigo_grupo = models.IntegerField(unique=True)
    semestre = models.IntegerField()
    cedula_profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    id_cur_cli = models.ForeignKey(CursoClinico, on_delete=models.CASCADE)

class DatosUsuario(models.Model):
    cedula = models.IntegerField(primary_key=True, unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)

class Estudiante(models.Model):
    codigo_estu = models.IntegerField(primary_key=True, unique=True)
    cedula_estu = models.IntegerField(unique=True)
    nombre_1 = models.CharField(max_length=100, null=False)
    nombre_2 = models.CharField(max_length=100, null=True)
    apellido_1 = models.CharField(max_length=100, null=False)
    apellido_2 = models.CharField(max_length=100, null=True)
    correo = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, unique=True)
    semestre = models.IntegerField()
    fecha_inicio = models.DateField()
    fecha_final = models.DateField()
    id_grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    id_roles = models.ForeignKey(Roles, on_delete=models.CASCADE)

class Reportes(models.Model):
    id_reporte = models.AutoField(primary_key=True)
    tipo_reporte = models.CharField(max_length=100)
    periodo = models.CharField(max_length=100)
    contenido = models.TextField()
    fecha_generacion = models.DateField(auto_now_add=True)
    codigo_estu = models.ForeignKey(Estudiante, on_delete=models.CASCADE)

class Retroalimentacion(models.Model):
    id_retro = models.AutoField(primary_key=True)
    texto = models.TextField()
    cedula_profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    id_eva_doc = models.ForeignKey(EvaluacionDocente, on_delete=models.CASCADE)

class HistorialEvaluacion(models.Model):
    id_hist_eva = models.AutoField(primary_key=True)
    fecha_cambio = models.DateField(auto_now_add=True)
    usuario_editor = models.CharField(max_length=100)
    detalles = models.TextField()
    id_eva_doc = models.ForeignKey(EvaluacionDocente, on_delete=models.CASCADE)

class Autoevaluacion(models.Model):
    id_auto = models.AutoField(primary_key=True)
    nivel_percibido = models.CharField(max_length=100)
    fecha = models.DateField(auto_now_add=True)
    comentarios = models.TextField()
    id_proc_real = models.ForeignKey(ProcedimientoRealizado, on_delete=models.CASCADE)
    codigo_estu = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
