const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const sharp = require('sharp');
const { Media } = require('../models');

const ORIGINAL_DIR = path.join(__dirname, '../uploads/original');
if (!fs.existsSync(ORIGINAL_DIR)) fs.mkdirSync(ORIGINAL_DIR, { recursive: true });

// 🟢 Upload file ảnh/gif
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Không có file nào được upload.' });

    const { originalname, mimetype, size, filename, path: filePath } = req.file;
    const ext = path.extname(originalname).toLowerCase();
    const baseName = path.basename(originalname, ext);
    const slug = slugify(baseName, { lower: true, strict: true });
    const seoTitle = baseName.replace(/[-_]/g, ' ');

    // 🧩 Nhận loại media (logo, banner1,...)
    const { type_name } = req.body;
    const allowedTypes = [
      'logo', 'thuonghieu', 'nen', 'avt_macdinh', 'bia_macdinh',
      'banner1', 'banner2', 'banner3', 'banner4', 'banner5'
    ];
    if (!type_name || !allowedTypes.includes(type_name)) {
      return res.status(400).json({ message: 'Loại media không hợp lệ.' });
    }

    const fileType = (() => {
      if (mimetype.startsWith('image/')) return 'image';
      if (mimetype.includes('gif')) return 'gif';
      if (mimetype.startsWith('video/')) return 'video';
      if (mimetype === 'application/pdf') return 'pdf';
      return 'other';
    })();

    // ✅ Đường dẫn file gốc
    const originalPath = `/uploads/original/${filename}`;
    let width = null;
    let height = null;

    // ✅ Lấy metadata nếu là ảnh/gif
    if (fileType === 'image' || fileType === 'gif') {
      try {
        const image = sharp(filePath);
        const meta = await image.metadata();
        width = meta.width;
        height = meta.height;
      } catch (err) {
        console.warn('Không đọc được metadata ảnh:', err.message);
      }
    }

    // ✅ Lưu thông tin vào DB
    const media = await Media.create({
      type_name,
      file_name: originalname,
      file_type: fileType,
      mime_type: mimetype,
      file_size: size,
      original_path: originalPath,
      optimized_path: null, // không cần nén
      seo_title: seoTitle,
      seo_alt: seoTitle,
      seo_slug: slug,
      width,
      height,
      status: 'active',
    });

    res.status(201).json({
      message: 'Upload thành công!',
      data: media,
    });
  } catch (error) {
    console.error('Lỗi upload:', error);
    res.status(500).json({ message: 'Lỗi khi upload file.', error: error.message });
  }
};

// 🟠 Lấy danh sách media
exports.getAllMedia = async (req, res) => {
  try {
    const mediaList = await Media.findAll({
      where: { status: 'active' },
      order: [['media_id', 'ASC']],
    });
    res.json(mediaList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách media.' });
  }
};

// 🟣 Lấy media theo ID
exports.getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);
    if (!media) return res.status(404).json({ message: 'Không tìm thấy media.' });
    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy media.' });
  }
};

// 🔴 Xóa media
exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);
    if (!media) return res.status(404).json({ message: 'Không tìm thấy media.' });

    media.status = 'deleted';
    await media.save();

    res.json({ message: 'Đã xóa media thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xóa media.' });
  }
};

// 🟡 Lấy media theo loại (type_name)
exports.getMediaByType = async (req, res) => {
  try {
    const { type } = req.params;

    const allowedTypes = [
      'logo', 'thuonghieu', 'nen', 'avt_macdinh', 'bia_macdinh',
      'banner1', 'banner2', 'banner3', 'banner4', 'banner5'
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Loại media không hợp lệ.' });
    }

    const media = await Media.findOne({
      where: {
        type_name: type,
        status: 'active',
      },
      order: [['media_id', 'DESC']], // Lấy file mới nhất
    });

    if (!media) {
      return res.status(404).json({ message: 'Không tìm thấy media cho loại này.' });
    }

    return res.json(media);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi lấy media theo loại.' });
  }
};
