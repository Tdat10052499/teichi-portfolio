# Prompt tiếp tục phát triển trong workspace

Sao chép nội dung bên dưới vào coding agent trong workspace chứa repository này.

---

Hãy tiếp tục phát triển portfolio của Hồ Du tuấn Đạt — Teichi D. (Van Lang University) từ repository https://github.com/Tdat10052499/teichi-portfolio. Kiểm tra git status, bảo toàn thay đổi đang có. Thực hiện triển khai và kiểm thử, không chỉ đưa ra kế hoạch.

Nguồn bàn giao nằm ở nhánh `feat/ned-case-study-demo`: `dist/ned.html`, `dist/ned.css`, `dist/ned.js`, `dist/ned-motion.css`, `dist/ned-motion.js`, `dist/may-pixel.js`, `dist/assets/ned/`, sprite `dist/assets/may-sprite.png` và `NED_CASE_STUDY.md`. Fetch nhánh này và đọc/copy có chọn lọc bằng git show hoặc checkout phụ; không merge nguyên nhánh tĩnh vào main, không reset/ghi đè dự án Next.js hiện tại. Bản main đã kiểm tra tại commit `1a098b2` dùng Next.js với `src/app/`, `src/components/` và `src/data/portfolio.ts`; hãy kiểm tra lại HEAD thực tế trước khi làm.

Đọc AGENTS.md trong workspace và tài liệu Next.js cục bộ mà file này yêu cầu. Đọc component hiện có, đặc biệt SelectedWork.tsx, Hackathon.tsx, MayMascot.tsx và MotionProvider.tsx; tái sử dụng cơ chế motion/mascot thay vì tạo hai hệ thống listener hoặc canvas trùng nhau.

## Mục tiêu và phạm vi

Tích hợp bản case study N.E.D Wallet và demo tương tác vào website cá nhân trong workspace của tôi. Nếu workspace đã dùng Next.js, tích hợp vào cấu trúc hiện có. Nếu đây vẫn là bản HTML/CSS/JS tĩnh, chuyển sang Next.js App Router + TypeScript, giữ giao diện, nội dung và hành vi hiện có. Không tự triển khai công khai nếu tôi chưa yêu cầu trong workspace này.

Giữ phong cách tối giản: nền #111210, chữ #f2f3e9, điểm nhấn lime #d9ff62. Trang N.E.D có điểm nhấn tím #7B2FBE. Giữ native cursor; chỉ thay hình cursor đúng ngữ nghĩa trên thành phần có thể tương tác. Không biến nội dung thành mẫu SaaS chung.

## Nội dung phải bảo toàn

- Trang chủ: hero, selected work, research, hackathon, about và contact; giữ ID section hiện có để liên kết sâu hoạt động.
- Research: “Signed but Stale: Rolling Back Backdoor Repairs Through Shard-Version Skew in 6G Edge Inference”, trạng thái under review. Không bịa kết quả, DOI hoặc công bố.
- N.E.D Wallet: Project owner tại UniHackfest 2026, đang phát triển; không gán thành tích hoặc đóng góp kỹ thuật cá nhân chưa được xác nhận.
- N.E.D là Expo / React Native / Solana; không nhầm công nghệ Next.js của portfolio với công nghệ app N.E.D.
- Case study gồm định hướng, thiết kế, demo, trạng thái implementation/demo/roadmap và kiến trúc. Dùng NED_CASE_STUDY.md làm nguồn; không mô tả Earn, T.E.D hoặc trading demo như dịch vụ tài chính đã hoạt động.
- Origin Collective và Relay Network tiếp tục được ghi rõ là concept.

## Routing và cập nhật đường dẫn — bắt buộc

Dùng route chuẩn cho case study mới là `/projects/ned-wallet`, trang chủ là `/`.

1. Với cấu trúc main hiện tại, tạo `src/app/projects/ned-wallet/page.tsx`; trang chủ là `src/app/page.tsx`. Chỉ dùng `app/` ở root nếu workspace thực tế đã đổi cấu trúc.
2. Chuyển mọi link `ned.html` ở work card, modal case study và khối giới thiệu N.E.D thành `/projects/ned-wallet`.
   Kiểm tra cả `src/data/portfolio.ts`, `src/components/SelectedWork.tsx` và `src/components/Hackathon.tsx`: cập nhật href/action của dự án N.E.D để mở trang mới. Nếu card đang mở modal chung, thêm CTA rõ ràng hoặc chuyển riêng N.E.D sang route mới; giữ hành vi hai concept còn lại.
3. Chuyển `index.html`, `index.html#work`, `index.html#contact` thành `/`, `/#work`, `/#contact`. Điều hướng chương trên case study phải trỏ tới ID của chính trang đó; không chuyển nhầm về section trên homepage.
4. Giữ anchor `#story` và `#demo`; đặt ID ổn định cho design, status, engineering và next-steps. Sidebar chương và nút “Next chapter” phải dùng cùng danh sách ID đó.
5. Chuyển `dist/assets/ned/*` vào `public/assets/ned/`, sprite Mây vào `public/assets/may-sprite.png`, cùng các tài nguyên khác đang được dùng. Sửa đường dẫn ảnh từ `assets/...` hoặc `./assets/...` thành URL asset đúng từ public; không để trình duyệt tìm ảnh dưới `/projects/ned-wallet/assets/`.
6. Không giữ `new URL('./assets/may-sprite.png', import.meta.url)` nếu sprite đã chuyển vào public; dùng URL public rõ ràng. Không copy stylesheet có đường dẫn import cũ mà không sửa.
7. Nếu deployment dùng subpath/basePath, đọc cấu hình hosting thực tế và áp dụng helper asset URL có prefix nhất quán. Next Link xử lý route với cấu hình basePath; tránh thêm prefix hai lần. Không tự giả định tên repository là basePath nếu dùng domain gốc.
8. Giữ tương thích link cũ `/ned.html` bằng redirect tới `/projects/ned-wallet` khi hosting hỗ trợ; nếu static export không hỗ trợ redirect server, dùng trang chuyển hướng tương thích và giữ hash hoặc cấu hình redirect của host. Chọn giải pháp đúng với target deployment.
9. Kiểm tra truy cập trực tiếp và refresh route mới, back/forward, hash, asset URLs ở route lồng nhau và mọi CTA trong trang chủ. Không hardcode localhost hoặc tên miền Sites cũ vào internal links.

## Thành phần và tương tác

Tách các thành phần rõ ràng, ví dụ NedCaseStudy, NedWalletDemo, MayCompanion, ChapterNavigation và ScrollEffects. Nội dung tĩnh ưu tiên Server Components; demo, canvas, observer và animation nằm trong Client Components. Không truy cập window/document trong SSR. Cleanup event listeners, ResizeObserver, IntersectionObserver và requestAnimationFrame khi unmount; không nhân đôi animation sau điều hướng client/React Strict Mode.

- Scroll native mượt, reveal theo viewport, lớp màn hình hero dịch chuyển nhẹ, reading progress và điều hướng chương hoạt động. Giữ nội dung đọc được nếu JS hoặc animation không khởi tạo. Có thể dùng GSAP/ScrollTrigger tương thích dependency hiện tại, với cleanup; không ép scroll hoặc khóa wheel/touch.
- Mây ở dạng pixel 2D, dùng sprite hiện có; không thay bằng 3D. Giữ idle/happy/thinking/coding/sleepy, nhìn nhẹ theo pointer, chào qua click/Enter/Space, chọn biểu cảm, phản ứng khi không thao tác và khi thực hiện demo.
- Mây có lời dẫn theo từng chương, phản ứng hover và keyboard focus trên thẻ nội dung. Có nút chào, xem gợi ý, chuyển chương và thu gọn. Di động mặc định thu gọn khi dock; không che nút xác nhận, input, CTA hoặc modal. Tách tooltip thông thường khỏi live announcement để screen reader không bị thông báo liên tục khi cuộn.
- Mây là bạn đồng hành của portfolio; Teddy tím là mascot N.E.D và xuất hiện ở kết quả demo. Không nhập hai nhân vật thành một.
- Tôn trọng prefers-reduced-motion và Motion toggle, ngừng chuyển động trang trí khi tắt; không làm mất chức năng hay nội dung.

## Logic demo phải bảo toàn

Hoàn toàn là mô phỏng, không kết nối ví, không ký giao dịch, không gọi API giá hoặc gửi tiền. Dữ liệu ban đầu: $750 tiền mẫu, 0.5 AAPLx và 0.6 NVDAx; giá mẫu $243.42 và $162.15. Phí minh họa 0.25% được ghi rõ là giả định của walkthrough.

Luồng: chọn tài sản → mua/bán → số tiền → review → xác nhận hiểu đây là dữ liệu mẫu → kết quả → tiếp tục/đặt lại. Tiền dùng số nguyên cents; xử lý rounding nhất quán. Chặn số âm, rỗng, NaN, quá hai chữ số thập phân, vượt tiền hoặc lượng token, và xác nhận lặp. Chỉ cập nhật ledger trong bộ nhớ. Reset có xác nhận, Escape hủy; refresh reset phiên. Không thêm backend hoặc lưu dữ liệu cá nhân cho demo này.

## Tiêu chí hoàn thành

- Nội dung và thiết kế hiện tại được bảo toàn; layout tốt ở 390px, tablet và desktop, không tràn ngang.
- Tất cả link, ảnh, sprite, font và vendor assets hoạt động sau khi đổi route, cả truy cập trực tiếp lẫn điều hướng client.
- Kiểm thử mua, bán, input lỗi, số dư, checkbox xác nhận, reset/Escape và chống double-submit.
- Kiểm thử bàn phím, focus sau chuyển bước, modal, các phản ứng Mây, cuộn/chuyển chương, thu gọn và reduced motion.
- Chạy lint/typecheck/build và các test phù hợp với dự án, sửa lỗi liên quan. Kiểm tra không có hydration error, console error hoặc request 404.
- Cập nhật README với lệnh chạy/build/deploy, routing mới và trạng thái còn hạn chế. Báo cáo file đã thay đổi, kết quả kiểm thử và việc chưa làm. Không tuyên bố đã deploy hoặc migration hoàn tất nếu chưa xác minh.
