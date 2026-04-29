## Plan: Thiết kế UI/UX cho RedisGUI (Beekeeper Studio Pattern)

Xây dựng hệ thống giao diện cho phần mềm RedisGUI lấy cảm hứng từ Beekeeper Studio, tận dụng tối đa Shadcn UI và TailwindCSS. Sử dụng placeholder data để tập trung hoàn thiện mảng hiển thị & luồng thao tác trước.

**Steps**
1. **Khởi tạo và Cấu hình Layout Framework**: Cài đặt các component Shadcn cần thiết: `Resizable` (react-resizable-panels), `Tabs`, `Table`, `Form`, `Input`, `Button`, `ScrollArea`, `Card`.
2. **Phase 1: Xây dựng Connection Manager (Màn hình Kết nối)**
   - Tạo Màn hình chia làm 2 pane dọc (trái: danh sách lịch sử kết nối, phải: form kết nối).
   - *Cột Trái*: Danh mục các kết nối đã lưu (Mock data: Localhost, Staging Redis, Prod Redis).
   - *Cột Phải*: Form điền thông tin kết nối (Tên, Host, Port, Username, Password, v.v.) và nút Connect.
3. **Phase 2: Xây dựng Main Workspace (Màn hình Truy vấn & Tiện ích)**
   - *Activity Bar trái ngoài cùng*: Chứa các icon Navigation chính như Server, Starred, History.
   - *Sidebar (Inner)*: Database Navigator tree, có thanh search và danh sách Entities.
   - *Main Area*: Sử dụng Resizable Panels chia ngang (trên-dưới) kết hợp với Tabs ở đầu.
     - *Pane Trên (Query Editor)*: Tab Editor ở góc trên. Khung nhập text có các nút Run (Vàng) và Save nhỏ ở góc dưới bên phải Editor.
     - *Pane Dưới (Results & Utilities)*: Table Data list dạng dòng-cột rõ ràng.
   - *Status Bar*: Thanh thông tin dưới cùng đậm màu (cyan) mô tả trạng thái, rows, engine (SQLite -> Redis).
4. **Phase 3: Logic UI và State Tạm thời**
   - Quản lý state chuyển đổi giữa 2 màn hình (Connection -> Hướng sang Main Workspace khi bấm Connect).

**Relevant files**
- `src/renderer/src/App.tsx` — Chứa state điều hướng giữa Màn hình kết nối và Màn hình chính.
- `src/renderer/src/components/ConnectionScreen.tsx` — Layout của quản lý kết nối.
- `src/renderer/src/components/MainWorkspace.tsx` — Layout làm việc chính chứa Resizable panels/Tabs.
- `src/renderer/src/components/ui/*` — Các component UI tái sử dụng từ Shadcn.

**Verification**
1. Chạy `npm run dev` để kiểm tra màn hình kết nối form nhập liệu có render chính xác và hiển thị danh sách mock data ở cột trái không.
2. Từ form, bấm "Connect" để chuyển sang màn hình làm việc chính, kiểm tra thao tác kéo-thả (resize) giữa các panes (Sidebar, Query, Results) có mượt mà, không giật hoặc bể layout không.

**Decisions**
- Quyết định chia bố cục giống Beekeeper Studio: Activity Bar mỏng icon, Sidebar chứa Entities/Keys, Main phân chia màn hình trên dưới (Editor và Table) với nút Run màu vàng đặc trưng, và Status bar màu nổi.
- Chỉ sử dụng placeholder data ở Frontend (không gọi IPC Electron thật ở logic này).
- Cập nhật Theme: Sử dụng theme Solarized (Solarized Light làm mặc định cho độ sáng và Solarized Dark cho chế độ tối).

**Further Considerations**
1. Đối với Query Editor, bạn có muốn tích hợp `@monaco-editor/react` (thư viện đằng sau VSCode) để có syntax highlighting (tô màu chữ, gợi ý lệnh Redis) không? Hay tạm thời dùng `textarea` cơ bản để dựng nhanh layout?
