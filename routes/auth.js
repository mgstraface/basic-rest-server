const { Router } = require("express");
const { check } = require("express-validator");
const login = require("../controllers/authController");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
	"/login",
	[
		check("correo", "Ingrese un correo válido para iniciar sesión").isEmail(),
		check("password", "Debes ingresar una contraseña para iniciar sesión").not().isEmpty(),
		validarCampos,
	],
	login
);

module.exports = router;
