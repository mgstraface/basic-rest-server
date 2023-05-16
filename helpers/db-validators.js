const { Role, Usuario, Categoria, Producto } = require('../models');

const esRoleValido = async (role = '') => {
	const existeRole = await Role.findOne({ role });
	if (!existeRole) {
		throw new Error(`El role ${role} no está registrado en la base de datos`);
	}
};

const existeEmail = async (correo = '') => {
	const usuario = await Usuario.findOne({ correo });
	if (usuario) {
		throw new Error(`El correo ${correo} ya se encuentra registrado`);
	}
};

const existeId = async (id) => {
	const usuario = await Usuario.findById(id);
	if (!usuario) {
		throw new Error(`El id ${id} no existe en la base de datos`);
	}
};

const existeCategoriaId = async (id) => {
	const categoria = await Categoria.findById(id);
	if (!categoria) {
		throw new Error(`El id ${id} no existe en la base de datos`);
	}
};

const existeProductoId = async (id) => {
	const producto = await Producto.findById(id);
	if (!producto) {
		throw new Error(`El id ${id} no existe en la base de datos`);
	}
};

module.exports = {
	esRoleValido,
	existeEmail,
	existeId,
	existeCategoriaId,
	existeProductoId,
};
