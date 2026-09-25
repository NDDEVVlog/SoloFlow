# Kiến trúc dự án (đọc trước khi sửa code)

Tài liệu này dành cho bất kỳ ai — người hoặc AI coding agent — tiếp tục
phát triển dự án. Mục tiêu thiết kế: **dễ mở rộng** (thêm field, thêm loại
task, đổi nơi lưu trữ) mà không phải sửa lan man nhiều file.

## 1. Sơ đồ thư mục

```
src/
  models/        # Domain layer — OOP, không phụ thuộc React/Zustand
    enums.ts        Priority, TaskStatus, TaskType, Role, màu sắc
    ChecklistItem.ts Một dòng checklist (id, label, done)
    Checklist.ts     Danh sách ChecklistItem + tính % tiến độ
    Comment.ts       Một bình luận/activity log
    Sprint.ts        Một sprint/tuần (tên, ngày bắt đầu/kết thúc, capacity)
    Task.ts          Aggregate root: sở hữu Checklist + Comment[]
    index.ts         Barrel export

  store/         # Application layer — Zustand
    useTaskStore.ts  State toàn cục + mọi action (CRUD task, checklist,
                     comment, sprint, role) + cấu hình persist
    selectors.ts     Hàm thuần tính dữ liệu phái sinh cho Dashboard
                     (workload theo role, overload hours, est-vs-actual)

  components/    # Presentation layer — chia theo màn hình
    common/          Badge, ProgressBar, Modal, IconButton (dùng chung)
    overview/        TaskTable, TaskDetailModal, NewTaskModal, Toolbar
    mywork/          KanbanBoard, KanbanColumn, TaskCard, OverloadIndicator,
                     ViewToggle
    dashboard/       TimeProgressChart, WorkloadByRole, EstVsActualTable

  pages/         # Một page = một route, chỉ lắp ráp component + đọc store
    OverviewPage.tsx, MyWorkPage.tsx, DashboardPage.tsx

  utils/         # Hàm thuần, không có state
    id.ts            Sinh TSK-001, TSK-002... và short id cho sub-entity
    time.ts          Format ngày giờ + gom nhóm dữ liệu theo Ngày/Tuần/Tháng
    sampleData.ts    3 task mẫu trong đề bài
```

Nguyên tắc: **models/ không import bất cứ gì từ store/ hay components/**.
Chiều phụ thuộc luôn là `components → pages / store → models`. Nhờ vậy có
thể viết unit test cho `models/` và `utils/` mà không cần React.

## 2. Vì sao dùng class (OOP) thay vì chỉ dùng interface?

`Task`, `Checklist`, `ChecklistItem`, `Comment`, `Sprint` là các **class**
thật (có method), không chỉ là kiểu dữ liệu. Lý do:

- Logic tính toán (`checklistProgress()`, `varianceHours()`,
  `isOverdue()`, `isActiveWorkload()`...) nằm **đúng một chỗ**. Table,
  Kanban card, Dashboard đều gọi cùng một method — không thể có chuyện
  Overview tính % checklist khác với My Work.
- Dễ mở rộng bằng kế thừa. Ví dụ muốn thêm loại "BugTask" có thêm field
  `severity`, `stepsToReproduce`:

  ```ts
  // src/models/BugTask.ts
  export class BugTask extends Task {
    severity: 'S1' | 'S2' | 'S3' = 'S3'
    stepsToReproduce = ''
  }
  ```

  Không cần sửa `useTaskStore.ts`, `TaskTable.tsx` hay `KanbanBoard.tsx` —
  chúng chỉ thao tác qua các field/method chung của `Task`.

### Vấn đề serialize và cách giải quyết

Zustand `persist` middleware mặc định lưu state bằng `JSON.stringify`, mà
`JSON.parse` lại **không** khôi phục lại class — nó chỉ tạo ra plain
object mất hết method. `useTaskStore.ts` giải quyết việc này bằng một
`storage` tuỳ biến (`classAwareStorage` + `getItem`/`setItem` override):

- Khi ghi vào `localStorage`: gọi `.toJSON()` trên từng `Task`/`Sprint`.
- Khi đọc từ `localStorage`: gọi `Task.fromJSON()` / `Sprint.fromJSON()` để
  dựng lại đúng instance (có đầy đủ method) trước khi đưa vào state.

Nếu sau này đổi từ `localStorage` sang gọi API backend, chỉ cần viết một
`storage` khác theo interface `StateStorage` của Zustand — phần còn lại
của app (component, action) không đổi.

## 3. Luồng dữ liệu

```
UI event (click, drag, submit form)
   → gọi action trong useTaskStore (vd: setTaskStatus, addChecklistItem)
      → action mutate field trên Task instance (giữ nguyên object,
        gọi task.touch() để cập nhật updatedAt) rồi set() lại mảng tasks
         → Zustand re-render mọi component đang subscribe
         → persist middleware tự động ghi xuống localStorage
```

Không có state cục bộ nào giữ "bản sao" của task — mọi nơi hiển thị dữ
liệu (table, card, modal, chart) đều đọc trực tiếp từ `useTaskStore`, nên
sửa 1 chỗ (vd tick checklist trong Kanban card modal) phản ánh ngay lập
tức ở Overview.

## 4. Các điểm mở rộng gợi ý sẵn

| Muốn làm gì | Sửa ở đâu |
|---|---|
| Thêm field mới cho Task (vd `estCost`) | Thêm vào `TaskInit`/`TaskJSON` trong `Task.ts`, thêm input trong `TaskDetailModal.tsx` |
| Thêm trạng thái Kanban mới | Thêm vào mảng `TASK_STATUSES` và `STATUS_STYLES` trong `enums.ts` — Kanban board và filter tự nhận |
| Đổi ngưỡng overload 40h | Đổi hằng số `OVERLOAD_CAP_HOURS` trong `selectors.ts`, hoặc nâng cấp để đọc từ `Sprint.capacityHours` |
| Thêm backend (REST/Supabase/Firebase) | Viết lại phần `storage` trong `useTaskStore.ts` để gọi API thay vì `localStorage`; giữ nguyên toàn bộ action signature |
| Ghi log tự động mọi thay đổi field (không chỉ comment thủ công) | Trong `updateTask` (useTaskStore.ts), so sánh field cũ/mới rồi gọi `task.addComment('System', ...)` |
| Thêm role mới ngay trong lúc tạo task | Đã có sẵn: gõ role mới vào ô "Role" trong `NewTaskModal` → tự thêm vào danh sách role qua `addRole` |
| Đổi công thức tính variance/estimate | Sửa `varianceHours()` / `variancePercent()` trong `Task.ts` — mọi nơi dùng lại tự động đúng |

## 5. Quy ước code

- Alias `@/` trỏ tới `src/` (khai báo ở `tsconfig.json` và `vite.config.ts`).
- Màu sắc theo role là **hash-based** (`colorForRole` trong `enums.ts`) nên
  role tự thêm luôn có màu ổn định, không cần khai báo tay.
- Mỗi file component có một đoạn comment ngắn ở đầu giải thích *tại sao*
  nó tồn tại/tại sao thiết kế như vậy — ưu tiên đọc comment trước khi đọc
  logic chi tiết.
