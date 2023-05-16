const { Schema, model } = require('mongoose');

const categoriaSchema = Schema({
	nombre: { type: String, unique: true, required: [true, 'El nombre es obligatorio'] },
	estado: { type: Boolean, default: true, required: [true, 'El estado es requerido'] },
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: [true, 'El usuario es requerido'],
	},
});
categoriaSchema.methods.toJSON = function () {
	const { __v, estado, ...data } = this.toObject();

	return data;
};
module.exports = model('Categoria', categoriaSchema);
