/**
 * INSERT 20 CURATED ALBUM PHOTOS WITH FULL ARCHITECTURAL EXPLANATIONS
 * Chèn 20 tác phẩm album đá tự nhiên độc bản vào CSDL Queen Stone
 */

const { getDb } = require('../src/db/database');
const db = getDb();

console.log('🔄 Đang thêm 20 tác phẩm Album đá tự nhiên có đầy đủ thuyết minh vào CSDL...');

const curatedAlbumPhotos = [
  {
    title: 'Đại Sảnh Vòm Cẩm Thạch Calacatta Michelangelo & Cầu Thang Xoắn Đôi',
    image_url: '/assets/album/album_calacatta_foyer.jpg',
    category: 'Đại Sảnh',
    project_name: 'Dinh Thự Hoàng Gia The Rivus Ba Son',
    stone_name: 'Calacatta Michelangelo Marble Ý',
    description: 'Không gian đại sảnh thông tầng ấn tượng với kiến trúc vòm bán nguyệt tân cổ điển. Toàn bộ sàn được lát cẩm thạch Calacatta Michelangelo kết hợp hoa văn sao tám cánh đối xứng tinh xảo, hòa quyện hoàn mỹ cùng hệ cầu thang xoắn đôi ốp đá nguyên khối dát đồng vương giả.',
    sort_order: 1
  },
  {
    title: 'Quầy Bar Ngọc Cẩm Thạch Onyx Xanh Xuyên Sáng Panorama Sky Lounge',
    image_url: '/assets/album/album_lounge_onyx_bar.jpg',
    category: 'Sky Lounge',
    project_name: 'Penthouse Grand Marina Saigon',
    stone_name: 'Emerald Green Onyx Iran Xuyên Sáng',
    description: 'Điểm nhấn xa hoa bậc nhất của Sky Lounge với đảo quầy bar uốn cong bọc ngọc cẩm thạch Emerald Onyx thấu quang từ Iran. Khi hệ thống đèn LED ẩn bên trong bật sáng, các đường vân ngọc bích và hổ phách tự nhiên bừng sáng huyền ảo đối lập ngoạn mục cùng toàn cảnh thành phố đêm.',
    sort_order: 2
  },
  {
    title: 'Vách Thông Tầng Thạch Anh Patagonia Bookmatch Nghệ Thuật Biệt Thự Đảo',
    image_url: '/assets/album/album_patagonia_living.jpg',
    category: 'Phòng Khách',
    project_name: 'Villa Biển Độc Bản Regent Horizon',
    stone_name: 'Patagonia Original Quartzite Brazil',
    description: 'Mảng vách thông tầng cao 7.5m sử dụng 4 phiến thạch anh Patagonia ghép đối xứng Bookmatch hoàn hảo tạo hình cánh bướm kỳ vĩ. Các khối tinh thể thấu quang tự nhiên được kích hoạt ánh sáng nền, tạo nên một tác phẩm nghệ thuật địa chất sống động nhìn thẳng ra hồ bơi vô cực.',
    sort_order: 3
  },
  {
    title: 'Sảnh Đón Cột Trụ Cẩm Thạch Verde Alpi & Lát Nền Hoa Văn Thảm Đá',
    image_url: '/assets/album/album_foyer_01.jpg',
    category: 'Đại Sảnh',
    project_name: 'Château De Royale Sala',
    stone_name: 'Verde Alpi Marble & Statuario Extra',
    description: 'Lối vào tiền sảnh uy nghi với hệ thức cột La Mã ốp đá cẩm thạch xanh lục bảo Verde Alpi từ thung lũng Aosta nước Ý. Nền sảnh đan xen thảm đá hoa văn viền đen Nero Marquina và tâm trắng Statuario mang lại ấn tượng bề thế cho khách quý.',
    sort_order: 4
  },
  {
    title: 'Sảnh Vòm Tân Cổ Điển Cẩm Thạch Arabescato Corchia Khắc Phù Điêu',
    image_url: '/assets/album/album_foyer_02.jpg',
    category: 'Đại Sảnh',
    project_name: 'Dinh Thự Holm Villas Thảo Điền',
    stone_name: 'Arabescato Corchia Marble Ý',
    description: 'Vòm sảnh đón được kiến tạo bởi các phiến đá Arabescato Corchia có hoa văn breccia mây xám cuộn xoáy trên nền trắng tinh khiết. Ánh sáng tự nhiên từ giếng trời rọi chiếu làm nổi bật chiều sâu ba chiều của từng đường vân tự nhiên.',
    sort_order: 5
  },
  {
    title: 'Vách Tivi & Lò Sưởi Cẩm Thạch Portoro Gold Ý Dinh Thự Ciputra',
    image_url: '/assets/album/album_living_01.jpg',
    category: 'Phòng Khách',
    project_name: 'Biệt Thự Đảo Ecopark Grand',
    stone_name: 'Portoro Gold Black Marble Ý',
    description: 'Sự kết hợp táo bạo giữa nền đá đen tuyền huyền bí và những dải chỉ vàng hổ phách sáng chói của đá Portoro Ý. Tấm vách đá tự nhiên độc bản làm nền tôn vinh hệ lò sưởi âm tường và nội thất da thuộc bespoke thủ công phong cách Milan.',
    sort_order: 6
  },
  {
    title: 'Không Gian Phòng Khách Tối Giản Với Vách Đá Xuyên Sáng Cristallo Tiffany',
    image_url: '/assets/album/album_living_02.jpg',
    category: 'Phòng Khách',
    project_name: 'Penthouse Serenity Sky Villas',
    stone_name: 'Cristallo Tiffany Quartzite Brazil',
    description: 'Không gian phòng khách hiện đại ứng dụng đá thạch anh Cristallo Tiffany xanh ngọc biển trong suốt. Khả năng khúc xạ ánh sáng độc đáo của tinh thể thạch anh biến bức vách thành một tấm gương phản chiếu năng lượng thanh bình và thịnh vượng.',
    sort_order: 7
  },
  {
    title: 'Phòng Khách Master Với Mặt Sàn Bookmatch Calacatta Borghini',
    image_url: '/assets/album/album_living_03.jpg',
    category: 'Phòng Khách',
    project_name: 'Biệt Thự Chateau Phú Mỹ Hưng',
    stone_name: 'Calacatta Borghini Royal Marble',
    description: 'Toàn bộ sàn phòng khách rộng 120m2 được tuyển chọn từ các phiến cẩm thạch Calacatta Borghini khai thác cùng một vỉa đá tại Carrara. Kỹ thuật mài bóng gương và thi công mạch khít tiêu chuẩn 0.5mm tạo cảm giác như một mặt hồ gương cẩm thạch liền mạch.',
    sort_order: 8
  },
  {
    title: 'Bàn Đảo Bếp Nguyên Khối Thạch Anh Blue Roma Kết Hợp Gỗ Óc Chó',
    image_url: '/assets/album/album_kitchen_01.jpg',
    category: 'Đảo Bếp',
    project_name: 'Penthouse Diamond Island Quận 2',
    stone_name: 'Blue Roma Quartzite Brazil',
    description: 'Bàn đảo bếp trung tâm dài 3.6m được chế tác từ phiến thạch anh Blue Roma nguyên khối với sắc xanh lam ánh thép và vân vàng đồng độc nhất vô nhị. Bề mặt vát cạnh 45 độ tinh xảo chống ố mài mòn tuyệt đối chuẩn công năng ẩm thực cao cấp.',
    sort_order: 9
  },
  {
    title: 'Hệ Tủ Bếp & Mặt Bàn Đảo Cẩm Thạch Statuario Extra Pure',
    image_url: '/assets/album/album_kitchen_02.jpg',
    category: 'Đảo Bếp',
    project_name: 'Villa Compound Lan Anh Village',
    stone_name: 'Statuario Extra Pure Marble Ý',
    description: 'Không gian bếp phong cách Châu Âu thượng lưu với mặt bàn và ốp tường backsplash hoàn toàn bằng cẩm thạch Statuario vân đậm sắc nét. Đường vân chảy liền mạch từ mặt bàn xuống hai bên chân thác nước (waterfall edge) đạt độ chuẩn xác cơ học cao.',
    sort_order: 10
  },
  {
    title: 'Quầy Bar Bếp Xuyên Sáng Ngọc Cẩm Thạch Trắng Pure White Onyx',
    image_url: '/assets/album/album_kitchen_03.jpg',
    category: 'Đảo Bếp',
    project_name: 'Dinh Thự Vườn Mai Ecopark',
    stone_name: 'Pure White Onyx Translucent Iran',
    description: 'Quầy bar kết hợp không gian ăn nhanh sử dụng đá Onyx trắng ngọc thấu quang 100%. Ánh sáng dịu nhẹ xuyên qua thớ đá tạo bầu không khí ấm cúng, biến không gian bếp thành tâm điểm thư giãn thưởng rượu của gia chủ.',
    sort_order: 11
  },
  {
    title: 'Cầu Thang Lượn Điêu Khắc Ốp Đá Cẩm Thạch Panda White Bookmatch',
    image_url: '/assets/album/album_stair_01.jpg',
    category: 'Cầu Thang',
    project_name: 'Dinh Thự Cổ Điển Vinhomes Riverside',
    stone_name: 'Panda White Marble Bookmatched',
    description: 'Tác phẩm cầu thang nghệ thuật uốn cong tự do với các bậc thang ốp đá Panda White. Sự đối lập mãnh liệt giữa nền trắng tinh và các vệt đen tuyền tạo hiệu ứng thị giác dòng thác đổ cuồn cuộn giữa lòng kiến trúc.',
    sort_order: 12
  },
  {
    title: 'Cầu Thang Hoàng Gia Cẩm Thạch Carrara Phối Viền Đá Đen Kim Sa',
    image_url: '/assets/album/album_stair_02.jpg',
    category: 'Cầu Thang',
    project_name: 'Lâu Đài Cổ Điển Nam Cường Hải Phòng',
    stone_name: 'Carrara White Marble & Black Galaxy',
    description: 'Hệ cầu thang tam cấp bề thế với từng mũi bậc thang được bo tròn chỉ cong R15 thủ công tỉ mỉ. Viền đá đen kim sa bao quanh nền trắng Carrara định hình nhịp bước chân vững chãi và quyền quý.',
    sort_order: 13
  },
  {
    title: 'Master Spa Phòng Tắm Tổng Thống Ốp Toàn Diện Calacatta Gold',
    image_url: '/assets/album/album_bath_01.jpg',
    category: 'Master Spa',
    project_name: 'The Peak Midtown Phú Mỹ Hưng',
    stone_name: 'Calacatta Gold Marble Ý',
    description: 'Không gian phòng tắm master đẳng cấp khách sạn 6 sao với các vách đá Calacatta Gold ghép vân đối xứng liên tục quanh bồn tắm massage ngắm nhìn công viên. Khả năng chống thấm 5 lớp công nghệ Nano giúp đá duy trì độ sáng bóng vĩnh cửu.',
    sort_order: 14
  },
  {
    title: 'Phòng Tắm Thư Giãn Phong Cách Onsen Với Đá Sa Thạch & Granit Đen',
    image_url: '/assets/album/album_bath_02.jpg',
    category: 'Master Spa',
    project_name: 'Biệt Thự Zen Villa Tam Đảo',
    stone_name: 'Black Taurus Granite & Travertine',
    description: 'Không gian tắm trị liệu hướng thiên nhiên kết hợp giữa vẻ thô mộc ấm áp của Travertine tự nhiên và sự vững chắc của đá granite Black Taurus xử lý mặt da Leather finish chống trơn trượt hoàn hảo trong môi trường ẩm ướt.',
    sort_order: 15
  },
  {
    title: 'Phòng Tắm Kính Master Suite Ốp Thạch Anh Xanh Ngọc Biển Amazonite',
    image_url: '/assets/album/album_bath_03.jpg',
    category: 'Master Spa',
    project_name: 'Biệt Thự Mũi Né Oceanfront',
    stone_name: 'Amazonite Exotic Granite Brazil',
    description: 'Tông xanh ngọc lam lam ngọc bích của đá Amazonite hòa cùng ánh nắng đại dương qua vách kính trong suốt. Từng mảng vân thạch anh trắng lấp lánh mang hơi thở biển nhiệt đới thuần khiết vào từng khoảnh khắc nghỉ dưỡng của chủ nhân.',
    sort_order: 16
  },
  {
    title: 'Mặt Tiền Dinh Thự Cổ Điển Ốp Đá Travertine La Mã Nguyên Khối',
    image_url: '/assets/album/album_facade_01.jpg',
    category: 'Mặt Tiền',
    project_name: 'Dinh Thự Ven Sông Thảo Điền',
    stone_name: 'Travertine Romano Classico Italy',
    description: 'Kiến trúc mặt tiền trường tồn cùng thời gian với 100% diện tích ốp đá Travertine La Mã nhập khẩu trực tiếp từ vùng Tivoli nước Ý. Cấu trúc hang hốc tự nhiên và gam màu be cát vàng tạo nét đẹp hoài niệm, sang trọng và cách nhiệt tối ưu.',
    sort_order: 17
  },
  {
    title: 'Đại Cổng & Sảnh Đón Biệt Thự Hiện Đại Đá Granite Titanium Gold',
    image_url: '/assets/album/album_facade_02.jpg',
    category: 'Mặt Tiền',
    project_name: 'Villa Star Hill Phú Quốc',
    stone_name: 'Titanium Gold Granite Brazil',
    description: 'Cổng vòm và diện tường mặt tiền sử dụng đá granite Titanium Gold dày 30mm gia cố hệ khung inox 316 chịu đựng hoàn hảo gió biển và muối mặn. Các dải vân vàng đồng kim loại phản chiếu ánh hoàng hôn tạo diện mạo uy nghiêm lộng lẫy.',
    sort_order: 18
  },
  {
    title: 'Phòng Tiệc Đại Yến Với Bàn Ăn 24 Ghế Đá Cẩm Thạch Rosa Zarci',
    image_url: '/assets/album/album_dining_01.jpg',
    category: 'Phòng Ăn',
    project_name: 'Dinh Thự Tổng Lãnh Sự Thụy Sĩ',
    stone_name: 'Rosa Zarci Luxury Marble Tây Ban Nha',
    description: 'Mặt bàn đại tiệc dài 6.8m được ghép nối liền mạch từ hai tấm đá Rosa Zarci với sắc hồng phấn hoàng gia dịu dàng và những dải vân thạch anh xám tro. Không gian toát lên vẻ trang nhã, ấm áp lý tưởng cho những buổi tiếp khách thượng lưu.',
    sort_order: 19
  },
  {
    title: 'Hành Lang Nghệ Thuật & Vách Ngăn Thạch Anh Fusion Wow Đa Sắc',
    image_url: '/assets/album/album_hall_01.jpg',
    category: 'Phòng Khách',
    project_name: 'Penthouse King Palace Hà Nội',
    stone_name: 'Fusion Wow Multi Quartzite Brazil',
    description: 'Hành lang trưng bày tranh và cổ vật được trang hoàng bằng vách đá thạch anh Fusion Wow với những dải sóng màu lam ngọc, gỉ sắt, hổ phách và bạch ngọc cuộn trào mãnh liệt. Đây là minh chứng hùng hồn cho bàn tay sáng tạo vô song của Mẹ Thiên Nhiên.',
    sort_order: 20
  }
];

// Trước khi chèn, dời sort_order của các ảnh cũ lùi lại 20 nấc để 20 tác phẩm mới luôn đứng đầu
db.prepare('UPDATE album_photos SET sort_order = sort_order + 20').run();

const insertAlbumPhoto = db.prepare(`
  INSERT INTO album_photos (title, image_url, category, project_name, stone_name, description, sort_order)
  VALUES (@title, @image_url, @category, @project_name, @stone_name, @description, @sort_order)
`);

const checkExisting = db.prepare('SELECT id FROM album_photos WHERE title = ?');

let inserted = 0;
for (const p of curatedAlbumPhotos) {
  const existing = checkExisting.get(p.title);
  if (!existing) {
    insertAlbumPhoto.run(p);
    inserted++;
    console.log(`  ✅ Thêm tác phẩm [${p.category}]: ${p.title}`);
  } else {
    // Cập nhật thông tin mới nhất
    db.prepare(`
      UPDATE album_photos 
      SET image_url = @image_url, category = @category, project_name = @project_name, 
          stone_name = @stone_name, description = @description, sort_order = @sort_order
      WHERE id = ?
    `).run({ ...p, id: existing.id }, existing.id);
    console.log(`  🔄 Cập nhật thuyết minh [${p.category}]: ${p.title}`);
  }
}

const totalCount = db.prepare('SELECT COUNT(*) as count FROM album_photos').get().count;
console.log(`\n🎉 ĐÃ CẬP NHẬT THÀNH CÔNG ${inserted} TÁC PHẨM VÀO ALBUM! (Tổng ảnh hiện tại: ${totalCount})`);
