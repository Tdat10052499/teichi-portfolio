# N.E.D Wallet — case study & demo

## Nội dung

N.E.D Wallet là dự án đang phát triển cho UniHackfest 2026; Hồ Du tuấn Đạt — Teichi D. tham gia với vai trò Project owner. Định hướng là ví Solana Web2.5 lấy USDC làm trung tâm, giúp người chưa quen crypto tiếp cận thao tác quản lý tiền bằng ngôn ngữ quen thuộc.

Trang `dist/ned.html` trình bày câu hỏi sản phẩm, vai trò, nguyên tắc trải nghiệm, màn hình thiết kế, demo và kiến trúc. Không gán thành tích hay đóng góp kỹ thuật cá nhân chưa được xác nhận.

## Phân biệt trạng thái

- Có trong nguồn: Dynamic Google/embedded wallet, onboarding, identity PDA, luồng chuyển USDC Devnet, balance/history và dApp browser.
- Demo: xStocks mua/bán qua ledger mô phỏng; swap SOL/USDC dùng quote nhưng không ký/broadcast trong luồng demo.
- Thiết kế/định hướng: Earn, T.E.D lập kế hoạch tiền, hành vi chuyển đổi Simple/Crypto đầy đủ.
- PDF có nội dung miễn gas nhưng ghi chú mới hơn cho biết chuyển Devnet vẫn cần SOL. Không trình bày APY mẫu như cam kết.

Nền tảng sản phẩm: Expo / React Native, TypeScript, Zustand, Dynamic, Anchor/Rust, Helius, Jupiter, SNS và GeckoTerminal. Portfolio hiện là website tĩnh; việc chuyển sang Next.js là bước riêng chưa thực hiện.

## Kịch bản tương tác

1. Khởi đầu với $750 tiền mẫu, 0.5 AAPLx và 0.6 NVDAx. Giá cố định $243.42 / $162.15, không tải API thị trường.
2. Chọn tài sản; nhập hoặc chọn nhanh số tiền mua/bán. Số tiền phải dương, tối đa hai chữ số thập phân và không vượt số dư/giá trị tài sản mẫu.
3. Review hiển thị phí minh họa 0.25%, số token và tổng debit/net credit. Người dùng xác nhận hiểu đây là dữ liệu mẫu.
4. Xác nhận cập nhật ledger trong bộ nhớ; giao dịch mua trừ tổng số tiền, phí được khấu trừ trước khi tính token nhận. Giao dịch bán cộng số tiền sau phí.
5. Tiếp tục bán hoặc về ví. Reset có hộp xác nhận; Escape hủy reset. Refresh cũng khởi tạo lại phiên.

Mây: coding khi khám phá/nhập liệu, thinking ở review, happy khi hoàn tất. Vẫn có chào bằng click/Enter/Space, chọn biểu cảm và nghỉ khi không tương tác. Tắt Motion hoặc prefers-reduced-motion giữ sprite tĩnh. Teddy màu tím là mascot của sản phẩm, xuất hiện ở kết quả demo.

## Nguồn

- Repository: https://github.com/Tdat10052499/Unihackfest-2026
- Snapshot nghiên cứu: `68e5cc7fb6a990d8e2fdddbd470a25f2e02a76c7`.
- `docs/02-thiet-ke/ui-pdf-alignment.md`, `docs/tong-hop-tien-do.md`, mã nguồn app và package.json.
- NED Wallet Design System.pdf do chủ dự án cung cấp, màn hình Home / xStocks / asset detail; hình là dữ liệu thiết kế.

## Chạy thử

`npm start`, rồi mở http://localhost:4173/ned.html. Không cần backend, khóa API hoặc kết nối ví. Deploy toàn bộ `dist/` để giữ liên kết về portfolio.

## Scroll & Mây update
Native scrolling includes reveal transitions, layered hero motion, reading progress and chapter navigation. Mây docks outside the demo guide slot, responds to each chapter and to keyboard focus/hover on content cards. Controls support greeting, chapter notes, next chapter and minimizing. On small screens the dock starts minimized. Motion off and reduced-motion disable decorative movement.


## Updated handoff location
The static reference now lives under `handoff/ned-reference/`. All `dist/` and `npm start` references above are relative to that folder. The repository root preserves the existing Next.js application.

