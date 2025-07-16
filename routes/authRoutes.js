const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateAuth, validateRegister } = require('../middleware/validation');

router.post('/register', validateRegister, register);
router.post('/login', validateAuth, login);

module.exports = router;
