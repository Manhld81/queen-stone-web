/**
 * QUEEN STONE CLIENT-SIDE APPLICATION JAVASCRIPT
 * Xử lý: Hero Slider 2s Phải sang Trái không đảo chiều,
 * Lưới sản phẩm đá căn thẳng hàng, Huy hiệu New nhấp nháy top 6,
 * Trạng thái Hết hàng, Cuộn vô tận (Infinite Scroll) & Modal Soi vân đá.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initStoneCatalog();
  initLookbookProjects();
  initModalHandlers();
  initAdminModal();
  initDynamicBrandSettings();
  initDynamicShowrooms();
  initLogoClickHandler();
});

/**
 * Xử lý click Logo: Cuộn mượt lên đầu trang khi đang ở trang chủ, chống giật/reload lộ ảnh cũ
 */
function initLogoClickHandler() {
  const brandLogoLink = document.querySelector('.logo-brand');
  if (brandLogoLink) {
    brandLogoLink.addEventListener('click', (e) => {
      const isHome = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
      if (isHome) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.pushState(null, '', '/');
      }
    });
  }
}

/* ==========================================================================
   1. HERO SLIDER (2.0s, CHUYỂN ĐỘNG 1 CHIỀU TRÁI SANG PHẢI, SEAMLESS CLONE BUFFER)
   ========================================================================== */
function initHeroSlider() {
  const track = document.getElementById('heroSliderTrack');
  const progressBars = document.querySelectorAll('.progress-segment-bar');
  const zoneBadgeText = document.getElementById('sliderZoneName');
  const btnNext = document.getElementById('btnHeroNext');
  const btnPrev = document.getElementById('btnHeroPrev');
  const slideItems = track ? track.querySelectorAll('.hero-slide-item') : [];

  if (!track) return;

  const zoneNames = [
    '01 / 05 — ĐẠI SẢNH THÔNG TẦNG HOÀNG GIA',
    '02 / 05 — VÁCH THÔNG TẦNG PHÒNG KHÁCH (PATAGONIA 7M)',
    '03 / 05 — ĐẢO BẾP & QUẦY BAR ONYX XUYÊN SÁNG',
    '04 / 05 — ĐẠI CẦU THANG XOẮN ỐC CẨM THẠCH NGUYÊN KHỐI',
    '05 / 05 — PHÒNG TẮM MASTER SUITE SPA ARABESCATO'
  ];

  // Cấu trúc track 7 phần: [Clone5][S1][S2][S3][S4][S5][Clone1]
  //                index:     0      1   2   3   4   5    6
  // Auto-play: currentIndex++ → track dịch TRÁI → ảnh mới vào từ PHẢI
  // Người xem thấy banner "chạy từ trái sang phải" (slide cuộn về bên trái, ảnh mới hiện từ phải)
  const totalRealSlides = 5;
  let currentIndex = 1; // Slide 1 thật ở vị trí index 1
  const slideDuration = 600;
  const intervalTime = 2000;
  let isTransitioning = false;
  let autoTimer = null;

  // Thiết lập vị trí khởi đầu — không có hiệu ứng
  track.style.transition = 'none';
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  function updateActiveSlideUI(realIndex) {
    if (zoneBadgeText) zoneBadgeText.textContent = zoneNames[realIndex];
    progressBars.forEach((bar, idx) => {
      bar.classList.remove('active', 'completed');
      if (idx < realIndex) bar.classList.add('completed');
      else if (idx === realIndex) bar.classList.add('active');
    });
    slideItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === currentIndex);
    });
  }

  // TIẾN (trái → phải): track dịch TRÁI, ảnh mới vào từ bên PHẢI màn hình
  // Thứ tự hiển thị: Slide1 → Slide2 → Slide3 → Slide4 → Slide5 → Slide1...
  function moveToNextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    track.style.transition = `transform ${slideDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    // index 1→0, 2→1, 3→2, 4→3, 5→4, 6→0(clone=S1)
    const realIdx = (currentIndex - 1) % totalRealSlides;
    updateActiveSlideUI(realIdx);
  }

  // LÙI (phải → trái): track dịch PHẢI, ảnh trước vào từ bên TRÁI màn hình
  function moveToPrevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    track.style.transition = `transform ${slideDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    const realIdx = ((currentIndex - 1) % totalRealSlides + totalRealSlides) % totalRealSlides;
    updateActiveSlideUI(realIdx);
  }

  // Sau khi animation kết thúc: nhảy về slide thật nếu đang ở clone buffer
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    // Đến Clone1 (index 6) → nhảy về Slide1 thật (index 1)
    if (currentIndex >= totalRealSlides + 1) {
      track.style.transition = 'none';
      currentIndex = 1;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      void track.offsetWidth;
    }
    // Đến Clone5 (index 0) → nhảy về Slide5 thật (index 5)
    if (currentIndex <= 0) {
      track.style.transition = 'none';
      currentIndex = totalRealSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      void track.offsetWidth;
    }
  });

  function startAutoPlay() {
    stopAutoPlay();
    updateActiveSlideUI((currentIndex - 1 + totalRealSlides) % totalRealSlides);
    autoTimer = setInterval(moveToNextSlide, intervalTime);
  }

  function stopAutoPlay() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (btnNext) btnNext.addEventListener('click', () => { moveToNextSlide(); startAutoPlay(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { moveToPrevSlide(); startAutoPlay(); });

  startAutoPlay();
}

/* ==========================================================================
   2. PRODUCT CATALOG & INFINITE SCROLL (CUỘN VÔ TẬN & XẾP THẲNG HÀNG)
   ========================================================================== */
const catalogState = {
  category: 'all',
  color: 'all',
  application: 'all',
  search: '',
  page: 1,
  limit: 9,
  loading: false,
  has_more: true,
  total: 0,
  loadedCount: 0
};

function initStoneCatalog() {
  const grid = document.getElementById('stoneProductGrid');
  const sentinel = document.getElementById('infiniteSentinel');
  const spinner = document.getElementById('infiniteSpinner');
  const endMessage = document.getElementById('infiniteEndMessage');
  const counterText = document.getElementById('productCounterText');

  if (!grid) return;

  // Hàm nạp danh sách sản phẩm từ REST API
  async function fetchStones({ append = true } = {}) {
    if (catalogState.loading) return;
    if (append && !catalogState.has_more) return;

    catalogState.loading = true;
    if (spinner) spinner.classList.add('active');

    try {
      const queryParams = new URLSearchParams({
        page: catalogState.page,
        limit: catalogState.limit,
        category: catalogState.category,
        color: catalogState.color,
        application: catalogState.application,
        search: catalogState.search
      });

      const response = await fetch(`/api/v1/stones?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        const { items, total, has_more } = result.data;
        catalogState.total = total;
        catalogState.has_more = has_more;

        if (!append) {
          grid.innerHTML = '';
          catalogState.loadedCount = 0;
        }

        renderStoneCards(items, grid);
        catalogState.loadedCount += items.length;

        // Cập nhật số lượng đếm
        if (counterText) {
          counterText.textContent = `Hiển thị ${catalogState.loadedCount} / ${total} tuyệt tác đá`;
        }

        // Kiểm tra đã hết sản phẩm chưa
        if (!has_more && endMessage) {
          endMessage.classList.add('active');
          const desc = endMessage.querySelector('.end-message-desc');
          if (desc) desc.textContent = `Đã hiển thị trọn vẹn toàn bộ ${total} lô đá tự nhiên độc bản trong kho Queen Stone.`;
        } else if (endMessage) {
          endMessage.classList.remove('active');
        }

        catalogState.page++;
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách đá:', err);
    } finally {
      catalogState.loading = false;
      if (spinner) spinner.classList.remove('active');
    }
  }

  // Render các thẻ đá căn dóng thẳng hàng hoàn hảo
  function renderStoneCards(stones, container) {
    stones.forEach(stone => {
      const card = document.createElement('article');
      card.className = `stone-card ${stone.is_out_of_stock ? 'out-of-stock' : ''}`;
      card.setAttribute('data-lot', stone.ma_lo);

      // 1. Badge Top-Right: NEW nhấp nháy + Hết hàng/Còn hàng
      const newBadgeHtml = stone.is_new ? `
        <span class="badge-new-pulse">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          NEW
        </span>
      ` : '';

      const stockBadgeHtml = stone.is_out_of_stock
        ? `<span class="badge-stock-status badge-stock-out">HẾT HÀNG</span>`
        : `<span class="badge-stock-status badge-stock-in">CÒN HÀNG</span>`;

      card.innerHTML = `
        <div class="stone-image-container">
          <span class="badge-lot-id">Lot ${stone.ma_lo}</span>
          <div class="badge-top-right-group">
            ${newBadgeHtml}
            ${stockBadgeHtml}
          </div>
          <img class="stone-slab-image" src="${stone.hinh_anh_slab}" alt="${stone.ten_da}" loading="lazy" />
        </div>
        <div class="stone-card-body">
          <h3 class="stone-card-title" title="${stone.ten_da}">${stone.ten_da}</h3>
          <div class="stone-specs-grid">
            <div class="spec-item">
              <span class="spec-item-label">Xuất Xứ</span>
              <span class="spec-item-val">${stone.xuat_xu}</span>
            </div>
            <div class="spec-item">
              <span class="spec-item-label">Kích Thước (mm)</span>
              <span class="spec-item-val font-mono">${stone.chieu_dai_mm} x ${stone.chieu_rong_mm} x ${stone.do_day_mm}</span>
            </div>
          </div>
          <div class="stone-stock-info">
            <span class="spec-item-label">Tình Trạng Kho</span>
            <span class="stock-info-text ${stone.is_out_of_stock ? 'out-stock' : 'in-stock'} font-mono">
              ${stone.formatted_stock}
            </span>
          </div>
          <div class="stone-card-action-wrap">
            <button class="btn-inspect-slab" data-id="${stone.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Xem Chi Tiết & Soi Vân</span>
            </button>
          </div>
        </div>
      `;

      // Bắt sự kiện click mở modal soi vân
      card.addEventListener('click', (e) => {
        openSlabModal(stone);
      });

      container.appendChild(card);
    });
  }

  // Cấu hình IntersectionObserver để CUỘN VÔ TẬN (Infinite Scroll)
  if (sentinel) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && catalogState.has_more && !catalogState.loading) {
        fetchStones({ append: true });
      }
    }, {
      root: null,
      rootMargin: '300px', // Nạp trước khi người dùng cuộn tới đáy 300px
      threshold: 0.1
    });

    observer.observe(sentinel);
  }

  // ─── BỘ LỌC CHỦNG LOẠI ĐÁ & NHẢY TỚI LƯỚI SẢN PHẨM ────────────────────────
  const categoryBtns = document.querySelectorAll('.filter-btn-category');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedCat = btn.getAttribute('data-cat') || 'all';
      catalogState.category = selectedCat;
      catalogState.page = 1;
      fetchStones({ append: false });

      // Nhảy cuộn mượt tới vị trí danh mục sản phẩm đá
      const productShowcase = document.querySelector('.product-showcase-section');
      if (productShowcase) {
        productShowcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hỗ trợ tham số URL (ví dụ ?cat=Marble hoặc ?category=Quartzite)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category') || urlParams.get('cat');
  if (catParam) {
    const matchingBtn = document.querySelector(`.filter-btn-category[data-cat="${catParam}"]`);
    if (matchingBtn) {
      categoryBtns.forEach(b => b.classList.remove('active'));
      matchingBtn.classList.add('active');
      catalogState.category = catParam;
    }
  }

  // Tải đợt sản phẩm đầu tiên khi trang sẵn sàng
  fetchStones({ append: false });
}

/* ==========================================================================
   3. MODAL SOI VÂN ĐÁ & ZALO 1-CLICK CONSULTATION
   ========================================================================== */
function initModalHandlers() {
  const modal = document.getElementById('slabInspectionModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

function openSlabModal(stone) {
  const modal = document.getElementById('slabInspectionModal');
  if (!modal) return;

  document.getElementById('modalTitle').textContent = stone.ten_da;
  document.getElementById('modalLotBadge').textContent = `MÃ LÔ: ${stone.ma_lo}`;
  document.getElementById('modalFullSlabImg').src = stone.hinh_anh_slab;
  document.getElementById('modalMacroImg').src = stone.hinh_anh_macro;
  document.getElementById('modalOrigin').textContent = stone.xuat_xu;
  document.getElementById('modalDimensions').textContent = `${stone.chieu_dai_mm} x ${stone.chieu_rong_mm} x ${stone.do_day_mm} mm`;
  document.getElementById('modalFinish').textContent = stone.be_mat;
  document.getElementById('modalStock').textContent = stone.formatted_stock;
  document.getElementById('modalDesc').textContent = stone.mo_ta || 'Tuyệt phẩm đá tự nhiên nguyên tấm được tuyển chọn khắt khe.';

  const zaloBtn = document.getElementById('modalZaloBtn');
  if (zaloBtn) {
    zaloBtn.href = stone.zalo_link;
    zaloBtn.target = '_blank';
  }

  modal.classList.add('open');
}

/* ==========================================================================
   4. ADMIN LOGIN MODAL
   ========================================================================== */
function initAdminModal() {
  const adminBtn = document.getElementById('btnOpenAdminPortal');
  const adminModal = document.getElementById('adminWarehouseModal');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const formLogin = document.getElementById('formAdminHomeLogin');
  const msgFeedback = document.getElementById('adminFeedbackMsg');

  if (!adminModal) return;

  if (adminBtn) {
    adminBtn.addEventListener('click', (e) => {
      e.preventDefault();
      adminModal.classList.add('open');
      if (formLogin) formLogin.style.display = 'block';
      if (msgFeedback) msgFeedback.style.display = 'none';
    });
  }

  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', () => {
      adminModal.classList.remove('open');
    });
  }

  // Đăng nhập Quản Trị Viên
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('homeLoginUser').value.trim();
      const password = document.getElementById('homeLoginPass').value.trim();

      if (!username || !password) {
        showAdminMsg('Vui lòng nhập tên đăng nhập và mật khẩu.', false);
        return;
      }

      try {
        const response = await fetch('/api/v1/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const result = await response.json();

        if (result.success) {
          showAdminMsg('Đăng nhập thành công! Đang chuyển hướng vào Trang Quản Trị...', true);
          localStorage.setItem('queen_stone_admin_token', result.token);
          setTimeout(() => {
            window.location.href = '/admin';
          }, 350);
        } else {
          showAdminMsg('Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!', false);
        }
      } catch (err) {
        showAdminMsg('Lỗi kết nối máy chủ: ' + err.message, false);
      }
    });
  }

  function showAdminMsg(msg, isSuccess) {
    if (!msgFeedback) return;
    msgFeedback.textContent = msg;
    msgFeedback.style.display = 'block';
    msgFeedback.style.color = isSuccess ? '#059669' : '#DC2626';
    msgFeedback.style.background = isSuccess ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)';
    msgFeedback.style.padding = '0.75rem';
    msgFeedback.style.borderRadius = '6px';
    msgFeedback.style.marginTop = '1rem';
  }
}

/* ==========================================================================
   5. CÔNG TRÌNH TIÊU BIỂU (LOOKBOOK & PHÂN TRANG HOÀNG GIA)
   ========================================================================== */
function initLookbookProjects() {
  const grid = document.getElementById('lookbookProjectsGrid');
  const paginationWrap = document.getElementById('lookbookPagination');

  if (!grid) return;

  const state = {
    page: 1,
    limit: 3,
    total_pages: 1,
    loading: false
  };

  async function loadProjects(page = 1) {
    if (state.loading) return;
    state.loading = true;
    grid.style.opacity = '0.4';

    try {
      const res = await fetch(`/api/v1/lookbook?page=${page}&limit=${state.limit}`);
      const data = await res.json();

      if (data.success && data.data) {
        const { items, total_pages, page: currentPage } = data.data;
        state.page = currentPage;
        state.total_pages = total_pages || 1;

        renderProjects(items);
        renderPagination(state.page, state.total_pages);
      }
    } catch (err) {
      console.error('Lỗi nạp danh sách công trình tiêu biểu:', err);
    } finally {
      state.loading = false;
      grid.style.opacity = '1';
    }
  }

  function renderProjects(projects) {
    grid.innerHTML = '';
    projects.forEach(p => {
      const card = document.createElement('a');
      card.href = `/album.html?id=${p.id}`;
      card.className = 'lookbook-card';
      card.setAttribute('title', `Xem album ảnh chi tiết: ${p.ten_cong_trinh}`);

      card.innerHTML = `
        <div class="lookbook-card-img-wrap">
          <img src="${p.hinh_anh}" alt="${p.ten_cong_trinh}" class="lookbook-card-img" loading="lazy" />
          <span class="lookbook-card-badge">${p.loai_hinh}</span>
        </div>
        <div class="lookbook-card-body">
          <h3 class="lookbook-card-title">${p.ten_cong_trinh}</h3>
          <div class="lookbook-card-meta">
            <span>${p.dia_diem}</span>
            <span>•</span>
            <span>Hoàn thành ${p.nam_hoan_thanh}</span>
            <span>•</span>
            <span class="font-mono text-emerald" style="font-weight: 600;">${p.dien_tich || '1.200 m²'}</span>
          </div>
          <p class="lookbook-card-desc">${p.mo_ta}</p>
          <div class="lookbook-card-action">
            <span>Khám Phá Album Dự Án</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function renderPagination(currentPage, totalPages) {
    if (!paginationWrap) return;
    if (totalPages <= 1) {
      paginationWrap.innerHTML = '';
      return;
    }

    let html = `
      <button class="btn-page-arrow" id="btnLookbookPrev" ${currentPage <= 1 ? 'disabled' : ''} aria-label="Trang trước">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      html += `
        <button class="btn-page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    html += `
      <button class="btn-page-arrow" id="btnLookbookNext" ${currentPage >= totalPages ? 'disabled' : ''} aria-label="Trang tiếp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    `;

    paginationWrap.innerHTML = html;

    // Gắn sự kiện click phân trang
    const prevBtn = paginationWrap.querySelector('#btnLookbookPrev');
    const nextBtn = paginationWrap.querySelector('#btnLookbookNext');
    const pageBtns = paginationWrap.querySelectorAll('.btn-page-number');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.page > 1) {
          loadProjects(state.page - 1);
          scrollSectionToView();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.page < state.total_pages) {
          loadProjects(state.page + 1);
          scrollSectionToView();
        }
      });
    }

    pageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (targetPage !== state.page) {
          loadProjects(targetPage);
          scrollSectionToView();
        }
      });
    });
  }

  function scrollSectionToView() {
    const section = document.getElementById('lookbook');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Nạp trang đầu tiên
  loadProjects(1);
}

/* ==========================================================================
   6. ĐỒNG BỘ CẤU HÌNH THƯƠNG HIỆU & LIÊN HỆ TỪ ADMIN (REALTIME SYNC)
   ========================================================================== */
async function initDynamicBrandSettings() {
  try {
    const res = await fetch('/api/v1/settings');
    const result = await res.json();
    if (result.success && result.data) {
      const cfg = result.data;

      // 1. Logo Website
      const brandLogo = document.getElementById('siteBrandLogo');
      if (brandLogo && cfg.logo_url) {
        brandLogo.src = cfg.logo_url;
      }

      // 2. Tên Doanh Nghiệp / Thương Hiệu
      if (cfg.company_name) {
        const compEl = document.getElementById('siteCompanyName');
        if (compEl) compEl.textContent = cfg.company_name;
        const footerBrand = document.getElementById('footerBrandName');
        if (footerBrand) footerBrand.textContent = cfg.company_name;
      }

      // 3. Địa Chỉ Trụ Sở Chính
      if (cfg.dia_chi_tru_so) {
        const addrEl = document.getElementById('siteHeadquartersAddress');
        if (addrEl) addrEl.textContent = cfg.dia_chi_tru_so;
      }

      // 4. Hotline VIP Tiếp Nhận
      if (cfg.hotline) {
        const hotEl = document.getElementById('siteHotline');
        if (hotEl) {
          hotEl.textContent = cfg.hotline;
          hotEl.href = `tel:${cfg.hotline.replace(/[^0-9]/g, '')}`;
        }
        const footHot = document.getElementById('footerHotline');
        if (footHot) footHot.textContent = cfg.hotline;
      }

      // 5. Email Tiếp Nhận
      if (cfg.email) {
        const emailEl = document.getElementById('siteEmail');
        if (emailEl) {
          emailEl.textContent = cfg.email;
          emailEl.href = `mailto:${cfg.email}`;
        }
        const footEmail = document.getElementById('footerEmail');
        if (footEmail) footEmail.textContent = cfg.email;
      }

      // 6. Thời Gian Mở Cửa
      if (cfg.gio_mo_cua) {
        const hoursEl = document.getElementById('siteWorkingHours');
        if (hoursEl) hoursEl.textContent = `🕒 Giờ mở cửa: ${cfg.gio_mo_cua}`;
        const footHours = document.getElementById('footerHours');
        if (footHours) footHours.textContent = cfg.gio_mo_cua;
      }

      // 7. Ảnh Mặt Tiền Trụ Sở
      if (cfg.headquarters_image) {
        const hqImg = document.getElementById('siteHeadquartersImg');
        if (hqImg) hqImg.src = cfg.headquarters_image;
      }

      // 8. Bản Đồ Google Map Trụ Sở Chính
      const mapLink = document.getElementById('siteMapLink');
      if (mapLink) {
        if (cfg.google_map_search_url) {
          mapLink.href = cfg.google_map_search_url;
        } else if (cfg.raw_map_link) {
          mapLink.href = cfg.raw_map_link;
        } else if (cfg.map_embed_url && (cfg.map_embed_url.includes('maps.app.goo.gl') || cfg.map_embed_url.includes('google.com/maps'))) {
          mapLink.href = cfg.map_embed_url;
        } else if (cfg.dia_chi_tru_so) {
          mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.dia_chi_tru_so)}`;
        }
      }

      const mapIframe = document.getElementById('siteMapIframe');
      if (mapIframe) {
        if (cfg.map_embed_url && (cfg.map_embed_url.includes('output=embed') || cfg.map_embed_url.includes('/maps/embed'))) {
          mapIframe.src = cfg.map_embed_url;
        } else if (cfg.map_embed_url && (cfg.map_embed_url.includes('google.com') || cfg.map_embed_url.includes('goo.gl'))) {
          const coordMatch = cfg.map_embed_url.match(/!3d([0-9.-]+)!4d([0-9.-]+)/) || cfg.map_embed_url.match(/@([0-9.-]+),([0-9.-]+)/);
          if (coordMatch) {
            mapIframe.src = `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=16&output=embed`;
          } else {
            mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(cfg.map_embed_url)}&z=16&output=embed`;
          }
        } else if (cfg.dia_chi_tru_so) {
          mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(cfg.dia_chi_tru_so)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
      }
    }
  } catch (e) {
    console.warn('Lỗi đồng bộ cấu hình thương hiệu:', e);
  }
}

/* ==========================================================================
   7. ĐỒNG BỘ MẠNG LƯỚI SHOWROOM & TỔNG KHO TỪ CSDL (REALTIME SYNC)
   ========================================================================== */
async function initDynamicShowrooms() {
  const showroomWrap = document.getElementById('dynamicShowroomList');
  if (!showroomWrap) return;

  try {
    const res = await fetch('/api/v1/depots');
    const result = await res.json();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      // Lọc bỏ Trụ sở chính để tránh lặp lại (Trụ sở chính đã hiển thị ở Hàng 1 phía trên)
      const showrooms = result.data.filter(d => d.id !== 'KHO_SG_01' && (!d.loai || !d.loai.includes('Trụ Sở Chính')));
      if (showrooms.length === 0) return;

      showroomWrap.innerHTML = showrooms.map(d => {
        const mapUrl = d.google_map_url || d.raw_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.dia_chi)}`;
        const iframeSrc = d.google_map_embed_url || ((d.google_map_url && d.google_map_url.includes('output=embed'))
          ? d.google_map_url
          : `https://maps.google.com/maps?q=${encodeURIComponent(d.dia_chi)}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
        const imgSrc = d.hinh_anh || '/assets/branches/branch_tru_so_chinh.jpg';
        const hotlineClean = (d.hotline || '').replace(/[^0-9]/g, '');

        return `
          <div class="contact-branch-row">
            <!-- Ô 1: THÔNG TIN SHOWROOM -->
            <div class="contact-info-col">
              <div>
                <span class="branch-badge showroom">${d.loai || 'SHOWROOM CHIẾN LƯỢC'}</span>
                <h3 class="branch-name">${d.ten_co_so}</h3>
                <div class="contact-detail-list">
                  <div class="contact-detail-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                    <div>
                      <span class="contact-label">Địa chỉ:</span>
                      <span class="contact-text">${d.dia_chi}</span>
                    </div>
                  </div>
                  <div class="contact-detail-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <div>
                      <span class="contact-label">Email:</span>
                      <a href="mailto:${d.email || 'contact@queenstone.vn'}" class="contact-link">${d.email || 'contact@queenstone.vn'}</a>
                    </div>
                  </div>
                  <div class="contact-detail-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <div>
                      <span class="contact-label">Số điện thoại:</span>
                      <a href="tel:${hotlineClean}" class="contact-link phone-link">${d.hotline}</a>
                      <span class="hotline-badge">Hotline Showroom</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="branch-meta-footer">
                <span>🕒 Giờ mở cửa: ${d.gio_mo_cua || '08:00 - 17:30'}</span>
                <span>• Trữ lượng: ${(d.suc_chua_m2 || 10000).toLocaleString('vi-VN')} m²</span>
                <span>• ${d.thiet_bi || 'Cẩu trục bọc cao su chống xước'}</span>
              </div>
            </div>

            <!-- Ô 2: BẢN ĐỒ GOOGLE MAP -->
            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="contact-map-col" title="Bấm vào để mở Google Maps chỉ đường đến ${d.ten_co_so}">
              <iframe src="${iframeSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="branch-map-iframe" title="Bản đồ ${d.ten_co_so}"></iframe>
              <div class="branch-map-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
                <span>Xem trên Google Maps &rarr;</span>
              </div>
            </a>

            <!-- Ô 3: HÌNH ẢNH SHOWROOM -->
            <div class="contact-image-col">
              <img src="${imgSrc}" alt="${d.ten_co_so}" class="branch-img" />
              <span class="branch-img-caption">${d.ten_co_so.toUpperCase()}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (e) {
    console.warn('Lỗi nạp danh sách showroom động:', e);
  }
}
