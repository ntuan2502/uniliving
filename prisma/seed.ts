import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing rooms
  await prisma.room.deleteMany({});
  await prisma.lead.deleteMany({});

  const room1 = await prisma.room.create({
    data: {
      title: "Phòng trọ 3/2 Diên Hồng - Cozy Sage Studio",
      description: "Căn hộ dịch vụ thiết kế phong cách Cozy Sage cực kỳ ấm cúng và gần gũi với thiên nhiên. Vách ngăn kính xanh ô-liu sang trọng, đầy đủ nội thất gỗ cao cấp (giường, bàn học, tủ lạnh, bếp nấu ăn). Nhà vệ sinh riêng được ốp gạch mosaic xanh ngọc lục bảo rất sang trọng.",
      price: 5500000,
      address: "Đường 3 Tháng 2 giao Diên Hồng, Phường 11, Quận 10, TP.HCM",
      district: "Quận 10",
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000",
      amenities: ["New", "Green", "Full", "1 phòng ngủ", "Wifi", "Máy giặt", "Ban công"],
      status: "AVAILABLE"
    }
  });

  const room2 = await prisma.room.create({
    data: {
      title: "Căn hộ Studio Green Oasis - Nguyễn Gia Trí",
      description: "Không gian sống xanh mát ngay trung tâm Bình Thạnh, gần các trường đại học HUTECH, Ngoại Thương. Phòng có ban công rộng rãi đón ánh sáng tự nhiên, trang bị máy giặt riêng, tủ lạnh hai cánh, khoá cửa vân tay an toàn tuyệt đối.",
      price: 6800000,
      address: "Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP.HCM",
      district: "Bình Thạnh",
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000",
      amenities: ["Green", "Full", "Wifi", "Tủ lạnh", "Ban công", "Bảo vệ 24/7"],
      status: "AVAILABLE"
    }
  });

  const room3 = await prisma.room.create({
    data: {
      title: "Phòng trọ gác lửng cao cấp - Lê Văn Sỹ Quận 3",
      description: "Phòng trọ mới xây thiết kế gác lửng thông minh, nội thất đầy đủ tối ưu hoá diện tích. Thích hợp cho sinh viên hoặc nhân viên văn phòng đi làm tại trung tâm Quận 3, Quận 1. Giờ giấc tự do, không chung chủ.",
      price: 4200000,
      address: "Lê Văn Sỹ, Phường 13, Quận 3, TP.HCM",
      district: "Quận 3",
      imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1000",
      amenities: ["New", "Full", "Wifi", "Máy giặt", "Khu vệ sinh riêng"],
      status: "AVAILABLE"
    }
  });

  console.log("Seeding completed successfully!");
  console.log(`Created rooms: \n- ${room1.title}\n- ${room2.title}\n- ${room3.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
