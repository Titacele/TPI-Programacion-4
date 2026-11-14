from collections.abc import Callable
from types import TracebackType
from typing import Self

from sqlmodel import Session

from app.core.database import session_factory


class UnitOfWork:
    """Abre la sesión en __enter__ y decide commit o rollback en __exit__.

    Cada módulo hereda de esta clase y crea sus repositorios en _crear_repositorios,
    todos sobre la misma sesión: por eso las operaciones del bloque `with` son una
    sola transacción.
    """

    def __init__(self, factory: Callable[[], Session] = session_factory) -> None:
        self._factory = factory
        self.session: Session

    def __enter__(self) -> Self:
        self.session = self._factory()
        self._crear_repositorios()
        return self

    def _crear_repositorios(self) -> None:
        """Las subclases instancian aquí sus repositorios."""

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()
        # No devolvemos True: la excepción sigue su camino hasta el Router.
