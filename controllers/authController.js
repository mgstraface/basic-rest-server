const { response, json } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google.verify");

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

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const { correo, nombre, img } = await googleVerify(id_token);

		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			// Tengo que crearlo
			const data = {
				nombre,
				correo,
				password: ":P",
				img,
				google: true,
				role: "USER_ROLE",
			};

			usuario = new Usuario(data);
			await usuario.save();
		}

		// Si el usuario en DB
		if (!usuario.estado) {
			return res.status(401).json({
				msg: "Hable con el administrador, usuario bloqueado",
			});
		}

		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		res.status(400).json({
			error,
		});
	}
};

module.exports = {
	login,
	googleSignIn,
};
