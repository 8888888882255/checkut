const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const sharp = require('sharp');
const { Media } = require('../models'); // Import model Sequelize

// 📦 Đường dẫn thư mục lưu file
const ORIGINAL_DIR = path.join(__dirname, '../uploads/original');
const OPTIMIZED_DIR = path.join(__dirname, '../uploads/optimized');

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(ORIGINAL_DIR)) fs.mkdirSync(ORIGINAL_DIR, { recursive: true });
if (!fs.existsSync(OPTIMIZED_DIR)) fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });

// 🟢 Upload & xử lý file
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được upload.' });
    }

    const { originalname, mimetype, size, filename, path: filePath } = req.file;
    const ext = path.extname(originalname).toLowerCase();
    const baseName = path.basename(originalname, ext);
    const slug = slugify(baseName, { lower: true, strict: true });
    const seoTitle = baseName.replace(/[-_]/g, ' ');

    const fileType = (() => {
      if (mimetype.startsWith('image/')) return 'image';
      if (mimetype.startsWith('video/')) return 'video';
      if (mimetype === 'application/pdf') return 'pdf';
      if (mimetype.includes('gif')) return 'gif';
      return 'other';
    })();

    // ✅ Đường dẫn gốc (file chưa nén)
    const originalPath = `/uploads/original/${filename}`;

    let optimizedPath = null;
    let width = null;
    let height = null;

    // ✅ Nén file ảnh bằng Sharp
    if (fileType === 'image' || fileType === 'gif') {
      const optimizedFileName = `${slug}-${Date.now()}.webp`;
      const optimizedFullPath = path.join(OPTIMIZED_DIR, optimizedFileName);
      optimizedPath = `/uploads/optimized/${optimizedFileName}`;

      const image = sharp(filePath);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;

      await image
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(optimizedFullPath);
    }

    // ✅ Tạo bản ghi trong CSDL
    const media = await Media.create({
      file_name: originalname,
      file_type: fileType,
      mime_type: mimetype,
      file_size: size,
      original_path: originalPath,
      optimized_path: optimizedPath,
      seo_title: seoTitle,
      seo_alt: seoTitle,
      seo_slug: slug,
      width,
      height,
      status: 'active',
    });

    return res.status(201).json({
      message: 'Upload thành công!',
      data: media,
    });
  } catch (error) {
    console.error('Lỗi upload:', error);
    return res.status(500).json({ message: 'Lỗi khi upload file.', error: error.message });
  }
};

// 🟠 Lấy danh sách media
exports.getAllMedia = async (req, res) => {
  try {
    const mediaList = await Media.findAll({
      where: { status: 'active' },
      order: [['media_id', 'DESC']],
    });
    return res.json(mediaList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách media.' });
  }
};

// 🟣 Lấy media theo ID
exports.getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);
    if (!media) return res.status(404).json({ message: 'Không tìm thấy media.' });
    return res.json(media);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi lấy media.' });
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

    return res.json({ message: 'Đã xóa media thành công.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi xóa media.' });
  }
};
