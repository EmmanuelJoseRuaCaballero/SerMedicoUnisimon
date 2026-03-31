from app.token.authentication import CustomJWTAuthentication
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    OpcionProcedimientos,
    ProcedimientoAutoevaluacion,
    SubOpcionProcedimientos,
)

class TablaProcedimientosEstudianteView(APIView):
    authentication_classes = [CustomJWTAuthentication]
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

            cedula_estudiante = request.user.cedula

            if not hasattr(user, "id_roles") or user.id_roles.id_roles != 5:
                print("error")
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            proc_auto = ProcedimientoAutoevaluacion.objects.filter(
                id_autoevaluacion__cedula_estudiante_id=cedula_estudiante
            ).select_related(
                "id_autoevaluacion__id_lugar",
                "id_autoevaluacion__cedula_profesor"
            )

            data = {}

            for pa in proc_auto:
                proc_id = pa.procedimiento
                auto = pa.id_autoevaluacion

                if len(str(proc_id)) > 5:
                    sop = SubOpcionProcedimientos.objects.select_related(
                        "id_opcion_procedimientos__id_procedimientos"
                    ).get(id_sub_opcion_procedimientos=proc_id)

                    procedimiento_nombre = sop.id_opcion_procedimientos.id_procedimientos.nombre_p
                    opcion_nombre = sop.id_opcion_procedimientos.nombre_op
                    subopcion_nombre = sop.nombre_sop

                else:
                    op = OpcionProcedimientos.objects.select_related(
                        "id_procedimientos"
                    ).get(id_opcion_procedimientos=proc_id)

                    procedimiento_nombre = op.id_procedimientos.nombre_p
                    opcion_nombre = op.nombre_op
                    subopcion_nombre = None

                if procedimiento_nombre not in data:
                    data[procedimiento_nombre] = {
                        "actividad_real": 0,
                        "actividad_simulada": 0,
                        "opciones": {}
                    }

                proc_data = data[procedimiento_nombre]

                if opcion_nombre not in proc_data["opciones"]:
                    proc_data["opciones"][opcion_nombre] = {
                        "actividad_real": 0,
                        "actividad_simulada": 0,
                        "lugares": set(),
                        "profesores": set(),
                        "subopciones": {}
                    }

                opcion_data = proc_data["opciones"][opcion_nombre]

                if auto.actividad_real:
                    proc_data["actividad_real"] += 1
                    opcion_data["actividad_real"] += 1

                if auto.actividad_simulada:
                    proc_data["actividad_simulada"] += 1
                    opcion_data["actividad_simulada"] += 1

                opcion_data["lugares"].add(auto.id_lugar.nombre_lugar)
                opcion_data["profesores"].add(str(auto.cedula_profesor.nombre_1) + " " + str(auto.cedula_profesor.nombre_2) + " " + str(auto.cedula_profesor.apellido_1) + " " + str(auto.cedula_profesor.apellido_2))

                if subopcion_nombre:
                    if subopcion_nombre not in opcion_data["subopciones"]:
                        opcion_data["subopciones"][subopcion_nombre] = {
                            "actividad_real": 0,
                            "actividad_simulada": 0,
                            "lugares": set(),
                            "profesores": set()
                        }

                    sub_data = opcion_data["subopciones"][subopcion_nombre]

                    if auto.actividad_real:
                        sub_data["actividad_real"] += 1

                    if auto.actividad_simulada:
                        sub_data["actividad_simulada"] += 1

                    sub_data["lugares"].add(auto.id_lugar.nombre_lugar)
                    sub_data["profesores"].add(str(auto.cedula_profesor.nombre_1) + " " + str(auto.cedula_profesor.nombre_2) + " " + str(auto.cedula_profesor.apellido_1) + " " + str(auto.cedula_profesor.apellido_2))

            resultado = []

            for proc_nombre, proc_data in data.items():
                proc_dict = {
                    "nombre_procedimiento": proc_nombre,
                    "actividad_real": proc_data["actividad_real"],
                    "actividad_simulada": proc_data["actividad_simulada"],
                    "opciones": []
                }

                for op_nombre, op_data in proc_data["opciones"].items():
                    opcion_dict = {
                        "nombre_opcion": op_nombre,
                        "actividad_real": op_data["actividad_real"],
                        "actividad_simulada": op_data["actividad_simulada"],
                        "lugares": list(op_data["lugares"]),
                        "profesores": list(op_data["profesores"]),
                        "subopciones": []
                    }

                    for sub_nombre, sub_data in op_data["subopciones"].items():
                        opcion_dict["subopciones"].append({
                            "nombre_subopcion": sub_nombre,
                            "actividad_real": sub_data["actividad_real"],
                            "actividad_simulada": sub_data["actividad_simulada"],
                            "lugares": list(sub_data["lugares"]),
                            "profesores": list(sub_data["profesores"]),
                        })

                    proc_dict["opciones"].append(opcion_dict)

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
        
class TablaProcedimientosProfesorView(APIView):
    authentication_classes = [CustomJWTAuthentication]
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

            cedula_profesor = request.user.cedula

            if not hasattr(user, "id_roles") or user.id_roles.id_roles != 4:
                print("error")
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            proc_auto = ProcedimientoAutoevaluacion.objects.filter(
                id_autoevaluacion__cedula_profesor_id=cedula_profesor
            ).select_related(
                "id_autoevaluacion__id_lugar",
                "id_autoevaluacion__cedula_estudiante"
            )

            data = {}

            for pa in proc_auto:
                proc_id = pa.procedimiento
                auto = pa.id_autoevaluacion

                if len(str(proc_id)) > 5:
                    sop = SubOpcionProcedimientos.objects.select_related(
                        "id_opcion_procedimientos__id_procedimientos"
                    ).get(id_sub_opcion_procedimientos=proc_id)

                    procedimiento_nombre = sop.id_opcion_procedimientos.id_procedimientos.nombre_p
                    opcion_nombre = sop.id_opcion_procedimientos.nombre_op
                    subopcion_nombre = sop.nombre_sop

                else:
                    op = OpcionProcedimientos.objects.select_related(
                        "id_procedimientos"
                    ).get(id_opcion_procedimientos=proc_id)

                    procedimiento_nombre = op.id_procedimientos.nombre_p
                    opcion_nombre = op.nombre_op
                    subopcion_nombre = None

                if procedimiento_nombre not in data:
                    data[procedimiento_nombre] = {
                        "actividad_real": 0,
                        "actividad_simulada": 0,
                        "opciones": {}
                    }

                proc_data = data[procedimiento_nombre]

                if opcion_nombre not in proc_data["opciones"]:
                    proc_data["opciones"][opcion_nombre] = {
                        "actividad_real": 0,
                        "actividad_simulada": 0,
                        "lugares": set(),
                        "estudiantes": set(),
                        "subopciones": {}
                    }

                opcion_data = proc_data["opciones"][opcion_nombre]

                if auto.actividad_real:
                    proc_data["actividad_real"] += 1
                    opcion_data["actividad_real"] += 1

                if auto.actividad_simulada:
                    proc_data["actividad_simulada"] += 1
                    opcion_data["actividad_simulada"] += 1

                opcion_data["lugares"].add(auto.id_lugar.nombre_lugar)
                opcion_data["estudiantes"].add(str(auto.cedula_estudiante.nombre_1) + " " + str(auto.cedula_estudiante.nombre_2) + " " + str(auto.cedula_estudiante.apellido_1) + " " + str(auto.cedula_estudiante.apellido_2))

                if subopcion_nombre:
                    if subopcion_nombre not in opcion_data["subopciones"]:
                        opcion_data["subopciones"][subopcion_nombre] = {
                            "actividad_real": 0,
                            "actividad_simulada": 0,
                            "lugares": set(),
                            "estudiantes": set()
                        }

                    sub_data = opcion_data["subopciones"][subopcion_nombre]

                    if auto.actividad_real:
                        sub_data["actividad_real"] += 1

                    if auto.actividad_simulada:
                        sub_data["actividad_simulada"] += 1

                    sub_data["lugares"].add(auto.id_lugar.nombre_lugar)
                    sub_data["estudiantes"].add(str(auto.cedula_estudiante.nombre_1) + " " + str(auto.cedula_estudiante.nombre_2) + " " + str(auto.cedula_estudiante.apellido_1) + " " + str(auto.cedula_estudiante.apellido_2))

            resultado = []

            for proc_nombre, proc_data in data.items():
                proc_dict = {
                    "nombre_procedimiento": proc_nombre,
                    "actividad_real": proc_data["actividad_real"],
                    "actividad_simulada": proc_data["actividad_simulada"],
                    "opciones": []
                }

                for op_nombre, op_data in proc_data["opciones"].items():
                    opcion_dict = {
                        "nombre_opcion": op_nombre,
                        "actividad_real": op_data["actividad_real"],
                        "actividad_simulada": op_data["actividad_simulada"],
                        "lugares": list(op_data["lugares"]),
                        "estudiantes": list(op_data["estudiantes"]),
                        "subopciones": []
                    }

                    for sub_nombre, sub_data in op_data["subopciones"].items():
                        opcion_dict["subopciones"].append({
                            "nombre_subopcion": sub_nombre,
                            "actividad_real": sub_data["actividad_real"],
                            "actividad_simulada": sub_data["actividad_simulada"],
                            "lugares": list(sub_data["lugares"]),
                            "estudiantes": list(sub_data["estudiantes"]),
                        })

                    proc_dict["opciones"].append(opcion_dict)

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