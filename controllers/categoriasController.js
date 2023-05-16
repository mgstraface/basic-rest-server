const { response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async (req, res = response) => {
	const { desde = 0, limit = 5 } = req.query;
	const queryEstado = { estado: true };

	const [total, categorias] = await Promise.all([
		Categoria.countDocuments(queryEstado),
		Categoria.find(queryEstado)
			.limit(Number(limit))
			.skip(Number(desde))
			.populate("usuario", "nombre"),
	]);

	res.json({
		total,
		categorias,
	});
};

const obtenerCategoria = async (req, res = response) => {
	try {
		const id = req.params.id;

		const categoria = await Categoria.findById(id).populate("usuario", "nombre");

		res.status(201).json(categoria);
	} catch (error) {
		console.log(error);
	}
};

const categoriaPost = async (req, res = response) => {
	const nombre = req.body.nombre.toUpperCase();

	const categoriaDB = await Categoria.findOne({ nombre });

	if (categoriaDB) {
		return res.status(400).json({ msg: `La categoría ${categoriaDB.nombre} ya existe.` });
	}

	const data = {
		nombre,
		usuario: req.usuario._id,
	};

	const categoria = new Categoria(data);

	//Guardar en db
	await categoria.save();

	res.status(201).json({
		msg: "Categoría creada con éxito",
		categoria,
	});
};

const actualizarCategoria = async (req, res = response) => {
	try {
		const { id } = req.params;
		const { estado, usuario, ...data } = req.body;

		data.nombre = data.nombre.toUpperCase();
		data.usuario = req.usuario._id;

		if (!data.nombre) {
			return res.status(400).json({
				msg: "Debe ingresar un nuevo nombre para la categoría",
			});
		}

		const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }).populate(
			"usuario",
			"nombre"
		);

		res.status(201).json({
			msg: "Categoría actualizada correctamente",
			categoria,
		});
	} catch (error) {
		console.log(error);
	}
};

const eliminarCategoria = async (req, res = response) => {
	const { id } = req.params;

	//Borrado físico
	//const usuario = await Usuario.findByIdAndDelete(id)

	const categoria = await Categoria.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	).populate("usuario", "nombre");

	res.json({
		msg: "Categoría eliminada con éxito",
		categoria,
	});
};

module.exports = {
	obtenerCategorias,
	obtenerCategoria,
	categoriaPost,
	actualizarCategoria,
	eliminarCategoria,
};
