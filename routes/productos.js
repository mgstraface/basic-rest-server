const { Router, response } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const {
	productoPost,
	obtenerProductos,
	obtenerProducto,
	actualizarProducto,
	eliminarProducto,
} = require('../controllers/productosController');
const { existeProductoId, existeCategoriaId } = require('../helpers/db-validators');

const router = Router();

//Listar todas las categorías (público)
router.get('/', obtenerProductos);

//Buscar una categoría por id (público)
router.get(
	'/:id',
	[
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existeProductoId),
		validarCampos,
	],
	obtenerProducto
);

//Crear una categoría (privado, para cualquier role)
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre del producto es requerido').not().isEmpty(),
		check('categoria', 'No es un id de mongo válido').isMongoId(),
		check('categoria').custom(existeCategoriaId),
		validarCampos,
	],
	productoPost
);

//Actualizar una categoría (privado, para cualquier role)
router.put(
	'/:id',
	[
		validarJWT,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existeProductoId),
		validarCampos,
	],
	actualizarProducto
);

//Eliminar una categoría (privado, solo admin)
router.delete(
	'/:id',
	[
		validarJWT,
		tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existeProductoId),
		validarCampos,
	],
	eliminarProducto
);

module.exports = router;
