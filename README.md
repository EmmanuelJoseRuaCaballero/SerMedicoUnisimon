# E-Portafolio Clínico – Universidad

Aplicación web full-stack para gestión de portafolios clínicos.

Frontend: React + Vite + TypeScript  
Backend: Django + Django REST Framework + PostgreSQL

---

# Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

Python 3.14+  
Node.js 24+  
npm

Verifica las versiones:

```bash
python --version
node --version
npm --version
```

python -m venv venv

venv\Scripts\activate

pip install django
pip install djangorestframework
pip install django-cors-headers
pip install psycopg2-binary

python manage.py makemigrations
python manage.py migrate

python manage.py runserver

npm install

npm install react react-dom react-router-dom
npm install axios
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer

npm run dev

E-Portafolio Clínico – Universidad

Aplicación web **full-stack** diseñada para la gestión integral de portafolios clínicos universitarios, permitiendo el seguimiento de prácticas, casos clínicos y competencias académicas.

---

## Stack Tecnológico

* **Frontend:** React + Vite + TypeScript
* **Backend:** Django + Django REST Framework (DRF)
* **Base de Datos:** PostgreSQL
* **Estilos:** Tailwind CSS + Lucide React (iconografía)

---

## Requisitos Previos

Antes de comenzar, verifica que tienes instalado:
* **Python:** 3.14 o superior
* **Node.js:** 24 o superior
* **npm:** Incluido con Node.js

```bash
# Verificar versiones
python --version
node --version
npm --version

# Crear entorno virtual
python -m venv venv

# Activar entorno
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install django djangorestframework django-cors-headers psycopg2-binary

# Configurar Base de Datos
python manage.py makemigrations
python manage.py migrate

# Iniciar servidor
python manage.py runserver

# Instalar dependencias base
npm install

# Instalar librerías adicionales
npm install react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer

# Iniciar entorno de desarrollo
npm run dev