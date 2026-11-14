from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# SQLite necesita este parámetro porque FastAPI atiende peticiones en varios hilos.
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)


def _importar_modelos() -> None:
    """Importa todos los modelos para que SQLModel los registre antes de crear las tablas."""
    from app.modules.categorias import models as _categorias  # noqa: F401
    from app.modules.pedidos import models as _pedidos  # noqa: F401
    from app.modules.productos import models as _productos  # noqa: F401
    from app.modules.usuarios import models as _usuarios  # noqa: F401


def create_all_tables() -> None:
    _importar_modelos()
    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    """Crea una sesión nueva. La usa el Unit of Work."""
    return Session(engine)


def get_session() -> Generator[Session, None, None]:
    """Sesión de solo lectura para las dependencias de autenticación (deps.py)."""
    with Session(engine) as session:
        yield session
