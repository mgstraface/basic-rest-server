const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
let validaRoles = require("../middlewares/validar-roles");

module.exports = {
	...validarCampos,
	...validarJWT,
	...validaRoles,
};
