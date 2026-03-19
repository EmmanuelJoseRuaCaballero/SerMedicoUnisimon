from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser

class CustomJWTAuthentication(BaseAuthentication):
    """
    Autenticación personalizada usando JWT sin depender de SimpleJWT 
    para obtener usuario real. Devuelve un token decodificado como 'user'.
    """
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None  # No hay token, DRF continúa con otras autenticaciones

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise AuthenticationFailed("Formato de token inválido. Se espera 'Bearer <token>'.")

        token = parts[1]

        try:
            # Decodifica el token sin validar usuario
            decoded = UntypedToken(token)
        except (InvalidToken, TokenError):
            raise AuthenticationFailed("Token inválido o expirado.")

        # Retorna el token decodificado como 'user', y None como auth
        return (decoded, None)