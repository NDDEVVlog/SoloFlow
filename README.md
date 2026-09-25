# SoloFlow — Hệ thống quản lý công việc cá nhân đa vai trò

Ứng dụng web (React + TypeScript) lấy cảm hứng từ Jira/Trello, dành cho một
người "thầu" nhiều vai trò trong một dự án (Game Design, UI/UX, Developer,
Marketing...). Gồm 3 màn hình: **Project Overview** (master backlog),
**My Work** (Kanban/List theo sprint, có Overload Indicator) và
**Performance Dashboard** (biểu đồ velocity, phân bổ khối lượng theo Role,
Est vs Actual).

Dữ liệu được lưu tự động vào `localStorage` của trình duyệt — không cần
backend, không cần đăng nhập.

## 1. Cài đặt

Yêu cầu: [Node.js](https://nodejs.org) bản 18 trở lên (khuyến nghị 20+) và npm.

```bash
# Giải nén / clone thư mục dự án, sau đó:
cd soloflow
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ hiện ra trong terminal (mặc định
`http://localhost:5173`). Lần chạy đầu tiên, ứng dụng tự nạp sẵn 3 task mẫu
đúng như trong đề bài (TSK-001, TSK-002, TSK-003) để bạn test ngay.

### Các lệnh khác

```bash
npm run build     # build production vào thư mục dist/
npm run preview   # xem thử bản build production
npm run lint      # kiểm tra lỗi lint
```

## 2. Cấu trúc 3 màn hình

| Route | Màn hình | Mô tả |
|---|---|---|
| `/overview` | Project Overview | Bảng (table) toàn bộ task, filter theo role/priority/status/sprint, tạo task mới, click vào 1 dòng để mở modal chi tiết (Description, Checklist, Comments). |
| `/my-work` | My Work | Task của sprint đang chọn. Toggle List ⇄ Kanban (kéo-thả đổi trạng thái). Overload Indicator: tổng Est. Time của task Todo + In Progress, đỏ khi > 40h/tuần. |
| `/dashboard` | Performance Dashboard | Biểu đồ Time & Progress theo Ngày/Tuần/Tháng, Workload by Role (pie + bar), bảng Est vs Actual. |

Đổi sprint đang xem ở dropdown trên đầu trang **My Work** — Dashboard và
Overload Indicator sẽ tự cập nhật theo sprint đó.

## 3. Reset dữ liệu mẫu

Nút "Reset to sample data" ở cuối sidebar sẽ xoá toàn bộ dữ liệu hiện tại
và nạp lại đúng 3 task mẫu trong đề bài — dùng khi muốn test lại từ đầu.

## 4. Công nghệ sử dụng

- **React 18 + TypeScript + Vite** — UI & build tool.
- **Zustand** (+ `persist` middleware, storage tuỳ biến) — state toàn cục,
  tự động lưu vào `localStorage` dưới dạng JSON nhưng vẫn khôi phục lại
  đúng các class model (xem `ARCHITECTURE.md`).
- **@dnd-kit** — kéo-thả cho Kanban board.
- **Recharts** — biểu đồ Dashboard.
- **React Router (HashRouter)** — điều hướng 3 màn hình, chạy tốt kể cả khi
  mở file tĩnh không qua server có cấu hình rewrite.
- **TailwindCSS** — styling.

## 5. Tài liệu khác

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — kiến trúc OOP, luồng dữ liệu,
  và hướng dẫn mở rộng (thêm field mới, thêm subclass Task, đổi backend...).
  Đọc file này trước khi sửa code — kể cả khi bạn là một AI agent khác
  (Claude Code, Cursor, v.v.) được giao tiếp tục dự án.

## 6. Giới hạn hiện tại (chưa làm)

- Chưa có backend/đồng bộ nhiều thiết bị — dữ liệu chỉ nằm trong
  `localStorage` của một trình duyệt.
- Chưa có xác thực người dùng (ứng dụng single-user theo đúng đề bài).
- Comments/Activity log là ghi chú thủ công, chưa tự động log mọi thay đổi
  trường (status, priority...) — xem gợi ý mở rộng trong `ARCHITECTURE.md`.
