const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const mediaController = require('../controllers/media.controller');

// Xử lý preflight CORS nếu cần
router.options('*', (req, res) => {
  res.status(200).end();
});

// 🟢 Upload một file với loại media
router.post('/upload', upload.single('file'), mediaController.uploadMedia);

// 🟡 Lấy media theo loại (ví dụ: /api/media/type/logo)
router.get('/type/:type', mediaController.getMediaByType);

// 🟠 Lấy tất cả media
router.get('/', mediaController.getAllMedia);

// 🟣 Lấy media theo ID
router.get('/:id', mediaController.getMediaById);

// 🔴 Xóa media theo ID (soft delete)
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;