/**
 * GOOGLE MAP URL RESOLVER MODULE
 * Chuyển đổi linh hoạt mọi định dạng link Google Maps (rút gọn maps.app.goo.gl, iframe, tọa độ, place)
 * thành Embed URL hiển thị trực tiếp và chính xác trên thẻ iframe.
 */

const https = require('https');
const http = require('http');

function resolveGoogleMapEmbed(inputUrl) {
  return new Promise((resolve) => {
    if (!inputUrl || typeof inputUrl !== 'string') {
      return resolve({ embedUrl: '', directUrl: '' });
    }

    let raw = inputUrl.trim();

    // 1. Trích xuất nếu người dùng dán nguyên thẻ iframe
    const iframeMatch = raw.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) {
      raw = iframeMatch[1];
    }

    // 2. Nếu đã là link embed chuẩn (output=embed hoặc /maps/embed)
    if (raw.includes('output=embed') || raw.includes('/maps/embed')) {
      return resolve({
        embedUrl: raw,
        directUrl: raw
      });
    }

    // 3. Nếu là link rút gọn maps.app.goo.gl hoặc goo.gl/maps
    if (raw.includes('maps.app.goo.gl') || raw.includes('goo.gl/maps')) {
      const client = raw.startsWith('https') ? https : http;

      const req = client.get(raw, (res) => {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          // Trích xuất tọa độ từ URL đích
          const coordMatch = redirectUrl.match(/!3d([0-9.-]+)!4d([0-9.-]+)/) ||
                             redirectUrl.match(/@([0-9.-]+),([0-9.-]+)/);
          if (coordMatch) {
            const lat = coordMatch[1];
            const lng = coordMatch[2];
            const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
            return resolve({
              embedUrl,
              directUrl: raw,
              resolvedUrl: redirectUrl,
              lat,
              lng
            });
          }

          // Trích xuất tên địa danh nếu có
          const placeMatch = redirectUrl.match(/\/place\/([^/@]+)/);
          if (placeMatch) {
            const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
            const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=16&output=embed`;
            return resolve({
              embedUrl,
              directUrl: raw,
              resolvedUrl: redirectUrl
            });
          }
        }

        // Nếu không lấy được redirect, fallback sang query url gốc
        resolve({
          embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(raw)}&z=16&output=embed`,
          directUrl: raw
        });
      });

      req.on('error', () => {
        resolve({
          embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(raw)}&z=16&output=embed`,
          directUrl: raw
        });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(raw)}&z=16&output=embed`,
          directUrl: raw
        });
      });
      return;
    }

    // 4. Nếu link chứa tọa độ !3d... !4d... hoặc @lat,lng
    const coordMatch = raw.match(/!3d([0-9.-]+)!4d([0-9.-]+)/) ||
                       raw.match(/@([0-9.-]+),([0-9.-]+)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
      return resolve({
        embedUrl,
        directUrl: raw,
        lat,
        lng
      });
    }

    // 5. Nếu là dạng tọa độ đơn giản: "20.92276, 106.6618"
    const simpleCoordMatch = raw.match(/^([0-9.-]+)\s*,\s*([0-9.-]+)$/);
    if (simpleCoordMatch) {
      const lat = simpleCoordMatch[1];
      const lng = simpleCoordMatch[2];
      const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
      return resolve({
        embedUrl,
        directUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        lat,
        lng
      });
    }

    // 6. Trường hợp còn lại (query địa chỉ hoặc link khác)
    resolve({
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(raw)}&z=16&output=embed`,
      directUrl: raw
    });
  });
}

module.exports = { resolveGoogleMapEmbed };
