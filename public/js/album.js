/**
 * ALBUM LANDING PAGE & LIGHTBOX INTERACTIVE LOGIC
 * Queen Stone Architectural Gallery — Album Đá Tự Nhiên
 */

document.addEventListener('DOMContentLoaded', () => {
  initAlbumPage();
});

function initAlbumPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedCategory = urlParams.get('category') || 'all';

  const gridEl = document.getElementById('albumPhotosGrid');
  const counterEl = document.getElementById('albumPhotoCount');
  const statTotalEl = document.getElementById('albumStatTotal');
  const loadingEl = document.getElementById('albumLoadingWrap');
  const btnLoadMore = document.getElementById('btnLoadMorePhotos');
  const sentinelEl = document.getElementById('albumSentinel');
  const filterTabs = document.querySelectorAll('.album-filter-tab');

  // Lightbox elements
  const lightbox = document.getElementById('albumLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxProject = document.getElementById('lightboxProject');
  const lightboxStone = document.getElementById('lightboxStone');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const btnBack = document.getElementById('btnLightboxBack');
  const btnPrev = document.getElementById('btnLightboxPrev');
  const btnNext = document.getElementById('btnLightboxNext');

  let currentCategory = requestedCategory;
  let currentPage = 1;
  const pageLimit = 12;
  let isLoading = false;
  let hasMore = true;
  let allPhotos = [];
  let currentLightboxIndex = 0;

  // 1. Khởi động bộ lọc tabs
  filterTabs.forEach(tab => {
    const cat = tab.getAttribute('data-category');
    if (cat === currentCategory) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }

    tab.addEventListener('click', () => {
      if (isLoading) return;
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category') || 'all';
      currentPage = 1;
      allPhotos = [];
      hasMore = true;
      if (gridEl) gridEl.innerHTML = '';
      fetchAlbumPhotos();
    });
  });

  // 2. Nạp danh sách ảnh từ API /api/v1/album-photos
  async function fetchAlbumPhotos() {
    if (isLoading || !hasMore) return;
    isLoading = true;
    if (loadingEl) loadingEl.style.display = 'flex';
    if (btnLoadMore) btnLoadMore.style.display = 'none';

    try {
      const url = `/api/v1/album-photos?page=${currentPage}&limit=${pageLimit}&category=${encodeURIComponent(currentCategory)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.data) {
        const { items, total, total_pages, has_more } = data.data;
        hasMore = has_more;

        allPhotos = allPhotos.concat(items);

        if (statTotalEl && total) {
          statTotalEl.textContent = `${total}+ Không Gian Thực Tế`;
        }

        if (counterEl) {
          counterEl.textContent = `Hiển thị ${allPhotos.length} / ${total} Ảnh Kiến Trúc`;
        }

        renderPhotoItems(items);

        if (hasMore) {
          currentPage++;
          if (btnLoadMore) btnLoadMore.style.display = 'inline-block';
        } else {
          if (btnLoadMore) btnLoadMore.style.display = 'none';
        }
      }
    } catch (err) {
      console.error('Lỗi khi nạp ảnh album:', err);
      if (gridEl && allPhotos.length === 0) {
        gridEl.innerHTML = '<p style="color: var(--color-text-muted); grid-column: 1/-1; text-align: center; padding: 2rem;">Lỗi kết nối máy chủ. Vui lòng thử lại sau.</p>';
      }
    } finally {
      isLoading = false;
      if (loadingEl) loadingEl.style.display = 'none';
    }
  }

  // 3. Render các thẻ ảnh mới vào lưới
  function renderPhotoItems(newItems) {
    if (!gridEl) return;

    if (allPhotos.length === 0 && (!newItems || newItems.length === 0)) {
      gridEl.innerHTML = '<p style="color: var(--color-text-muted); grid-column: 1/-1; text-align: center; padding: 3rem;">Chưa có hình ảnh nào trong danh mục này.</p>';
      return;
    }

    newItems.forEach(photo => {
      const globalIndex = allPhotos.indexOf(photo);
      const card = document.createElement('article');
      card.className = 'album-photo-card';
      card.setAttribute('data-index', globalIndex);

      card.innerHTML = `
        <div class="album-photo-wrap">
          <img src="${photo.image_url}" alt="${photo.title}" class="album-photo-img" loading="lazy" />
          <span class="album-photo-tag">${photo.category || 'Kiến Trúc'}</span>
          <div class="album-photo-overlay">
            <span class="album-overlay-cta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Phóng To Chi Tiết Vân Đá</span>
            </span>
          </div>
        </div>
        <div class="album-photo-details">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--color-royal-gold); margin-bottom: 0.25rem;">
            ${photo.project_name || 'Dinh Thự Hoàng Gia'}
          </div>
          <h4 class="album-photo-title">${photo.title}</h4>
          <p class="album-photo-desc">${photo.description || photo.stone_name || ''}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(globalIndex);
      });

      gridEl.appendChild(card);
    });
  }

  // 4. Cơ chế Cuộn Vô Tận (Infinite Scroll Observer)
  if (sentinelEl && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          fetchAlbumPhotos();
        }
      });
    }, { rootMargin: '200px' });

    observer.observe(sentinelEl);
  }

  // Nút tải thêm thủ công nếu bấm
  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      fetchAlbumPhotos();
    });
  }

  // 5. Điều khiển Lightbox phóng to ảnh toàn màn hình
  function openLightbox(index) {
    if (!allPhotos || allPhotos.length === 0) return;
    currentLightboxIndex = index;
    updateLightboxUI();
    if (lightbox) {
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden'; // Khóa cuộn trang khi xem ảnh lớn
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function updateLightboxUI() {
    const photo = allPhotos[currentLightboxIndex];
    if (!photo) return;

    if (lightboxImg) {
      lightboxImg.src = photo.image_url;
      lightboxImg.alt = photo.title;
    }

    if (lightboxTitle) lightboxTitle.textContent = photo.title;
    if (lightboxDesc) lightboxDesc.textContent = photo.description || '';
    if (lightboxProject) lightboxProject.textContent = photo.project_name || 'Dinh Thự Hoàng Gia';
    if (lightboxStone) lightboxStone.textContent = photo.stone_name ? `Đá: ${photo.stone_name}` : '';

    if (lightboxCounter) {
      const displayIdx = String(currentLightboxIndex + 1).padStart(2, '0');
      const totalDisplay = String(allPhotos.length).padStart(2, '0');
      lightboxCounter.textContent = `ẢNH ${displayIdx} / ${totalDisplay}`;
    }
  }

  function showNextPhoto() {
    if (currentLightboxIndex < allPhotos.length - 1) {
      currentLightboxIndex++;
    } else {
      currentLightboxIndex = 0; // Vòng lặp về ảnh đầu
    }
    updateLightboxUI();
  }

  function showPrevPhoto() {
    if (currentLightboxIndex > 0) {
      currentLightboxIndex--;
    } else {
      currentLightboxIndex = allPhotos.length - 1; // Về ảnh cuối
    }
    updateLightboxUI();
  }

  // Sự kiện Lightbox buttons
  if (btnBack) btnBack.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', showNextPhoto);
  if (btnPrev) btnPrev.addEventListener('click', showPrevPhoto);

  // Đóng khi click vào vùng nền mờ
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Phím tắt bàn phím (ESC, ArrowLeft, ArrowRight)
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // Kích hoạt nạp trang đầu tiên
  fetchAlbumPhotos();
}
