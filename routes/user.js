const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require("../middlewares");

const { esRoleValido, existeEmail, existeId } = require("../helpers/db-validators");

const {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosReactivar,
} = require("../controllers/userController");

const router = Router();
router.get("/", usuariosGet);

router.put(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeId),
		check("role").custom(esRoleValido),
		validarCampos,
	],
	usuariosPut
);

router.post(
	"/",
	[
		check("correo", "Intente nuevamente con un correo válido.").isEmail(),
		check("correo").custom(existeEmail),
		check("nombre", "El nombre es requerido").not().isEmpty(),
		check("password", "El password es requerido y debe contener más de 6 caracteres").isLength({
			min: 6,
		}),
		//check("role", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),

		check("role").custom(esRoleValido),
		validarCampos,
	],

	usuariosPost
);

router.delete(
	"/:id",
	[
		validarJWT,
		//esAdminRole,
		tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeId),
		validarCampos,
	],
	usuariosDelete
);

router.put(
	"/reactivar/:id",
	[check("id", "No es un ID válido").isMongoId(), check("id").custom(existeId), validarCampos],
	usuariosReactivar
);

module.exports = router;
