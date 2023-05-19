const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

//SUBIR UN NUEVO ARCHIVO. Puede ser una imagen como cualquier otra extensión. En caso de no ser una imagen, hay que pasar un array en el 2do parametro con los formatos

const cargarArchivo = async (req, res = response) => {
	try {
		const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');

		res.json({ msg: `El archivo ${nombreArchivo} se subió correctamente` });
	} catch (error) {
		res.status(400).json({ error });
	}
};

// ACTUALIZAR IMAGEN. Debe recibir la colección (usuarios, productos), y el id del elemento a modificar.
const actualizarImagen = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({ msg: `El id ${id} no corresponde a un usuario registrado.` });
			}
			break;
		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `El id ${id} no corresponde a un producto registrado.` });
			}
			break;

		default:
			return res.status(500).json({ msg: 'La concha del pato' });
			break;
	}
	try {
		// Limpiar imágenes previas

		if (modelo.img) {
			//primero tengo que borrar la imágen física del servidor
			const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
			fs.existsSync(pathImagen) && fs.unlinkSync(pathImagen);
		}

		const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
		modelo.img = nombreArchivo;

		await modelo.save();

		res.json({ modelo });
	} catch (error) {
		res.status(400).json({ error });
	}
};

// MOSTRAR IMAGEN. Debe recibir la colección y el id para buscar en la db y poder servir la imágen a quien la solicite.

const mostrarImagen = async (req, res = response) => {
	const { id, coleccion } = req.params;
	let modelo;

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({ msg: `El id ${id} no corresponde a un usuario registrado.` });
			}
			break;
		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `El id ${id} no corresponde a un producto registrado.` });
			}
			break;

		default:
			return res
				.status(500)
				.json({ msg: 'Error en el servidor, estamos trabajando para solucionarlo.' });
			break;
	}

	//armar el path y devolver la imagen
	if (modelo.img) {
		const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
		if (fs.existsSync(pathImagen)) {
			return res.sendFile(pathImagen);
		}
	}
	const pathPlaceHolder = path.join(__dirname, '../assets/noimage-220518-150756.jpg');
	return res.sendFile(pathPlaceHolder);
};

const actualizarImagenCloudinary = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({ msg: `El id ${id} no corresponde a un usuario registrado.` });
			}
			break;
		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `El id ${id} no corresponde a un producto registrado.` });
			}
			break;

		default:
			return res
				.status(500)
				.json({
					msg: 'Ha ocurrido un error en el servidor, estamos trabajando para solucionarlo.',
				});
	}
	try {
		// Limpiar imágenes previas

		if (modelo.img) {
			const idImagenArr = modelo.img.split('/');
			const idImagen = idImagenArr[idImagenArr.length - 1].split('.')[0];

			cloudinary.uploader.destroy(idImagen);
		}
		const { tempFilePath } = req.files.archivo;
		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		modelo.img = secure_url;

		await modelo.save();

		res.json({ msg: 'Imágen actualizada correctamente', modelo });
	} catch (error) {
		res.status(400).json({ error });
	}
};

module.exports = { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary };
