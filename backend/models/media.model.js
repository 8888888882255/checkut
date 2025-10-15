// models/media.model.js
module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    media_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tên gốc của file khi upload',
    },
    file_type: {
      type: DataTypes.ENUM('image', 'gif', 'video', 'pdf', 'other'),
      allowNull: false,
      comment: 'Phân loại file',
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Loại MIME, ví dụ image/jpeg, video/mp4,...',
    },
    file_size: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Dung lượng file (bytes)',
    },
    original_path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Đường dẫn gốc (chưa nén)',
    },
    optimized_path: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Đường dẫn file sau khi nén hoặc tối ưu hóa',
    },
    seo_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Tiêu đề SEO cho file',
    },
    seo_alt: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Alt text cho ảnh – giúp SEO hình ảnh',
    },
    seo_slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: 'Đường dẫn thân thiện SEO (slug)',
    },
    width: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'Chiều rộng ảnh/video (nếu có)',
    },
    height: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'Chiều cao ảnh/video (nếu có)',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      defaultValue: 'active',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'media',
    timestamps: false,
  });

  return Media;
};
