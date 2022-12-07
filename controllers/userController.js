const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
	const { desde = 0, limit = 5 } = req.query;
	const queryEstado = { estado: true };

	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(queryEstado),
		Usuario.find(queryEstado).limit(Number(limit)).skip(Number(desde)),
	]);

	res.json({
		total,
		usuarios,
	});
};

const usuariosPut = async (req, res = response) => {
	const id = req.params.id;
	const { _id, password, google, correo, ...resto } = req.body;

	//TODO validar contra base de datos

	if (password) {
		//Encriptar la contraseña
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json({
		msg: "Datos actualizados correctamente",
		usuario,
	});
};

const usuariosPost = async (req, res = response) => {
	const { nombre, correo, password, role } = req.body;
	const usuario = new Usuario({ nombre, correo, password, role });

	//Encriptar la contraseña
	const salt = bcryptjs.genSaltSync();
	usuario.password = bcryptjs.hashSync(password, salt);

	//Guardar en db
	await usuario.save();

	res.status(201).json({
		usuario,
	});
};

const usuariosDelete = async (req, res = response) => {
	const { id } = req.params;

	//Borrado físico
	//const usuario = await Usuario.findByIdAndDelete(id)

	await Usuario.findByIdAndUpdate(id, { estado: false });

	res.json({
		msg: "Usuario eliminado con éxito",
	});
};

const usuariosReactivar = async (req, res = response) => {
	const { id } = req.params;

	//Borrado físico
	//const usuario = await Usuario.findByIdAndDelete(id)

	await Usuario.findByIdAndUpdate(id, { estado: true });

	res.json({
		msg: "Cuenta reactivada con éxito",
	});
};

module.exports = {
	usuariosGet,
	usuariosDelete,
	usuariosPost,
	usuariosPut,
	usuariosReactivar,
};
