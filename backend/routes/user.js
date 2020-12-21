const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = required('../middleware/auth');

router.post('/', auth, userCtrl.signup);
router.post('/', auth, userCtrl.login);

module.exports = router;