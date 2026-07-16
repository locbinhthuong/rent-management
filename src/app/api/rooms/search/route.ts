import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    User.init(); // Đảm bảo model User được load để dùng cho .populate()

    const { searchParams } = new URL(request.url);
    
    // 1. Khởi tạo Object query cho MongoDB
    const query: any = { 
      approval_status: 'Approved',
      rental_status: 'Available' 
    };

    // 2. Lọc theo Text Search (Tiêu đề, Địa chỉ)
    const q = searchParams.get('q');
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
        { district: { $regex: q, $options: 'i' } }
      ];
    }

    // 3. Lọc theo Tỉnh/Thành, Quận/Huyện, Loại phòng, Tiện ích
    const city = searchParams.get('city') || searchParams.get('province_id');
    const district = searchParams.get('district') || searchParams.get('district_id');
    const property_type = searchParams.get('property_type') || searchParams.get('room_type_id');
    const amenitiesParam = searchParams.get('amenities');
    
    if (city) query.city = city;
    if (district) query.district = district;
    if (property_type) query.property_type = property_type;
    
    if (amenitiesParam) {
      const amenitiesList = amenitiesParam.split(',');
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    // 3. Lọc theo khoảng giá (min_price, max_price)
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Lọc theo Định vị (GPS Near Me)
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        query.location = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude] // Lưu ý: MongoDB yêu cầu [longitude, latitude]
            },
            $maxDistance: 10000 // Bán kính 10km
          }
        };
      }
    }

    // 5. Tính toán Phân trang (Pagination)
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // 6. Thực thi truy vấn
    let total = 0;
    let posts: any[] = [];
    
    try {
      let mongooseQuery = Post.find(query).populate('ctv_id', 'name phone email');
      
      // Mongoose tự động sort theo khoảng cách nếu có $near. Nếu không có $near, sort theo bài mới nhất/VIP
      if (!query.location) {
        mongooseQuery = mongooseQuery.sort({ is_vip: -1, bumped_at: -1, createdAt: -1 });
      }
      
      total = await Post.countDocuments(query);
      posts = await mongooseQuery.skip(skip).limit(limit).lean();
    } catch (err) {
      console.error("GeoQuery failed, falling back to normal query in API:", err);
      delete query.location;
      let fallbackQuery = Post.find(query).populate('ctv_id', 'name phone email').sort({ is_vip: -1, bumped_at: -1, createdAt: -1 });
      total = await Post.countDocuments(query);
      posts = await fallbackQuery.skip(skip).limit(limit).lean();
    }

    // 7. Trả về kết quả JSON chuẩn API
    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách phòng trọ thành công',
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error: any) {
    console.error("API /api/rooms/search error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
