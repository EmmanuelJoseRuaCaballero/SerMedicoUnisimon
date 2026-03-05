from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from .serializers import (
    DatosUsuarioSerializer, PracticaSerializer, ProfesorSerializer, RolesSerialiazer,
)

from .models import (
    CoordinadorCurso, CoordinadorPracticas, CursoClinico, DatosUsuario, 
    DirectorPrograma, Estudiante, Grupo, Practica, Profesor,
)

class DatosUsuarioView(APIView):
    def get(self, request):
        datosusuario = DatosUsuario.objects.all()

        return Response(DatosUsuarioSerializer(datosusuario, many=True).data)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = DatosUsuario.objects.get(
                    username=username,
                    password=password
                )
            
            if user.id_roles.id_roles == 5:
                user = Estudiante.objects.get(cedula_estu=user.cedula)
            elif user.id_roles.id_roles == 4:
                user = Profesor.objects.get(cedula_profesor=user.cedula)
            elif user.id_roles.id_roles == 3:
                user = CoordinadorCurso.objects.get(cedula_coord_curso=user.cedula)
            elif user.id_roles.id_roles == 2:
                user = CoordinadorPracticas.objects.get(cedula_coord_practica=user.cedula)
            elif user.id_roles.id_roles == 1:
                user = DirectorPrograma.objects.get(cedula=user.cedula) 

                  
            
            return Response({
                "message": "Usuario Encontrando",
                "cedula": getattr(user, "cedula_estu", None)
                      or getattr(user, "cedula_profesor", None)
                      or getattr(user, "cedula_coord_curso", None)
                      or getattr(user, "cedula_coord_practica", None)
                      or getattr(user, "cedula", None),
                "nombre": f"{user.nombre_1} {user.apellido_1}",
                "rol": user.id_roles.id_roles
            }, status=status.HTTP_200_OK) 
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PracticaView(APIView):
    def get(self, request, cedula):
        try:    
            grupo = Grupo.objects.get(cedula_profesor=cedula)

            practica = Practica.objects.get(id_cur_cli=grupo.id_cur_cli)

            profesor = Profesor.objects.get(cedula_profesor=cedula)

            return Response({  
                "nombre_clinico": practica.id_cur_cli.nombre,
                "estado": practica.estado,
                "nombre_profesor": f"{profesor.nombre_1} {profesor.apellido_1}",
                "grupo": grupo.codigo_grupo,
                "semestre": grupo.semestre,
                "fecha_inicio": practica.fecha_inicio,
                "fecha_final": practica.fecha_final                  
            })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request, cedula):
            try:
                estado = request.data.get("estado")
                fecha_inicio = request.data.get("fecha_inicio")
                fecha_final = request.data.get("fecha_final")
                id_curso_clinico = request.data.get("id_cur_cli")
                
                curso_clinico = CursoClinico.objects.get(id_cur_cli=id_curso_clinico)
                coordinador_practica = CoordinadorPracticas.objects.get(cedula_coord_practica=cedula)

                practica = Practica.objects.create(
                    estado=estado,
                    fecha_inicio=fecha_inicio,
                    fecha_final=fecha_final,
                    id_cur_cli=curso_clinico,
                    cedula_coord_practica=coordinador_practica
                )

                practica.save()

                return Response(
                    PracticaSerializer(practica).data,
                    status=status.HTTP_201_CREATED
                )

            except CursoClinico.DoesNotExist:
                    return Response({"error": "Curso no existe"}, status=400)

            except Exception as e:
                    return Response({"error": str(e)}, status=500)