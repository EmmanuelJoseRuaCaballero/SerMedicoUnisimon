from .serializers import CursoSerializer, EstudianteSerializer, LoginSerializer, ProfesorSerializer
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from .models import Curso, Estudiante, Login, Profesor
from rest_framework.permissions import IsAuthenticated # type: ignore

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
        usuarios = Login.objects.all()
        serializer = LoginSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetProfesoresView(APIView):
    def get(self, request):
        profesores = []
        for profesor in Profesor.objects.all():
            profesores.append({
                "id": profesor.id,
                "nombre": profesor.nombre,
                "apellido": profesor.apellido,
                "rol": profesor.login.rol,
                "login_id": profesor.login.id
            })
        return Response(profesores, status=status.HTTP_200_OK)
    
    def post(self, request):
        nombre = request.data.get("nombre") 
        apellido = request.data.get("apellido")
        login_id = request.data.get("login_id")

        if nombre and apellido: 
            profesor = Profesor(nombre=nombre, apellido=apellido, login_id=login_id) 
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
                "codigo": curso.codigo, 
                "profesor": f"{curso.profesor.nombre} {curso.profesor.apellido}"
            })
        return Response(cursos, status=status.HTTP_200_OK)
    
    def post(self, request):
        nombre = request.data.get("nombre") 
        codigo = request.data.get("codigo")
        profesor_id = request.data.get("profesor_id")

        if nombre and codigo and profesor_id: 
            curso = Curso(nombre=nombre, codigo=codigo, profesor_id=profesor_id) 
        curso.save() 
        
        return Response({ 
            "message": "Curso creado exitosamente", 
            "curso": curso.nombre }, 
        status=status.HTTP_201_CREATED)
    
class GetUsuarioCompletoView(APIView):
    def get(self, request, user_id):

        try:
            usuario = Login.objects.get(id=user_id)

            data = {
                "seccion_login": LoginSerializer(usuario).data,
                "seccion_profesor": ProfesorSerializer(
                    Profesor.objects.filter(login=usuario).first()
                ).data if Profesor.objects.filter(login=usuario).exists() else None,
                "seccion_cursos": CursoSerializer(
                    Curso.objects.filter(profesor__login=usuario),
                    many=True
                ).data
            }

            return Response(data, status=status.HTTP_200_OK)

        except Login.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

class EstudianteListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        estudiantes = Estudiante.objects.all()
        serializer = EstudianteSerializer(estudiantes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EstudianteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EstudianteAPIView(APIView):
    def get(self, request):
        estudiantes = Estudiante.objects.all()
        serializer = EstudianteSerializer(estudiantes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EstudianteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EstudianteDetailAPIView(APIView):
    def get(self, request, i):
        try:
            estudiante = Estudiante.objects.get(id=id)
            serializer = EstudianteSerializer(estudiante)
            return Response(serializer.data)

        except Estudiante.DoesNotExist:
            return Response(
                {"error": "Estudiante no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )