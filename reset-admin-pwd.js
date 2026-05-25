const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    const newPassword = 'admin'; // Hoặc mật khẩu bạn muốn đặt
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.collection('users').updateOne(
      { role: 'Admin' },
      { $set: { password: hashedPassword } }
    );
    
    console.log('Đã reset password thành công!');
  } catch (err) {
    console.error('Lỗi:', err);
  } finally {
    mongoose.disconnect();
  }
}

resetAdminPassword();
