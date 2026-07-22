import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import SystemConfig from '@/models/SystemConfig';
import Post from '@/models/Post';

export async function GET() {
  try {
    await connectDB();
    
    // Find config or create default
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({
        announcement: { text: '', isActive: false },
        propertyTypes: ['Phòng trọ', 'Chung cư mini', 'Nhà nguyên căn', 'Mặt bằng'],
        locations: [],
        contact: {
          hotline: '0988.727.604',
          zalo: 'https://zalo.me/0988727604',
          facebook: 'https://facebook.com/',
          tiktok: 'https://tiktok.com/',
          email: 'locushomels@gmail.com',
          address: 'Trụ sở chính (Đang cập nhật)'
        }
      });
    }

    // Get suggested locations from existing posts
    const suggestedLocations = await Post.distinct('district');
    // Filter out empty or null districts, and current locations
    const cleanSuggestions = suggestedLocations
      .filter((loc): loc is string => Boolean(loc))
      .filter((loc) => !config.locations.includes(loc));

    return NextResponse.json({ config, suggestedLocations: cleanSuggestions });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
    }

    if (data.announcement !== undefined) config.announcement = data.announcement;
    if (data.propertyTypes !== undefined) config.propertyTypes = data.propertyTypes;
    if (data.locations !== undefined) config.locations = data.locations;
    if (data.contact !== undefined) config.contact = data.contact;

    await config.save();

    return NextResponse.json({ message: 'Cập nhật thành công', config });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
