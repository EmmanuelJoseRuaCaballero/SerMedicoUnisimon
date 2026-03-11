from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    CoordinadorPracticas, CursoClinico, Estudiante, Grupo, Practica, PracticaCursoClinico, Profesor,
)

from ..serializers import (
    PracticaCursoClinicoSerializer,
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
                estudiantes = Estudiante.objects.filter(id_grupo=grupo.id_grupo)
                practica_clinicos = PracticaCursoClinico.objects.filter(id_practica=practica.id_practica)

                estudiantes_data = []
                for estudiante in estudiantes:
                    estudiantes_data.append({
                        "nombre_estudiante": f"{estudiante.nombre_1} {estudiante.nombre_2} {estudiante.apellido_1} {estudiante.apellido_2}"
                    })
                
                for p_c in practica_clinicos: 
                    data.append({
                        "nombre_clinico": p_c.id_cur_cli.nombre,
                        "estado": practica.estado,
                        "nombre_profesor": f"{profesor.nombre_1} {profesor.nombre_2} {profesor.apellido_1} {profesor.apellido_2}",
                        "nombre_coord_curso": f"{profesor.cedula_coord_curso.nombre_1} {profesor.cedula_coord_curso.nombre_2} {profesor.cedula_coord_curso.apellido_1} {profesor.cedula_coord_curso.apellido_2}",
                        "semestre": grupo.semestre,
                        "codigo_grupo": grupo.codigo_grupo,
                        "fecha_inicio": practica.fecha_inicio,
                        "fecha_final": practica.fecha_final,          
                        "estudiantes_nombres": estudiantes_data               
                    })
            return Response(data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    # "POST"
    def post(self, request, cedula):
        try:
            nombre_clinico = request.data.get("nombreClinico")
            estado = request.data.get("estado")
            codigo_grupo = request.data.get("codigoGrupo")
            fecha_inicio = request.data.get("fechaInicio")
            fecha_final = request.data.get("fechaFinal")

            grupo = Grupo.objects.get(codigo_grupo=codigo_grupo)
            cursoclinico = CursoClinico.objects.get(nombre=nombre_clinico)
                
            valida_prac = Practica.objects.filter(id_grupo=grupo.id_grupo)
            # Validacion        
            for vp in valida_prac:             
                if PracticaCursoClinico.objects.filter(id_practica=vp.id_practica, id_cur_cli=cursoclinico.id_cur_cli).exists():
                    print(f"El grupo {codigo_grupo} ya tiene asignada la practica clinica {nombre_clinico}")
                    return Response(
                        {"message": f"El grupo {codigo_grupo} ya tiene asignada la practica {nombre_clinico}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
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
    
    # "PATCH"
    def patch(self, request, cedula):
        try:
            nombre_clinico = request.data.get("nombreClinico")
            codigo_grupo = request.data.get("codigoGrupo")
            
            grupo = Grupo.objects.get(codigo_grupo=codigo_grupo)   
            cursoClinico = CursoClinico.objects.get(nombre=nombre_clinico)
            practicas = Practica.objects.filter(cedula_coord_practica=cedula, id_grupo=grupo.id_grupo)
            print(practicas)

            for practica in practicas:
                print(practica.id_practica)
                print(cursoClinico.id_cur_cli)
                pcc_list = PracticaCursoClinico.objects.filter(id_practica=practica.id_practica)
                print(pcc_list)
                for pcc in pcc_list:          
                    if pcc.id_practica == practica.id_practica and pcc.id_cur_cli == cursoClinico.id_cur_cli:
                        print()

            return Response()
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
                
