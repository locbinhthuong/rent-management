---
name: QuanLy_chothue
description: Hệ thống quản lý thuê trọ cao cấp
colors:
  primary: "oklch(0.5 0.2 260)"
  neutral-bg: "oklch(0.145 0 0)"
  neutral-surface: "oklch(0.205 0 0)"
  neutral-border: "oklch(1 0 0 / 0.1)"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 600
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "oklch(1 0 0)"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: QuanLy_chothue

## 1. Overview

**Creative North Star: "The Financial Command Center"**

Sự kết hợp giữa tốc độ, độ chính xác của Linear và sự tin cậy tài chính của Stripe. Hệ thống sử dụng nền tối (dark mode) làm chủ đạo để giảm mỏi mắt khi xem dữ liệu liên tục, điểm xuyết bằng màu xanh tím (blurple) đặc trưng của ngành tài chính để tạo điểm nhấn cho các hành động quan trọng (như thanh toán, lưu hợp đồng). Thiết kế kiên quyết loại bỏ các thành phần rườm rà.

**Key Characteristics:**
- Tối giản, tập trung vào dữ liệu (Data-centric).
- Không gian giao diện tĩnh lặng, đẳng cấp (Quiet competence).
- Các viền và góc bo rất tinh tế, nhỏ gọn (Precision).

## 2. Colors

Bảng màu tối giản, mượn sự tĩnh lặng của không gian làm việc chuyên nghiệp.

### Primary
- **Stripe Blurple** (oklch(0.5 0.2 260)): Dùng cho các nút hành động chính (Primary CTA), biểu đồ tài chính, và các trạng thái "Thành công".

### Neutral
- **Linear Deep Background** (oklch(0.145 0 0)): Nền chính của toàn bộ ứng dụng, tạo cảm giác có chiều sâu.
- **Surface Elevation** (oklch(0.205 0 0)): Nền của các thẻ (Card), bảng dữ liệu (Table), giúp tách biệt nội dung khỏi nền chính.
- **Crisp Text** (oklch(0.985 0 0)): Màu chữ chính, trắng tinh khiết để đảm bảo độ tương phản cao trên nền tối.

**The Focus Rule.** Màu Primary chỉ chiếm tối đa 10% diện tích màn hình. Nó chỉ xuất hiện ở những nơi thật sự quan trọng để thu hút sự chú ý vào hành động cốt lõi.

## 3. Typography

**Display Font:** Inter (with sans-serif fallback)
**Body Font:** Inter (with sans-serif fallback)
**Label/Mono Font:** Geist Mono (with monospace fallback)

**Character:** Kỹ thuật, sắc bén và tối ưu hóa cho việc đọc lướt số liệu.

### Hierarchy
- **Display** (600, clamp(2rem, 5vw, 3.5rem), 1.1): Tiêu đề trang chính (Dashboard).
- **Headline** (600, 1.5rem, 1.2): Tiêu đề các phần tử lớn (e.g. Bảng doanh thu).
- **Title** (500, 1.125rem, 1.4): Tiêu đề thẻ (Card).
- **Body** (400, 0.875rem, 1.5): Nội dung bảng dữ liệu. Giới hạn 65-75 ký tự một dòng.
- **Label** (500, 0.75rem, 0.05em, uppercase): Tiêu đề cột bảng, thẻ tag (Badge).

**The Number Rule.** Các con số tài chính phải sử dụng tabular figures (font-variant-numeric: tabular-nums) để các cột số căn lấp thẳng hàng nhau hoàn hảo.

## 4. Elevation

Hệ thống hầu như không sử dụng bóng đổ (shadow) để tạo chiều sâu. Thay vào đó, chúng ta sử dụng Layering (chia lớp bằng màu sắc) và các đường viền siêu mảnh (1px) có độ trong suốt thấp.

**The Flat-By-Default Rule.** Bề mặt luôn phẳng ở trạng thái nghỉ. Bóng đổ chỉ xuất hiện dưới dạng một vùng sáng nhẹ (glow) quanh các nút bấm chính khi hover, hoặc dưới các dropdown menu.

## 5. Components

### Buttons
- **Shape:** Bo góc nhẹ nhàng (8px).
- **Primary:** Nền Blurple, chữ Trắng, padding chuẩn xác (8px 16px).
- **Hover / Focus:** Màu nền sáng lên một chút, kèm hiệu ứng glow nhẹ.
- **Secondary / Ghost:** Trong suốt hoặc màu nền surface, viền 1px mờ.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Surface Elevation color.
- **Shadow Strategy:** Không có bóng đổ.
- **Border:** Viền 1px siêu mờ.
- **Internal Padding:** Rộng rãi (24px) để nội dung "thở".

### Inputs / Fields
- **Style:** Viền mờ, nền hơi tối hơn Surface một chút.
- **Focus:** Viền sáng lên màu Primary Blurple (không dùng shadow dày).

## 6. Do's and Don'ts

### Do:
- **Do** sử dụng viền mỏng (1px) và màu nền để phân tách các khu vực nội dung.
- **Do** căn phải các con số tiền bạc và sử dụng font tabular.
- **Do** dùng màu sắc để biểu thị trạng thái (Xanh lá = Đã thanh toán, Đỏ = Nợ).

### Don't:
- **Don't** dùng thiết kế quá sặc sỡ, trẻ con hoặc lạm dụng quá nhiều khoảng trắng làm loãng thông tin.
- **Don't** tạo các khối viền (border) dày đặc, cồng kềnh.
- **Don't** dùng phong cách bóng đổ (shadow) quá lố hoặc glassmorphism vô nghĩa.
