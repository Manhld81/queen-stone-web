/**
 * EXPRESS SERVER & REST API
 * Queen Stone Lab 03 - Vibe Coding Framework v5.0
 * Cổng giao tiếp REST API chuẩn hóa ApiResult<T> kết nối Mặt Tiền Dinh Thự với Bộ Não Kế Toán
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { getDb } = require('./db/database');
const { stoneService } = require('../core_modules/stone-service');
const { resolveGoogleMapEmbed } = require('../core_modules/map-resolver');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '8888';
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

// Middleware An Ninh Chuẩn Web Internet (Security Headers: Clickjacking, MIME-sniffing, XSS)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Thư mục lưu trữ ảnh tải lên (Uploads)
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Cấu hình Middleware (Hỗ trợ upload ảnh base64 dung lượng cao)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/**
 * Tự động xóa file logo hoặc file upload mồ côi không còn dùng
 */
function cleanupOrphanedUploads(activeLogoUrl) {
  try {
    const db = getDb();
    const stones = db.prepare('SELECT hinh_anh_slab, hinh_anh_macro FROM san_pham_da').all();
    const albums = db.prepare('SELECT image_url FROM album_photos').all();
    const depots = db.prepare('SELECT hinh_anh FROM showroom_kho').all();
    const allUsed = new Set([activeLogoUrl]);
    stones.forEach(s => { allUsed.add(s.hinh_anh_slab); allUsed.add(s.hinh_anh_macro); });
    albums.forEach(a => allUsed.add(a.image_url));
    depots.forEach(d => allUsed.add(d.hinh_anh));

    if (fs.existsSync(UPLOAD_DIR)) {
      const files = fs.readdirSync(UPLOAD_DIR);
      files.forEach(f => {
        const webPath = '/uploads/' + f;
        if (!allUsed.has(webPath)) {
          try {
            fs.unlinkSync(path.join(UPLOAD_DIR, f));
            console.log(`[CLEANUP] Đã xóa vĩnh viễn file logo cũ: ${f}`);
          } catch (err) {}
        }
      });
    }
  } catch (err) {
    console.error('[CLEANUP] Lỗi dọn dẹp file uploads:', err);
  }
}

/**
 * Đồng bộ đường dẫn logo mới vào các file HTML tĩnh trên ổ đĩa
 */
function syncHtmlLogo(newLogoUrl) {
  try {
    ['index.html', 'album.html'].forEach(filename => {
      const filePath = path.join(__dirname, '..', 'public', filename);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(
          /(<img id="siteBrandLogo" src=")[^"]*(")/,
          `$1${newLogoUrl}$2`
        );
        fs.writeFileSync(filePath, content, 'utf8');
      }
    });
  } catch (err) {
    console.error('[SYNC_HTML_LOGO] Lỗi đồng bộ HTML logo:', err);
  }
}

/**
 * Phục vụ trang HTML có sẵn Logo cập nhật từ CSDL (chống giật/lộ ảnh cũ)
 */
function serveHtmlWithInjectedLogo(filePath, res) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    const settings = stoneService.getSettings();
    const activeLogo = settings?.data?.logo_url;
    if (activeLogo) {
      html = html.replace(
        /(<img id="siteBrandLogo" src=")[^"]*(")/,
        `$1${activeLogo}$2`
      );
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e) {
    res.sendFile(filePath);
  }
}

// Phục vụ HTML với Logo cập nhật tức thì (SSR Dynamic Injection)
app.get(['/', '/index.html'], (req, res) => {
  serveHtmlWithInjectedLogo(path.join(__dirname, '..', 'public', 'index.html'), res);
});
app.get('/album.html', (req, res) => {
  serveHtmlWithInjectedLogo(path.join(__dirname, '..', 'public', 'album.html'), res);
});

// Phục vụ Favicon biểu tượng Vương miện Hoàng gia trực tiếp
app.get(['/favicon.ico', '/favicon.svg'], (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.sendFile(path.join(__dirname, '..', 'public', 'assets', 'favicon_crown.svg'));
});

// Health Check Endpoint cho Koyeb / Render / Cloud Monitoring
app.get(['/health', '/api/v1/health'], (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Queen Stone Web Server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Phục vụ tài nguyên tĩnh từ thư mục public/ (với Cache-Control cho hiệu suất)
app.use(express.static(path.join(__dirname, '..', 'public'), {
  setHeaders: (res, filePath) => {
    // CSS và JS: cache 1 giờ (thay đổi thường)
    if (/\.(css|js)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }
    // Ảnh, SVG, font: cache 7 ngày (thay đổi ít)
    else if (/\.(jpg|jpeg|png|webp|svg|gif|ico|woff2|woff|ttf)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=2592000');
    }
  }
}));


// Ghi log yêu cầu theo chuẩn Vibe Coding
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// ─── REST API ENDPOINTS ────────────────────────────────────────────────────────

/**
 * 1. GET /api/v1/stones: Danh sách sản phẩm đá có bộ lọc, sắp xếp mới nhất, phân trang cuộn vô tận
 */
app.get('/api/v1/stones', (req, res) => {
  try {
    const { category, color, application, page, limit, search } = req.query;
    const result = stoneService.listStones({ category, color, application, page, limit, search });
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi máy chủ khi truy xuất danh sách đá: ' + err.message
    });
  }
});

/**
 * 2. GET /api/v1/stones/:identifier: Chi tiết 1 phiến đá & ảnh soi vân vi mô
 */
app.get('/api/v1/stones/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    const result = stoneService.getStoneByLotOrId(identifier);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi máy chủ khi truy xuất chi tiết phiến đá: ' + err.message
    });
  }
});

/**
 * 3. GET /api/v1/lookbook: Danh sách các công trình dinh thự thực tế (Hỗ trợ phân trang và tương thích ngược)
 */
app.get('/api/v1/lookbook', (req, res) => {
  try {
    const db = getDb();
    const limit = parseInt(req.query.limit, 10);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    if (limit && limit > 0) {
      const offset = (page - 1) * limit;
      const countRow = db.prepare('SELECT COUNT(*) as count FROM cong_trinh').get();
      const total = countRow ? countRow.count : 0;
      const projects = db.prepare('SELECT id, ten_cong_trinh, dia_diem, loai_hinh, dien_tich, hinh_anh, da_su_dung, mo_ta, nam_hoan_thanh FROM cong_trinh ORDER BY id ASC LIMIT ? OFFSET ?').all(limit, offset);

      return res.json({
        success: true,
        data: {
          items: projects,
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit)
        }
      });
    }

    const projects = db.prepare('SELECT * FROM cong_trinh ORDER BY id ASC').all();
    res.json({
      success: true,
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi máy chủ khi lấy danh sách lookbook: ' + err.message
    });
  }
});

/**
 * 3b. GET /api/v1/lookbook/:id: Chi tiết một công trình và toàn bộ album ảnh
 */
app.get('/api/v1/lookbook/:id', (req, res) => {
  try {
    const db = getDb();
    const project = db.prepare('SELECT * FROM cong_trinh WHERE id = ?').get(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: 'Không tìm thấy công trình này.'
      });
    }

    let album = [];
    try {
      album = project.album_json ? JSON.parse(project.album_json) : [];
    } catch (e) {
      album = [];
    }

    res.json({
      success: true,
      data: {
        ...project,
        album
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi máy chủ khi lấy chi tiết công trình: ' + err.message
    });
  }
});

/**
 * 3c. GET /api/v1/album-photos: Thư viện Album Ảnh Đá Tự Nhiên (Hỗ trợ phân trang & lọc danh mục vô hạn)
 */
app.get('/api/v1/album-photos', (req, res) => {
  try {
    const db = getDb();
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const offset = (page - 1) * limit;
    const category = req.query.category && req.query.category !== 'all' ? req.query.category : null;

    let totalQuery = 'SELECT COUNT(*) as count FROM album_photos';
    let itemsQuery = 'SELECT * FROM album_photos';
    const params = [];
    const countParams = [];

    if (category) {
      totalQuery += ' WHERE category = ?';
      itemsQuery += ' WHERE category = ?';
      params.push(category);
      countParams.push(category);
    }

    itemsQuery += ' ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const countRow = db.prepare(totalQuery).get(...countParams);
    const total = countRow ? countRow.count : 0;
    const items = db.prepare(itemsQuery).all(...params);

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        has_more: offset + items.length < total
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi máy chủ khi lấy danh sách album ảnh: ' + err.message
    });
  }
});

/**
 * 3d. POST /api/v1/album-photos: Thêm ảnh mới vào Album Đá Tự Nhiên (Cổng quản trị thủ kho)
 */
app.post('/api/v1/album-photos', (req, res) => {
  try {
    const db = getDb();
    const { pin, title, image_url, category, project_name, stone_name, description } = req.body;

    if (pin !== ADMIN_PIN) {
      return res.status(403).json({
        success: false,
        code: 'INVALID_PIN',
        message: 'Mã PIN bảo mật không chính xác.'
      });
    }

    if (!title || !image_url) {
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Tiêu đề ảnh và đường dẫn ảnh là bắt buộc.'
      });
    }

    const maxOrderRow = db.prepare('SELECT MAX(sort_order) as max_order FROM album_photos').get();
    const nextOrder = (maxOrderRow && maxOrderRow.max_order ? maxOrderRow.max_order : 0) + 1;

    const result = db.prepare(`
      INSERT INTO album_photos (title, image_url, category, project_name, stone_name, description, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      title.trim(),
      image_url.trim(),
      category ? category.trim() : 'Đại Sảnh',
      project_name ? project_name.trim() : 'Dinh Thự Hoàng Gia',
      stone_name ? stone_name.trim() : 'Cẩm thạch Marble Ý',
      description ? description.trim() : '',
      nextOrder
    );

    const newPhoto = db.prepare('SELECT * FROM album_photos WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Đã thêm ảnh vào Album Đá Tự Nhiên thành công!',
      data: newPhoto
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi máy chủ khi thêm ảnh vào album: ' + err.message
    });
  }
});

/**
 * 4. GET /api/v1/depots: Mạng lưới 4 tổng kho chiến lược toàn quốc
 */
app.get('/api/v1/depots', (req, res) => {
  try {
    const db = getDb();
    const depots = db.prepare('SELECT * FROM showroom_kho').all();
    res.json({
      success: true,
      data: depots
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi máy chủ khi lấy danh sách tổng kho: ' + err.message
    });
  }
});

/**
 * 5. POST /api/v1/warehouse/export: Xuất kho đá (Thủ kho nhập PIN 4 số, Atomic Transaction)
 */
app.post('/api/v1/warehouse/export', (req, res) => {
  try {
    const { ma_lo, so_tam, pin, nguoi_xuat, ten_cong_trinh, ghi_chu } = req.body;
    const result = stoneService.exportStone({
      ma_lo,
      so_tam,
      pin,
      nguoi_xuat,
      ten_cong_trinh,
      ghi_chu
    });

    if (!result.success) {
      const statusCode = result.code === 'INVALID_PIN' ? 401 : 400;
      return res.status(statusCode).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi khi thực thi giao dịch xuất kho: ' + err.message
    });
  }
});

/**
 * 6. GET /api/v1/warehouse/stats: Thống kê quản trị kho cho Admin
 */
app.get('/api/v1/warehouse/stats', (req, res) => {
  try {
    const result = stoneService.getWarehouseStats();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Lỗi máy chủ khi lấy thống kê tồn kho: ' + err.message
    });
  }
});

/**
 * 7. GET /api/v1/health: Kiểm tra sức khỏe hệ thống
 */
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    status: 'ONLINE',
    app: 'Queen Stone Architectural Gallery Web',
    timestamp: new Date().toISOString()
  });
});

// ─── ADMIN MANAGEMENT REST API (CỔNG QUẢN TRỊ VIÊN) ──────────────────────────

// Middleware Xác Thực Quản Trị Viên (Admin Authentication Guard)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'qs_token_admin_8888';

function requireAdminAuth(req, res, next) {
  // Cho phép gọi API đăng nhập không cần token
  if (req.path === '/login') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

  if (token && token === ADMIN_TOKEN) {
    return next();
  }

  return res.status(401).json({
    success: false,
    code: 'UNAUTHORIZED',
    message: 'Yêu cầu quyền Quản Trị Viên (Token không hợp lệ hoặc đã hết hạn).'
  });
}

app.use('/api/v1/admin', requireAdminAuth);

/**
 * 8. POST /api/v1/admin/login: Xác thực Đăng nhập Quản Trị (User: Admin / Pass: 8888)
 */
app.post('/api/v1/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        token: ADMIN_TOKEN,
        user: ADMIN_USERNAME,
        message: 'Đăng nhập Quản Trị Viên thành công!'
      });
    }
    return res.status(401).json({
      success: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xác thực: ' + err.message });
  }
});

/**
 * 9. POST /api/v1/admin/upload: Upload tệp ảnh trực tiếp từ máy tính lên public/uploads/
 */
app.post('/api/v1/admin/upload', (req, res) => {
  try {
    const { filename, base64 } = req.body;
    if (!base64) {
      return res.status(400).json({ success: false, message: 'Dữ liệu ảnh base64 không được để trống.' });
    }

    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = 'jpg';
    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('svg')) ext = 'svg';
      else if (mime.includes('webp')) ext = 'webp';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64, 'base64');
    }

    const safeBase = filename ? path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_') : 'image';
    const cleanName = safeBase.replace(/\.[^/.]+$/, '');
    const uniqueFilename = `qs_${Date.now()}_${cleanName}.${ext}`;
    const destPath = path.join(UPLOAD_DIR, uniqueFilename);

    fs.writeFileSync(destPath, buffer);

    res.status(201).json({
      success: true,
      url: `/uploads/${uniqueFilename}`,
      filename: uniqueFilename,
      message: 'Tải tệp ảnh lên máy chủ thành công!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải ảnh lên: ' + err.message });
  }
});

/**
 * 10. GET /api/v1/settings & PUT /api/v1/admin/settings: Cấu hình Logo & Thương hiệu
 */
app.get('/api/v1/settings', (req, res) => {
  try {
    const result = stoneService.getSettings();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/v1/admin/settings', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.map_embed_url) {
      const rawInput = payload.map_embed_url;
      const mapInfo = await resolveGoogleMapEmbed(rawInput);
      payload.map_embed_url = mapInfo.embedUrl;
      payload.google_map_search_url = mapInfo.directUrl;
      payload.raw_map_link = rawInput;
    }

    // Xóa file logo cũ trên đĩa khi thay thế Logo mới
    if (payload.logo_url) {
      const currentSettings = stoneService.getSettings();
      const oldLogo = currentSettings?.data?.logo_url;
      if (oldLogo && oldLogo !== payload.logo_url && oldLogo.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, '..', 'public', oldLogo);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
            console.log(`[DELETE_OLD_LOGO] Đã xóa vĩnh viễn file logo cũ: ${oldFilePath}`);
          } catch (err) {
            console.warn('[DELETE_OLD_LOGO] Không thể xóa file logo cũ:', err.message);
          }
        }
      }
      // Dọn dẹp tất cả các file logo mồ côi
      cleanupOrphanedUploads(payload.logo_url);
      // Cập nhật thẻ img logo trong file index.html và album.html trên đĩa
      syncHtmlLogo(payload.logo_url);
    }

    const result = stoneService.updateSettings(payload);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 11. PHIẾN ĐÁ TỰ NHIÊN ĐỘC BẢN: Thêm, Sửa (kèm tồn kho), Xóa (CRUD)
 */
app.post('/api/v1/admin/stones', (req, res) => {
  try {
    const result = stoneService.createStone(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/v1/admin/stones/:id', (req, res) => {
  try {
    const result = stoneService.updateStone(req.params.id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/v1/admin/stones/:id', (req, res) => {
  try {
    const result = stoneService.deleteStone(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 12. ALBUM ĐÁ TỰ NHIÊN: Sửa & Xóa ảnh trong kho album
 */
app.put('/api/v1/admin/album-photos/:id', (req, res) => {
  try {
    const result = stoneService.updateAlbumPhoto(req.params.id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/v1/admin/album-photos/:id', (req, res) => {
  try {
    const result = stoneService.deleteAlbumPhoto(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 13. HỆ THỐNG SHOWROOM & KHO BÃI: Thêm vô hạn, Sửa, Xóa (CRUD)
 */
app.post('/api/v1/admin/depots', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.google_map_url) {
      const rawMap = data.google_map_url;
      const mapInfo = await resolveGoogleMapEmbed(rawMap);
      data.google_map_url = mapInfo.directUrl;
      data.google_map_embed_url = mapInfo.embedUrl;
      data.raw_map_link = rawMap;
    }
    const result = stoneService.createDepot(data);
    res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/v1/admin/depots/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.google_map_url) {
      const rawMap = data.google_map_url;
      const mapInfo = await resolveGoogleMapEmbed(rawMap);
      data.google_map_url = mapInfo.directUrl;
      data.google_map_embed_url = mapInfo.embedUrl;
      data.raw_map_link = rawMap;
    }
    const result = stoneService.updateDepot(req.params.id, data);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/v1/admin/depots/:id', (req, res) => {
  try {
    const result = stoneService.deleteDepot(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Điều hướng trang Quản Trị Viên
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

// Điều hướng mặc định cho SPA / Trang chủ
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Khởi chạy server nếu chạy trực tiếp
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`================================================================================`);
    console.log(`👑 QUEEN STONE WEB SERVER RUNNING ON: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`================================================================================`);
  });
}

// ─── GRACEFUL SHUTDOWN (DOCKER / CLOUD CONTAINER RESILIENCE) ──────────────────
function handleGracefulShutdown(signal) {
  console.log(`\n[SHUTDOWN] Nhận tín hiệu ${signal}. Đang đóng kết nối máy chủ và CSDL an toàn...`);
  try {
    const db = getDb();
    if (db && typeof db.close === 'function') {
      db.close();
      console.log('[SHUTDOWN] Đã đóng kết nối SQLite thành công.');
    }
  } catch (e) {
    console.error('[SHUTDOWN] Lỗi khi đóng CSDL:', e.message);
  }
  process.exit(0);
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

module.exports = app;

