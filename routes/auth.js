const express = require('express');
//check fx that we can import later
const { check, body } = require('express-validator/check');//check package

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);

router.post(
    '/login',
    [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
      body('password', 'Password has to be valid.')
        .isLength({ min: 4 })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
  );

  router.post(
    '/register',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),
        body('password',
            'Please enter a password with only numbers and text and at least 5 characters.'
        )
            .isLength({ min: 4 })
            .isAlphanumeric()
            .trim(),
        body('name', 'Enter a name, just alpha characters.')
            .isAlpha()
            .trim(),
    ],
    authController.postRegister
);
router.post('/logout', authController.postLogout);

module.exports = router;
