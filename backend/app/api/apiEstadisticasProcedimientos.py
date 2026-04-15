from collections import defaultdict
from django.db.models import Prefetch
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Autoevaluacion,
    OpcionProcedimientos,
    ProcedimientoAutoevaluacion,
    Procedimientos,
    SubOpcionProcedimientos,
)

class TablaProcedimientosEstudianteView(APIView):
    """
    API Tabla Procedimientos
    """
    def get(self, request):
        """
        Retorna los procedimientos realizado por los estudiantes
        
        Args:
            request (Request): objeto con los datos enviados en el body
            cedula_estudiante (int): cedula del estudiante
        Returns:
            Response:
                200: Datos retornados
                403: Acceso prohibido (rol)
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

            procedimientos = Procedimientos.objects.prefetch_related(
                Prefetch(
                    "opcionprocedimientos_set",
                    queryset=OpcionProcedimientos.objects.order_by("nombre_op").prefetch_related(
                        Prefetch(
                            "subopcionprocedimientos_set",
                            queryset=SubOpcionProcedimientos.objects.order_by("nombre_sop")
                        )
                    )
                )
            ).order_by("nombre_p")

            autos = ProcedimientoAutoevaluacion.objects.filter(
                autoevaluacion__estudiante_id=estudiante
            ).select_related(
                "autoevaluacion__lugar",
                "autoevaluacion__profesor"
            )

            sub_map = defaultdict(lambda: {"real": 0, "simulada": 0})
            op_map = defaultdict(lambda: {"real": 0, "simulada": 0})
            proc_map = defaultdict(lambda: {"real": 0, "simulada": 0})

            info_map = defaultdict(lambda: {
                "lugares": set(),
                "profesores": set()
            })

            def resolve_tipo(proc_id):
                if SubOpcionProcedimientos.objects.filter(id_sub_opcion_procedimientos=proc_id).exists():
                    return "subopcion"
                if OpcionProcedimientos.objects.filter(id_opcion_procedimientos=proc_id).exists():
                    return "opcion"
                return "desconocido"

            for a in autos:

                proc_id = a.procedimiento

                real = 1 if a.autoevaluacion.actividad_real else 0
                simulada = 1 if a.autoevaluacion.actividad_simulada else 0

                tipo = resolve_tipo(proc_id)

                if tipo == "subopcion":
                    sub_map[proc_id]["real"] += real
                    sub_map[proc_id]["simulada"] += simulada

                    op = SubOpcionProcedimientos.objects.get(
                        id_sub_opcion_procedimientos=proc_id
                    ).id_opcion_procedimientos_id

                    op_map[op]["real"] += real
                    op_map[op]["simulada"] += simulada

                    proc = OpcionProcedimientos.objects.get(
                        id_opcion_procedimientos=op
                    ).id_procedimientos_id

                    proc_map[proc]["real"] += real
                    proc_map[proc]["simulada"] += simulada

                elif tipo == "opcion":
                    op_map[proc_id]["real"] += real
                    op_map[proc_id]["simulada"] += simulada

                    proc = OpcionProcedimientos.objects.get(
                        id_opcion_procedimientos=proc_id
                    ).id_procedimientos_id

                    proc_map[proc]["real"] += real
                    proc_map[proc]["simulada"] += simulada

                info_map[proc_id]["lugares"].add(a.autoevaluacion.lugar.nombre_lugar)
                info_map[proc_id]["profesores"].add(
                    f"{a.autoevaluacion.profesor.nombre_1} {a.autoevaluacion.profesor.nombre_2} {a.autoevaluacion.profesor.apellido_1} {a.autoevaluacion.profesor.apellido_2}"
                )

            resultado = []

            for proc in procedimientos:

                proc_id = proc.id_procedimientos

                proc_dict = {
                    "nombre_procedimiento": proc.nombre_p,
                    "actividad_real": proc_map[proc_id]["real"],
                    "actividad_simulada": proc_map[proc_id]["simulada"],
                    "opciones": []
                }

                for op in proc.opcionprocedimientos_set.all():

                    op_id = op.id_opcion_procedimientos

                    op_dict = {
                        "nombre_opcion": op.nombre_op,
                        "actividad_real": op_map[op_id]["real"],
                        "actividad_simulada": op_map[op_id]["simulada"],
                        "lugares": list(info_map[op_id]["lugares"]),
                        "profesores": list(info_map[op_id]["profesores"]),
                        "subopciones": []
                    }

                    for sub in op.subopcionprocedimientos_set.all():

                        sub_id = sub.id_sub_opcion_procedimientos

                        op_dict["subopciones"].append({
                            "nombre_subopcion": sub.nombre_sop,
                            "actividad_real": sub_map[sub_id]["real"],
                            "actividad_simulada": sub_map[sub_id]["simulada"],
                            "lugares": list(info_map[sub_id]["lugares"]),
                            "profesores": list(info_map[sub_id]["profesores"]),
                        })

                    proc_dict["opciones"].append(op_dict)

                resultado.append(proc_dict)

            return Response(
                resultado, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class EstadisticasProcedimientosEstudiantesView(APIView):
    """
    API Estadisticas Procedimientos
    """
    def get(self, request):
        """
        Retorna las estadisticas de los procedimientos
        """       
        user = request.user

        if not user.groups.filter(name="Estudiante").exists():
            return Response(
                {"detail": "Acceso prohibido (rol)"},
                status=status.HTTP_403_FORBIDDEN
            )

        estudiante = user.estudiante

        data = []

        list_auto = Autoevaluacion.objects.filter(
            estudiante_id=estudiante
        )

        data_dict = {}
        total_real = 0
        total_simulada = 0

        for auto in list_auto:
            anio = auto.fecha.year

            if anio not in data_dict:
                data_dict[anio] = {
                    "year": anio,
                    "real": 0,
                    "simulado": 0
                }

            if auto.actividad_real == 1:
                data_dict[anio]["real"] += 1
                total_real += 1
            elif auto.actividad_simulada == 1:
                data_dict[anio]["simulado"] += 1
                total_simulada += 1

        data = sorted(data_dict.values(), key=lambda x: x["year"])

        return Response({
            "year": data,
            "totales": {
                "real": total_real,
                "simulado": total_simulada
            }},
            status=status.HTTP_200_OK
        )

class TablaProcedimientosProfesorView(APIView):
    """
    API Tabla Procedimientos
    """
    def get(self, request):
        """
        Retorna los procedimientos realizado por los estudiantes relacionados al profesor
        
        Args:
            request (Request): objeto con los datos enviados en el body
            cedula_profesor (int): cedula del profesor
        Returns:
            Response:
                200: Datos retornados
                403: Acceso prohibido (rol)
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

            procedimientos = Procedimientos.objects.prefetch_related(
                Prefetch(
                    "opcionprocedimientos_set",
                    queryset=OpcionProcedimientos.objects.order_by("nombre_op").prefetch_related(
                        Prefetch(
                            "subopcionprocedimientos_set",
                            queryset=SubOpcionProcedimientos.objects.order_by("nombre_sop")
                        )
                    )
                )
            ).order_by("nombre_p")

            autos = ProcedimientoAutoevaluacion.objects.filter(
                autoevaluacion__profesor_id=profesor
            ).select_related(
                "autoevaluacion__lugar",
                "autoevaluacion__estudiante"
            )

            sub_map = defaultdict(lambda: {"real": 0, "simulada": 0})
            op_map = defaultdict(lambda: {"real": 0, "simulada": 0})
            proc_map = defaultdict(lambda: {"real": 0, "simulada": 0})

            info_map = defaultdict(lambda: {
                "lugares": set(),
                "estudiantes": set()
            })

            def resolve_tipo(proc_id):
                if SubOpcionProcedimientos.objects.filter(id_sub_opcion_procedimientos=proc_id).exists():
                    return "subopcion"
                if OpcionProcedimientos.objects.filter(id_opcion_procedimientos=proc_id).exists():
                    return "opcion"
                return "desconocido"

            for a in autos:

                proc_id = a.procedimiento

                real = 1 if a.autoevaluacion.actividad_real else 0
                simulada = 1 if a.autoevaluacion.actividad_simulada else 0

                tipo = resolve_tipo(proc_id)

                if tipo == "subopcion":
                    sub_map[proc_id]["real"] += real
                    sub_map[proc_id]["simulada"] += simulada

                    op = SubOpcionProcedimientos.objects.get(
                        id_sub_opcion_procedimientos=proc_id
                    ).id_opcion_procedimientos_id

                    op_map[op]["real"] += real
                    op_map[op]["simulada"] += simulada

                    proc = OpcionProcedimientos.objects.get(
                        id_opcion_procedimientos=op
                    ).id_procedimientos_id

                    proc_map[proc]["real"] += real
                    proc_map[proc]["simulada"] += simulada

                elif tipo == "opcion":
                    op_map[proc_id]["real"] += real
                    op_map[proc_id]["simulada"] += simulada

                    proc = OpcionProcedimientos.objects.get(
                        id_opcion_procedimientos=proc_id
                    ).id_procedimientos_id

                    proc_map[proc]["real"] += real
                    proc_map[proc]["simulada"] += simulada

                info_map[proc_id]["lugares"].add(a.autoevaluacion.lugar.nombre_lugar)
                info_map[proc_id]["estudiantes"].add(
                    f"{a.autoevaluacion.estudiante.nombre_1} {a.autoevaluacion.estudiante.nombre_2} {a.autoevaluacion.estudiante.apellido_1} {a.autoevaluacion.estudiante.apellido_2}"
                )

            resultado = []

            for proc in procedimientos:

                proc_id = proc.id_procedimientos

                proc_dict = {
                    "nombre_procedimiento": proc.nombre_p,
                    "actividad_real": proc_map[proc_id]["real"],
                    "actividad_simulada": proc_map[proc_id]["simulada"],
                    "opciones": []
                }

                for op in proc.opcionprocedimientos_set.all():

                    op_id = op.id_opcion_procedimientos

                    op_dict = {
                        "nombre_opcion": op.nombre_op,
                        "actividad_real": op_map[op_id]["real"],
                        "actividad_simulada": op_map[op_id]["simulada"],
                        "lugares": list(info_map[op_id]["lugares"]),
                        "estudiantes": list(info_map[op_id]["estudiantes"]),
                        "subopciones": []
                    }

                    for sub in op.subopcionprocedimientos_set.all():

                        sub_id = sub.id_sub_opcion_procedimientos

                        op_dict["subopciones"].append({
                            "nombre_subopcion": sub.nombre_sop,
                            "actividad_real": sub_map[sub_id]["real"],
                            "actividad_simulada": sub_map[sub_id]["simulada"],
                            "lugares": list(info_map[sub_id]["lugares"]),
                            "estudiantes": list(info_map[sub_id]["estudiantes"]),
                        })

                    proc_dict["opciones"].append(op_dict)

                resultado.append(proc_dict)

            return Response(
                resultado, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )