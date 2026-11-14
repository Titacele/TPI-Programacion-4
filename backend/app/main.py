from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_all_tables
from app.modules.auth.router import router as auth_router
from app.modules.categorias.router import router as categorias_router
from app.modules.pedidos.router import router as pedidos_router
from app.modules.productos.router import router as productos_router
from app.modules.usuarios.router import router as usuarios_router

from pathlib import Path
from fastapi.responses import FileResponse

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    create_all_tables()  # crea las tablas que falten al arrancar
    yield


app = FastAPI(
    title="Food Store API",
    description="TPI Programación 4 — sistema de pedidos de comida",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS con credenciales: el navegador solo envía la cookie si el origen está
# permitido explícitamente (con credenciales no se puede usar "*").
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ICON_PATH = Path(__file__).resolve().parents[1] / "static" / "apple-touch-icon.png"

@app.get("/apple-touch-icon.png", include_in_schema=False)
@app.get("/apple-touch-icon-precomposed.png", include_in_schema=False)
def apple_touch_icon() -> FileResponse:
    return FileResponse(ICON_PATH, media_type="image/png")

for router in (auth_router, usuarios_router, categorias_router, productos_router, pedidos_router):
    app.include_router(router, prefix=API_PREFIX)


@app.get("/", tags=["Salud"])
def root() -> dict[str, str]:
    return {"message": "Food Store API", "docs": "/docs"}
