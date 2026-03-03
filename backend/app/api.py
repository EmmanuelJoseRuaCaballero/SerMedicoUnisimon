from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Curso, Login, Profesor

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = Login.objects.get(
                username=username,
                password=password
            )

            return Response({
                "message": "Login exitoso",
                "user": user.username
            }, status=status.HTTP_200_OK)

        except Login.DoesNotExist:
            return Response({
                "error": "Credenciales incorrectas"
            }, status=status.HTTP_401_UNAUTHORIZED)
    
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username") 
        password = request.data.get("password")

        if username and password: 
            user = Login(username=username, password=password, rol=request.data.get("rol"))
        user.save() 
        
        return Response({ 
            "message": "Usuario creado exitosamente", 
            "user": user.username }, 
        status=status.HTTP_201_CREATED)

class GetUsersView(APIView):
    def get(self, request):
        logins = []
        for login in Login.objects.all():
            logins.append({
                "id": login.id,
                "username": login.username,
                "password": login.password,
                "rol": login.rol
            })
        return Response(logins, status=status.HTTP_200_OK)
    
class GetProfesoresView(APIView):
    def get(self, request):
        profesores = []
        for profesor in Profesor.objects.all():
            profesores.append({
                "id": profesor.id,
                "nombre": profesor.nombre,
                "apellido": profesor.apellido,
                "rol": profesor.login.rol
            })
        return Response(profesores, status=status.HTTP_200_OK)
    
    def post(self, request):
        nombre = request.data.get("nombre") 
        apellido = request.data.get("apellido")

        if nombre and apellido: 
            profesor = Profesor(nombre=nombre, apellido=apellido, login_id=request.data.get("login_id")) 
        profesor.save() 
        
        return Response({ 
            "message": "Profesor creado exitosamente", 
            "profesor": f"{profesor.nombre} {profesor.apellido}" }, 
        status=status.HTTP_201_CREATED)
    
class GetCursosView(APIView):
    def get(self, request):
        cursos = []
        for curso in Curso.objects.all():
            cursos.append({
                "id": curso.id,
                "nombre": curso.nombre,
                "codigo": curso.codigo
            })
        return Response(cursos, status=status.HTTP_200_OK)
    
    def post(self, request):
        nombre = request.data.get("nombre") 
        codigo = request.data.get("codigo")
        profesor_id = request.data.get("profesor_id")

        if nombre and codigo and profesor_id: 
            profesor = Profesor.objects.get(id=profesor_id)
            curso = Curso(nombre=nombre, codigo=codigo, profesor=profesor) 
        curso.save() 
        
        return Response({ 
            "message": "Curso creado exitosamente", 
            "curso": curso.nombre }, 
        status=status.HTTP_201_CREATED)
    

    