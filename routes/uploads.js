const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');
const {
	cargarArchivo,
	actualizarImagenCloudinary,
	mostrarImagen,
} = require('../controllers/uploads.js');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put(
	'/:coleccion/:id',
	[
		validarArchivoSubir,
		check('id', 'El id debe ser un id de Mongo').isMongoId(),
		check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
		validarCampos,
	],
	actualizarImagenCloudinary
);

router.get(
	'/:coleccion/:id',
	[
		check('id', 'El id debe ser un id de Mongo').isMongoId(),
		check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
		validarCampos,
	],
	mostrarImagen
);

module.exports = router;
