# Teichi D. — Personal portfolio

Website cá nhân của **Hồ Du tuấn Đạt / Teichi D.**, Van Lang University.

Portfolio về Web3, Blockchain, nghiên cứu khoa học và UniHackfest 2026. Giao diện tối giản, nền hero tương tác, mascot Mây pixel, hiệu ứng cuộn GSAP và Lenis. Website tĩnh, không cần backend hoặc API key.

## Chạy trên máy

Cài Node.js 20 trở lên, mở terminal trong thư mục repository và chạy:

```sh
npm start
```

Mở **http://localhost:4173**. Không cần `npm install` vì công cụ chạy local chỉ dùng thư viện có sẵn của Node.js. Nhấn Ctrl+C để dừng.

Cách khác nếu đã có Python:

```sh
python -m http.server 4173 --directory dist
```

Không mở trực tiếp `index.html` bằng `file://`, vì JavaScript sử dụng ES modules.

## Chỉnh sửa

| Tệp | Nội dung |
| --- | --- |
| `dist/index.html` | Thông tin cá nhân, dự án, nghiên cứu, hackathon, các section |
| `dist/style.css` | Bố cục và giao diện chính |
| `dist/interactions.css` | Giao diện các tương tác và phần nghiên cứu/hackathon |
| `dist/app.js` | Cuộn, điều hướng, project dialog, nội dung case study, contact |
| `dist/hero-field.js` và `.css` | Nền lưới phản ứng với chuột, gợn sóng và cursor theo component |
| `dist/may-pixel.js` và `.css` | Trạng thái và hoạt ảnh mascot Mây |
| `dist/assets/may-sprite.png` | Sprite sheet của Mây |
| `dist/vendor/` | GSAP, ScrollTrigger và Lenis chạy trực tiếp trong trình duyệt |

Lưu file, rồi tải lại trang để xem thay đổi. Mây có các trạng thái Auto, Happy, Think, Code, Sleep. Chế độ Motion và thiết lập giảm chuyển động của hệ điều hành được hỗ trợ.

## Nội dung cần lưu ý khi cá nhân hóa

- Nghiên cứu **Signed but Stale: Rolling Back Backdoor Repairs Through Shard-Version Skew in 6G Edge Inference** đang **under review**. Thêm liên kết công bố khi có kết quả.
- **N.E.D Wallet** là dự án UniHackfest 2026 với vai trò Project owner. Origin Collective và Relay Network được ghi rõ là concept.
- Form liên hệ hiện yêu cầu nhập email chủ portfolio rồi mở bản nháp qua ứng dụng email; website không tự gửi thư. Thay phần này bằng email liên hệ chính thức trước khi quảng bá rộng rãi.
- Google Fonts được tải từ mạng; các thư viện animation và sprite nằm trong repository.

## Hosting

Đây là website tĩnh: thư mục cần đưa lên dịch vụ hosting là **`dist/`**, không có bước build. Cấu trúc dùng đường dẫn tương đối nên có thể phục vụ tại tên miền riêng hoặc thư mục con.

Repository này là bản nguồn độc lập; không chứa thông tin đăng nhập, lịch sử nội bộ hoặc cấu hình của dịch vụ Sites. Việc đẩy mã nguồn lên GitHub không tự thay đổi website đang chạy trên Sites.

## Thư viện bên thứ ba

Các tệp trong `dist/vendor/` giữ nguyên thông báo bản quyền gốc. Xem `THIRD_PARTY.md`. Không áp dụng giấy phép mới cho thư viện hoặc tài sản hình ảnh bên thứ ba.
