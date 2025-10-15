const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('./config/database');
const { createClient } = require('redis'); // Import createClient từ redis
const cors = require('cors');

const app = express();

// Lấy danh sách origins từ biến môi trường
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173'];
console.log('Allowed CORS origins:', allowedOrigins);

// Cấu hình CORS chi tiết hơn
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Tạo redisClient một lần duy nhất
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
redisClient.on('error', (err) => console.error('Redis error:', err));

// Kết nối Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Đã kết nối Redis');
  } catch (error) {
    console.error('❌ Lỗi kết nối Redis, tiếp tục mà không dùng Redis:', error);
  }
})();

app.use(express.json());

// Khởi tạo object db để chứa các model
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.redisClient = redisClient; 

// Import các model
db.Media = require('./models/media.model')(sequelize, Sequelize);


// Định nghĩa các mối quan hệ
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});



// Đồng bộ cơ sở dữ liệu và khởi động server
db.sequelize.sync({ force: false, alter: false }).then(() => {
  console.log('Database synced.');
  app.listen(3000, () => console.log('Server running on port 3000'));
}).catch(error => {
  console.error('Lỗi đồng bộ cơ sở dữ liệu:', error);
});