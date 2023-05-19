const { Schema, model } = require('mongoose');

const productoSchema = Schema({
	nombre: { type: String, unique: true, required: [true, 'El nombre es obligatorio'] },
	estado: { type: Boolean, default: true, required: [true, 'El estado es requerido'] },
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true,
	},
	precio: {
		type: Number,
		default: 0,
	},
	categoria: {
		type: Schema.Types.ObjectId,
		ref: 'Categoria',
		required: true,
	},

	descripcion: {
		type: String,
	},

	disponible: { type: Boolean, default: true },
	img: { type: String },
});
productoSchema.methods.toJSON = function () {
	const { __v, estado, ...data } = this.toObject();

	return data;
};
module.exports = model('Producto', productoSchema);
