"""Carga inicial idempotente: se puede ejecutar varias veces sin duplicar datos.

Uso:  python -m app.db.seed
"""

from sqlmodel import select

from app.core.database import create_all_tables
from app.core.security import hash_password
from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.models import Categoria
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository

USUARIOS = [
    {"username": "admin", "full_name": "Administrador", "email": "admin@foodstore.com",
     "password": "Admin1234!", "role": "admin"},
    {"username": "cliente", "full_name": "Cliente Demo", "email": "cliente@foodstore.com",
     "password": "Cliente1234!", "role": "user"},
]

CATEGORIAS = [
    ("Hamburguesas", "Hamburguesas caseras con papas"),
    ("Pizzas", "Pizzas a la piedra"),
    ("Bebidas", "Gaseosas, aguas y jugos"),
    ("Postres", "Dulces para el final"),
]

# (nombre, descripción, precio, stock, categoría, imagen)
PRODUCTOS = [
    ("Hamburguesa clásica", "Carne, queso, lechuga y tomate", 6500, 30, "Hamburguesas",
     "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"),
    ("Hamburguesa doble cheddar", "Doble carne con cheddar y panceta", 8900, 20, "Hamburguesas",
     "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600"),
    ("Hamburguesa veggie", "Medallón de lentejas y vegetales", 7200, 15, "Hamburguesas",
     "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600"),
    ("Pizza muzzarella", "Salsa de tomate, muzzarella y orégano", 9000, 25, "Pizzas",
     "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600"),
    ("Pizza napolitana", "Muzzarella, tomate en rodajas y ajo", 10500, 18, "Pizzas",
     "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"),
    ("Gaseosa 500 ml", "Línea cola, lima-limón o naranja", 2200, 60, "Bebidas",
     "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600"),
    ("Agua mineral 500 ml", "Con o sin gas", 1600, 60, "Bebidas",
     "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600"),
    ("Flan casero", "Con dulce de leche y crema", 3500, 12, "Postres",
     "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600"),
    ("Brownie", "Brownie de chocolate con nueces", 3200, 10, "Postres",
     "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"),
]


def seed() -> None:
    create_all_tables()

    with UnitOfWork() as uow:
        usuarios = UsuarioRepository(uow.session)
        categorias = CategoriaRepository(uow.session)

        for u in USUARIOS:
            if usuarios.get_by_username(u["username"]) is None:
                usuarios.add(Usuario(
                    username=u["username"], full_name=u["full_name"], email=u["email"],
                    hashed_password=hash_password(u["password"]), role=u["role"],
                ))
                print(f"  + usuario {u['username']}")

        ids_categoria: dict[str, int] = {}
        for nombre, descripcion in CATEGORIAS:
            categoria = categorias.get_by_nombre(nombre)
            if categoria is None:
                categoria = categorias.add(Categoria(nombre=nombre, descripcion=descripcion))
                print(f"  + categoría {nombre}")
            assert categoria.id is not None
            ids_categoria[nombre] = categoria.id

        for nombre, descripcion, precio, stock, cat, imagen in PRODUCTOS:
            existe = uow.session.exec(select(Producto).where(Producto.nombre == nombre)).first()
            if existe is None:
                uow.session.add(Producto(
                    nombre=nombre, descripcion=descripcion, precio_base=precio, stock=stock,
                    categoria_id=ids_categoria[cat], imagen_url=imagen,
                ))
                print(f"  + producto {nombre}")

    print("Seed completo. Admin: admin / Admin1234!  ·  Cliente: cliente / Cliente1234!")


if __name__ == "__main__":
    seed()
