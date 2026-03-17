from django.urls import path

from app.api.apiLogin import LoginView
from app.api.apiProcedimientos import ProcedimientosView
from app.api.apiLugar import LugarView
from app.api.apiProfesor import ProfesorView
from app.api.apiAutoevaluacion import AutoevaluacionEstudianteView, AutoevaluacionProfesorView
from app.api.apiRetroalimentacion import RetroalimentacionView
from app.api.apiBorradorAutoevaluacion import BorradorAutoevaluacionView
from app.api.apiBorradorRetroalimentacion import BorradorRetroalimentacionView


urlpatterns = [
    # Login
    path("api/login/", LoginView.as_view(), name="login"),
    # Procedimientos
    path("api/procedimientos/", ProcedimientosView.as_view(), name="procedimientos"),
    # Lugar
    path("api/lugar/", LugarView.as_view(), name="lugar"),
    # Profesor
    path("api/profesor/", ProfesorView.as_view(), name="profesor"),
    # Autoevaluacion
    path("api/autoevaluacion/estudiante/<int:cedula>/", AutoevaluacionEstudianteView.as_view(), name="autoevaluacion_estudiante"),
    path("api/autoevaluacion/profesor/<int:cedula>/", AutoevaluacionProfesorView.as_view(), name="autoevaluacion_profesor"),
    # Retroalimentacion
    path("api/retroalimentacion/", RetroalimentacionView.as_view(), name="retroalimentacion"),
    # BorradorAutoevaluacion
    path("api/borradorautoevaluacion/<int:cedula>/", BorradorAutoevaluacionView.as_view(), name="borradorautoevaluacion"),
    # BorradorRetroalimentacion
    path("api/borradorretroalimentacion/", BorradorRetroalimentacionView.as_view(), name="borradorretroalimentacion"),

]