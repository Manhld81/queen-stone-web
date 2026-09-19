/**
 * QUEEN STONE ADMIN PORTAL CONTROLLER (admin.js)
 * Chuẩn mực Vibe Coding Framework v5.0
 * Điều khiển 4 Tab Quản Trị: Logo, Phiến Đá Độc Bản & Tồn Kho, Album Ảnh, Showroom Toàn Quốc
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initTabNavigation();
  initLogoModule();
  initStonesModule();
  initAlbumModule();
  initContactAndShowroomModule();
});

// ─── TỰ ĐỘNG ĐÍNH KÈM TOKEN XÁC THỰC QUẢN TRỊ VIÊN ──────────────────────────
const _nativeFetch = window.fetch;
window.fetch = function (url, options = {}) {
  const urlStr = typeof url === 'string' ? url : (url && url.url ? url.url : '');
  if (urlStr.includes('/api/v1/admin') && !urlStr.includes('/api/v1/admin/login')) {
    const token = localStorage.getItem('queen_stone_admin_token') || 'qs_token_admin_8888';
    options.headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    };
  }
  return _nativeFetch(url, options);
};

/* ==========================================================================
   0. THÔNG BÁO TOAST & HELPER DÙNG CHUNG
   ========================================================================== */
function showToast(message, type = 'success') {
  const toast = document.getElementById('adminToast');
  if (!toast) return;

  toast.className = `admin-toast show ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '👑' : '⚠️'}</span>
    <span>${message}</span>
  `;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Upload file helper: Chuyển File sang Base64 và POST lên /api/v1/admin/upload
async function uploadFileToServer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const response = await fetch('/api/v1/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64: reader.result
          })
        });
        const data = await response.json();
        if (data.success) {
          resolve(data.url);
        } else {
          reject(new Error(data.message || 'Lỗi tải ảnh lên.'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Lỗi đọc tệp từ máy tính.'));
    reader.readAsDataURL(file);
  });
}

/* ==========================================================================
   1. BẢO MẬT & XÁC THỰC ĐĂNG NHẬP (USER: Admin / PASS: 8888)
   ========================================================================== */
function initAdminAuth() {
  const authLock = document.getElementById('adminAuthLock');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('adminLoginForm');
  const errorBox = document.getElementById('authErrorMsg');
  const btnLogout = document.getElementById('btnLogout');

  // Kiểm tra Session Token đã lưu
  const savedToken = localStorage.getItem('queen_stone_admin_token');
  if (savedToken === 'qs_token_admin_8888') {
    document.documentElement.classList.add('is-authenticated');
    authLock.style.display = 'none';
    adminApp.style.display = 'block';
  } else {
    document.documentElement.classList.remove('is-authenticated');
    authLock.style.display = 'flex';
    adminApp.style.display = 'none';
  }

  // Xử lý Form Đăng Nhập
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('authUsername').value.trim();
      const password = document.getElementById('authPassword').value.trim();

      if (!username || !password) {
        errorBox.textContent = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
        errorBox.style.display = 'block';
        return;
      }

      try {
        const res = await fetch('/api/v1/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const result = await res.json();

        if (result.success) {
          localStorage.setItem('queen_stone_admin_token', result.token);
          document.documentElement.classList.add('is-authenticated');
          authLock.style.display = 'none';
          adminApp.style.display = 'block';
          showToast('Chào mừng Quản Trị Viên đăng nhập thành công!');
          // Tải dữ liệu các phân hệ
          loadAllAdminData();
        } else {
          errorBox.textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!';
          errorBox.style.display = 'block';
        }
      } catch (err) {
        errorBox.textContent = 'Lỗi kết nối máy chủ: ' + err.message;
        errorBox.style.display = 'block';
      }
    });
  }

  // Đăng xuất
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Anh Mike có chắc chắn muốn đăng xuất khỏi Bảng Quản Trị?')) {
        localStorage.removeItem('queen_stone_admin_token');
        document.documentElement.classList.remove('is-authenticated');
        window.location.href = '/';
      }
    });
  }
}

function loadAllAdminData() {
  loadLogoConfig();
  loadStonesList();
  loadAlbumPhotos();
  loadContactAndDepots();
}

/* ==========================================================================
   2. ĐIỀU HƯỚNG TABS THEO 4 THỨ TỰ YÊU CẦU
   ========================================================================== */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Đóng Modal khi bấm nút đóng hoặc nút Hủy
  document.querySelectorAll('.modal-close, .btn-secondary-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('open');
    });
  });
}

/* ==========================================================================
   TAB 1: CẤU HÌNH LOGO WEBSITE (LOGO & THƯƠNG HIỆU)
   ========================================================================== */
async function loadLogoConfig() {
  try {
    const res = await fetch('/api/v1/settings');
    const result = await res.json();
    if (result.success && result.data) {
      const logoUrl = result.data.logo_url || '/assets/queen_stone_logo_unified.svg';
      updateLogoPreview(logoUrl);
      document.getElementById('inputLogoUrl').value = logoUrl;
    }
  } catch (e) {
    console.error('Lỗi tải cấu hình logo:', e);
  }
}

function updateLogoPreview(url) {
  const pLight = document.getElementById('logoPreviewLight');
  const pDark = document.getElementById('logoPreviewDark');
  const hLogo = document.getElementById('adminHeaderLogo');
  if (pLight) pLight.src = url;
  if (pDark) pDark.src = url;
  if (hLogo) hLogo.src = url;
}

function initLogoModule() {
  const fileInput = document.getElementById('inputLogoFile');
  const urlInput = document.getElementById('inputLogoUrl');
  const form = document.getElementById('formUpdateLogo');

  // Chọn ảnh từ máy tính -> Upload ngay -> Cập nhật ô input & Preview
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        showToast('Đang tải ảnh logo lên máy chủ...', 'info');
        const uploadedUrl = await uploadFileToServer(file);
        urlInput.value = uploadedUrl;
        updateLogoPreview(uploadedUrl);
        showToast('Tải ảnh logo lên thành công! Bấm "Lưu" để áp dụng.');
      } catch (err) {
        showToast('Lỗi tải tệp: ' + err.message, 'error');
      }
    });
  }

  // Thay đổi URL thủ công -> Xem trước
  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) updateLogoPreview(val);
    });
  }

  // Lưu Cập nhật Logo vào Hệ thống
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newLogoUrl = urlInput.value.trim();
      if (!newLogoUrl) {
        showToast('Vui lòng chọn ảnh hoặc nhập đường dẫn Logo.', 'error');
        return;
      }

      try {
        const res = await fetch('/api/v1/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logo_url: newLogoUrl })
        });
        const result = await res.json();
        if (result.success) {
          updateLogoPreview(newLogoUrl);
          showToast('✅ Đã cập nhật Logo mới trên toàn bộ hệ thống Queen Stone!');
        } else {
          showToast('Lỗi cập nhật: ' + result.message, 'error');
        }
      } catch (err) {
        showToast('Lỗi kết nối: ' + err.message, 'error');
      }
    });
  }

  loadLogoConfig();
}

/* ==========================================================================
   TAB 2: PHIẾN ĐÁ TỰ NHIÊN ĐỘC BẢN & QUẢN LÝ TỒN KHO
   ========================================================================== */
let allStones = [];

async function loadStonesList() {
  const tbody = document.getElementById('stoneTableBody');
  if (!tbody) return;

  try {
    // 1. Tải thống kê tồn kho (KPI Cards)
    const statsRes = await fetch('/api/v1/warehouse/stats');
    const statsResult = await statsRes.json();
    if (statsResult.success && statsResult.data) {
      document.getElementById('kpiTotalStones').textContent = statsResult.data.tong_so_lo_da || 0;
      document.getElementById('kpiTotalM2').textContent = (statsResult.data.tong_dien_tich_m2 || 0) + ' m²';
      document.getElementById('kpiTotalSlabs').textContent = (statsResult.data.tong_so_tam || 0) + ' tấm';
      document.getElementById('kpiOutOfStock').textContent = statsResult.data.so_lo_het_hang || 0;
    }

    // 2. Tải danh sách toàn bộ sản phẩm đá
    const stonesRes = await fetch('/api/v1/stones?limit=100');
    const stonesResult = await stonesRes.json();
    if (stonesResult.success && stonesResult.data) {
      allStones = stonesResult.data.items || [];
      renderStonesTable(allStones);
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="9" style="color: var(--color-danger); text-align: center; padding: 2rem;">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
  }
}

function renderStonesTable(stones) {
  const tbody = document.getElementById('stoneTableBody');
  if (!tbody) return;

  if (stones.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">Không tìm thấy phiến đá nào phù hợp.</td></tr>';
    return;
  }

  tbody.innerHTML = stones.map(s => {
    const isOutOfStock = s.so_luong_tam <= 0;
    return `
      <tr>
        <td>
          <img src="${s.hinh_anh_slab}" alt="${s.ten_da}" class="thumb-slab" title="Nhấp xem phóng to" onclick="window.open('${s.hinh_anh_slab}', '_blank')" />
        </td>
        <td>
          <span class="badge-malo">${s.ma_lo}</span>
        </td>
        <td>
          <div style="font-weight: 700; color: #FFF;">${s.ten_da}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${s.xuat_xu || 'Ý'}</div>
        </td>
        <td>
          <span style="font-weight: 600;">${s.loai_da}</span>
        </td>
        <td style="font-family: var(--font-mono); font-size: 0.82rem;">
          ${s.chieu_dai_mm} x ${s.chieu_rong_mm} x ${s.do_day_mm} mm
        </td>
        <td style="text-align: center;">
          <strong style="font-size: 1.1rem; color: ${isOutOfStock ? 'var(--color-danger)' : 'var(--gold-light)'};">${s.so_luong_tam}</strong> tấm
        </td>
        <td style="text-align: right; font-weight: 700;">
          ${s.dien_tich_m2} m²
        </td>
        <td style="text-align: center;">
          <span class="stock-pill ${isOutOfStock ? 'out-of-stock' : 'in-stock'}">
            ${isOutOfStock ? 'HẾT LÔ' : 'CÒN HÀNG'}
          </span>
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-table-edit" onclick="openEditStoneModal(${s.id})" title="Chỉnh sửa phiến đá và số lượng tồn">Sửa</button>
            <button class="btn-table-delete" onclick="handleDeleteStone(${s.id}, '${s.ma_lo}')" title="Xóa phiến đá này">Xóa</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function initStonesModule() {
  const searchInput = document.getElementById('stoneSearchInput');
  const catFilter = document.getElementById('stoneFilterCategory');
  const stockFilter = document.getElementById('stoneFilterStock');
  const btnOpenAdd = document.getElementById('btnOpenAddStoneModal');

  function applyStoneFilters() {
    const q = searchInput.value.toLowerCase().trim();
    const cat = catFilter.value;
    const stock = stockFilter.value;

    const filtered = allStones.filter(s => {
      const matchQuery = !q || s.ma_lo.toLowerCase().includes(q) || s.ten_da.toLowerCase().includes(q) || (s.xuat_xu && s.xuat_xu.toLowerCase().includes(q));
      const matchCat = cat === 'all' || s.loai_da === cat;
      const matchStock = stock === 'all' || (stock === 'in_stock' ? s.so_luong_tam > 0 : s.so_luong_tam <= 0);
      return matchQuery && matchCat && matchStock;
    });

    renderStonesTable(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyStoneFilters);
  if (catFilter) catFilter.addEventListener('change', applyStoneFilters);
  if (stockFilter) stockFilter.addEventListener('change', applyStoneFilters);

  if (btnOpenAdd) {
    btnOpenAdd.addEventListener('click', () => {
      openAddStoneModal();
    });
  }

  // Upload ảnh Slab và Macro trong Modal
  setupImageUploader('uploadStoneSlab', 'stoneHinhAnhSlab');
  setupImageUploader('uploadStoneMacro', 'stoneHinhAnhMacro');

  // Submit Modal Form
  const formStone = document.getElementById('formStoneModal');
  if (formStone) {
    formStone.addEventListener('submit', async (e) => {
      e.preventDefault();
      const stoneId = document.getElementById('stoneId').value;
      const payload = {
        ma_lo: document.getElementById('stoneMaLo').value.trim(),
        ten_da: document.getElementById('stoneTenDa').value.trim(),
        loai_da: document.getElementById('stoneLoaiDa').value,
        mau_sac: document.getElementById('stoneMauSac').value.trim(),
        xuat_xu: document.getElementById('stoneXuatXu').value.trim(),
        be_mat: document.getElementById('stoneBeMat').value.trim(),
        chieu_dai_mm: parseInt(document.getElementById('stoneChieuDai').value, 10),
        chieu_rong_mm: parseInt(document.getElementById('stoneChieuRong').value, 10),
        do_day_mm: parseInt(document.getElementById('stoneDoDay').value, 10) || 20,
        so_luong_tam: parseInt(document.getElementById('stoneSoLuongTam').value, 10) || 0,
        dien_tich_m2: parseFloat(document.getElementById('stoneDienTichM2').value) || 0,
        ung_dung: document.getElementById('stoneUngDung').value.trim(),
        hinh_anh_slab: document.getElementById('stoneHinhAnhSlab').value.trim(),
        hinh_anh_macro: document.getElementById('stoneHinhAnhMacro').value.trim(),
        mo_ta: document.getElementById('stoneMoTa').value.trim()
      };

      try {
        const url = stoneId ? `/api/v1/admin/stones/${stoneId}` : '/api/v1/admin/stones';
        const method = stoneId ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (result.success) {
          showToast(result.message || 'Lưu phiến đá thành công!');
          document.getElementById('modalStone').classList.remove('open');
          loadStonesList();
        } else {
          showToast('Lỗi: ' + result.message, 'error');
        }
      } catch (err) {
        showToast('Lỗi kết nối: ' + err.message, 'error');
      }
    });
  }

  loadStonesList();
}

function openAddStoneModal() {
  document.getElementById('modalStoneTitle').textContent = 'Thêm Phiến Đá Mới Về Kho';
  document.getElementById('stoneId').value = '';
  document.getElementById('formStoneModal').reset();
  document.getElementById('stoneBeMat').value = 'Polished (Bóng gương)';
  document.getElementById('stoneDoDay').value = '20';
  document.getElementById('stoneSoLuongTam').value = '10';
  document.getElementById('stoneDienTichM2').value = '';
  document.getElementById('modalStone').classList.add('open');
}

window.openEditStoneModal = function(id) {
  const stone = allStones.find(s => s.id === id);
  if (!stone) return;

  document.getElementById('modalStoneTitle').textContent = `Chỉnh Sửa Phiến Đá: ${stone.ma_lo}`;
  document.getElementById('stoneId').value = stone.id;
  document.getElementById('stoneMaLo').value = stone.ma_lo;
  document.getElementById('stoneTenDa').value = stone.ten_da;
  document.getElementById('stoneLoaiDa').value = stone.loai_da;
  document.getElementById('stoneMauSac').value = stone.mau_sac;
  document.getElementById('stoneXuatXu').value = stone.xuat_xu || '';
  document.getElementById('stoneBeMat').value = stone.be_mat || 'Polished (Bóng gương)';
  document.getElementById('stoneChieuDai').value = stone.chieu_dai_mm;
  document.getElementById('stoneChieuRong').value = stone.chieu_rong_mm;
  document.getElementById('stoneDoDay').value = stone.do_day_mm || 20;
  document.getElementById('stoneSoLuongTam').value = stone.so_luong_tam;
  document.getElementById('stoneDienTichM2').value = stone.dien_tich_m2;
  document.getElementById('stoneUngDung').value = stone.ung_dung || '';
  document.getElementById('stoneHinhAnhSlab').value = stone.hinh_anh_slab;
  document.getElementById('stoneHinhAnhMacro').value = stone.hinh_anh_macro;
  document.getElementById('stoneMoTa').value = stone.mo_ta || '';

  document.getElementById('modalStone').classList.add('open');
};

window.handleDeleteStone = async function(id, maLo) {
  if (!confirm(`Anh Mike có chắc chắn muốn xóa vĩnh viễn phiến đá [${maLo}] khỏi CSDL?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/v1/admin/stones/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      showToast(result.message || `Đã xóa phiến đá ${maLo}`);
      loadStonesList();
    } else {
      showToast('Lỗi: ' + result.message, 'error');
    }
  } catch (err) {
    showToast('Lỗi kết nối: ' + err.message, 'error');
  }
};

/* ==========================================================================
   TAB 3: QUẢN LÝ ALBUM ĐÁ TỰ NHIÊN (LOOKBOOK THỰC TẾ)
   ========================================================================== */
let allAlbumPhotos = [];

async function loadAlbumPhotos() {
  const container = document.getElementById('albumCardsGrid');
  if (!container) return;

  try {
    const res = await fetch('/api/v1/album-photos?limit=200');
    const result = await res.json();
    if (result.success && result.data) {
      allAlbumPhotos = result.data.items || [];
      document.getElementById('albumTotalCount').textContent = allAlbumPhotos.length;
      renderAlbumGrid(allAlbumPhotos);
    }
  } catch (err) {
    container.innerHTML = `<div style="color: var(--color-danger); text-align: center; padding: 2rem;">Lỗi tải Album: ${err.message}</div>`;
  }
}

function renderAlbumGrid(photos) {
  const container = document.getElementById('albumCardsGrid');
  if (!container) return;

  if (photos.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted); grid-column: 1/-1;">Chưa có hình ảnh nào trong Album.</div>';
    return;
  }

  container.innerHTML = photos.map(p => `
    <div class="album-item-card">
      <img src="${p.image_url}" alt="${p.title}" class="album-item-img" loading="lazy" />
      <div class="album-item-body">
        <span class="album-item-cat">${p.category || 'Đại Sảnh'} • Thứ tự: #${p.sort_order}</span>
        <h4 class="album-item-title">${p.title}</h4>
        <div class="album-item-meta">Dự án: <strong>${p.project_name || 'Dinh Thự Hoàng Gia'}</strong></div>
        <div class="album-item-meta">Đá: <strong>${p.stone_name || 'Cẩm thạch Ý'}</strong></div>
        <p class="album-item-desc">${p.description || 'Tuyệt tác đá tự nhiên cao cấp.'}</p>
      </div>
      <div class="album-item-actions">
        <button class="btn-table-edit" style="flex: 1;" onclick="openEditAlbumModal(${p.id})">Sửa Ảnh</button>
        <button class="btn-table-delete" onclick="handleDeleteAlbum(${p.id}, '${p.title.replace(/'/g, "\\'")}')">Xóa</button>
      </div>
    </div>
  `).join('');
}

function initAlbumModule() {
  const btnOpenAdd = document.getElementById('btnOpenAddAlbumModal');
  const catPills = document.querySelectorAll('#albumCategoryFilter .pill-btn');

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-category');
      if (cat === 'all') {
        renderAlbumGrid(allAlbumPhotos);
      } else {
        const filtered = allAlbumPhotos.filter(p => p.category === cat);
        renderAlbumGrid(filtered);
      }
    });
  });

  if (btnOpenAdd) {
    btnOpenAdd.addEventListener('click', () => {
      document.getElementById('modalAlbumTitle').textContent = 'Thêm Bức Ảnh Mới Vào Album';
      document.getElementById('albumId').value = '';
      document.getElementById('formAlbumModal').reset();
      document.getElementById('albumSortOrder').value = allAlbumPhotos.length + 1;
      document.getElementById('modalAlbum').classList.add('open');
    });
  }

  setupImageUploader('uploadAlbumImage', 'albumImageUrl');

  // Submit Album Form
  const formAlbum = document.getElementById('formAlbumModal');
  if (formAlbum) {
    formAlbum.addEventListener('submit', async (e) => {
      e.preventDefault();
      const albumId = document.getElementById('albumId').value;
      const payload = {
        title: document.getElementById('albumTitle').value.trim(),
        image_url: document.getElementById('albumImageUrl').value.trim(),
        category: document.getElementById('albumCategory').value,
        sort_order: parseInt(document.getElementById('albumSortOrder').value, 10) || 1,
        project_name: document.getElementById('albumProjectName').value.trim(),
        stone_name: document.getElementById('albumStoneName').value.trim(),
        description: document.getElementById('albumDescription').value.trim(),
        pin: '1234' // Dùng PIN an toàn tương thích endpoint POST
      };

      try {
        const url = albumId ? `/api/v1/admin/album-photos/${albumId}` : '/api/v1/album-photos';
        const method = albumId ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (result.success) {
          showToast(result.message || 'Lưu ảnh Album thành công!');
          document.getElementById('modalAlbum').classList.remove('open');
          loadAlbumPhotos();
        } else {
          showToast('Lỗi: ' + result.message, 'error');
        }
      } catch (err) {
        showToast('Lỗi kết nối: ' + err.message, 'error');
      }
    });
  }

  loadAlbumPhotos();
}

window.openEditAlbumModal = function(id) {
  const photo = allAlbumPhotos.find(p => p.id === id);
  if (!photo) return;

  document.getElementById('modalAlbumTitle').textContent = `Chỉnh Sửa Ảnh Album #${photo.id}`;
  document.getElementById('albumId').value = photo.id;
  document.getElementById('albumTitle').value = photo.title;
  document.getElementById('albumImageUrl').value = photo.image_url;
  document.getElementById('albumCategory').value = photo.category || 'Đại Sảnh';
  document.getElementById('albumSortOrder').value = photo.sort_order || 1;
  document.getElementById('albumProjectName').value = photo.project_name || '';
  document.getElementById('albumStoneName').value = photo.stone_name || '';
  document.getElementById('albumDescription').value = photo.description || '';

  document.getElementById('modalAlbum').classList.add('open');
};

window.handleDeleteAlbum = async function(id, title) {
  if (!confirm(`Anh Mike có chắc chắn muốn xóa bức ảnh "${title}" khỏi Album?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/v1/admin/album-photos/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      showToast(result.message || 'Đã xóa ảnh khỏi Album.');
      loadAlbumPhotos();
    } else {
      showToast('Lỗi: ' + result.message, 'error');
    }
  } catch (err) {
    showToast('Lỗi kết nối: ' + err.message, 'error');
  }
};

/* ==========================================================================
   TAB 4: QUẢN LÝ LIÊN HỆ & SHOWROOM (THÊM VÔ HẠN SHOWROOM)
   ========================================================================== */
let allDepots = [];

async function loadContactAndDepots() {
  // 1. Tải thông tin liên hệ chung
  try {
    const setRes = await fetch('/api/v1/settings');
    const setResult = await setRes.json();
    if (setResult.success && setResult.data) {
      const cfg = setResult.data;
      if (document.getElementById('cfgCompanyName')) document.getElementById('cfgCompanyName').value = cfg.company_name || 'CÔNG TY CỔ PHẦN ĐÁ TỰ NHIÊN QUEEN STONE';
      if (document.getElementById('cfgHotline')) document.getElementById('cfgHotline').value = cfg.hotline || '0988.888.789';
      if (document.getElementById('cfgEmail')) document.getElementById('cfgEmail').value = cfg.email || 'contact@queenstone.vn';
      if (document.getElementById('cfgWorkingHours')) document.getElementById('cfgWorkingHours').value = cfg.gio_mo_cua || '08:00 — 18:30 hàng ngày';
      if (document.getElementById('cfgHeadquartersAddress')) document.getElementById('cfgHeadquartersAddress').value = cfg.dia_chi_tru_so || 'Số 88 Đại Lộ Hoàng Gia, Khu Đô Thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh';
      if (document.getElementById('cfgHeadquartersImage')) document.getElementById('cfgHeadquartersImage').value = cfg.headquarters_image || '/assets/branches/branch_tru_so_chinh.jpg';
      if (document.getElementById('cfgMapEmbedUrl')) document.getElementById('cfgMapEmbedUrl').value = cfg.raw_map_link || cfg.google_map_search_url || cfg.map_embed_url || '';
    }
  } catch (e) {
    console.error('Lỗi tải cài đặt liên hệ:', e);
  }

  // 2. Tải danh sách Showroom & Tổng kho
  const depotContainer = document.getElementById('depotCardsList');
  if (!depotContainer) return;

  try {
    const depRes = await fetch('/api/v1/depots');
    const depResult = await depRes.json();
    if (depResult.success && depResult.data) {
      allDepots = depResult.data;
      renderDepotCards(allDepots);
    }
  } catch (err) {
    depotContainer.innerHTML = `<div style="color: var(--color-danger); padding: 2rem;">Lỗi tải Showroom: ${err.message}</div>`;
  }
}

function renderDepotCards(depots) {
  const container = document.getElementById('depotCardsList');
  if (!container) return;

  if (depots.length === 0) {
    container.innerHTML = '<div style="color: var(--text-muted); padding: 2rem;">Chưa có cơ sở Showroom nào. Bấm nút "+ Thêm Showroom Mới" để thêm.</div>';
    return;
  }

  container.innerHTML = depots.map(d => `
    <div class="depot-card">
      <img src="${d.hinh_anh || '/assets/branches/branch_tru_so_chinh.jpg'}" alt="${d.ten_co_so}" class="depot-img" />
      <div class="depot-body">
        <span class="depot-badge">${d.loai || 'Showroom'}</span>
        <h4 class="depot-title">${d.ten_co_so}</h4>
        
        <div class="depot-info-row">
          <span class="depot-info-label">Địa chỉ:</span>
          <span>${d.dia_chi}</span>
        </div>
        <div class="depot-info-row">
          <span class="depot-info-label">Hotline:</span>
          <strong style="color: var(--gold-light);">${d.hotline}</strong>
        </div>
        <div class="depot-info-row">
          <span class="depot-info-label">Email:</span>
          <span>${d.email || 'contact@queenstone.vn'}</span>
        </div>
        <div class="depot-info-row">
          <span class="depot-info-label">Mở cửa:</span>
          <span>${d.gio_mo_cua || '08:00 - 18:30'}</span>
        </div>
        <div class="depot-info-row">
          <span class="depot-info-label">Sức chứa:</span>
          <span>${(d.suc_chua_m2 || 10000).toLocaleString('vi-VN')} m² đá nguyên tấm</span>
        </div>
        <div class="depot-info-row">
          <span class="depot-info-label">Thiết bị:</span>
          <span>${d.thiet_bi || 'Cẩu trục chuyên dụng'}</span>
        </div>
      </div>
      <div class="depot-actions">
        <button class="btn-table-edit" style="flex: 1;" onclick="openEditDepotModal('${d.id}')">Sửa Cơ Sở</button>
        <button class="btn-table-delete" onclick="handleDeleteDepot('${d.id}', '${d.ten_co_so.replace(/'/g, "\\'")}')">Xóa</button>
      </div>
    </div>
  `).join('');
}

function initContactAndShowroomModule() {
  // Submit Form 4A: Thông tin liên hệ chung
  const formGlobal = document.getElementById('formGlobalContact');
  if (formGlobal) {
    formGlobal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        company_name: document.getElementById('cfgCompanyName').value.trim(),
        hotline: document.getElementById('cfgHotline').value.trim(),
        email: document.getElementById('cfgEmail').value.trim(),
        gio_mo_cua: document.getElementById('cfgWorkingHours').value.trim(),
        dia_chi_tru_so: document.getElementById('cfgHeadquartersAddress').value.trim(),
        headquarters_image: document.getElementById('cfgHeadquartersImage').value.trim(),
        map_embed_url: document.getElementById('cfgMapEmbedUrl').value.trim()
      };

      try {
        const res = await fetch('/api/v1/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          showToast('✅ Đã lưu thông tin liên hệ chung toàn hệ thống!');
        } else {
          showToast('Lỗi: ' + result.message, 'error');
        }
      } catch (err) {
        showToast('Lỗi kết nối: ' + err.message, 'error');
      }
    });
  }

  setupImageUploader('uploadHeadquartersImage', 'cfgHeadquartersImage');
  setupImageUploader('uploadDepotImage', 'depotHinhAnh');

  // Nút mở Modal thêm Showroom
  const btnOpenAddDepot = document.getElementById('btnOpenAddDepotModal');
  if (btnOpenAddDepot) {
    btnOpenAddDepot.addEventListener('click', () => {
      document.getElementById('modalDepotTitle').textContent = 'Thêm Cơ Sở Showroom Mới (Vô Hạn)';
      document.getElementById('depotEditMode').value = 'create';
      document.getElementById('depotId').disabled = false;
      document.getElementById('formDepotModal').reset();
      const txtBtn = document.getElementById('txtBtnSaveDepot');
      if (txtBtn) txtBtn.textContent = 'Lưu Cơ Sở Showroom';
      document.getElementById('depotId').value = `SHOWROOM_${Date.now().toString().slice(-4)}`;
      document.getElementById('depotLoai').value = 'Showroom Trưng Bày';
      document.getElementById('depotEmail').value = 'contact@queenstone.vn';
      document.getElementById('depotGioMoCua').value = '08:00 - 18:30 (Cả Thứ 7, CN)';
      document.getElementById('depotSucChua').value = '15000';
      document.getElementById('depotThietBi').value = 'Cẩu trục chuyên dụng 10 tấn, máy quét 3D';
      document.getElementById('modalDepot').classList.add('open');
    });
  }

  // Submit Modal Showroom
  const formDepot = document.getElementById('formDepotModal');
  if (formDepot) {
    formDepot.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mode = document.getElementById('depotEditMode').value;
      const depotId = document.getElementById('depotId').value.trim();

      const payload = {
        id: depotId,
        ten_co_so: document.getElementById('depotTenCoSo').value.trim(),
        loai: document.getElementById('depotLoai').value.trim(),
        dia_chi: document.getElementById('depotDiaChi').value.trim(),
        hotline: document.getElementById('depotHotline').value.trim(),
        email: document.getElementById('depotEmail').value.trim(),
        gio_mo_cua: document.getElementById('depotGioMoCua').value.trim(),
        suc_chua_m2: parseInt(document.getElementById('depotSucChua').value, 10) || 10000,
        thiet_bi: document.getElementById('depotThietBi').value.trim(),
        hinh_anh: document.getElementById('depotHinhAnh').value.trim() || '/assets/branches/branch_tru_so_chinh.jpg',
        google_map_url: document.getElementById('depotGoogleMapUrl').value.trim()
      };

      try {
        const url = mode === 'edit' ? `/api/v1/admin/depots/${depotId}` : '/api/v1/admin/depots';
        const method = mode === 'edit' ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (result.success) {
          showToast(result.message || 'Lưu cơ sở Showroom thành công!');
          document.getElementById('modalDepot').classList.remove('open');
          loadContactAndDepots();
        } else {
          showToast('Lỗi: ' + result.message, 'error');
        }
      } catch (err) {
        showToast('Lỗi kết nối: ' + err.message, 'error');
      }
    });
  }

  loadContactAndDepots();
}

window.openEditDepotModal = function(id) {
  const depot = allDepots.find(d => d.id === id);
  if (!depot) return;

  document.getElementById('modalDepotTitle').textContent = `Chỉnh Sửa Showroom: ${depot.ten_co_so}`;
  document.getElementById('depotEditMode').value = 'edit';
  document.getElementById('depotIdHidden').value = depot.id;
  document.getElementById('depotId').value = depot.id;
  document.getElementById('depotId').disabled = true; // Không sửa ID khi update
  const txtBtn = document.getElementById('txtBtnSaveDepot');
  if (txtBtn) txtBtn.textContent = 'Cập Nhật Cơ Sở Showroom';
  document.getElementById('depotTenCoSo').value = depot.ten_co_so;
  document.getElementById('depotLoai').value = depot.loai || '';
  document.getElementById('depotDiaChi').value = depot.dia_chi;
  document.getElementById('depotHotline').value = depot.hotline;
  document.getElementById('depotEmail').value = depot.email || '';
  document.getElementById('depotGioMoCua').value = depot.gio_mo_cua || '';
  document.getElementById('depotSucChua').value = depot.suc_chua_m2 || 10000;
  document.getElementById('depotThietBi').value = depot.thiet_bi || '';
  document.getElementById('depotHinhAnh').value = depot.hinh_anh || '';
  document.getElementById('depotGoogleMapUrl').value = depot.raw_map_link || depot.google_map_url || '';

  document.getElementById('modalDepot').classList.add('open');
};

window.handleDeleteDepot = async function(id, name) {
  if (!confirm(`Anh Mike có chắc chắn muốn xóa cơ sở Showroom "${name}"?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/v1/admin/depots/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      showToast(result.message || 'Đã xóa Showroom thành công!');
      loadContactAndDepots();
    } else {
      showToast('Lỗi: ' + result.message, 'error');
    }
  } catch (err) {
    showToast('Lỗi kết nối: ' + err.message, 'error');
  }
};

/* ==========================================================================
   HELPER TIỆN ÍCH UPLOAD TỰ ĐỘNG
   ========================================================================== */
function setupImageUploader(fileInputId, targetTextInputId) {
  const fileInput = document.getElementById(fileInputId);
  const textInput = document.getElementById(targetTextInputId);
  if (!fileInput || !textInput) return;

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      showToast('Đang tải ảnh lên...', 'info');
      const uploadedUrl = await uploadFileToServer(file);
      textInput.value = uploadedUrl;
      showToast('✅ Tải ảnh thành công: ' + file.name);
    } catch (err) {
      showToast('Lỗi tải tệp: ' + err.message, 'error');
    }
  });
}
