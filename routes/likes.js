const express = require('express');

const router = express.Router();
const LikeController = require('../controllers/likes_controller');
const Like = require('../models/like');

router.post('/toggle',LikeController.toggleLike);

module.exports=router;