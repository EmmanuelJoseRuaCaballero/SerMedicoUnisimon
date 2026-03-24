from rest_framework.authentication import BaseAuthentication # type: ignore
from rest_framework.exceptions import AuthenticationFailed # type: ignore
from rest_framework_simplejwt.tokens import UntypedToken # type: ignore
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError # type: ignore
from ..models import DatosUsuario

class CustomJWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None # Permite endpoints publicos
        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise AuthenticationFailed("Formato inválido")

        token = parts[1]

        try:
            decoded = UntypedToken(token)
        except (InvalidToken, TokenError):
            raise AuthenticationFailed("Token inválido o expirado")

        if decoded.get("token_type") != "access":
            raise AuthenticationFailed("Token no válido")

        user_id = decoded.get("user_id")

        if not user_id:
            raise AuthenticationFailed("Token sin user_id")

        try:
            user = DatosUsuario.objects.get(cedula=user_id)
        except DatosUsuario.DoesNotExist:
            raise AuthenticationFailed("Usuario no existe")

        return (user, decoded)