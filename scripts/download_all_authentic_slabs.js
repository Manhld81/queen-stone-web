/**
 * DOWNLOAD ALL AUTHENTIC NATURAL STONE SLABS
 * Tải 100% ảnh phiến đá thực tế chất lượng cao từ các nhà cung cấp đá quốc tế uy tín
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const stonesToDownload = [
  {
    ma_lo: 'QS-STAT-303',
    name: 'Statuario Extra Pure Marble',
    slabUrl: 'https://anteriorxl.com.au/wp-content/uploads/statuario-extra-marble-slab-01.jpg',
    macroUrl: 'https://www.hilltopsurfaces.com/images/statuario-extra-marble.1.jpg?resizeid=3&resizeh=1200&resizew=1200'
  },
  {
    ma_lo: 'QS-BLRO-505',
    name: 'Blue Roma Quartzite',
    slabUrl: 'https://anteriorxl.com.au/wp-content/uploads/blu-roma-quartzite-slab-01.jpg',
    macroUrl: 'https://nerostein.com/wp-content/uploads/2024/07/blue-roma.jpg'
  },
  {
    ma_lo: 'QS-VRAL-404',
    name: 'Verde Alpi Imperial Marble',
    slabUrl: 'https://anteriorxl.com.au/wp-content/uploads/verde-alpi-marble-reference-01.jpg',
    macroUrl: 'https://dimensiva.com/wp-content/uploads/edd/2026/08/verde-alpi-marble-texture-002.jpg'
  },
  {
    ma_lo: 'QS-ARAB-202',
    name: 'Arabescato Corchia Marble',
    slabUrl: 'https://anteriorxl.com.au/wp-content/uploads/arabescato-corchia-marble-reference-01.jpg',
    macroUrl: 'https://anteriorxl.com.au/wp-content/uploads/arabescato-orobico-marble-slab-01.jpg'
  },
  {
    ma_lo: 'QS-CALB-101',
    name: 'Calacatta Borghini Royal',
    slabUrl: 'https://anteriorxl.com.au/wp-content/uploads/calacatta-borghini-marble-slab-01-uai-1943x1943.jpg',
    macroUrl: 'https://anteriorxl.com.au/wp-content/uploads/calacatta-borghini-extra-marble-slab-01-uai-1943x1943.jpg'
  },
  {
    ma_lo: 'QS-NERO-111',
    name: 'Nero Marquina Marble',
    slabUrl: 'https://www.imperialstonegroup.com/wp-content/uploads/2022/06/Nero-Marquina-marble-slabs.jpg',
    macroUrl: 'https://thumbs.dreamstime.com/b/natural-spanish-nero-marquina-black-marble-texture-polished-slab-extracted-region-markina-basque-country-86859150.jpg'
  },
  {
    ma_lo: 'QS-PAND-222',
    name: 'Panda White Marble Bookmatched',
    slabUrl: 'https://geraldculliford.co.uk/wp-content/uploads/2019/04/Panda-White.jpg',
    macroUrl: 'https://www.fuleistone.com/wp-content/uploads/2018/10/panda-white-marble-slab-1.jpg'
  },
  {
    ma_lo: 'QS-CRTF-808',
    name: 'Cristallo Tiffany Quartzite',
    slabUrl: 'https://georgestones.com/wp-content/uploads/2024/01/Cristallo-Tiffany-Quartzite-Slab1.jpg',
    macroUrl: 'https://www.sonicstone.co.uk/wp-content/uploads/2024/06/Cristallo-Tiffany.jpg'
  },
  {
    ma_lo: 'QS-BLTA-606',
    name: 'Black Taurus Granite',
    slabUrl: 'https://marble.com/uploads/materials/1461/1280X720/granite_Black-Taurus_KZCnwvHQWp2vn1PYjWse.jpg',
    macroUrl: 'https://moristone.com/wp-content/uploads/2024/01/Black-Taurus-768x432.jpg'
  },
  {
    ma_lo: 'QS-GLDO-333',
    name: 'Golden Macaubas Quartzite',
    slabUrl: 'https://geraldculliford.co.uk/wp-content/uploads/2019/03/Gold-Macaubas.jpg',
    macroUrl: 'https://primestones.com/wp-content/uploads/2017/01/Golden-macaubas-detail.jpg'
  },
  {
    ma_lo: 'QS-WHBE-444',
    name: 'White Beauty Ice Jade Marble',
    slabUrl: 'https://pic.stonecontact.com/picture201511/20181/132108/bookmatch-white-beauty-marble-slabs-ice-connect-marble-green-slabs-p620481-1b.jpg',
    macroUrl: 'https://sccdn.sechitech.com/funshinestone/uploads/2024/06/ice-jade-marble-800x800-1.jpg'
  },
  {
    ma_lo: 'QS-TITA-999',
    name: 'Titanium Gold Granite',
    slabUrl: 'https://galereyakamnya.ru/thumb/2/OGLt_4J-JxwRUuTcakYBtg/800r800/d/475235_aceexdyn.jpg',
    macroUrl: 'https://marble.com/uploads/materials/1461/1280X720/granite_Black-Taurus_KZCnwvHQWp2vn1PYjWse.jpg'
  },
  {
    ma_lo: 'QS-ROSE-666',
    name: 'Rosa Zarci Luxury Marble',
    slabUrl: 'https://s3.amazonaws.com/moruzzi/thumbs/20210811164213624/zoom_photo_of_marble_rosa_zarci.jpg',
    macroUrl: 'https://www.tiendadelmarmol.com/assets/images/materiales/marmol/losa-marmol-color-rosa-zarci.jpg'
  },
  {
    ma_lo: 'QS-ONWH-888',
    name: 'Pure White Onyx Translucent',
    slabUrl: 'https://www.divinestoneworks.com/wp-content/uploads/2018/03/PURE-WHITE-ONYX.jpg',
    macroUrl: 'https://www.stoneadd.com/photo/slab/onyx/china/Pure-White-Onyx-Slabs-Chinese-Onyx-Supplier-Luxuxry-Onyx-Slabs.jpg'
  },
  {
    ma_lo: 'QS-VOLA-002',
    name: 'Volakas Classic Greek Marble',
    slabUrl: 'https://pic.stonecontact.com/picture201511/20187/9189/greece-volakas-white-marble-jazz-white-marble-slab-white-marble-slab-p660934-1b.jpg',
    macroUrl: 'https://cgmood.com/storage/previews/01-2021/44286/44286.jpg'
  },
  {
    ma_lo: 'QS-MAGM-007',
    name: 'Magma Gold Exotic Granite',
    slabUrl: 'https://marble.com/uploads/materials/471/1280X720/granite_Magma-Gold_s8bw4XfYwgfxsjq7wscZ.jpg',
    macroUrl: 'https://moristone.com/wp-content/uploads/2024/01/magma-gold-piccolo-1-768x576.jpg'
  },
  {
    ma_lo: 'QS-FUSI-008',
    name: 'Fusion Wow Multi Quartzite',
    slabUrl: 'https://marimar.net/wp-content/uploads/2024/10/03_texture_grande_fusion_wow.jpg',
    macroUrl: 'https://stoneline.com.tr/wp-content/uploads/2025/10/10-76-scaled.jpg'
  },
  {
    ma_lo: 'QS-EMER-009',
    name: 'Emerald Green Quartzite Royal',
    slabUrl: 'https://cavart.b-cdn.net/wp-content/uploads/2021/06/Emerald-Green-.jpeg',
    macroUrl: 'https://materialmatrix.nyc3.digitaloceanspaces.com/images/bundle/540580/slab.jpg'
  },
  {
    ma_lo: 'QS-CREM-010',
    name: 'Crema Marfil Classic Marble',
    slabUrl: 'https://www.imperialstonegroup.com/wp-content/uploads/2022/05/Crema-Marfil-Marble-Slabs.jpg',
    macroUrl: 'https://cdn.msisurfaces.com/images/colornames/crema-marfil-marble.jpg'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      timeout: 15000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const parsed = new URL(url);
          redirectUrl = parsed.origin + redirectUrl;
        }
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          const stat = fs.statSync(destPath);
          if (stat.size < 500) {
            fs.unlinkSync(destPath);
            return reject(new Error('File too small or empty'));
          }
          resolve(stat.size);
        });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function run() {
  console.log('🚀 Bắt đầu tải các phiến đá thực tế (Slab & Macro)...');
  for (const s of stonesToDownload) {
    const slabDest = path.join(__dirname, '../public/assets/stones', `slab_${s.ma_lo}.jpg`);
    const macroDest = path.join(__dirname, '../public/assets/stones', `macro_${s.ma_lo}.jpg`);

    try {
      const slabSize = await downloadFile(s.slabUrl, slabDest);
      console.log(`  ✅ SLAB [${s.ma_lo}] ${s.name}: ${slabSize} bytes`);
    } catch (e) {
      console.error(`  ❌ Lỗi Slab [${s.ma_lo}]: ${e.message}`);
    }

    try {
      const macroSize = await downloadFile(s.macroUrl, macroDest);
      console.log(`  ✅ MACRO [${s.ma_lo}] ${s.name}: ${macroSize} bytes`);
    } catch (e) {
      console.error(`  ❌ Lỗi Macro [${s.ma_lo}]: ${e.message}`);
      // Nếu macro url lỗi, copy từ slabDest
      if (fs.existsSync(slabDest) && !fs.existsSync(macroDest)) {
        fs.copyFileSync(slabDest, macroDest);
        console.log(`  🔄 Sao chép slab làm macro [${s.ma_lo}]`);
      }
    }
  }
  console.log('🎉 Hoàn thành tải phiến đá thực tế!');
}

run();
