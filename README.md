# Time Slate

Ứng dụng lịch time-blocking xây dựng bằng React + TypeScript + Tailwind CSS để tạo giao diện.

## Tính năng

- Xem lịch dạng lưới 24 giờ, hiển thị thời gian 7 ngày từ ngày hiện tại
- Tạo sự kiện bằng cách kéo chọn một khoảng thời gian trống
- Di chuyển sự kiện bằng cách kéo-thả sang khung giờ/ngày khác
- Sự kiện kéo dài nhiều ngày được hiển thị riêng trên thanh `MultiDayEventBar`
- Click trái vào sự kiện để xem chi tiết
- Click phải vào sự kiện để mở menu ngữ cảnh với **Sửa** và **Xóa**
- Dữ liệu sự kiện được lưu trong `localStorage`
- Đường kẻ hiển thị thời gian hiện tại trên cột của ngày hôm nay

## Công nghệ sử dụng

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)

## Bắt đầu

```bash
npm install
npm run dev      # chạy dev server
npm run build    # build production vào thư mục dist/
```

## Cấu trúc dự án

```
src/
  types/        
  constants/    # Hằng số kích thước lưới
  utils/        # Xử lý ngày giờ, helper lưu trữ localStorage
  context/      # EventsContext (CRUD sự kiện + lưu trữ)
  hooks/        # useEvents, useDragCreate
  components/
    calendar/   # CalendarView, CalendarHeader, TimeGutter, DayColumn,
                # EventBlock, MultiDayEventBar, CurrentTimeIndicator
    dialog/     # Modal, EventFormDialog, EventDetailDialog
    menu/       # contextMenu
```
