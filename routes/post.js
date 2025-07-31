const express = require('express');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const router = express.Router();

const postControl = require('../controllers/post')


// Ajout d'un post //
router.post('/', auth, multer, postControl.createPost);
  
// Changer un post //
router.put('/:id', auth, multer, postControl.modifyPost);
  
// Supprimer un post //
router.delete('/:id', auth, postControl.supprimPost);
  
// Afficher un post //
router.get('/:id', auth, postControl.findOnePost);
  
// Afficher tout les posts //
router.get('/', auth, postControl.findAllPosts);

// Donner un like pour un post //
router.post('/:id/like', auth, postControl.like);

module.exports = router;