const express = require('express');
const passport = require('passport');
const router = express.Router();

const commentControllers = require('../controllers/comments_controller');

router.post('/create',passport.checkAuthentication,commentControllers.create);
router.get('/destroy/:id',passport.checkAuthentication,commentControllers.destroy);

module.exports = router;