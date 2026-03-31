from app.token.authentication import CustomJWTAuthentication
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Autoevaluacion,
    OpcionProcedimientos,
    ProcedimientoAutoevaluacion,
    SubOpcionProcedimientos,
)

class CurvaAprendizajeView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    """
    API Curva Aprendizaje
    """
    def get(self, request):
        try:
            user = request.user
            
            cedula_estudiante = request.user.cedula

            if not hasattr(user, "id_roles") or user.id_roles.id_roles != 5:
                print("error")
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            autoevaluaciones = Autoevaluacion.objects.filter(
                cedula_estudiante_id=cedula_estudiante
                )
            
            codigo_procedimiento = 0

            lista_autoevaluaciones = []
            for autoevaluacion in autoevaluaciones:
                # Verificamos si tiene retroalimentacion
                if hasattr(autoevaluacion, "retroalimentacion"):
                    nivel_desempeño_profesor = {
                        "nivel_desempeño": autoevaluacion.retroalimentacion.nivel_desempeño,
                    }
                else:
                    nivel_desempeño_profesor = {
                        "nivel_desempeño": "",
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
                        codigo_procedimiento = sop.id_sub_opcion_procedimientos

                    elif OpcionProcedimientos.objects.filter(
                        id_opcion_procedimientos=pa.procedimiento
                    ).exists():
                        op = OpcionProcedimientos.objects.get(
                            id_opcion_procedimientos=pa.procedimiento
                        )
                        codigo_procedimiento = op.id_opcion_procedimientos

                    lista_autoevaluaciones.append({
                        "codigo_procedimiento": codigo_procedimiento,
                        "nivel_desempeño_estudiante": autoevaluacion.nivel_desempeño,
                        "fecha": autoevaluacion.fecha,
                        "nivel_desempeño_profesor": nivel_desempeño_profesor["nivel_desempeño"]
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