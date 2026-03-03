from django.db import models

# Create your models here.
class Login(models.Model):
    ROLES = (
        ('DIC_PROGRAMA', 'Director del programa'),
        ('COORD_PRAC', 'Coordinador de Prácticas e Internado'),
        ('COORD_CURSO', 'Coordinador de curso'),
        ('PROFESOR', 'Profesor'),
        ('ESTUDIANTE', 'Estudiante'),
    )

    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    rol = models.CharField(max_length=100, choices=ROLES, default='ESTUDIANTE')

    def __str__(self):
        return self.username
    
class Profesor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    login = models.OneToOneField(Login, on_delete=models.CASCADE)

class Curso(models.Model):
    nombre = models.CharField(max_length=100) 
    codigo = models.IntegerField(unique=True)
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)

class Estudiante(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    login = models.OneToOneField(Login, on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
