/**
 * APPLY REAL WEB ASSETS TO DATABASE AND SEED
 * Cập nhật toàn bộ đường dẫn ảnh thực tế chất lượng cao vào CSDL Queen Stone
 */

const fs = require('fs');
const path = require('path');
const { getDb } = require('../src/db/database');

const db = getDb();

console.log('🔄 Bắt đầu cập nhật hình ảnh thực tế chất lượng cao vào CSDL...');

// 1. Cập nhật 24 phiến đá trong san_pham_da
const stones = db.prepare('SELECT id, ma_lo, ten_da FROM san_pham_da').all();
const updateStone = db.prepare(`
  UPDATE san_pham_da 
  SET hinh_anh_slab = ?, hinh_anh_macro = ? 
  WHERE ma_lo = ?
`);

for (const s of stones) {
  const slabPath = `/assets/stones/slab_${s.ma_lo}.jpg`;
  const macroPath = `/assets/stones/macro_${s.ma_lo}.jpg`;
  updateStone.run(slabPath, macroPath, s.ma_lo);
  console.log(`  ✅ Đá ${s.ma_lo} (${s.ten_da}) -> Slab: ${slabPath}`);
}

// 2. Cập nhật ảnh trong album_photos
const albumPhotos = db.prepare('SELECT id, title, category FROM album_photos').all();
const updateAlbumPhoto = db.prepare(`
  UPDATE album_photos
  SET image_url = ?
  WHERE id = ?
`);

// Bản đồ phân loại ảnh theo danh mục
const categoryImages = {
  'Đại Sảnh': [
    '/assets/album/album_foyer_01.jpg',
    '/assets/album/album_foyer_02.jpg',
    '/assets/album/album_foyer_03.jpg',
    '/assets/album/album_foyer_04.jpg',
    '/assets/hero_slides/slide_01_foyer_emerald.jpg'
  ],
  'Phòng Khách': [
    '/assets/album/album_living_01.jpg',
    '/assets/album/album_living_02.jpg',
    '/assets/album/album_living_03.jpg',
    '/assets/album/album_living_04.jpg',
    '/assets/hero_slides/slide_02_living_room_wall.jpg'
  ],
  'Đảo Bếp': [
    '/assets/album/album_kitchen_01.jpg',
    '/assets/album/album_kitchen_02.jpg',
    '/assets/album/album_kitchen_03.jpg',
    '/assets/album/album_kitchen_04.jpg',
    '/assets/hero_slides/slide_03_kitchen_onyx.jpg'
  ],
  'Khu Bếp': [
    '/assets/album/album_kitchen_01.jpg',
    '/assets/album/album_kitchen_02.jpg',
    '/assets/album/album_kitchen_03.jpg',
    '/assets/hero_slides/slide_03_kitchen_onyx.jpg'
  ],
  'Bếp & Bar': [
    '/assets/album/album_kitchen_02.jpg',
    '/assets/album/album_kitchen_03.jpg',
    '/assets/hero_slides/slide_03_kitchen_onyx.jpg'
  ],
  'Cầu Thang': [
    '/assets/album/album_stair_01.jpg',
    '/assets/album/album_stair_02.jpg',
    '/assets/album/album_stair_03.jpg',
    '/assets/album/album_stair_04.jpg',
    '/assets/hero_slides/slide_04_grand_staircase.jpg'
  ],
  'Master Spa': [
    '/assets/album/album_bath_01.jpg',
    '/assets/album/album_bath_02.jpg',
    '/assets/album/album_bath_03.jpg',
    '/assets/album/album_bath_04.jpg',
    '/assets/hero_slides/slide_05_master_spa.jpg'
  ],
  'Phòng Tắm': [
    '/assets/album/album_bath_01.jpg',
    '/assets/album/album_bath_02.jpg',
    '/assets/album/album_bath_03.jpg',
    '/assets/hero_slides/slide_05_master_spa.jpg'
  ],
  'Master Bath': [
    '/assets/album/album_bath_02.jpg',
    '/assets/album/album_bath_04.jpg',
    '/assets/hero_slides/slide_05_master_spa.jpg'
  ],
  'Mặt Tiền': [
    '/assets/album/album_facade_01.jpg',
    '/assets/album/album_facade_02.jpg',
    '/assets/album/album_facade_03.jpg',
    '/assets/album/album_facade_04.jpg'
  ],
  'Ngoại Thất': [
    '/assets/album/album_facade_01.jpg',
    '/assets/album/album_facade_02.jpg',
    '/assets/album/album_facade_03.jpg'
  ],
  'Phòng Ăn': [
    '/assets/album/album_dining_01.jpg',
    '/assets/album/album_dining_02.jpg'
  ],
  'Hành Lang': [
    '/assets/album/album_hall_01.jpg',
    '/assets/album/album_hall_02.jpg'
  ],
  'Hồ Bơi & Spa': [
    '/assets/album/album_bath_04.jpg',
    '/assets/album/album_facade_02.jpg'
  ],
  'Sky Lounge': [
    '/assets/album/album_facade_03.jpg',
    '/assets/album/album_living_02.jpg'
  ],
  'Phòng Ngủ': [
    '/assets/album/album_hall_02.jpg',
    '/assets/album/album_living_04.jpg'
  ],
  'Cảnh Quan': [
    '/assets/album/album_facade_04.jpg',
    '/assets/album/album_facade_02.jpg'
  ],
  'Sảnh Đón': [
    '/assets/album/album_foyer_02.jpg',
    '/assets/album/album_foyer_04.jpg'
  ]
};

const categoryCounters = {};

for (const ap of albumPhotos) {
  const cat = ap.category || 'Đại Sảnh';
  if (!categoryCounters[cat]) categoryCounters[cat] = 0;
  
  const pool = categoryImages[cat] || categoryImages['Đại Sảnh'];
  const chosenImg = pool[categoryCounters[cat] % pool.length];
  categoryCounters[cat]++;

  updateAlbumPhoto.run(chosenImg, ap.id);
  console.log(`  📸 Album #${ap.id} (${cat}): ${ap.title} -> ${chosenImg}`);
}

// 3. Cập nhật cong_trinh Lookbook
const projects = db.prepare('SELECT id, ten_cong_trinh, album_json FROM cong_trinh').all();
const updateProject = db.prepare('UPDATE cong_trinh SET album_json = ? WHERE id = ?');

for (const pr of projects) {
  let list = [];
  try {
    list = JSON.parse(pr.album_json);
  } catch (e) {
    list = [];
  }
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const cat = item.tag || 'Đại Sảnh';
    const pool = categoryImages[cat] || categoryImages['Đại Sảnh'];
    item.url = pool[i % pool.length];
  }
  updateProject.run(JSON.stringify(list), pr.id);
  console.log(`  🏰 Công trình #${pr.id} (${pr.ten_cong_trinh}) -> Đã cập nhật ${list.length} ảnh`);
}

console.log('\n🎉 ĐÃ CẬP NHẬT THÀNH CÔNG 100% ẢNH THỰC TẾ TỪ INTERNET VÀO CSDL!');
