const { response } = require("express");

const usuariosGet = (req, res = response) => {
	const { nombre, hola, page, limit = "10" } = req.query;
	res.json({
		msg: "get API controller",
		nombre,
		hola,
		page,
		limit,
	});
};

const usuariosPut = (req, res = response) => {
	const id = req.params.id;

	res.json({
		msg: "put API controller",
		id,
	});
};

const usuariosPost = (req, res = response) => {
	let msgBody = req.body;
	res.status(201).json({
		msg: "post API controller",
		msgBody,
	});
};

const usuariosDelete = (req, res = response) => {
	res.json({
		msg: "delete API controller",
	});
};

module.exports = {
	usuariosGet,
	usuariosDelete,
	usuariosPost,
	usuariosPut,
};
