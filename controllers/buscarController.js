const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = ['usuarios', 'productos', 'categorias', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.json({
			results: usuario ? [usuario] : [],
		});
	}

	const regex = new RegExp(termino, 'i');

	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments({
			$or: [{ nombre: regex }, { correo: regex }],
			$and: [{ estado: true }],
		}),

		Usuario.find({
			$or: [{ nombre: regex }, { correo: regex }],
			$and: [{ estado: true }],
		}),
	]);
	return res.json({
		results: total,
		usuarios,
	});
};

const buscarCategorias = async (termino = '', res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const categorias = await Categoria.findById(termino);
		return res.json({
			results: categorias ? [categorias] : [],
		});
	}

	const regex = new RegExp(termino, 'i');

	const [total, categorias] = await Promise.all([
		Categoria.countDocuments({
			$or: [{ nombre: regex }],
			$and: [{ estado: true }],
		}),

		Categoria.find({
			$or: [{ nombre: regex }],
			$and: [{ estado: true }],
		}),
	]);
	return res.json({
		results: total,
		categorias,
	});
};

const buscarProductos = async (termino = '', res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const [productoPorId, productosPorCategoria] = await Promise.all([
			Producto.findById(termino)
				.populate({ path: 'usuario', select: 'nombre' })
				.populate({ path: 'categoria', select: 'nombre' }),
			Producto.find({ categoria: termino })
				.populate({ path: 'usuario', select: 'nombre' })
				.populate({ path: 'categoria', select: 'nombre' }),
		]);

		return res.json({
			results: productoPorId ? [productoPorId] : productosPorCategoria,
		});
	}

	const regex = new RegExp(termino, 'i');

	const [total, productos] = await Promise.all([
		Producto.countDocuments({
			$or: [{ nombre: regex }, { descripcion: regex }],
			$and: [{ estado: true }],
		}),

		Producto.find({
			$or: [{ nombre: regex }, { descripcion: regex }],
			$and: [{ estado: true }],
		})
			.populate({ path: 'usuario', select: 'nombre' })
			.populate({ path: 'categoria', select: 'nombre' }),
	]);
	return res.json({
		results: total,
		productos,
	});
};
const buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `La colección solicitada no existe en la BD. Las permitidas son: ${coleccionesPermitidas}`,
		});
	}

	switch (coleccion) {
		case 'usuarios':
			buscarUsuarios(termino, res);
			break;
		case 'categorias':
			buscarCategorias(termino, res);
			break;
		case 'productos':
			buscarProductos(termino, res);
			break;

		default:
			res.status(500).json({
				msg: 'Caso de búsqueda no evaluado.',
			});
	}
};

module.exports = {
	buscar,
};
