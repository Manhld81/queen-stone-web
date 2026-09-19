/**
 * tests/test-e2e-live.js
 * Kiểm thử E2E trực tiếp trên máy chủ Web http://localhost:3000 đang hoạt động.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function post(url, postData, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const bodyStr = JSON.stringify(postData);
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
        ...customHeaders
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function put(url, body, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const bodyStr = JSON.stringify(body || {});
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
        ...customHeaders
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function del(url, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'DELETE',
      headers: {
        ...customHeaders
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runE2ETests() {
  console.log('================================================================================');
  console.log('🌐 E2E LIVE SERVER TEST — KIỂM THỬ MÁY CHỦ HOẠT ĐỘNG TRÊN CỔNG 3000');
  console.log('================================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      failed++;
    }
  }

  try {
    // 1. Kiểm tra Trang chủ HTML
    const homeRes = await get('http://localhost:3000/');
    assert(homeRes.status === 200, 'Máy chủ phản hồi HTTP 200 cho trang chủ (/)');
    assert(homeRes.body.includes('Queen Stone'), 'Trang chủ chứa thương hiệu Queen Stone');
    assert(homeRes.body.includes('stone-product-grid'), 'Trang chủ có khung chứa lưới sản phẩm stone-product-grid');
    assert(homeRes.body.includes('infinite-scroll-sentinel'), 'Trang chủ có phần tử mồi cuộn vô tận sentinel');
    assert(homeRes.body.includes('heroSliderTrack'), 'Trang chủ có slider trượt vô tận heroSliderTrack');

    // 2. Kiểm tra File tĩnh CSS
    const cssRes = await get('http://localhost:3000/css/style.css');
    assert(cssRes.status === 200, 'Máy chủ phục vụ file CSS style.css thành công');
    assert(cssRes.body.includes('margin-top: auto'), 'CSS có neo nút bấm đáy thẻ margin-top: auto');
    assert(cssRes.body.includes('pulseGlowAnimation'), 'CSS có hiệu ứng nhấp nháy phát quang pulseGlowAnimation');
    assert(cssRes.body.includes('badge-stock-out'), 'CSS có kiểu dáng nhãn HẾT HÀNG');

    // 3. Kiểm tra File tĩnh JS
    const jsRes = await get('http://localhost:3000/js/app.js');
    assert(jsRes.status === 200, 'Máy chủ phục vụ file JS app.js thành công');
    assert(jsRes.body.includes('intervalTime = 2000'), 'JS cấu hình chu kỳ slider 2.0s (intervalTime = 2000)');
    assert(jsRes.body.includes('IntersectionObserver'), 'JS tích hợp IntersectionObserver cho Infinite Scroll');

    // 4. Kiểm tra API GET /api/v1/stones (Page 1)
    const apiP1 = await get('http://localhost:3000/api/v1/stones?page=1&limit=9');
    assert(apiP1.status === 200, 'API /api/v1/stones trả về mã 200');
    const p1Response = JSON.parse(apiP1.body);
    assert(p1Response.success === true, 'API trả về success: true');
    const p1Data = p1Response.data;
    assert(p1Data.items.length === 9, 'Trang 1 trả về đúng 9 sản phẩm');
    assert(p1Data.has_more === true, 'Trang 1 báo has_more = true để cuộn tiếp');

    // Kiểm tra sắp xếp giảm dần và 6 sản phẩm NEW
    const firstStone = p1Data.items[0];
    assert(firstStone.is_new === true, 'Sản phẩm đầu tiên có cờ is_new = true');
    assert(firstStone.ma_lo === 'QS-CALA-802', 'Sản phẩm Up sau cùng là QS-CALA-802');

    let newCountInTop6 = 0;
    for (let i = 0; i < 6; i++) {
      if (p1Data.items[i].is_new) newCountInTop6++;
    }
    assert(newCountInTop6 === 6, 'Cả 6 sản phẩm đầu tiên đều có is_new = true');
    assert(p1Data.items[6].is_new === false, 'Sản phẩm thứ 7 có is_new = false (chỉ có đúng 6 sản phẩm mới)');

    // 5. Kiểm tra kiểm tra tồn kho bằng 0 -> Hết hàng
    const allStonesRes = await get('http://localhost:3000/api/v1/stones?limit=50');
    const allStones = JSON.parse(allStonesRes.body).data.items;
    const outOfStockItems = allStones.filter(s => s.is_out_of_stock);
    assert(outOfStockItems.length >= 3, `Có ${outOfStockItems.length} sản phẩm hết hàng trong hệ thống`);
    for (const item of outOfStockItems) {
      assert(item.so_luong_tam === 0, `Sản phẩm ${item.ma_lo} có số lượng tấm = 0 đúng quy tắc hết hàng`);
    }

    // 6. Kiểm tra API lọc theo chủng loại
    const filterMarbleRes = await get('http://localhost:3000/api/v1/stones?category=Marble');
    const marbleData = JSON.parse(filterMarbleRes.body).data.items;
    assert(marbleData.every(s => s.loai_da === 'Marble'), 'Bộ lọc Marble chỉ trả về đá Marble');

    // 7. Kiểm tra API lọc theo màu sắc
    const filterColorRes = await get('http://localhost:3000/api/v1/stones?color=Xanh');
    const colorData = JSON.parse(filterColorRes.body).data.items;
    assert(colorData.every(s => s.mau_sac.includes('Xanh')), 'Bộ lọc Xanh chỉ trả về đá màu Xanh');

    // 8. Kiểm tra API thống kê kho
    const statsRes = await get('http://localhost:3000/api/v1/warehouse/stats');
    assert(statsRes.status === 200, 'API thống kê kho phản hồi 200');
    const statsData = JSON.parse(statsRes.body).data;
    assert(statsData.tong_so_lo_da === 24, 'Tổng số lô đá trong kho là 24');

    // 9. Kiểm tra chu trình Cuộn Vô Tận đa trang (Infinite Scroll Multi-Page)
    const apiP2 = await get('http://localhost:3000/api/v1/stones?page=2&limit=9');
    const p2Data = JSON.parse(apiP2.body).data;
    assert(p2Data.items.length === 9, 'Cuộn lần 1: Nạp tiếp trang 2 gồm đúng 9 sản phẩm');
    assert(p2Data.has_more === true, 'Trang 2 báo has_more = true để tiếp tục cuộn');

    const apiP3 = await get('http://localhost:3000/api/v1/stones?page=3&limit=9');
    const p3Data = JSON.parse(apiP3.body).data;
    assert(p3Data.items.length === 6, 'Cuộn lần 2: Nạp trang 3 gồm 6 sản phẩm cuối cùng (tổng 24)');
    assert(p3Data.has_more === false, 'Trang 3 báo has_more = false để dừng cuộn vô tận chính xác');

    // Đảm bảo không trùng lặp sản phẩm giữa các trang
    const allFetchedCodes = [
      ...p1Data.items.map(s => s.ma_lo),
      ...p2Data.items.map(s => s.ma_lo),
      ...p3Data.items.map(s => s.ma_lo)
    ];
    assert(allFetchedCodes.length === 24, 'Tổng cộng 24 sản phẩm đã được nạp qua cuộn vô tận');
    assert(new Set(allFetchedCodes).size === 24, '100% các sản phẩm nạp qua cuộn vô tận là độc nhất, không trùng lặp');

    // 10. Kiểm tra Menu mới, CTA và nút Đăng nhập trên Trang chủ
    assert(homeRes.body.includes('Album đá tự nhiên'), 'Trang chủ có menu "Album đá tự nhiên"');
    assert(homeRes.body.includes('Liên hệ'), 'Trang chủ có menu "Liên hệ"');
    assert(homeRes.body.includes('btn-login'), 'Trang chủ có nút "Đăng nhập"');
    assert(homeRes.body.includes('Chiêm Ngưỡng Album Đá Tự Nhiên'), 'Hero CTA đổi thành "Chiêm Ngưỡng Album Đá Tự Nhiên"');
    assert(homeRes.body.includes('Khám Phá Toàn Bộ Album (Vô Hạn Ảnh)'), 'Trang chủ có nút dẫn tới Trang Album Vô Hạn');

    // 10.1. Kiểm tra Mục LIÊN HỆ chuẩn quy cách hàng ngang
    assert(homeRes.body.includes('section-title-main">LIÊN HỆ</h2>'), 'Mục tiêu đề chính là LIÊN HỆ');
    assert(homeRes.body.includes('CÔNG TY CỔ PHẦN ĐÁ TỰ NHIÊN QUEEN STONE'), 'Có tên Công ty tại Trụ sở chính');
    assert(homeRes.body.includes('contact@queenstone.vn'), 'Có Email liên hệ');
    assert(homeRes.body.includes('0988.888.789'), 'Có Số điện thoại hotline');
    assert(homeRes.body.includes('branch_tru_so_chinh.jpg'), 'Có ô hình ảnh Trụ sở chính');
    assert(homeRes.body.includes('maps.google.com'), 'Có ô nhúng bản đồ Google Map');
    assert(homeRes.body.includes('google.com/maps/search'), 'Có liên kết mở ứng dụng Google Maps trực tiếp');
    assert(homeRes.body.includes('SHOWROOM 1 — MIỀN BẮC'), 'Có hàng Showroom 1 (Miền Bắc)');
    assert(homeRes.body.includes('SHOWROOM 2 — MIỀN TRUNG'), 'Có hàng Showroom 2 (Miền Trung)');
    assert(homeRes.body.includes('SHOWROOM 3 — TÂY NAM BỘ'), 'Có hàng Showroom 3 (Tây Nam Bộ)');


    // 11. Kiểm tra Trang Album Landing Page (/album.html)
    const albumPageRes = await get('http://localhost:3000/album.html');
    assert(albumPageRes.status === 200, 'Trang album.html phản hồi HTTP 200');
    assert(albumPageRes.body.includes('albumPhotosGrid'), 'Trang album có lưới ảnh albumPhotosGrid dạng Masonry');
    assert(albumPageRes.body.includes('albumSentinel'), 'Trang album có phần tử mồi cuộn vô tận albumSentinel');
    assert(albumPageRes.body.includes('albumLightbox'), 'Trang album có lightbox xem ảnh vi mô');
    assert(albumPageRes.body.includes('btnLightboxBack'), 'Lightbox có nút Back để quay lại coi tiếp Album');
    assert(albumPageRes.body.includes('albumFilterTabs'), 'Trang album có thanh lọc không gian kiến trúc albumFilterTabs');

    // 12. Kiểm tra API Kho ảnh Album vô hạn (/api/v1/album-photos)
    const albumPhotosRes = await get('http://localhost:3000/api/v1/album-photos?page=1&limit=12');
    assert(albumPhotosRes.status === 200, 'API /api/v1/album-photos trả về mã 200');
    const apData = JSON.parse(albumPhotosRes.body).data;
    assert(apData.items.length === 12, 'Trang 1 album nạp đúng 12 ảnh dạng lưới');
    assert(apData.total >= 32, `Tổng số ảnh trong kho album đạt ít nhất 32 ảnh (nhận được: ${apData.total})`);
    assert(apData.has_more === true, 'Kho album có cờ has_more = true để cuộn vô hạn');

    // Lọc theo không gian kiến trúc
    const filterLobbyRes = await get('http://localhost:3000/api/v1/album-photos?category=%C4%90%E1%BA%A1i%20S%E1%BA%A3nh');
    const lobbyPhotos = JSON.parse(filterLobbyRes.body).data.items;
    assert(lobbyPhotos.length > 0, `Lọc không gian Đại Sảnh nhận được ${lobbyPhotos.length} ảnh`);
    assert(lobbyPhotos.every(p => p.category === 'Đại Sảnh'), '100% ảnh trả về thuộc không gian Đại Sảnh');

    // Kiểm tra bảo mật mã PIN khi thêm ảnh mới vào Album (Upload vô hạn)
    const invalidUpload = await post('http://localhost:3000/api/v1/album-photos', {
      title: 'Ảnh test sai PIN',
      image_url: 'https://example.com/test.jpg',
      pin: '9999'
    });
    assert(invalidUpload.status === 403, 'Chặn đứng hành vi thêm ảnh khi sai mã PIN (HTTP 403)');

    const validUpload = await post('http://localhost:3000/api/v1/album-photos', {
      title: 'Biệt Thự Vườn Thảo Điền - Vách Marble Trắng',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      category: 'Đại Sảnh',
      project_name: 'Biệt Thự Thảo Điền',
      stone_name: 'Calacatta Michelangelo Marble',
      description: 'Không gian đại sảnh ốp đá cẩm thạch trắng tự nhiên sang trọng',
      pin: '1234'
    });
    assert(validUpload.status === 201, 'Thêm ảnh mới vào kho Album vô hạn thành công với mã PIN chuẩn (HTTP 201)');

    // 13. Kiểm tra API Lookbook phân trang (3 dự án / trang)
    const lookbookP1 = await get('http://localhost:3000/api/v1/lookbook?page=1&limit=3');
    assert(lookbookP1.status === 200, 'API /api/v1/lookbook trả về mã 200');
    const lbData1 = JSON.parse(lookbookP1.body).data;
    assert(lbData1.items.length === 3, 'Trang 1 lookbook trả về đúng 3 công trình');
    assert(lbData1.total === 6, 'Tổng cộng có 6 công trình tiêu biểu');
    assert(lbData1.total_pages === 2, 'Tổng số trang lookbook là 2');

    // 14. Kiểm tra API Chi tiết Album công trình
    const firstProjId = lbData1.items[0].id;
    const albumDetailRes = await get(`http://localhost:3000/api/v1/lookbook/${firstProjId}`);
    assert(albumDetailRes.status === 200, 'API chi tiết công trình phản hồi 200');
    const albumDetail = JSON.parse(albumDetailRes.body).data;
    assert(albumDetail.album && albumDetail.album.length >= 4, `Công trình #${firstProjId} trả về album ảnh đầy đủ (nhận được: ${albumDetail.album.length})`);

    // 15. Kiểm tra Bảng Quản Trị Hệ Thống Toàn Diện (/admin & APIs Quản trị)
    const adminPageRes = await get('http://localhost:3000/admin');
    assert(adminPageRes.status === 200, 'Trang /admin phản hồi HTTP 200');
    assert(adminPageRes.body.includes('QUEEN STONE ADMIN'), 'Trang quản trị có tiêu đề QUEEN STONE ADMIN');
    assert(adminPageRes.body.includes('Cấu Hình Logo Website'), 'Trang quản trị có Tab 1: Cấu Hình Logo Website');
    assert(adminPageRes.body.includes('Phiến Đá Độc Bản & Tồn Kho'), 'Trang quản trị có Tab 2: Phiến Đá Độc Bản & Tồn Kho');
    assert(adminPageRes.body.includes('Album Đá Tự Nhiên'), 'Trang quản trị có Tab 3: Album Đá Tự Nhiên');
    assert(adminPageRes.body.includes('Liên Hệ & Showroom Vô Hạn'), 'Trang quản trị có Tab 4: Liên Hệ & Showroom Vô Hạn');
    assert(adminPageRes.body.includes('320px x 64px'), 'Tab 1 có chú thích kích thước chuẩn Logo 320px x 64px');
    assert(adminPageRes.body.includes('1200 x 800 px'), 'Có chú thích kích thước ảnh Slab/Album 1200 x 800 px');

    // Kiểm tra Xác thực Đăng nhập Quản Trị
    const validLogin = await post('http://localhost:3000/api/v1/admin/login', { username: 'Admin', password: '8888' });
    assert(validLogin.status === 200, 'Đăng nhập Quản Trị với User: Admin / Pass: 8888 thành công (HTTP 200)');
    const loginData = JSON.parse(validLogin.body);
    assert(loginData.success === true && !!loginData.token, 'Đăng nhập trả về token phiên làm việc hợp lệ');

    const invalidLogin = await post('http://localhost:3000/api/v1/admin/login', { username: 'Admin', password: 'sai_mat_khau' });
    assert(invalidLogin.status === 401, 'Chặn đứng khi nhập sai mật khẩu Quản Trị (HTTP 401)');

    // Kiểm tra API Cấu hình Hệ thống (Settings)
    const settingsGet = await get('http://localhost:3000/api/v1/settings');
    assert(settingsGet.status === 200, 'API /api/v1/settings phản hồi HTTP 200');
    const settingsData = JSON.parse(settingsGet.body).data;
    assert(!!settingsData.logo_url, 'Cấu hình hệ thống có logo_url hợp nhất');

    // Kiểm tra Rào chắn An ninh: Gọi API admin không có Token phải trả về 401 Unauthorized
    const unauthUpload = await post('http://localhost:3000/api/v1/admin/upload', {
      filename: 'e2e_test_unauth.png',
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    });
    assert(unauthUpload.status === 401, 'API /api/v1/admin/upload chặn truy cập khi không có token (HTTP 401)');
    const authHeader = { 'Authorization': `Bearer ${loginData.token}` };

    // Kiểm tra API Upload ảnh trực tiếp khi CÓ Token hợp lệ
    const uploadRes = await post('http://localhost:3000/api/v1/admin/upload', {
      filename: 'e2e_test_logo.png',
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    }, authHeader);
    assert(uploadRes.status === 201, 'API /api/v1/admin/upload tải ảnh thành công khi có token (HTTP 201)');
    const uploadData = JSON.parse(uploadRes.body);
    assert(uploadData.url && uploadData.url.startsWith('/uploads/'), 'Upload trả về URL ảnh hợp lệ trong thư mục /uploads/');

    // Dọn dẹp tệp thử nghiệm sau khi xác thực để không gây ô nhiễm thư mục uploads
    if (uploadData.url) {
      const relPath = uploadData.url.replace(/^\/+/, '');
      const testFilePath = path.join(__dirname, '..', 'public', relPath);
      if (fs.existsSync(testFilePath)) {
        try { fs.unlinkSync(testFilePath); } catch (e) {}
      }
    }

    // Kiểm tra API CRUD Phiến đá
    const addStoneRes = await post('http://localhost:3000/api/v1/admin/stones', {
      ma_lo: 'QS-E2E-888',
      ten_da: 'Đá Marble Trắng Tuyết E2E',
      loai_da: 'Marble',
      mau_sac: 'Trắng',
      xuat_xu: 'Ý',
      chieu_dai_mm: 2800,
      chieu_rong_mm: 1600,
      so_luong_tam: 8
    }, authHeader);
    assert(addStoneRes.status === 201, 'API POST /api/v1/admin/stones thêm phiến đá thành công (HTTP 201)');
    const newStone = JSON.parse(addStoneRes.body).data;

    // Sửa số lượng tồn kho
    const editStoneRes = await put(`http://localhost:3000/api/v1/admin/stones/${newStone.id}`, {
      so_luong_tam: 12
    }, authHeader);
    assert(editStoneRes.status === 200, 'API PUT /api/v1/admin/stones/:id sửa số lượng tồn thành công (HTTP 200)');
    const updatedStone = JSON.parse(editStoneRes.body).data;
    assert(updatedStone.so_luong_tam === 12, 'Lượng tồn phiến đá được cập nhật lên 12 tấm');

    // Xóa phiến đá test
    const deleteStoneRes = await del(`http://localhost:3000/api/v1/admin/stones/${newStone.id}`, authHeader);
    assert(deleteStoneRes.status === 200, 'API DELETE /api/v1/admin/stones/:id xóa phiến đá thành công (HTTP 200)');

    // Kiểm tra API Showroom vô hạn
    const addDepotRes = await post('http://localhost:3000/api/v1/admin/depots', {
      id: 'SHOWROOM_E2E_01',
      ten_co_so: 'Showroom E2E Test',
      loai: 'Showroom Trưng Bày',
      dia_chi: '123 Đường Test, Hà Nội',
      hotline: '0988.111.222'
    }, authHeader);
    assert(addDepotRes.status === 201, 'API POST /api/v1/admin/depots thêm Showroom mới thành công (HTTP 201)');
    const deleteDepotRes = await del('http://localhost:3000/api/v1/admin/depots/SHOWROOM_E2E_01', authHeader);
    assert(deleteDepotRes.status === 200, 'API DELETE /api/v1/admin/depots/:id xóa Showroom thành công (HTTP 200)');

    // Kiểm tra Trang chủ có Logo hợp nhất dạng ảnh & Modal Đăng nhập Quản Trị
    assert(homeRes.body.includes('queen_stone_logo_unified.svg'), 'Trang chủ sử dụng Logo hợp nhất dạng ảnh');
    assert(homeRes.body.includes('formAdminHomeLogin'), 'Trang chủ có Form Đăng Nhập Quản Trị Viên formAdminHomeLogin');
    assert(homeRes.body.includes('homeLoginUser'), 'Form có trường nhập Tên Đăng Nhập');
    assert(homeRes.body.includes('homeLoginPass'), 'Form có trường nhập Mật Khẩu');

    console.log('\n================================================================================');
    console.log(`📊 KẾT QUẢ E2E: ${passed + failed} test | ✅ ${passed} PASS | ❌ ${failed} FAIL`);
    console.log('================================================================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Lỗi E2E:', err);
    process.exit(1);
  }
}

runE2ETests();
