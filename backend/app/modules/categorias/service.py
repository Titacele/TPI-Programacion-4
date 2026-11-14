from app.modules.categorias.models import Categoria
from app.modules.categorias.repository import CategoriaRepository
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


# ---------- Excepciones de dominio ----------
class CategoriaNoEncontrada(Exception):
    def __init__(self) -> None:
        super().__init__("Categoría no encontrada")


class NombreDuplicado(Exception):
    def __init__(self) -> None:
        super().__init__("Ya existe una categoría con ese nombre")


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork) -> None:
        self.uow = uow

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.list_activas()]

    def obtener(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            return CategoriaRead.model_validate(self._buscar_activa(uow.categorias, categoria_id))

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.get_by_nombre(data.nombre):
                raise NombreDuplicado()
            categoria = uow.categorias.add(Categoria(**data.model_dump()))
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, categoria_id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = self._buscar_activa(uow.categorias, categoria_id)
            cambios = data.model_dump(exclude_unset=True)
            if cambios.get("nombre") is None:
                cambios.pop("nombre", None)  # el nombre es obligatorio: un null se ignora
            if "nombre" in cambios:
                otra = uow.categorias.get_by_nombre(cambios["nombre"])
                if otra is not None and otra.id != categoria.id:
                    raise NombreDuplicado()
            categoria.sqlmodel_update(cambios)
            uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, categoria_id: int) -> None:
        """Baja lógica: no libera el nombre ni oculta los productos."""
        with self.uow as uow:
            categoria = self._buscar_activa(uow.categorias, categoria_id)
            categoria.activo = False
            uow.categorias.add(categoria)

    @staticmethod
    def _buscar_activa(repo: CategoriaRepository, categoria_id: int) -> Categoria:
        """Una categoría dada de baja se trata como inexistente (404)."""
        categoria = repo.get_by_id(categoria_id)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada()
        return categoria
