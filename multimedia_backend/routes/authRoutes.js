const express = require('express');
const { rateLimit } = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Intenta más tarde.' }
});

router.post('/login', limiteLogin, authController.iniciarSesion);

module.exports = router;
