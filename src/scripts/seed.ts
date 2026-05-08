import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Models
import User from '../models/User';
import Property from '../models/Property';
import Room from '../models/Room';
import Post from '../models/Post';
import Transaction from '../models/Transaction';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected!');

    // Clear existing data
    console.log('Clearing old data...');
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Room.deleteMany({}),
      Post.deleteMany({}),
      Transaction.deleteMany({}),
    ]);

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Nguyễn Tấn Lộc (Admin)',
      email: 'admin@aloshipp.com',
      password: adminPassword,
      role: 'Admin',
      phone: '0901234567',
    });
    console.log('Created Admin:', admin.email);

    // Create CTVs
    const ctvPassword = await bcrypt.hash('ctv123', 10);
    const ctv1 = await User.create({
      name: 'CTV Thu Trà',
      email: 'thutra@aloshipp.com',
      password: ctvPassword,
      role: 'CTV',
      wallet_balance: 1500000, // 1.5M
      phone: '0912345678',
    });
    
    const ctv2 = await User.create({
      name: 'CTV Hoàng Nam',
      email: 'hoangnam@aloshipp.com',
      password: ctvPassword,
      role: 'CTV',
      wallet_balance: 500000,
      phone: '0987654321',
    });
    console.log('Created 2 CTVs');

    // Create Property
    const property = await Property.create({
      name: 'Tòa nhà CHDV Sinh Viên',
      address: '123 Đường Điện Biên Phủ, Phường 15, Bình Thạnh',
      owner_info: {
        name: 'Chú Tư',
        phone: '0999999999',
      },
      total_rooms: 10,
      financial_config: {
        electricity_price: 3500,
        water_price: 100000,
        service_fee: 150000,
        ctv_commission_rate: 15, // 15%
      },
    });

    // Create Rooms
    const rooms = [];
    for (let i = 1; i <= 5; i++) {
      const room = await Room.create({
        property_id: property._id,
        room_number: `P10${i}`,
        price: 3500000 + (i * 100000),
        status: i <= 3 ? 'Rented' : 'Available',
      });
      rooms.push(room);
    }

    // Create Posts (for available rooms)
    await Post.create({
      room_id: rooms[3]._id, // P104
      ctv_id: ctv1._id,
      title: 'Phòng Studio full nội thất gần HUTECH',
      description: 'Phòng mới xây, có ban công thoáng mát. Giờ giấc tự do, không chung chủ.',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'],
      status: 'Active',
    });

    await Post.create({
      room_id: rooms[4]._id, // P105
      ctv_id: ctv2._id,
      title: 'Phòng trọ giá sinh viên, an ninh tốt',
      description: 'Gần chợ, siêu thị. Phù hợp cho 2-3 bạn ở. Điện nước tính theo giá nhà nước.',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1de2d93688?q=80&w=1980&auto=format&fit=crop'],
      status: 'Pending',
    });

    // Create Transactions for Admin dashboard
    await Transaction.create({
      type: 'Thu tiền phòng',
      amount: 3500000,
      property_id: property._id,
      description: 'Thu tiền phòng P101 tháng 5',
    });
    await Transaction.create({
      type: 'Thu tiền phòng',
      amount: 3600000,
      property_id: property._id,
      description: 'Thu tiền phòng P102 tháng 5',
    });
    await Transaction.create({
      type: 'Chi hoa hồng',
      amount: 540000, // 15% of 3.6M
      property_id: property._id,
      ctv_id: ctv1._id,
      description: 'Hoa hồng giới thiệu P102',
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
