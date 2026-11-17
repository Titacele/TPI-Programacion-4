# Food Store

Trabajo Práctico Integrador — **Programación 4** (Tecnicatura Universitaria en Programación a Distancia, UTN).

Sistema de pedidos de comida: los clientes recorren el catálogo, arman un carrito y confirman un pedido; el administrador gestiona categorías, productos, stock, pedidos y usuarios.

- **Alumna:** María Celeste Reinaudo
- **Repositorio:** https://github.com/Titacele/TPI-Programacion-4
- **Video de demostración:** https://youtu.be/JO_v6BhDwkQ
---

## Stack

| Capa | Tecnologías |
|---|---|
| Backend | Python 3.12, FastAPI 0.115, SQLModel 0.0.22, PostgreSQL (o SQLite en desarrollo), JWT en cookie HttpOnly, Passlib + bcrypt |
| Frontend | React 19, TypeScript 5.9 (`strict`), Vite 7, Tailwind CSS 4, TanStack Query / Form / Table, React Router 7, Zustand 5, Axios |

Arquitectura del backend: módulos por dominio con la cadena **Router → Service → Unit of Work → Repository → Model**.
Arquitectura del frontend: organizada **por features** (`auth`, `categorias`, `productos`, `usuarios`, `pedidos`) más `shared/`, `store/` y `routes/`.

---

## Requisitos

- **Python 3.11, 3.12 o 3.13** (SQLModel 0.0.22 no funciona con 3.14)
- **Node.js 20.19** o superior
- **pnpm 9** o superior (`npm install -g pnpm`)
- **PostgreSQL 15+** (opcional: para desarrollo se puede usar SQLite sin instalar nada)

---

## 1. Backend

```bash
cd backend

# Entorno virtual
python3.12 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Dependencias
pip install -r requirements.txt

# Variables de entorno
cp .env.example .env              # Windows: copy .env.example .env
```

Editar `backend/.env` si hace falta (ver tabla de variables). Para usar **SQLite** sin instalar PostgreSQL, cambiar la línea:

```
DATABASE_URL=sqlite:///./foodstore.db
```

Con **PostgreSQL**, crear primero la base: `createdb foodstore_db` y dejar la URL con tu usuario y contraseña.

```bash
# Carga inicial (idempotente: se puede ejecutar varias veces)
python -m app.db.seed

# Levantar la API
uvicorn app.main:app --reload
```

- API: http://localhost:8000/api/v1
- Documentación interactiva: http://localhost:8000/docs (también `/redoc`)

### Variables de entorno del backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a la base | `postgresql://user:pass@localhost:5432/foodstore_db` o `sqlite:///./foodstore.db` |
| `SECRET_KEY` | Clave de firma del JWT (mínimo 32 caracteres) | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token y de la cookie | `30` |
| `FRONTEND_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |
| `COOKIE_SECURE` | `true` solo si el backend se sirve por HTTPS | `false` |

---

## 2. Frontend

En otra terminal, con el backend corriendo:

```bash
cd frontend
cp .env.example .env              # Windows: copy .env.example .env
pnpm install
pnpm build                        # verifica los tipos y compila
pnpm dev
```

Abrir **http://localhost:5173** (usar `localhost`, no `127.0.0.1`, para que coincida con `FRONTEND_ORIGIN` y la cookie de sesión viaje correctamente).

### Variables de entorno del frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api/v1` |

---

## Usuarios del seed

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `Admin1234!` |
| Cliente de prueba | `cliente` | `Cliente1234!` |

El seed también crea 4 categorías (Hamburguesas, Pizzas, Bebidas, Postres) y 9 productos con stock.

---

## Funcionalidades

**Cliente**
- Registro e inicio de sesión (TanStack Form con validación).
- Catálogo paginado en el servidor, con búsqueda por nombre, filtro por categoría, skeleton de carga y estado vacío.
- Carrito persistido en el navegador (sobrevive a la recarga).
- Checkout con dirección, forma de pago (efectivo o transferencia) y notas.
- «Mis pedidos»: listado, detalle y cancelación mientras el pedido está `PENDIENTE`.

**Administrador** (`/admin`)
- Resumen con tarjetas: pendientes, en preparación, entregados, cancelados, pedidos de hoy e ingresos.
- ABM de categorías y productos con TanStack Table y TanStack Form; cambio de stock y disponibilidad.
- Gestión de pedidos con filtro por estado y botones según la máquina de estados.
- Gestión de usuarios: activar y desactivar (no puede desactivarse a sí mismo).

**Reglas de negocio**
- RN-01: el pedido se crea en una sola transacción (Unit of Work); si un ítem falla, no se guarda nada ni se descuenta stock.
- RN-02: transiciones válidas `PENDIENTE → EN_PREPARACION | CANCELADO`, `EN_PREPARACION → ENTREGADO | CANCELADO`.
- RN-03: cancelar restituye el stock en la misma transacción.
- RN-04: el cliente solo ve y cancela sus pedidos; el admin ve todos.
- RN-05: líneas y total inmutables (se copian nombre y precio del producto).
- RN-06: forma de pago y dirección validadas en el schema.

**Seguridad**
- El JWT viaja solo en una cookie **HttpOnly**: el frontend nunca lo lee ni lo guarda.
- Axios con `withCredentials` e interceptor que limpia la sesión ante 401 o cuenta desactivada.
- Rutas protegidas por sesión y por rol en el frontend; la protección real está en `require_role` del backend.

---

## Estructura

```
food-store/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI, CORS con credenciales, routers bajo /api/v1
│   │   ├── core/                # config, database, security, deps, unit_of_work, base_repository
│   │   ├── db/seed.py           # carga inicial idempotente
│   │   └── modules/             # auth, usuarios, categorias, productos, pedidos
│   │       └── <modulo>/        # models, schemas, repository, unit_of_work, service, router
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── shared/              # api (axios, errores, queryClient), ui, components, layout
    │   ├── features/            # auth, categorias, productos, usuarios, pedidos
    │   │   └── <feature>/       # pages, components, hooks, api, types
    │   ├── store/               # authStore, cartStore (Zustand + persist)
    │   ├── routes/              # AppRouter, ProtectedRoute
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── .env.example
```
