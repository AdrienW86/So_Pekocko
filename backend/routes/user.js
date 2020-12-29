const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const {check, validationResult} = require('express-validator');


router.post('/signup',[

    check('email')
        .isEmail()
        .withMessage('Adresse email non valide')
        .normalizeEmail()
        .matches(/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i),   // Vérification de l'email en interdisant les caractères pouvant servir à une injection

    check('password')
        .isLength({ min: 8, max: 20})
        .withMessage('votre mot de passe doit contenir entre 8 et 20 caractères')
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/), // Un Chiffre, une lettre majuscule et un symbole ($@%*+-_! uniquement)

], (req, res, next) => {
    const error = validationResult(req).formatWith(({msg}) => msg);
    
    const hasError = !error.isEmpty();

    if (hasError) {
        res.status(400).json({ error: error.array()});
    }else{
        next();
    }
},userCtrl.signup);

router.post('/login', userCtrl.login);

module.exports = router;