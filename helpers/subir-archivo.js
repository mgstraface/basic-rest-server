const path = require('path');

const { v4: uuidv4 } = require('uuid');

const subirArchivo = (
	files,
	extensionesPermitidas = ['jpg', 'webp', 'txt', 'gif', 'png', 'pdf', 'jpeg'],
	carpeta = ''
) => {
	return new Promise((resolve, reject) => {
		const { archivo } = files;
		if (!archivo) {
			return reject(`Debe incluir el nombre "archivo" en el archivo que intenta enviar.`);
		}

		const extension = archivo.name.split('.').pop();

		if (!extensionesPermitidas.includes(extension)) {
			return reject(
				`Los archivos de tipo ${extension} no están permitidos. Las extensiones válidas son: ${extensionesPermitidas}`
			);
		}

		const renombreArchivo = uuidv4() + '.' + extension;

		const uploadPath = path.join(__dirname, '../uploads', carpeta, renombreArchivo);

		archivo.mv(uploadPath, (err) => {
			if (err) return reject(err);

			resolve(renombreArchivo);
		});
	});
};

module.exports = {
	subirArchivo,
};
