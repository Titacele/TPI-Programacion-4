from datetime import datetime


def ahora() -> datetime:
    """Fecha y hora actual del servidor (sin zona horaria), igual en SQLite y PostgreSQL."""
    return datetime.now().replace(microsecond=0)
