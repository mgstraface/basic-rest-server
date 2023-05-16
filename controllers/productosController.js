const { response } = require('express');
const { Producto } = require('../models');

const obtenerProductos = async (req, res = response) => {
	const { desde = 0, limit = 5 } = req.query;
	const queryEstado = { estado: true };

	const [total, productos] = await Promise.all([
		Producto.countDocuments(queryEstado),
		Producto.find(queryEstado)
			.limit(Number(limit))
			.skip(Number(desde))
			.populate('usuario', 'nombre')
			.populate('categoria', 'nombre'),
	]);

	res.json({
		total,
		productos,
	});
};

const obtenerProducto = async (req, res = response) => {
	try {
		const id = req.params.id;

		const producto = await Producto.findById(id)
			.populate('usuario', 'nombre')
			.populate('categoria', 'nombre');

		res.status(201).json(producto);
	} catch (error) {
		console.log(error);
	}
};

const productoPost = async (req, res = response) => {
	const { estado, usuario, ...body } = req.body;

	const productoDB = await Producto.findOne({ nombre: body.nombre });

	if (productoDB) {
		return res.status(400).json({ msg: `El producto ${productoDB.nombre} ya existe.` });
	}
	try {
		const data = {
			...body,
			nombre: body.nombre.toUpperCase(),
			usuario: req.usuario._id,
		};

		const producto = new Producto(data);

		//Guardar en db
		await producto.save();

		res.status(201).json({
			msg: 'Producto creado con éxito',
			producto,
		});
	} catch (error) {
		console.log(error);
	}
};

const actualizarProducto = async (req, res = response) => {
	try {
		const { id } = req.params;
		const { estado, usuario, ...data } = req.body;

		if (data.nombre) {
			data.nombre = data.nombre.toUpperCase();
		}
		data.usuario = req.usuario._id;

		const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
			.populate('usuario', 'nombre')
			.populate('categoria', 'nombre');

		res.status(201).json({
			msg: 'Producto actualizado correctamente',
			producto,
		});
	} catch (error) {
		console.log(error);
	}
};

const eliminarProducto = async (req, res = response) => {
	const { id } = req.params;

	//Borrado físico
	//const usuario = await Usuario.findByIdAndDelete(id)

	const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true }).populate(
		'usuario',
		'nombre'
	);

	res.json({
		msg: 'Producto eliminado con éxito',
		producto,
	});
};

module.exports = {
	obtenerProductos,
	obtenerProducto,
	productoPost,
	actualizarProducto,
	eliminarProducto,
};
