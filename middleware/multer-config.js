const multer = require('multer');

//  Dictionnaire pour les différents types d'image  //
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//  Gestion des fichiers images dans le répertoire 'images'  //
const storage = multer.diskStorage({

  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }

})



module.exports = multer({storage: storage}).single('fileImage');