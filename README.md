# Deyline

Một ứng dụng lập kế hoạch deadline và công việc cá nhân, chạy hoàn toàn trên trình duyệt. Deyline được xây dựng theo hướng local-first: không cần đăng ký tài khoản, backend hay API key.

## Tính năng

- Dashboard hiển thị công việc hôm nay, deadline gần nhất, tiến độ và công việc quá hạn.
- Tạo, sửa, xóa kế hoạch deadline hoặc kế hoạch công việc.
- Tạo, sửa, xóa, đánh dấu hoàn thành và sắp xếp thứ tự task trong từng kế hoạch.
- Calendar theo tuần hoặc tháng để xem task theo ngày và trạng thái.
- Thư viện template để khởi tạo nhanh một kế hoạch mẫu.
- Hồ sơ cá nhân cục bộ với tên, email, mô tả và màu avatar.
- Responsive trên desktop và mobile.

## Công nghệ

- Next.js 15
- React 19
- TypeScript
- Ant Design Icons
- IndexedDB cho lưu trữ dữ liệu trên trình duyệt

## Yêu cầu

- Node.js 20 trở lên
- npm 10 trở lên

## Cài đặt và chạy dự án

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Các lệnh hữu ích

```bash
# Chạy môi trường phát triển
npm run dev

# Tạo bản production
npm run build

# Chạy bản production sau khi build
npm run start
```

## Cấu trúc thư mục

```text
app/                         # App Router và stylesheet toàn cục
features/planner/            # Tính năng lập kế hoạch
  components/                # UI: modal, task row, plan card, plan flow
  hooks/usePlanner.ts        # State và các thao tác với plan/task
  templates.ts               # Danh sách template có sẵn
  types.ts                   # Kiểu dữ liệu domain
lib/
  date.ts                    # Hàm xử lý ngày tháng
  storage.ts                 # Đọc/ghi IndexedDB
```

## Lưu trữ dữ liệu

Dữ liệu được lưu trong IndexedDB của trình duyệt với database `deyline-planner`. Vì vậy dữ liệu không được gửi đến máy chủ và chỉ có trên trình duyệt/máy đang sử dụng.

Xóa dữ liệu trang web trong trình duyệt hoặc dùng một trình duyệt/thiết bị khác sẽ không giữ lại các kế hoạch đã tạo.

## Kiểm tra

```bash
npm run build
```

Lệnh build thực hiện kiểm tra TypeScript và tạo bản production tối ưu.

## Giấy phép

Dự án hiện chưa khai báo giấy phép.
