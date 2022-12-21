const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
	const { correo, password } = req.body;

	try {
		//Verificar si existe el e-mail
		const usuario = await Usuario.findOne({ correo });
		if (!usuario) {
			return res.status(400).json({
				msg: `El correo ${correo} no está registrado.`,
			});
		}

		//Verificar si el usuario está activo
		if (usuario.estado === false) {
			return res.status(400).json({
				msg: `El usuario no se encuentra activo.`,
			});
		}

		//Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				msg: "La contraseña no coincide.",
			});
		}

		//Generar el JWT

		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Comuníquese con el administrador.",
		});
	}
};

module.exports = login;
