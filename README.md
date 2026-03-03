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
npm install -D tailwindcss@3 postcss autoprefixer
npm install @tanstack/react-query
npm install @radix-ui/react-tooltip
npm install next-themes sonner
npm install @radix-ui/react-toast
npm install clsx tailwind-merge
npm install class-variance-authority

# Iniciar entorno de desarrollo
npm run dev
```