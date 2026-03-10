from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    CursoClinico, Grupo, Practica, PracticaCursoClinico, Profesor,
)

from ..serializers import (
    PracticaSerializer,
)   

# API datos de practica
# param URL:
# @cedula: int
class PracticaView(APIView):
    # "GET"
    def get(self, request, cedula):
        try:
            practicas = Practica.objects.filter(cedula_coord_practica=cedula)

            data = []
            for practica in practicas:
                grupo = practica.id_grupo
                profesor = grupo.cedula_profesor    
                practica_clinicos = PracticaCursoClinico.objects.filter(id_practica=practica.id_practica)
                
                for p_c in practica_clinicos: 
                    data.append({
                        "id_practica": practica.id_practica,
                        "nombre_clinico": p_c.id_cur_cli.nombre,
                        "estado": practica.estado,
                        "nombre_profesor": f"{profesor.nombre_1} {profesor.apellido_1}",
                        "semestre": grupo.semestre,
                        "codigo_grupo": grupo.codigo_grupo,
                        "fecha_inicio": practica.fecha_inicio,
                        "fecha_final": practica.fecha_final                         
                    })
            return Response(data, status=status.HTTP_200_OK)

        except Profesor.DoesNotExist:
            return Response(
                {"error": "Profesor no encontrado"},
                status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    # "POST"
    def post(self, request, cedula):
            try:
                nombre_clinico = request.data.get("clinico")
                estado = request.data.get("estado")
                codigo_grupo = request.data.get("grupo")
                fecha_inicio = request.data.get("inicio")
                fecha_final = request.data.get("final")

                grupo = Grupo.objects.get(codigo_grupo=codigo_grupo)
                cursoclinico = CursoClinico.objects.get(nombre=nombre_clinico)

                practica = Practica.objects.create(
                    estado=estado,
                    fecha_inicio=fecha_inicio,
                    fecha_final=fecha_final,
                    id_grupo=grupo,
                    cedula_coord_practica_id=cedula
                )

                PracticaCursoClinico.objects.create(
                    id_practica=practica,
                    id_cur_cli=cursoclinico
                )

                return Response(
                    PracticaSerializer(practica).data,
                    status=status.HTTP_201_CREATED
                )

            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )