---
description: Chứa các quy chuẩn, hướng dẫn thiết kế và coding style cho giao diện RedisGUI.
---

# UI/UX Design & Implementation Skills cho RedisGUI

Đây là bộ quy tắc dành cho việc xây dựng và phát triển Frontend (Renderer) của dự án RedisGUI.
Khi được yêu cầu làm các task liên quan đến UI/UX, hãy đọc và tuân thủ tuyệt đối các nguyên tắc này.

## Kiến trúc Giao diện & Layout (Beekeeper Studio Style)
- **Tư tưởng chủ đạo:** Chuyên nghiệp, Tối giản, Đậm chất kỹ thuật (Developer-focused). Tránh các hiệu ứng hoạt hình màu mè, ưu tiên cho việc hiển thị dữ liệu và không gian nhập liệu với viền sắc nét.
- **Connection Manager:**
  - Layout luôn phải 2 cột: Cột trái lịch sử (có thể click lại cấu hình), Cột phải Form để Add/Edit cấu hình đó.
- **Main Workspace:**
  - Hỗ trợ màn hình chia ngăn (Split Panes) sử dụng `react-resizable-panels`.
  - Activity Bar Mỏng nhất ngoài cùng: Icon chuyển hướng.
  - Sidebar Navigator: Cây thư mục bên trái có list Entities & Pinned.
  - Main Window:
    - Khung trên (Top panel): Tabs các file/editor. Bên trong là Textarea Query Editor, phía góc dưới bên phải có nút Run màu Vàng và Save.
    - Khung dưới (Bottom panel): Table kết quả.
  - Status Bar: Nằm dưới cùng, màu Cyan (sáng đậm).
- **Color Themes/Màu sắc:** Ưu tiên sử dụng tone màu tươi sáng. Sử dụng mã màu bảng **Solarized Light** cho chế độ mặc định (Light Mode) và **Solarized Dark** cho giao diện chế độ tối (Dark Mode).

## Tech Stack & Code Style
- **Frameworks:** Sử dụng React (Functional Component, Hooks) + TypeScript.
- **UI Component Library:** Bắt buộc sử dụng các components từ `shadcn/ui`. Nếu component chưa tồn tại trong `src/renderer/src/components/ui`, hãy cài đặt hoặc thêm nó thay vì viết từ đầu (trừ khi không có).
- **Styling:** Hoàn toàn bằng **TailwindCSS** (sử dụng class utils như `cn`, `clsx`, `tailwind-merge` phổ biến trong shadcn).
- **Icons:** Sử dụng thư viện `lucide-react`.

## Quản lý State và Dữ liệu
- **Data Fetching/Logic:** Tách biệt UI và Logic. Ở các bước dựng layout hoặc đang design, TUYỆT ĐỐI dùng `placeholder data` (Mock Data) như string tĩnh, mảng dummy để hiển thị thay vì cố gắng gọi vào Electron IPC khi luồng Backend chưa sẵn sàng.

## Validation & Forms
- Các Form nhập liệu (Ví dụ: Form Connection) nên ưu tiên sử dụng form thuần hoặc form của Shadcn (`react-hook-form` kết hợp `zod`). Nếu dự án chưa có thì dùng HTML form cơ bản kết hợp React state.
