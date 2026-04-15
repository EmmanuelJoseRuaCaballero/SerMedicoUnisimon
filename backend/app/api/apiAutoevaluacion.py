from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from datetime import datetime

from ..models import (
    Autoevaluacion,
    BorradorAutoevaluacion,
    OpcionProcedimientos,
    ProcedimientoAutoevaluacion,
    Profesor,
    SubOpcionProcedimientos,
)

class AutoevaluacionEstudianteView(APIView):
    """
    API Autoevaluacion Estudiante
    """
    def post(self, request):
        """
        Crea una nueva autoevaluacion para el estudiante

        Args:
            request (Request): objeto con los datos enviados en el body
            cedula_estudiante (int): cedula del estudiante
        Body:
            nivel_desempeño (int): nivel de desempeño del estudiante
            tipo_actividad (int): tipo de actividad
            hora_inicio (time): hora de inicio de la actividad
            hora_final (time): hora de finalizacion de la actividad
            fecha (date): fecha de la actividad
            id_lugar (int): id del lugar donde se realizara
            cedula_profesor (int): cedula del profesor
            procedimiento (int): codigo del procedimiento elegido
            id_procedimientos (int): id del procedimiento raiz
            id_borrador_autoevaluacion (int): id del borrador de autoevaluacion
        Returns:
            Response:
                201: Crear autoevaluacion
                500: Error interno del servidor
        """
        try: 
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            estudiante = user.estudiante

            nivel_desempeño = request.data.get("nivel_desempeño")
            tipo_actividad = request.data.get("tipo_actividad")
            hora_inicio = datetime.strptime(request.data.get("hora_inicio"), "%H:%M").time()
            hora_final = datetime.strptime(request.data.get("hora_final"), "%H:%M").time()
            #fecha = request.data.get("fecha")
            lugar_id = request.data.get("lugar_id")
            cedula_profesor = request.data.get("cedula_profesor")
            procedimiento = request.data.get("procedimiento")
            procedimientos_id = request.data.get("procedimientos_id")
            id_borrador_autoevaluacion = request.data.get("id_borrador_autoevaluacion")

            # Elegir el nivel de desempeño
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
                
            # Guardar la autoevaluacion segun la actividad
            profesor = Profesor.objects.get(cedula_profesor=cedula_profesor)

            if tipo_actividad == 1: # Real
                autoevaluacion = Autoevaluacion.objects.create(
                    nivel_desempeño = desempeño,
                    actividad_real=1,
                    hora_inicio=hora_inicio,
                    hora_final=hora_final,
                    #fecha=fecha,
                    lugar_id=lugar_id,
                    profesor_id=profesor.id,
                    estudiante_id=estudiante.id,
                )
            elif tipo_actividad == 0: # Simulada
                autoevaluacion = Autoevaluacion.objects.create(
                    nivel_desempeño = desempeño,
                    actividad_simulada=1,
                    hora_inicio=hora_inicio,
                    hora_final=hora_final,
                    #fecha=fecha,
                    lugar_id=lugar_id,
                    profesor_id=profesor.id,
                    estudiante_id=estudiante.id,
                )
            ProcedimientoAutoevaluacion.objects.create(
                procedimiento=procedimiento,
                autoevaluacion=autoevaluacion,
                procedimientos_id=procedimientos_id
            )

            # Eliminar el borrador, si existe
            if id_borrador_autoevaluacion:
                BorradorAutoevaluacion.objects.get(
                    id=id_borrador_autoevaluacion
                ).delete()

            return Response(
                {"message": "Autoevaluacion Creada"},
                    status=status.HTTP_201_CREATED
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        """
        Retornar las autoevaluaciones del estudiante

        Args:
            cedula_estudiante (int): cedula del estudiante
        Returns:
            Response:
                200: Retornar autoevaluaciones
                500: Error interno del servidor
        """
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            estudiante = user.estudiante

            autoevaluaciones = Autoevaluacion.objects.filter(
                estudiante_id=estudiante
                ).order_by('-fecha')
            nombre_procedimiento = ""

            lista_autoevaluaciones = []
            for autoevaluacion in autoevaluaciones:
                # Verificamos si tiene retroalimentacion
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
                    autoevaluacion_id=autoevaluacion
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
                        "id_autoevaluacion": autoevaluacion.id,
                        "nombre_procedimiento": nombre_procedimiento,
                        "nivel_desempeño": autoevaluacion.nivel_desempeño,
                        "tipo_actividad": tipo_actividad,
                        "hora_inicio": autoevaluacion.hora_inicio,
                        "hora_final": autoevaluacion.hora_final,
                        "fecha": autoevaluacion.fecha,
                        "lugar": autoevaluacion.lugar.nombre_lugar,
                        "nombre_profesor": (
                            f"{autoevaluacion.profesor.nombre_1} "
                            f"{autoevaluacion.profesor.nombre_2} "
                            f"{autoevaluacion.profesor.apellido_1} " 
                            f"{autoevaluacion.profesor.apellido_2} "
                        ),
                        "retroalimentacion": retroalimentacion
                    })
            return Response(
                lista_autoevaluaciones, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UltimasAutoevaluacionesEstudianteView(APIView):
    """
    API Ultimas Autoevaluaciones
    """
    def get(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            estudiante = user.estudiante

            data = []

            queryset = ProcedimientoAutoevaluacion.objects.filter(
                autoevaluacion__estudiante_id=estudiante.id
            ).select_related(
                'autoevaluacion',
                'autoevaluacion__profesor',
                'procedimientos'
            ).order_by('-autoevaluacion__id')[:3]

            for item in queryset:

                data.append({
                    "id_autoevaluacion": item.autoevaluacion.id,
                    "fecha": item.autoevaluacion.fecha,
                    "nombre_profesor": f"{item.autoevaluacion.profesor.nombre_1} {item.autoevaluacion.profesor.nombre_2} {item.autoevaluacion.profesor.apellido_1} {item.autoevaluacion.profesor.apellido_2}",
                    "nombre_procedimiento": item.procedimientos.nombre_p
                })

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
                 
class AutoevaluacionProfesorView(APIView):
    """
    API Autoevaluacion Profesor
    """
    def get(self, request):
        """
        Retornar las autoevaluaciones de los estudiantes al profesor

        Args:
            cedula_profesor (int): cedula del profesor
        Returns:
            Response:
                200: Retornar autoevaluaciones
                500: Error interno del servidor
        """
        try:
            user = request.user

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            profesor = user.profesor
            
            autoevaluaciones = Autoevaluacion.objects.filter(
                profesor_id=profesor
            ).order_by('-fecha')
            nombre_procedimiento = ""

            lista_autoevaluaciones = []
            for autoevaluacion in autoevaluaciones:
                # Verificamos si ya ha realizado retroalimentacion
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
                    autoevaluacion_id=autoevaluacion
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
                        "id_autoevaluacion": autoevaluacion.id,
                        "nombre_procedimiento": nombre_procedimiento,
                        "nivel_desempeño": autoevaluacion.nivel_desempeño,
                        "tipo_actividad": tipo_actividad,
                        "hora_inicio": autoevaluacion.hora_inicio,
                        "hora_final": autoevaluacion.hora_final,
                        "fecha": autoevaluacion.fecha,
                        "lugar": autoevaluacion.lugar.nombre_lugar,
                        "nombre_estudiante": (
                            f"{autoevaluacion.estudiante.nombre_1} " 
                            f"{autoevaluacion.estudiante.nombre_2} " 
                            f"{autoevaluacion.estudiante.apellido_1} " 
                            f"{autoevaluacion.estudiante.apellido_2} "
                        ), 
                        "retroalimentacion": retroalimentacion
                    })
            return Response(
                lista_autoevaluaciones, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print("error", str(e))
            return Response(     
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

