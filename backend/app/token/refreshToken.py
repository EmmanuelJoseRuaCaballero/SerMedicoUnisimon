from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework_simplejwt.exceptions import TokenError # type: ignore

class CustomRefreshView(APIView):

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "No refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)

            access = refresh.access_token

            access['cedula'] = refresh.payload.get('cedula')
            access['rol'] = refresh.payload.get('rol')

            return Response({
                "access": str(access)
            })

        except TokenError:
            return Response(
                {"error": "Refresh inválido o expirado"},
                status=status.HTTP_401_UNAUTHORIZED
            )