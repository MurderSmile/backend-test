const Post = require("../models/post");
const fs = require("fs");
const { json } = require("express");

// Vérification d'un répertoire Images //
if (!fs.existsSync("Images")) {
  fs.mkdirSync("Images");
}

//  Ajout d'un nouveau post  //
exports.createPost = (req, res, next) => {
  try {
    const postObject =
      //  Ajout AVEC Image  //
      req.file
        ? {
            ...req.body,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : //  Ajout SANS Image  //
          {
            ...req.body,
          };

    delete postObject._id;
    delete postObject._userId;

    const post = new Post({
      ...postObject,
      userId: req.auth.userId,
    });

    post
      .save()
      .then(() => res.status(201).json({ message: "Objet enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    res.status(501).json({ message: "format incorrect" });
  }
};

//  Changer un post  //
exports.modifyPost = (req, res, next) => {
  const postObject =
    //  Modification AVEC Image  //
    req.file
      ? {
          ...req.body,
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : //  Modification SANS Image  //
        {
          ...req.body,
        };

  delete postObject._userId;

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      //  Vérification que l'utilisateur est propriétaire du Post ou qu'il est administrateur  //
      if (post.userId != req.auth.userId && !req.body.admin) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        if (req.file && post.imageUrl) {
          const filename = post.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            Post.updateOne(
              { _id: req.params.id },
              { ...postObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Post modifié!" }))
              .catch((error) => res.status(401).json({ error }));
          });
        } else {
          Post.updateOne(
            { _id: req.params.id },
            { ...postObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Post modifié!" }))
            .catch((error) => res.status(401).json({ error }));
        }
      }
    })

    .catch((error) => {
      res.status(400).json({ error });
    });
};

//  Supprimer un post  //
exports.supprimPost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      //  Vérification que l'utilisateur est propriétaire du Post ou qu'il est administrateur  //
      if (post.userId != req.auth.userId && !req.body.admin) {
        res.status(401).json({ message: "Not authorized" });
      } else if (post.imageUrl) {
        const filename = post.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Post supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      } else {
        Post.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Post supprimé !" });
          })
          .catch((error) => res.status(401).json({ error }));
      }
    })

    .catch((error) => {
      res.status(500).json({ error });
    });
};

//  Afficher un post  //
exports.findOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

//  Afficher tout les posts  //
exports.findAllPosts = (req, res, next) => {
  Post.find()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

//  Donner son opinion sur un post  //
exports.like = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      //  Si l'utilisateur veut liker  //
      if (
        post.usersLiked.indexOf(req.auth.userId) == -1 &&
        req.body.like == 1
      ) {
        post.usersLiked.push(req.auth.userId);
        post.likes += 1;
      }

      //  Si l'utilisateur veut annuler son "like"  //
      if (
        post.usersLiked.indexOf(req.auth.userId) != -1 &&
        req.body.like == 0
      ) {
        const likesUserIndex = post.usersLiked.findIndex(
          (user) => user === req.auth.userId
        );
        post.usersLiked.splice(likesUserIndex, 1);
        post.likes -= 1;
      }

      post.save();
      res.status(201).json({ message: "Like / Dislike mis à jour" });
    })

    .catch((error) => res.status(500).json({ error }));
};
