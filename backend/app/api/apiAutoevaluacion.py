from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from datetime import datetime

from ..models import (
    Autoevaluacion,
    BorradorAutoevaluacion,
    OpcionProcedimientos,
    ProcedimientoAutoevaluacion,
    SubOpcionProcedimientos,
)

# API Autoevaluacion
class AutoevaluacionEstudianteView(APIView):
    # "POST"
    # param JSON:
    # @nivel_desempeño: int
    # @tipo_actividad: int
    # @hora_inicio: time
    # @hora_final: time
    # @fecha: date
    # @id_lugar: int
    # @cedula_profesor: int
    # @procedimiento: int
    # @id_procedimientos: int
    # @id_borrador_autoevaluacion: int
    # param URL
    # @cedula: int
    def post(self, request, cedula):
        try: 
            nivel_desempeño = request.data.get("nivel_desempeño")
            tipo_actividad = request.data.get("tipo_actividad")
            hora_inicio = datetime.strptime(request.data.get("hora_inicio"), "%H:%M").time()
            hora_final = datetime.strptime(request.data.get("hora_final"), "%H:%M").time()
            fecha = request.data.get("fecha")
            id_lugar = request.data.get("id_lugar")
            cedula_profesor = request.data.get("cedula_profesor")
            procedimiento = request.data.get("procedimiento")
            id_procedimientos = request.data.get("id_procedimientos")
            id_borrador_autoevaluacion = request.data.get("id_borrador_autoevaluacion")

            if nivel_desempeño == 1:
                desempeño = "Novato"
            elif nivel_desempeño == 2:
                desempeño = "Principiante Avanzado"
            elif nivel_desempeño == 3:
                desempeño = "Competente"
            elif nivel_desempeño == 4:
                desempeño = "Profesional"
            elif nivel_desempeño == 5:
                desempeño = "Experto"
                
            if tipo_actividad == 1: # Real
                autoevaluacion = Autoevaluacion.objects.create(
                    nivel_desempeño = desempeño,
                    actividad_real=1,
                    hora_inicio=hora_inicio,
                    hora_final=hora_final,
                    fecha=fecha,
                    id_lugar_id=id_lugar,
                    cedula_profesor_id=cedula_profesor,
                    cedula_estudiante_id=cedula,
                )
            elif tipo_actividad == 0: # Simulada
                autoevaluacion = Autoevaluacion.objects.create(
                    nivel_desempeño = desempeño,
                    actividad_simulada=1,
                    hora_inicio=hora_inicio,
                    hora_final=hora_final,
                    fecha=fecha,
                    id_lugar_id=id_lugar,
                    cedula_profesor_id=cedula_profesor,
                    cedula_estudiante_id=cedula,
                )
            ProcedimientoAutoevaluacion.objects.create(
                procedimiento=procedimiento,
                id_autoevaluacion=autoevaluacion,
                id_procedimientos_id=id_procedimientos
            )

            if id_borrador_autoevaluacion:
                BorradorAutoevaluacion.objects.get(
                    id_borrador_autoevaluacion=id_borrador_autoevaluacion
                ).delete()

            return Response(
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
           return Response(
                {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # "GET"
    # param URL
    # @cedula: int
    def get(self, request, cedula):
        try:
            autoevaluaciones = Autoevaluacion.objects.filter(
                cedula_estudiante_id=cedula
            )
            nombre_procedimiento = ""

            lista_autoevaluaciones = []
            for autoevaluacion in autoevaluaciones:
                lugar = autoevaluacion.id_lugar
                if hasattr(autoevaluacion, "retroalimentacion"):
                    retroalimentacion = {
                        "nivel_desempeño": autoevaluacion.retroalimentacion.nivel_desempeño,
                        "fecha": autoevaluacion.retroalimentacion.fecha,
                        "observaciones": autoevaluacion.retroalimentacion.observaciones
                    }
                else:
                    retroalimentacion = {
                        "nivel_desempeño": "",
                        "fecha": "",
                        "observaciones": ""
                    }
                lista_pa = ProcedimientoAutoevaluacion.objects.filter(
                id_autoevaluacion=autoevaluacion
                )          
                for pa in lista_pa:
                    if SubOpcionProcedimientos.objects.filter(
                        id_sub_opcion_procedimientos=pa.procedimiento
                    ).exists():
                        sop = SubOpcionProcedimientos.objects.get(
                            id_sub_opcion_procedimientos=pa.procedimiento
                        )
                        nombre_procedimiento = f"{sop.id_opcion_procedimientos.id_procedimientos.nombre_p} - {sop.id_opcion_procedimientos.nombre_op} - {sop.nombre_sop}"

                    elif OpcionProcedimientos.objects.filter(
                        id_opcion_procedimientos=pa.procedimiento
                    ).exists():
                        op = OpcionProcedimientos.objects.get(
                            id_opcion_procedimientos=pa.procedimiento
                        )
                        nombre_procedimiento = f"{op.id_procedimientos.nombre_p} - {op.nombre_op}"

                    if autoevaluacion.actividad_real == 1:
                        tipo_actividad = "Real"
                    elif autoevaluacion.actividad_simulada == 1:
                        tipo_actividad = "Simulada"

                    lista_autoevaluaciones.append({
                        "id_autoevaluacion": autoevaluacion.id_autoevaluacion,
                        "nombre_procedimiento": nombre_procedimiento,
                        "nivel_desempeño": autoevaluacion.nivel_desempeño,
                        "tipo_actividad": tipo_actividad,
                        "hora_inicio": autoevaluacion.hora_inicio,
                        "hora_final": autoevaluacion.hora_final,
                        "fecha": autoevaluacion.fecha,
                        "lugar": lugar.nombre_lugar,
                        "nombre_profesor": f"{autoevaluacion.cedula_profesor.nombre_1} {autoevaluacion.cedula_profesor.nombre_2} {autoevaluacion.cedula_profesor.apellido_1} {autoevaluacion.cedula_profesor.apellido_2}",
                        "retroalimentacion": retroalimentacion
                    })
            return Response(lista_autoevaluaciones, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class AutoevaluacionProfesorView(APIView):
    # "GET"
    # param URL
    # @cedula: int
    def get(self, request, cedula):
        try:
            autoevaluaciones = Autoevaluacion.objects.filter(
                cedula_profesor_id=cedula
            )
            nombre_procedimiento = ""

            lista_autoevaluaciones = []
            for autoevaluacion in autoevaluaciones:
                lugar = autoevaluacion.id_lugar
                if hasattr(autoevaluacion, "retroalimentacion"):
                    retroalimentacion = {
                        "nivel_desempeño": autoevaluacion.retroalimentacion.nivel_desempeño,
                        "fecha": autoevaluacion.retroalimentacion.fecha,
                        "observaciones": autoevaluacion.retroalimentacion.observaciones
                    }
                else:
                    retroalimentacion = {
                        "nivel_desempeño": "",
                        "fecha": "",
                        "observaciones": ""
                    }
                lista_pa = ProcedimientoAutoevaluacion.objects.filter(
                id_autoevaluacion=autoevaluacion
                )          
                for pa in lista_pa:
                    if SubOpcionProcedimientos.objects.filter(
                        id_sub_opcion_procedimientos=pa.procedimiento
                    ).exists():
                        sop = SubOpcionProcedimientos.objects.get(
                            id_sub_opcion_procedimientos=pa.procedimiento
                        )
                        nombre_procedimiento = f"{sop.id_opcion_procedimientos.id_procedimientos.nombre_p} - {sop.id_opcion_procedimientos.nombre_op} - {sop.nombre_sop}"

                    elif OpcionProcedimientos.objects.filter(
                        id_opcion_procedimientos=pa.procedimiento
                    ).exists():
                        op = OpcionProcedimientos.objects.get(
                            id_opcion_procedimientos=pa.procedimiento
                        )
                        nombre_procedimiento = f"{op.id_procedimientos.nombre_p} - {op.nombre_op}"

                    if autoevaluacion.actividad_real == 1:
                        tipo_actividad = "Real"
                    elif autoevaluacion.actividad_simulada == 1:
                        tipo_actividad = "Simulada"

                    lista_autoevaluaciones.append({
                        "id_autoevaluacion": autoevaluacion.id_autoevaluacion,
                        "nombre_procedimiento": nombre_procedimiento,
                        "nivel_desempeño": autoevaluacion.nivel_desempeño,
                        "tipo_actividad": tipo_actividad,
                        "hora_inicio": autoevaluacion.hora_inicio,
                        "hora_final": autoevaluacion.hora_final,
                        "fecha": autoevaluacion.fecha,
                        "lugar": lugar.nombre_lugar,
                        "nombre_estudiante": f"{autoevaluacion.cedula_estudiante.nombre_1} {autoevaluacion.cedula_estudiante.nombre_2} {autoevaluacion.cedula_estudiante.apellido_1} {autoevaluacion.cedula_estudiante.apellido_2}",
                        "retroalimentacion": retroalimentacion
                    })
            return Response(lista_autoevaluaciones, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

