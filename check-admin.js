const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function findAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // We don't need the full schema, just the collection
    const db = mongoose.connection.db;
    const adminUser = await db.collection('users').findOne({ role: 'Admin' });
    
    if (adminUser) {
      console.log('--- THÔNG TIN ADMIN ---');
      console.log('Tên:', adminUser.name);
      console.log('Email:', adminUser.email);
      console.log('SĐT:', adminUser.phone);
      console.log('Role:', adminUser.role);
    } else {
      console.log('Không tìm thấy tài khoản Admin nào trong CSDL!');
    }
  } catch (err) {
    console.error('Lỗi:', err);
  } finally {
    mongoose.disconnect();
  }
}

findAdmin();
