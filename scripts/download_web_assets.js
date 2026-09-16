/**
 * DOWNLOAD LUXURY WEB ASSETS FOR QUEEN STONE
 * Tải ảnh minh họa thực tế sắc nét chuẩn Dinh Thự từ Internet về phục vụ cục bộ (Local Assets)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const STONES_DIR = path.join(__dirname, '..', 'public', 'assets', 'stones');
const ALBUM_DIR = path.join(__dirname, '..', 'public', 'assets', 'album');

if (!fs.existsSync(STONES_DIR)) fs.mkdirSync(STONES_DIR, { recursive: true });
if (!fs.existsSync(ALBUM_DIR)) fs.mkdirSync(ALBUM_DIR, { recursive: true });

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      return resolve({ path: destPath, cached: true });
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve({ path: destPath, cached: false, size: fs.statSync(destPath).size }));
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// 24 Lô đá với ảnh Slab (1200x800) và Macro (800x800)
const stoneImages = [
  { ma_lo: 'QS-CALA-802', slabId: 'photo-1600585154340-be6161a56a0c', macroId: 'photo-1558618666-fcd25c85cd64' },
  { ma_lo: 'QS-PATA-701', slabId: 'photo-1618221195710-dd6b41faaea6', macroId: 'photo-1616486338812-3dadae4b4ace' },
  { ma_lo: 'QS-ONYX-901', slabId: 'photo-1618005182384-a83a8bd57fbe', macroId: 'photo-1579783902614-a3fb3927b675' },
  { ma_lo: 'QS-STAT-303', slabId: 'photo-1579546929518-9e396f3cc809', macroId: 'photo-1604014237800-1c9102c219da' },
  { ma_lo: 'QS-BLRO-505', slabId: 'photo-1600210492486-724fe5c67fb0', macroId: 'photo-1600573472550-8090b5e0745e' },
  { ma_lo: 'QS-VRAL-404', slabId: 'photo-1618005182384-a83a8bd57fbe', macroId: 'photo-1579783902614-a3fb3927b675' },
  { ma_lo: 'QS-ARAB-202', slabId: 'photo-1590381105924-c72589b9ef3f', macroId: 'photo-1579783900882-c0d3dad7b119' },
  { ma_lo: 'QS-BLTA-606', slabId: 'photo-1507499739999-097706ad8914', macroId: 'photo-1518709268805-4e9042af9f23' },
  { ma_lo: 'QS-CALB-101', slabId: 'photo-1533090161767-e6ffed986c88', macroId: 'photo-1589939705384-5185137a7f0f' },
  { ma_lo: 'QS-CRTF-808', slabId: 'photo-1552321554-5fefe8c9ef14', macroId: 'photo-1584622650111-993a426fbf0a' },
  { ma_lo: 'QS-NERO-111', slabId: 'photo-1507499739999-097706ad8914', macroId: 'photo-1518709268805-4e9042af9f23' },
  { ma_lo: 'QS-PAND-222', slabId: 'photo-1582738411706-bfc8e691d1c2', macroId: 'photo-1558618666-fcd25c85cd64' },
  { ma_lo: 'QS-ONWH-888', slabId: 'photo-1558618666-fcd25c85cd64', macroId: 'photo-1618219908412-a29a1bb7b86e' },
  { ma_lo: 'QS-BLBA-777', slabId: 'photo-1618005182384-a83a8bd57fbe', macroId: 'photo-1579783902614-a3fb3927b675' },
  { ma_lo: 'QS-ROSA-333', slabId: 'photo-1579546929518-9e396f3cc809', macroId: 'photo-1618219908412-a29a1bb7b86e' },
  { ma_lo: 'QS-AMAZ-999', slabId: 'photo-1618005182384-a83a8bd57fbe', macroId: 'photo-1579783902614-a3fb3927b675' },
  { ma_lo: 'QS-LAUR-444', slabId: 'photo-1507499739999-097706ad8914', macroId: 'photo-1518709268805-4e9042af9f23' },
  { ma_lo: 'QS-TRAV-555', slabId: 'photo-1590381105924-c72589b9ef3f', macroId: 'photo-1579783900882-c0d3dad7b119' },
  { ma_lo: 'QS-ONAM-666', slabId: 'photo-1579546929518-9e396f3cc809', macroId: 'photo-1589939705384-5185137a7f0f' },
  { ma_lo: 'QS-SODO-777', slabId: 'photo-1618005182384-a83a8bd57fbe', macroId: 'photo-1579783902614-a3fb3927b675' },
  { ma_lo: 'QS-PALM-888', slabId: 'photo-1579546929518-9e396f3cc809', macroId: 'photo-1618219908412-a29a1bb7b86e' },
  { ma_lo: 'QS-GRCI-999', slabId: 'photo-1590381105924-c72589b9ef3f', macroId: 'photo-1579783900882-c0d3dad7b119' },
  { ma_lo: 'QS-CALG-123', slabId: 'photo-1533090161767-e6ffed986c88', macroId: 'photo-1589939705384-5185137a7f0f' },
  { ma_lo: 'QS-FUSI-456', slabId: 'photo-1600210492486-724fe5c67fb0', macroId: 'photo-1600573472550-8090b5e0745e' }
];

// Danh mục ảnh kiến trúc Album (Đại sảnh, phòng khách, đảo bếp, v.v.)
const albumImages = [
  { name: 'album_foyer_01.jpg', id: 'photo-1600585154526-990dced4db0d' },
  { name: 'album_foyer_02.jpg', id: 'photo-1600596542815-ffad4c1539a9' },
  { name: 'album_foyer_03.jpg', id: 'photo-1600607687920-4e2a09cf159d' },
  { name: 'album_foyer_04.jpg', id: 'photo-1600585154363-67eb9e2e2099' },
  { name: 'album_living_01.jpg', id: 'photo-1600210492486-724fe5c67fb0' },
  { name: 'album_living_02.jpg', id: 'photo-1618221195710-dd6b41faaea6' },
  { name: 'album_living_03.jpg', id: 'photo-1616486338812-3dadae4b4ace' },
  { name: 'album_living_04.jpg', id: 'photo-1600607687644-c7171b42498b' },
  { name: 'album_kitchen_01.jpg', id: 'photo-1600573472550-8090b5e0745e' },
  { name: 'album_kitchen_02.jpg', id: 'photo-1600566752355-35792bedcfea' },
  { name: 'album_kitchen_03.jpg', id: 'photo-1600573472591-ee6b68d14c68' },
  { name: 'album_kitchen_04.jpg', id: 'photo-1507652313519-d4e9174996dd' },
  { name: 'album_bath_01.jpg', id: 'photo-1552321554-5fefe8c9ef14' },
  { name: 'album_bath_02.jpg', id: 'photo-1584622650111-993a426fbf0a' },
  { name: 'album_bath_03.jpg', id: 'photo-1541123437800-1bb1317badc2' },
  { name: 'album_bath_04.jpg', id: 'photo-1502672260266-1c1ef2d93688' },
  { name: 'album_stair_01.jpg', id: 'photo-1600585154526-990dced4db0d' },
  { name: 'album_stair_02.jpg', id: 'photo-1513694203232-719a280e022f' },
  { name: 'album_stair_03.jpg', id: 'photo-1560448204-e02f11c3d0e2' },
  { name: 'album_stair_04.jpg', id: 'photo-1512915922686-57c11dde9b6b' },
  { name: 'album_facade_01.jpg', id: 'photo-1600585154340-be6161a56a0c' },
  { name: 'album_facade_02.jpg', id: 'photo-1600585152220-90363fe7e115' },
  { name: 'album_facade_03.jpg', id: 'photo-1512917774080-9991f1c4c750' },
  { name: 'album_facade_04.jpg', id: 'photo-1613977257363-707ba9348227' },
  { name: 'album_dining_01.jpg', id: 'photo-1600566753376-12c8ab7fb75b' },
  { name: 'album_dining_02.jpg', id: 'photo-1613490493576-7fde63acd811' },
  { name: 'album_hall_01.jpg', id: 'photo-1600607687939-ce8a6c25118c' },
  { name: 'album_hall_02.jpg', id: 'photo-1578683010236-d716f9a3f461' }
];

async function runDownload() {
  console.log('🚀 Bắt đầu tải bộ sưu tập hình ảnh chất lượng cao từ Internet cho Queen Stone...\n');

  // 1. Tải ảnh 24 phiến đá (Slab + Macro)
  console.log('--- Đang tải ảnh 24 phiến đá tự nhiên độc bản (Slab & Macro) ---');
  for (let i = 0; i < stoneImages.length; i++) {
    const item = stoneImages[i];
    const slabUrl = `https://images.unsplash.com/${item.slabId}?auto=format&fit=crop&w=1200&h=800&q=80`;
    const macroUrl = `https://images.unsplash.com/${item.macroId}?auto=format&fit=crop&w=800&h=800&q=80`;
    const slabFile = path.join(STONES_DIR, `slab_${item.ma_lo}.jpg`);
    const macroFile = path.join(STONES_DIR, `macro_${item.ma_lo}.jpg`);

    try {
      await downloadImage(slabUrl, slabFile);
      await downloadImage(macroUrl, macroFile);
      process.stdout.write(`\r  ✅ [${i + 1}/${stoneImages.length}] Đã lưu ảnh Lô ${item.ma_lo} (Slab + Macro)`);
    } catch (e) {
      console.error(`\n  ❌ Lỗi tải ảnh lô ${item.ma_lo}:`, e.message);
    }
  }
  console.log('\n');

  // 2. Tải ảnh Album Không Gian Kiến Trúc
  console.log('--- Đang tải ảnh Thư viện Album Không Gian Kiến Trúc ---');
  for (let i = 0; i < albumImages.length; i++) {
    const item = albumImages[i];
    const albumUrl = `https://images.unsplash.com/${item.id}?auto=format&fit=crop&w=1200&h=800&q=80`;
    const albumFile = path.join(ALBUM_DIR, item.name);

    try {
      await downloadImage(albumUrl, albumFile);
      process.stdout.write(`\r  ✅ [${i + 1}/${albumImages.length}] Đã lưu ảnh Album: ${item.name}`);
    } catch (e) {
      console.error(`\n  ❌ Lỗi tải ảnh album ${item.name}:`, e.message);
    }
  }
  console.log('\n\n🎉 Hoàn thành tải toàn bộ ảnh minh họa từ Internet về máy chủ cục bộ!');
}

runDownload();
