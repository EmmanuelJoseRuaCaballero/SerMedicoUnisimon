from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.groups.filter(name="Estudiante").exists():
            perfil = user.estudiante
            return Response({
                "cedula": perfil.cedula_estudiante,
                "nombre": f"{perfil.nombre_1} {perfil.nombre_2} {perfil.apellido_1} {perfil.apellido_2}",
                "rol": "Estudiante"
            })

        elif user.groups.filter(name="Profesor").exists():
            perfil = user.profesor
            return Response({
                "cedula": perfil.cedula_profesor,
                "nombre": f"{perfil.nombre_1} {perfil.nombre_2} {perfil.apellido_1} {perfil.apellido_2}",
                "rol": "Profesor"
            })