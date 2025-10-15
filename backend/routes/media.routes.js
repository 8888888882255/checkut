// routes/media.routes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const mediaController = require('../controllers/media.controller');

router.post('/upload', upload.single('file'), mediaController.uploadMedia);
router.get('/', mediaController.getAllMedia);
router.get('/:id', mediaController.getMediaById);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
