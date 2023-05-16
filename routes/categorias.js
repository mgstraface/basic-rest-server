const { Router, response } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarJWT, tieneRole } = require("../middlewares");
const {
	categoriaPost,
	obtenerCategorias,
	obtenerCategoria,
	actualizarCategoria,
	eliminarCategoria,
} = require("../controllers/categoriasController");
const { existeId, existeCategoriaId } = require("../helpers/db-validators");

const router = Router();

//Listar todas las categorías (público)
router.get("/", obtenerCategorias);

//Buscar una categoría por id (público)
router.get(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeCategoriaId),
		validarCampos,
	],
	obtenerCategoria
);

//Crear una categoría (privado, para cualquier role)
router.post(
	"/",
	[
		validarJWT,
		check("nombre", "El nombre de la categoría es requerido").not().isEmpty(),
		validarCampos,
	],
	categoriaPost
);

//Actualizar una categoría (privado, para cualquier role)
router.put(
	"/:id",
	[
		validarJWT,
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeCategoriaId),
		validarCampos,
	],
	actualizarCategoria
);

//Eliminar una categoría (privado, solo admin)
router.delete(
	"/:id",
	[
		validarJWT,
		tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeCategoriaId),
		validarCampos,
	],
	eliminarCategoria
);

module.exports = router;
