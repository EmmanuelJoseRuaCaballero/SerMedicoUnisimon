from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    CoordinadorPracticas, CursoClinico, Grupo, Practica, Profesor,
)

from ..serializers import (
    PracticaSerializer,
)

# API datos de practica
# param URL:
# @cedula: int
class PracticaView(APIView):
    def get(self, request, cedula):
        try:
            practicas = Practica.objects.filter(cedula_coord_practica=cedula)

            data = []
            for practica in practicas:
                grupos = Grupo.objects.filter(id_grupo=practica.id_grupo.id_grupo)
                for grupo in grupos:
                    profesores = Profesor.objects.filter(cedula_profesor=grupo.cedula_profesor.cedula_profesor)
                    for profesor in profesores:             
                        clinicos = CursoClinico.objects.filter(id_cur_cli=practica.id_practica)
                        for clinico in clinicos:
                            data.append({
                            "nombre_clinico": clinico.nombre,
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

            except Exception as e:
                    return Response({"error": str(e)}, status=500)