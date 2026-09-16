/**
 * ZALO 1-CLICK CONSULTATION SERVICE
 * Queen Stone Lab 03 - Vibe Coding Framework v5.0
 * Tạo đường dẫn Zalo thông minh mở chat đính kèm đầy đủ thông số lô đá
 */

function buildZaloConsultationLink(stone, hotline = '0988888789') {
  if (!stone) return `https://zalo.me/${hotline}`;

  const cleanPhone = (hotline || '0988888789').replace(/\D/g, '');
  const tenDa = stone.ten_da || 'Đá tự nhiên độc bản';
  const maLo = stone.ma_lo || '';
  const kichThuoc = `${stone.chieu_dai_mm || 0} x ${stone.chieu_rong_mm || 0} x ${stone.do_day_mm || 20} mm`;
  const xuatXu = stone.xuat_xu || 'Nhập khẩu cao cấp';
  const tinhTrang = (stone.so_luong_tam > 0) 
    ? `Còn ${stone.dien_tich_m2} m² (${stone.so_luong_tam} tấm)` 
    : 'Lô đá đã hết hàng - Cần tư vấn lô tương đương';

  const message = [
    `👑 QUEEN STONE VIP CONSULTATION`,
    `Chào Chuyên viên tư vấn Queen Stone,`,
    `Tôi đang quan tâm đến tuyệt tác đá tự nhiên:`,
    `• Tên đá: ${tenDa}`,
    `• Mã lô: ${maLo}`,
    `• Kích thước: ${kichThuoc}`,
    `• Xuất xứ: ${xuatXu}`,
    `• Tình trạng kho: ${tinhTrang}`,
    `Vui lòng gửi thêm ảnh soi vân thực tế độ phân giải cao và gợi ý thiết kế không gian cho tôi.`
  ].join('\n');

  const encodedMessage = encodeURIComponent(message);
  return {
    zalo_url: `https://zalo.me/${cleanPhone}?text=${encodedMessage}`,
    hotline: cleanPhone,
    prefilled_message: message
  };
}

module.exports = { buildZaloConsultationLink };
