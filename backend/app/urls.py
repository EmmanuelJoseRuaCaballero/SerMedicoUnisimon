from django.urls import path

from app.api.apiLogin import LoginView
from app.api.apiProcedimientos import ProcedimientosView
from app.api.apiLugar import LugarView
from app.api.apiProfesor import ProfesorView
from app.api.apiEstudiante import EstudianteView
from app.api.apiAutoevaluacion import AutoevaluacionEstudianteView, AutoevaluacionProfesorView
from app.api.apiRetroalimentacion import RetroalimentacionView
from app.api.apiBorradorAutoevaluacion import BorradorAutoevaluacionView
from app.api.apiBorradorRetroalimentacion import BorradorRetroalimentacionDatosView, BorradorRetroalimentacionView
from app.api.apiTablaProcedimientos import TablaProcedimientosEstudianteView, TablaProcedimientosProfesorView
from app.token.refreshToken import CustomRefreshView
from app.api.apiCurvaAprendizaje import CurvaAprendizajeView

urlpatterns = [
    # Login
    path("api/login/", LoginView.as_view(), name="login"),
    # Procedimientos
    path("api/procedimientos/", ProcedimientosView.as_view(), name="procedimientos"),
    # Lugar
    path("api/lugar/", LugarView.as_view(), name="lugar"),
    # Profesor
    path("api/profesor/", ProfesorView.as_view(), name="profesor"),
    # Estudiante
    path("api/estudiante/", EstudianteView.as_view(), name="estudiante"),
    # Autoevaluacion
    path("api/autoevaluacion/estudiante/", AutoevaluacionEstudianteView.as_view(), name="autoevaluacion_estudiante"),
    path("api/autoevaluacion/profesor/", AutoevaluacionProfesorView.as_view(), name="autoevaluacion_profesor"),
    # Retroalimentacion
    path("api/retroalimentacion/", RetroalimentacionView.as_view(), name="retroalimentacion"),
    # BorradorAutoevaluacion
    path("api/borradorautoevaluacion/", BorradorAutoevaluacionView.as_view(), name="borradorautoevaluacion"),
    # BorradorRetroalimentacion
    path("api/borradorretroalimentacion/", BorradorRetroalimentacionView.as_view(), name="borradorretroalimentacion"),
    path("api/borradorretroalimentaciondatos/", BorradorRetroalimentacionDatosView.as_view(), name="borradorretroalimentaciondatos"),
    # Tabla Procediminentos
    path("api/tablaprocedimientos/estudiante/", TablaProcedimientosEstudianteView.as_view(), name="tablaprocedimientos"),
    path("api/tablaprocedimientos/profesor/", TablaProcedimientosProfesorView.as_view(), name="tablaprocedimientos"),
    # Curva Aprendizaje
    path("api/curvaaprendizaje/", CurvaAprendizajeView.as_view(), name="curvaaprendizaje"),
    # Token Refresh
    path('api/token/refresh/', CustomRefreshView.as_view()),
]