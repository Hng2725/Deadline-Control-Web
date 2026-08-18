# Local Deadline & Work Planner — V1

## Tóm tắt

Xây dựng website responsive chạy hoàn toàn trên máy local, không cần đăng ký/đăng nhập và không dùng dịch vụ trả phí. Ứng dụng giúp lập kế hoạch deadline hoặc công việc thường ngày qua dashboard, calendar kéo-thả và các card trực quan; đồng thời có thư viện plan mẫu để tham khảo và sao chép.

## Công nghệ và tài nguyên miễn phí

- Next.js + TypeScript + Tailwind CSS, chạy local bằng `npm run dev`.
- Lưu toàn bộ dữ liệu trên trình duyệt bằng IndexedDB; không cần backend, database cloud hay API trả phí.
- `dnd-kit` cho kéo-thả task, `date-fns` xử lý ngày tháng, Lucide Icons cho icon, và font Inter hoặc Geist miễn phí.
- Không yêu cầu tài khoản, email, notification server hay bất kỳ khóa API nào.

## Chức năng chính

- Dashboard dạng card: việc hôm nay, deadline sắp đến, việc quá hạn, tiến độ các plan và các task ưu tiên cao.
- Tạo hai loại plan:
  - Deadline plan: mục tiêu, ngày đến hạn, milestone và task.
  - Work plan: danh sách công việc bình thường, không bắt buộc deadline.
- Task gồm tiêu đề, mô tả ngắn, ngày thực hiện, độ ưu tiên, trạng thái và ước lượng thời gian.
- Calendar tuần/tháng là màn hình lập kế hoạch chính: kéo task sang ngày khác hoặc đổi thứ tự trong cùng ngày; thay đổi được lưu ngay vào IndexedDB.
- Card task đơn giản, dễ đọc: màu theo mức ưu tiên, nhãn deadline, trạng thái hoàn thành và thanh tiến độ plan.
- Cho phép hoàn thành task, chỉnh sửa/xóa task, lọc theo plan/trạng thái/ưu tiên và xem task quá hạn.
- Quy tắc gợi ý miễn phí: ưu tiên deadline gần, cảnh báo task quá hạn và cảnh báo khi số task còn lại không tương xứng với số ngày trước deadline.

## Thư viện cộng đồng cục bộ

- Trang Community chứa các template được đóng gói sẵn trong ứng dụng, ví dụ: “Prepare for an exam”, “Launch a portfolio website”, “Plan a trip”, “Weekly work planning”.
- Người dùng tìm kiếm/lọc template theo danh mục, thời lượng và độ khó; xem chi tiết task/milestone.
- Nút “Use this template” sao chép template thành plan riêng trong dữ liệu local.
- Không có đăng bài, hồ sơ, bình luận hoặc chia sẻ đa người dùng ở V1; các phần đó chỉ phù hợp khi có backend và tài khoản.

## Thiết kế giao diện

- Phong cách tối giản, hiện đại, nhiều khoảng thở; card bo góc vừa phải, shadow nhẹ và màu nhấn rõ ràng cho trạng thái deadline.
- Navigation gồm Dashboard, My Plans, Calendar và Community.
- Responsive cho desktop, tablet và mobile; desktop ưu tiên bố cục dashboard + lịch dễ quan sát, mobile dùng danh sách card và calendar thu gọn.
- Có empty states, onboarding ngắn và dữ liệu demo để có thể test ngay khi mở ứng dụng.

## Kiểm thử

- Kiểm tra tạo, chỉnh sửa, hoàn thành, xóa task/plan và tính tiến độ chính xác.
- Kiểm tra kéo-thả task giữa ngày, sắp thứ tự task và khả năng giữ dữ liệu sau khi reload.
- Kiểm tra cảnh báo deadline sắp đến/quá hạn và bộ lọc task.
- Kiểm tra sao chép template không làm thay đổi template gốc.
- Kiểm tra giao diện và thao tác kéo-thả trên desktop lẫn mobile.

## Giả định đã chốt

- Ngôn ngữ giao diện là English.
- Dữ liệu chỉ tồn tại trên trình duyệt/máy local hiện tại; xóa dữ liệu trình duyệt sẽ mất dữ liệu ứng dụng.
- Mọi thư viện, icon, font và công cụ sử dụng đều miễn phí hoặc mã nguồn mở.
