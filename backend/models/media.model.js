module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    media_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type_name: {
      type: DataTypes.ENUM(
        'logo',
        'thuonghieu',
        'nen',
        'avt_macdinh',
        'bia_macdinh',
        'banner1',
        'banner2',
        'banner3',
        'banner4',
        'banner5'
      ),
      allowNull: false,
      comment: 'Loại media (logo, banner, nền, v.v.)',
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tên gốc của file khi upload',
    },
    file_type: {
      type: DataTypes.ENUM('image', 'gif', 'video', 'pdf', 'other'),
      allowNull: false,
      comment: 'Phân loại file',
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Loại MIME, ví dụ: image/jpeg, video/mp4',
    },
    file_size: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Dung lượng file (bytes)',
    },
    original_path: {
      type: DataTypes.STRING(512),
      allowNull: false,
      comment: 'Đường dẫn gốc (chưa nén)',
    },
    optimized_path: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: 'Đường dẫn file sau khi nén hoặc tối ưu hóa',
    },
    seo_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    seo_alt: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    seo_slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    width: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      defaultValue: 'active',
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  }, {
    tableName: 'media',
    timestamps: false, // Không sử dụng timestamps tự động của Sequelize
    underscored: true, // Sử dụng snake_case cho tên cột nếu cần nhất quán
  });

  // Nếu cần định nghĩa các mối quan hệ (associations), thêm ở đây
  Media.associate = (models) => {
    // Ví dụ: Media.belongsTo(models.OtherModel);
  };

  return Media;
};