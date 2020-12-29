const Sauce = require('../models/Sauce');

const fs = require('fs');

exports.createSauce = (req, res, next) => {
  console.log('sauce créée')
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  const paramId =  req.params.id
    Sauce.findOne({ _id: paramId })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  console.log('sauce modifiée')
  const paramId =  req.params.id
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: paramId }, { ...sauceObject, _id: paramId })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  console.log('sauce supprimée')
  const paramId =  req.params.id
  Sauce.findOne({ _id: paramId })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: paramId })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const paramId =  req.params.id
  const likeUser = req.body.userId
  const sauceLike = req.body.like

// Mettre le like à 1

if (sauceLike === 1) {
console.log('like ajouté')
  Sauce.updateOne(
    { _id: paramId },{
      $inc: { likes: 1 },
      $push: { usersLiked: likeUser },
      _id: paramId,})
       .then(() => {res.status(200).json({ message: 'Like ajouté' })})
       .catch((error) => {res.status(400).json({ error })});

      }  
// Mettre le dislike à 1

if (sauceLike === -1) {
  console.log('dislike ajouté')
  Sauce.updateOne(
    { _id: paramId },{
      $inc: { dislikes: 1 },
      $push: { usersDisliked: likeUser },
      _id: paramId,})
       .then(() => {res.status(200).json({ message: 'Dislike ajouté' })})
       .catch((error) => {res.status(400).json({ error })});
}
// Si like vaut 0

if (sauceLike === 0) 
      Sauce.findOne({ _id: paramId })
        .then((sauce) => {

 // Remettre le like à 0

if (sauce.usersLiked.find((user) => user === likeUser)) {
      console.log('like supprimé')
      Sauce.updateOne(
        { _id: paramId },{         
           $inc: { likes: -1 },                         // On ajoute -1 au like
           $pull: { usersLiked: likeUser },             // On supprime l'Id de l'utilisateur du tableau userLiked                       
           _id: paramId,})
             .then(() => {res.status(200).json({ message: 'Like supprimé' })})             
             .catch((error) => {res.status(400).json({ error })});
  }

// Remettre le dislike à 0
  
if (sauce.usersDisliked.find((user) => user === likeUser)) {
      console.log('dislike supprimé')
      Sauce.updateOne(
        { _id: paramId },{
          $inc: { dislikes: -1 },                       // On ajoute -1 au dislike
          $pull: { usersDisliked: likeUser },           // On supprime l'Id de l'utilisateur du tableau userDisliked
          _id: paramId,})
           .then(() => {res.status(200).json({ message: 'Dislike supprimé' })})
           .catch((error) => {res.status(400).json({ error })});
  }})
           .catch((error) => {res.status(404).json({ error })});
      


}; 
