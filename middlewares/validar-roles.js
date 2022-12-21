const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
	if (!req.usuario) {
		return res.status(500).json({
			msg: "Se está intentando verificar el role sin validar el token primero.",
		});
	}

	const { role, nombre } = req.usuario;

	if (role !== "ADMIN_ROLE") {
		return res.status(401).json({
			msg: `El usuario ${nombre}, no tiene los permisos necesarios para ejecutar esta acción.`,
		});
	}
	next();
};

const tieneRole = (...roles) => {
	return (req, res = response, next) => {
		if (!req.usuario) {
			return res.status(500).json({
				msg: "Se está intentando verificar el role sin validar el token primero.",
			});
		}

		if (!roles.includes(req.usuario.role)) {
			return res
				.status(401)
				.json({ msg: `Role de usuario no autorizado. El role debe ser uno de estos: ${roles}` });
		}

		next();
	};
};

module.exports = {
	esAdminRole,
	tieneRole,
};
