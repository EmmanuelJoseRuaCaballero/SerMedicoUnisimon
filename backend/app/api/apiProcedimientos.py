from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Procedimientos, OpcionProcedimientos, SubOpcionProcedimientos
) 

class ProcedimientosView(APIView):
    """
    API Procedimientos
    """
    def get(self, request):
        """
        Retornar todos los procedimientos, sus opciones y subopciones
         
        Returns:
            Response:
                200: Retornar la lista de los procedimientos
                500: Error interno del servidor
        """
        try:
            procedimientos = Procedimientos.objects.all()

            lista_procedimientos = []
            for procedimiento in procedimientos:
                opcion_procedimientos = OpcionProcedimientos.objects.filter(
                    id_procedimientos=procedimiento
                )

                lista_opcion_procedimientos = []
                for opcion in opcion_procedimientos:
                    sub_opcion_procedimientos = SubOpcionProcedimientos.objects.filter(
                        id_opcion_procedimientos=opcion
                    )

                    lista_sub_opcion_procedimientos = []
                    for sub in sub_opcion_procedimientos:
                        lista_sub_opcion_procedimientos.append({
                            "id_sub_opcion_procedimientos": sub.id_sub_opcion_procedimientos,
                            "nombre_sop": sub.nombre_sop
                        })

                    lista_opcion_procedimientos.append({
                        "id_opcion_procedimientos": opcion.id_opcion_procedimientos,
                        "nombre_op": opcion.nombre_op,
                        "sub_opcion_procedimientos": lista_sub_opcion_procedimientos
                    })

                lista_procedimientos.append({
                    "id_procedimientos": procedimiento.id_procedimientos,
                    "nombre_p": procedimiento.nombre_p,
                    "opcion_procedimientos": lista_opcion_procedimientos
                })

            return Response(
                lista_procedimientos, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )