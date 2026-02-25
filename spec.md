ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH
TRƯỜNG ĐẠI HỌC BÁCH KHOA
KHOA KHOA HỌC VÀ KỸ THUẬT MÁY TÍNH
Đồ án chuyên ngành
“Hệ thống quản lý khách sạn toàn diện”
HỘI ĐỒNG: 7L ĐỒ ÁN CHUYÊN NGÀNH
GVHD: ThS. MAI ĐỨC TRUNG
—o0o—
SVTH 1: NGUYỄN NGÔ VỮ NHÂN (1952889)
SVTH 2: QUÁCH NGUYỄN HOÀNG (1952705)
Thành phố Hồ Chí Minh, 12/
Khoa khoa học và kỹ thuật máy tính
Thành viên và đóng góp
Số thứ tự Họ và tên Khối lượng công việc
1 Quách Nguyễn Hoàng
Các hệ thống tư tượng
Use-case diagram
Đặc tả chi tiết use case
EERD
Phân tích thiết kế
Wireframe
Triển khai hệ thống
Nhu cầu người dùng
Yêu cầu chức năng
Tổng kết và kế hoạch phát triển
2 Nguyễn Ngô Vũ Nhân
Tổng quan
Công nghệ sử dụng
Yêu cầu phi chức năng
Phân tích thiết kế
Class diagram
Sequence diagram
Activity diagram
Trong dự án chuyên môn này, mỗi thành viên sẽ chịu trách nhiệm một phần công việc. Tuy
nhiên, sau khi mỗi phần được hoàn thành, thành viên khác sẽ xem xét và đưa ra ý kiến để điều
chỉnh sao cho phù hợp nhất.

Mục lục
Khoa khoa học và kỹ thuật máy tính

Khoa khoa học và kỹ thuật máy tính

1 Tổng quan
1.1 Giới thiệu đề tài
1.2 Mục tiêu đề tài
1.2.1 Mục tiêu chức năng
1.2.2 Mục tiêu định lượng/KPI phi chức năng
1.3 Phạm vi đề tài
1.3.1 Phạm vi nghiệp vụ
1.3.2 Phạm vi người dùng & tích hợp
1.3.3 Phạm vi kỹ thuật
2 Các hệ thống tương tự
- 2.0.1 Hệ thống quản lý khách sạn Gohost
- 2.0.2 Hệ thống quản lý khách sạn KiotViet
- 2.0.3 Hệ thống quản lý khách sạn EZCloud
3 Công nghệ sử dụng
3.1 Base
3.1.1 Turborepo
3.1.2 TypeScript
3.1.3 ESLint
3.1.4 Prettier
3.2 Frontend
3.2.1 NextJs
3.2.2 Vite
3.2.3 ReactJs
3.2.4 AntD
3.2.5 ShadcnUI
3.2.6 Axios
3.2.7 Zustand
3.3 Backend
3.3.1 RESTful API
3.3.2 NestJs
3.4 Database
3.4.1 PostgreSQL
3.4.2 In-Memory Cache
3.5 Management
3.5.1 Github
3.5.2 Github Project
3.6 Deployment
3.6.1 GitHub Workflow
3.6.2 Docker
3.6.3 Linux
4 Phân tích thiết kế
4.1 Nhu cầu người dùng hệ thống
4.1.1 Actor (Tác nhân hệ thống)
4.1.2 Nhu cầu của Quản trị viên (Hotel Manager)
4.1.3 Nhu cầu của Chủ khách sạn (Hotel Owner)
4.1.4 Nhu cầu của Lễ tân (Front Desk Staff)
4.1.5 Nhu cầu của Buồng phòng (Housekeeping Staff)
4.1.6 Nhu cầu của Giặt ủi (Laundry Staff)
4.1.7 Nhu cầu của Kỹ thuật (Maintenance Staff)
4.1.8 Nhu cầu của Quản kho (Warehouse Staff)
4.2 Yêu cầu chức năng
4.2.1 Chức năng của quản lý
4.2.1.a Quản lý Thiết bị & Cơ sở vật chất
4.2.1.b Quản lý Khách hàng
4.2.1.c Quản lý Phòng
4.2.1.d Quản lý Sự cố Khoa khoa học và kỹ thuật máy tính
4.2.1.e Quản lý Thuê xe
4.2.1.f Quản lý Dịch vụ
4.2.1.g Quản lý Giặt ủi
4.2.1.h Quản lý Thu chi
4.2.1.i Quản lý Kho hàng
4.2.1.j Quản lý Booking
4.2.2 Chức năng cho lễ tân
4.2.2.a Quản lý Khách hàng
4.2.2.b Quản lý Thuê xe
4.2.2.c Quản lý Dịch vụ
4.2.2.d Quản lý Giặt ủi
4.2.2.e Quản lý Trạng thái phòng
4.2.2.f Quản lý Thu chi
4.2.2.g Quản lý Kho hàng
4.2.2.h Quản lý Booking (Chức năng chính)
4.2.3 Chức năng cho kỹ thuật
4.2.3.a Quản lý Thiết bị & Cơ sở vật chất
4.2.3.b Quản lý Sự cố
4.2.3.c Quản lý Kho hàng
4.2.4 Chức năng cho Buồng phòng
4.2.4.a Quản lý Sự cố
4.2.4.b Quản lý Trạng thái phòng (Chức năng chính)
4.2.4.c Quản lý Kho hàng
4.2.5 Chức năng cho Giặt ủi
4.2.5.a Quản lý Giặt ủi (Chức năng chính)
4.2.6 Chức năng cho Quản kho
4.2.6.a Quản lý Kho hàng (Chức năng chính)
4.2.7 Chức năng cho Chủ khách sạn
4.2.7.a Quản lý Khách hàng
4.2.7.b Quản lý Thu chi (Chức năng chính)
4.3 Yêu cầu phi chức năng
4.3.1 Yêu cầu về hiệu năng (Performance)
4.3.2 Thời gian phản hồi
4.3.3 Khả năng đồng thời
4.3.4 Băng thông và dung lượng
4.3.5 Yều cầu về khả năng (Scalability)
4.3.6 Yêu cầu về độ tin cậy(Reliability)
4.3.7 Yêu cầu về khả năng sử dụng (Usability)
4.3.8 Yêu cầu về bảo mật (Security)
4.3.9 Yêu cầu về khả năng bảo trì (Maintainability)
4.3.10 Yêu cầu về khả năng tương thích (Compatibility)
4.3.11 Yêu cầu về khả năng phục hồi (Recoverability)
4.3.12 Yêu cầu về tài liệu (Documentation)
4.4 Use Case toàn hệ thống
4.5 Đặc tả use case
4.5.1 Use case theo module
4.5.1.a Module 1: Quản lý thiết bị/cơ sở vật chất
4.5.1.b Module 2: Quản lý khách hàng
4.5.1.c Module 3: Quản lý phòng
4.5.1.d Module 4: Quản lý sự cố
4.5.1.e Module 5: Quản lý thuê xe
4.5.1.f Module 6: Quản lý dịch vụ
4.5.1.g Module 7: Quản lý giặt ủi
4.5.1.h Module 8: Quản lý trạng thái phòng
4.5.1.i Module 9: Quản lý thu chi
4.5.1.j Module 10: Quản lý kho hàng
4.5.1.k Module 11: Quản lý booking
4.6 Activity diagram
4.7 Sequence diagram Khoa khoa học và kỹ thuật máy tính
4.7.1 Luồng đăng nhập, tạo phiên và kiểm soát truy cập (RBAC + Session)
- 4.7.1.a Đăng nhập
- 4.7.1.b Truy cập tài nguyên bảo vệ
- 4.7.1.c Đăng xuất (tuỳ chọn khi đóng trình duyệt)
4.7.2 Luồng Direct Booking tại quầy (Tạo / Sửa / Hủy booking)
- 4.7.2.a Tạo booking (Direct booking)
- 4.7.2.b Sửa booking (Direct booking)
- 4.7.2.c Hủy booking (Direct booking)
4.7.3 Luồng xác nhận booking và gửi thông báo (Email/SMS)
- 4.7.3.a Lễ tân xác nhận booking
- 4.7.3.b NotificationService gửi thông báo Email/SMS
4.7.4 Đồng bộ OTA hai chiều: Đẩy tồn phòng/giá và nhận booking qua webhook
- 4.7.4.a PUSH cập nhật availability/rates từ PMS lên OTA
- 4.7.4.b RECEIVE booking mới từ OTA (Webhook BookingCreated)
- dOrCancelled) – tuỳ chọn 4.7.4.c RECEIVE huỷ hoặc sửa booking từ OTA (Webhook BookingChange-
toán, cấp keycard 4.7.5 Luồng Check-in tại quầy (từ booking có sẵn): xác thực khách, gán phòng, thu cọc/thanh
4.7.5.a Mở màn hình Check-in và chọn booking
4.7.5.b Nhập/cập nhật thông tin khách và tạo ngữ cảnh check-in
4.7.5.c Xác thực danh tính khách
4.7.6 Gán phòng (Room assignment)
- 4.7.6.a Ghi nhận quyền lợi hội viên (nếu có)
- 4.7.6.b Thu cọc hoặc ghi nhận thanh toán
- 4.7.6.c Xác nhận Check-in, cập nhật trạng thái và cấp keycard
4.7.7 Luồng quản lý Keycard (phát hành, giữ thẻ, hoàn thẻ, báo mất và cấp thẻ thay thế)
- 4.7.7.a Mở màn hình KeyCard Management và tải ngữ cảnh
- 4.7.7.b Phát hành keycard mới (Issue new keycard)
- 4.7.7.c Ghi nhận gửi thẻ tại lễ tân (Hold card)
- 4.7.7.d Hoàn thẻ cho khách (Return held card)
- 4.7.7.e Báo mất keycard và cấp thẻ thay thế (Lost card and re-issue)
→ READY) 4.8 Luồng Housekeeping dọn phòng và cập nhật trạng thái phòng (WAIT_CLEAN → CLEANING
- 4.8.0.a Mở danh sách phòng được giao
- 4.8.0.b Bắt đầu dọn phòng và chuyển sang CLEANING
- 4.8.0.c Thực hiện checklist dọn phòng và lưu tiến độ
- 4.8.0.d Cập nhật minibar và điều chỉnh tồn kho (tuỳ chọn)
- 4.8.0.e Yêu cầu bổ sung vật tư (tuỳ chọn)
- 4.8.0.f Báo sự cố để tạo phiếu bảo trì (tuỳ chọn)
- 4.8.0.g Nộp checklist hoàn tất và chuyển phòng sang READY
4.8.1 Luồng xử lý sự cố/bảo trì (Incident): tạo phiếu, phân công, xử lý, hỗ trợ, hoàn tất và đóng
- 4.8.1.a Tạo incident (Reporter)
- 4.8.1.b Manager xem danh sách incident mở và phân công kỹ thuật viên
- 4.8.1.c Technician bắt đầu xử lý và cập nhật IN_PROGRESS
- 4.8.1.d Ghi worklog/cập nhật tiến độ (tuỳ chọn)
- 4.8.1.e Yêu cầu hỗ trợ và phê duyệt hỗ trợ (nhánh điều kiện)
- 4.8.1.f Resolve incident (Technician) và thông báo
- 4.8.1.g Đóng incident (Manager)
Warehouse Issue) 4.8.2 Luồng yêu cầu sửa chữa/thay thế thiết bị và cấp phát vật tư (Maintenance Request +
4.8.2.a Tạo yêu cầu sửa chữa/thay thế (Technician/WarehouseStaff khởi tạo)
4.8.2.b sub Manager review và ra quyết định (Reject hoặc Approve + Assign)
4.8.2.c Technician bắt đầu xử lý (Start work)
4.8.2.d Yêu cầu vật tư/phụ tùng và kho cấp phát (tuỳ chọn)
4.8.2.e Cập nhật tiến độ (Update progress / Worklog)
4.8.2.f Hoàn tất xử lý (Mark completed)
4.8.2.g Đóng request (Close request)
tránh xuất trùng 4.8.3 Luồng xuất vật tư cho sửa chữa (Issue) và hoàn trả vật tư dư (Return) – có cơ chế reserve
4.8.3.a Tạo yêu cầu xuất vật tư (Issue request) cho phiếu sửa chữa
4.8.3.b Kho picking và xác nhận vật tư đã sẵn sàng
4.8.3.c Technician nhận vật tư và xác nhận receipt
4.8.3.d Hoàn trả vật tư dư (Return unused materials) – tuỳ chọn
vào folio 4.8.4 Luồng yêu cầu dịch vụ (Service Request): tạo yêu cầu, thực hiện, hoàn tất và ghi charge
4.8.4.a Tạo service request (tiếp nhận từ khách)
4.8.4.b Bắt đầu thực hiện dịch vụ (Start work)
4.8.4.c Hoàn tất dịch vụ và ghi charge vào folio
4.8.4.d Hủy service request trước khi hoàn tất (tuỳ chọn)
4.8.5 Luồng Car Rental Order: tạo đơn, điều chỉnh và huỷ (charge vào stay folio)
- 4.8.5.a Mở màn hình và nạp ngữ cảnh lưu trú
- 4.8.5.b Tạo rental order (CREATE)
- 4.8.5.c Điều chỉnh rental order (ADJUST)
- 4.8.5.d Huỷ rental order (CANCEL)
4.8.6 Luồng giặt ủi (Laundry Order): tạo đơn, nhận đồ, xử lý, trả đồ và ghi phí vào folio
- 4.8.6.a Tạo laundry order (FrontDesk)
- 4.8.6.b Chỉnh sửa hoặc huỷ đơn trước khi nhận đồ (tuỳ chọn)
- 4.8.6.c Laundry Staff xem danh sách đơn OPEN và nhận đồ
- 4.8.6.d Xử lý giặt ủi và cập nhật tiến độ (loop)
- 4.8.6.e Trả đồ cho khách và ghi phí vào folio
đó in/gửi biên nhận 4.8.7 Luồng thu tiền tại quầy: thanh toán folio bằng tiền mặt hoặc qua cổng thanh toán, sau
4.8.7.a Mở folio và lấy số tiền cần thanh toán
4.8.7.b Tạo transaction thanh toán
4.8.7.c Nhánh A – Thanh toán bằng tiền mặt (Method=CASH)
4.8.7.d Nhánh B – Thanh toán qua cổng (Method=GATEWAY)
sang trạng thái cần dọn 4.8.8 Luồng Check-out: chốt folio, thu tiền, in hoá đơn/biên nhận, thu keycard và chuyển phòng
4.8.8.a Khởi tạo check-out và tải folio
4.8.8.b Xác nhận phát sinh và post thêm charge (minibar, dịch vụ) – tuỳ chọn
4.8.8.c Thu tiền (cash hoặc payment gateway) và xử lý thất bại
4.8.8.d Phát hành hoá đơn/biên nhận và in chứng từ (khi payment success)
4.8.8.e Thu hồi keycard, đóng folio và chuyển phòng sang trạng thái cần dọn
4.8.9 Luồng phiếu thu/chi quỹ (Cash Voucher) và khoá sổ kỳ quỹ (Period Close)
- 4.8.9.a Staff tạo phiếu thu/chi
- expense vượt ngưỡng) 4.8.9.b Owner review phiếu chi chờ duyệt và Approve/Reject (chỉ áp dụng với
- 4.8.9.c Khoá sổ kỳ quỹ (Period close: day/month/year)
4.9 Class diagram
4.10 ERD diagram
5 Triển khai hệ thống
5.1 Wireframe Design (Thiết kế khung giao diện)
5.1.1 Nguyên tắc thiết kế
5.1.2 Cấu trúc Layout chung
5.2 Thiết kế luồng người dùng (User Flow Design)
5.2.1 Luồng chính của hệ thống
5.3 Thiết kế chi tiết giao diện (Detailed Design)
5.3.1 Màn hình 1: Tổng quan (Dashboard)
5.3.2 Màn hình 2: Lịch đặt phòng (Timeline)
5.3.3 Màn hình 3: Báo cáo doanh thu
5.3.4 Màn hình 4: Quản lý kênh OTA
5.3.5 Màn hình 5: Danh sách phòng
5.3.6 Màn hình 6: Danh mục Dịch vụ lẻ
5.3.7 Màn hình 7: Danh sách Đối tác
5.3.8 Màn hình 8: Sổ cái Tài chính
5.3.9 Màn hình 9: Quản lý Sự cố
5.3.10 Màn hình 10: Quản lý Giặt ủi Khoa khoa học và kỹ thuật máy tính
5.3.11 Màn hình 11: Quản lý Thuê xe
5.3.12 Màn hình 12: Quản lý Nhân sự
5.4 Hệ thống thiết kế (Design System)
5.4.1 Color Palette
5.4.2 Typography
5.4.3 Components Library
5.4.4 Icons
5.5 Thiết kế Responsive
5.5.1 Breakpoints
5.5.2 Adaptive Layout
5.6 Kết luận
6 Tổng kết và kế hoạch phát triển
6.1 Đánh giá công việc đã thực hiện (Task Evaluation)
6.2 Kế hoạch phát triển (Future Plan)
6.3 Chiến lược Testing
1 Giao diện tổng quan của Gohost Danh sách hình vẽ
2 Giao diện quản lý KiotViet
3 Giao diện lễ tân của Kiotviet
4 Giao diện lễ tân của Ezcloud
5 Giao diện quản lý của Ezcloud
6 Use case diagram cho toàn bộ hệ thống
7 Use case diagram Module 1: Quản lý thiết bị/cơ sở vật chất
8 Use case diagram Module 2: Quản lý khách hàng
9 Use case diagram Module 3: Quản lý phòng
10 Use case diagram Module 4: Quản lý sự cố
11 Use case diagram Module 5: Quản lý thuê xe
12 Use case diagram Module 6: Quản lý dịch vụ
13 Use case diagram Module 7: Quản lý giặt ủi
14 Use case diagram Module 8: Quản lý trạng thái phòng
15 Use case diagram Module 9: Quản lý thu chi
16 Use case diagram Module 11: Quản lý booking
17 Đồng bộ OTA: Phòng trống & Giá + Nhận booking từ OTA (OTA Systems <-> hệ thống)
18 Quản lý Booking: Tạo/Sửa/Hủy/Xác nhận (walk-in/đặt trước)
19 Check-in: Xác minh khách + đặt cọc + ghi nhận minibar ban đầu + phát thẻ khóa (lễ tân)
20 Quản lý thẻ khóa: Phát hành / Gửi-trả / Mất thẻ & vô hiệu hóa / Cấp lại (lễ tân)
hiện) 21 Ghi nhận dịch vụ phát sinh trong lưu trú (thêm dịch vụ vào hóa đơn, theo dõi trạng thái thực
22 Check-out & Thanh toán & Xuất hóa đơn (đa phương thức + payment gateway nếu có)
23 Bàn giao ca lễ tân & đối chiếu tiền mặt cuối ca
24 Buồng phòng: Dọn phòng theo checklist + cập nhật trạng thái phòng + cập nhật minibar
25 Giặt ủi: Tiếp nhận → Xử lý → Cập nhật trạng thái → Thông báo trả khách
phòng/lễ tân/QL/kỹ thuật) 26 Sự cố/Bảo trì: Báo cáo sự cố → Phân công → Xử lý → Báo cáo hoàn thành/đóng sự cố (buồng
27 Kho vật tư: Nhập kho Xuất kho/cấp phát Xác nhận tiếp quản Cảnh báo sắp hết
28 Thu chi & Khóa sổ quỹ (cuối ngày/tháng/năm)
tiến độ 29 Quản lý thiết bị & CSVC: Tạo yêu cầu thay thế/sửa chữa → xét duyệt → phân công → theo dõi
30 Đăng nhập + phân quyền (RBAC) + session timeout (áp dụng cho mọi vai trò)
31 Tạo/Sửa/Hủy booking (Direct booking) (lễ tân thao tác)
32 Xác nhận booking + gửi thông báo Email/SMS (booking confirmation notification)
33 Đồng bộ OTA 2 chiều: cập nhật phòng trống/giá + nhận booking từ OTA
34 Check-in: xác minh khách, ghi nhận đặt cọc/thu tiền, ghi nhận minibar ban đầu, gán phòng
35 Quản lý thẻ khóa: phát hành / gửi-trả / mất thẻ → vô hiệu hóa & phát hành lại (luồng lễ tân)
sàng + checklist + minibar 36 Cập nhật trạng thái phòng & minibar (Housekeeping workflow): Chờ dọn → Đang dọn → Sẵn
37 Xử lý sự cố/bảo trì (Incident): tạo phiếu, phân công, xử lý, hỗ trợ, hoàn tất và đóng
38 Yêu cầu thay thế/sửa chữa thiết bị (kỹ thuật tạo yêu cầu) → quản lý xét duyệt → triển khai
tồn 39 Xuất/nhận vật tư liên quan sửa chữa: kỹ thuật nhận vật tư từ kho + kho xác nhận + cập nhật
vào hóa đơn 40 Tạo yêu cầu dịch vụ (dịch vụ bổ sung): tạo yêu cầu → cập nhật trạng thái thực hiện → ghi nhận
41 Luồng Car Rental Order: tạo đơn, điều chỉnh và huỷ
thông báo trả khách → ghi nhận phí 42 Giặt ủi end-to-end: lễ tân tạo đơn → giặt ủi tiếp nhận & ký nhận → cập nhật trạng thái →
kết quả → phát hành hóa đơn/biên lai 43 Thanh toán đa phương thức / cổng thanh toán: tạo giao dịch → gọi payment gateway → nhận
hóa đơn → đổi trạng thái phòng 44 Check-out & quyết toán: tổng hợp phòng + dịch vụ + minibar + giặt ủi → thanh toán → in/xuất
duyệt → khóa sổ theo kỳ 45 Thu-chi & sổ quỹ (bao gồm khóa sổ): ghi nhận phiếu chi/thu → (nếu vượt ngưỡng) chủ KS phê
46 Class diagram: IAM + Security + Audit log
47 Class diagram: Customer + Guest + Lịch sử lưu trú/VIP
48 Class diagram: Room + RoomType + Giá linh hoạt (rate) + Trạng thái phòng realtime Khoa khoa học và kỹ thuật máy tính
49 Class diagram: Booking + Stay + KeyCard + Check-in/out (luồng lễ tân)
50 Class diagram: Housekeeping + Checklist + Minibar + Báo sự cố (buồng phòng)
51 Class diagram: Service Catalog + Service Request + Laundry + Car Rental
52 Class diagram: Billing + Payment + Cashbook + Expense Voucher (thu chi)
53 Class diagram: Inventory/Warehouse (nhập, xuất, tồn, cảnh báo sắp hết)
54 Class diagram: Asset/Maintenance + Incident (sự cố, phân công, tiến độ)
55 Class diagram: Integration (OTA, Payment Gateway, Email/SMS)
56 Enter Caption
57 Relational Mapping of EERD
58 Màn hình tổng quan hệ thống HOTELPRO
59 Màn hình lịch đặt phòng hệ thống HOTELPRO
60 Màn hình báo cáo doanh thu hệ thống HOTELPRO
61 Màn hình quản lý OTA hệ thống HOTELPRO
62 Màn hình quản lý phòng, hạng phòng hệ thống HOTELPRO
63 Màn hình quản lý dịch vụ hệ thống HOTELPRO
64 Màn hình quản lý đối tác hệ thống HOTELPRO
65 Màn hình quản lý tài chính hệ thống HOTELPRO
66 Màn hình quản lý sự cố hệ thống HOTELPRO
67 Màn hình quản lý giặt ủi
68 Màn hình quản lý thuê xe hệ thống HOTELPRO
69 Màn hình quản lý nhân sự hệ thống HOTELPRO
Khoa khoa học và kỹ thuật máy tính
1 Tổng quan
1.1 Giới thiệu đề tài
Đề tài xây dựng Hệ thống Quản lý Khách sạn Toàn diện nhằm số hoá và tự động hoá các quy trình lõi
của khách sạn quy mô nhỏ–trung bình, phục vụ vận hành trơn tru từ đặt phòng, nhận/trả phòng, buồng phòng,
dịch vụ đến tài chính và báo cáo. Hệ thống hướng tới triển khai trên nền tảng Web để phù hợp cho nhiều loại
cấu hình máy và không tiêu tốn quá nhiều tài nguyên máy của người sử dụng, với mô hình cơ bản gồm các
phòng tiêu chuẩn với định hướng có thể dễ dàng mở rộng phạm vi và quy mô cho doanh nghiệp thông qua trình
quản lý, bảo đảm theo dõi trạng thái phòng theo thời gian thực và hỗ trợ các nghiệp vụ đặc thù.
Các tác nhân chính của hệ thống gồm Quản lý khách sạn, Nhân viên lễ tân, Nhân viên buồng phòng, Bảo
trì, Quản kho; các tác nhân phụ/ngoại vi gồm OTA (Booking.com, Agoda), cổng thanh toán (SePay, PayOS),
dịch vụ Email và Quản trị hệ thống.

1.2 Mục tiêu đề tài
1.2.1 Mục tiêu chức năng
Quản lý phòng: Quản lý thông tin phòng, trạng thái phòng thời gian thực.
Đặt phòng & Lễ tân: Tạo/ghi nhận đặt phòng, kiểm tra tồn phòng, tính giá; quy trình check-in chỉ
khi đã thanh toán 100%, check-out tính hoá đơn cuối cùng.
Thẻ khóa: Lập trình, kích hoạt, theo dõi tồn kho thẻ; tuân thủ giao thức an ninh (khách rời khách sạn
gửi lại thẻ, nhật ký ra/vào).
Dịch vụ: Minibar (theo dõi có minh chứng ảnh), giặt ủi, thuê xe (xác minh bằng lái) và các dịch vụ bổ
trợ tính phí vào hoá đơn.
Buồng phòng: Quy trình dọn phòng số hoá theo trình tự bắt buộc với bước an toàn, kiểm soát chất
lượng và minh chứng ảnh.
Tài chính: Đối soát theo ca, theo dõi thanh toán, giám sát chỉ số nước hàng ngày với cảnh báo bất
thường, theo dõi vi phạm nhân sự.
Kênh phân phối: Tích hợp OTA, đồng bộ giá–phòng–đơn đặt theo thời gian thực, phòng tránh over-
booking.
CRM & Marketing: Hồ sơ khách, chương trình khách hàng thân thiết, tự động hoá Email; thu thập
phản hồi.
Báo cáo & Phân tích: Dashboard vận hành real-time, báo cáo tài chính định kỳ, chỉ số
ADR/RevPAR/công suất phòng.
1.2.2 Mục tiêu định lượng/KPI phi chức năng
Thời gian tải trang ≤ 3 giây; phản hồi truy vấn CSDL ≤ 1 giây; độ trễ cập nhật real-time ≤ 5 giây; hỗ
trợ ≥ 50 người dùng đồng thời.
Tính sẵn sàng: uptime ≥ 99 ,5%, sao lưu tự động hàng ngày, RTO ≤ 4 giờ, chuyển đổi dự phòng trong 30
giây.
Bảo mật/tuân thủ: RBAC, 2FA cho admin, mã hoá bcrypt, nhật ký kiểm toán, hết hạn phiên sau 30
phút, tuân thủ PCI DSS cho dữ liệu thanh toán.
Khả dụng & tương thích: Giao diện trực quan hỗ trợ tiếng Việt và Tiếng Anh, tương thích Chrome/Fire-
fox/Safari/Edge.
Mở rộng: mở rộng đến ∼100 phòng/nhiều chi nhánh; lưu trữ dữ liệu 5 năm; giới hạn tốc độ API 1000 yêu
cầu/phút.
1.3 Phạm vi đề tài
1.3.1 Phạm vi nghiệp vụ
Triển khai các module: Quản lý phòng, quản lý cơ sở vật chất, quản kho hàng; Đặt phòng/Check-in/Check-
out; Thẻ khóa; Dịch vụ (minibar, giặt ủi, thuê xe); Buồng phòng; Tài chính; Quản lý kênh (OTA); CRM;
Báo cáo/Phân tích.
Áp dụng cho khách sạn quy mô nhỏ–trung bình với cấu hình và các quy tắc nghiệp vụ kèm theo (ví dụ:
check-in sau khi thanh toán đủ).
Khoa khoa học và kỹ thuật máy tính
1.3.2 Phạm vi người dùng & tích hợp
Người dùng nội bộ: Quản lý, Lễ tân, Buồng phòng, Bảo trì, Quản trị hệ thống; người dùng bên ngoài:
Khách lưu trú.
Tích hợp hệ thống: OTA (Booking.com, Agoda), cổng thanh toán (SePay, PayOS), dịch vụ Email cho xác
nhận/thông báo.
1.3.3 Phạm vi kỹ thuật
Nền tảng triển khai: Ứng dụng Web với cơ chế cập nhật thời gian thực, sao lưu tự động hàng ngày.
Yêu cầu phi chức năng đi kèm (hiệu năng, bảo mật, sẵn sàng, tương thích, mở rộng) như đã nêu trong
mục tiêu định lượng/KPI.
2 Các hệ thống tương tự
2.0.1 Hệ thống quản lý khách sạn Gohost
Hình 1: Giao diện tổng quan của Gohost
Gohost là một nền tảng quản lý khách sạn phổ biến tại Việt Nam, cung cấp các chức năng như quản lý phòng,
đặt phòng, khách hàng, hóa đơn và báo cáo doanh thu. Gohost tập trung chủ yếu vào các nghiệp vụ cốt lõi của
khách sạn như quản lý phòng, đặt phòng và lễ tân. Do đó, hệ thống còn tồn tại một số hạn chế sau:

Chưa hỗ trợ quản lý dịch vụ thuê xe cho khách lưu trú.
Chưa có chức năng quản lý giặt ủi với quy trình chi tiết (nhận – xử lý – trả đồ).
Chưa hỗ trợ đầy đủ quản lý minibar, đặc biệt là theo dõi chi tiết theo từng phòng và từng lần sử dụng.
Thiếu chức năng quản lý kho hàng chi tiết, chưa theo dõi tồn kho theo từng mặt hàng, đơn vị, hoặc
lịch sử nhập – xuất.
Những hạn chế này khiến Gohost chưa đáp ứng tốt nhu cầu quản lý tổng thể đối với các khách sạn có nhiều
dịch vụ bổ sung ngoài tiền phòng.
Khoa khoa học và kỹ thuật máy tính
2.0.2 Hệ thống quản lý khách sạn KiotViet
Hình 2: Giao diện quản lý KiotViet
Hình 3: Giao diện lễ tân của Kiotviet
KiotViet là một hệ thống quản lý bán lẻ mạnh, tuy nhiên khi áp dụng trong môi trường khách sạn vẫn còn một
số bất cập:

Quy trình cài đặt và thiết lập ban đầu phức tạp, yêu cầu nhiều bước cấu hình, gây khó khăn cho
người dùng không có nền tảng kỹ thuật.
Hệ thống được thiết kế chủ yếu cho bán lẻ, nên chưa phù hợp hoàn toàn với nghiệp vụ khách sạn.
Khoa khoa học và kỹ thuật máy tính
Không hỗ trợ quản lý dịch vụ thuê xe ngoài, vốn là dịch vụ phổ biến tại nhiều khách sạn.
Chức năng giặt ủi chưa được thiết kế theo quy trình nghiệp vụ khách sạn.
Thiếu sự liên kết chặt chẽ với các nghiệp vụ như lễ tân, buồng phòng và quản lý phòng.
Do đó, KiotViet chỉ phù hợp cho việc quản lý bán hàng đơn lẻ, chưa đáp ứng được yêu cầu quản lý tổng thể
khách sạn.
2.0.3 Hệ thống quản lý khách sạn EZCloud
Hình 4: Giao diện lễ tân của Ezcloud
Hình 5: Giao diện quản lý của Ezcloud
Khoa khoa học và kỹ thuật máy tính
EZCloud là nền tảng quản lý khách sạn và kênh phân phối với nhiều tính năng nâng cao, tuy nhiên vẫn tồn tại
các hạn chế nhất định:

Giao diện sử dụng phức tạp, không thân thiện với người dùng mới hoặc nhân viên không rành công
nghệ.
Hệ thống tích hợp nhiều chức năng nâng cao nhưng không cần thiết đối với mô hình khách sạn
vừa và nhỏ, gây dư thừa và khó sử dụng.
Không hỗ trợ đầy đủ quản lý dịch vụ thuê xe ngoài.
Chưa có chức năng quản lý giặt ủi ngoài một cách chi tiết.
Việc đào tạo nhân viên sử dụng hệ thống tốn nhiều thời gian và chi phí.
Những yếu tố trên làm giảm tính linh hoạt và hiệu quả khi triển khai EZCloud cho các khách sạn quy mô vừa
và nhỏ.

3 Công nghệ sử dụng
3.1 Base
3.1.1 Turborepo
3.1.1.1 Giới thiệu Turborepo là hệ thống build dành cho monorepo JavaScript/TypeScript, tối ưu nhờ
pipeline tác vụ, incremental build và caching (local và remote) để “không lặp lại cùng một công việc hai lần”.
Remote Cache cho phép chia sẻ kết quả build/lint/test giữa các máy dev và CI/CD, rút ngắn thời gian thực
thi đáng kể.

3.1.1.2 Ưu điểm

Caching & Incremental build: Tự động băm (fingerprint) đầu vào/đầu ra của tác vụ, khôi phục kết
quả từ cache nếu không có thay đổi; có thể đẩy/nhận cache từ máy chủ remote dùng chung cho cả đội.
Tổ chức tác vụ theo đồ thị phụ thuộc: Chạy song song/phân tầng các tác vụ (build, lint, test) theo
quan hệ phụ thuộc giữa packages.
Tích hợp thực tế: Hướng dẫn và hạ tầng Remote Caching sẵn trong Vercel giúp áp dụng nhanh cho
team/CI.
3.1.1.3 Nhược điểm

Phụ thuộc tính deterministic: Turborepo giả định tác vụ có đầu ra quyết định từ đầu vào; nếu tác
vụ không thuần (khác đầu ra dù cùng đầu vào), cache có thể sai hoặc bỏ lỡ.
Độ phức tạp cấu hình & tích hợp: Một số bài viết thực tiễn ghi nhận việc thiết lập/đồng bộ công cụ
quanh monorepo đòi hỏi công sức; so với Nx, Turborepo có thể ít generator/tích hợp sẵn, cần cấu hình
thủ công hơn cho vài framework.
3.1.2 TypeScript
3.1.2.1 Khái niệm TypeScript (TS) là “JavaScript với cú pháp cho kiểu” — một ngôn ngữ có kiểm tra
kiểu tĩnh, xây dựng trên JavaScript và biên dịch về JavaScript thuần để chạy ở mọi môi trường hỗ trợ JS.

3.1.2.2 Lí do chọn TS (kèm số liệu)

Mức độ sử dụng rộng rãi: Khảo sát Stack Overflow 2025 cho thấy TypeScript được 43,6%người trả
lời (toàn bộ) báo cáo đã dùng nhiều trong năm qua, và 48,8%trong nhóm Professional Developers. Ngoài
ra, TS có chỉ số “Admired” 58% (muốn tiếp tục dùng).
Xu hướng tích cực trong hệ sinh thái: Báo cáo GitHub Octoverse 2024 nêu Python dẫn đầu nhưng
JavaScript, TypeScript và Java vẫn thuộc nhóm ngôn ngữ được dùng rộng nhất trên GitHub.
Năng lực dài hạn: JetBrains công bố chỉ số Language Promise Index 2024, trong đó TypeScript nằm
trong nhóm dẫn đầu về triển vọng ngôn ngữ.
Khoa khoa học và kỹ thuật máy tính
3.1.2.3 Ưu điểm

An toàn và chất lượng mã: Kiểu tĩnh giúp bắt lỗi sớm, hỗ trợ IDE tốt (tự hoàn thành, refactor an
toàn).
Tương thích dần: TS là superset của JS, cho phép nhận dần tệp .js vào dự án và biên dịch về JS để
chạy, thuận tiện chuyển đổi/migration.
3.1.2.4 Nhược điểm

Bước build bổ sung: Cần quá trình biên dịch về JavaScript nên tăng thời gian thiết lập/CI nếu không
tối ưu.
Độ phức tạp cấu hình: tsconfig và kiến thức về hệ mô-đun/định nghĩa kiểu có thể tạo rào cản ban
đầu cho nhóm mới.
3.1.3 ESLint
3.1.3.1 Giới thiệu ESLint là tiện ích linting mã nguồn JavaScript/TypeScript dạng pluggable và có cấu
hình linh hoạt, thực hiện phân tích tĩnh để phát hiện và báo cáo các mẫu mã có vấn đề nhằm giúp mã nhất
quán và giảm lỗi; công cụ do Nicholas C. Zakas khởi tạo từ năm 2013 và hiện là dự án nguồn mở được dùng
rộng rãi. Gần đây, ESLint giới thiệu hệ cấu hình Flat Config nhằm đơn giản hóa thiết lập và thống nhất cách
cấu hình trên toàn dự án.

3.1.3.2 Ưu điểm

Phân tích tĩnh & phát hiện lỗi sớm: ESLint giúp phát hiện mẫu mã có vấn đề mà không cần chạy
ứng dụng; tích hợp tốt với editor/CI.
Kiến trúc pluggable: Cho phép mở rộng/quy tắc tùy biến, hệ sinh thái plugin phong phú (ví dụ
typescript-eslint).
Cấu hình Flat Config đơn giản hơn: Hệ cấu hình “flat” mới giúp cấu hình rõ ràng, nhất quán hơn.
3.1.3.3 Nhược điểm

Cảnh báo nhiễu/false positive: Có thể phát sinh cảnh báo sai hoặc bỏ sót (false negative), gây “mệt
mỏi cảnh báo” nếu không tinh chỉnh.
Hiệu năng khi lint có kiểu: Một số luật “có kiểu” trong typescript-eslint tốn kém tài nguyên trên
codebase lớn, cần cân nhắc và cấu hình hợp lý.
Xung đột với định dạng: Quy tắc định dạng của ESLint có thể xung đột với Prettier nếu không vô
hiệu hoá qua eslint-config-prettier.
3.1.4 Prettier
3.1.4.1 Giới thiệu Prettier là bộ định dạng mã mang tính opinionated: nó phân tích mã thành AST
và “in lại” mã theo bộ quy tắc của riêng mình (có tính đến độ dài dòng), từ đó áp dụng phong cách định
dạng nhất quán và tự động cho toàn codebase. Prettier tập trung thuần túy vào định dạng, bổ trợ cho các
linters như ESLint (bắt lỗi/chất lượng mã); khi dùng chung, nên vô hiệu các quy tắc định dạng trùng lặp bằng
eslint-config-prettier. Prettier có sẵn plugin/tiện ích cho IDE phổ biến và hỗ trợ nhiều ngôn ngữ/định
dạng như JS/TS, CSS, HTML, Markdown, YAML,...

3.1.4.2 Ưu điểm

Định dạng tự động, nhất quán: Chấm dứt tranh luận về style, tiết kiệm thời gian review; “style guide”
được tự động hoá.
Tách bạch vai trò với ESLint: Dùng Prettier cho định dạng, ESLint cho chất lượng/bug—giảm xung
đột khi kết hợp đúng cách.
3.1.4.3 Nhược điểm

Ít tuỳ biến (opinionated): Chủ trương giới hạn tuỳ chọn; không hỗ trợ “tắt” từng quy tắc định
dạng—chỉ có prettier-ignore cho ngoại lệ hãn hữu.
Có thể xung đột với lint nếu cấu hình sai: Cần bổ sung eslint-config-prettier để vô hiệu các
luật định dạng trùng lặp.
Khoa khoa học và kỹ thuật máy tính
3.2 Frontend
3.2.0.1 Tổng quan các framework phổ biến Hệ sinh thái frontend hiện nay xoay quanh các “metaframe-
work” và framework chính: React (thư viện UI thành phần), Next.js (framework full-stack trên React, hỗ trợ
SSR/SSG/ISR, App Router, RSC), Angular (framework đầy đủ của Google cho SPA quy mô lớn), Vue/Nuxt
(Vue là framework tiến hoá, Nuxt là metaframework full-stack cho Vue), và Svelte/SvelteKit (framework và
metaframework thiên về hiệu năng, render trước khi chạy). Các mô tả chính thức lần lượt nêu: React là thư viện
UI thành phần; Next.js cung cấp App Router, Server Components và nhiều tối ưu hoá; Angular là nền tảng xây
dựng ứng dụng quy mô; Vue có mô hình thành phần trên HTML/CSS/JS chuẩn; SvelteKit là “metaframework”
để phát triển ứng dụng sản xuất với Svelte.

3.2.0.2 Vì sao tách 2 hướng: Next.js cho giới thiệu/đặt phòng, Vite+React cho ERP Trang giới
thiệu hệ thống & đặt phòng online cần SEO, chia sẻ mạng xã hội đẹp, ảnh tối ưu và tốc độ tải lần đầu cao.
Next.js có hybrid rendering (SSR/SSG/ISR) để vừa index tốt vừa cập nhật nội dung động, kèm Metadata
API cho SEO và  tối ưu ảnh (lazy, size/format phù hợp). Đây là lợi thế trực tiếp cho landing/booking.

Ứng dụng ERP quản lý nội bộ ưu tiên hiệu suất phát triển, HMR siêu nhanh, cấu hình linh hoạt và đơn
giản hoá build. Vite dùng ESM và esbuild để “pre-bundle” phụ thuộc cho instant server start và HMR nhanh,
trong khi build production dựa trên Rollup—phù hợp SPA nội bộ nơi SEO không phải yêu cầu chính.

3.2.1 NextJs
3.2.1.1 Giới thiệu & đánh giá từ Internet Next.js là metaframework trên React với App Router (dựa
trên RSC, Suspense), hỗ trợ hai router song song, và nhiều tối ưu hoá như Image, Font, Metadata. Hệ thống
render linh hoạt gồm SSR, SSG và ISR để cân bằng hiệu năng–tươi mới nội dung.

3.2.1.2 Ưu điểm

SEO & chia sẻ tốt: Metadata API sinh thẻ (title, canonical, OG) động; next/image tối ưu kích
thước/định dạng và lazy-load, cải thiện LCP.
Hybrid rendering: Chọn SSR/SSG/ISR theo từng trang cho landing/booking có nội dung thay đổi theo
thời gian.
App Router & RSC: Tận dụng Server Components/streaming để giảm JS phía client, tối ưu tương tác.
3.2.1.3 Nhược điểm

Độ phức tạp & đường cong học tập: App Router/RSC đưa vào mô hình tinh thần mới, dễ gây bỡ
ngỡ khi chuyển từ React thuần.
Hiệu năng/phức tạp vận hành nếu dùng sai: SSR/streaming có thể tăng TTFB và chi phí nếu
không tối ưu; cộng đồng cũng phản ánh những trade-off của App Router.
3.2.2 Vite
3.2.2.1 Giới thiệu Vite là công cụ build thế hệ mới: dev server phục vụ code qua native ESM, HMR rất
nhanh; production build dùng Rollup đã tinh chỉnh.

3.2.2.2 Ưu điểm

Khởi động tức thì & HMR ổn định: Pre-bundling phụ thuộc bằng esbuild giúp cold start nhanh và
HMR chỉ thay phần bị ảnh hưởng.
DX tốt, cấu hình tối giản: Đa tính năng sẵn (TS/JSX/CSS), plugin hệ sinh thái phong phú.
3.2.2.3 Nhược điểm

Phụ thuộc plugin: Chất lượng plugin cộng đồng có thể ảnh hưởng hiệu năng/dev-exp; cần soát cấu
hình.
Một số ca HMR hiếm gặp: Dự án phức tạp hoặc cách tổ chức module có thể gây reload toàn trang—cần
tuân thủ hướng dẫn.
3.2.3 ReactJs
3.2.3.1 Giới thiệu & đánh giá từ Internet React là thư viện xây UI thành phần, khai báo, có mô hình
state/props linh hoạt. Phiên bản React 19 (12/2024) bổ sung nhiều cải tiến (ví dụ Actions, form enhancements)
và lộ trình nâng cấp rõ ràng—phù hợp làm nền cho cả Next.js lẫn SPA với Vite.

Khoa khoa học và kỹ thuật máy tính
3.2.3.2 Ưu điểm

Hệ sinh thái rộng: Công cụ, thư viện và tài liệu chính thức hiện đại, giúp tốc độ phát triển nhanh.
Tính mô-đun cao: Có thể chọn Next.js cho SEO/SSR hoặc Vite cho SPA nội bộ.
3.2.3.3 Nhược điểm

Phân mảnh lựa chọn: Nhiều cách tiếp cận (RSC, router, state management) khiến quyết định kiến trúc
ban đầu cần chín chắn. (Phân tích cộng đồng).
3.2.4 AntD
3.2.4.1 Giới thiệu & lý do chọn cho hệ thống quản lý (ERP) Ant Design (antd) là design system
cho sản phẩm doanh nghiệp với thư viện React thành phần chất lượng cao; hệ sinh thái ProComponents
(ProTable, ProLayout,... ) cung cấp các pattern CRUD, bảng dữ liệu, layout quản trị—rất phù hợp giao diện
ERP nhiều form/bảng.

3.2.4.2 Ưu điểm

Bộ thành phần phong phú, hướng enterprise: 60+ thành phần cơ bản và ProComponents mức trừu
tượng cao, rút ngắn thời gian dựng dashboard/quy trình.
Tài nguyên thiết kế & công cụ đồng bộ: Hệ guideline/spec cho sản phẩm doanh nghiệp.
3.2.4.3 Nhược điểm

Kích thước bundle: Nếu nhập không chọn lọc/không tree-shake, kích thước có thể lớn—cần tối ưu
import và cấu hình.
Độ phức tạp: Thư viện lớn nên có học tập ban đầu cho team. (Tổng hợp đánh giá).
3.2.5 ShadcnUI
3.2.5.1 Giới thiệu & lý do chọn cho eCommerce shadcn/ui không phải “package” cài sẵn mà là bộ
mã nguồn thành phần bạn copy vào dự án, xây dựng thư viện UI của riêng mình trên nền Radix Primitives
(accessibility-first) và Tailwind. Cách tiếp cận “own the code” cho phép tuỳ biến 100% để bám thương hiệu—phù
hợp trải nghiệm eCommerce/marketing giàu cá tính. Gần đây đã cập nhật hỗ trợ Tailwind v4 và React 19.

3.2.5.2 Ưu điểm

Tuỳ biến tuyệt đối & kiểm soát thương hiệu: Vì sở hữu mã nguồn, style/UX có thể điều chỉnh sâu.
Cơ sở accessibility tốt: Kế thừa thực hành a11y của Radix (keyboard nav, focus management, WAI-
ARIA).
3.2.5.3 Nhược điểm

Tự bảo trì: Sao chép mã nghĩa là bạn chịu trách nhiệm cập nhật theo upstream (Radix/Tailwind). (Cộng
đồng/ghi chú chính thức).
3.2.6 Axios
3.2.6.1 Giới thiệu Axios là thư viện HTTP promise-based hoạt động trên trình duyệt và Node.js, có
interceptors, hủy yêu cầu, transform dữ liệu và cấu hình mặc định tiện dụng.

3.2.6.2 Ưu điểm

Interceptors & tiện ích thực dụng: Dễ thêm token, chuẩn hoá lỗi/response, theo dõi tiến trình tải.
Đa môi trường: Dùng được cả trình duyệt lẫn Node dễ tích hợp BFF/SSR.
3.2.6.3 Nhược điểm

Phụ thuộc ngoài: Trình duyệt hiện đã có Fetch API (native, streaming) nên nhiều ca đơn giản không
cần thêm thư viện.
Khoa khoa học và kỹ thuật máy tính
3.2.7 Zustand
3.2.7.1 Giới thiệu & đánh giá từ Internet Zustand là thư viện quản lý state nhỏ, nhanh, có API “thoải
mái” dựa trên hooks—không rườm rà và không áp đặt kiến trúc, phù hợp SPA/ERP quy mô nhỏ-trung bình
và có thể mở rộng bằng slices/middleware.

3.2.7.2 Ưu điểm

Thiết lập tối giản, hiệu năng tốt: Ít boilerplate, cập nhật theo selector nên tối ưu re-render. (Tổng
hợp bài so sánh).
Linh hoạt: Dễ tích hợp Next.js/Vite hoặc React Native.
3.2.7.3 Nhược điểm

Thiếu “ý thức khuôn phép” mặc định: Ít quy ước/devtools hơn so với Redux Toolkit; với domain
phức tạp có thể cần quy ước nội bộ. (Tổng hợp so sánh cộng đồng).
3.3 Backend
3.3.1 RESTful API
3.3.1.1 Giới thiệu REST (Representational State Transfer) là một kiến trúc kiểu cho hệ thống siêu
văn bản phân tán, mô hình hoá tài nguyên (resource) và thao tác qua ngữ nghĩa HTTP (GET/POST/PUT/-
PATCH/DELETE), nhấn mạnh các ràng buộc như stateless, cacheable, uniform interface, layered system và
(đúng nghĩa) hypermedia/HATEOAS. Khái niệm được Roy T. Fielding giới thiệu trong luận án năm 2000 và
làm nền cho thiết kế Web hiện đại.

3.3.1.2 Lịch sử tóm tắt REST được hình thành khi chuẩn hoá HTTP/1.1 và phân tích các style kiến trúc
mạng; năm 2008, Fielding nhấn mạnh lại rằng REST phải được dẫn dắt bởi hypertext (HATEOAS), nếu không
thì không thể gọi là “RESTful API”.

3.3.1.3 Đánh giá từ Internet Các nhà cung cấp lớn ban hành hướng dẫn thực hành tốt cho REST (ví
dụ Microsoft REST API Guidelines; Azure Architecture Center), và các tài nguyên như MDN làm rõ cơ chế
HTTP/caching giúp REST tận dụng hạ tầng web (CDN/proxy) hiệu quả. Đồng thời, nhiều API “REST” ngoài
đời thực bỏ qua HATEOAS, dẫn đến cách hiểu giản lược “JSON-over-HTTP”.

3.3.1.4 Tại sao chọn (cho hệ thống này)

Phù hợp hệ sinh thái (đặt phòng/ERP): dễ tích hợp với đối tác/OTA, cổng thanh toán, dịch vụ bên
thứ ba vốn đa số cung cấp REST. (Tham chiếu hướng dẫn REST phổ biến trong ngành).
Độ quen thuộc cao với cộng đồng: REST/HTTP nằm trong nhóm công nghệ web được sử dụng rộng
rãi theo khảo sát Stack Overflow 2025 (mục Web frameworks/technologies).
Tận dụng hạ tầng web: cache HTTP, CDN, header chuẩn, logging/observability sẵn có.
3.3.1.5 Ưu điểm

Stateless & dễ mở rộng ngang: mỗi request tự chứa ngữ cảnh ⇒ scale theo chiều ngang đơn giản.
Cacheable & hiệu năng: tận dụng cache ở client/proxy/CDN qua header chuẩn (Cache-Control,
ETag... ).
Uniform interface: chuẩn hoá thao tác tài nguyên bằng phương thức/semantics HTTP.
Hệ sinh thái guideline/phương pháp: Microsoft REST API Guidelines, Azure best practices, Google
AIP (resource-oriented).
3.3.1.6 Nhược điểm

Overfetching/Underfetching: endpoint cố định có thể trả thừa/thiếu dữ liệu so với nhu cầu UI; một
số bài so sánh chỉ ra GraphQL khắc phục tốt điểm này.
Diễn giải sai về REST: nhiều API không áp dụng HATEOAS (Fielding nhắc lại rất rõ).
Phiên bản hoá & quy ước không đồng nhất: cần chính sách versioning/naming để tránh phân mảnh.
(Tài liệu hướng dẫn của Microsoft nêu rõ thực hành).
Không phải lúc nào cũng tối ưu: trường hợp nội bộ, hiệu năng/streaming hoặc hợp đồng chặt chẽ có
thể phù hợp RPC/gRPC hơn.
Khoa khoa học và kỹ thuật máy tính
3.3.2 NestJs
3.3.2.1 Giới thiệu NestJS là framework Node.js TypeScript-first để xây dựng ứng dụng server-side hiệu
quả và có khả năng mở rộng, kết hợp các nguyên tắc OOP/FP/FRP, kiến trúc module hoá, DI (Dependency
Injection), decorators, cùng hệ sinh thái guards, pipes, interceptors, exception filters. Hỗ trợ HTTP (Express
mặc định, Fastify tuỳ chọn), WebSocket, Microservices, GraphQL...

3.3.2.2 Khảo sát/đánh giá từ Internet

Sự hiện diện trong cộng đồng: NestJS xuất hiện trong mục “Web frameworks & technologies” của
khảo sát Stack Overflow 2025, phản ánh mức độ sử dụng và nhận biết rộng rãi.
Tài liệu chính thức phong phú & thực hành hiệu năng: Nest khuyến nghị dùng Fastify nếu ưu tiên
thông lượng (nhanh hơn Express theo benchmark được trích trong docs).
Tổng hợp hướng dẫn/bài học: nhiều nguồn học tập, handbook/tutor chia sẻ kinh nghiệm triển khai
kiến trúc Nest (module/controller/service, DI, guards/pipes/interceptors).
3.3.2.3 Ưu điểm

TypeScript-first & kiến trúc rõ ràng: module/controller/service/DI giúp tổ chức mã theo domain,
dễ kiểm thử/mở rộng.
Bộ “middleware” cấp framework: guards (uỷ quyền), pipes (validation/transform), interceptors (log-
ging/caching/mapping), filters (xử lý lỗi) — can thiệp đúng điểm vòng đời request.
Đa nền tảng giao thức: HTTP, WebSockets, Microservices; cùng một khái niệm code có thể chạy qua
nhiều “transport”.
Hiệu năng linh hoạt: có thể chọn adapter Fastify để tăng thông lượng so với Express theo khuyến nghị
chính thức.
3.3.2.4 Nhược điểm

Độ dốc học tập: nhiều khái niệm (modules, providers, guards, pipes, interceptors, metadata/decorators)
có thể gây quá tải ban đầu cho team mới.
Overhead so với khung tối thiểu: lớp trừu tượng/reflect-metadata có thể thêm chi phí so với vi mô
(Express/Fastify thuần); cần cấu hình phù hợp (ví dụ dùng Fastify adapter) nếu mục tiêu là RPS tối đa.
3.4 Database
3.4.0.1 Hệ cơ sở dữ liệu quan hệ SQL Đối với hệ thống đặt phòng/ERP cần tính đúng–đủ giao dịch
(ví dụ: giữ chỗ, trừ tồn phòng, hạch toán hoá đơn), mô hình quan hệ + ACID giúp đảm bảo tính toàn vẹn,
nhất quán và khôi phục lỗi ở mức giao dịch. Các hướng dẫn chính thức (Microsoft/Azure) khuyến nghị chọn
CSDL quan hệ khi dữ liệu có lược đồ rõ ràng, quan hệ chặt chẽ và cần giao dịch nhiều-bước; NoSQL thường
đánh đổi một phần tính nhất quán/khung giao dịch để tối ưu linh hoạt lược đồ và mở rộng ngang cho các mô
hình dữ liệu đặc thù. Ngoài ra, hệ sinh thái SQL trưởng thành, công cụ/nhân lực dồi dào, và có thể chứa dữ
liệu bán cấu trúc (JSON/JSONB) ngay trong PostgreSQL, nên phù hợp nền tảng hợp nhất.

Ghi chú thực tiễn: thị trường cho thấy SQL vẫn rất phổ biến—PostgreSQL đứng hạng #4 toàn ngành theo
DB-Engines (10/2025), là một lựa chọn an toàn về tính phổ biến và cộng đồng.

3.4.1 PostgreSQL
3.4.1.1 Giới thiệu (kèm lịch sử phát triển) PostgreSQL là Hệ QTCSDL mã nguồn mở hướng đối
tượng–quan hệ, tiếp nối dự án POSTGRES tại UC Berkeley do GS. Michael Stonebraker dẫn dắt (khởi triển
khai từ 1986 ); năm 1994 xuất hiện Postgres95 (bổ sung SQL); đến 1996 đổi tên thành PostgreSQL (bắt đầu
từ phiên bản 6.0). Qua hơn 35 năm, PostgreSQL phát triển nhiều tính năng trọng yếu như MVCC (đảm bảo
đọc/ghi không chặn), hệ mở rộng (extensions) như PostGIS, và hỗ trợ JSON/JSONB để lưu trữ–truy vấn
tài liệu bán cấu trúc.

3.4.1.2 Ưu điểm

Giao dịch & đồng thời: MVCC giúp “đọc không chặn ghi, ghi không chặn đọc”, các câu lệnh nhìn thấy
snapshot nhất quán; có cơ chế khoá tường minh khi cần.
Linh hoạt dữ liệu: JSON/JSONB (từ v9.4) + chỉ mục GIN/JSONPath cho phép kết hợp quan hệ và
bán cấu trúc trong một hệ CSDL.
Khoa khoa học và kỹ thuật máy tính
Hệ mở rộng mạnh: PostGIS cho không gian địa lý, cùng nhiều extension chính thức/cộng đồng.
Sao chép/nhân bản: Hỗ trợ logical replication giúp đồng bộ chọn lọc bảng/luồng thay đổi giữa các cụm.
Cộng đồng lớn, phát hành đều: dự án năng động, bản mới (v18) 25/09/2025.
3.4.1.3 Nhược điểm

Bloat & bảo trì VACUUM: Do MVCC giữ phiên bản dòng, cần (auto)VACUUM để thu hồi không gian
và tránh transaction ID wraparound; cấu hình chưa phù hợp có thể gây bloat/hiệu năng kém.
Phân mảnh/partitioning phức tạp: Số partition quá lớn có thể làm tăng thời gian lập kế hoạch truy
vấn và tiêu thụ bộ nhớ; cần thiết kế lược đồ phân vùng hợp lý.
Mở rộng ngang không “tự động”: PostgreSQL lõi không cung cấp auto-sharding—việc scale-out yêu
cầu công cụ/kiến trúc bổ trợ.
3.4.2 In-Memory Cache
3.4.2.1 Đây là gì? In-memory cache (bộ nhớ đệm trong tiến trình/host) lưu dữ liệu ngay trong RAM
của ứng dụng để truy cập siêu nhanh, thường kết hợp mẫu cache-aside: khi miss sẽ đọc nguồn (DB/API), nạp
vào cache rồi trả về; các lần sau hit tại bộ nhớ cục bộ.

3.4.2.2 Ưu điểm so với Redis/Cloud caches (phân tán)

Độ trễ thấp nhất: Không có network hop hay round-trip socket như Redis phân tán, do dữ liệu nằm
trong cùng tiến trình/máy—thích hợp dữ liệu “nóng” tần suất cao.
Đơn giản & chi phí thấp: Không cần vận hành cụm cache riêng/managed service, giảm chi phí và độ
phức tạp vận hành.
Tối ưu cho ứng dụng đơn nút/ít replica: Với hệ thống nhỏ/đơn phiên bản, cache cục bộ mang lại
lợi ích rõ rệt mà không cần đến hạ tầng phân tán.
3.4.2.3 Nhược điểm

Không chia sẻ giữa các instance: Mỗi máy có một bản cache riêng, dễ lệch dữ liệu giữa các replica;
cần đặt TTL thấp/chiến lược làm mới phù hợp.
Mất dữ liệu khi khởi động lại & giới hạn bộ nhớ: Cache gắn với vòng đời tiến trình và bị giới hạn
bởi RAM máy ứng dụng. (Tổng hợp hướng dẫn).
Không sẵn sàng cao/đa vùng như dịch vụ đám mây: Managed Redis/Azure/AWS cung cấp nhân
bản, failover, thậm chí tầng Flash-optimized; cache cục bộ không có các đặc tính này.
3.4.2.4 Gợi ý triển khai

Dùng in-memory cache cho dữ liệu nóng chỉ đọc, kích thước nhỏ, yêu cầu siêu nhanh và không cần chia sẻ
giữa nhiều instance. Khi hệ thống mở rộng theo nhiều replica/khu vực, cân nhắc Redis/Memcached làm
lớp cache phân tán hoặc kết hợp client-side caching của Redis để vừa có local hit vừa nhận invalidation
từ trung tâm.
3.5 Management
3.5.0.1 Các công cụ quản lý dự án/nguồn mã hiện nay GitHub là nền tảng lưu trữ và cộng tác mã
nguồn phổ biến, cung cấp kho mã (repository), Issues, Pull Requests, Actions cho CI/CD, và bộ tính năng an
ninh (Code Scanning/CodeQL, Dependabot). Ngoài theo dõi vấn đề, GitHub còn có Projects để lập kế hoạch
theo dạng bảng/board/roadmap gắn trực tiếp với Issues/PR.
GitLab định vị là “single DevSecOps platform”, tích hợp quản lý hạng mục (Issues, Epics, Boards) và CI/CD
ngay trong một hệ thống duy nhất.
Bitbucket (Atlassian) nổi bật nhờ tích hợp sâu với Jira/Trello và Pipelines (CI/CD) dựng ngay trong kho
mã; phù hợp đội nhóm vốn dùng hệ sinh thái Atlassian.
Azure DevOps cung cấp các mô-đun Boards (Agile/Kanban/Scrum), Repos, Pipelines, Artifacts, Test
Plans—đặc biệt mạnh khi cần gắn kết với hệ sinh thái Microsoft/Azure.

3.5.0.2 Công cụ sử dụng trong dự án Dự án ưu tiên GitHub làm trung tâm (lưu trữ mã + CI/CD +
an ninh), kết hợp GitHub Projects để theo dõi công việc: (i) CI/CD ngay trong repo bằng Actions; (ii) quét
lỗ hổng và tự động đề xuất nâng cấp phụ thuộc bằng Code Scanning/CodeQL/Dependabot; (iii) Projects gắn
trực tiếp Issues/PR, tổ chức theo table/board/roadmap—giảm phân tán công cụ và “kéo” quy trình quản lý vào
đúng nơi dev làm việc mỗi ngày.

Khoa khoa học và kỹ thuật máy tính
3.5.1 Github
3.5.1.1 Repository & tiện ích quản lý repository

Repository chứa mã, tệp và lịch sử phiên bản; hỗ trợ cộng tác công khai hoặc riêng tư.
Pull Request để đề xuất hợp nhất, review và thảo luận thay đổi trước khi nhập vào nhánh chính.
Branch Protection áp chính sách (bắt buộc kiểm thử/trạng thái, số lượt phê duyệt) nhằm bảo vệ nhánh
quan trọng.
Actions (CI/CD) tự động hoá build/test/deploy ngay trong repo; có thể giới hạn quyền chạy theo chính
sách của tổ chức.
Security & Compliance: Code Scanning/CodeQL phát hiện lỗ hổng và lỗi mã; Dependabot cảnh báo
và mở PR cập nhật phụ thuộc an toàn.
Packages (npm/Maven/Gradle/NuGet/Docker/OCI) để xuất bản và dùng gói ngay cạnh mã nguồn, tích
hợp chặt với Actions.
Quyền truy cập theo vai trò giúp phân quyền chi tiết cho repo trong tổ chức.
3.5.2 Github Project
3.5.2.1 Giới thiệu GitHub Projects cho phép lập kế hoạch và theo dõi công việc bằng custom fields
(Priority/Points/Status... ) gắn trực tiếp với Issues/PR; có nhiều view: Table (giống bảng tính), Board (Kan-
ban) và Roadmap (timeline). Có thể tạo nhiều view, tuỳ biến lọc/sort/group cho các bên liên quan.

3.5.2.2 Ưu điểm

Liền mạch với quy trình dev: dữ liệu lấy thẳng từ Issues/PR trong cùng hệ sinh thái GitHub (không
cần đồng bộ qua cầu nối).
Đa dạng chế độ hiển thị: chuyển nhanh giữa table/board/roadmap để phục vụ sprint, theo dõi tồn đọng
hay lộ trình.
3.5.2.3 Nhược điểm

Báo cáo Agile nâng cao hạn chế: so với Jira/Azure Boards, GitHub Projects thiếu các báo cáo “out-
of-the-box” như burndown/velocity; thường cần bên thứ ba (Screenful/tiện ích tuỳ biến) hoặc giải pháp
cộng đồng.
Quản trị quy trình phức tạp: đội có nhu cầu workflow nhiều bước, báo cáo tuỳ biến sâu, hay quản trị
danh mục lớn có thể thấy Jira/Azure Boards phù hợp hơn.
3.6 Deployment
3.6.1 GitHub Workflow
3.6.1.1 Giới thiệu GitHub Actions cho phép tự động hoá quy trình CI/CD bằng các workflow được định
nghĩa bằng tệp YAML nằm trong thư mục .github/workflows/ của repository. Mỗi workflow gồm một hoặc
nhiều job/step, kích hoạt bởi sự kiện (push, pull request), theo lịch cron, hoặc chạy thủ công; có thể chạy ma
trận (matrix) để kiểm thử đa môi trường. GitHub cung cấp hosted runners (Ubuntu/Windows/macOS) hoặc
bạn có thể dùng self-hosted runners. Ngoài ra, Reusable workflows, Environments (kèm protection rules/secrets)
và xác thực OIDC tới cloud (AWS/Azure) giúp triển khai an toàn, không cần lưu khoá tĩnh.

3.6.2 Docker
3.6.2.1 Giới thiệu Docker là nền tảng “build–ship–run” ứng dụng bằng container: đóng gói mã và phụ
thuộc thành image, chạy cách ly trên cùng nhân hệ điều hành, triển khai nhất quán từ máy dev tới production.
Docker cung cấp Dockerfile mô tả image, docker compose để điều phối đa container, và bộ hướng dẫn/best-
practices đi kèm.

3.6.2.2 Ưu điểm

Tính di động & nhất quán: Đóng gói phụ thuộc thành image giúp chạy giống nhau ở mọi môi trường.
Nhẹ & khởi động nhanh: Container chia sẻ kernel, nên nhẹ hơn VM và khởi động/thu hồi tài nguyên
nhanh; phù hợp microservices và CI.
Chuỗi công cụ trưởng thành: Tài liệu tham chiếu, khuyến nghị build (multi-stage, .dockerignore,
pin base image), và hướng dẫn bảo mật sẵn có.
Khoa khoa học và kỹ thuật máy tính
3.6.2.3 Nhược điểm

Cô lập kém hơn VM nếu cấu hình sai: Container là ảo hoá mức hệ điều hành; cần cấu hình năng
lực/nhân (capabilities, seccomp, user namespace... ) đúng để giảm rủi ro.
Rủi ro chuỗi cung ứng image: Image công khai có thể chứa lỗ hổng/mã độc; NIST SP 800-190 khuyến
nghị quét, ký và kiểm soát image trong suốt vòng đời.
Độ phức tạp khi mở rộng: Ở quy mô lớn thường cần điều phối (Kubernetes, secrets, network, registry),
làm tăng độ phức tạp vận hành.
3.6.3 Linux
3.6.3.1 Giới thiệu Linux là hệ điều hành kiểu Unix, khởi đầu từ nhân (kernel) do Linus Torvalds phát
triển; ngày nay là nền tảng phổ biến cho máy chủ, cloud và thiết bị nhúng. Hạt nhân Linux hướng tới tuân thủ
POSIX/Single UNIX Specification và được cộng đồng/doanh nghiệp bảo trợ thông qua Linux Foundation.

3.6.3.2 Ưu điểm

Ổn định, hiệu năng, bảo mật tốt cho server: Thường được chọn trong môi trường doanh nghiệp
nhờ chi phí sở hữu thấp, độ ổn định và bảo mật cao.
Mở & linh hoạt: Nhiều bản phân phối và mô hình tuỳ biến, phù hợp làm nền tảng chạy container/CI/CD.
(Tổng hợp từ Linux Foundation/SUSE).
3.6.3.3 Nhược điểm

Đường cong học tập: Người dùng mới có thể gặp khó khăn do cần hiểu hệ thống/CLI sâu hơn so với
hệ điều hành thương mại quen thuộc.
Tương thích phần mềm/phần cứng nhất định: Một số phần mềm thương mại hoặc phần cứng (ví
dụ GPU) yêu cầu driver/procedure riêng; đôi khi cần cài đặt/thao tác thủ công.
4 Phân tích thiết kế
4.1 Nhu cầu người dùng hệ thống
4.1.1 Actor (Tác nhân hệ thống)
Hệ thống quản lý khách sạn được thiết kế phục vụ nhiều đối tượng người dùng khác nhau, mỗi đối tượng có vai
trò và quyền hạn riêng biệt trong việc vận hành và sử dụng hệ thống. Các actor chính trong hệ thống bao gồm:
Actor chính (Primary Actors):

Chủ khách sạn(Hotel Owner): Người chủ quyết định hoạt động của khách sạn, có quyền truy cập
cao nhất vào tất cả các chức năng quản trị, báo cáo và phê duyệt.
Quản lý khách sạn (Hotel Manager): Người quản lý vận hành của khách sạn, có quyền truy cập
vào đa số các chức năng quản trị, báo cáo và phê duyệt.
Nhân viên lễ tân (Front Desk Staff): Nhân viên tuyến đầu tiếp xúc trực tiếp với khách hàng,
chịu trách nhiệm các nghiệp vụ check-in/check-out, quản lý booking, các dịch vụ đi kèm của khách
sạn, thanh toán và quản lý thẻ khóa.
Nhân viên buồng phòng (Housekeeping Staff): Nhân viên phụ trách vệ sinh, dọn dẹp phòng,
báo cáo tình trạng phòng và thiết bị.
Nhân viên giặt ủi (Laundry Staff): Nhân viên chịu trách nhiệm tiếp nhận các vật dụng, đồ của
các cần giặt ủi, báo cáo số lượng, kiểm kê vật chất hỗ trợ giặt ủi.
Nhân viên bảo dưỡng kỹ thuật (Maintenance Technician): Nhân viên phụ trách bảo dưỡng
thiết bị, cơ sở vật chất của khách sạn.
Nhân viên quản kho (Warehouse Staff): Nhân viên chịu trách nhiệm việc nhập, xuất, lưu kho,
kiểm duyệt số lượng hàng hóa, vật chất của khách sạn.
Actor phụ (Secondary Actors):
Hệ thống đại lý trực tuyến (OTA Systems): Các nền tảng đặt phòng trực tuyến như Book-
ing.com, Agoda, Expedia tích hợp với hệ thống qua API để đồng bộ phòng trống và giá cả.
Cổng thanh toán (Payment Gateway): Hệ thống thanh toán điện tử như VNPay, Momo, ngân
hàng để xử lý các giao dịch thanh toán trực tuyến.
4.2.1.d Quản lý Sự cố Khoa khoa học và kỹ thuật máy tính
Dịch vụ thông báo (Email/SMS Service): Dịch vụ gửi email và tin nhắn tự động để xác nhận
booking, nhắc nhở check-in/check-out.
4.1.2 Nhu cầu của Quản trị viên (Hotel Manager)
Quản lý khách sạn là người điều hành tổng thể hoạt động kinh doanh và vận hành khách sạn. Nhu cầu của họ
tập trung vào việc giám sát, phân tích và ra quyết định dựa trên dữ liệu.
Nhu cầu quản lý và giám sát:

Theo dõi tình hình kinh doanh tổng quan: Xem dashboard hiển thị các chỉ số quan trọng như
tỷ lệ lấp đầy phòng, doanh thu hàng ngày/tháng, số lượng booking mới, tình trạng phòng trống.
Quản lý sự cố : Theo dõi và xử lý các sự cố được nhân viên báo cáo.
Quản lý nhân sự: Theo dõi hiệu suất làm việc của nhân viên, quản lý ca làm việc, xem báo cáo
chấm công và vi phạm của nhân viên.
Báo cáo tài chính: Truy xuất báo cáo doanh thu chi tiết theo ngày/tháng/năm, phân tích nguồn
thu từ phòng và dịch vụ bổ sung, theo dõi các khoản công nợ.
Quản lý tài sản và thiết bị: Giám sát tình trạng phòng, thiết bị hư hỏng cần sửa chữa, quản lý
vật tư tiêu hao.
Quản lý phòng : Quyết định vật chất cung cấp cho phòng như số lượng nội thất, minibar, thay đổi
giá phòng, chất lượng phòng.
Quản lý dịch vụ: Quyết định các dịch vụ mà khách sạn cung cáp như thuê xe, giặt ủi, tour du lịch,
xe đưa đón.
4.1.3 Nhu cầu của Chủ khách sạn (Hotel Owner)
Nhu cầu phân tích và ra quyết định:

Phân tích xu hướng đặt phòng: Xem báo cáo thống kê về thời điểm cao điểm, loại phòng được
ưa chuộng, thời gian lưu trú trung bình.
Đánh giá hiệu quả kênh phân phối: So sánh hiệu quả giữa booking trực tiếp và qua OTA để điều
chỉnh chiến lược marketing.
Quản lý giá linh hoạt: Điều chỉnh giá phòng theo mùa, sự kiện đặc biệt, tỷ lệ lấp đầy hiện tại.
Nhu cầu kiểm soát chất lượng:
Xem lịch sử vi phạm: Theo dõi các vi phạm của nhân viên theo bảng phạt quy định, đảm bảo chất
lượng dịch vụ.
Giám sát quy trình làm việc: Kiểm tra việc tuân thủ checklist của nhân viên lễ tân và buồng
phòng.
Quản lý phản hồi khách hàng: Xem đánh giá, góp ý của khách để cải thiện dịch vụ.
4.1.4 Nhu cầu của Lễ tân (Front Desk Staff)
Nhân viên lễ tân là người trực tiếp tương tác với khách hàng và xử lý các nghiệp vụ hàng ngày tại quầy. Nhu
cầu của họ tập trung vào việc thao tác nhanh chóng, chính xác và thuận tiện.
Nhu cầu quản lý booking:

Tạo booking mới: Nhập thông tin khách hàng, chọn loại phòng, ngày check-in/check-out, tính toán
giá tự động bao gồm thuế và phí dịch vụ.
Tra cứu và chỉnh sửa booking: Tìm kiếm booking theo mã đặt phòng, tên khách, số điện thoại;
chỉnh sửa thông tin khi có thay đổi.
Quản lý trạng thái booking: Cập nhật trạng thái từ “Đã đặt” sang “Đã check-in”, “Đã check-out”,
“Đã hủy”.
Nhu cầu check-in/check-out:
Check-in nhanh chóng: Xác minh thông tin khách hàng, kiểm tra thanh toán ,đặt cọc, ghi nhận
tình trạng minibar chi tiết, lập trình và trao thẻ khóa.
Thông báo quy định: Hướng dẫn khách về quy định gửi thẻ khóa khi ra ngoài, giờ check-out, dịch
vụ ăn sáng và các tiện ích khác.
Check-out và thanh toán: Kiểm tra minibar, tính toán chi phí dịch vụ bổ sung, thu tiền, in hóa
đơn, thu hồi thẻ khóa.
Khoa khoa học và kỹ thuật máy tính
Nhu cầu quản lý thẻ khóa:
Phát hành thẻ khóa: Lập trình thẻ với mã phòng và thời hạn sử dụng.
Quản lý thẻ gửi/trả: Nhận thẻ khi khách ra ngoài, trao lại khi khách quay về, ghi nhận thời gian
vào sổ theo dõi.
Xử lý mất thẻ: Vô hiệu hóa thẻ cũ, phát hành thẻ mới, ghi nhận phí phạt theo quy định.
Nhu cầu quản lý dịch vụ:
Thêm dịch vụ bổ sung: Ghi nhận các dịch vụ như giặt ủi, thuê xe, tour du lịch, minibar vào hóa
đơn khách hàng.
Xử lý yêu cầu đặc biệt: Ghi chú các yêu cầu về phòng (tầng cao, view đẹp, phòng liền kề...).
Nhu cầu thanh toán:
Xử lý đa phương thức thanh toán: Hỗ trợ thanh toán tiền mặt, thẻ tín dụng, chuyển khoản, QR
code.
In hóa đơn và biên lai: Tự động tính toán thuế VAT, phí dịch vụ, in hóa đơn cho khách.
Quản lý tiền mặt: Đối chiếu tiền trong két với báo cáo hệ thống cuối ca.
Nhu cầu báo cáo cuối ca:
Bàn giao ca: Tổng hợp số lượng check-in, check-out, doanh thu trong ca, tình trạng phòng, các vấn
đề phát sinh.
Ghi chú đặc biệt: Báo cáo các khách VIP, khách có yêu cầu đặc biệt, thiết bị hư hỏng cần sửa chữa.
4.1.5 Nhu cầu của Buồng phòng (Housekeeping Staff)
Nhân viên buồng phòng chịu trách nhiệm đảm bảo phòng sạch sẽ, tiện nghi đầy đủ và sẵn sàng cho khách. Nhu
cầu của họ tập trung vào quy trình làm việc rõ ràng, an toàn và công cụ hỗ trợ hiệu quả.
Nhu cầu quản lý công việc:

Nhận danh sách phòng cần dọn: Xem danh sách phòng check-out cần dọn, phòng ở lâu cần vệ
sinh, phòng trống cần kiểm tra theo thứ tự ưu tiên.
Checklist vệ sinh chi tiết: Tuân thủ quy trình chuẩn từng bước.
Ghi nhận tiến độ: Cập nhật trạng thái phòng sau khi hoàn thành (Đang dọn → Sẵn sàng).
Tuân thủ quy trình an toàn: Bắt buộc tắt toàn bộ điện và đảm bảo cầu dao không mở trước khi
vào phòng để tránh tai nạn.
Kiểm tra thiết bị: Phát hiện các thiết bị hư hỏng, rò rỉ nước, điện để báo cáo kịp thời.
Nhu cầu quản lý vật tư:
Kiểm kê đồ dùng: Đếm số lượng chăn, ga, gối, khăn tắm, amenities cần bổ sung.
Báo cáo vật tư thiếu: Thông báo cho quản lý khi hết hóa chất vệ sinh, dụng cụ làm việc cần thay
thế.
4.1.6 Nhu cầu của Giặt ủi (Laundry Staff)
Nhân viên chịu trách nhiệm tiếp nhận các vật dụng, đồ của các cần giặt ủi, báo cáo số lượng, kiểm kê vật chất
hỗ trợ giặt ủi. Nhu cầu quản lý giặt ủi:

Phân loại đồ giặt: Thu gom chăn ga gối khăn cũ, phân loại theo mức độ bẩn (trắng/màu, ít/nhiều
vết bẩn).
Xử lý đồ giặt: Giặt, sấy, ủi theo quy trình, kiểm tra chất lượng trước khi bàn giao.
Báo cáo hư hỏng: Ghi nhận đồ rách, vết bẩn không tẩy được để thay thế hoặc thanh lý.
Nhu cầu báo cáo và bàn giao:
Chụp ảnh minh chứng: Chụp ảnh phòng sau khi dọn xong, gửi vào nhóm chat để quản lý kiểm tra
chất lượng.
Báo cáo vấn đề: Thông báo thiết bị hư hỏng (đèn cháy, điều hòa lỗi, vòi nước rò rỉ...), vật dụng
thiếu, cơ sở vật chất cần sửa chữa.
Bàn giao cuối ca: Tổng hợp số phòng đã dọn, vấn đề chưa giải quyết, vật tư cần bổ sung cho ca sau.
Khoa khoa học và kỹ thuật máy tính
4.1.7 Nhu cầu của Kỹ thuật (Maintenance Staff)
Bộ phận kỹ thuật chịu trách nhiệm bảo trì, sửa chữa các thiết bị và cơ sở vật chất của khách sạn. Nhu cầu của
họ tập trung vào việc nhận thông tin nhanh chóng và quản lý công việc hiệu quả.
Nhu cầu quản lý cơ sở vật chất:

Kiểm tra cơ sở vật chất : .Kiểm tra tình trạng của cơ sở vật chất, đánh giá mức độ xuống cấp
Yêu cầu thay thế sửa chữa Thông báo cho quản lý khi có trang thiết bị, cở sở vật chất cần thay
thế, sửa chữa.
Theo dõi tình trạng của các yêu cầu: Theo dõi được những yêu cầu đã được quản lý phê duyệt
để tiến hành sửa chữa/ thay thế.
4.1.8 Nhu cầu của Quản kho (Warehouse Staff)
Bộ phận chịu trách nhiệm việc nhập, xuất, lưu kho, kiểm duyệt số lượng hàng hóa, vật chất của khách sạn.
Nhu cầu quản lý nhập xuất:

Nhập hàng : Đối chiếu số lượng khi nhập kho chính xác so với nhà cung cấp
Xuất kho : Xuất hàng hóa, vật chất đến các bộ phận liên quan
Theo dõi hàng hóa đang lưu kho: Theo dõi các thay đổi nhập xuất hàng ngày/ hàng tháng/ hàng
quý/ hàng năm.
4.2 Yêu cầu chức năng
4.2.1 Chức năng của quản lý
4.2.1.a Quản lý Thiết bị & Cơ sở vật chất
Xem tình trạng thiết bị và CSVC
Xét duyệt yêu cầu thay thế/sửa chữa
Phân công kỹ thuật viên xử lý
Theo dõi tiến độ bảo trì
4.2.1.b Quản lý Khách hàng
Thêm, sửa, xóa thông tin khách hàng
Xem danh sách và chi tiết khách hàng
Tìm kiếm khách hàng theo nhiều tiêu chí
Xem lịch sử lưu trú và thống kê
4.2.1.c Quản lý Phòng
Thêm, sửa, xóa phòng
Quản lý hạng phòng (tạo, sửa, xóa, cập nhật giá)
Xem tổng quan trạng thái phòng
4.2.1.d Quản lý Sự cố

Xem danh sách sự cố
Phân công kỹ thuật viên xử lý
Theo dõi tiến độ xử lý
Xem báo cáo sự cố
4.2.1.e Quản lý Thuê xe
Xem danh sách đơn thuê xe
Hủy đơn thuê xe (theo chính sách)
Quản lý bảng giá thuê xe
Xem báo cáo doanh thu thuê xe
Khoa khoa học và kỹ thuật máy tính
4.2.1.f Quản lý Dịch vụ
Thêm, sửa, xóa danh mục dịch vụ
Cập nhật giá dịch vụ
Xem yêu cầu dịch vụ
Theo dõi trạng thái thực hiện
4.2.1.g Quản lý Giặt ủi
Quản lý bảng giá giặt ủi
Xem danh sách đơn giặt ủi
Hủy đơn khi cần
Xem báo cáo doanh thu
4.2.1.h Quản lý Thu chi
Tạo phiếu chi
Xem sổ quỹ theo thời gian
Khóa sổ quỹ cuối ngày/tháng/năm
Xem báo cáo doanh thu, chi phí, lợi nhuận
Phân tích thu chi theo nhiều tiêu chí
4.2.1.i Quản lý Kho hàng
Tạo phiếu nhập hàng
Tạo phiếu xuất hàng
Xem lịch sử nhập xuất
Kiểm tra tồn kho
4.2.1.j Quản lý Booking
Tạo booking cho khách hàng
Sửa, hủy booking
Xem danh sách booking
Xác nhận booking
Xem báo cáo booking
4.2.2 Chức năng cho lễ tân
4.2.2.a Quản lý Khách hàng
Thêm khách hàng mới khi đặt phòng/check-in
Sửa thông tin khách hàng (trong 24h)
Xem danh sách và tìm kiếm khách hàng
Xem lịch sử lưu trú của khách
4.2.2.b Quản lý Thuê xe
Tạo đơn thuê xe
Sửa đơn thuê xe (trước khi giao xe)
Xem danh sách đơn thuê xe
Tra cứu đơn theo mã/khách hàng
Khoa khoa học và kỹ thuật máy tính
4.2.2.c Quản lý Dịch vụ
Tạo yêu cầu dịch vụ cho khách
Cập nhật trạng thái dịch vụ
Xem danh sách yêu cầu dịch vụ
4.2.2.d Quản lý Giặt ủi
Tạo đơn giặt ủi
Sửa đơn giặt ủi (trước khi tiếp nhận)
Xem danh sách đơn giặt ủi
Tra cứu đơn theo khách/phòng
4.2.2.e Quản lý Trạng thái phòng
Xem trạng thái phòng real-time
Xem thông tin minibar của phòng
4.2.2.f Quản lý Thu chi
Ghi nhận khoản thu (thanh toán phòng, dịch vụ, đặt cọc)
In hóa đơn cho khách
Xuất hóa đơn
4.2.2.g Quản lý Kho hàng
Xem tồn kho vật tư
Tạo yêu cầu xuất kho (nếu cần)
4.2.2.h Quản lý Booking (Chức năng chính)
Tạo booking mới
Sửa, hủy booking
Thêm/xóa dịch vụ đi kèm
Xem và tra cứu booking
Xác nhận booking
Check-in khách hàng
Check-out khách hàng
Thanh toán hóa đơn
4.2.3 Chức năng cho kỹ thuật
4.2.3.a Quản lý Thiết bị & Cơ sở vật chất
Tạo yêu cầu thay thế/sửa chữa thiết bị
Cập nhật tình trạng thiết bị hàng ngày
Xem tình trạng thiết bị trong khách sạn
4.2.3.b Quản lý Sự cố
Xem sự cố được phân công
Cập nhật tiến độ xử lý sự cố
Báo cáo hoàn thành sự cố
Yêu cầu hỗ trợ (nếu cần)
Khoa khoa học và kỹ thuật máy tính
4.2.3.c Quản lý Kho hàng
Nhận vật tư từ kho
Xác nhận đã tiếp quản vật tư
4.2.4 Chức năng cho Buồng phòng
4.2.4.a Quản lý Sự cố
Báo cáo sự cố phát hiện trong phòng
4.2.4.b Quản lý Trạng thái phòng (Chức năng chính)
Xem danh sách phòng được phân công
Xem tình trạng phòng và minibar
Cập nhật trạng thái phòng (Chờ dọn → Đang dọn → Sẵn sàng)
Hoàn thành checklist dọn phòng
Cập nhật minibar (ghi nhận sử dụng, bổ sung)
4.2.4.c Quản lý Kho hàng
Nhận vật tư phòng từ kho
Xác nhận đã tiếp quản
4.2.5 Chức năng cho Giặt ủi
4.2.5.a Quản lý Giặt ủi (Chức năng chính)
Xem danh sách đơn giặt ủi
Tiếp nhận quần áo từ khách (kiểm tra, ký nhận)
Cập nhật trạng thái đơn (Đang giặt → Đang ủi → Hoàn thành)
Thông báo sẵn sàng trả khách
4.2.6 Chức năng cho Quản kho
4.2.6.a Quản lý Kho hàng (Chức năng chính)
Tạo phiếu nhập hàng
Tạo phiếu xuất hàng
Xác nhận nhập lưu kho (kiểm đếm thực tế, ghi vị trí)
Xem danh sách nhập xuất
Kiểm tra tồn kho
Cảnh báo hàng sắp hết
4.2.7 Chức năng cho Chủ khách sạn
4.2.7.a Quản lý Khách hàng
Xem tất cả báo cáo
Xem thống kê khách VIP, khách thường xuyên
4.2.7.b Quản lý Thu chi (Chức năng chính)
Phê duyệt phiếu chi lớn (>10 triệu)
Xem sổ quỹ
Xem báo cáo doanh thu theo thời gian
Xem báo cáo chi phí theo loại
Xem báo cáo lợi nhuận (Doanh thu - Chi phí)
Phân tích cấu trúc thu chi
Khoa khoa học và kỹ thuật máy tính
4.3 Yêu cầu phi chức năng
4.3.1 Yêu cầu về hiệu năng (Performance)
4.3.2 Thời gian phản hồi
4.3.2.1 Thời gian tải trang

Mô tả: Các trang web phải tải nhanh để không làm gián đoạn công việc
Yêu cầu:
Trang đơn giản (danh sách, form): ≤ 2 giây
Trang phức tạp (báo cáo, dashboard): ≤ 5 giây
Trang có biểu đồ/thống kê: ≤ 7 giây
Lý do: Lễ tân cần xử lý nhanh khi khách check-in/out, không thể chờ lâu
4.3.2.2 Thời gian thực hiện giao dịch

Mô tả: Các thao tác quan trọng phải nhanh
Yêu cầu:
Tìm kiếm khách hàng: ≤ 1 giây
Tạo booking: ≤ 3 giây
Check-in/Check-out: ≤ 5 giây
Thanh toán: ≤ 3 giây
Xem trạng thái phòng: ≤ 2 giây (real-time)
Lý do: Trải nghiệm người dùng, tránh hàng đợi ở quầy lễ tân
4.3.2.3 Thời gian cập nhật dữ liệu

Mô tả: Dữ liệu phải được cập nhật gần như tức thì
Yêu cầu:
Trạng thái phòng: Cập nhật ngay (< 5 giây)
Sổ quỹ: Cập nhật ngay sau giao dịch
Tồn kho: Cập nhật sau mỗi nhập/xuất (< 10 giây)
Lý do: Tránh xung đột khi nhiều người làm việc đồng thời
4.3.3 Khả năng đồng thời
4.3.3.1 Số người dùng đồng thời

Mô tả: Hệ thống phải phục vụ nhiều nhân viên cùng lúc
Yêu cầu:
Khách sạn nhỏ (≤50 phòng): 10-20 người dùng đồng thời
Khách sạn trung bình (50-100 phòng): 20-50 người dùng đồng thời
Khách sạn lớn (>100 phòng): 50-100 người dùng đồng thời
Lý do: Giờ cao điểm check-in/out có nhiều nhân viên làm việc cùng lúc
4.3.3.2 Xử lý giao dịch đồng thời

Mô tả: Xử lý đúng khi nhiều người thao tác cùng dữ liệu
Yêu cầu:
Khóa lạc quan (Optimistic Locking) cho booking, phòng
Khóa bi quan (Pessimistic Locking) cho sổ quỹ, thanh toán
Cảnh báo xung đột rõ ràng
Lý do: Tránh đặt trùng phòng, sai sót tài chính
Khoa khoa học và kỹ thuật máy tính
4.3.4 Băng thông và dung lượng
4.3.4.1 Kích thước dữ liệu truyền tải

Mô tả: Giảm thiểu dữ liệu tải về
Yêu cầu:
Trang danh sách: ≤ 500KB
Trang có hình ảnh: ≤ 2MB
API response: ≤ 200KB
Lý do: Tiết kiệm băng thông, tăng tốc độ tải trang
4.3.4.2 Dung lượng cơ sở dữ liệu

Mô tả: Ước tính dung lượng lưu trữ cần thiết
Yêu cầu ước tính (cho khách sạn 50 phòng):
Năm đầu: 5-10 GB
Tăng trưởng: ̃2-3 GB/năm
Dự phòng: Gấp 2-3 lần dung lượng thực tế
Lý do: Lập kế hoạch hạ tầng, chi phí
4.3.5 Yều cầu về khả năng (Scalability)
4.3.5.1 Mở rộng số lượng phòng

Mô tả: Hệ thống phải hoạt động tốt khi khách sạn mở rộng
Yêu cầu:
Hỗ trợ từ 10 đến 500 phòng
Không cần thay đổi kiến trúc khi tăng phòng
Hiệu năng không giảm đáng kể khi tăng 2-3 lần số phòng
Lý do: Khách sạn có thể mở rộng, mua thêm tòa nhà
4.3.5.2 Mở rộng số lượng người dùng

Mô tả: Thêm nhân viên dễ dàng
Yêu cầu:
Không giới hạn số tài khoản
Phân quyền linh hoạt, chi tiết
Dễ dàng thêm/xóa tài khoản
Lý do: Số nhân viên thay đổi theo mùa (cao điểm/thấp điểm)
4.3.5.3 Mở rộng tính năng

Mô tả: Dễ dàng thêm module/tính năng mới
Yêu cầu:
Kiến trúc module hóa
API chuẩn để tích hợp
Plugin system (nếu có thể)
Ví dụ mở rộng tương lai:
Tích hợp POS (Point of Sale) cho nhà hàng
Mobile app cho khách
Kết nối với OTA (Booking.com, Agoda)
IoT (Smart room, Smart lock)
Khoa khoa học và kỹ thuật máy tính
4.3.5.4 Mở rộng dữ liệu

Mô tả: Xử lý tốt khi dữ liệu tăng lên
Yêu cầu:
Thiết kế database có index hợp lý
Hỗ trợ phân vùng (partitioning) nếu cần
Archive dữ liệu cũ (>2 năm)
Lý do: Booking, giao dịch tích lũy theo thời gian
4.3.6 Yêu cầu về độ tin cậy(Reliability)
4.3.6.1 Uptime (Thời gian hoạt động)

Mô tả: Hệ thống phải luôn sẵn sàng
Yêu cầu:
Uptime: ≥ 99.5% (tương đương ̃3.6 giờ downtime/tháng)
Không downtime trong giờ cao điểm (7h-23h)
Bảo trì chỉ thực hiện 23h-6h sáng
Lý do: Khách sạn hoạt động 24/7, lễ tân cần hệ thống mọi lúc
4.3.6.2 Khả năng chịu lỗi

Mô tả: Hệ thống xử lý lỗi tốt, không crash
Yêu cầu:
Validation đầu vào nghiêm ngặt
Try-catch cho tất cả function quan trọng
Thông báo lỗi rõ ràng, hướng dẫn xử lý
Không hiển thị lỗi kỹ thuật cho người dùng
Lý do: Nhân viên không phải IT, cần hướng dẫn rõ ràng
4.3.6.3 Xử lý lỗi mạng/database

Mô tả: Xử lý khi mất kết nối
Yêu cầu:
Retry kết nối database (3 lần)
Timeout hợp lý (10-30 giây)
Lưu dữ liệu tạm thời khi mất kết nối (nếu có thể)
Thông báo rõ ràng cho người dùng
Lý do: Internet/mạng nội bộ có thể bị gián đoạn
4.3.6.4 Tính nhất quán dữ liệu

Mô tả: Dữ liệu luôn chính xác, đồng bộ
Yêu cầu:
ACID compliance cho giao dịch tài chính
Rollback khi giao dịch thất bại
Không mất dữ liệu khi crash
Log đầy đủ các thay đổi quan trọng
Lý do: Dữ liệu tài chính, booking phải chính xác 100%
4.3.7 Yêu cầu về khả năng sử dụng (Usability)
4.3.7.1 Giao diện thân thiện

Mô tả: Dễ sử dụng, không cần đào tạo lâu
Yêu cầu:
Menu rõ ràng, logic
Icon trực quan, có tooltip
Khoa khoa học và kỹ thuật máy tính
Form đơn giản, không quá nhiều trường
Sử dụng màu sắc nhất quán
Font chữ đủ lớn, dễ đọc
Lý do: Nhân viên có trình độ khác nhau, cần dễ học
4.3.7.2 Thời gian học sử dụng

Mô tả: Người dùng mới có thể sử dụng nhanh chóng
Yêu cầu:
Lễ tân: ≤ 3 ngày đào tạo
Buồng phòng: ≤ 1 ngày
Quản lý: ≤ 5 ngày
Hướng dẫn tích hợp trong hệ thống
Lý do: Giảm chi phí đào tạo, nhân viên mới làm quen nhanh
4.3.7.3 Thiết kế responsive

Mô tả: Hoạt động tốt trên nhiều thiết bị
Yêu cầu:
Desktop: 1366x768 trở lên (ưu tiên)
Tablet: 768x1024 (cho quản lý di động)
Mobile: 375x667 (các chức năng cơ bản)
Lý do: Quản lý cần xem báo cáo trên tablet, buồng phòng dùng tablet
4.3.7.4 Hỗ trợ tiếng Việt

Mô tả: Ngôn ngữ chính là tiếng Việt
Yêu cầu:
Toàn bộ giao diện tiếng Việt
Hỗ trợ Unicode (UTF-8)
Định dạng ngày tháng: DD/MM/YYYY
Định dạng tiền tệ: 1,000,000 VNĐ
Hỗ trợ đa ngôn ngữ (tiếng Anh) cho tương lai
Lý do: Hầu hết nhân viên Việt Nam
4.3.7.5 Phím tắt và tối ưu quy trình

Mô tả: Tăng tốc độ làm việc
Yêu cầu:
Phím tắt cho các thao tác thường xuyên
Tab order logic trong form
Enter để submit form
Tự động focus vào field quan trọng
Auto-complete cho tìm kiếm
Lý do: Lễ tân xử lý nhiều giao dịch mỗi ngày
4.3.7.6 Thông báo và feedback

Mô tả: Người dùng luôn biết hệ thống đang làm gì
Yêu cầu:
Loading indicator khi xử lý lâu
Success message sau thao tác thành công
Error message rõ ràng khi lỗi
Confirm dialog cho thao tác quan trọng
Notification badge cho thông báo mới
Lý do: Tránh nhầm lẫn, tăng độ tin cậy
Khoa khoa học và kỹ thuật máy tính
4.3.8 Yêu cầu về bảo mật (Security)
4.3.8.1 Xác thực người dùng

Mô tả: Chỉ người có quyền mới truy cập
Yêu cầu:
Đăng nhập bằng username/password
Mật khẩu tối thiểu 8 ký tự (chữ, số, ký tự đặc biệt)
Hash password (bcrypt, Argon2)
Session timeout sau 30 phút không hoạt động
Tự động logout khi đóng trình duyệt (option)
Lý do: Bảo vệ dữ liệu khách hàng, tài chính
4.3.8.2 Phân quyền chi tiết

Mô tả: Mỗi vai trò chỉ làm được việc của mình
Yêu cầu:
Role-based Access Control (RBAC)
7 vai trò: Quản lý, Lễ tân, Kỹ thuật, Buồng phòng, Giặt ủi, Quản kho, Chủ KS
Phân quyền theo module và chức năng cụ thể
Không cho phép truy cập trái phép
Lý do: Bảo mật thông tin, tránh sai sót
4.3.8.3 Quản lý mật khẩu

Mô tả: Chính sách mật khẩu an toàn
Yêu cầu:
Đổi mật khẩu mặc định khi đăng nhập đầu tiên
Không cho phép dùng lại 3 mật khẩu cũ
Khuyến nghị đổi mật khẩu mỗi 90 ngày
Chức năng "Quên mật khẩu" qua email
Khóa tài khoản sau 5 lần đăng nhập sai
Lý do: Tăng cường bảo mật
4.3.8.4 Mã hóa dữ liệu nhạy cảm

Mô tả: Dữ liệu quan trọng phải được mã hóa
Yêu cầu:
Mã hóa CMND/CCCD/Passport (AES-256)
Mã hóa thông tin thẻ tín dụng (nếu lưu)
HTTPS cho toàn bộ ứng dụng (SSL/TLS)
Mã hóa backup database
Lý do: Tuân thủ luật bảo vệ dữ liệu cá nhân
4.3.8.5 Audit log

Mô tả: Ghi lại mọi thao tác quan trọng
Yêu cầu:
Log đầy đủ: Ai, Làm gì, Khi nào, Ở đâu
Log các thao tác tài chính (thu, chi, thanh toán)
Log truy cập dữ liệu khách hàng
Log thay đổi phân quyền
Lưu trữ log tối thiểu 1 năm
Log không được sửa/xóa
Lý do: Truy vết khi có sự cố, kiểm toán
Khoa khoa học và kỹ thuật máy tính
4.3.8.6 Backup và Recovery

Mô tả: Sao lưu dữ liệu định kỳ
Yêu cầu:
Backup tự động hàng ngày (3h sáng)
Lưu trữ backup ít nhất 30 ngày
Backup off-site (cloud hoặc server khác)
Kiểm tra backup định kỳ (tháng 1 lần)
Khả năng restore trong vòng 2 giờ
Lý do: Phòng tránh mất dữ liệu do sự cố
4.3.8.7 Bảo vệ khỏi tấn công web

Mô tả: Ngăn chặn các lỗ hổng bảo mật phổ biến
Yêu cầu:
Chống SQL Injection (Prepared Statements)
Chống XSS (Cross-Site Scripting)
Chống CSRF (Cross-Site Request Forgery)
Validate và sanitize input
Rate limiting API (tránh DDoS)
Lý do: Bảo vệ hệ thống khỏi hacker
4.3.8.8 Bảo mật kết nối

Mô tả: Kết nối an toàn
Yêu cầu:
HTTPS bắt buộc (redirect HTTP → HTTPS)
Chứng chỉ SSL hợp lệ
Secure cookie (HttpOnly, Secure flags)
CORS configuration đúng
Lý do: Bảo vệ dữ liệu truyền tải
4.3.9 Yêu cầu về khả năng bảo trì (Maintainability)
4.3.9.1 Mã nguyồn chất lượng

Mô tả: Code dễ đọc, dễ bảo trì
Yêu cầu:
Tuân thủ coding standards (PEP8 cho Python, ESLint cho JS)
Comment đầy đủ cho logic phức tạp
Đặt tên biến, hàm rõ ràng
Tránh code trùng lặp (DRY principle)
Code coverage ≥ 70% (unit test)
Lý do: Dễ bảo trì, mở rộng
4.3.9.2 Kiến trúc module

Mô tả: Tách biệt rõ ràng các module
Yêu cầu:
Kiến trúc MVC hoặc tương tự
Tách riêng: Business Logic, Data Access, UI
Module độc lập, ít phụ thuộc
API rõ ràng giữa các module
Lý do: Sửa 1 module không ảnh hưởng module khác
Khoa khoa học và kỹ thuật máy tính
4.3.9.3 Database schema

Mô tả: Thiết kế database rõ ràng
Yêu cầu:
Chuẩn hóa database (3NF)
Đặt tên bảng, cột rõ ràng
Tài liệu ERD diagram
Index hợp lý
Foreign key constraints
Lý do: Dễ hiểu, dễ truy vấn, dễ mở rộng
4.3.9.4 Version control

Mô tả: Quản lý mã nguồn
Yêu cầu:
Sử dụng Git
Commit message rõ ràng
Branching strategy (main, dev, feature branches)
Tag cho mỗi release
Lý do: Theo dõi thay đổi, rollback khi cần
4.3.9.5 Deployment

Mô tả: Triển khai dễ dàng
Yêu cầu:
Script tự động deploy
Environment config (dev, staging, production)
Migration script cho database
Rollback plan
Lý do: Giảm thiểu lỗi khi deploy
4.3.10 Yêu cầu về khả năng tương thích (Compatibility)
4.3.10.1 Trình duyệt

Mô tả: Hoạt động trên các trình duyệt phổ biến
Yêu cầu:
Chrome ≥ 90 (khuyến nghị)
Firefox ≥ 88
Edge ≥ 90
Safari ≥ 14 (nếu cần)
Không hỗ trợ IE11
Lý do: Nhân viên dùng nhiều trình duyệt khác nhau
4.3.10.2 Hệ điều hành

Mô tả: Hoạt động trên nhiều hệ điều hành
Yêu cầu:
Windows 10/11 (chính)
macOS (nếu quản lý dùng Mac)
Linux (nếu server dùng Linux)
Android/iOS (responsive web cho mobile)
Lý do: Linh hoạt cho người dùng
Khoa khoa học và kỹ thuật máy tính
4.3.10.3 Độ phân giải màn hình

Mô tả: Hiển thị tốt trên nhiều kích thước
Yêu cầu:
Desktop: 1366x768 đến 1920x1080
Tablet: 768x1024, 1024x768
Mobile: 375x667 đến 414x896
Lý do: Thiết bị đa dạng
4.3.10.4 Tích hợp bên thứ 3

Mô tả: Khả năng kết nối hệ thống khác
Yêu cầu hiện tại:
Máy POS (thanh toán thẻ)
Email server (Gmail, Outlook)
SMS gateway (gửi SMS)
Yêu cầu tương lai:
Kế toán (MISA, Fast)
OTA (Booking.com, Agoda API)
Payment gateway (VNPay, MoMo)
Smart lock system
Lý do: Mở rộng chức năng, tự động hóa
4.3.11 Yêu cầu về khả năng phục hồi (Recoverability)
4.3.11.1 Recovery Time Objective (RTO)

Mô tả: Thời gian tối đa để khôi phục hệ thống
Yêu cầu:
Sự cố nhỏ (lỗi ứng dụng): ≤ 30 phút
Sự cố trung bình (lỗi server): ≤ 2 giờ
Sự cố lớn (mất database): ≤ 4 giờ
Lý do: Giảm thiểu ảnh hưởng đến hoạt động
4.3.11.2 Recovery Point Objective (RPO)

Mô tả: Lượng dữ liệu tối đa có thể mất
Yêu cầu:
RPO: ≤ 24 giờ (backup hàng ngày)
Critical data: ≤ 1 giờ (transaction log)
Lý do: Chấp nhận mất dữ liệu tối đa 1 ngày
4.3.11.3 Disaster Recovery Plan

Mô tả: Kế hoạch khôi phục khi thảm họa
Yêu cầu:
Tài liệu quy trình khôi phục
Backup off-site
Standby server (nếu có ngân sách)
Contact list khi khẩn cấp
Test DR plan 6 tháng/lần
Lý do: Chuẩn bị cho tình huống xấu nhất
Khoa khoa học và kỹ thuật máy tính
4.3.12 Yêu cầu về tài liệu (Documentation)
4.3.12.1 Tài liệu người dùng

Mô tả: Hướng dẫn sử dụng cho nhân viên
Yêu cầu:
User manual tiếng Việt
Video hướng dẫn các chức năng chính
FAQ (Câu hỏi thường gặp)
Hướng dẫn ngay trong hệ thống (tooltip, help)
Lý do: Nhân viên tự học, giảm support
4.3.12.2 Tài liệu kỹ thuật

Mô tả: Tài liệu cho developer
Yêu cầu:
System architecture diagram
Database ERD
API documentation
Deployment guide
Troubleshooting guide
Lý do: Bảo trì, mở rộng sau này
4.3.12.3 Tài liệu vận hành

Mô tả: Hướng dẫn vận hành hệ thống
Yêu cầu:
Quy trình backup/restore
Quy trình cập nhật phần mềm
Quy trình xử lý sự cố
Monitoring checklist
Lý do: Admin/IT cần biết cách vận hành
Khoa khoa học và kỹ thuật máy tính
4.4 Use Case toàn hệ thống
Hình 6: Use case diagram cho toàn bộ hệ thống
Khoa khoa học và kỹ thuật máy tính
4.5 Đặc tả use case
4.5.1 Use case theo module
4.5.1.a Module 1: Quản lý thiết bị/cơ sở vật chất
Hình 7: Use case diagram Module 1: Quản lý thiết bị/cơ sở vật chất
UC-1.1: Tạo yêu cầu thay thế/sửa chữa
Thuộc tính Nội dung
Use Case ID UC-1.1
Use Case Name Tạo yêu cầu thay thế/sửa chữa thiết bị
Actor Kỹ thuật viên
Mô tả Kỹ thuật viên tạo yêu cầu thay thế hoặc sửa chữa thiết bị/CSVC khi
phát hiện hư hỏng hoặc cần bảo trì định kỳ
Tiền điều kiện
Kỹ thuật viên đã đăng nhập
Có thiết bị/CSVC trong hệ thống cần thay thế/sửa chữa
Hậu điều kiện
Yêu cầu được tạo và lưu vào hệ thống với trạng thái "Chờ duyệt"
Quản lý nhận được thông báo về yêu cầu mới
Chu trình thực thi
Kỹ thuật viên chọn "Tạo yêu cầu"
Hệ thống hiển thị form nhập thông tin
Kỹ thuật viên chọn thiết bị/CSVC từ danh sách
Kỹ thuật viên chọn loại yêu cầu (Thay thế/Sửa chữa)
Kỹ thuật viên nhập mô tả chi tiết vấn đề
Kỹ thuật viên chọn mức độ ưu tiên (Thường/Cao/Khẩn cấp)
Kỹ thuật viên nhập chi phí dự kiến (nếu có)
Kỹ thuật viên có thể đính kèm hình ảnh minh họa
Kỹ thuật viên xác nhận tạo yêu cầu
Hệ thống tạo mã yêu cầu tự động (YC-YYYYMMDD-XXX)
Hệ thống lưu yêu cầu với trạng thái "Chờ duyệt"
Hệ thống gửi thông báo đến Quản lý
Hệ thống hiển thị thông báo thành công
Khoa khoa học và kỹ thuật máy tính
Thuộc tính Nội dung
Chu trình phụ 3a. Thiết bị chưa có trong hệ thống
Kỹ thuật viên chọn "Thêm thiết bị mới"
Nhập thông tin thiết bị (tên, mã, vị trí)
Lưu thiết bị vào hệ thống
Quay lại bước 3 của chu trình chính
6a. Yêu cầu khẩn cấp
Kỹ thuật viên chọn mức độ "Khẩn cấp"
Hệ thống gửi thông báo SMS/Email ngay lập tức đến Quản lý
Tiếp tục bước 7
Ngoại lệ E1: Thông tin không đầy đủ
Điều kiện: Thiếu thông tin bắt buộc (thiết bị, mô tả, mức độ ưu tiên)
Xử lý: Hiển thị thông báo lỗi, yêu cầu nhập đầy đủ thông tin E2:
Upload hình ảnh thất bại
Điều kiện: File quá lớn (>10MB) hoặc định dạng không hỗ trợ
Xử lý: Hiển thị thông báo lỗi, yêu cầu chọn file khác E3: Lỗi kết nối
Điều kiện: Mất kết nối mạng khi submit
Xử lý: Lưu dữ liệu tạm thời, thử gửi lại sau 30 giây
UC-1.2: Cập nhật tình trạng thiết bị hàng ngày

Thuộc tính Nội dung
Use Case ID UC-1.2
Use Case Name Cập nhật tình trạng thiết bị hàng ngày
Actor Kỹ thuật viên
Mô tả Kỹ thuật viên cập nhật tình trạng hoạt động của thiết bị/CSVC hàng
ngày để theo dõi và duy trì
Tiền điều kiện
Kỹ thuật viên đã đăng nhập
Có thiết bị/CSVC trong hệ thống
Hậu điều kiện
Tình trạng thiết bị được cập nhật
Lịch sử thay đổi được ghi lại
Cảnh báo được gửi nếu phát hiện vấn đề
Chu trình thực thi
Kỹ thuật viên chọn "Cập nhật tình trạng"
Hệ thống hiển thị danh sách thiết bị được phân công
Kỹ thuật viên chọn thiết bị cần cập nhật
Hệ thống hiển thị form cập nhật với tình trạng hiện tại
Kỹ thuật viên chọn tình trạng mới:
Tốt
Khá
Trung bình
Kém
Hỏng
Kỹ thuật viên nhập ghi chú (nếu có thay đổi)
Kỹ thuật viên xác nhận cập nhật
Hệ thống lưu tình trạng mới
Hệ thống ghi log thay đổi (người, thời gian, trạng thái cũ → mới)
Hệ thống hiển thị thông báo thành công
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 5a. Phát hiện tình trạng xuống cấp nghiêm trọng
Tình trạng chuyển từ Tốt/Khá xuống Kém/Hỏng
Hệ thống tự động tạo cảnh báo
Đề xuất tạo yêu cầu sửa chữa
Kỹ thuật viên có thể tạo yêu cầu ngay (UC-1.1)
Tiếp tục bước 6
Ngoại lệ E1: Cập nhật trùng lặp
Điều kiện: Thiết bị đã được cập nhật trong cùng ngày
Xử lý: Cho phép cập nhật nhưng cảnh báo "Đã cập nhật lúc XX:XX"
E2: Thiết bị đang bảo trì
Điều kiện: Thiết bị có yêu cầu sửa chữa đang xử lý
Xử lý: Hiển thị thông tin yêu cầu, cho phép cập nhật sau khi hoàn
thành
UC-1.3: Xem tình trạng trang thiết bị

Thuộc tính Nội dung
Use Case ID UC-1.3
Use Case Name Xem tình trạng trang thiết bị
Actor Kỹ thuật viên, Quản lý
Mô tả Xem tổng quan và chi tiết tình trạng của tất cả thiết bị/CSVC trong
khách sạn
Tiền điều kiện
Người dùng đã đăng nhập
Có thiết bị/CSVC trong hệ thống
Hậu điều kiện
Người dùng xem được thông tin thiết bị
Không có thay đổi dữ liệu
Chu trình thực thi
Người dùng chọn "Xem tình trạng thiết bị"
Hệ thống hiển thị dashboard tổng quan (số lượng theo tình trạng)
Hệ thống hiển thị danh sách thiết bị với: Tên, Mã, Vị trí, Tình trạng,
Lần cập nhật cuối
Người dùng có thể lọc theo: Tình trạng, Loại thiết bị, Vị trí
Người dùng có thể tìm kiếm theo tên/mã
Người dùng chọn thiết bị để xem chi tiết
Hệ thống hiển thị: Thông tin đầy đủ, Lịch sử thay đổi, Lịch sử bảo
trì, Hình ảnh
Chu trình phụ 4a. Lọc theo tình trạng "Kém" hoặc "Hỏng"
Hiển thị danh sách thiết bị cần chú ý
Tô màu đỏ/vàng để cảnh báo
Hiển thị thời gian chưa được xử lý
7a. Xem lịch sử bảo trì
Hiển thị tất cả lần bảo trì/sửa chữa
Thông tin: Ngày, Người thực hiện, Nội dung, Chi phí
Ngoại lệ E1: Không có dữ liệu
Điều kiện: Chưa có thiết bị nào trong hệ thống
Xử lý: Hiển thị thông báo "Chưa có thiết bị. Vui lòng thêm thiết bị
mới"
UC-1.4: Xét duyệt yêu cầu thay thế/sửa chữa

Thuộc tính Nội dung
Khoa khoa học và kỹ thuật máy tính
Use Case ID UC-1.4
Use Case Name Xét duyệt yêu cầu thay thế/sửa chữa
Actor Quản lý
Mô tả Quản lý xem xét và phê duyệt/từ chối yêu cầu thay thế hoặc sửa chữa
thiết bị
Tiền điều kiện

Quản lý đã đăng nhập
Có yêu cầu ở trạng thái "Chờ duyệt"
Hậu điều kiện
Yêu cầu được phê duyệt: Chuyển sang "Đã duyệt", phân công kỹ thuật
viên
Yêu cầu bị từ chối: Chuyển sang "Đã từ chối", ghi lý do
Người tạo yêu cầu nhận được thông báo
Chu trình thực thi
Quản lý chọn "Xét duyệt yêu cầu"
Hệ thống hiển thị danh sách yêu cầu chờ duyệt
Quản lý chọn yêu cầu cần xét
Hệ thống hiển thị chi tiết: Thiết bị, Vấn đề, Mức độ, Chi phí dự kiến,
Hình ảnh
Quản lý quyết định Phê duyệt hoặc Từ chối
Nếu Phê duyệt:
6.1. Quản lý phân công kỹ thuật viên xử lý
6.2. Quản lý nhập deadline (ngày hoàn thành dự kiến)
6.3. Quản lý phê duyệt ngân sách
6.4. Quản lý xác nhận
6.5. Hệ thống cập nhật trạng thái = "Đã duyệt"
6.6. Hệ thống gửi thông báo cho kỹ thuật viên được phân công
Nếu Từ chối:
7.1. Quản lý nhập lý do từ chối
7.2. Quản lý xác nhận
7.3. Hệ thống cập nhật trạng thái = "Đã từ chối"
7.4. Hệ thống gửi thông báo + lý do cho người tạo yêu cầu
Hệ thống hiển thị thông báo hoàn tất
Chu trình phụ 4a. Yêu cầu khẩn cấp
Hiển thị cảnh báo màu đỏ "YÊU CẦU KHẨN CẤP"
Ưu tiên xử lý trước các yêu cầu khác
6.3a. Ngân sách vượt quyền hạn (>10 triệu)
Hệ thống cảnh báo "Vượt quyền hạn phê duyệt"
Yêu cầu chuyển lên Chủ khách sạn duyệt
Hệ thống gửi yêu cầu đến Chủ KS
Quay lại bước 8
Ngoại lệ E1: Không có kỹ thuật viên rảnh
Điều kiện: Tất cả kỹ thuật viên đang bận
Xử lý: Hiển thị danh sách và số công việc hiện tại, cho phép phân công
dù đang bận E2: Thông tin không đủ để quyết định
Điều kiện: Thiếu thông tin chi phí, hình ảnh
Xử lý: Gửi yêu cầu bổ sung thông tin, chưa duyệt/từ chối
Khoa khoa học và kỹ thuật máy tính
4.5.1.b Module 2: Quản lý khách hàng
Hình 8: Use case diagram Module 2: Quản lý khách hàng
UC-2.1: Thêm khách hàng
Thuộc tính Nội dung
Use Case ID UC-2.1
Use Case Name Thêm khách hàng mới
Actor Lễ tân, Quản lý
Mô tả Thêm thông tin khách hàng mới vào hệ thống khi khách đặt phòng hoặc
check-in
Tiền điều kiện
Người dùng đã đăng nhập
Có thông tin khách hàng (CMND/CCCD/Passport)
Hậu điều kiện
Khách hàng được tạo và lưu vào hệ thống
Mã khách hàng tự động được sinh
Thông tin được mã hóa (nếu là dữ liệu nhạy cảm)
Chu trình thực thi
Người dùng chọn "Thêm khách hàng"
Hệ thống hiển thị form nhập thông tin
Người dùng nhập thông tin cơ bản:
Họ tên (*)
CMND/CCCD/Passport (*) - Định danh duy nhất
Số điện thoại (*)
Email
Ngày sinh
Giới tính
Quốc tịch (*)
Địa chỉ
Hệ thống kiểm tra CMND/CCCD/Passport chưa tồn tại
Hệ thống kiểm tra định dạng (email, số điện thoại, ngày sinh)
Người dùng xác nhận thêm
Hệ thống tạo mã khách hàng tự động (KH-XXXXXX)
Hệ thống mã hóa CMND/CCCD/Passport (AES-256)
Hệ thống lưu thông tin khách hàng
Hệ thống hiển thị thông báo thành công + mã khách hàng
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 3a. Quét CMND/CCCD bằng OCR
Người dùng chọn "Quét giấy tờ"
Hệ thống kích hoạt camera hoặc chọn file ảnh
Hệ thống nhận diện và tự động điền: Họ tên, CMND, Ngày sinh, Địa
chỉ
Người dùng kiểm tra và chỉnh sửa nếu cần
Tiếp tục bước 4
4a. CMND/CCCD đã tồn tại
Hệ thống phát hiện CMND trùng hoặc họ tên + ngày sinh giống nhau
Hiển thị thông tin khách hàng có sẵn
Hỏi "Đây có phải khách hàng cũ không?"
Nếu Có: Chuyển sang UC-2.2.1 (Sửa thông tin)
Nếu Không: Cho phép tiếp tục nhập
Ngoại lệ E1: Thiếu thông tin bắt buộc
Điều kiện: Không nhập đủ các trường (*)
Xử lý: Hiển thị lỗi, yêu cầu nhập đầy đủ E2: Định dạng không hợp
lệ
Điều kiện: Email sai format, SĐT không đủ 10 số, ngày sinh > hiện tại
Xử lý: Highlight trường lỗi màu đỏ, hiển thị gợi ý E3: Tuổi không
hợp lệ (<16 tuổi)
Điều kiện: Ngày sinh cho thấy khách <16 tuổi
Xử lý: Cảnh báo "Khách dưới 16 tuổi cần có người giám hộ"
UC-2.2.1: Sửa thông tin khách hàng

Thuộc tính Nội dung
Use Case ID UC-2.2.1
Use Case Name Sửa thông tin khách hàng
Actor Lễ tân, Quản lý
Mô tả Cập nhật thông tin khách hàng khi có thay đổi hoặc sai sót
Tiền điều kiện
Người dùng đã đăng nhập
Khách hàng đã tồn tại trong hệ thống
Hậu điều kiện
Thông tin khách hàng được cập nhật
Lịch sử thay đổi được ghi lại (audit log)
OTP được gửi nếu sửa email/SĐT (tùy chọn)
Chu trình thực thi
Người dùng tìm kiếm và chọn khách hàng cần sửa
Người dùng chọn "Sửa thông tin"
Hệ thống hiển thị form với dữ liệu hiện tại
Người dùng chỉnh sửa các trường (trừ CMND/CCCD - không sửa
được)
Hệ thống kiểm tra định dạng dữ liệu mới
Người dùng xác nhận sửa
Hệ thống ghi log thay đổi: Trường nào, Giá trị cũ→ mới, Ai sửa, Khi
nào
Hệ thống lưu thông tin mới
Hệ thống hiển thị thông báo thành công
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 4a. Sửa thông tin nhạy cảm (Email/SĐT)
Hệ thống gửi mã OTP đến email/SĐT cũ
Người dùng nhập mã OTP
Hệ thống xác thực OTP
Nếu đúng: Cho phép sửa
Nếu sai: Yêu cầu nhập lại (tối đa 3 lần)
Tiếp tục bước 5
6a. Lễ tân sửa sau 24h
Hệ thống kiểm tra thời gian tạo > 24h
Yêu cầu phê duyệt từ Quản lý
Gửi yêu cầu phê duyệt
Quản lý duyệt → Tiếp tục bước 7
Quản lý từ chối → Hiển thị lý do, kết thúc
Ngoại lệ E1: CMND/CCCD không được sửa
Điều kiện: Người dùng cố gắng sửa CMND/CCCD
Xử lý: Trường bị disable, hiển thị tooltip "Không được phép sửa CM-
ND/CCCD. Nếu sai, vui lòng xóa và tạo lại" E2: OTP hết hạn (>5
phút)
Điều kiện: Nhập OTP sau 5 phút
Xử lý: Hiển thị "OTP đã hết hạn", cho phép gửi lại
UC-2.2.2: Xóa khách hàng

Thuộc tính Nội dung
Use Case ID UC-2.2.2
Use Case Name Xóa khách hàng
Actor Quản lý
Mô tả Xóa khách hàng khỏi hệ thống (Soft delete - không xóa vật lý)
Tiền điều kiện
Quản lý đã đăng nhập
Khách hàng tồn tại trong hệ thống
Khách hàng không có booking đang hoạt động
Khách hàng không có công nợ
Hậu điều kiện
Khách hàng bị đánh dấu "Đã xóa" (soft delete)
Dữ liệu vẫn lưu trong 30 ngày để khôi phục
Sau 30 ngày sẽ xóa vĩnh viễn (hard delete)
Chu trình thực thi
Quản lý tìm và chọn khách hàng cần xóa
Quản lý chọn "Xóa khách hàng"
Hệ thống kiểm tra điều kiện cho phép xóa:
Không có booking đang hoạt động
Không có công nợ
Hệ thống hiển thị cảnh báo xác nhận xóa
Quản lý nhập lý do xóa
Quản lý xác nhận xóa
Hệ thống đánh dấu khách hàng = "Đã xóa" (soft delete)
Hệ thống ghi log: Ai xóa, Khi nào, Lý do
Hệ thống lên lịch xóa vĩnh viễn sau 30 ngày
Hiển thị "Đã xóa khách hàng. Có thể khôi phục trong 30 ngày"
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 9a. Khôi phục khách hàng đã xóa (trong 30 ngày)
Quản lý chọn "Xem khách hàng đã xóa"
Hệ thống hiển thị danh sách đã xóa + số ngày còn lại
Quản lý chọn khách cần khôi phục
Quản lý chọn "Khôi phục"
Hệ thống đánh dấu lại = "Hoạt động"
Hệ thống ghi log khôi phục
Hiển thị "Đã khôi phục khách hàng"
Ngoại lệ E1: Có booking đang hoạt động
Điều kiện: Khách có booking chưa check-out
Xử lý: Hiển thị "Không thể xóa. Khách có booking đang hoạt động:
BK-XXX. Vui lòng chờ check-out" E2: Còn công nợ
Điều kiện: Khách còn nợ tiền
Xử lý: Hiển thị "Không thể xóa. Khách còn nợ: XXX VNĐ. Vui lòng
thu hết nợ trước"
UC-2.3: Xem danh sách khách hàng

Thuộc tính Nội dung
Use Case ID UC-2.3
Use Case Name Xem danh sách khách hàng
Actor Lễ tân, Quản lý, Chủ khách sạn
Mô tả Xem danh sách tất cả khách hàng với các bộ lọc và tìm kiếm
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách khách hàng theo yêu cầu
Chu trình thực thi
Người dùng chọn "Danh sách khách hàng"
Hệ thống hiển thị danh sách mặc định (20 KH/trang, sắp xếp theo
tên)
Hiển thị thông tin: Mã KH, Họ tên, SĐT, Email, Loại KH, Lần cuối
lưu trú
Hiển thị dashboard thống kê:
Tổng số khách hàng
Khách VIP
Khách thường xuyên (≥ 5 lần)
Khách mới (tháng này)
Người dùng có thể: Phân trang, Sắp xếp, Lọc, Tìm kiếm, Xem chi
tiết, Xuất Excel/PDF
Chu trình phụ 5a. Xuất danh sách
Người dùng chọn "Xuất Excel" hoặc "Xuất PDF"
Hệ thống tạo file với dữ liệu hiện tại (có áp dụng filter)
File được tải về
Ngoại lệ E1: Không có khách hàng
Điều kiện: Database chưa có khách hàng nào
Xử lý: Hiển thị "Chưa có khách hàng. Bạn có muốn thêm khách hàng
mới?"
Khoa khoa học và kỹ thuật máy tính
4.5.1.c Module 3: Quản lý phòng
Hình 9: Use case diagram Module 3: Quản lý phòng
UC-3.1.1: Thêm phòng
Thuộc tính Nội dung
Use Case ID UC-3.1.1
Use Case Name Thêm phòng mới
Actor Quản lý
Mô tả Thêm phòng mới vào hệ thống khi khách sạn mở rộng hoặc cải tạo
Tiền điều kiện
Quản lý đã đăng nhập
Có ít nhất 1 hạng phòng trong hệ thống
Hậu điều kiện
Phòng mới được tạo và lưu vào hệ thống
Trạng thái mặc định = "Sẵn sàng"
Phòng có thể được đặt ngay
Chu trình thực thi
Quản lý chọn "Thêm phòng"
Hệ thống hiển thị form
Quản lý nhập thông tin:
Số phòng (*) - Phải duy nhất
Tầng (*)
Hạng phòng (*) - Chọn từ danh sách
Diện tích (m²)
Hướng (Đông/Tây/Nam/Bắc)
View (Biển/Thành phố/Vườn/Núi)
Ghi chú
Hệ thống kiểm tra số phòng chưa tồn tại
Quản lý xác nhận
Hệ thống lưu phòng với trạng thái "Sẵn sàng"
Hiển thị "Thêm phòng thành công - Phòng XXX"
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 3a. Thêm nhiều phòng cùng lúc (Bulk add)
Quản lý chọn "Thêm nhiều phòng"
Nhập: Từ phòng XXX đến YYY, Tầng, Hạng phòng
Hệ thống tạo tất cả phòng trong khoảng
Ví dụ: Từ 301-310 → Tạo 10 phòng
Tiếp tục bước 7
Ngoại lệ E1: Số phòng đã tồn tại
Điều kiện: Số phòng bị trùng
Xử lý: Hiển thị "Số phòng XXX đã tồn tại. Vui lòng chọn số khác"
E2: Chưa có hạng phòng
Điều kiện: Database chưa có hạng phòng nào
Xử lý: Yêu cầu tạo hạng phòng trước (UC-3.2.1)
UC-3.1.2: Sửa thông tin phòng

Thuộc tính Nội dung
Use Case ID UC-3.1.2
Use Case Name Sửa thông tin phòng
Actor Quản lý
Mô tả Cập nhật thông tin phòng khi có thay đổi (cải tạo, nâng cấp, v.v.)
Tiền điều kiện
Quản lý đã đăng nhập
Phòng đã tồn tại trong hệ thống
Hậu điều kiện
Thông tin phòng được cập nhật
Lịch sử thay đổi được ghi lại
Chu trình thực thi
Quản lý tìm và chọn phòng cần sửa
Quản lý chọn "Sửa thông tin"
Hệ thống hiển thị form với dữ liệu hiện tại
Quản lý chỉnh sửa các trường (trừ Số phòng)
Quản lý xác nhận sửa
Hệ thống ghi log thay đổi
Hệ thống lưu thông tin mới
Hiển thị "Cập nhật phòng thành công"
Chu trình phụ 4a. Nâng cấp hạng phòng
Thay đổi hạng phòng (VD: Standard → Deluxe)
Hệ thống cảnh báo "Thay đổi hạng phòng sẽ ảnh hưởng giá"
Quản lý xác nhận
Cập nhật giá theo hạng mới
Tiếp tục bước 5
Ngoại lệ E1: Số phòng không được sửa
Điều kiện: Người dùng cố sửa số phòng
Xử lý: Trường bị disable, tooltip "Không sửa được số phòng" E2:
Phòng đang có khách
Điều kiện: Phòng trạng thái "Đang sử dụng"
Xử lý: Cảnh báo "Phòng đang có khách. Một số thông tin không sửa
được"
UC-3.1.3: Xóa phòng

Thuộc tính Nội dung
Use Case ID UC-3.1.3
Use Case Name Xóa phòng
Khoa khoa học và kỹ thuật máy tính
Actor Quản lý
Mô tả Xóa phòng khỏi hệ thống (khi khách sạn thu hẹp, cải tạo, v.v.)
Tiền điều kiện
Quản lý đã đăng nhập
Phòng tồn tại trong hệ thống
Phòng không có booking đang hoạt động
Phòng trạng thái "Sẵn sàng" hoặc "Bảo trì"
Hậu điều kiện
Phòng bị đánh dấu "Đã xóa" (soft delete)
Lịch sử booking của phòng vẫn được lưu
Chu trình thực thi
Quản lý tìm và chọn phòng cần xóa
Quản lý chọn "Xóa phòng"
Hệ thống kiểm tra điều kiện:
Không có booking đang hoạt động
Không đang có khách
Hệ thống hiển thị cảnh báo xác nhận
Quản lý nhập lý do xóa
Quản lý xác nhận xóa
Hệ thống đánh dấu phòng = "Đã xóa"
Hệ thống ghi log
Hiển thị "Đã xóa phòng XXX"
Chu trình phụ Không có
Ngoại lệ E1: Có booking đang hoạt động
Điều kiện: Phòng có booking chưa check-out
Xử lý: Hiển thị "Không thể xóa. Phòng có booking: BK-XXX" E2:
Phòng đang có khách
Điều kiện: Trạng thái = "Đang sử dụng"
Xử lý: Hiển thị "Không thể xóa. Phòng đang có khách lưu trú"
UC-3.2.1: Tạo hạng phòng

Thuộc tính Nội dung
Use Case ID UC-3.2.1
Use Case Name Tạo hạng phòng mới
Actor Quản lý
Mô tả Tạo hạng phòng mới để phân loại phòng theo tiêu chuẩn và giá cả
Tiền điều kiện
Quản lý đã đăng nhập
Hậu điều kiện
Hạng phòng được tạo và lưu vào hệ thống
Có thể gán cho các phòng ngay lập tức
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi
Quản lý chọn "Tạo hạng phòng"
Hệ thống hiển thị form
Quản lý nhập thông tin:
Tên hạng phòng (*): VD: Standard, Deluxe, Suite
Giá cơ bản/đêm (*): VNĐ
Sức chứa (*): Số người tối đa
Diện tích tiêu chuẩn: m²
Tiện nghi:
TV, Wifi, Điều hòa, Tủ lạnh
Bồn tắm, Minibar, Ban công
Bếp nhỏ, Máy giặt, v.v.
Mô tả chi tiết
Hình ảnh mẫu
Hệ thống kiểm tra tên hạng phòng chưa tồn tại
Quản lý xác nhận
Hệ thống lưu hạng phòng
Hiển thị "Tạo hạng phòng thành công"
Chu trình phụ Không có
Ngoại lệ E1: Tên hạng phòng đã tồn tại
Điều kiện: Tên bị trùng
Xử lý: Hiển thị "Hạng phòng XXX đã tồn tại. Vui lòng chọn tên khác"
E2: Giá không hợp lệ
Điều kiện: Giá ≤ 0
Xử lý: Hiển thị "Giá phải lớn hơn 0"
UC-3.2.2: Sửa hạng phòng

Thuộc tính Nội dung
Use Case ID UC-3.2.2
Use Case Name Sửa thông tin hạng phòng
Actor Quản lý
Mô tả Cập nhật thông tin và giá của hạng phòng
Tiền điều kiện
Quản lý đã đăng nhập
Hạng phòng đã tồn tại
Hậu điều kiện
Thông tin hạng phòng được cập nhật
Giá mới áp dụng cho booking mới (không ảnh hưởng booking cũ)
Chu trình thực thi
Quản lý chọn hạng phòng cần sửa
Quản lý chọn "Sửa thông tin"
Hệ thống hiển thị form với dữ liệu hiện tại
Quản lý chỉnh sửa thông tin
Quản lý xác nhận
Hệ thống ghi log thay đổi (đặc biệt là thay đổi giá)
Hệ thống lưu thông tin mới
Hiển thị "Cập nhật hạng phòng thành công"
Chu trình phụ 4a. Thay đổi giá
Giá mới khác giá cũ > 10%
Hệ thống cảnh báo "Thay đổi giá lớn: Giá cũ XXX→ Giá mới YYY"
Yêu cầu xác nhận lại
Quản lý xác nhận
Tiếp tục bước 5
Khoa khoa học và kỹ thuật máy tính
Ngoại lệ E1: Giá mới không hợp lệ
Điều kiện: Giá ≤ 0
Xử lý: Hiển thị lỗi "Giá phải lớn hơn 0"
UC-3.2.3: Xóa hạng phòng

Thuộc tính Nội dung
Use Case ID UC-3.2.3
Use Case Name Xóa hạng phòng
Actor Quản lý
Mô tả Xóa hạng phòng khỏi hệ thống
Tiền điều kiện
Quản lý đã đăng nhập
Hạng phòng tồn tại
Không có phòng nào đang sử dụng hạng này
Hậu điều kiện
Hạng phòng bị xóa khỏi hệ thống
Chu trình thực thi
Quản lý chọn hạng phòng cần xóa
Quản lý chọn "Xóa hạng phòng"
Hệ thống kiểm tra không có phòng nào sử dụng hạng này
Hệ thống hiển thị cảnh báo xác nhận
Quản lý xác nhận xóa
Hệ thống xóa hạng phòng
Hệ thống ghi log
Hiển thị "Đã xóa hạng phòng"
Chu trình phụ Không có
Ngoại lệ E1: Có phòng đang sử dụng hạng này
Điều kiện: ∃ phòng có hạng = hạng này
Xử lý: Hiển thị "Không thể xóa. Có X phòng đang sử dụng hạng này.
Vui lòng chuyển sang hạng khác trước"
Khoa khoa học và kỹ thuật máy tính
4.5.1.d Module 4: Quản lý sự cố
Hình 10: Use case diagram Module 4: Quản lý sự cố
UC-4.1: Phân công xử lý sự cố
Thuộc tính Nội dung
Use Case ID UC-4.1
Use Case Name Phân công xử lý sự cố
Actor Quản lý
Mô tả Quản lý phân công nhân viên kỹ thuật để xử lý sự cố đã được báo cáo
Tiền điều kiện
Quản lý đã đăng nhập
Có sự cố ở trạng thái "Mới" hoặc "Chưa phân công"
Có nhân viên kỹ thuật trong hệ thống
Khoa khoa học và kỹ thuật máy tính
Hậu điều kiện

Sự cố được phân công cho kỹ thuật viên
Trạng thái chuyển sang "Đã phân công"
Kỹ thuật viên nhận thông báo
Thời gian xử lý dự kiến được ghi nhận
Chu trình thực thi
Quản lý chọn "Phân công sự cố"
Hệ thống hiển thị danh sách sự cố chưa phân công
Hệ thống sắp xếp theo: Mức độ ưu tiên (Khẩn cấp → Thấp), Thời
gian báo cáo (Cũ nhất trước)
Quản lý chọn sự cố cần phân công
Hệ thống hiển thị chi tiết sự cố:
Mã sự cố
Loại sự cố
Vị trí
Mức độ nghiêm trọng
Mô tả chi tiết
Hình ảnh (nếu có)
Người báo cáo
Thời gian báo cáo
Hệ thống hiển thị danh sách kỹ thuật viên:
Tên kỹ thuật viên
Chuyên môn
Số sự cố đang xử lý
Trạng thái (Rảnh/Bận)
Đánh giá trung bình
Quản lý chọn kỹ thuật viên phụ trách
Quản lý có thể thêm kỹ thuật viên hỗ trợ (nếu sự cố phức tạp)
Quản lý nhập thời gian xử lý dự kiến (giờ)
Quản lý nhập ghi chú/hướng dẫn (tùy chọn)
Quản lý xác nhận phân công
Hệ thống cập nhật sự cố:
Trạng thái = "Đã phân công"
Kỹ thuật viên phụ trách
Thời gian phân công
Deadline = Hiện tại + Thời gian dự kiến
Hệ thống gửi thông báo push/email/SMS đến kỹ thuật viên
Hệ thống ghi log phân công
Hiển thị "Phân công sự cố thành công - Mã: SC-XXX"
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 7a. Hệ thống gợi ý kỹ thuật viên phù hợp
Hệ thống phân tích loại sự cố
Tìm kỹ thuật viên có chuyên môn phù hợp
Ưu tiên kỹ thuật viên: Rảnh, Ít sự cố đang xử lý, Đánh giá cao, Gần
vị trí sự cố
Hiển thị "Gợi ý: Kỹ thuật viên XXX (Chuyên môn phù hợp, đang
rảnh)"
Quản lý có thể chấp nhận gợi ý hoặc chọn người khác
Tiếp tục bước 8
8a. Phân công nhóm (nhiều kỹ thuật viên)
Sự cố phức tạp hoặc khẩn cấp
Quản lý chọn nhiều kỹ thuật viên
Chỉ định 1 người làm trưởng nhóm
Phân chia nhiệm vụ cụ thể cho từng người (tùy chọn)
Tiếp tục bước 9
12a. Sự cố khẩn cấp - Gửi thông báo ngay lập tức
Mức độ = "Khẩn cấp"
Hệ thống gọi điện tự động (nếu cấu hình)
Gửi SMS + Push notification + Email đồng thời
Yêu cầu kỹ thuật viên xác nhận nhận nhiệm vụ trong 5 phút
Tiếp tục bước 13
Ngoại lệ E1: Không có kỹ thuật viên rảnh
Điều kiện: Tất cả kỹ thuật viên đang bận
Xử lý: Hiển thị danh sách kỹ thuật viên và số sự cố đang xử lý. Cho
phép phân công cho người ít việc nhất hoặc Đề xuất thuê kỹ thuật viên
bên ngoài E2: Kỹ thuật viên không phù hợp
Điều kiện: Chuyên môn không khớp với loại sự cố
Xử lý: Cảnh báo "Kỹ thuật viên XXX không có chuyên môn về YYY.
Vẫn muốn phân công?"
UC-4.2: Xem danh sách sự cố

Thuộc tính Nội dung
Use Case ID UC-4.2
Use Case Name Xem danh sách sự cố
Actor Lễ tân, Kỹ thuật viên, Quản lý, Buồng phòng
Mô tả Xem danh sách tất cả sự cố với các bộ lọc và tìm kiếm
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách sự cố theo quyền của người dùng
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi

Người dùng chọn "Xem danh sách sự cố"
Hệ thống xác định vai trò người dùng:
Quản lý: Xem tất cả sự cố
Kỹ thuật viên: Chỉ xem sự cố được phân công cho mình
Lễ tân/Buồng phòng: Xem sự cố do mình báo cáo + Sự cố
chung
Hệ thống hiển thị dashboard tổng quan:
Tổng số sự cố
Sự cố mới (chưa phân công)
Sự cố đang xử lý
Sự cố quá hạn (vượt deadline)
Sự cố đã giải quyết hôm nay
Biểu đồ theo loại sự cố
Biểu đồ theo mức độ
Hệ thống hiển thị danh sách sự cố (mặc định 20/trang):
Mã sự cố
Loại sự cố
Vị trí (Phòng/Khu vực)
Mức độ (icon màu: Khẩn cấp, Cao, Trung bình, Thấp)
Trạng thái
Kỹ thuật viên phụ trách
Thời gian báo cáo
Deadline
Hệ thống sắp xếp mặc định: Khẩn cấp trước, sau đó theo thời gian
báo cáo giảm dần
Người dùng có thể:
Lọc theo: Trạng thái, Loại sự cố, Mức độ, Vị trí, Kỹ thuật viên,
Thời gian
Tìm kiếm theo: Mã sự cố, Từ khóa, Số phòng
Sắp xếp theo: Mức độ, Thời gian, Trạng thái
Xem chi tiết từng sự cố
Xuất báo cáo Excel/PDF
Người dùng chọn sự cố để xem chi tiết
Hệ thống hiển thị thông tin đầy đủ:
Tất cả thông tin cơ bản
Lịch sử cập nhật trạng thái
Lịch sử comment/ghi chú
Hình ảnh trước và sau xử lý
Thời gian xử lý thực tế
Chi phí phát sinh (nếu có)
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 6a. Lọc nâng cao
Người dùng chọn "Lọc nâng cao"
Hiển thị form lọc với nhiều tiêu chí kết hợp:
Trạng thái: Mới, Đã phân công, Đang xử lý, Đã giải quyết, Đã
đóng
Loại: Thiết bị hỏng, Vệ sinh, An ninh, Khách phàn nàn, Rò rỉ,
Mất điện, Khác
Mức độ: Thấp, Trung bình, Cao, Khẩn cấp
Thời gian: Hôm nay, Tuần này, Tháng này, Khoảng tùy chỉnh
Vị trí: Theo tầng, Theo khu vực
Chỉ sự cố quá hạn
Chỉ sự cố chưa giải quyết > 24h
Áp dụng lọc
Hiển thị kết quả lọc
6b. Xuất báo cáo
Người dùng chọn "Xuất báo cáo"
Chọn định dạng: Excel hoặc PDF
Chọn nội dung: Tất cả hoặc Chỉ kết quả lọc hiện tại
Hệ thống tạo file báo cáo với:
Thông tin sự cố
Thống kê tổng hợp
Biểu đồ (nếu PDF)
Tải file về
Ngoại lệ E1: Không có sự cố nào
Điều kiện: Database chưa có sự cố hoặc lọc không có kết quả
Xử lý: Hiển thị "Không có sự cố nào" hoặc "Không tìm thấy sự cố phù
hợp với bộ lọc" E2: Quá nhiều kết quả (>1000)
Điều kiện: Kết quả tìm kiếm/lọc quá lớn
Xử lý: Hiển thị cảnh báo "Quá nhiều kết quả. Vui lòng thu hẹp bộ lọc
để xem tốt hơn"
UC-4.3: Cập nhật tình trạng sự cố

Thuộc tính Nội dung
Use Case ID UC-4.3
Use Case Name Cập nhật tình trạng xử lý sự cố
Actor Kỹ thuật viên
Mô tả Kỹ thuật viên cập nhật tiến độ xử lý sự cố
Tiền điều kiện
Kỹ thuật viên đã đăng nhập
Sự cố đã được phân công cho kỹ thuật viên
Hậu điều kiện
Trạng thái sự cố được cập nhật
Lịch sử cập nhật được ghi lại
Thông báo gửi cho Quản lý và người báo cáo
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi

Kỹ thuật viên chọn "Sự cố của tôi"
Hệ thống hiển thị danh sách sự cố được phân công
Kỹ thuật viên chọn sự cố cần cập nhật
Hệ thống hiển thị chi tiết sự cố và lịch sử cập nhật
Kỹ thuật viên chọn "Cập nhật tình trạng"
Kỹ thuật viên chọn trạng thái mới:
Đã nhận: Xác nhận đã tiếp nhận nhiệm vụ
Đang xử lý: Bắt đầu khắc phục sự cố
Tạm dừng: Chờ thiết bị/vật tư/hỗ trợ
Đã giải quyết: Hoàn thành xử lý
Không thể giải quyết: Vượt khả năng/cần chuyên gia
Kỹ thuật viên nhập mô tả chi tiết công việc đã làm
Kỹ thuật viên có thể:
Chụp ảnh trước/sau xử lý
Ghi âm giải thích (voice note)
Nhập thời gian làm việc thực tế (giờ)
Nhập chi phí phát sinh (vật tư, linh kiện)
Nếu chọn "Đã giải quyết":
9.1. Nhập giải pháp đã áp dụng (*)
9.2. Nhập khuyến nghị phòng tránh
9.3. Đánh giá độ khó (1-5 sao)
9.4. Upload ảnh sau khi sửa (khuyến nghị)
Nếu chọn "Tạm dừng":
10.1. Chọn lý do: Chờ vật tư, Chờ phê duyệt, Cần hỗ trợ thêm, Khác
10.2. Nhập thời gian dự kiến tiếp tục
10.3. Tạo yêu cầu mua vật tư (nếu cần)
Nếu chọn "Không thể giải quyết":
11.1. Nhập lý do không giải quyết được (*)
11.2. Đề xuất giải pháp thay thế
11.3. Yêu cầu chuyển cho chuyên gia/đội khác
Kỹ thuật viên xác nhận cập nhật
Hệ thống kiểm tra thông tin bắt buộc
Hệ thống lưu cập nhật:
Cập nhật trạng thái
Thêm bản ghi vào lịch sử
Ghi thời gian cập nhật
Lưu hình ảnh/file đính kèm
Hệ thống gửi thông báo:
Đến Quản lý (tất cả trường hợp)
Đến người báo cáo (nếu "Đã giải quyết")
Nếu "Đã giải quyết":
16.1. Hệ thống tính thời gian xử lý = Thời gian giải quyết - Thời
gian báo cáo
16.2. So sánh với deadline
16.3. Nếu đúng hạn: Đánh dấu "Hoàn thành đúng hạn"
16.4. Nếu trễ: Đánh dấu "Hoàn thành trễ" và ghi chú số giờ trễ
16.5. Cập nhật KPI kỹ thuật viên
Hiển thị "Cập nhật tình trạng thành công"
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 9a. Upload nhiều ảnh
Kỹ thuật viên chọn "Thêm ảnh"
Chụp ảnh mới hoặc chọn từ thư viện
Có thể thêm nhiều ảnh (tối đa 10)
Mỗi ảnh có thể ghi chú
Tiếp tục bước 10
16a. Yêu cầu xác nhận từ Quản lý
Sự cố mức độ "Cao" hoặc "Khẩn cấp"
Hệ thống yêu cầu Quản lý xác nhận trước khi đóng
Gửi thông báo "Cần xác nhận đóng sự cố SC-XXX"
Quản lý xem lại và xác nhận
Tiếp tục bước 17
Ngoại lệ E1: Thiếu thông tin bắt buộc
Điều kiện: Chọn "Đã giải quyết" nhưng không nhập giải pháp
Xử lý: Hiển thị lỗi "Vui lòng nhập giải pháp đã áp dụng" E2: Upload
ảnh thất bại
Điều kiện: Lỗi mạng, file quá lớn (>10MB)
Xử lý: Cho phép lưu cập nhật không có ảnh, đính kèm sau E3: Cập
nhật sự cố đã đóng
Điều kiện: Sự cố đã ở trạng thái "Đã đóng"
Xử lý: Hiển thị "Sự cố đã đóng. Không thể cập nhật. Liên hệ Quản lý
nếu cần mở lại"
UC-4.4: Báo cáo sự cố

Thuộc tính Nội dung
Use Case ID UC-4.4
Use Case Name Báo cáo sự cố mới
Actor Lễ tân, Buồng phòng, Kỹ thuật viên
Mô tả Báo cáo sự cố mới phát hiện trong khách sạn
Tiền điều kiện
Người dùng đã đăng nhập
Có sự cố cần báo cáo
Hậu điều kiện
Sự cố được tạo với trạng thái "Mới"
Quản lý và Kỹ thuật nhận thông báo
Sự cố khẩn cấp gửi SMS/Push ngay lập tức
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi
Người dùng chọn "Báo cáo sự cố"
Hệ thống hiển thị form
Người dùng chọn/nhập:
Loại sự cố (*): Thiết bị hỏng, Vệ sinh, An ninh, Khách phàn
nàn, Rò rỉ nước, Mất điện, Khác
Vị trí (*): Số phòng/Khu vực
Mức độ nghiêm trọng (*): Thấp, Trung bình, Cao, Khẩn cấp
Mô tả chi tiết (*)
Hình ảnh (tùy chọn)
Hệ thống kiểm tra từ khóa khẩn cấp: "cháy", "trộm", "bị thương",
"nguy hiểm"
Người dùng có thể ghi âm mô tả (voice input)
Người dùng xác nhận báo cáo
Hệ thống tạo mã sự cố (SC-YYYYMMDD-XXX)
Hệ thống lưu sự cố với trạng thái "Mới"
Hệ thống gửi thông báo đến Quản lý và nhóm Kỹ thuật
Hiển thị "Đã báo cáo sự cố - Mã: SC-XXX"
Chu trình phụ 4a. Phát hiện sự cố khẩn cấp (từ khóa)
Hệ thống phát hiện từ "cháy", "trộm", "bị thương"
Tự động đặt mức độ = "Khẩn cấp"
Hiển thị cảnh báo "SỰ CỐ KHẨN CẤP"
Yêu cầu xác nhận lại
Tiếp tục bước 6
8a. Sự cố khẩn cấp
Mức độ = Khẩn cấp
Gửi SMS + Push notification ngay lập tức
Gọi điện tự động (nếu cấu hình)
Tiếp tục bước 9
9a. Phát hiện sự cố trùng lặp
Hệ thống tìm sự cố tương tự (cùng vị trí, trong 24h)
Hiển thị "Có sự cố tương tự: SC-XXX"
Hỏi "Cập nhật sự cố cũ hay tạo mới?"
Nếu cập nhật: Chuyển sang UC-4.3
Nếu tạo mới: Tiếp tục bước 10
Ngoại lệ E1: Upload ảnh thất bại
Điều kiện: Lỗi mạng khi upload
Xử lý: Cho phép báo cáo không có ảnh, đính kèm sau E2: Vị trí
không rõ ràng
Điều kiện: Không chọn phòng hoặc khu vực
Xử lý: Yêu cầu chọn vị trí cụ thể hoặc nhập "Khu vực khác"
UC-4.5: Đóng sự cố

Thuộc tính Nội dung
Use Case ID UC-4.5
Use Case Name Đóng sự cố đã giải quyết
Actor Quản lý
Mô tả Quản lý xác nhận và đóng sự cố sau khi đã được giải quyết
Tiền điều kiện
Quản lý đã đăng nhập
Sự cố ở trạng thái "Đã giải quyết"
Khoa khoa học và kỹ thuật máy tính
Hậu điều kiện

Sự cố chuyển sang "Đã đóng"
Đánh giá kỹ thuật viên được ghi nhận
Báo cáo sự cố hoàn chỉnh được lưu
Chu trình thực thi
Quản lý xem danh sách sự cố "Đã giải quyết"
Quản lý chọn sự cố cần đóng
Hệ thống hiển thị chi tiết đầy đủ:
Thông tin ban đầu
Kỹ thuật viên xử lý
Thời gian xử lý
Giải pháp đã áp dụng
Ảnh trước/sau
Chi phí phát sinh
Quản lý xem lại kết quả xử lý
Quản lý có thể:
Yêu cầu kiểm tra lại (nếu chưa hài lòng)
Đồng ý đóng sự cố
Quản lý chọn "Đóng sự cố"
Quản lý đánh giá kỹ thuật viên:
Chất lượng xử lý (1-5 sao)
Tốc độ (1-5 sao)
Ghi chú đánh giá (tùy chọn)
Quản lý phê duyệt chi phí phát sinh (nếu có)
Quản lý xác nhận đóng
Hệ thống cập nhật:
Trạng thái = "Đã đóng"
Thời gian đóng
Đánh giá kỹ thuật viên
Chi phí được phê duyệt
Hệ thống tính toán KPI:
Thời gian xử lý trung bình
Tỷ lệ hoàn thành đúng hạn
Điểm đánh giá trung bình
Hệ thống gửi thông báo "Sự cố SC-XXX đã đóng" cho:
Kỹ thuật viên xử lý
Người báo cáo ban đầu
Hệ thống tạo báo cáo sự cố đầy đủ (PDF)
Hiển thị "Đã đóng sự cố SC-XXX"
Chu trình phụ 5a. Yêu cầu kiểm tra lại
Quản lý chọn "Yêu cầu kiểm tra lại"
Nhập lý do và yêu cầu cụ thể
Hệ thống chuyển sự cố về "Đang xử lý"
Gửi thông báo cho kỹ thuật viên
Kết thúc - không đóng sự cố
8a. Chi phí vượt ngân sách
Chi phí > Ngân sách dự kiến ban đầu 20%
Hiển thị cảnh báo "Chi phí vượt ngân sách"
Quản lý nhập lý do chấp nhận
Tiếp tục bước 9
Khoa khoa học và kỹ thuật máy tính
Ngoại lệ E1: Sự cố chưa giải quyết hoàn toàn
Điều kiện: Kiểm tra thực tế, vấn đề vẫn còn
Xử lý: Không cho đóng, yêu cầu kỹ thuật viên xử lý lại E2: Thiếu
thông tin
Điều kiện: Chưa có ảnh sau xử lý, chưa có giải pháp chi tiết
Xử lý: Yêu cầu kỹ thuật viên bổ sung thông tin trước khi đóng
4.5.1.e Module 5: Quản lý thuê xe
Hình 11: Use case diagram Module 5: Quản lý thuê xe
Thuộc tính Nội dung
Use Case ID UC-5.1
Use Case Name Quản lý đơn thuê xe (Thêm/Sửa/Xóa)
Actor Lễ tân, Quản lý
Mô tả Quản lý các đơn thuê xe (UC-5.1.1 Tạo, UC-5.1.2 Sửa, UC-5.1.3 Xóa)
Tiền điều kiện
Người dùng đã đăng nhập
Có khách hàng hoặc booking (UC-5.1.1)
Có đơn thuê xe (UC-5.1.2, UC-5.1.3)
Hậu điều kiện
Đơn thuê xe được tạo/sửa/xóa
Lịch xe được cập nhật
Email/SMS xác nhận được gửi
Khoa khoa học và kỹ thuật máy tính
Thuộc tính Nội dung (tiếp)
Chu trình thực thi UC-5.1.1: Tạo đơn thuê xe
Lễ tân chọn “Tạo đơn thuê xe”
Chọn khách hàng/booking
Nhập thông tin thuê xe
Hệ thống kiểm tra dữ liệu
Hệ thống tính giá và đặt cọc
Lễ tân xác nhận
Hệ thống tạo đơn và gửi xác nhận
UC-5.1.2: Sửa đơn thuê xe
Chọn đơn cần sửa
Cập nhật thông tin
Hệ thống tính lại giá
Xác nhận cập nhật
UC-5.1.3: Xóa đơn thuê xe
Chọn đơn cần hủy
Hệ thống tính phí hủy
Xác nhận hủy
Hoàn tiền
Ngoại lệ E1: Thời gian không hợp lệ
E2: Không thể sửa sau khi bắt đầu
UC-5.2: Xem danh sách đơn thuê xe

Thuộc tính Nội dung
Use Case ID UC-5.2
Use Case Name Xem danh sách đơn thuê xe
Actor Lễ tân, Quản lý
Mô tả Xem danh sách tất cả đơn thuê xe với bộ lọc
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách đơn thuê xe
Chu trình thực thi
Người dùng chọn "Danh sách đơn thuê xe"
Hệ thống hiển thị danh sách (20/trang):
Mã đơn
Khách hàng
Loại xe
Thời gian bắt đầu - kết thúc
Có tài xế: Có/Không
Trạng thái: Đã đặt, Đang sử dụng, Đã trả, Đã hủy
Tổng tiền
Còn nợ
Người dùng có thể:
Lọc theo: Trạng thái, Loại xe, Thời gian, Có tài xế
Tìm kiếm theo: Mã đơn, Tên khách, SĐT
Sắp xếp theo: Thời gian, Tổng tiền, Trạng thái
Xem chi tiết đơn
Chu trình phụ 3a. Lọc theo thời gian
Chọn "Lọc theo thời gian"
Chọn: Hôm nay, Tuần này, Tháng này, Tùy chỉnh
Hiển thị kết quả
Ngoại lệ E1: Chưa có đơn
Điều kiện: Database chưa có đơn thuê xe
Xử lý: Hiển thị "Chưa có đơn thuê xe nào"
UC-5.3: Xem theo thời gian lựa chọn

Khoa khoa học và kỹ thuật máy tính
Thuộc tính Nội dung
Use Case ID UC-5.3
Use Case Name Xem lịch thuê xe theo thời gian
Actor Lễ tân, Quản lý
Mô tả Xem lịch thuê xe dạng timeline/calendar để quản lý xe hiệu quả
Tiền điều kiện

Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị lịch thuê xe theo thời gian
Chu trình thực thi
Người dùng chọn "Lịch thuê xe"
Hệ thống hiển thị giao diện lịch với 2 chế độ xem:
Chế độ Calendar (Lịch): Hiển thị theo ngày/tuần/tháng
Chế độ Timeline (Dòng thời gian): Hiển thị từng xe theo
dòng thời gian
Nếu chọn chế độ Calendar:
3.1. Hiển thị lịch dạng tháng/tuần/ngày
3.2. Mỗi ngày hiển thị số đơn thuê xe
3.3. Click vào ngày → Xem chi tiết các đơn trong ngày
3.4. Các đơn được mã màu theo trạng thái:
Xanh lá: Đang sử dụng
Vàng: Đã đặt (chưa bắt đầu)
Xám: Đã trả
Đỏ: Đã hủy
Nếu chọn chế độ Timeline:
4.1. Hiển thị danh sách xe theo hàng dọc (trục Y)
4.2. Trục X là thời gian (có thể chọn: 7 ngày, 30 ngày, 90 ngày)
4.3. Mỗi đơn thuê hiển thị dạng thanh ngang với:
Độ dài = Thời gian thuê
Màu sắc = Trạng thái
Tooltip khi hover: Khách hàng, Loại xe, Tài xế
4.4. Dễ dàng nhận biết xe nào đang rảnh
Người dùng có thể:
Chuyển đổi giữa 2 chế độ xem
Lọc theo loại xe
Lọc theo trạng thái
Di chuyển qua lại thời gian (prev/next)
Zoom in/out timeline
Click vào đơn để xem chi tiết
Người dùng chọn đơn để xem chi tiết
Hệ thống hiển thị popup với thông tin đầy đủ
Chu trình phụ 6a. Tạo đơn mới từ lịch
Người dùng click vào khoảng trống trên timeline/calendar
Hệ thống tự động điền:
Loại xe (nếu click trên timeline xe cụ thể)
Thời gian bắt đầu (ngày được chọn)
Chuyển sang UC-5.1.1 (Tạo đơn) với thông tin đã điền sẵn
6b. Kéo thả để sửa thời gian
Người dùng kéo đầu/đuôi thanh thời gian
Hệ thống kiểm tra xe có rảnh trong thời gian mới
Nếu rảnh: Cập nhật luôn
Nếu bận: Hiển thị "Xe đã được đặt trong thời gian này"
Ngoại lệ E1: Quá nhiều đơn hiển thị
Điều kiện: >100 đơn trong khoảng thời gian
Xử lý: Hiển thị cảnh báo "Quá nhiều đơn. Thu hẹp khoảng thời gian
để xem rõ hơn"
Khoa khoa học và kỹ thuật máy tính
UC-5.4: Nhập thông tin tin thuê xe

Thuộc tính Nội dung
Use Case ID UC-5.4
Use Case Name Nhập thông tin tin thuê xe (Tạo thông tin tin giá)
Actor Quản lý
Mô tả Quản lý nhập/cập nhật thông tin và giá thuê cho từng loại xe
Tiền điều kiện
Quản lý đã đăng nhập
Hậu điều kiện
Thông tin loại xe được tạo/cập nhật
Giá thuê mới được áp dụng cho đơn mới
Chu trình thực thi
Quản lý chọn "Quản lý loại xe"
Hệ thống hiển thị danh sách loại xe hiện có:
Tên loại xe
Số chỗ
Giá thuê/ngày
Phí tài xế/ngày
Số xe khả dụng
Quản lý chọn "Thêm loại xe mới" hoặc "Sửa loại xe có sẵn"
Nếu thêm mới:
4.1. Nhập thông tin loại xe:
Tên loại xe (*): VD: Sedan 4 chỗ, SUV 7 chỗ, xe máy
Số chỗ (*): 4, 7, 16, xe máy
Giá thuê cơ bản/ngày (*): VNĐ
Phí tài xế/ngày: VNĐ (mặc định 500,000)
Mô tả: Thông tin chi tiết
Hình ảnh xe
4.2. Nhập chính sách giảm giá theo thời gian:
Thuê 7-14 ngày: -X%
Thuê 15-30 ngày: -Y%
Thuê >30 ngày: -Z%
4.3. Xác nhận thêm
4.4. Hệ thống lưu loại xe mới
4.5. Hiển thị "Thêm loại xe thành công"
Nếu sửa:
5.1. Chọn loại xe cần sửa
5.2. Hiển thị form với dữ liệu hiện tại
5.3. Sửa thông tin (giá, phí, chính sách)
5.4. Xác nhận cập nhật
5.5. Hệ thống ghi log thay đổi (đặc biệt là thay đổi giá)
5.6. Hệ thống lưu thông tin mới
5.7. Cảnh báo "Giá mới chỉ áp dụng cho đơn thuê mới, không ảnh
hưởng đơn đã tạo"
5.8. Hiển thị "Cập nhật thành công"
Chu trình phụ 5a. Thay đổi giá > 20%
Giá mới khác giá cũ > 20%
Hiển thị cảnh báo "Thay đổi giá lớn"
Yêu cầu xác nhận lại
Ngoại lệ E1: Giá không hợp lệ
Điều kiện: Giá ≤ 0
Xử lý: Hiển thị "Giá phải lớn hơn 0" E2: Tên loại xe đã tồn tại
Điều kiện: Tên trùng
Xử lý: Hiển thị "Loại xe XXX đã tồn tại"
UC-5.5: Tính toán lại giá thuê

Khoa khoa học và kỹ thuật máy tính
Thuộc tính Nội dung
Use Case ID UC-5.5
Use Case Name Tính toán lại giá thuê xe
Actor Hệ thống (tự động)
Mô tả Hệ thống tự động tính lại giá khi có thay đổi thông tin đơn thuê xe
Tiền điều kiện

Có thay đổi: Thời gian, Loại xe, Tài xế, Khoảng cách
Hậu điều kiện
Giá mới được tính toán và hiển thị
Giảm giá (nếu có) được áp dụng tự động
Chu trình thực thi
Hệ thống nhận sự kiện thay đổi thông tin đơn
Hệ thống lấy thông tin:
Loại xe → Giá cơ bản/ngày
Thời gian bắt đầu - kết thúc → Tính số ngày
Có tài xế hay không
Khoảng cách dự kiến (km)
Hệ thống tính:
Số ngày = ⌈(Thời gian kết thúc - Thời gian bắt đầu) / 24⌉
Giá xe = Giá cơ bản × Số ngày
Phí tài xế = (Có tài xế? Phí tài xế/ngày × Số ngày : 0)
Tổng trước giảm giá = Giá xe + Phí tài xế
Hệ thống kiểm tra điều kiện giảm giá:
Nếu 7 ≤ Số ngày ≤ 14: Giảm 10%
Nếu 15 ≤ Số ngày ≤ 30: Giảm 15%
Nếu Số ngày > 30: Giảm 20%
Hệ thống kiểm tra khách VIP:
Nếu VIP: Miễn phí tài xế ngày đầu, Giảm thêm 5% tổng
Hệ thống tính:
Tổng giảm giá = Tổng trước giảm × % giảm
Tổng tiền = Tổng trước giảm - Tổng giảm giá
Tiền đặt cọc = Tổng tiền × 30%
Hệ thống hiển thị bảng tính giá chi tiết:
Giá thuê xe: XXX VNĐ (× Y ngày)
Phí tài xế: XXX VNĐ (nếu có)
Giảm giá: -XXX VNĐ (nếu có)
Ưu đãi VIP: -XXX VNĐ (nếu có)
Tổng cộng: XXX VNĐ
Đặt cọc (30%): XXX VNĐ
Chu trình phụ 5a. Áp dụng mã giảm giá/Voucher

Người dùng nhập mã voucher
Hệ thống kiểm tra: Voucher hợp lệ, Chưa hết hạn, Đáp ứng điều kiện
Nếu hợp lệ:
Lấy % giảm hoặc số tiền giảm
Áp dụng vào tổng tiền
Hiển thị "Đã áp dụng voucher XXX: Giảm YYY VNĐ"
Nếu không hợp lệ: Hiển thị lý do
Tính lại tổng tiền sau voucher
Ngoại lệ E1: Thiếu thông tin để tính
Điều kiện: Chưa chọn loại xe hoặc chưa nhập thời gian
Xử lý: Hiển thị "Vui lòng nhập đầy đủ thông tin để tính giá" E2: Thời
gian không hợp lý
Điều kiện: Thời gian kết thúc ≤ Thời gian bắt đầu
Xử lý: Hiển thị "Thời gian không hợp lệ", không tính giá
Khoa khoa học và kỹ thuật máy tính
4.5.1.f Module 6: Quản lý dịch vụ
Hình 12: Use case diagram Module 6: Quản lý dịch vụ
UC-6.1: Xem danh sách dịch vụ
Thuộc tính Nội dung
Use Case ID UC-6.1
Use Case Name Xem danh sách dịch vụ
Actor Lễ tân, Quản lý
Mô tả Xem danh sách các dịch vụ có sẵn
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách dịch vụ
Chu trình thực thi
Người dùng chọn "Danh sách dịch vụ"
Hệ thống hiển thị danh sách: Tên, Giá, Đơn vị, Mô tả, Trạng thái
Người dùng có thể lọc, tìm kiếm, xem chi tiết
Chu trình phụ Không có
Ngoại lệ E1: Chưa có dịch vụ
Điều kiện: Database chưa có dịch vụ
Xử lý: Hiển thị "Chưa có dịch vụ"
UC-6.2: Tạo yêu cầu dịch vụ
Thuộc tính Nội dung
Use Case ID UC-6.2
Use Case Name Tạo yêu cầu dịch vụ
Actor Lễ tân
Mô tả Tạo yêu cầu dịch vụ cho khách đang lưu trú
Khoa khoa học và kỹ thuật máy tính
Tiền điều kiện
Lễ tân đã đăng nhập
Có khách đang check-in
Hậu điều kiện
Yêu cầu được tạo với trạng thái "Chờ xử lý"
Chi phí thêm vào hóa đơn
Chu trình thực thi
Lễ tân chọn "Tạo yêu cầu dịch vụ"
Lễ tân chọn booking/phòng
Lễ tân chọn dịch vụ (Đưa đón sân bay, Room service, Spa, Tour, Thuê
xe đạp, Giặt ủi)
Lễ tân nhập số lượng/thời gian
Hệ thống tính giá
Lễ tân xác nhận
Hệ thống tạo mã (DV-YYYYMMDD-XXX)
Hệ thống lưu yêu cầu
Hệ thống thêm chi phí vào hóa đơn
Hệ thống gửi thông báo bộ phận liên quan
Hiển thị "Tạo yêu cầu thành công - Mã: DV-XXX"
Chu trình phụ 3a. Dịch vụ Room Service
Hiển thị menu đồ ăn/nước
Lễ tân chọn món và số lượng
Gửi đến bếp
Ngoại lệ E1: Phòng đã check-out
Điều kiện: Booking đã check-out
Xử lý: Hiển thị "Không thể tạo yêu cầu"
UC-6.3: Cập nhật trạng thái dịch vụ

Thuộc tính Nội dung
Use Case ID UC-6.3
Use Case Name Cập nhật trạng thái dịch vụ
Actor Lễ tân
Mô tả Cập nhật tiến độ thực hiện yêu cầu dịch vụ
Tiền điều kiện
Lễ tân đã đăng nhập
Có yêu cầu dịch vụ
Hậu điều kiện
Trạng thái được cập nhật
Thông báo gửi cho khách (nếu hoàn thành)
Chu trình thực thi
Lễ tân xem danh sách yêu cầu
Lễ tân chọn yêu cầu cần cập nhật
Lễ tân chọn trạng thái mới (Chờ xử lý, Đang thực hiện, Hoàn thành,
Đã hủy)
Lễ tân nhập ghi chú
Lễ tân xác nhận
Hệ thống cập nhật trạng thái
Hệ thống ghi log
Hiển thị "Cập nhật thành công"
Chu trình phụ 3a. Chọn "Hoàn thành"
Gửi thông báo cho khách
Ghi thời gian hoàn thành
Ngoại lệ E1: Không thể hủy sau khi hoàn thành
Điều kiện: Trạng thái = "Hoàn thành"
Xử lý: Hiển thị "Không thể hủy dịch vụ đã hoàn thành"
Khoa khoa học và kỹ thuật máy tính
UC-6.4: Thêm dịch vụ mới

Thuộc tính Nội dung
Use Case ID UC-6.4
Use Case Name Thêm dịch vụ mới vào danh mục
Actor Quản lý
Mô tả Thêm dịch vụ mới vào danh sách
Tiền điều kiện
Quản lý đã đăng nhập
Hậu điều kiện
Dịch vụ mới được tạo
Chu trình thực thi
Quản lý chọn "Thêm dịch vụ"
Hệ thống hiển thị form
Quản lý nhập: Tên (), Loại (), Giá (), Đơn vị (), Mô tả, Thời
gian dự kiến, Hình ảnh
Quản lý xác nhận
Hệ thống lưu dịch vụ
Hiển thị "Thêm dịch vụ thành công"
Chu trình phụ Không có
Ngoại lệ E1: Thiếu thông tin
Điều kiện: Thiếu trường (*)
Xử lý: Hiển thị lỗi
UC-6.5: Xóa dịch vụ

Thuộc tính Nội dung
Use Case ID UC-6.5
Use Case Name Xóa dịch vụ khỏi danh mục
Actor Quản lý
Mô tả Xóa hoặc tạm ngưng dịch vụ
Tiền điều kiện
Quản lý đã đăng nhập
Hậu điều kiện
Dịch vụ chuyển sang "Tạm ngưng" hoặc bị xóa
Chu trình thực thi
Quản lý chọn dịch vụ cần xóa
Quản lý chọn "Xóa dịch vụ"
Hệ thống hiển thị 2 lựa chọn: Tạm ngưng (Soft delete), Xóa vĩnh viễn
(Hard delete)
Quản lý chọn
Quản lý xác nhận
Hệ thống cập nhật trạng thái hoặc xóa
Hiển thị "Đã xóa/tạm ngưng dịch vụ"
Chu trình phụ Không có
Ngoại lệ E1: Có yêu cầu đang xử lý
Điều kiện: ∃ yêu cầu chưa hoàn thành
Xử lý: Hiển thị "Có X yêu cầu đang xử lý. Khuyến nghị Tạm ngưng"
Khoa khoa học và kỹ thuật máy tính
4.5.1.g Module 7: Quản lý giặt ủi
Hình 13: Use case diagram Module 7: Quản lý giặt ủi
UC-7.1: Quản lý giá
Thuộc tính Nội dung
Use Case ID UC-7.1
Use Case Name Quản lý giá dịch vụ giặt ủi
Actor Quản lý
Mô tả Quản lý cập nhật bảng giá cho các loại đồ và dịch vụ giặt ủi
Tiền điều kiện
Quản lý đã đăng nhập
Hậu điều kiện
Bảng giá được cập nhật
Giá mới áp dụng cho đơn mới
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi
Quản lý chọn "Quản lý giá giặt ủi"
Hệ thống hiển thị bảng giá hiện tại:
Theo loại đồ:
Áo sơ mi: 15,000 VNĐ
Áo thun: 10,000 VNĐ
Quần tây: 15,000 VNĐ
Quần jean: 20,000 VNĐ
Váy: 20,000 VNĐ
Đầm: 25,000 VNĐ
Áo vest: 30,000 VNĐ
Chăn/ga/gối: 50,000 VNĐ
Rèm: 100,000 VNĐ
Theo loại dịch vụ (phụ phí):
Giặt thường: 0%
Giặt khô: +50%
Ủi: +30%
Giặt + Ủi: +40%
Giặt nhanh (24h): +30%
Giặt gấp (12h): +50%
Giặt siêu gấp (6h): +100%
Giá đặc biệt:
Giặt theo kg: 30,000 VNĐ/kg (cho >20 món)
Xử lý vết bẩn khó: +20,000 VNĐ/món
Quản lý chọn loại giá cần sửa
Quản lý nhập giá mới
Hệ thống kiểm tra giá hợp lệ (> 0)
Quản lý xác nhận cập nhật
Hệ thống ghi log thay đổi giá
Hệ thống lưu giá mới
Hiển thị "Cập nhật giá thành công. Áp dụng cho đơn mới"
Chu trình phụ 5a. Thay đổi giá > 20%
Giá mới khác giá cũ > 20%
Hệ thống cảnh báo "Thay đổi giá lớn"
Yêu cầu nhập lý do thay đổi
Yêu cầu xác nhận lại
Tiếp tục bước 6
Ngoại lệ E1: Giá không hợp lệ
Điều kiện: Giá ≤ 0
Xử lý: Hiển thị "Giá phải lớn hơn 0" E2: Có đơn đang tính giá
Điều kiện: Đang có người tạo đơn với giá cũ
Xử lý: Cảnh báo "Có X đơn đang xử lý. Vẫn cập nhật?"
UC-7.2: Quản lý đơn giặt ủi

Thuộc tính Nội dung
Use Case ID UC-7.2
Use Case Name Quản lý đơn giặt ủi (Tạo/Sửa/Xóa)
Actor Lễ tân, Quản lý
Mô tả Quản lý các đơn giặt ủi (Tạo, Sửa, Xóa)
Tiền điều kiện
Người dùng đã đăng nhập
Có bảng giá dịch vụ (cho UC-7.2.1)
Khoa khoa học và kỹ thuật máy tính
Hậu điều kiện
Đơn giặt được tạo/sửa/xóa
Tổng tiền được tính/tính lại
Chu trình thực thi UC-7.2.1: Tạo đơn («extend»)
Người dùng chọn "Tạo đơn giặt ủi"
Người dùng chọn khách hàng/phòng
Gọi UC-7.2.4: Nhập thông tin («include»)
Hệ thống tạo mã đơn (GL-YYYYMMDD-XXX)
Hệ thống lưu đơn với trạng thái "Đã tiếp nhận"
Hệ thống in phiếu tiếp nhận 2 bản
Hiển thị "Tạo đơn thành công - Mã: GL-XXX"
UC-7.2.2: Xóa đơn («extend»)
Người dùng chọn đơn cần xóa
Người dùng chọn "Xóa đơn"
Hệ thống kiểm tra: Chỉ xóa nếu trạng thái = "Đã tiếp nhận"
Người dùng nhập lý do xóa
Người dùng xác nhận
Hệ thống cập nhật trạng thái = "Đã hủy"
Hiển thị "Đã hủy đơn GL-XXX"
UC-7.2.3: Sửa đơn («extend»)
Người dùng chọn đơn cần sửa
Người dùng chọn "Sửa đơn"
Hệ thống kiểm tra: Chỉ sửa nếu chưa hoàn thành
Người dùng sửa thông tin (danh sách đồ, dịch vụ, thời gian)
Gọi UC-7.2.5: Tính toán lại giá («include»)
Người dùng xác nhận
Hệ thống cập nhật đơn
Hiển thị "Cập nhật đơn thành công"
Chu trình phụ Không có (các chu trình con đã được tách thành UC-7.2.4 và UC-7.2.5)
Ngoại lệ E1 (Xóa): Đơn đã hoàn thành
Điều kiện: Trạng thái = "Đã hoàn thành"
Xử lý: Hiển thị "Không thể xóa đơn đã hoàn thành" E2 (Sửa): Đơn
đã thanh toán
Điều kiện: Đã có thanh toán
Xử lý: Hiển thị "Không thể sửa đơn đã thanh toán"
UC-7.2.4: Nhập thông tin («include» UC-7.2.1)

Thuộc tính Nội dung
Use Case ID UC-7.2.4
Use Case Name Nhập thông tin đơn giặt ủi
Actor Lễ tân, Quản lý
Mô tả Nhập chi tiết đồ giặt, kiểm tra tình trạng, tính giá (include từ UC-7.2.1)
Tiền điều kiện
Đang trong quy trình tạo đơn (UC-7.2.1)
Đã chọn khách hàng/phòng
Hậu điều kiện
Thông tin đơn được nhập đầy đủ
Tổng tiền được tính
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi
Hệ thống hiển thị form nhập đồ giặt
Người dùng kiểm đếm quần áo cùng khách:
Đếm số lượng từng loại
Kiểm tra tình trạng (vết bẩn, rách, phai màu)
Chụp ảnh nếu có vấn đề
Người dùng nhập vào hệ thống:
Loại đồ (*): Áo sơ mi, Áo thun, Quần tây, Quần jean, Váy, Đầm,
Áo vest, Chăn/ga/gối, Rèm
Số lượng (*) từng loại
Dịch vụ (*): Giặt thường, Giặt khô, Ủi, Giặt + Ủi, Giặt nhanh
Tình trạng: Vết bẩn khó, Rách, Phai màu, Nút bung, Bình
thường
Ghi chú (nếu có)
Người dùng hỏi khách thời gian nhận:
Tiêu chuẩn (48h): Miễn phí
Nhanh (24h): +30%
Gấp (12h): +50%
Siêu gấp (6h): +100%
Hệ thống tính giá tự động:
Giá cơ bản =
P
(Số lượng × Đơn giá loại đồ)
Phụ phí dịch vụ = Giá cơ bản × % phụ phí
Phụ phí vết bẩn = Số món khó × 20,000
Phụ phí thời gian = Tổng × % thời gian
Giảm giá (>10 món): -10%
VIP: -5%
Tổng tiền = Tổng các khoản
Hệ thống hiển thị tổng tiền
Hệ thống tính thời gian hoàn thành = Hiện tại + Thời gian đã chọn
Trả về thông tin cho UC-7.2.1
Chu trình phụ 2a. Phát hiện vết bẩn khó/hư hỏng
Phát hiện vết đặc biệt (mực, rượu, son, máu)
Chụp ảnh chi tiết
Hỏi "Xử lý vết bẩn khó (+20k/món)?"
Nếu đồng ý: Đánh dấu, tính phụ phí
Yêu cầu khách ký xác nhận
Tiếp tục bước 3
5a. Số lượng lớn (>20 món)
Đề xuất "Giặt theo kg (rẻ hơn)"
Cân tổng khối lượng
Tính giá = Kg × 30,000 VNĐ/kg
Tiếp tục bước 6
Ngoại lệ E1: Quần áo quá bẩn/có mùi
Điều kiện: Không đủ điều kiện giặt
Xử lý: Từ chối tiếp nhận, giải thích lý do
UC-7.2.5: Tính toán lại giá («include» UC-7.2.3)

Thuộc tính Nội dung
Use Case ID UC-7.2.5
Use Case Name Tính toán lại giá đơn giặt ủi
Actor Hệ thống (tự động)
Mô tả Tính lại giá khi sửa đơn (include từ UC-7.2.3)
Khoa khoa học và kỹ thuật máy tính
Tiền điều kiện
Đang trong quy trình sửa đơn (UC-7.2.3)
Có thay đổi: Số lượng, Loại đồ, Dịch vụ, hoặc Thời gian
Hậu điều kiện
Giá mới được tính
Chênh lệch được hiển thị
Chu trình thực thi
Hệ thống nhận thông tin thay đổi
Hệ thống tính lại giá theo công thức:
Giá cơ bản =
P
(Số lượng × Đơn giá loại đồ)
Phụ phí dịch vụ = Giá cơ bản × % phụ phí
Phụ phí vết bẩn = Số món khó × 20,000
Phụ phí thời gian = Tổng × % thời gian
Giảm giá (>10 món): -10%
VIP: -5%
Tổng tiền mới
Hệ thống tính chênh lệch = Tổng mới - Tổng cũ
Hệ thống hiển thị:
Tổng tiền cũ: XXX VNĐ
Tổng tiền mới: YYY VNĐ
Chênh lệch: ZZZ VNĐ (+/-)
Trả về giá mới cho UC-7.2.3
Chu trình phụ 3a. Giá tăng > 30%
Chênh lệch > 30%
Cảnh báo "Giá tăng đáng kể"
Yêu cầu xác nhận lại
Ngoại lệ Không có
UC-7.3: Xem danh sách đơn

Thuộc tính Nội dung
Use Case ID UC-7.3
Use Case Name Xem danh sách đơn giặt ủi
Actor Lễ tân, Quản lý
Mô tả Xem danh sách tất cả đơn giặt ủi với bộ lọc
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách đơn giặt
Chu trình thực thi
Người dùng chọn "Danh sách đơn giặt ủi"
Hệ thống hiển thị danh sách (20/trang):
Mã đơn
Khách hàng/Phòng
Ngày tiếp nhận
Thời gian hoàn thành dự kiến
Trạng thái: Đã tiếp nhận, Đang giặt, Đã hoàn thành, Đã giao,
Đã hủy
Tổng số món
Tổng tiền
Đã thanh toán
Còn nợ
Người dùng có thể:
Lọc theo: Trạng thái, Khách hàng, Thời gian
Tìm kiếm theo: Mã đơn, Tên khách, SĐT, Số phòng
Sắp xếp theo: Thời gian, Tổng tiền
Xem chi tiết đơn
Gọi UC-7.3.1: Xem theo thời gian lựa chọn («extend»)
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ Không có (UC-7.3.1 là extend riêng)
Ngoại lệ E1: Không có đơn
Điều kiện: Database chưa có đơn
Xử lý: Hiển thị "Chưa có đơn giặt ủi nào"
UC-7.3.1: Xem theo thời gian lựa chọn («extend» UC-7.3)

Thuộc tính Nội dung
Use Case ID UC-7.3.1
Use Case Name Xem đơn giặt theo thời gian lựa chọn
Actor Lễ tân, Quản lý
Mô tả Lọc và xem đơn giặt theo khoảng thời gian (extend UC-7.3)
Tiền điều kiện
Người dùng đang ở màn hình UC-7.3
Hậu điều kiện
Danh sách đơn được lọc theo thời gian
Chu trình thực thi
Người dùng chọn "Xem theo thời gian"
Hệ thống hiển thị các tùy chọn:
Hôm nay
Hôm qua
7 ngày qua
Tháng này
Tháng trước
Tùy chỉnh (từ ngày - đến ngày)
Người dùng chọn khoảng thời gian
Nếu chọn "Tùy chỉnh":
4.1. Hiển thị date picker
4.2. Người dùng chọn ngày bắt đầu
4.3. Người dùng chọn ngày kết thúc
4.4. Kiểm tra: Ngày kết thúc ≥ Ngày bắt đầu
Người dùng xác nhận
Hệ thống lọc đơn theo khoảng thời gian
Hệ thống hiển thị:
Danh sách đơn đã lọc
Tổng số đơn
Tổng doanh thu trong khoảng thời gian
Biểu đồ theo ngày/tuần
Chu trình phụ 7a. So sánh với kỳ trước
Người dùng chọn "So sánh với kỳ trước"
Hệ thống tính khoảng tương ứng
Hiển thị 2 cột so sánh
Tính chênh lệch (%)
Ngoại lệ E1: Ngày không hợp lệ
Điều kiện: Ngày kết thúc < Ngày bắt đầu
Xử lý: Hiển thị lỗi, yêu cầu chọn lại
UC-7.4: Tiếp nhận

Thuộc tính Nội dung
Use Case ID UC-7.4
Use Case Name Tiếp nhận quần áo từ khách
Actor Giặt ủi
Mô tả Nhân viên giặt ủi tiếp nhận quần áo và cập nhật trạng thái đơn
Khoa khoa học và kỹ thuật máy tính
Tiền điều kiện
Nhân viên giặt ủi đã đăng nhập
Có đơn ở trạng thái "Đã tiếp nhận" (từ Lễ tân)
Quần áo đã chuyển đến khu giặt ủi
Hậu điều kiện
Trạng thái đơn = "Đang giặt"
Quần áo được xếp vào hàng đợi giặt
Chu trình thực thi
Nhân viên giặt ủi chọn "Tiếp nhận đơn"
Hệ thống hiển thị danh sách đơn "Đã tiếp nhận" chưa xử lý
Nhân viên chọn đơn cần tiếp nhận
Hệ thống hiển thị chi tiết:
Mã đơn
Khách hàng/Phòng
Danh sách đồ (loại, số lượng, tình trạng)
Dịch vụ
Thời gian hoàn thành dự kiến
Ghi chú đặc biệt
Nhân viên kiểm tra quần áo thực tế:
Đối chiếu với phiếu
Kiểm tra lại tình trạng
Phân loại theo màu, chất liệu
Nhân viên chọn "Xác nhận tiếp nhận"
Gọi UC-7.4.1: Cập nhật trạng thái đơn giặt («include»)
Hệ thống xếp đơn vào hàng đợi giặt theo độ ưu tiên:
Ưu tiên 1: Siêu gấp (6h)
Ưu tiên 2: Gấp (12h)
Ưu tiên 3: Nhanh (24h)
Ưu tiên 4: Tiêu chuẩn (48h)
Hiển thị "Đã tiếp nhận đơn GL-XXX. Vị trí hàng đợi: X"
Chu trình phụ 5a. Phát hiện sai lệch
Số lượng/tình trạng khác phiếu
Chụp ảnh ghi nhận
Ghi chú chi tiết sai lệch
Gửi thông báo Lễ tân
Tiếp tục bước 6
5b. Quần áo không đủ điều kiện giặt
Phát hiện quá bẩn/hỏng nghiêm trọng
Từ chối tiếp nhận
Liên hệ Lễ tân để trả lại khách
Cập nhật trạng thái = "Đã hủy"
Kết thúc
Ngoại lệ E1: Quần áo chưa chuyển đến
Điều kiện: Phiếu có nhưng không thấy quần áo
Xử lý: Liên hệ Lễ tân, không cho tiếp nhận
UC-7.4.1: Cập nhật trạng thái đơn giặt («include» UC-7.4)

Thuộc tính Nội dung
Use Case ID UC-7.4.1
Use Case Name Cập nhật trạng thái đơn giặt
Actor Giặt ủi, Hệ thống
Mô tả Cập nhật trạng thái tiến độ xử lý đơn giặt (include từ UC-7.4)
Tiền điều kiện
Có đơn giặt đang xử lý
Khoa khoa học và kỹ thuật máy tính
Hậu điều kiện

Trạng thái được cập nhật
Thông báo gửi cho Lễ tân (nếu hoàn thành)
Chu trình thực thi

Hệ thống nhận lệnh cập nhật trạng thái
Hệ thống xác định trạng thái mới:
Đang giặt: Bắt đầu giặt
Đang ủi: Đã giặt xong, đang ủi
Đã hoàn thành: Đã giặt + ủi xong
Đã giao: Đã trả lại khách
Đã hủy: Hủy đơn
Hệ thống cập nhật trạng thái
Hệ thống ghi thời gian cập nhật
Hệ thống ghi log
Nếu trạng thái = "Đã hoàn thành":
6.1. Tính thời gian xử lý thực tế
6.2. So sánh với thời gian dự kiến
6.3. Nếu trễ: Ghi nhận và cảnh báo
6.4. Nếu đúng hạn: Tăng điểm KPI
6.5. Gửi thông báo "Đơn GL-XXX đã sẵn sàng" cho Lễ tân
Hiển thị "Cập nhật trạng thái thành công"
Chu trình phụ 6.3a. Hoàn thành trước hạn
Thời gian thực tế < Dự kiến
Tính thời gian sớm
Tăng điểm thưởng KPI
Ghi nhận "Hoàn thành sớm"
Ngoại lệ E1: Trạng thái không hợp lệ

Điều kiện: Chuyển từ "Đã giao" về "Đang giặt"
Xử lý: Không cho phép, hiển thị "Trạng thái không hợp lệ"
Khoa khoa học và kỹ thuật máy tính
4.5.1.h Module 8: Quản lý trạng thái phòng
Hình 14: Use case diagram Module 8: Quản lý trạng thái phòng
UC-8.1: Xem danh sách phòng
Thuộc tính Nội dung
Use Case ID UC-8.1
Use Case Name Xem danh sách phòng
Actor Lễ tân, Buồng phòng
Mô tả Xem danh sách tất cả phòng với thông tin trạng thái và minibar
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách phòng
Có thể xem chi tiết minibar hoặc trạng thái
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi

Người dùng chọn "Danh sách phòng"
Hệ thống hiển thị dashboard tổng quan:
Tổng số phòng
Phòng trống (Sẵn sàng)
Phòng đang sử dụng
Phòng đang dọn
Phòng bảo trì
Biểu đồ theo trạng thái
Hệ thống hiển thị danh sách phòng theo tầng:
Số phòng
Loại phòng (Standard/Deluxe/Suite/VIP)
Trạng thái: Sẵn sàng, Đang sử dụng, Đang dọn, Bảo trì, Không
khả dụng
Khách đang ở (nếu có)
Thời gian check-in (nếu đang sử dụng)
Thời gian check-out dự kiến
Buồng phòng phụ trách
Mức độ ưu tiên dọn (Cao/Trung bình/Thấp)
Hệ thống hiển thị màu sắc theo trạng thái:
Xanh lá: Sẵn sàng
Xanh dương: Đang sử dụng
Cam: Đang dọn
Đỏ: Bảo trì
Xám: Không khả dụng
Người dùng có thể:
Lọc theo: Tầng, Loại phòng, Trạng thái, Buồng phòng
Tìm kiếm theo: Số phòng, Tên khách
Sắp xếp theo: Số phòng, Trạng thái, Ưu tiên
Chuyển chế độ xem: Danh sách/Lưới/Sơ đồ tầng
Gọi UC-8.1.1: Xem thông tin minibar («extend»)
Gọi UC-8.1.2: Xem trạng thái phòng («extend»)
Người dùng chọn phòng để xem chi tiết
Hệ thống hiển thị thông tin đầy đủ:
Thông tin cơ bản
Lịch sử trạng thái
Lịch sử booking
Thông tin minibar
Ghi chú dọn phòng
Sự cố (nếu có)
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 6a. Chuyển chế độ xem Lưới
Người dùng chọn "Xem dạng lưới"
Hệ thống hiển thị phòng dạng ô vuông
Mỗi ô hiển thị: Số phòng, Trạng thái (màu), Icon loại phòng
Click vào ô để xem chi tiết
6b. Chuyển chế độ Sơ đồ tầng
Người dùng chọn "Sơ đồ tầng"
Chọn tầng muốn xem
Hệ thống hiển thị layout thực tế của tầng
Phòng hiển thị đúng vị trí thực tế
Màu sắc theo trạng thái
6c. Lọc phòng cần dọn khẩn cấp
Người dùng chọn "Phòng cần dọn gấp"
Hệ thống lọc:
Phòng có khách check-in trong 2h tới
Phòng khách vừa check-out (trong 30 phút)
Phòng có yêu cầu dọn từ khách
Sắp xếp theo thứ tự ưu tiên
Hiển thị countdown thời gian
Ngoại lệ E1: Không có phòng
Điều kiện: Database chưa có phòng (không thể xảy ra trong thực tế)
Xử lý: Hiển thị "Chưa có phòng nào trong hệ thống"
UC-8.1.1: Xem thông tin minibar của phòng («extend» UC-8.1)

Thuộc tính Nội dung
Use Case ID UC-8.1.1
Use Case Name Xem thông tin minibar của phòng
Actor Lễ tân, Buồng phòng
Mô tả Xem chi tiết hàng hóa trong minibar của phòng (extend UC-8.1)
Tiền điều kiện
Người dùng đang ở màn hình UC-8.1
Đã chọn 1 phòng cụ thể
Hậu điều kiện
Hiển thị thông tin minibar chi tiết
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi
Người dùng chọn "Xem minibar" của phòng
Hệ thống hiển thị thông tin minibar:
Số phòng
Thời gian cập nhật minibar lần cuối
Người cập nhật
Trạng thái: Đầy đủ, Thiếu hàng, Cần bổ sung
Hệ thống hiển thị danh sách hàng hóa trong minibar:
Tên mặt hàng
Loại: Nước ngọt, Bia, Rượu, Snack, Nước suối, Khác
Số lượng hiện tại
Số lượng chuẩn (ban đầu)
Giá bán
Hạn sử dụng (nếu có)
Trạng thái: Đủ, Thiếu, Hết, Sắp hết hạn
Hệ thống tính tổng hợp:
Tổng giá trị minibar hiện tại
Số mặt hàng thiếu
Số mặt hàng sắp hết hạn (< 7 ngày)
Người dùng có thể:
Xem lịch sử tiêu thụ minibar
In báo cáo minibar
Đề xuất bổ sung hàng (nếu là Buồng phòng)
Chu trình phụ 5a. Xem lịch sử tiêu thụ
Người dùng chọn "Lịch sử tiêu thụ"
Hệ thống hiển thị danh sách:
Thời gian
Mặt hàng đã dùng
Số lượng
Giá
Khách hàng/Booking
Tính tổng tiền tiêu thụ
4a. Cảnh báo hàng sắp hết hạn
Phát hiện hàng hết hạn < 7 ngày
Highlight màu vàng
Hiển thị cảnh báo "X mặt hàng sắp hết hạn"
Đề xuất thay thế
5b. Đề xuất bổ sung (Buồng phòng)
Buồng phòng chọn "Đề xuất bổ sung"
Hệ thống tự động tạo danh sách hàng thiếu
Buồng phòng có thể điều chỉnh
Gửi yêu cầu đến Quản kho
Ghi log yêu cầu
Ngoại lệ E1: Phòng chưa có minibar
Điều kiện: Phòng loại Standard không có minibar
Xử lý: Hiển thị "Phòng này không có minibar"
UC-8.1.2: Xem trạng thái phòng («extend» UC-8.1)

Thuộc tính Nội dung
Use Case ID UC-8.1.2
Use Case Name Xem trạng thái phòng chi tiết
Actor Lễ tân, Buồng phòng
Khoa khoa học và kỹ thuật máy tính
Mô tả Xem chi tiết trạng thái và lịch sử của phòng (extend UC-8.1)
Tiền điều kiện

Người dùng đang ở màn hình UC-8.1
Đã chọn 1 phòng cụ thể
Hậu điều kiện
Hiển thị thông tin trạng thái chi tiết
Chu trình thực thi
Người dùng chọn "Xem trạng thái" của phòng
Hệ thống hiển thị thông tin trạng thái hiện tại:
Trạng thái: Sẵn sàng, Đang sử dụng, Đang dọn, Bảo trì, Không
khả dụng
Thời gian chuyển trạng thái
Người cập nhật
Lý do (nếu Bảo trì/Không khả dụng)
Nếu trạng thái = "Đang sử dụng":
3.1. Hiển thị thông tin khách:
Tên khách
Mã booking
Check-in: Ngày giờ
Check-out dự kiến: Ngày giờ
Số ngày đã ở
Nếu trạng thái = "Đang dọn":
4.1. Hiển thị thông tin dọn phòng:
Buồng phòng phụ trách
Thời gian bắt đầu dọn
Tiến độ: Đang dọn phòng, Đổi ga gối, Kiểm tra minibar, Vệ
sinh phòng tắm
% hoàn thành
Nếu trạng thái = "Bảo trì":
5.1. Hiển thị thông tin bảo trì:
Lý do bảo trì
Ngày bắt đầu
Ngày hoàn thành dự kiến
Kỹ thuật viên phụ trách
Tiến độ sửa chữa
Hệ thống hiển thị lịch sử trạng thái (10 lần gần nhất):
Thời gian
Trạng thái cũ → Trạng thái mới
Người cập nhật
Ghi chú
Hệ thống hiển thị timeline trạng thái trong 7 ngày qua
Người dùng có thể:
Xem lịch sử booking của phòng
Xem lịch sử dọn phòng
In báo cáo trạng thái
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 8a. Xem lịch sử booking
Người dùng chọn "Lịch sử booking"
Hệ thống hiển thị danh sách booking của phòng này
Thông tin: Mã booking, Khách, Check-in, Check-out, Tổng tiền
Lọc theo thời gian: Tháng này, 3 tháng, 6 tháng, Năm nay
8b. Xem lịch sử dọn phòng
Người dùng chọn "Lịch sử dọn phòng"
Hệ thống hiển thị:
Ngày giờ dọn
Buồng phòng
Thời gian dọn (phút)
Đánh giá chất lượng (nếu có)
Vấn đề phát hiện (nếu có)
Tính trung bình thời gian dọn phòng
7a. Cảnh báo trạng thái bất thường
Phòng "Đang dọn" quá lâu (>60 phút)
Hiển thị cảnh báo "Dọn phòng quá lâu"
Đề xuất kiểm tra
Ngoại lệ E1: Lịch sử trống
Điều kiện: Phòng mới, chưa có lịch sử
Xử lý: Hiển thị "Chưa có lịch sử trạng thái"
UC-8.2: Cập nhật trạng thái phòng

Thuộc tính Nội dung
Use Case ID UC-8.2
Use Case Name Cập nhật trạng thái phòng
Actor Buồng phòng
Mô tả Buồng phòng cập nhật trạng thái phòng sau khi dọn
Tiền điều kiện
Buồng phòng đã đăng nhập
Có phòng cần cập nhật trạng thái
Hậu điều kiện
Trạng thái phòng được cập nhật
Lịch sử cập nhật được ghi lại
Thông báo gửi cho Lễ tân (nếu "Sẵn sàng")
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi

Buồng phòng chọn "Cập nhật trạng thái phòng"
Hệ thống hiển thị danh sách phòng được phân công
Buồng phòng chọn phòng cần cập nhật
Hệ thống hiển thị trạng thái hiện tại và thông tin phòng
Buồng phòng chọn trạng thái mới:
Đang dọn: Bắt đầu dọn phòng
Sẵn sàng: Đã dọn xong, phòng sạch sẽ
Cần kiểm tra: Phát hiện vấn đề cần Quản lý kiểm tra
Cần bảo trì: Phát hiện hư hỏng cần sửa chữa
Nếu chọn "Đang dọn":
6.1. Hệ thống ghi thời gian bắt đầu dọn
6.2. Tạo checklist dọn phòng:
- Thu dọn rác
- Đổi ga, gối, khăn
- Lau dọn phòng
- Vệ sinh phòng tắm
- Kiểm tra minibar
- Bổ sung amenities (dầu gội, sữa tắm, bàn chải)
- Hút bụi
- Kiểm tra thiết bị (TV, điều hòa, đèn)
6.3. Buồng phòng tick từng mục khi hoàn thành
6.4. Hệ thống tính % hoàn thành
6.5. Tiếp tục bước 12
Nếu chọn "Sẵn sàng":
7.1. Kiểm tra checklist đã hoàn thành chưa
7.2. Nếu chưa: Cảnh báo "Chưa hoàn thành checklist"
7.3. Buồng phòng xác nhận lại
7.4. Hệ thống ghi thời gian hoàn thành
7.5. Hệ thống tính thời gian dọn = Hoàn thành - Bắt đầu
7.6. Nếu thời gian > 45 phút: Ghi chú "Dọn chậm"
7.7. Chụp ảnh phòng sau khi dọn (tùy chọn)
7.8. Gửi thông báo "Phòng XXX đã sẵn sàng" cho Lễ tân
7.9. Tiếp tục bước 12
Nếu chọn "Cần kiểm tra":
8.1. Buồng phòng nhập lý do cần kiểm tra (*)
8.2. Chụp ảnh vấn đề
8.3. Gửi thông báo cho Quản lý
8.4. Tiếp tục bước 12
Nếu chọn "Cần bảo trì":
9.1. Buồng phòng mô tả vấn đề cần sửa (*)
9.2. Chọn loại vấn đề: Điện, Nước, Điều hòa, Thiết bị hỏng, Khác
9.3. Đánh giá mức độ: Nhẹ, Trung bình, Nghiêm trọng
9.4. Chụp ảnh hư hỏng
9.5. Hệ thống tạo sự cố tự động (SC-YYYYMMDD-XXX)
9.6. Gửi thông báo cho Kỹ thuật và Quản lý
9.7. Tiếp tục bước 12
Buồng phòng có thể nhập ghi chú bổ sung
Buồng phòng xác nhận cập nhật
Hệ thống cập nhật trạng thái phòng
Hệ thống ghi log:
Thời gian cập nhật
Buồng phòng
Trạng thái cũ → Trạng thái mới
Ghi chú
Ảnh (nếu có)
Hệ thống cập nhật KPI buồng phòng (số phòng dọn/ngày, thời gian
TB)
Hiển thị "Cập nhật trạng thái thành công"
Khoa khoa học và kỹ thuật máy tính
Chu trình phụ 6.2a. Sử dụng template checklist
Hệ thống có template checklist theo loại phòng
Standard: 8 mục cơ bản
Deluxe/Suite: + Kiểm tra máy pha cà phê, két sắt
VIP: + Trang trí hoa tươi, kiểm tra rượu vang
Tự động load template phù hợp
7.6a. Dọn nhanh (< 30 phút)
Thời gian dọn < 30 phút
Cộng điểm thưởng KPI
Ghi nhận "Dọn nhanh"
12a. Cập nhật hàng loạt
Buồng phòng chọn nhiều phòng cùng lúc
Cập nhật cùng 1 trạng thái
Áp dụng cho tất cả phòng đã chọn
Tiết kiệm thời gian
Ngoại lệ E1: Chuyển trạng thái không hợp lệ
Điều kiện: Từ "Đang sử dụng" → "Sẵn sàng" (phải check-out trước)
Xử lý: Hiển thị "Không thể chuyển. Phòng đang có khách" E2: Check-
list chưa hoàn thành
Điều kiện: Chọn "Sẵn sàng" nhưng checklist < 100%
Xử lý: Cảnh báo "Chưa hoàn thành tất cả công việc. Vẫn cập nhật?"
UC-8.3: Cập nhật thông tin minibar của phòng

Thuộc tính Nội dung
Use Case ID UC-8.3
Use Case Name Cập nhật thông tin minibar của phòng
Actor Buồng phòng, Quản lý
Mô tả Cập nhật số lượng hàng hóa trong minibar sau khi kiểm tra hoặc bổ
sung
Tiền điều kiện
Người dùng đã đăng nhập
Có phòng cần cập nhật minibar
Hậu điều kiện
Thông tin minibar được cập nhật
Tạo phiếu xuất kho (nếu bổ sung hàng)
Tính chi phí minibar cho khách (nếu tiêu thụ)
Chu trình thực thi
Người dùng chọn "Cập nhật minibar"
Hệ thống hiển thị danh sách phòng
Người dùng chọn phòng cần cập nhật
Hệ thống hiển thị thông tin minibar hiện tại
Người dùng chọn loại cập nhật (Kiểm tra/Bổ sung/Thay thế/Toàn
bộ)
Nếu chọn "Kiểm tra tiêu thụ":
6.1. Hiển thị danh sách hàng trong minibar
6.2. Người dùng nhập số lượng còn lại từng mặt hàng
6.3. Hệ thống tính số lượng đã dùng, tiền và cập nhật hóa đơn
6.4. Nếu số lượng < 50% chuẩn: Đánh dấu "Cần bổ sung"
Khoa khoa học và kỹ thuật máy tính
Thuộc tính Nội dung (tiếp theo)

Nếu chọn "Bổ sung hàng":
7.1. Hiển thị hàng thiếu, nhập số lượng bổ sung
7.2. Hệ thống kiểm tra tồn kho và tạo phiếu xuất kho
Nếu chọn "Thay thế hàng hết hạn": Cập nhật hạn sử dụng
và thu hồi hàng cũ.
Nếu chọn "Cập nhật toàn bộ": Kiểm kê và ghi log chênh lệch.
Người dùng có thể chụp ảnh và ghi chú.
Xác nhận cập nhật và hệ thống ghi log thời gian, người dùng.
Hiển thị "Cập nhật minibar thành công".
Chu trình phụ 6.6a. Tính tiền minibar cho khách
Có tiêu thụ minibar, hệ thống tạo mục chi phí trong hóa đơn
In hóa đơn minibar riêng nếu khách yêu cầu
7.3a. Kho hết hàng
Tạo yêu cầu mua hàng khẩn cấp và thông báo quản lý
9.4a. Chênh lệch lớn (>5 món)
Cảnh báo nghiêm trọng và yêu cầu giải trình văn bản
Ngoại lệ E1: Số lượng âm
Xử lý: Hiển thị "Số lượng không hợp lệ"
E2: Phòng không có minibar
Xử lý: Hiển thị cảnh báo cho loại phòng Standard
E3: Cập nhật khi đang check-out
Xử lý: Yêu cầu chờ hoàn tất thanh toán
Khoa khoa học và kỹ thuật máy tính
4.5.1.i Module 9: Quản lý thu chi
Hình 15: Use case diagram Module 9: Quản lý thu chi
UC-9.1: Ghi nhận thu
Thuộc tính Nội dung
Use Case ID UC-9.1
Use Case Name Ghi nhận khoản thu
Actor Lễ tân
Mô tả Ghi nhận các khoản thu tiền từ khách hàng (thanh toán phòng, dịch vụ,
đặt cọc)
Khoa khoa học và kỹ thuật máy tính
Tiền điều kiện
Lễ tân đã đăng nhập
Có giao dịch thu tiền thực tế
Hậu điều kiện
Phiếu thu được tạo và lưu vào hệ thống
Giao dịch được ghi vào sổ quỹ tự động
Hóa đơn được in/gửi email cho khách
Số dư quỹ tăng
Chu trình thực thi
Lễ tân chọn "Ghi nhận thu"
Lễ tân chọn loại thu: Thu từ booking (thanh toán phòng + dịch vụ),
Thu đặt cọc, Thu khác
Nếu "Thu từ booking":
3.1. Chọn booking cần thanh toán
3.2. Hệ thống hiển thị hóa đơn chi tiết (Tiền phòng, Dịch vụ, Tổng
cộng, Đã đặt cọc, Còn phải trả)
Lễ tân nhập thông tin thanh toán:
Số tiền (*)
Hình thức (*): Tiền mặt, Thẻ, Chuyển khoản, Ví điện tử
Mã giao dịch (nếu online)
Ghi chú
Lễ tân xác nhận
Hệ thống tạo mã phiếu thu (PT-YYYYMMDD-XXX)
Hệ thống lưu phiếu thu
Hệ thống tự động lưu vào sổ quỹ (UC-9.1.1)
Hệ thống cập nhật trạng thái thanh toán booking
Hệ thống cập nhật số dư quỹ
Hệ thống in/gửi email hóa đơn
Hiển thị "Ghi nhận thu thành công - Mã: PT-XXX"
Chu trình phụ 4a. Thanh toán bằng thẻ
Lễ tân vuốt thẻ qua máy POS
Khách nhập mã PIN
Hệ thống POS xử lý
Nếu thành công: Lấy mã giao dịch, in biên lai thẻ
Nếu thất bại: Hiển thị lỗi, đề xuất phương thức khác
Tiếp tục bước 5
4b. Thanh toán một phần
Khách thanh toán một phần
Hệ thống tính nợ còn lại
Ghi nhận phiếu thu và công nợ
Tạo thông báo nhắc nợ
11a. In hóa đơn VAT
Khách yêu cầu hóa đơn VAT
Nhập: Tên công ty, MST, Địa chỉ, Email
Tạo hóa đơn VAT chuẩn
In hoặc gửi email
Ngoại lệ E1: Số tiền không hợp lệ
Điều kiện: Số tiền ≤ 0
Xử lý: Hiển thị lỗi "Số tiền phải lớn hơn 0" E2: Thanh toán thẻ
thất bại
Điều kiện: Thẻ bị từ chối
Xử lý: Hiển thị lỗi từ POS, đề xuất phương thức khác
UC-9.2: Xuất hóa đơn thu

Khoa khoa học và kỹ thuật máy tính
Thuộc tính Nội dung
Use Case ID UC-9.2
Use Case Name Xuất hóa đơn thu
Actor Lễ tân, Quản lý
Mô tả In lại hóa đơn hoặc xuất hóa đơn VAT cho các khoản thu
Tiền điều kiện

Người dùng đã đăng nhập
Có phiếu thu đã tạo
Hậu điều kiện
Hóa đơn được in/xuất
Log được ghi lại
Chu trình thực thi
Người dùng chọn "Xuất hóa đơn thu"
Hệ thống hiển thị danh sách phiếu thu
Người dùng chọn phiếu thu cần xuất
Hệ thống hiển thị 2 loại hóa đơn:
Hóa đơn thường (in lại)
Hóa đơn VAT (xuất mới)
Người dùng chọn loại
Nếu Hóa đơn thường:
In lại phiếu thu gốc
Đóng dấu "BẢN SAO"
Ghi log
Nếu Hóa đơn VAT:
Nhập: Tên công ty (), MST (), Địa chỉ (*), Email
Kiểm tra MST (10-13 số)
Tính VAT 10%
Tạo hóa đơn VAT
In + Gửi email PDF
Lưu thông tin công ty
Hiển thị "Xuất hóa đơn thành công"
Chu trình phụ 7a. Sử dụng thông tin công ty đã lưu
Nếu khách đã từng xuất VAT → Tự động điền thông tin
Ngoại lệ E1: MST không hợp lệ
Hiển thị "Mã số thuế phải là 10-13 số"
Khoa khoa học và kỹ thuật máy tính
UC-9.3: Xem danh sách phiếu thu

Thuộc tính Nội dung
Use Case ID UC-9.3
Use Case Name Xem danh sách phiếu thu
Actor Lễ tân, Quản lý, Chủ khách sạn
Mô tả Xem tất cả phiếu thu với các bộ lọc (extend: Lọc thời gian, Lọc loại thu)
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách phiếu thu
Chu trình thực thi
Người dùng chọn "Danh sách phiếu thu"
Hệ thống hiển thị dashboard:
Tổng thu hôm nay
Tổng thu tuần
Tổng thu tháng
Biểu đồ xu hướng
Hệ thống hiển thị danh sách (20/trang):
Mã phiếu thu
Ngày giờ
Loại thu: Phòng, Dịch vụ, Minibar, Giặt ủi, Thuê xe, Khác
Khách hàng
Số tiền
Hình thức: Tiền mặt, Thẻ, Chuyển khoản, Ví điện tử
Người thu
Trạng thái: Hợp lệ, Đã hủy
Người dùng có thể:
Lọc theo thời gian («extend» UC-9.3.1)
Lọc theo loại thu («extend» UC-9.3.2)
Tìm kiếm: Mã, Tên khách, SĐT
Sắp xếp: Thời gian, Số tiền
Xuất báo cáo Excel/PDF
Chu trình phụ Không có
Ngoại lệ Không có
Khoa khoa học và kỹ thuật máy tính
UC-9.3.1: Lọc theo thời gian («extend»)

Thuộc tính Nội dung
Use Case ID UC-9.3.1
Use Case Name Lọc phiếu thu theo thời gian
Actor Lễ tân, Quản lý, Chủ khách sạn
Mô tả Lọc phiếu thu theo khoảng thời gian (extend UC-9.3)
Tiền điều kiện
Đang ở màn hình UC-9.3
Hậu điều kiện
Danh sách được lọc
Chu trình thực thi
Chọn khoảng thời gian: Hôm nay, Tuần, Tháng, Quý, Năm, Tùy chỉnh
Nếu Tùy chỉnh: Chọn từ ngày - đến ngày
Xác nhận
Hệ thống lọc và hiển thị kết quả
Cập nhật dashboard theo khoảng thời gian
Chu trình phụ Không có
Ngoại lệ E1: Ngày không hợp lệ
Ngày kết thúc < Ngày bắt đầu
Khoa khoa học và kỹ thuật máy tính
UC-9.3.2: Lọc theo loại thu («extend»)

Thuộc tính Nội dung
Use Case ID UC-9.3.2
Use Case Name Lọc phiếu thu theo loại
Actor Lễ tân, Quản lý, Chủ khách sạn
Mô tả Lọc phiếu thu theo loại dịch vụ (extend UC-9.3)
Tiền điều kiện
Đang ở màn hình UC-9.3
Hậu điều kiện
Danh sách được lọc theo loại
Chu trình thực thi
Chọn loại thu: Phòng, Dịch vụ, Minibar, Giặt ủi, Thuê xe, Khác
Có thể chọn nhiều loại
Xác nhận
Hệ thống lọc và hiển thị
Hiển thị thống kê theo loại:
Số lượng phiếu
Tổng tiền
% doanh thu
Biểu đồ tròn
Chu trình phụ Không có
Ngoại lệ Không có
Khoa khoa học và kỹ thuật máy tính
UC-9.4: Tạo phiếu chi

Thuộc tính Nội dung
Use Case ID UC-9.4
Use Case Name Tạo phiếu chi
Actor Lễ tân, Quản lý
Mô tả Tạo phiếu đề nghị chi phí
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Phiếu chi được tạo, trạng thái "Chờ duyệt"
Quản lý nhận thông báo
Chu trình thực thi
Người dùng chọn "Tạo phiếu chi"
Nhập thông tin:
Loại chi (*): Lương, Mua hàng, Bảo trì, Điện nước, Hóa chất,
Quảng cáo, Khác
Số tiền (*)
Lý do chi tiết (*)
Ngày cần chi
File đính kèm (báo giá, hóa đơn)
Nếu khẩn cấp: Đánh dấu "Ưu tiên", gửi SMS/Push
Xác nhận
Hệ thống tạo mã DN-YYYYMMDD-XXX
Lưu với trạng thái "Chờ duyệt"
Gửi thông báo Quản lý
Hiển thị "Tạo phiếu thành công - Chờ phê duyệt"
Chu trình phụ Không có
Ngoại lệ E1: Thiếu thông tin bắt buộc
Highlight trường thiếu
Khoa khoa học và kỹ thuật máy tính
UC-9.5: Phê duyệt phiếu chi

Thuộc tính Nội dung
Use Case ID UC-9.5
Use Case Name Phê duyệt phiếu chi
Actor Quản lý
Mô tả Quản lý xét duyệt phiếu đề nghị chi
Tiền điều kiện
Quản lý đã đăng nhập
Có phiếu chờ duyệt
Hậu điều kiện
Phiếu được duyệt/từ chối/yêu cầu bổ sung
Người đề nghị nhận thông báo
Chu trình thực thi
Quản lý chọn "Phê duyệt phiếu chi"
Hệ thống hiển thị danh sách chờ duyệt
Quản lý chọn phiếu
Xem chi tiết: Loại, Số tiền, Lý do, File đính kèm
Chọn hành động:
Phê duyệt
Từ chối
Yêu cầu bổ sung
Nếu Phê duyệt:
Nhập ghi chú (tùy chọn)
Xác nhận
Tạo phiếu chi PC-YYYYMMDD-XXX
Trừ sổ quỹ
Gửi thông báo "Đã duyệt"
Nếu Từ chối:
Nhập lý do (*)
Xác nhận
Cập nhật trạng thái "Đã từ chối"
Gửi thông báo kèm lý do
Nếu Yêu cầu bổ sung:
Nhập yêu cầu (*)
Xác nhận
Cập nhật "Yêu cầu bổ sung"
Gửi thông báo
Người đề nghị bổ sung → Quay lại "Chờ duyệt"
Chu trình phụ 6a. Chi phí lớn (>10 triệu)
Cảnh báo, yêu cầu xác nhận lại, thông báo Chủ KS
Ngoại lệ E1: Quỹ không đủ
Cảnh báo "Quỹ thiếu X VNĐ"
Khoa khoa học và kỹ thuật máy tính
UC-9.6: Khóa sổ quỹ (cuối ngày/tháng/năm)

Thuộc tính Nội dung
Use Case ID UC-9.6
Use Case Name Khóa sổ quỹ cuối kỳ
Actor Quản lý
Mô tả Khóa sổ quỹ cuối ngày/tháng/năm để kết toán
Tiền điều kiện
Đến thời điểm khóa sổ
Tất cả giao dịch trong kỳ đã hoàn tất
Hậu điều kiện
Sổ quỹ được khóa
Báo cáo kết toán được tạo
Số dư chuyển kỳ mới
Chu trình thực thi
Quản lý chọn "Khóa sổ quỹ"
Chọn loại: Khóa ngày, Khóa tháng, Khóa năm
Hệ thống kiểm tra:
Tất cả phiếu đã xác nhận
Không có giao dịch chờ xử lý
Hệ thống tính toán:
Số dư đầu kỳ
Tổng thu trong kỳ
Tổng chi trong kỳ
Số dư cuối kỳ = Đầu + Thu - Chi
Quản lý nhập số tiền thực tế (nếu khóa ngày)
Hệ thống tính chênh lệch
Nếu chênh lệch:
Nhập lý do
Phân loại: Lỗi nhập/Thất thoát/Phát sinh ngoài
Tạo biên bản đối chiếu
Quản lý xác nhận khóa
Hệ thống khóa sổ (không cho sửa/xóa)
Tạo báo cáo PDF:
Tổng hợp thu/chi
Chi tiết phiếu
Biểu đồ
So sánh kỳ trước
Chênh lệch
Chuyển số dư sang kỳ mới
Hiển thị "Đã khóa sổ. Số dư chuyển: XXX"
Chu trình phụ 7a. Chênh lệch lớn (>5%)
Cảnh báo nghiêm trọng, yêu cầu giải trình chi tiết
Ngoại lệ E1: Có giao dịch chưa hoàn tất
Không cho khóa, hiển thị danh sách
Khoa khoa học và kỹ thuật máy tính
UC-9.7: Xem sổ quỹ

Thuộc tính Nội dung
Use Case ID UC-9.7
Use Case Name Xem sổ quỹ
Actor Quản lý, Chủ khách sạn
Mô tả Xem tình hình thu chi tổng hợp
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị sổ quỹ
Chu trình thực thi
Người dùng chọn "Xem sổ quỹ"
Hệ thống hiển thị dashboard:
Số dư hiện tại
Thu hôm nay
Chi hôm nay
Lãi/Lỗ hôm nay
Biểu đồ xu hướng 30 ngày
Hiển thị sổ quỹ theo ngày:
Ngày
Số dư đầu ngày
Tổng thu
Tổng chi
Số dư cuối ngày
Chênh lệch (nếu có)
Trạng thái: Đã khóa/Chưa khóa
Người dùng có thể:
Xem chi tiết từng ngày
Lọc theo: Ngày, Tuần, Tháng, Quý, Năm
Xuất báo cáo Excel/PDF
Xem biểu đồ so sánh
Chu trình phụ 4a. Xem chi tiết ngày
Click vào ngày → Hiển thị tất cả phiếu thu/chi trong ngày
Ngoại lệ Không có
Khoa khoa học và kỹ thuật máy tính
UC-9.8: Xem báo cáo doanh thu

Thuộc tính Nội dung
Use Case ID UC-9.8
Use Case Name Xem báo cáo doanh thu
Actor Quản lý, Chủ khách sạn
Mô tả Xem báo cáo phân tích doanh thu chi tiết
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị báo cáo
Chu trình thực thi
Người dùng chọn "Báo cáo doanh thu"
Chọn khoảng thời gian: Tháng, Quý, Năm
Hệ thống tạo báo cáo:
Doanh thu theo nguồn:
Phòng: XX%
Dịch vụ: XX%
Minibar: XX%
Giặt ủi: XX%
Thuê xe: XX%
Khác: XX%
Top 10 khách hàng VIP
Phân tích theo thời gian:
Biểu đồ cột theo ngày/tuần/tháng
Xu hướng tăng/giảm
So sánh cùng kỳ năm trước
Tỷ lệ lấp đầy phòng
ADR (Average Daily Rate)
RevPAR (Revenue Per Available Room)
Hiển thị biểu đồ trực quan
Người dùng có thể:
Xuất PDF/Excel
In báo cáo
Lưu làm template
Chu trình phụ Không có
Ngoại lệ Không có
Khoa khoa học và kỹ thuật máy tính
UC-9.9: Xem báo cáo chi phí

Thuộc tính Nội dung
Use Case ID UC-9.9
Use Case Name Xem báo cáo chi phí
Actor Quản lý, Chủ khách sạn
Mô tả Xem báo cáo phân tích chi phí
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị báo cáo
Chu trình thực thi
Người dùng chọn "Báo cáo chi phí"
Chọn khoảng thời gian
Hệ thống tạo báo cáo:
Chi phí theo loại:
Lương: XX%
Mua hàng: XX%
Bảo trì: XX%
Điện nước: XX%
Hóa chất: XX%
Quảng cáo: XX%
Khác: XX%
Xu hướng chi phí
So sánh với ngân sách
Chi phí bất thường
Top 10 khoản chi lớn nhất
Hiển thị biểu đồ
Đề xuất tiết kiệm (nếu có)
Chu trình phụ Không có
Ngoại lệ Không có
Khoa khoa học và kỹ thuật máy tính
UC-9.10: Xem báo cáo lợi nhuận

Thuộc tính Nội dung
Use Case ID UC-9.10
Use Case Name Xem báo cáo lợi nhuận
Actor Chủ khách sạn
Mô tả Xem báo cáo lãi/lỗ tổng hợp
Tiền điều kiện
Chủ khách sạn đã đăng nhập
Hậu điều kiện
Hiển thị báo cáo lợi nhuận
Chu trình thực thi
Chủ KS chọn "Báo cáo lợi nhuận"
Chọn kỳ: Tháng, Quý, Năm
Hệ thống tạo báo cáo:
Doanh thu:
Tổng doanh thu
Chi tiết theo nguồn
Chi phí:
Tổng chi phí
Chi tiết theo loại
Lợi nhuận:
Lợi nhuận gộp = Doanh thu - Chi phí
Biên lợi nhuận % = (Lợi nhuận / Doanh thu) × 100
So sánh:
So với kỳ trước
So với cùng kỳ năm trước
Tăng/Giảm (%)
Dự báo:
Dự đoán tháng tới (dựa vào xu hướng)
Hiển thị biểu đồ tổng hợp
Phân tích điểm mạnh/yếu
Xuất báo cáo PDF
Chu trình phụ Không có
Ngoại lệ Không có
Khoa khoa học và kỹ thuật máy tính
UC-9.11: Phân tích thu chi

Thuộc tính Nội dung
Use Case ID UC-9.11
Use Case Name Phân tích thu chi
Actor Quản lý, Chủ khách sạn
Mô tả Phân tích chi tiết thu chi để đưa ra quyết định kinh doanh
Tiền điều kiện
Người dùng đã đăng nhập
Có dữ liệu thu chi
Hậu điều kiện
Hiển thị phân tích
Đề xuất hành động
Chu trình thực thi
Người dùng chọn "Phân tích thu chi"
Chọn khoảng thời gian phân tích
Hệ thống phân tích:
Phân tích xu hướng:
Thu tăng/giảm
Chi tăng/giảm
Tỷ lệ chi/thu
Phát hiện bất thường:
Ngày thu/chi cao bất thường
Khoản chi lớn đột ngột
Giao dịch khả nghi
Phân tích mùa vụ:
Tháng cao điểm
Tháng trầm lắng
Xu hướng theo tuần/tháng
Hiệu quả kinh doanh:
ROI (Return on Investment)
Break-even point
Cash flow
Hệ thống đưa ra đề xuất:
Tối ưu hóa chi phí
Tăng nguồn thu
Cảnh báo rủi ro
Cơ hội phát triển
Hiển thị biểu đồ trực quan
Xuất báo cáo phân tích
Chu trình phụ Không có
Ngoại lệ E1: Dữ liệu không đủ
Cần ít nhất 30 ngày dữ liệu để phân tích
Khoa khoa học và kỹ thuật máy tính
4.5.1.j Module 10: Quản lý kho hàng
UC-10.1: Nhập hàng
Thuộc tính Nội dung
Use Case ID UC-10.1
Use Case Name Nhập hàng vào kho
Actor Quản lý, Quản kho
Mô tả Tạo phiếu nhập hàng khi mua vật tư
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Phiếu nhập được tạo với trạng thái "Chờ xác nhận"
Phiếu chi được tạo (nếu thanh toán ngay)
Chu trình thực thi
Người dùng chọn "Nhập hàng"
Người dùng chọn/tạo nhà cung cấp
Người dùng nhập: Ngày (*), Danh sách sản phẩm (Tên, SL, Đơn giá,
HSD), Ghi chú
Hệ thống tính tổng tiền
Người dùng xác nhận
Hệ thống tạo mã (PN-YYYYMMDD-XXX)
Hệ thống lưu phiếu nhập
Nếu thanh toán ngay: Tạo phiếu chi
Nếu > 20M: Yêu cầu phê duyệt Quản lý
Hiển thị "Tạo phiếu nhập thành công"
Chu trình phụ 3a. Thêm sản phẩm mới
Sản phẩm chưa có trong danh mục
Chọn "Thêm sản phẩm mới"
Nhập: Tên, Danh mục, Đơn vị
Lưu vào danh mục
Ngoại lệ E1: Danh sách rỗng
Điều kiện: Không có sản phẩm
Xử lý: Hiển thị "Vui lòng thêm ít nhất 1 sản phẩm"
Khoa khoa học và kỹ thuật máy tính
UC-10.2: Xuất hàng

Thuộc tính Nội dung
Use Case ID UC-10.2
Use Case Name Xuất hàng từ kho
Actor Quản kho
Mô tả Tạo phiếu xuất kho khi bộ phận yêu cầu vật tư
Tiền điều kiện
Quản kho đã đăng nhập
Có hàng tồn kho
Hậu điều kiện
Phiếu xuất được tạo với trạng thái "Chờ xác nhận nhận hàng"
Chu trình thực thi
Quản kho chọn "Xuất hàng"
Quản kho chọn bộ phận nhận (Buồng phòng, Kỹ thuật, Lễ tân,
Bếp/Bar)
Quản kho chọn lý do (Bổ sung vật tư, Bổ sung minibar, Sửa chữa, Sử
dụng nội bộ)
Quản kho nhập danh sách sản phẩm và số lượng
Hệ thống kiểm tra: SL xuất ≤ Tồn kho
Quản kho xác nhận
Hệ thống tạo mã (PX-YYYYMMDD-XXX)
Hệ thống lưu phiếu xuất
Hệ thống in 2 bản
Hiển thị "Tạo phiếu xuất thành công"
Chu trình phụ 5a. Tồn kho không đủ
Số lượng > Tồn kho
Hiển thị "Tồn kho không đủ. Hiện chỉ còn X"
Đề xuất: Xuất số có hoặc Tạo phiếu đề nghị mua
Ngoại lệ E1: SL xuất > Tồn kho
Điều kiện: Xuất quá tồn
Xử lý: Không cho submit
Khoa khoa học và kỹ thuật máy tính
UC-10.3: Xem danh sách nhập xuất

Thuộc tính Nội dung
Use Case ID UC-10.3
Use Case Name Xem danh sách nhập xuất
Actor Quản kho, Quản lý
Mô tả Xem lịch sử tất cả phiếu nhập và xuất
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách phiếu
Chu trình thực thi
Người dùng chọn "Danh sách nhập xuất"
Hệ thống hiển thị danh sách: Mã, Loại (Nhập/Xuất), Ngày, NCC/Bộ
phận, Tổng tiền, Trạng thái
Người dùng có thể lọc, tìm kiếm, xem chi tiết
Chu trình phụ Không có
Ngoại lệ E1: Chưa có phiếu
Điều kiện: Database chưa có phiếu
Xử lý: Hiển thị "Chưa có phiếu nhập xuất nào"
Khoa khoa học và kỹ thuật máy tính
UC-10.4: Xác nhận nhập lưu kho

Thuộc tính Nội dung
Use Case ID UC-10.4
Use Case Name Xác nhận nhập lưu kho
Actor Quản kho
Mô tả Xác nhận đã nhận hàng thực tế và lưu kho
Tiền điều kiện
Quản kho đã đăng nhập
Có phiếu nhập "Chờ xác nhận"
Hàng đã về thực tế
Hậu điều kiện
Phiếu nhập → "Đã nhập kho"
Tồn kho tăng theo SL thực nhận
Cảnh báo nếu chênh lệch > 5%
Chu trình thực thi
Quản kho xem phiếu nhập cần xác nhận
Quản kho chọn phiếu
Quản kho kiểm tra hàng: Đếm SL, Kiểm tra chất lượng, So với đơn
Quản kho nhập: SL thực nhận, Đánh giá chất lượng, Vị trí lưu, Ghi
chú chênh lệch
Quản kho xác nhận
Hệ thống cập nhật tồn kho += SL thực nhận
Hệ thống cập nhật trạng thái = "Đã nhập kho"
Nếu chênh lệch > 5%: Yêu cầu giải thích
Nếu thiếu > 10%: Gửi cảnh báo Quản lý
Hiển thị "Xác nhận nhập kho thành công"
Chu trình phụ 8a. Chênh lệch > 5%
Phát hiện: |Thực nhận - Đơn đặt| / Đơn đặt > 5%
Hiển thị cảnh báo "Chênh lệch lớn"
Yêu cầu nhập lý do chi tiết
Ngoại lệ E1: Hàng không khớp
Điều kiện: Hàng khác hoàn toàn đơn đặt
Xử lý: Hiển thị "Hàng không khớp. Liên hệ NCC"
Khoa khoa học và kỹ thuật máy tính
UC-10.5: Xác nhận tiếp quản sử dụng

Thuộc tính Nội dung
Use Case ID UC-10.5
Use Case Name Xác nhận tiếp quản sử dụng
Actor Buồng phòng, Kỹ thuật
Mô tả Bộ phận xác nhận đã nhận hàng từ kho
Tiền điều kiện
Người dùng đã đăng nhập
Có phiếu xuất "Chờ xác nhận nhận hàng"
Hậu điều kiện
Phiếu xuất → "Đã xuất"
Tồn kho giảm theo SL xuất
Trách nhiệm chuyển sang bộ phận nhận
Chu trình thực thi
Người dùng xem phiếu xuất cần xác nhận
Người dùng chọn phiếu
Người dùng kiểm tra hàng: Đối chiếu với phiếu, Kiểm tra SL và chất
lượng
Người dùng xác nhận đã nhận đủ
Hệ thống cập nhật tồn kho -= SL xuất
Hệ thống cập nhật trạng thái = "Đã xuất"
Hệ thống ghi log chuyển trách nhiệm
Hiển thị "Xác nhận nhận hàng thành công"
Chu trình phụ Không có
Ngoại lệ E1: Hàng không đủ/không đúng
Điều kiện: SL/chất lượng không khớp
Xử lý: Không cho xác nhận, yêu cầu kiểm tra lại
Khoa khoa học và kỹ thuật máy tính
4.5.1.k Module 11: Quản lý booking
Hình 16: Use case diagram Module 11: Quản lý booking
UC-11.1: Tạo booking
Thuộc tính Nội dung
Use Case ID UC-11.1
Use Case Name Tạo booking mới
Actor Lễ tân, Quản lý
Mô tả Tạo booking đặt phòng cho khách hàng (đặt trước hoặc walk-in)
Tiền điều kiện
Người dùng đã đăng nhập
Có khách hàng hoặc tạo mới
Có phòng trống
Hậu điều kiện
Booking được tạo với trạng thái "Đã đặt"
Phòng được khóa trong khoảng thời gian
Tiền đặt cọc 30% được thu (hoặc ghi nợ)
Email xác nhận + voucher được gửi/in
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi
Lễ tân chọn "Tạo booking"
Lễ tân chọn/tạo khách hàng (UC-2.1)
Lễ tân nhập thông tin booking:
Check-in (*): Ngày giờ
Check-out (*): Ngày giờ
Số đêm: Tự động tính
Hạng phòng (*): Chọn từ dropdown
Số phòng (*): Nhập số lượng
Số người (*): Nhập số người
Yêu cầu đặc biệt
Hệ thống kiểm tra: Check-in ≥ hiện tại, Check-out > Check-in, Số
người phù hợp
Hệ thống tìm phòng trống trong khoảng thời gian
Hệ thống hiển thị danh sách phòng khả dụng
Lễ tân chọn phòng cụ thể (hoặc để hệ thống tự chọn)
Lễ tân có thể thêm dịch vụ đi kèm (Đưa đón sân bay, Tour, Spa)
Hệ thống tính giá: Tiền phòng = Giá × Số phòng × Số đêm + Dịch
vụ, Đặt cọc 30%
Lễ tân xác nhận tạo booking
Hệ thống tạo mã booking (BK-YYYYMMDD-XXX)
Hệ thống lưu booking với trạng thái "Đã đặt"
Hệ thống khóa phòng trong khoảng thời gian
Hệ thống thu tiền đặt cọc (hoặc ghi nợ)
Hệ thống gửi email xác nhận
Hệ thống in voucher booking
Hiển thị "Tạo booking thành công - Mã: BK-XXX"
Chu trình phụ 5a. Không có phòng trống
Hệ thống không tìm thấy phòng khả dụng
Hiển thị đề xuất: Chọn hạng khác, Thay đổi thời gian
Lễ tân quyết định
9a. Khách VIP - Ưu đãi
Hệ thống nhận diện VIP
Tự động áp dụng: Upgrade phòng, Giảm 10%, Miễn phí late check-out
Hiển thị thông báo ưu đãi
14a. Thanh toán đặt cọc thất bại
Lỗi khi thu tiền
Đề xuất: Phương thức khác hoặc Ghi nợ
Ngoại lệ E1: Thời gian không hợp lệ
Điều kiện: Check-in < hiện tại hoặc Check-out ≤ Check-in
Xử lý: Highlight đỏ, yêu cầu sửa E2: Không đủ phòng
Điều kiện: Số phòng yêu cầu > số phòng trống
Xử lý: Hiển thị "Chỉ còn X phòng trống"
UC-11.2: Quản lý Booking

Thuộc tính Nội dung
Use Case ID UC-11.2
Use Case Name Quản lý Booking (Sửa/Hủy)
Actor Lễ tân, Quản lý
Mô tả Sửa đổi hoặc hủy booking đã tạo
Khoa khoa học và kỹ thuật máy tính
Tiền điều kiện

Người dùng đã đăng nhập
Booking tồn tại và chưa check-out
Hậu điều kiện

Nếu sửa: Thông tin được cập nhật, Email thông báo gửi
Nếu hủy: Booking → "Đã hủy", Phòng giải phóng, Hoàn tiền theo
chính sách
Chu trình thực thi Xóa booking (Hủy):
Người dùng chọn booking cần hủy
Chọn "Hủy booking"
Hệ thống tính phí theo chính sách: >7 ngày: Hoàn 100%, 3-7 ngày:
50%, <3 ngày: 0%, No-show: -20%
Hiển thị số tiền hoàn
Người dùng nhập lý do (*)
Người dùng xác nhận
Hệ thống cập nhật = "Đã hủy"
Hệ thống giải phóng phòng
Hệ thống xử lý hoàn tiền
Gửi email xác nhận hủy
Hiển thị "Đã hủy booking. Hoàn lại: XXX VNĐ"
Sửa booking:
Chọn booking cần sửa
Chọn "Sửa booking"
Kiểm tra: Chỉ sửa được trước check-in
Sửa: Ngày, Hạng phòng, Số phòng, Số người, Yêu cầu
Hệ thống tính lại giá
Hiển thị chênh lệch
Xác nhận sửa
Cập nhật lịch phòng
Xử lý chênh lệch tiền
Gửi email xác nhận
Hiển thị "Cập nhật thành công"
Chu trình phụ Thay đổi ngày → Không có phòng
Ngày mới không có phòng
Đề xuất: Chọn hạng khác hoặc ngày khác
Ngoại lệ E1: Không thể sửa sau check-in
Điều kiện: Đã check-in
Xử lý: Hiển thị "Không thể sửa booking đã check-in"
Khoa khoa học và kỹ thuật máy tính
UC-11.3: Quản lý dịch vụ đi kèm

Thuộc tính Nội dung
Use Case ID UC-11.3
Use Case Name Quản lý dịch vụ đi kèm booking
Actor Lễ tân, Quản lý
Mô tả Thêm hoặc xóa dịch vụ đi kèm trong booking
Tiền điều kiện
Người dùng đã đăng nhập
Booking tồn tại và chưa check-out
Hậu điều kiện
Dịch vụ được thêm/xóa khỏi booking
Tổng tiền booking được cập nhật
Email xác nhận thay đổi được gửi (nếu cần)
Chu trình thực thi UC-11.3.1: Thêm dịch vụ đi kèm
Người dùng chọn booking
Người dùng chọn "Thêm dịch vụ đi kèm"
Hệ thống hiển thị danh sách dịch vụ:
Đưa đón sân bay
Tour city (nửa ngày/cả ngày)
Spa & Massage package
Ăn sáng buffet
Tiệc BBQ
Người dùng chọn dịch vụ và nhập số lượng/thời gian
Hệ thống tính giá dịch vụ
Người dùng xác nhận
Hệ thống thêm dịch vụ vào booking
Hệ thống cập nhật tổng tiền booking
Hiển thị "Thêm dịch vụ thành công. Tổng tiền: XXX VNĐ"
UC-11.3.2: Xóa dịch vụ đi kèm
Người dùng chọn booking
Người dùng chọn "Xem dịch vụ đi kèm"
Hệ thống hiển thị danh sách dịch vụ đã thêm
Người dùng chọn dịch vụ cần xóa
Người dùng chọn "Xóa"
Hệ thống xác nhận xóa
Hệ thống xóa dịch vụ khỏi booking
Hệ thống cập nhật lại tổng tiền
Hiển thị "Đã xóa dịch vụ. Tổng tiền mới: XXX VNĐ"
Chu trình phụ Không có
Ngoại lệ E1: Không thể xóa dịch vụ đã thực hiện
Điều kiện: Dịch vụ đã được cung cấp (trạng thái = "Hoàn thành")
Xử lý: Hiển thị "Không thể xóa dịch vụ đã thực hiện"
UC-11.4: Xem Booking

Thuộc tính Nội dung
Use Case ID UC-11.4
Use Case Name Xem danh sách Booking
Actor Lễ tân, Quản lý
Mô tả Xem danh sách tất cả booking
Tiền điều kiện
Người dùng đã đăng nhập
Hậu điều kiện
Hiển thị danh sách booking
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi

Người dùng chọn "Xem Booking"
Hệ thống hiển thị danh sách: Mã, Khách hàng, Phòng, Check-in/out,
Trạng thái, Tổng tiền, Còn nợ
Người dùng có thể lọc, tìm kiếm, xem chi tiết
Chu trình phụ Lọc theo thời gian
Chọn "Lọc theo thời gian"
Chọn: Hôm nay, Tuần này, Tháng này, Tùy chỉnh
Ngoại lệ E1: Chưa có booking
Điều kiện: Database chưa có
Xử lý: Hiển thị "Chưa có booking nào"
Khoa khoa học và kỹ thuật máy tính
UC-11.5: Tra cứu Booking

Thuộc tính Nội dung
Use Case ID UC-11.5
Use Case Name Tra cứu Booking nhanh
Actor Lễ tân
Mô tả Tìm kiếm booking nhanh chóng
Tiền điều kiện
Lễ tân đã đăng nhập
Hậu điều kiện
Hiển thị kết quả tìm kiếm
Chu trình thực thi
Lễ tân chọn "Tra cứu Booking"
Lễ tân nhập tiêu chí: Mã booking, Tên khách, SĐT, CMND, Số phòng
Hệ thống tìm kiếm
Hiển thị kết quả: 1 booking (chi tiết ngay), Nhiều (danh sách), Không
tìm thấy (thông báo)
Chu trình phụ Không có
Ngoại lệ E1: Không tìm thấy
Điều kiện: Không có booking khớp
Xử lý: Hiển thị "Không tìm thấy. Kiểm tra lại hoặc tạo mới"
Khoa khoa học và kỹ thuật máy tính
UC-11.6: Xác nhận Booking

Thuộc tính Nội dung
Use Case ID UC-11.6
Use Case Name Xác nhận Booking trước check-in
Actor Lễ tân, Quản lý
Mô tả Xác nhận booking và chuẩn bị cho việc check-in
Tiền điều kiện
Người dùng đã đăng nhập
Booking ở trạng thái "Đã đặt"
Sắp đến ngày check-in
Hậu điều kiện
Booking chuyển sang "Đã xác nhận"
Phòng được kiểm tra sẵn sàng
Email/SMS nhắc nhở được gửi cho khách
Chu trình thực thi
Người dùng xem danh sách booking cần xác nhận (check-in trong 1-2
ngày)
Người dùng chọn booking cần xác nhận
Người dùng kiểm tra thông tin booking
Người dùng kiểm tra phòng đã sẵn sàng chưa (trạng thái phòng =
"Sẵn sàng")
Nếu phòng chưa sẵn sàng: Liên hệ Buồng phòng dọn dẹp
Người dùng chọn "Xác nhận booking"
Hệ thống cập nhật trạng thái = "Đã xác nhận"
Hệ thống gửi SMS/Email nhắc nhở khách:
Ngày giờ check-in
Số phòng
Địa chỉ khách sạn
Số điện thoại liên hệ
Hiển thị "Xác nhận booking thành công"
Chu trình phụ 4a. Phòng chưa sẵn sàng
Trạng thái phòng ̸= "Sẵn sàng"
Gửi yêu cầu ưu tiên đến Buồng phòng
Đợi xác nhận từ Buồng phòng
Tiếp tục bước 6 sau khi phòng sẵn sàng
Ngoại lệ E1: Khách hủy trước khi xác nhận
Điều kiện: Khách gọi điện hủy
Xử lý: Chuyển sang UC-11.2.1 (Xóa booking)
UC-11.7: Check-in

Thuộc tính Nội dung
Use Case ID UC-11.7
Use Case Name Check-in khách hàng
Actor Lễ tân
Mô tả Thực hiện check-in khi khách đến nhận phòng
Tiền điều kiện
Lễ tân đã đăng nhập
Có booking đã xác nhận
Đã đến ngày check-in
Phòng đã sẵn sàng (trạng thái "Sẵn sàng")
Hậu điều kiện
Booking chuyển sang "Đã check-in"
Phòng chuyển sang "Đang sử dụng"
Hóa đơn phòng được tạo
Thẻ phòng được in
Welcome SMS/Email được gửi
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi
Lễ tân tìm booking của khách (theo mã booking/tên/SĐT)
Lễ tân xác nhận booking (UC-11.6) nếu chưa
Lễ tân kiểm tra giấy tờ khách: CMND/CCCD/Passport
Lễ tân so sánh với thông tin booking
Lễ tân cập nhật thông tin (nếu cần): Số người thực tế, Yêu cầu mới
Lễ tân thu tiền: Tiền đặt cọc (nếu chưa thu), Hoặc thanh toán toàn
bộ, Hoặc ghi nhận công nợ
Lễ tân chọn "Check in"
Hệ thống tạo hóa đơn phòng
Hệ thống cập nhật: Trạng thái phòng = "Đang sử dụng", Trạng thái
booking = "Đã check-in", Ghi thời gian check-in thực tế
Hệ thống in: Thẻ phòng (key card), Biên lai thu tiền, Giấy hướng dẫn
khách sạn
Lễ tân đưa thẻ phòng và hướng dẫn cho khách: Số phòng, Giờ ăn
sáng, Wifi, Tiện ích
Hệ thống gửi Welcome SMS/Email
Hiển thị "Check-in thành công - Phòng XXX"
Chu trình phụ 1a. Khách đến sớm (Early check-in)
Chưa đến giờ check-in chuẩn (14:00)
Hệ thống kiểm tra phòng đã sẵn sàng chưa
Nếu sẵn sàng: Cho check-in miễn phí
Nếu chưa: Đề xuất giữ hành lý hoặc thu phí early check-in (50%)
1b. Walk-in (Không có booking)
Khách đến trực tiếp
Lễ tân kiểm tra phòng trống
Nếu có: Tạo booking ngay (UC-11.1) → Check-in
Nếu hết: Xin lỗi, gợi ý KS khác
Ngoại lệ E1: Giấy tờ không khớp
Điều kiện: Tên trên CMND ̸= Tên trong booking
Xử lý: Xác nhận lại, cập nhật nếu cần E2: Phòng chưa sẵn sàng
Điều kiện: Phòng trạng thái "Đang dọn"
Xử lý: Liên hệ Buồng phòng, ước tính thời gian, đề xuất chờ hoặc đổi
phòng
UC-11.8: Check-out

Thuộc tính Nội dung
Use Case ID UC-11.8
Use Case Name Check-out khách hàng
Actor Lễ tân
Mô tả Thực hiện check-out và hoàn tất thanh toán khi khách trả phòng
Tiền điều kiện
Lễ tân đã đăng nhập
Khách đã check-in
Đến hoặc gần giờ check-out
Hậu điều kiện
Booking chuyển sang "Đã check-out"
Phòng chuyển sang "Cần dọn dẹp"
Hóa đơn được thanh toán đầy đủ và in
Email feedback được gửi
Khoa khoa học và kỹ thuật máy tính
Chu trình thực thi
Lễ tân tìm booking của khách
Lễ tân liên hệ Buồng phòng kiểm tra phòng: Tình trạng phòng, Mini-
bar đã dùng (UC-8.3), Hư hỏng (nếu có)
Buồng phòng báo cáo lại
Lễ tân cập nhật chi phí phát sinh vào hóa đơn: Minibar, Dịch vụ
phòng, Late check-out, Phạt hư hỏng
Hệ thống tính tổng hóa đơn cuối cùng: Tiền phòng, Dịch vụ đi kèm,
Dịch vụ phát sinh, Tổng cộng, Đã thanh toán, Còn phải trả
Lễ tân hiển thị hóa đơn cho khách
Khách xác nhận hóa đơn
Lễ tân thanh toán số tiền còn lại (UC-11.9)
Lễ tân chọn "Check out"
Hệ thống in hóa đơn cuối cùng
Hệ thống in hóa đơn VAT (nếu khách yêu cầu)
Hệ thống cập nhật: Trạng thái phòng = "Cần dọn dẹp", Trạng thái
booking = "Đã check-out", Ghi thời gian check-out thực tế
Hệ thống gửi email cảm ơn + yêu cầu đánh giá (feedback)
Hiển thị "Check-out thành công. Cảm ơn quý khách!"
Chu trình phụ 2a. Check-out muộn (Late check-out)
Khách check-out sau 12:00
Hệ thống tính phí: 12:00-14:00: Miễn phí, 14:00-18:00: 50%, >18:00:
100%
Thêm vào hóa đơn
3a. Phát hiện hư hỏng
Buồng phòng báo hư hỏng
Lễ tân xác minh (xem ảnh)
Tính phí bồi thường theo bảng giá
Thêm vào hóa đơn, giải thích cho khách
7a. Khách từ chối phí
Khách không đồng ý khoản phí
Lễ tân xác minh lại (log minibar, phiếu dịch vụ)
Nếu đúng: Giải thích
Nếu sai: Điều chỉnh hóa đơn
Ngoại lệ E1: Khách chưa trả đủ tiền
Điều kiện: Còn nợ
Xử lý: Không cho check-out, yêu cầu thanh toán hết E2: Minibar
chưa được cập nhật
Điều kiện: Buồng phòng chưa cập nhật minibar
Xử lý: Chờ cập nhật hoặc ước tính tạm thời
UC-11.9: Thanh toán booking

Thuộc tính Nội dung
Use Case ID UC-11.9
Use Case Name Thanh toán hóa đơn booking
Actor Lễ tân
Mô tả Xử lý thanh toán hóa đơn khi check-out (được gọi bởi UC-11.8)
Tiền điều kiện
Lễ tân đã đăng nhập
Booking đã check-in
Hóa đơn đã được tính toán đầy đủ
Khoa khoa học và kỹ thuật máy tính
Hậu điều kiện

Booking chuyển sang "Đã thanh toán"
Phiếu thu được tạo (UC-9.1)
Sổ quỹ được cập nhật
Hóa đơn được in
Chu trình thực thi
Lễ tân hiển thị tổng hóa đơn cho khách:
Tiền phòng: XXX VNĐ
Dịch vụ đi kèm: XXX VNĐ
Dịch vụ phát sinh: XXX VNĐ
Minibar: XXX VNĐ
Late check-out: XXX VNĐ
Tổng cộng: XXX VNĐ
Đã thanh toán: -XXX VNĐ
Còn phải trả: XXX VNĐ
Khách xác nhận hóa đơn
Lễ tân nhập thông tin thanh toán:
Số tiền (*)
Hình thức (*): Tiền mặt, Thẻ, Chuyển khoản, Ví điện tử
Mã voucher/giảm giá (nếu có)
Hệ thống kiểm tra mã voucher (nếu có):
Voucher hợp lệ
Chưa hết hạn
Chưa sử dụng
Đáp ứng điều kiện (tổng tiền tối thiểu)
Hệ thống tính số tiền cuối cùng sau giảm giá
Lễ tân xác nhận thanh toán
Hệ thống tạo phiếu thu (UC-9.1)
Hệ thống ghi vào sổ quỹ
Hệ thống cập nhật trạng thái thanh toán booking = "Đã thanh toán"
Hệ thống in hóa đơn
Nếu khách yêu cầu: In hóa đơn VAT
Hiển thị "Thanh toán thành công"
Chu trình phụ 4a. Voucher không hợp lệ
Mã voucher sai, hết hạn, hoặc đã dùng
Hiển thị "Voucher không hợp lệ: [Lý do]"
Hỏi khách có muốn thanh toán không giảm giá
Tiếp tục bước 5
3a. Thanh toán bằng thẻ
Lễ tân vuốt thẻ qua máy POS
Khách nhập mã PIN
Hệ thống POS xử lý
Nếu thành công: Lấy mã giao dịch, tiếp tục bước 6
Nếu thất bại: Đề xuất phương thức khác
Ngoại lệ E1: Thanh toán thẻ thất bại
Điều kiện: Thẻ bị từ chối, không đủ tiền
Xử lý: Hiển thị lỗi từ POS, đề xuất phương thức khác (tiền mặt, chuyển
khoản) E2: Khách chưa trả đủ
Điều kiện: Số tiền thanh toán < Còn phải trả
Xử lý: Hiển thị "Còn thiếu XXX VNĐ. Vui lòng thanh toán đủ hoặc
ghi nhận công nợ"
Khoa khoa học và kỹ thuật máy tính
4.6 Activity diagram
Hình 17: Đồng bộ OTA: Phòng trống & Giá + Nhận booking từ OTA (OTA Systems <-> hệ thống)
Đồng bộ OTA: Phòng trống & Giá + Nhận booking từ OTA (OTA Systems <-> hệ thống
Khoa khoa học và kỹ thuật máy tính
Hình 18: Quản lý Booking: Tạo/Sửa/Hủy/Xác nhận (walk-in/đặt trước)
Quản lý Booking: Tạo/Sửa/Hủy/Xác nhận (walk-in/đặt trước)

Khoa khoa học và kỹ thuật máy tính
Hình 19: Check-in: Xác minh khách + đặt cọc + ghi nhận minibar ban đầu + phát thẻ khóa (lễ tân)
Check-in: Xác minh khách + đặt cọc + ghi nhận minibar ban đầu + phát thẻ khóa (lễ tân

Khoa khoa học và kỹ thuật máy tính
Hình 20: Quản lý thẻ khóa: Phát hành / Gửi-trả / Mất thẻ & vô hiệu hóa / Cấp lại (lễ tân)
Quản lý thẻ khóa: Phát hành / Gửi-trả / Mất thẻ & vô hiệu hóa / Cấp lại (lễ tân)

Khoa khoa học và kỹ thuật máy tính
Hình 21: Ghi nhận dịch vụ phát sinh trong lưu trú (thêm dịch vụ vào hóa đơn, theo dõi trạng thái thực hiện)
Ghi nhận dịch vụ phát sinh trong lưu trú (thêm dịch vụ vào hóa đơn, theo dõi trạng thái thực
hiện

Khoa khoa học và kỹ thuật máy tính
Hình 22: Check-out & Thanh toán & Xuất hóa đơn (đa phương thức + payment gateway nếu có)
Check-out & Thanh toán & Xuất hóa đơn (đa phương thức + payment gateway nếu có)

Khoa khoa học và kỹ thuật máy tính
Hình 23: Bàn giao ca lễ tân & đối chiếu tiền mặt cuối ca
Bàn giao ca lễ tân & đối chiếu tiền mặt cuối ca

Khoa khoa học và kỹ thuật máy tính
Hình 24: Buồng phòng: Dọn phòng theo checklist + cập nhật trạng thái phòng + cập nhật minibar
Buồng phòng: Dọn phòng theo checklist + cập nhật trạng thái phòng + cập nhật minibar

Khoa khoa học và kỹ thuật máy tính
Hình 25: Giặt ủi: Tiếp nhận → Xử lý → Cập nhật trạng thái → Thông báo trả khách
Giặt ủi: Tiếp nhận→ Xử lý→ Cập nhật trạng thái→ Thông báo trả khách

Khoa khoa học và kỹ thuật máy tính
Hình 26: Sự cố/Bảo trì: Báo cáo sự cố → Phân công → Xử lý → Báo cáo hoàn thành/đóng sự cố (buồng
phòng/lễ tân/QL/kỹ thuật)

Sự cố/Bảo trì: Báo cáo sự cố→ Phân công→ Xử lý→ Báo cáo hoàn thành/đóng sự cố (buồng
phòng/lễ tân/QL/kỹ thuật)

Khoa khoa học và kỹ thuật máy tính
Hình 27: Kho vật tư: Nhập kho Xuất kho/cấp phát Xác nhận tiếp quản Cảnh báo sắp hết
Kho vật tư: Nhập kho Xuất kho/cấp phát Xác nhận tiếp quản Cảnh báo sắp hết

Khoa khoa học và kỹ thuật máy tính
Hình 28: Thu chi & Khóa sổ quỹ (cuối ngày/tháng/năm)
Thu chi & Khóa sổ quỹ (cuối ngày/tháng/năm)

Khoa khoa học và kỹ thuật máy tính
Hình 29: Quản lý thiết bị & CSVC: Tạo yêu cầu thay thế/sửa chữa → xét duyệt → phân công → theo dõi tiến
độ

Quản lý thiết bị & CSVC: Tạo yêu cầu thay thế/sửa chữa→ xét duyệt→ phân công→ theo
dõi tiến độ

Khoa khoa học và kỹ thuật máy tính
4.7 Sequence diagram
4.7.1 Luồng đăng nhập, tạo phiên và kiểm soát truy cập (RBAC + Session)
Hình 30: Đăng nhập + phân quyền (RBAC) + session timeout (áp dụng cho mọi vai trò)
4.7.1.1 Thành phần tham gia

User: người dùng nhập thông tin đăng nhập và truy cập màn hình bảo vệ.
WebApp: giao diện web, gửi request đăng nhập/đọc tài nguyên và hiển thị kết quả.
AuthService: dịch vụ xác thực, xử lý đăng nhập/đăng xuất và tạo phiên.
Khoa khoa học và kỹ thuật máy tính
UserDB: lưu hồ sơ người dùng (mật khẩu băm, trạng thái, số lần đăng nhập sai, vai trò).
RBACPolicy: cung cấp vai trò/quyền và quyết định cho phép/từ chối theo action/resource.
SessionStore: lưu phiên đăng nhập (sessionId, userId, roles, permissions, hạn phiên).
ProtectedAPI: API tài nguyên bảo vệ, bắt buộc kiểm tra session và RBAC trước khi trả dữ liệu.
AuditLog: ghi nhận sự kiện đăng nhập thành công/thất bại.
4.7.1.2 Ràng buộc/chính sách

Phiên có idle timeout 30 phút.
Có thể logout khi đóng trình duyệt (tuỳ chọn).
Kiểm soát truy cập theo RBAC dựa trên role và theo module/function (action/resource).
4.7.1.a Đăng nhập
User nhập username/password trên WebApp.
WebApp gửi POST /login(credentials) tới AuthService.
AuthService tra cứu người dùng qua GetUserByUsername(username) trên UserDB và nhận về thông tin
hồ sơ (trạng thái, mật khẩu băm, số lần sai, vai trò hiện có).
AuthService kiểm tra tính hợp lệ của thông tin đăng nhập và xử lý theo hai nhánh:
Nhánh A – Sai thông tin (Invalid credentials):
Tăng bộ đếm đăng nhập sai: IncreaseFailCount(userId) trên UserDB.
Nếu failCount đạt 5, khoá tài khoản: LockAccount(userId).
Ghi log thất bại: LogLoginFail(username, ip) tới AuditLog.
Trả về WebApp 401 Unauthorized; WebApp hiển thị lỗi cho User.
Nhánh B – Đúng thông tin (Valid credentials):
Nạp vai trò và quyền: LoadRolesAndPermissions(userId) từ RBACPolicy.
Tạo phiên: CreateSession(userId, roles, permissions, idleTimeout=30m) trong Session-
Store, nhận về sessionId và expiresAt.
Ghi log thành công: LogLoginSuccess(userId, ip) tới AuditLog.
Trả về WebApp 200 OK kèm Set-Cookie: sessionId; WebApp chuyển hướng User về trang
home.
4.7.1.b Truy cập tài nguyên bảo vệ
User mở màn hình/tài nguyên bảo vệ trên WebApp.
WebApp gọi GET /resource tới ProtectedAPI kèm sessionId (từ cookie).
ProtectedAPI xác thực phiên bằng cách gọi ValidateSession(sessionId) tới SessionStore.
Xử lý theo trạng thái phiên:
Nhánh A – Phiên hết hạn hoặc thiếu (Session expired or missing):
SessionStore trả về invalid.
ProtectedAPI trả về 401 Unauthorized và yêu cầu clear cookie.
WebApp chuyển hướng User về trang đăng nhập.
Nhánh B – Phiên hợp lệ (Session valid):
SessionStore trả về userId, roles, permissions.
ProtectedAPI yêu cầu quyết định phân quyền: Authorize(userId, action, resource) tới
RBACPolicy.
Nếu PERMIT: ProtectedAPI trả 200 OK (data); WebApp render dữ liệu cho User.
Nếu DENY: ProtectedAPI trả 403 Forbidden; WebApp hiển thị thông báo không có quyền.
4.7.1.c Đăng xuất (tuỳ chọn khi đóng trình duyệt)
Khi User đóng trình duyệt, WebApp (nếu bật tính năng) gửi POST /logout(sessionId) tới AuthService.
AuthService thu hồi phiên: RevokeSession(sessionId) trong SessionStore.
AuthService trả 204 No Content cho WebApp.
Khoa khoa học và kỹ thuật máy tính
4.7.2 Luồng Direct Booking tại quầy (Tạo / Sửa / Hủy booking)
Hình 31: Tạo/Sửa/Hủy booking (Direct booking) (lễ tân thao tác)
4.7.2.1 Thành phần tham gia

Lễ tân (LễTân): thực hiện thao tác tạo/sửa/hủy booking trực tiếp tại quầy.
FrontDeskUI: màn hình DirectBooking, thu thập dữ liệu và hiển thị kết quả cho lễ tân.
BookingAPI: dịch vụ nghiệp vụ booking, điều phối các bước kiểm tra khách/phòng/giá và ghi nhận
trạng thái.
CustomerDB: lưu và tra cứu thông tin khách hàng.
AvailabilitySvc: kiểm tra phòng trống, giữ/giải phóng phòng theo ngày và loại phòng.
PricingSvc: tính giá phòng và tổng tiền (bao gồm dịch vụ, khuyến mãi nếu có).
Khoa khoa học và kỹ thuật máy tính
BookingDB: lưu booking, trạng thái, version (phục vụ khoá lạc quan).
NotificationSvc: gửi thông báo (ví dụ khi hủy booking).
AuditLog: ghi log nghiệp vụ (tạo/sửa/hủy booking).
4.7.2.2 Bối cảnh nghiệp vụ Luồng này phản ánh nhóm chức năng Quản lý booking của lễ tân: tạo booking
mới, tra cứu/chỉnh sửa và hủy booking; đồng thời đảm bảo xử lý đồng thời bằng optimistic locking để tránh
xung đột dữ liệu. :contentReference[oaicite:0]index=0

4.7.2.a Tạo booking (Direct booking)
Lễ tân mở màn hình DirectBooking trên FrontDeskUI và bắt đầu thao tác tạo booking.
FrontDeskUI gửi yêu cầu tạo booking tới BookingAPI:
CreateBooking(thông tin khách, loại phòng, ngày check-in, ngày check-out, dịch vụ
...)
BookingAPI tra cứu khách trên CustomerDB (theo các khoá như SĐT/tên/... ):
Nếu khách chưa tồn tại: BookingAPI tạo khách mới trên CustomerDB và nhận về CustomerID.
Nếu khách đã tồn tại: BookingAPI lấy CustomerID hiện có.
BookingAPI kiểm tra tình trạng phòng với AvailabilitySvc:
Kiểm tra phòng trống(ngày, loại phòng) → trả về danh sách phòng hợp lệ.
BookingAPI tính giá với PricingSvc:
Tính giá(phòng, dịch vụ, khuyến mãi nếu có) → trả về tổng tiền và chi tiết.
BookingAPI lưu booking vào BookingDB với trạng thái ban đầu Đã đặt và nhận về BookingID.
BookingAPI ghi log tạo booking vào AuditLog (sự kiện TạoBooking).
BookingAPI trả kết quả về FrontDeskUI (ví dụ: BookingID, trạng thái, tổng tiền); FrontDeskUI hiển thị
booking mới cho lễ tân.
4.7.2.b Sửa booking (Direct booking)
Lễ tân chỉnh sửa thông tin booking trên FrontDeskUI.
FrontDeskUI gửi yêu cầu cập nhật tới BookingAPI:
UpdateBooking(bookingKey, trường cần sửa)
BookingAPI lấy dữ liệu booking hiện tại từ BookingDB:
Lấy booking(bookingKey) → nhận BookingData + Version.
Nếu có thay đổi liên quan đến ngày/phòng: BookingAPI kiểm tra lại phòng với AvailabilitySvc (Kiểm tra
lại phòng nếu đổi ngày hoặc đổi phòng) và nhận kết quả kiểm tra.
Nếu có thay đổi ảnh hưởng giá: BookingAPI tính lại tổng tiền với PricingSvc (Tính lại giá nếu đổi
ngày, phòng, dịch vụ) và nhận tổng tiền mới.
BookingAPI cập nhật booking vào BookingDB theo cơ chế khoá lạc quan:
Cập nhật booking(Version optimistic)
Nhánh lỗi – xung đột version: BookingDB trả Conflict; hệ thống thông báo có thay đổi đồng
thời và yêu cầu tải lại trước khi sửa tiếp.
Nhánh thành công: BookingDB trả OK.
Khi cập nhật thành công, BookingAPI ghi log SửaBooking vào AuditLog.
BookingAPI trả kết quả cập nhật về FrontDeskUI; FrontDeskUI hiển thị booking sau khi sửa cho lễ tân.
4.7.2.c Hủy booking (Direct booking)
Lễ tân thực hiện hủy booking trên FrontDeskUI (kèm lý do).
FrontDeskUI gửi yêu cầu tới BookingAPI:
CancelBooking(bookingKey, lý do)
BookingAPI lấy booking hiện tại từ BookingDB để lấy BookingData + Version.
Khoa khoa học và kỹ thuật máy tính
BookingAPI cập nhật trạng thái booking sang Đã hủy theo optimistic locking:
Cập nhật trạng thái ĐãHủy(Version optimistic) → OK (nếu không xung đột).
BookingAPI giải phóng giữ phòng (nếu có) thông qua AvailabilitySvc:
Giải phóng giữ phòng nếu có → OK.
BookingAPI gửi thông báo hủy booking qua NotificationSvc.
BookingAPI ghi log HủyBooking vào AuditLog.
BookingAPI trả xác nhận ĐãHủy về FrontDeskUI; FrontDeskUI thông báo hủy thành công cho lễ tân.
4.7.3 Luồng xác nhận booking và gửi thông báo (Email/SMS)
Hình 32: Xác nhận booking + gửi thông báo Email/SMS (booking confirmation notification)
4.7.3.1 Thành phần tham gia

Khoa khoa học và kỹ thuật máy tính
Lễ tân (LễTân): thao tác xác nhận booking trên PMS.
PMS WebApp: giao diện PMS, gọi API xác nhận và hiển thị kết quả.
BookingService: xử lý nghiệp vụ xác nhận booking, cập nhật trạng thái và phát sự kiện.
BookingDB: lưu booking (trạng thái, thông tin liên hệ) và audit log.
NotificationService: nhận sự kiện booking đã xác nhận và điều phối gửi Email/SMS.
EmailProvider: nhà cung cấp gửi email.
SMSGateway: cổng gửi SMS.
Khách hàng: người nhận email/SMS xác nhận (nếu có kênh liên hệ).
4.7.3.a Lễ tân xác nhận booking
Lễ tân mở booking detail trên PMS WebApp và chọn Confirm booking.
PMS WebApp gọi POST /confirmBooking(bookingId) tới BookingService.
BookingService tải dữ liệu booking từ BookingDB: Load booking(bookingId) và nhận về booking data
status + contacts.
BookingService kiểm tra điều kiện xác nhận và xử lý theo nhánh:
Nhánh A – Booking không hợp lệ:
BookingService trả lỗi về PMS WebApp (ví dụ 400 hoặc 409 ).
PMS WebApp hiển thị lý do không thể xác nhận cho lễ tân.
Nhánh B – Booking hợp lệ:
BookingService cập nhật trạng thái booking sang CONFIRMED trong BookingDB (Update
status = CONFIRMED) và nhận OK.
BookingService ghi audit log (xác nhận bởi lễ tân, timestamp): Insert audit log(confirm by
LT, timestamp) và nhận OK.
BookingService phát sự kiện sang NotificationService: Publish BookingConfirmed(bookingId,
email, phone) và nhận Accepted.
BookingService trả về PMS WebApp 200 OK (status CONFIRMED); PMS WebApp hiển thị
trạng thái đã xác nhận.
4.7.3.b NotificationService gửi thông báo Email/SMS
NotificationService nhận sự kiện BookingConfirmed và thực hiện gửi thông báo nếu có thông tin liên hệ.
Xử lý theo dữ liệu liên hệ:
Không có email và không có số điện thoại:
Lưu notification log với trạng thái SKIPPED (no contact) vào BookingDB và nhận OK.
Có ít nhất một kênh liên hệ:
Email (nhánh tuỳ chọn):
∗ Nếu có email: gọi EmailProvider SendEmail(confirmation) và nhận Accepted(messageId).
∗ Nếu không có email: bỏ qua bước gửi email (Skip Email).
SMS (nhánh tuỳ chọn):
∗ Nếu có phone: gọi SMSGateway SendSMS(confirmation) và nhận Accepted(messageId).
∗ Nếu không có phone: bỏ qua bước gửi SMS (Skip SMS).
Lưu notification log (status, messageIds) vào BookingDB và nhận OK.
Nếu xảy ra lỗi từ provider (EmailProvider/SMSGateway):
∗ Đánh dấu bản ghi để retry (Mark for retry) và nhận OK.
Nếu thành công: khách hàng nhận được email/SMS xác nhận booking.
Khoa khoa học và kỹ thuật máy tính
4.7.4 Đồng bộ OTA hai chiều: Đẩy tồn phòng/giá và nhận booking qua webhook
Hình 33: Đồng bộ OTA 2 chiều: cập nhật phòng trống/giá + nhận booking từ OTA
4.7.4.1 Thành phần tham gia

PMS_Core: lõi PMS phát sinh thay đổi tồn phòng/giá.
InventorySvc: dịch vụ quản lý tồn phòng/allotment theo ngày và loại phòng.
RateSvc: dịch vụ quản lý rate plan/giá và các ràng buộc (restrictions).
OTA_SyncSvc: dịch vụ đồng bộ OTA, nhận sự kiện thay đổi để push sang OTA và điều phối xử lý
webhook.
ChannelMapping: ánh xạ định danh giữa PMS (roomType/ratePlan) và OTA (otaRoomId/otaRateId).
Khoa khoa học và kỹ thuật máy tính
OTA_Platform: nền tảng OTA nhận API cập nhật availability/rates.
OTA_Webhook: nguồn webhook từ OTA (BookingCreated, BookingChangedOrCancelled).
BookingSvc: xử lý nghiệp vụ tiếp nhận booking từ OTA (idempotency, kiểm tra tồn, tạo/cập nhật
booking).
BookingDB: lưu booking và dữ liệu idempotency (otaBookingId → bookingId), trạng thái/version.
AuditLog: ghi nhận sự kiện quan trọng (overbook, import booking,... ).
4.7.4.2 Nguyên tắc/chính sách

Đồng bộ hai chiều: PUSH availability/rates từ PMS lên OTA; RECEIVE booking qua webhook.
Webhook áp dụng idempotency để chống xử lý trùng (duplicate event).
PUSH API có retry + backoff khi OTA trả lỗi hoặc lỗi mạng.
4.7.4.a PUSH cập nhật availability/rates từ PMS lên OTA
PMS_Core cập nhật tồn phòng: UpdateRoomStatusOrAllotment(change) tới InventorySvc và nhận OK.
PMS_Core cập nhật giá: UpdateRatePlan(change) tới RateSvc và nhận OK.
PMS_Core phát sự kiện thay đổi sang OTA_SyncSvc: EmitChangeEvent(inventoryOrRateChange).
OTA_SyncSvc tra cứu ánh xạ kênh qua ChannelMapping: MapRoomAndRatePlan(pmsRoomType,
pmsRatePlan) → otaRoomId, otaRateId.
OTA_SyncSvc gọi OTA_Platform để cập nhật:
API UpdateAvailability(otaRoomId, dates, allotment) → 200 OK hoặc error.
API UpdateRates(otaRateId, dates, price, restrictions) → 200 OK hoặc error.
Nếu có lỗi khi PUSH, OTA_SyncSvc lập lịch ScheduleRetry(backoff) để gửi lại theo cơ chế retry.
4.7.4.b RECEIVE booking mới từ OTA (Webhook BookingCreated)
OTA_Webhook gửi webhook tạo booking tới BookingSvc: Webhook BookingCreated(otaBookingId,
stay, guest, price).
BookingSvc xác thực chữ ký và parse payload: ValidateSignatureAndParse(payload) → ParseEvent.
BookingSvc kiểm tra idempotency trong BookingDB: CheckIdempotency(otaBookingId).
Nếu duplicate event: đánh dấu alreadyProcessed và trả 200 OK (ignore duplicate) cho OTA.
Nếu new event: tiếp tục xử lý tạo booking.
BookingSvc ánh xạ định danh phòng/giá từ OTA về PMS: MapToPMS(otaRoomId, otaRateId) (qua
ChannelMapping) → pmsRoomType, pmsRatePlan.
BookingSvc kiểm tra tồn phòng: CheckAvailability(pmsRoomType, dates, qty) (InventorySvc).
Không còn phòng (overbook risk):
Ghi log: LogOverbook(otaBookingId) tới AuditLog → OK.
Trả lỗi cho OTA (ví dụ 409 Conflict / RejectBooking) và kích hoạt đồng bộ lại:
TriggerFullResync(availability).
Còn phòng:
Tạo booking trong BookingDB: CreateBookingFromOTA(otaBookingId, guest, dates,
price, channel) → bookingId.
Lưu trạng thái idempotency: SaveIdempotencyState(otaBookingId, bookingId) → OK.
Ghi audit import booking: LogBookingImported(bookingId, otaBookingId) → OK.
Trừ allotment sau khi tạo booking: DecreaseAllotmentAfterBooking(dates, roomType) →
OK.
OTA_SyncSvc PUSH lại availability sau booking: API UpdateAvailability(after booking)
→ 200 OK.
Trả 200 OK để acknowledge webhook.
Khoa khoa học và kỹ thuật máy tính
dOrCancelled) – tuỳ chọn 4.7.4.c RECEIVE huỷ hoặc sửa booking từ OTA (Webhook BookingChange-
tuỳ chọn
OTA_Webhook gửi webhook thay đổi/hủy: Webhook BookingChangedOrCancelled(otaBookingId,
newData) tới BookingSvc.
BookingSvc ValidateAndParse(payload) và áp dụng thay đổi: ApplyChangeOrCancel(otaBookingId,
newData) tới BookingDB.
BookingDB cập nhật booking: UpdateBooking(status or dates or room) → OK.
BookingSvc cập nhật tồn phòng theo thay đổi: ReleaseOrRecalculateAllotment(dates, roomType)
(InventorySvc) → OK.
OTA_SyncSvc PUSH availability sau thay đổi/hủy: API UpdateAvailability(after change) → 200
OK.
Trả 200 OK để acknowledge webhook.
Khoa khoa học và kỹ thuật máy tính
4.7.5 Luồng Check-in tại quầy (từ booking có sẵn): xác thực khách, gán phòng, thu cọc/thanh
toán, cấp keycard

Hình 34: Check-in: xác minh khách, ghi nhận đặt cọc/thu tiền, ghi nhận minibar ban đầu, gán phòng
4.7.5.1 Thành phần tham gia

FrontDeskStaff: nhân viên lễ tân thao tác check-in.
Guest: khách lưu trú cung cấp thông tin/giấy tờ và thực hiện thanh toán (nếu có).
PMS_WebApp: giao diện PMS cho lễ tân.
Khoa khoa học và kỹ thuật máy tính
BookingService: dịch vụ điều phối nghiệp vụ check-in theo booking.
CustomerService: cập nhật/chuẩn hoá thông tin khách và lưu xác thực danh tính.
RoomService: kiểm tra khả dụng và gán phòng (room assignment).
MemberService: áp dụng/quản lý quyền lợi hội viên (nếu có).
PaymentService: ghi nhận cọc/thanh toán và điều phối kênh thanh toán.
PaymentGateway: cổng thanh toán (khi phương thức là online).
KeyCardService: lập trình/cấp thẻ khoá phòng.
PMS_DB: lưu booking/check-in/customer/payment.
AuditLog: ghi log thao tác nghiệp vụ quan trọng.
4.7.5.2 Mục tiêu nghiệp vụ Luồng check-in bao gồm: kiểm tra booking, cập nhật thông tin khách, xác
thực danh tính, gán phòng, áp dụng quyền lợi hội viên, thu cọc/thanh toán, chuyển trạng thái sang CHECKED_IN
và cấp keycard.

4.7.5.a Mở màn hình Check-in và chọn booking
FrontDeskStaff mở màn hình Check-in trên PMS_WebApp.
Lễ tân tìm booking theo mã/điện thoại/tên (hoặc dữ liệu tương đương).
PMS_WebApp gọi BookingService để bắt đầu quy trình check-in cho booking đã chọn:
StartCheckin(bookingId).
BookingService tải dữ liệu booking từ PMS_DB (bao gồm trạng thái và liên hệ).
Nếu không tìm thấy booking hoặc booking không hợp lệ để check-in (ví dụ sai trạng thái, đã hủy,
đã check-in,... ) thì trả lỗi để PMS_WebApp hiển thị và dừng luồng.
4.7.5.b Nhập/cập nhật thông tin khách và tạo ngữ cảnh check-in
FrontDeskStaff nhập thông tin khách (tối thiểu tên, số điện thoại) và thông tin lưu trú (ngày ở, hạng
phòng/roomType).
PMS_WebApp gọi BookingService cập nhật/đồng bộ thông tin khách: CreateOrUpdateGuest(name,
phone) (hoặc tương đương).
BookingService gọi CustomerService để UpsertCustomer vào PMS_DB và nhận về customerId.
BookingService tạo bản ghi/ngữ cảnh check-in gắn với booking (hoặc cập nhật booking để sẵn sàng
check-in), sau đó tải lại dữ liệu liên quan (booking/customer profile) phục vụ các bước kế tiếp.
4.7.5.c Xác thực danh tính khách
FrontDeskStaff thực hiện xác thực giấy tờ (nhập số giấy tờ và/hoặc đính kèm ảnh scan).
PMS_WebApp gửi yêu cầu tới BookingService: VerifyIdentity(documentId, idScanOrInput).
BookingService chuyển sang CustomerService để lưu kết quả xác thực danh tính:
SaveIdentityVerification vào PMS_DB và nhận OK.
4.7.6 Gán phòng (Room assignment)
FrontDeskStaff chọn hạng phòng/phòng cụ thể.
PMS_WebApp gọi BookingService để gán phòng cho booking: AssignRoomToBooking(bookingId,
roomType, dates).
BookingService gọi RoomService kiểm tra khả dụng: CheckRoomAvailability(roomType, dates) (dữ
liệu từ PMS_DB).
Xử lý theo kết quả:
Không có phòng khả dụng: RoomService trả về not available → BookingService trả lỗi
Error(NoAvailability) để PMS_WebApp hiển thị cảnh báo “không thể gán phòng” và yêu cầu
chọn phương án khác.
Có phòng khả dụng: RoomService thực hiện AllocateRoomAndUpdate(bookingId) trên
PMS_DB, trả OK và BookingService phản hồi thành công cho PMS_WebApp.
Khoa khoa học và kỹ thuật máy tính
4.7.6.a Ghi nhận quyền lợi hội viên (nếu có)
Nếu khách thuộc nhóm hội viên/ưu đãi, including các benefit (ví dụ late checkout, upgrade,... ), lễ tân
chọn và ghi nhận trên PMS_WebApp.
PMS_WebApp gọi BookingService để áp dụng benefit; BookingService gọi MemberService lưu benefit
vào PMS_DB.
MemberService trả OK và PMS_WebApp hiển thị trạng thái benefit đã được ghi nhận.
4.7.6.b Thu cọc hoặc ghi nhận thanh toán
FrontDeskStaff nhập số tiền cọc/thodanh toán và chọn phương thức (online hoặc cash).
PMS_WebApp gọi BookingService: CreateDepositOrPayment(bookingId, amount, method).
BookingService chuyển sang PaymentService để tạo giao dịch/phiếu thu trong PMS_DB (trạng thái ban
đầu).
Xử lý theo phương thức:
Phương thức online (qua PaymentGateway):
PaymentService gọi RequestPayment(paymentId, amount) tới PaymentGateway và nhận kết
quả Success/Failed.
Nếu thất bại: PaymentService đánh dấu PaymentFailed (hoặc trạng thái tương đương),
PMS_WebApp hiển thị lỗi và cho phép lễ tân/khách đổi phương thức thanh toán.
Nếu thành công: PaymentService đánh dấu MarkPaymentAsPaid(paymentId) trong PMS_DB
và nhận OK.
Phương thức cash:
PaymentService đánh dấu đã thu tiền mặt MarkCashPaymentAsPaid(paymentId) trong
PMS_DB và nhận OK.
Sau khi thu cọc/thanh toán được ghi nhận, trạng thái “payment/deposit recorded” sẵn sàng cho bước xác
nhận check-in.
4.7.6.c Xác nhận Check-in, cập nhật trạng thái và cấp keycard
FrontDeskStaff nhấn Confirm Check-in trên PMS_WebApp.
PMS_WebApp gọi BookingService: ConfirmCheckin(bookingId, userId).
Điều kiện tiên quyết: nếu payment/deposit chưa được ghi nhận thì BookingService từ chối xác nhận
(PMS_WebApp hiển thị “Payment not recorded”).
Nếu hợp lệ, BookingService cập nhật trạng thái booking/check-in sang CHECKED_IN trong PMS_DB và
nhận OK.
BookingService ghi log nghiệp vụ tới AuditLog: LogCheckin(bookingId, FD) và nhận OK.
BookingService yêu cầu KeyCardService lập trình thẻ: ProgramKeys(roomId, validFrom, validTo) và
nhận kết quả issued.
PMS_WebApp hiển thị check-in thành công, in/hiển thị thông tin phòng và bàn giao keycard cho khách.
Khoa khoa học và kỹ thuật máy tính
4.7.7 Luồng quản lý Keycard (phát hành, giữ thẻ, hoàn thẻ, báo mất và cấp thẻ thay thế)
Hình 35: Quản lý thẻ khóa: phát hành / gửi-trả / mất thẻ → vô hiệu hóa & phát hành lại (luồng lễ tân)
4.7.7.1 Thành phần tham gia

FrontDesk: nhân viên lễ tân thao tác quản lý keycard.
Guest: khách nhận/trả keycard hoặc báo mất keycard.
PMS_WebApp: giao diện thao tác KeyCard Management.
BookingService: điều phối nghiệp vụ theo booking (issue/hold/return/lost/replacement).
Khoa khoa học và kỹ thuật máy tính
KeyCardService: dịch vụ lập trình keycard, đồng bộ trạng thái thẻ và ghi nhận lịch sử.
SmartLockSystem: hệ thống khoá cửa (nhận lệnh program/disable/enable).
KeyCardLedger: sổ cái/lưu lịch sử phát hành, giữ, hoàn, thay thế keycard.
BillingService: ghi nhận phí phạt/chi phí liên quan (ví dụ phí mất keycard).
AuditLog: log nghiệp vụ phục vụ truy vết.
4.7.7.2 Chính sách

Keycard được lập trình với room và validFrom/validTo.
Ledger lưu lịch sử issue/hold/return/lost/replacement phục vụ truy vết.
Khi keycard được hold (gửi lễ tân giữ), có thể áp dụng chính sách disable access trong thời gian giữ
thẻ.
4.7.7.a Mở màn hình KeyCard Management và tải ngữ cảnh
FrontDesk mở màn hình KeyCard Management trên PMS_WebApp.
PMS_WebApp yêu cầu BookingService cung cấp dữ liệu keycard theo booking: lấy bookingId, roomId,
validFrom, validTo, activeCards để lễ tân chọn thao tác.
4.7.7.b Phát hành keycard mới (Issue new keycard)
FrontDesk chọn cardId và nhấn Issue Card.
PMS_WebApp gọi BookingService: IssueCard(bookingId, roomId, cardId, validFrom, validTo).
BookingService chuyển yêu cầu sang KeyCardService để lập trình thẻ trên SmartLockSystem:
ProgramCard(cardId, roomId, validFrom, validTo).
Xử lý theo kết quả lập trình:
Program failed: KeyCardService trả lỗi ErrorProgramFailed để PMS_WebApp hiển thị và cho
phép thử lại.
Program OK:
KeyCardService ghi nhận trạng thái ACTIVE và liên kết thẻ với booking/room.
Ghi lịch sử vào KeyCardLedger (issue time, issuedBy, bookingId, roomId, cardId).
Ghi AuditLog sự kiện IssueCard.
BookingService trả về issuedCardId; PMS_WebApp hiển thị và lễ tân bàn giao thẻ cho Guest.
4.7.7.c Ghi nhận gửi thẻ tại lễ tân (Hold card)
Khi Guest gửi thẻ tại quầy, FrontDesk chọn thẻ và nhấn Hold Card.
PMS_WebApp gọi BookingService: HoldCard(cardId, bookingId).
BookingService yêu cầu KeyCardService:
Ghi nhận KeyCardLedger: HELD kèm timestamp và heldBy.
Tuỳ chọn theo policy: gọi SmartLockSystem DisableCard(cardId) để vô hiệu hoá quyền mở cửa
khi thẻ đang bị giữ.
Ghi AuditLog sự kiện HoldCard.
PMS_WebApp hiển thị trạng thái giữ thẻ; FrontDesk giữ thẻ tại quầy.
4.7.7.d Hoàn thẻ cho khách (Return held card)
Khi Guest quay lại nhận thẻ, FrontDesk chọn thẻ và nhấn Return Card.
PMS_WebApp gọi BookingService: ReturnCard(cardId, bookingId).
BookingService yêu cầu KeyCardService:
Cập nhật KeyCardLedger: RETURNED kèm timestamp và returnBy.
Nếu trước đó thẻ bị disable do hold: gọi SmartLockSystem EnableCard(cardId) để kích hoạt lại.
Ghi AuditLog sự kiện ReturnCard.
PMS_WebApp hiển thị hoàn thẻ thành công; FrontDesk trả thẻ cho Guest.
Khoa khoa học và kỹ thuật máy tính
4.7.7.e Báo mất keycard và cấp thẻ thay thế (Lost card and re-issue)
Guest báo mất thẻ; FrontDesk chọn thao tác Report Lost.
PMS_WebApp gọi BookingService: ReportLostCard(cardId, bookingId, roomId).
BookingService yêu cầu KeyCardService:
Gọi SmartLockSystem DisableCard(cardId) để vô hiệu hoá thẻ bị mất.
Cập nhật KeyCardLedger trạng thái LOST/DISABLED (kèm timestamp, byFD).
Ghi AuditLog sự kiện LostCard.
BookingService gọi BillingService để tạo phí phạt (nếu áp dụng): AddPenalty(bookingId,
type=LOST_KEYCARD_FEE).
FrontDesk thực hiện cấp thẻ thay thế:
PMS_WebApp gọi BookingService: IssueReplacementCard(bookingId, roomId, newCardId,
validFrom, validTo).
BookingService → KeyCardService → SmartLockSystem: ProgramCard(newCardId, roomId,
validFrom, validTo).
Nếu Program OK: ghi KeyCardLedger trạng thái ACTIVE với reason=REPLACEMENT và lưu
liên kết newCardId replaces oldCardId; đồng thời ghi AuditLog sự kiện IssueReplacementCard.
PMS_WebApp hiển thị kết quả; FrontDesk bàn giao thẻ thay thế cho Guest.
Khoa khoa học và kỹ thuật máy tính
4.8 Luồng Housekeeping dọn phòng và cập nhật trạng thái phòng
(WAIT_CLEAN → CLEANING → READY)
Hình 36: Cập nhật trạng thái phòng & minibar (Housekeeping workflow): Chờ dọn → Đang dọn → Sẵn sàng

checklist + minibar
4.8.0.1 Thành phần tham gia

Housekeeping Staff: nhân viên buồng phòng thao tác trên ứng dụng mobile.
HK Mobile App: ứng dụng buồng phòng (xem danh sách phòng được giao, cập nhật tiến độ, chuyển
trạng thái).
RBAC/Permission Svc: kiểm tra quyền (HK_VIEW_ROOMS, HK_UPDATE_ROOM_STATUS).
Room Service (PMS) và Room DB: đọc/ghi trạng thái phòng và danh sách phòng được giao.
Checklist Service và Checklist DB: lưu tiến độ checklist theo từng hạng mục dọn phòng.
Master Service: nghiệp vụ phụ trợ (ví dụ minibar).
Inventory/Purchase Svc và Inventory DB: điều chỉnh tồn kho theo minibar/tiêu hao và tạo yêu cầu
cấp phát/đặt bổ sung.
Maintenance/Task Svc và Maintenance DB: tạo yêu cầu sửa chữa khi phát hiện sự cố.
Khoa khoa học và kỹ thuật máy tính
NotificationEvent Bus và FrontDesk Dashboard: đẩy realtime trạng thái phòng (đặc biệt khi phòng
READY).
4.8.0.2 Quy ước trạng thái Workflow chuẩn của phòng trong luồng này: WAIT_CLEAN → CLEANING →
READY.

4.8.0.a Mở danh sách phòng được giao
Housekeeping Staff mở màn hình Assigned Rooms trên HK Mobile App.
HK Mobile App gọi RBAC/Permission Svc để kiểm tra quyền HK_VIEW_ROOMS; nếu hợp lệ trả OK.
HK Mobile App gọi Room Service (PMS) để lấy danh sách phòng được giao:
getAssignedRooms(hotelId).
Room Service truy vấn Room DB (phòng được giao + trạng thái hiện tại) và trả về rooms[].
HK Mobile App hiển thị danh sách phòng cùng trạng thái hiện tại cho nhân viên.
4.8.0.b Bắt đầu dọn phòng và chuyển sang CLEANING
Nhân viên chọn một phòng và thao tác Start cleaning.
HK Mobile App kiểm tra quyền HK_UPDATE_ROOM_STATUS qua RBAC/Permission Svc; nếu hợp lệ trả OK.
(Ghi chú nghiệp vụ) Cơ sở có thể yêu cầu thao tác an toàn trước khi vào phòng (ví dụ ngắt điện/cầu dao
trong một số tình huống).
HK Mobile App yêu cầu Room Service cập nhật trạng thái: updateRoomStatus(roomId, CLEANING).
Room Service cập nhật Room DB với cơ chế kiểm tra xung đột (reject nếu trạng thái đã bị thay đổi bởi
tác nhân khác), sau đó trả về OK (status=CLEANING) hoặc lỗi conflict.
4.8.0.c Thực hiện checklist dọn phòng và lưu tiến độ
Trong quá trình dọn, với mỗi hạng mục checklist, HK Mobile App ghi nhận hoàn thành:
saveProgress(roomId, itemId, done) tới Checklist Service.
Checklist Service upsert progress vào Checklist DB và trả OK.
Luồng này lặp lại cho đến khi hoàn tất toàn bộ checklist của phòng.
4.8.0.d Cập nhật minibar và điều chỉnh tồn kho (tuỳ chọn)
Nếu có minibar, HK Mobile App gửi dữ liệu tiêu hao/bổ sung: updateMinibar(roomId, consumed[],
restocked[]) tới Master Service.
Master Service yêu cầu Inventory/Purchase Svc điều chỉnh tồn kho theo phát sinh:
adjustInventory(consumed, restockId).
Inventory/Purchase Svc cập nhật Inventory DB (áp dụng chênh lệch tồn) và trả OK; Master Service phản
hồi OK về HK Mobile App.
4.8.0.e Yêu cầu bổ sung vật tư (tuỳ chọn)
Nếu phát hiện thiếu amenities/vật tư cần cấp bổ sung, HK Mobile App gửi yêu cầu:
createSupplyRequest(roomId, items[]) tới Inventory/Purchase Svc.
Inventory/Purchase Svc tạo request trong Inventory DB và trả về requestId/requested.
4.8.0.f Báo sự cố để tạo phiếu bảo trì (tuỳ chọn)
Nếu phát hiện sự cố (ví dụ rò rỉ, điện, thiết bị hỏng), nhân viên gửi mô tả và ảnh:
createMaintenanceTask(roomId, desc, photo) tới Maintenance/Task Svc.
Maintenance/Task Svc tạo phiếu trong Maintenance DB và trả trạng thái scheduled/created.
Khoa khoa học và kỹ thuật máy tính
4.8.0.g Nộp checklist hoàn tất và chuyển phòng sang READY
Khi đã dọn xong, HK Mobile App gửi thao tác hoàn tất checklist: submitChecklist(roomId) tới Checklist
Service.
Checklist Service cập nhật Checklist DB (set complete=true, completedAt=now) và trả OK.
Nhân viên thao tác Mark room READY.
HK Mobile App kiểm tra quyền HK_UPDATE_ROOM_STATUS và gọi Room Service:
updateRoomStatus(roomId, READY).
Room Service cập nhật Room DB (status=READY, cập nhật mốc thời gian liên quan nếu có) và trả OK.
Room Service phát sự kiện publishRoomReadyEvent(roomId, status=READY) lên NotificationEvent Bus.
NotificationEvent Bus đẩy cập nhật realtime tới FrontDesk Dashboard để lễ tân thấy phòng đã sẵn sàng
bán/nhận khách.
Khoa khoa học và kỹ thuật máy tính
4.8.1 Luồng xử lý sự cố/bảo trì (Incident): tạo phiếu, phân công, xử lý, hỗ trợ, hoàn tất và đóng
Hình 37: Xử lý sự cố/bảo trì (Incident): tạo phiếu, phân công, xử lý, hỗ trợ, hoàn tất và đóng
4.8.1.1 Thành phần tham gia

Reporter: người báo sự cố (có thể là lễ tân/housekeeping/nhân sự vận hành).
PMS_App: ứng dụng PMS dùng để tạo và theo dõi incident.
IncidentService: dịch vụ nghiệp vụ quản lý incident (tạo, phân công, cập nhật trạng thái, đóng).
IncidentDB: CSDL lưu incident, worklog, trạng thái và thông tin phân công.
Khoa khoa học và kỹ thuật máy tính
Notification: dịch vụ gửi thông báo sự kiện incident.
Manager: quản lý/điều phối (nhận incident mới, duyệt hỗ trợ, đóng incident).
Technician: kỹ thuật viên xử lý sự cố (nhận phân công, cập nhật tiến độ, yêu cầu hỗ trợ, resolve).
4.8.1.2 Trạng thái chính NEW → ASSIGNED → IN_PROGRESS → (WAITING_SUPPORT → IN_PROGRESS) →
RESOLVED → CLOSED.

4.8.1.a Tạo incident (Reporter)
Reporter tạo incident trên PMS_App.
PMS_App gọi IncidentService: CreateIncident(roomId, category, desc).
IncidentService tạo bản ghi incident trong IncidentDB với status=NEW: InsertIncident(status=NEW)
và nhận về incidentId.
IncidentService trả về PMS_App Created(incidentId); PMS_App hiển thị incident với trạng thái NEW.
IncidentService kích hoạt thông báo tới Manager: NotifyManagerNew(incidentId) qua Notification,
Manager nhận NewIncident(incidentId).
4.8.1.b Manager xem danh sách incident mở và phân công kỹ thuật viên
Manager mở màn hình danh sách incident.
PMS_App gọi IncidentService: ListOpenIncidents().
IncidentService truy vấn IncidentDB: SelectOpenIncidents() và trả về danh sách incidents.
Manager chọn một incident và phân công Technician (kèm độ ưu tiên).
PMS_App gọi IncidentService: AssignIncident(incidentId, techId, priority).
IncidentService cập nhật IncidentDB: UpdateAssign(status=ASSIGNED) và nhận OK.
IncidentService gửi thông báo phân công cho Technician: NotifyTechnicianAssigned(incidentId) qua
Notification, Technician nhận Assigned(incidentId).
4.8.1.c Technician bắt đầu xử lý và cập nhật IN_PROGRESS
Technician bắt đầu công việc (start work).
PMS_App gọi IncidentService: UpdateStatus(incidentId, IN_PROGRESS).
IncidentService cập nhật IncidentDB: UpdateStatus(IN_PROGRESS) và nhận OK.
IncidentService thông báo cho Reporter về thay đổi trạng thái:
NotifyReporterStatus_IN_PROGRESS(incidentId) qua Notification.
PMS_App hiển thị trạng thái IN_PROGRESS.
4.8.1.d Ghi worklog/cập nhật tiến độ (tuỳ chọn)
Technician (hoặc người xử lý) thêm ghi chú tiến độ.
PMS_App gọi IncidentService: AddWorklog(incidentId, note).
IncidentService ghi worklog vào IncidentDB: InsertWorklog() và nhận OK.
IncidentService cập nhật metadata incident (ví dụ updatedAt) trong IncidentDB:
UpdateIncident(updatedAt) và nhận OK.
IncidentService thông báo tiến độ cho Manager: NotifyManagerProgress(incidentId) qua Notification,
Manager nhận Progress(incidentId).
Khoa khoa học và kỹ thuật máy tính
4.8.1.e Yêu cầu hỗ trợ và phê duyệt hỗ trợ (nhánh điều kiện)
Nếu Technician cần hỗ trợ, PMS_App gọi IncidentService: RequestSupport(incidentId, detail).
IncidentService cập nhật IncidentDB: UpdateStatus(WAITING_SUPPORT) và nhận OK.
IncidentService thông báo cho Manager: NotifyManagerSupport(incidentId) qua Notification, Manager
nhận SupportNeeded(incidentId).
Manager duyệt hỗ trợ, PMS_App gọi IncidentService: ApproveSupport(incidentId).
IncidentService cập nhật IncidentDB đưa incident quay lại IN_PROGRESS: UpdateStatus(IN_PROGRESS)
và nhận OK.
4.8.1.f Resolve incident (Technician) và thông báo
Khi xử lý xong, Technician đánh dấu đã khắc phục kèm mô tả: PMS_App gọi
ResolveIncident(incidentId, resolution).
IncidentService cập nhật IncidentDB: UpdateStatus(RESOLVED) và nhận OK.
IncidentService thông báo cho Manager: NotifyManagerResolved(incidentId) (Manager nhận
Resolved(incidentId)).
IncidentService thông báo cho Reporter: NotifyReporterResolved(incidentId) (Reporter nhận
Resolved(incidentId)).
PMS_App hiển thị incident ở trạng thái RESOLVED.
4.8.1.g Đóng incident (Manager)
Manager thực hiện đóng incident sau khi xác nhận kết quả.
PMS_App gọi IncidentService: CloseIncident(incidentId).
IncidentService cập nhật IncidentDB: UpdateStatus(CLOSED) và nhận OK.
IncidentService gửi thông báo đóng incident tới các bên liên quan: NotifyAllClosed(incidentId) qua
Notification (Manager/Technician/Reporter nhận Closed(incidentId)).
PMS_App hiển thị incident ở trạng thái CLOSED.
Khoa khoa học và kỹ thuật máy tính
4.8.2 Luồng yêu cầu sửa chữa/thay thế thiết bị và cấp phát vật tư (Maintenance Request +
Warehouse Issue)

Hình 38: Yêu cầu thay thế/sửa chữa thiết bị (kỹ thuật tạo yêu cầu) → quản lý xét duyệt → triển khai
4.8.2.1 Thành phần tham gia

Technician: kỹ thuật viên tạo yêu cầu và thực hiện sửa chữa.
Manager: quản lý duyệt yêu cầu, phân công kỹ thuật viên, đóng yêu cầu.
WarehouseStaff: nhân viên kho xử lý cấp phát vật tư/phụ tùng.
Khoa khoa học và kỹ thuật máy tính
PMS_App: ứng dụng PMS để tạo/duyệt/cập nhật request.
EquipmentService: dịch vụ nghiệp vụ quản lý yêu cầu sửa chữa/thay thế thiết bị.
EquipmentDB: CSDL lưu request, trạng thái, phân công, worklog.
WarehouseService: dịch vụ nghiệp vụ kho (tạo phiếu xuất/cấp phát, cập nhật tồn).
WarehouseDB: CSDL kho (tồn, phiếu xuất/issue).
Notification: dịch vụ gửi thông báo cho Manager/Technician/WarehouseStaff.
4.8.2.2 Trạng thái chính Request: SUBMITTED → (REJECTED hoặc APPROVED) → IN_PROGRESS → DONE →
CLOSED.
Issue (phiếu cấp phát): PENDING → ISSUED.

4.8.2.a Tạo yêu cầu sửa chữa/thay thế (Technician/WarehouseStaff khởi tạo)
Người tạo (Technician hoặc WarehouseStaff) tạo request trên PMS_App.
PMS_App gọi EquipmentService: CreateRequest(assetId, type, desc).
EquipmentService ghi request vào EquipmentDB với status=SUBMITTED:
InsertRequest(status=SUBMITTED) và nhận về requestId.
EquipmentService trả Created(requestId, status=SUBMITTED) về PMS_App.
EquipmentService gửi thông báo cho Manager: NotifyManagerNewRequest(requestId) qua Notification.
4.8.2.b sub Manager review và ra quyết định (Reject hoặc Approve + Assign)
Manager mở màn hình review request trên PMS_App.
PMS_App gọi EquipmentService: GetRequest(requestId).
EquipmentService truy vấn EquipmentDB: SelectRequest(requestId) và trả requestData.
Manager quyết định theo hai nhánh:
Nhánh A – Reject request:
PMS_App gọi RejectRequest(requestId, reason).
EquipmentService cập nhật EquipmentDB: UpdateStatus(REJECTED) và nhận OK.
EquipmentService thông báo cho Technician: NotifyTechnicianRejected(requestId) qua No-
tification.
Nhánh B – Approve và phân công Technician:
PMS_App gọi ApproveRequest(requestId, assignedTechId, priority).
EquipmentService cập nhật EquipmentDB: UpdateStatus(APPROVED) và
UpdateAssignee(assignedTechId) → OK.
EquipmentService thông báo phân công: NotifyTechnicianAssigned(requestId) qua Notifi-
cation.
4.8.2.c Technician bắt đầu xử lý (Start work)
Technician bắt đầu làm việc trên request.
PMS_App gọi EquipmentService: UpdateStatus(requestId, IN_PROGRESS).
EquipmentService cập nhật EquipmentDB: UpdateStatus(IN_PROGRESS) và nhận OK.
4.8.2.d Yêu cầu vật tư/phụ tùng và kho cấp phát (tuỳ chọn)
Nếu cần vật tư/phụ tùng, Technician tạo yêu cầu cấp phát trên PMS_App.
PMS_App gọi WarehouseService: CreateIssueRequest(requestId, items[]).
WarehouseService tạo phiếu issue trong WarehouseDB với status=PENDING và trả về issueId.
WarehouseService thông báo cho WarehouseStaff: NotifyWarehouseIssuePending(issueId) qua Notifi-
cation.
WarehouseStaff xử lý cấp phát (có thể bao gồm bước duyệt/nút “Approve and issue items” trên
PMS_App):
- PMS_App gọi WarehouseService: IssueItems(issueId).
Khoa khoa học và kỹ thuật máy tính
WarehouseService trừ tồn và cập nhật WarehouseDB: UpdateInventory(...) và
UpdateIssueStatus(ISSUED) → OK.
WarehouseService thông báo cho Technician: NotifyTechnicianIssued(issueId) qua Notification.
4.8.2.e Cập nhật tiến độ (Update progress / Worklog)
Trong quá trình xử lý, Technician cập nhật tiến độ/ghi chú.
PMS_App gọi EquipmentService: AddWorklog(requestId, note).
EquipmentService ghi worklog vào EquipmentDB: InsertWorklog() và nhận OK.
4.8.2.f Hoàn tất xử lý (Mark completed)
Khi hoàn tất, Technician đánh dấu hoàn thành kèm kết quả.
PMS_App gọi EquipmentService: CompleteRequest(requestId, result).
EquipmentService cập nhật EquipmentDB: UpdateStatus(DONE) và nhận OK.
EquipmentService thông báo cho Manager: NotifyManagerDone(requestId) qua Notification.
4.8.2.g Đóng request (Close request)
Manager thực hiện đóng request sau khi xác nhận.
PMS_App gọi EquipmentService: CloseRequest(requestId).
EquipmentService cập nhật EquipmentDB: UpdateStatus(CLOSED) và nhận OK.
EquipmentService gửi thông báo đóng cho các bên liên quan: NotifyAllClosed(requestId) qua Notifi-
cation (Manager/Technician/WarehouseStaff nhận Closed(requestId)).
Khoa khoa học và kỹ thuật máy tính
4.8.3 Luồng xuất vật tư cho sửa chữa (Issue) và hoàn trả vật tư dư (Return) – có cơ chế reserve
tránh xuất trùng

Hình 39: Xuất/nhận vật tư liên quan sửa chữa: kỹ thuật nhận vật tư từ kho + kho xác nhận + cập nhật tồn
4.8.3.1 Thành phần tham gia

Technician: tạo yêu cầu xuất vật tư cho phiếu sửa chữa và đến nhận vật tư.
WarehouseStaff: nhân viên kho picking/chuẩn bị và bàn giao vật tư.
PMS_App: ứng dụng PMS để tạo issue request, xác nhận picking, xác nhận nhận hàng và tạo phiếu
hoàn.
Khoa khoa học và kỹ thuật máy tính
InventoryService: dịch vụ kho/vật tư điều phối kiểm tra tồn, reserve, tạo phiếu xuất, trừ tồn, hoàn tồn.
StockDB: CSDL tồn kho và log biến động tồn.
NotificationService: gửi thông báo cho kho/kỹ thuật khi vật tư sẵn sàng hoặc có phiếu hoàn.
4.8.3.2 Nguyên tắc nghiệp vụ

Tồn kho được cập nhật sau mỗi lần xuất (issue) hoặc nhập hoàn (return/receipt).
Dùng cơ chế reservation để ngăn double-issuing (xuất trùng do xử lý song song).
4.8.3.a Tạo yêu cầu xuất vật tư (Issue request) cho phiếu sửa chữa
Technician tạo material issue request trên PMS_App (gắn với repairTicketId và danh sách items).
PMS_App gọi InventoryService: CreateIssueRequest(repairTicketId, items).
InventoryService kiểm tra tồn khả dụng trong StockDB: CheckOnHand(items) → trả về StockStatus (ok
hoặc insufficient).
Xử lý theo kết quả:
Nhánh biết thiếu hàng (Insufficient stock):
InventoryService trả kết quả Reject hoặc Backorder(reason, suggestedQty).
PMS_App hiển thị lựa chọn out-of-stock/backorder options cho người dùng.
Nhánh đủ hàng (Stock available):
InventoryService tạo reserve trong StockDB: ReserveStock(requestId, items) → Reserved.
InventoryService tạo issue slip với trạng thái PENDING_PICK:
CreateIssueSlip(status=PENDING_PICK) → issueSlipNo.
InventoryService trả về PMS_App IssueSlipCreated(issueSlipNo).
NotificationService gửi thông báo tới WarehouseStaff: New issue slip to pick (issueSlipNo).
4.8.3.b Kho picking và xác nhận vật tư đã sẵn sàng
WarehouseStaff mở issue slip và thực hiện picking vật tư.
WarehouseStaff xác nhận đã pick trên PMS_App: ConfirmPicked(issueSlipNo, actualQty,
binLocation).
PMS_App chuyển yêu cầu tới InventoryService; InventoryService trừ tồn thực tế trong StockDB:
DeductOnHand(issueSlipNo, actualQty) → Updated.
InventoryService ghi nhật ký biến động tồn (xuất kho): LogStockMovement(type=ISSUE, issueSlipNo)
→ Logged.
InventoryService thông báo cho Technician vật tư sẵn sàng nhận: NotifyReadyForPickup(issueSlipNo)
qua NotificationService.
4.8.3.c Technician nhận vật tư và xác nhận receipt
Technician đến nhận vật tư (có thể scan/sign khi bàn giao).
PMS_App gọi InventoryService: ConfirmReceived(issueSlipNo, receivedQty).
InventoryService cập nhật trạng thái phiếu xuất: MarkIssueSlipCompleted(issueSlipNo)→ Completed.
InventoryService trả ReceiptConfirmed; PMS_App hiển thị Materials handover completed.
4.8.3.d Hoàn trả vật tư dư (Return unused materials) – tuỳ chọn
Nếu có vật tư chưa dùng, Technician tạo return receipt trên PMS_App.
PMS_App gọi InventoryService: CreateReturnReceipt(issueSlipNo, returnItems).
InventoryService cộng tồn lại trong StockDB: IncreaseOnHand(returnItems) → Updated.
InventoryService ghi nhật ký biến động tồn (nhập hoàn): LogStockMovement(type=RETURN,
issueSlipNo) → Logged.
InventoryService thông báo cho WarehouseStaff về phiếu hoàn: NotifyWarehouseReturn(returnReceiptNo)
qua NotificationService.
PMS_App hiển thị Return receipt created và Return completed sau khi hệ thống xác nhận.
Khoa khoa học và kỹ thuật máy tính
4.8.4 Luồng yêu cầu dịch vụ (Service Request): tạo yêu cầu, thực hiện, hoàn tất và ghi charge
vào folio

Hình 40: Tạo yêu cầu dịch vụ (dịch vụ bổ sung): tạo yêu cầu → cập nhật trạng thái thực hiện → ghi nhận vào
hóa đơn

Sequence 11
4.8.4.1 Thành phần tham gia

Guest: khách yêu cầu thêm dịch vụ (ví dụ giặt ủi, đưa đón, đặt đồ ăn,... ).
FrontDesk: lễ tân tiếp nhận yêu cầu và tạo service request.
ServiceStaff: nhân viên bộ phận dịch vụ thực hiện yêu cầu.
PMS_App: ứng dụng PMS để tạo/cập nhật service request.
BookingService: cung cấp ngữ cảnh lưu trú (booking/room/guest) và liên kết hiểu biết booking–folio.
ServiceRequestService: quản lý vòng đời yêu cầu dịch vụ.
ServiceCatalog: tra cứu danh mục dịch vụ và quy tắc giá.
BillingFolioService: ghi nhận charge vào folio/invoice của booking.
Khoa khoa học và kỹ thuật máy tính
NotificationService: gửi thông báo tới nhân viên dịch vụ khi có yêu cầu mới hoặc bị hủy.
PMSDB: lưu booking, folio, service request, và các line item tính tiền.
4.8.4.2 Trạng thái yêu cầu dịch vụ REQUESTED → IN_PROGRESS → COMPLETED (và ghi charge)
Nhánh tuỳ chọn: REQUESTED/IN_PROGRESS → CANCELLED (trước khi hoàn tất).

4.8.4.a Tạo service request (tiếp nhận từ khách)
Guest yêu cầu thêm dịch vụ và FrontDesk tiếp nhận yêu cầu.
FrontDesk thao tác Create service request trên PMS_App.
PMS_App lấy ngữ cảnh lưu trú từ BookingService: GetStayContext(roomOrGuest).
BookingService truy vấn PMSDB để lấy bookingId và folioId (query booking and folio) rồi trả về cho
PMS_App.
PMS_App gọi ServiceRequestService để tạo yêu cầu: CreateRequest(bookingId, serviceCode, qty,
schedule, note).
ServiceRequestService lấy quy tắc giá từ ServiceCatalog: GetServicePrice(serviceCode) (read catalog
and price) → trả price rules.
ServiceRequestService ghi bản ghi request vào PMSDB với trạng thái REQUESTED: Insert request
status REQUESTED và nhận về requestId.
ServiceRequestService trả Created(requestId) về PMS_App.
ServiceRequestService gửi thông báo cho ServiceStaff: Notify staff new request(requestId) qua No-
tificationService; ServiceStaff nhận NewRequest(requestId).
4.8.4.b Bắt đầu thực hiện dịch vụ (Start work)
ServiceStaff bắt đầu xử lý yêu cầu.
PMS_App gọi ServiceRequestService: UpdateStatus(requestId, IN_PROGRESS).
ServiceRequestService cập nhật trạng thái trong PMSDB sang IN_PROGRESS và trả OK.
4.8.4.c Hoàn tất dịch vụ và ghi charge vào folio
Khi hoàn tất, ServiceStaff cập nhật kết quả trên PMS_App: CompleteRequest(requestId, actualQty,
completionNote).
ServiceRequestService cập nhật trạng thái trong PMSDB sang COMPLETED và trả OK.
ServiceRequestService xác nhận số tiền cuối cùng dựa trên serviceCode và actualQty: Confirm final
amount(serviceCode, actualQty) và nhận về amount, tax.
ServiceRequestService ghi nhận phí dịch vụ vào folio thông qua BillingFolioService:
PostChargeToFolio(folioId, requestId, amount).
BillingFolioService ghi folio line item vào PMSDB và trả OK.
PMS_App nhận trạng thái FolioUpdated và hiển thị thông tin “Service posted to invoice” cho Front-
Desk/Guest khi cần.
4.8.4.d Hủy service request trước khi hoàn tất (tuỳ chọn)
Nếu cần hủy trước khi hoàn tất, FrontDesk thực hiện Cancel service request.
PMS_App gọi ServiceRequestService: CancelRequest(requestId, reason).
ServiceRequestService cập nhật trạng thái trong PMSDB sang CANCELLED và trả OK.
ServiceRequestService thông báo cho ServiceStaff: Notify staff cancelled(requestId) qua Notifica-
tionService; ServiceStaff nhận Cancelled(requestId).
Khoa khoa học và kỹ thuật máy tính
4.8.5 Luồng Car Rental Order: tạo đơn, điều chỉnh và huỷ (charge vào stay folio)
Hình 41: Luồng Car Rental Order: tạo đơn, điều chỉnh và huỷ
4.8.5.1 Thành phần tham gia

FrontDesk: lễ tân thao tác tạo/điều chỉnh/huỷ đơn thuê xe.
Guest: khách yêu cầu thuê xe, nhận thông báo xác nhận/cập nhật/huỷ.
PMS_WebApp: giao diện PMS.
RentalService: dịch vụ nghiệp vụ quản lý đơn thuê xe (rental order).
Khoa khoa học và kỹ thuật máy tính
FleetAvailability: kiểm tra/giữ chỗ khả dụng theo vehicleClass, pickupTime, returnTime.
RentalPolicyService: kiểm tra chính sách cho create/adjust/cancel và tính phí theo policy.
PricingService: tính giá thuê (base rate, tax, deposit,... ) và phần chênh lệch khi điều chỉnh.
BillingFolioService: ghi nhận charge/credit vào stay folio.
NotificationService: gửi thông báo cho khách (confirmation/update/cancel).
AuditLog: ghi log nghiệp vụ.
PMSDB: lưu booking/folio/rental order và folio line items.
4.8.5.2 Nguyên tắc nghiệp vụ

Tất cả khoản phí (tạo mới, điều chỉnh, huỷ) đều được post vào stay folio.
Policy quyết định có được phép adjust/cancel hay không và mức fee/refund.
Adjust/Cancel dùng expectedVersion (optimistic locking) để tránh cập nhật chồng lấn; nếu conflict thì
yêu cầu reload.
4.8.5.a Mở màn hình và nạp ngữ cảnh lưu trú
FrontDesk mở màn hình car rental.
PMS_WebApp tải stay context từ PMSDB (theo room/booking) để lấy bookingId và folioId.
4.8.5.b Tạo rental order (CREATE)
FrontDesk nhập thông tin thuê xe: vehicleClass, pickupTime, returnTime, driverInfo.
PMS_WebApp gọi RentalService: CreateRentalRequest(bookingId, folioId, details).
RentalService kiểm tra khả dụng với FleetAvailability: CheckAvailability(vehicleClass,
pickupTime, returnTime) → Available/NotAvailable.
Nhánh NotAvailable:
RentalService trả RejectNoAvailability; PMS_WebApp hiển thị phương án thay thế (Show alter-
natives).
Nhánh Available:
RentalService kiểm tra policy tạo mới: ValidateCreatePolicy(details) → PolicyOK.
RentalService tính giá với PricingService: CreateRental(details) → QuoteTotal (base rate, tax,
deposit).
RentalService lưu rental order vào PMSDB: InsertRentalOrder(status=CONFIRMED, details,
policySnapshot) → rentalOrderId.
RentalService post phí vào stay folio: PostChargeToFolio(folioId, rentalOrderId, amount).
BillingFolioService ghi folio line item vào PMSDB và trả OK.
RentalService ghi audit: Log(RentalOrderCreated, rentalOrderId, FD) → OK.
RentalService gửi xác nhận cho khách: SendRentalConfirmation(rentalOrderId) (Guest nhận
confirmation message).
PMS_WebApp nhận Created(rentalOrderId) và hiển thị confirmed order.
4.8.5.c Điều chỉnh rental order (ADJUST)
FrontDesk nhập thay đổi (ví dụ đổi returnTime/vehicleClass) và gửi yêu cầu:
AdjustRentalOrder(rentalId, patch, expectedVersion).
RentalService tải dữ liệu hiện tại từ PMSDB: LoadRentalOrderContext(rentalId) → details + status
version.
RentalService kiểm tra policy điều chỉnh: ValidateAdjustPolicy(rentalUpdatePatch) → Allowed +
feeRules.
RentalService kiểm tra lại khả dụng với FleetAvailability: CheckAvailability(newVehicleClass,
newPickupTime, newReturnTime).
Nhánh NotAvailable:
RentalService trả RejectNoAvailability; PMS_WebApp hiển thị cannot adjust.
Khoa khoa học và kỹ thuật máy tính
Nhánh Available:
RentalService yêu cầu báo giá lại phần chênh: RequoteRental(rentalDetailsPatch) →
NewQuote(newTotal, tax) + deltaAmount.
RentalService cập nhật rental order có kiểm soát version:
UpdateRentalOrderWithVersionControl(patch, expectedVersion) → Updated hoặc Con-
flict.
Nhánh Conflict:
PMS_WebApp yêu cầu người dùng tải lại (ConfirmReloadRequired) rồi thực hiện lại thao tác.
Nhánh Updated:
RentalService điều chỉnh charge trên folio theo deltaAmount (có thể là charge
hoặc credit): AdjustFolioCharges(rentalOrderId, deltaAmount). BillingFolioService ghi
AddChargeOrCredit(deltaAmount) vào PMSDB → OK.
RentalService ghi audit: Log(RentalOrderAdjusted, rentalOrderId, FD) → OK.
RentalService gửi thông báo cập nhật: SendRentalUpdate(rentalId) (Guest nhận update mes-
sage).
PMS_WebApp hiển thị updated order.
4.8.5.d Huỷ rental order (CANCEL)
FrontDesk yêu cầu huỷ (kèm lý do): CancelRentalOrder(rentalId, reason, expectedVersion).
RentalService tải context từ PMSDB: LoadRentalOrderContext(rentalId)→ details + status + version.
RentalService tính phí/hoàn theo policy: CalculateCancelFees(cancelTime) → cancelAllowed + can-
celFee + refundRule.
RentalService cập nhật trạng thái có kiểm soát version: UpdateStatusWithVersionControl(status=CANCELLED,
expectedVersion) → Updated hoặc Conflict.
Nhánh Conflict:
PMS_WebApp yêu cầu reload (ConfirmReloadRequired) trước khi huỷ lại.
Nhánh Updated:
RentalService giải phóng giữ chỗ: ReleaseReservation(rentalId) → OK.
RentalService post phí huỷ/hoàn tiền vào folio theo cancelFee/refundRule:
ApplyCancelFeeToFolio(folioId, rentalId, cancelFee, refundRule). BillingFolioService
ghi AddCancelFeeOrCredit(...) vào PMSDB → OK.
RentalService ghi audit: Log(CancelRental, rentalId, FD) → OK.
RentalService gửi thông báo huỷ: SendRentalCancel(rentalId) (Guest nhận cancel message).
PMS_WebApp hiển thị trạng thái cancelled.
Khoa khoa học và kỹ thuật máy tính
4.8.6 Luồng giặt ủi (Laundry Order): tạo đơn, nhận đồ, xử lý, trả đồ và ghi phí vào folio
Hình 42: Giặt ủi end-to-end: lễ tân tạo đơn → giặt ủi tiếp nhận & ký nhận → cập nhật trạng thái → thông
báo trả khách → ghi nhận phí

4.8.6.1 Thành phần tham gia

Guest: khách gửi đồ giặt và nhận lại đồ.
Front Desk Staff: lễ tân tạo/cập nhật/huỷ đơn theo yêu cầu khách và phối hợp với bộ phận giặt.
Laundry Staff: nhân viên giặt ủi tiếp nhận đồ, cập nhật tiến độ xử lý và trả đồ.
PMS (Web/App): giao diện thao tác.
Laundry Module/Service: dịch vụ nghiệp vụ quản lý đơn giặt ủi.
BillingFolioService: ghi nhận phí giặt ủi vào folio của booking.
Khoa khoa học và kỹ thuật máy tính
Notification Service (Email/SMS): gửi thông báo cho khách (đặc biệt khi đồ sẵn sàng trả).
PMS Database: lưu laundry order, trạng thái, biên nhận và line item tính tiền.
4.8.6.2 Trạng thái chính của Laundry Order CREATED → OPEN → RECEIVED → (WASHING → IRONING
(loop các bước xử lý)) → COMPLETED → READY_FOR_RETURN → DELIVERED.
Nhánh tuỳ chọn: CREATED/OPEN → CANCELLED (trước khi hoàn tất).

4.8.6.a Tạo laundry order (FrontDesk)
FrontDesk tạo đơn giặt theo yêu cầu khách: CreateLaundryOrder(guest, room, items,
serviceLevel) trên PMS.
PMS gọi Laundry Module/Service để ghi đơn vào PMS Database: Insert
laundry_order(status="CREATED") và nhận về orderId.
Laundry Module/Service phát sự kiện nội bộ: PublishNewOrder(orderId) để bộ phận giặt nhận biết đơn
mới.
PMS hiển thị kết quả Order created (orderId).
4.8.6.b Chỉnh sửa hoặc huỷ đơn trước khi nhận đồ (tuỳ chọn)
Edit trước khi nhận đồ:
FrontDesk cập nhật danh sách items/ghi chú: UpdateLaundryOrder(orderId, items, notes).
Laundry Module/Service cập nhật chi tiết đơn trong PMS Database và đồng bộ thông tin: Update
laundry_order(details) và SyncOrderUpdate(orderId).
PMS hiển thị Update confirmed.
Cancel trước khi hoàn tất:
FrontDesk huỷ đơn: CancelLaundryOrder(orderId, reason).
Laundry Module/Service cập nhật trạng thái trong PMS Database: Update
laundry_order(status="CANCELLED").
Laundry Module/Service phát thông báo nội bộ: NotifyCancellation(orderId).
PMS hiển thị Cancel confirmed.
4.8.6.c Laundry Staff xem danh sách đơn OPEN và nhận đồ
Laundry Staff mở danh sách đơn: ViewLaundryOrderList(filter="OPEN") trên PMS.
PMS truy vấn PMS Database: Query laundry_orders(status="OPEN") và trả về danh sách để hiển thị.
Khi nhận đồ từ khách/lễ tân, Laundry Staff thực hiện: ReceiveItems(orderId, inspection,
countedItems, signature).
Laundry Module/Service cập nhật trạng thái: Update status="RECEIVED" và lưu biên nhận/chữ ký vào
PMS Database.
Laundry Module/Service gửi thông báo nội bộ cho FrontDesk: NotifyInternal(FrontDesk, "items
received") để xác nhận đã nhận đồ.
4.8.6.d Xử lý giặt ủi và cập nhật tiến độ (loop)
Trong quá trình xử lý, Laundry Staff cập nhật trạng thái theo các bước:
UpdateStatus(orderId, "WASHING") → PMS Database cập nhật status="WASHING".
UpdateStatus(orderId, "IRONING") → PMS Database cập nhật status="IRONING".
UpdateStatus(orderId, "COMPLETED") → PMS Database cập nhật status="COMPLETED".
Sau khi hoàn tất, Laundry Staff đánh dấu sẵn sàng trả: MarkReadyForReturn(orderId)→ PMS Database
cập nhật status="READY_FOR_RETURN".
Hệ thống gửi Email/SMS cho khách: SendEmailSMS(Guest, "Laundry is ready") qua Notification Ser-
vice.
Khoa khoa học và kỹ thuật máy tính
4.8.6.e Trả đồ cho khách và ghi phí vào folio
Laundry Staff hoặc FrontDesk thực hiện trả đồ: ReturnItemsToGuest(orderId).
Laundry Module/Service cập nhật trạng thái DELIVERED trong PMS Database.
Laundry Module/Service post phí giặt vào folio của booking: PostLaundryChargeToFolio(bookingOrFolioId,
amount) thông qua BillingFolioService.
BillingFolioService ghi line item vào PMS Database: Insert folio_line_item(type="LAUNDRY",
amount) và trả về Charge posted (folioItemId).
PMS hiển thị/tạo bản in tóm tắt biên nhận: Print/Show receipt summary.
Khoa khoa học và kỹ thuật máy tính
4.8.7 Luồng thu tiền tại quầy: thanh toán folio bằng tiền mặt hoặc qua cổng thanh toán, sau
đó in/gửi biên nhận

Hình 43: Thanh toán đa phương thức / cổng thanh toán: tạo giao dịch → gọi payment gateway → nhận kết
quả → phát hành hóa đơn/biên lai

4.8.7.1 Thành phần tham gia

FrontDesk: lễ tân thực hiện thao tác thu tiền.
PMS_UI: giao diện PMS.
BillingFolio: mô-đun quản lý folio (tính số dư phải thu, áp payment vào folio).
Khoa khoa học và kỹ thuật máy tính
PaymentService: điều phối nghiệp vụ thu tiền (tạo giao dịch, gọi gateway hoặc ghi nhận cash, finaliza-
tion).
PaymentGateway: cổng thanh toán (online/card/QR,... ).
Cashbook: sổ quỹ/ghi nhận thu chi tiền mặt.
InvoiceReceiptService: tạo số chứng từ và phát hành hoá đơn/biên nhận.
NotificationService: gửi biên nhận cho khách (email/sms/link).
AuditLog: lưu vết nghiệp vụ.
PMSDB: lưu giao dịch, folio, chứng từ, audit.
4.8.7.2 Nguyên tắc nghiệp vụ

Khi thu tiền, hệ thống tạo transaction trước; thanh toán theo CASH hoặc GATEWAY.
Sau khi thanh toán thành công, hệ thống mới issue receipt/invoice và gửi cho khách.
Khi thanh toán thất bại, giao dịch được đánh dấu thất bại và mở khoá folio/transaction để thử lại.
4.8.7.a Mở folio và lấy số tiền cần thanh toán
FrontDesk mở folio và chọn Pay.
PMS_UI gọi BillingFolio để lấy số dư: GetAmountDue(folioId).
BillingFolio đọc số dư từ PMSDB: ReadFolioBalance(folioId) và trả về amountDue.
PMS_UI hiển thị số tiền phải thu.
4.8.7.b Tạo transaction thanh toán
FrontDesk chọn method (CASH hoặc GATEWAY) và nhập amount.
PMS_UI gọi PaymentService: CreateTransaction(folioId, method, amount).
PaymentService tạo giao dịch trạng thái PENDING và lock folio để tránh thanh toán trùng:
CreateTxnPendingAndLock(folioId) trong PMSDB, trả về txnId.
4.8.7.c Nhánh A – Thanh toán bằng tiền mặt (Method=CASH)
PaymentService ghi nhận thu tiền mặt vào Cashbook: PostCash(txnId, amount).
Cashbook ghi sổ và cập nhật số dư: InsertCashEntryAndUpdateBalance trong PMSDB, trả OK.
PaymentService áp dụng payment vào folio: ApplyPayment(txnId, folioId, amount).
BillingFolio cập nhật folio là đã thanh toán (hoặc cập nhật balance) trong PMSDB: UpdateFolioPaid →
OK.
PaymentService yêu cầu phát hành chứng từ: IssueReceiptOrInvoice(txnId) qua InvoiceReceiptSer-
vice.
InvoiceReceiptService tạo số chứng từ: CreateDocumentNumber trong PMSDB → docNo.
PaymentService ghi log thành công: LogPaymentSuccess(txnId) vào AuditLog; AuditLog lưu SaveAudit
vào PMSDB → OK.
PaymentService gửi chứng từ cho khách: SendDocument(docNo) qua NotificationService → accepted.
PMS_UI hiển thị Success(docNo).
4.8.7.d Nhánh B – Thanh toán qua cổng (Method=GATEWAY)
PaymentService khởi tạo thanh toán gateway: InitPayment(txnId, amount, method) tới PaymentGate-
way.
PaymentGateway trả về payUrl/token; PMS_UI hiển thị QR/URL để khách thanh toán.
PaymentService nhận kết quả thanh toán: PaymentResult(txnId, status) từ PaymentGateway.
Xử lý theo trạng thái:
status=SUCCESS:
PaymentService xác nhận/commit giao dịch: FinalizeCashOrGateway(txnId, amount) (ghi
nhận vào PMSDB) → OK.
Khoa khoa học và kỹ thuật máy tính
PaymentService áp payment vào folio: ApplyPayment(txnId, folioId, amount)→ BillingFolio
UpdateFolioPaid → OK.
PaymentService phát hành chứng từ: IssueReceiptOrInvoice(txnId)→ InvoiceReceiptService
CreateDocumentNumber(docNo).
PaymentService ghi AuditLog: LogPaymentSuccess(txnId) và AuditLog SaveAudit → OK.
PaymentService gửi chứng từ: SendDocument(docNo) qua NotificationService → accepted.
PMS_UI hiển thị Success(docNo).
status=FAIL:
PaymentService đánh dấu giao dịch thất bại và unlock folio để thử lại:
MarkTxnFailedAndUnlock(folioId/txnId) trong PMSDB → OK.
PMS_UI hiển thị Failed(tryAgain).
Khoa khoa học và kỹ thuật máy tính
4.8.8 Luồng Check-out: chốt folio, thu tiền, in hoá đơn/biên nhận, thu keycard và chuyển phòng
sang trạng thái cần dọn

Hình 44: Check-out & quyết toán: tổng hợp phòng + dịch vụ + minibar + giặt ủi → thanh toán → in/xuất
hóa đơn → đổi trạng thái phòng

4.8.8.1 Thành phần tham gia

Guest: khách yêu cầu trả phòng, thanh toán và hoàn tất thủ tục.
FrontDesk: lễ tân điều phối quy trình check-out tại quầy.
PMS UI: giao diện thao tác check-out.
Khoa khoa học và kỹ thuật máy tính
PMS Core: nghiệp vụ lõi (tải folio, post charge, ghi payment, đóng folio, cập nhật booking).
PMS DB: CSDL lưu folio items, payment records, booking status, settlement.
Payment Gateway: xử lý thanh toán không tiền mặt (thẻ/QR/chuyển khoản) khi áp dụng.
Invoice Service: phát hành hoá đơn/biên nhận.
Printer: in hoá đơn/biên nhận tại quầy.
Housekeeping App: nhận sự kiện phòng chuyển sang trạng thái cần dọn.
4.8.8.2 Mục tiêu nghiệp vụ Chốt toàn bộ khoản phát sinh, tính lại tổng và thuế, thu tiền, phát hành
chứng từ, thu hồi keycard (nếu có), đóng folio và chuyển trạng thái booking/phòng để Housekeeping dọn.

4.8.8.a Khởi tạo check-out và tải folio
Guest yêu cầu check-out; FrontDesk mở folio của stay trên PMS UI.
PMS UI yêu cầu PMS Core tải dữ liệu folio và tóm tắt stay: Load folio and stay summary.
PMS Core truy vấn PMS DB: Get room charges and postings và nhận về folio items.
PMS UI hiển thị danh sách charge hiện có cho lễ tân/khách.
4.8.8.b Xác nhận phát sinh và post thêm charge (minibar, dịch vụ) – tuỳ chọn
FrontDesk xác nhận minibar và extras.
PMS UI yêu cầu PMS Core post charge minibar: Post minibar usage.
PMS Core ghi vào PMS DB: Insert minibar charge → OK.
(Tuỳ chọn) Post thêm dịch vụ phát sinh (ví dụ laundry):
PMS UI gọi Post laundry charge.
PMS Core ghi Insert service charge vào PMS DB → OK.
PMS UI yêu cầu PMS Core recalculate: Recalculate total and taxes.
PMS Core lưu dữ liệu settlement: Save settlement data vào PMS DB → OK.
4.8.8.c Thu tiền (cash hoặc payment gateway) và xử lý thất bại
FrontDesk chọn phương thức thanh toán.
Hệ thống xử lý theo hai nhánh:
Thanh toán tiền mặt (Cash):
PMS UI ghi nhận Record cash payment.
PMS Core ghi Insert payment record vào PMS DB → OK.
Thanh toán không tiền mặt (Card/QR/Bank transfer) qua Payment Gateway:
PMS UI tạo giao dịch: Create payment transaction.
PMS Core gọi Payment Gateway để Authorize and capture.
Payment Gateway trả payment result.
PMS Core cập nhật trạng thái thanh toán trong PMS DB: Update payment status → OK.
Nhánh lỗi Payment failed:
PMS UI hiển thị lý do thất bại, cho phép retry hoặc đổi phương thức thanh toán.
4.8.8.d Phát hành hoá đơn/biên nhận và in chứng từ (khi payment success)
Khi payment success, PMS Core yêu cầu Invoice Service: Create invoice and receipt.
Invoice Service trả về invoice number and receipt data.
PMS Core gửi lệnh in: Print invoice and receipt tới Printer.
Printer trả Printed documents để lễ tân bàn giao cho khách.
Khoa khoa học và kỹ thuật máy tính
4.8.8.e Thu hồi keycard, đóng folio và chuyển phòng sang trạng thái cần dọn
FrontDesk thu keycard và (nếu có) tất toán/hoàn cọc theo quy trình nội bộ.
FrontDesk xác nhận key card returned trên PMS UI.
PMS Core thực hiện các cập nhật hậu check-out:
Deactivate key card and close folio trong PMS DB → OK.
Mark booking checked out trong PMS DB → OK.
Gửi sự kiện cho Housekeeping: Set room status TO_BE_CLEANED tới Housekeeping App → OK.
PMS UI hiển thị Checkout completed.
Khoa khoa học và kỹ thuật máy tính
4.8.9 Luồng phiếu thu/chi quỹ (Cash Voucher) và khoá sổ kỳ quỹ (Period Close)
Hình 45: Thu-chi & sổ quỹ (bao gồm khóa sổ): ghi nhận phiếu chi/thu → (nếu vượt ngưỡng) chủ KS phê duyệt
→ khóa sổ theo kỳ

4.8.9.1 Thành phần tham gia

Staff: nhân viên lập phiếu thu/chi.
Hotel Owner: chủ khách sạn (vai trò phê duyệt chi phí lớn).
PMS UI: giao diện thao tác quỹ.
Khoa khoa học và kỹ thuật máy tính
AuthService: kiểm tra quyền theo RBAC.
CashbookService: nghiệp vụ tạo phiếu, duyệt phiếu chi và khoá sổ.
Cash Ledger: sổ cái tiền mặt (ghi bút toán thu/chi và số dư theo kỳ).
Audit Log: ghi log nghiệp vụ quan trọng.
NotificationService: gửi thông báo (đặc biệt khi cần phê duyệt).
4.8.9.2 Chính sách nghiệp vụ

Staff ghi nhận phiếu thu hoặc phiếu chi.
Phiếu chi có thể yêu cầu phê duyệt khi: (i) voucher là expense và (ii) số tiền> 10,000,000 VND.
Mọi thao tác post/approve/reject/close kỳ đều ghi audit event.
4.8.9.a Staff tạo phiếu thu/chi
Staff tạo voucher trên PMS UI: Create voucher(type, amount, category, memo).
PMS UI kiểm tra quyền tạo phiếu qua AuthService: Check permission create_cash_voucher → Al-
lowed.
PMS UI gửi bản nháp voucher tới CashbookService: Submit voucher draft.
CashbookService Validate fields and policy (kiểm tra dữ liệu, giới hạn, loại phiếu).
Luồng rẽ nhánh theo loại và chính sách:
Nhánh A – Voucher là thu (income):
CashbookService ghi bút toán thu vào Cash Ledger: Post income entry → Posted.
CashbookService ghi audit: Write audit event vào Audit Log.
Trả về PMS UI Success and receipt number để in/hiển thị.
Nhánh B – Voucher là chi (expense):
B1: Chi vượt ngưỡng (amount> 10,000,000 VND) ⇒ cần phê duyệt
∗ CashbookService lưu phiếu ở trạng thái pending approval: Save as pending approval →
trả pendingId.
∗ CashbookService gửi thông báo đến Hotel Owner: Notify owner for approval qua Noti-
ficationService.
B2: Chi không vượt ngưỡng (amount ≤ 10,000,000 VND) ⇒ post ngay
∗ CashbookService ghi bút toán chi vào Cash Ledger: Post expense entry → Posted.
∗ CashbookService ghi audit: Write audit event.
∗ Trả về PMS UI Success and receipt number.
4.8.9.b Owner review phiếu chi chờ duyệt và Approve/Reject (chỉ áp dụng với expense vượt
ngưỡng)

Hotel Owner mở danh sách pending expense và chọn phiếu cần xử lý.
PMS UI kiểm tra quyền duyệt qua AuthService: Check permission approve_large_expense→ Allowed.
Owner chọn Approve hoặc Reject trên PMS UI; yêu cầu được gửi tới CashbookService: Approve or
reject(pendingId).
Xử lý theo nhánh:
Approve:
CashbookService ghi bút toán chi vào Cash Ledger: Post expense entry → Posted.
CashbookService ghi audit: Write audit event.
PMS UI nhận kết quả Approved and posted.
Reject:
CashbookService đánh dấu phiếu bị từ chối: Mark rejected → Rejected.
CashbookService ghi audit: Write audit event.
PMS UI nhận kết quả Rejected.
Khoa khoa học và kỹ thuật máy tính
4.8.9.c Khoá sổ kỳ quỹ (Period close: day/month/year)
Staff thực hiện Close period (day/month/year) trên PMS UI.
PMS UI kiểm tra quyền qua AuthService: Check permission close_cashbook_period → Allowed.
PMS UI gửi yêu cầu khoá sổ tới CashbookService: Request close period.
CashbookService kiểm tra còn phiếu chờ duyệt trong kỳ: Check pending vouchers in period trên Cash
Ledger → trả Pending count.
Rẽ nhánh:
Nếu còn pending: từ chối khoá sổ: Reject close (pending vouchers exist) để người dùng xử
lý duyệt trước.
Nếu không còn pending:
CashbookService lock period và tính toán số dư/tổng hợp: Lock period and calculate
balances → Locked with summary.
CashbookService ghi audit: Write audit event.
PMS UI nhận Close success and summary report link (liên kết báo cáo tổng hợp kỳ).
4.9 Class diagram
Hình 46: Class diagram: IAM + Security + Audit log
IAM + Security + Audit log
Khoa khoa học và kỹ thuật máy tính
Hình 47: Class diagram: Customer + Guest + Lịch sử lưu trú/VIP
Customer + Guest + Lịch sử lưu trú/VIP

Hình 48: Class diagram: Room + RoomType + Giá linh hoạt (rate) + Trạng thái phòng realtime
Room + RoomType + Giá linh hoạt (rate) + Trạng thái phòng realtime

Khoa khoa học và kỹ thuật máy tính
Hình 49: Class diagram: Booking + Stay + KeyCard + Check-in/out (luồng lễ tân)
Booking + Stay + KeyCard + Check-in/out (luồng lễ tân)

Hình 50: Class diagram: Housekeeping + Checklist + Minibar + Báo sự cố (buồng phòng)
Housekeeping + Checklist + Minibar + Báo sự cố (buồng phòng)

Khoa khoa học và kỹ thuật máy tính
Hình 51: Class diagram: Service Catalog + Service Request + Laundry + Car Rental
Service Catalog + Service Request + Laundry + Car Rental

Hình 52: Class diagram: Billing + Payment + Cashbook + Expense Voucher (thu chi)
Billing + Payment + Cashbook + Expense Voucher (thu chi)

Khoa khoa học và kỹ thuật máy tính
Hình 53: Class diagram: Inventory/Warehouse (nhập, xuất, tồn, cảnh báo sắp hết)
Inventory/Warehouse (nhập, xuất, tồn, cảnh báo sắp hết)

Khoa khoa học và kỹ thuật máy tính
Hình 54: Class diagram: Asset/Maintenance + Incident (sự cố, phân công, tiến độ)
Asset/Maintenance + Incident (sự cố, phân công, tiến độ)

Khoa khoa học và kỹ thuật máy tính
Hình 55: Class diagram: Integration (OTA, Payment Gateway, Email/SMS)
Integration (OTA, Payment Gateway, Email/SMS)

Khoa khoa học và kỹ thuật máy tính
4.10 ERD diagram
Hình 56: Enter Caption
Khoa khoa học và kỹ thuật máy tính
Hình 57: Relational Mapping of EERD
5 Triển khai hệ thống
5.1 Wireframe Design (Thiết kế khung giao diện)
Wireframe là bản thiết kế giao diện người dùng (UI) ở mức độ chi tiết trung bình (mid-fidelity), thể hiện cấu
trúc, bố cục và luồng tương tác của hệ thống HotelPro. Wireframe được thiết kế dựa trên các use case đã phân
tích ở Chương 3, tập trung vào trải nghiệm người dùng nội bộ (nhân viên khách sạn).

5.1.1 Nguyên tắc thiết kế
Consistency (Nhất quán): Duy trì cùng một pattern thiết kế xuyên suốt hệ thống
Efficiency (Hiệu quả): Giảm thiểu số bước thao tác để hoàn thành công việc
Clarity (Rõ ràng): Thông tin được trình bày trực quan, dễ hiểu
Feedback (Phản hồi): Hệ thống luôn cung cấp phản hồi về hành động của người dùng
Error Prevention (Phòng ngừa lỗi): Thiết kế hướng dẫn người dùng tránh sai sót
Khoa khoa học và kỹ thuật máy tính
5.1.2 Cấu trúc Layout chung
Hệ thống sử dụng layout cố định với 3 thành phần chính:

Left Sidebar Navigation (290px): Menu điều hướng chính cố định bên trái
Top Header Bar (60px): Thanh header với breadcrumb, tìm kiếm và thông tin user
Main Content Area (fluid): Khu vực nội dung chính, responsive theo kích thước màn hình
5.2 Thiết kế luồng người dùng (User Flow Design)
5.2.1 Luồng chính của hệ thống
Hệ thống HotelPro được thiết kế với các luồng nghiệp vụ chính sau:

5.2.1.1 Flow 1: Luồng đặt phòng và nhận phòng

Bước 1: Tạo booking
Lễ tân truy cập module "Lịch đặt phòng"
Chọn "Thêm mới" → Form tạo booking
Nhập thông tin: Khách hàng, Ngày check-in/out, Loại phòng
Hệ thống tự động tính giá dựa trên số ngày và loại phòng
Xác nhận tạo booking
Bước 2: Xác nhận booking
Quản lý xem danh sách booking chờ xác nhận
Kiểm tra thông tin và tình trạng phòng
Phê duyệt booking → Trạng thái chuyển "Đã xác nhận"
Gửi email xác nhận tới khách hàng
Bước 3: Check-in
Lễ tân tìm kiếm booking theo mã/tên khách/SĐT
Xác nhận thông tin khách hàng
Quét CCCD/Passport (nếu có)
Phân phòng cụ thể (nếu chưa phân)
Yêu cầu đặt cọc (nếu có)
Hoàn tất check-in → Phòng chuyển trạng thái "Occupied"
In key card và hóa đơn tạm
Bước 4: Check-out
Lễ tân xem booking đang lưu trú
Kiểm tra minibar, dịch vụ phát sinh
Tính tổng hóa đơn (phòng + dịch vụ + minibar)
Thu tiền (tiền mặt/thẻ/chuyển khoản)
In hóa đơn VAT (nếu yêu cầu)
Hoàn tất check-out → Phòng chuyển "Đang dọn"
Minh họa:
[Lịch đặt phòng]→ [Tạo booking]→ [Quản lý xác nhận]
→ [Check-in]→ [Khách lưu trú]→ [Check-out]
→ [Thanh toán]→ [Kết thúc]

5.2.1.2 Flow 2: Luồng quản lý phòng và dọn phòng

Bước 1: Xem trạng thái phòng
Buồng phòng đăng nhập → Dashboard hiển thị phòng được phân công
Xem danh sách phòng: Trống, Đang sử dụng, Cần dọn, Bảo trì
Lọc theo tầng/trạng thái
Xem chi tiết từng phòng (khách đang ở, check-out dự kiến)
Bước 2: Cập nhật trạng thái "Đang dọn"
Chọn phòng cần dọn
Nhấn "Bắt đầu dọn" → Hệ thống ghi thời gian bắt đầu
Checklist dọn phòng hiển thị:
Khoa khoa học và kỹ thuật máy tính
Thu dọn rác
Đổi ga, gối, khăn
Lau dọn phòng
Vệ sinh phòng tắm
Kiểm tra minibar
Bổ sung amenities
Hút bụi
Kiểm tra thiết bị
Tick từng mục khi hoàn thành
Bước 3: Cập nhật minibar
Trong quá trình dọn → Chọn "Cập nhật minibar"
Nhập số lượng còn lại từng loại hàng
Hệ thống tự tính: Đã tiêu thụ = Chuẩn - Còn lại
Nếu khách đang ở → Tính tiền vào hóa đơn phòng
Nếu thiếu hàng → Đề xuất bổ sung
Bước 4: Hoàn thành dọn phòng
Xác nhận tất cả checklist đã hoàn thành
Chụp ảnh phòng sau dọn (tùy chọn)
Nhấn "Hoàn thành" → Phòng chuyển "Sẵn sàng"
Hệ thống tính thời gian dọn
Gửi thông báo "Phòng XXX sẵn sàng" cho Lễ tân
Bước 5: Báo cáo sự cố (nếu có)
Nếu phát hiện hư hỏng → Chọn "Báo cáo sự cố"
Chọn loại: Điện, Nước, Điều hòa, Thiết bị hỏng
Mô tả chi tiết + Chụp ảnh
Đánh giá mức độ: Nhẹ, Trung bình, Nghiêm trọng
Hệ thống tự tạo sự cố → Gửi Kỹ thuật
Phòng chuyển "Bảo trì"
Minh họa:
[Xem phòng cần dọn]→ [Bắt đầu dọn]→ [Checklist]
→ [Cập nhật minibar]→ [Hoàn thành]→ [Sẵn sàng]

[Phát hiện hư hỏng]→ [Báo cáo sự cố]→ [Bảo trì]

5.2.1.3 Flow 3: Luồng quản lý dịch vụ và thu chi

Bước 1: Khách yêu cầu dịch vụ
Lễ tán nhận yêu cầu dịch vụ (giặt ủi, thuê xe, order đồ ăn)
Tạo đơn dịch vụ → Nhập: Loại dịch vụ, Số lượng, Thời gian
Hệ thống tự tính giá
Ghi vào hóa đơn phòng hoặc thu ngay
Bước 2: Xử lý dịch vụ giặt ủi
Buồng phòng nhận quần áo → Kiểm đếm cùng khách
Nhập vào hệ thống: Loại đồ, Số lượng, Tình trạng
Chụp ảnh vết bẩn/hư hỏng
Chọn dịch vụ: Giặt thường, Giặt khô, Ủi, Giặt nhanh
Hệ thống tính giá + Phụ phí
In phiếu tiếp nhận 2 bản (khách + lưu)
Nhân viên giặt ủi nhận đồ → Cập nhật trạng thái "Đang giặt"
Hoàn thành → "Đã hoàn thành" → Thông báo Lễ tân
Bước 3: Quản lý thu chi
Lễ tân ghi nhận thu từ các nguồn: Phòng, Dịch vụ, Minibar, Giặt, Xe
Tạo phiếu thu PT-YYYYMMDD-XXX
Ghi vào sổ quỹ
Quản lý tạo phiếu đề nghị chi → Quản lý duyệt
Cuối ngày: Quản lý khóa sổ quỹ
Khoa khoa học và kỹ thuật máy tính
Đối chiếu tiền thực tế vs hệ thống
Tạo báo cáo PDF
5.2.1.4 Flow 4: Luồng báo cáo và phân tích

Dashboard tổng quan
Doanh thu hôm nay/tuần/tháng
Công suất phòng (Occupancy Rate)
Số khách check-in hôm nay
Phòng cần dọn
Biểu đồ xu hướng doanh thu
Báo cáo doanh thu
Chọn kỳ: Tháng, Quý, Năm
Doanh thu theo nguồn (
Top 10 khách VIP
ADR, RevPAR
So sánh cùng kỳ năm trước
Xuất Excel/PDF
Báo cáo lợi nhuận
Tổng doanh thu
Tổng chi phí (theo loại)
Lợi nhuận = Doanh thu - Chi phí
Biên lợi nhuận %
Xu hướng lãi/lỗ
Dự báo tháng tới
5.3 Thiết kế chi tiết giao diện (Detailed Design)
5.3.1 Màn hình 1: Tổng quan (Dashboard)
Hình 58: Màn hình tổng quan hệ thống HOTELPRO
5.3.1.1 Mục đích Cung cấp cái nhìn tổng quan về tình hình vận hành khách sạn trong ngày/tuần/tháng.

Khoa khoa học và kỹ thuật máy tính
5.3.1.2 Thành phần giao diện

Header Section
Breadcrumb: Vai trò: Chủ khách sạn
Tên người dùng + Avatar góc phải
Nút Logout
KPI Cards (4 cards ngang)
Card 1 - Doanh thu hôm nay: 1.500.000 đ (icon $)
Card 2 - Công suất phòng: 60% (icon giường)
Card 3 - Lượt khách Check-in: 5 (icon check)
Card 4 - Phòng cần dọn: 1 (icon cảnh báo cam)
Biểu đồ Hiệu suất vận hành tuần
Loại: Line chart
Trục X: T2, T3, T4, T5, T6, T7, CN
Trục Y: Doanh thu (VNĐ) từ 0 - 12M
Màu đường: Blue (#5B8DEE)
Tooltip: Hover hiển thị số liệu chính xác
Xu hướng: Tăng dần T2→T7, giảm CN
5.3.1.3 Màu sắc và Typography

Background: White (#FFFFFF)
Cards background: Light gray (#F5F5F5)
Primary text: Dark gray (#333333)
Numbers: Bold, 24px
Labels: Regular, 14px
Icons: 32x32px, color-coded theo ý nghĩa
5.3.1.4 Tương tác

Click vào card → Chuyển tới module tương ứng
Hover vào điểm trên chart → Hiển thị tooltip
Responsive: Trên mobile, cards xếp dọc 1 cột
5.3.2 Màn hình 2: Lịch đặt phòng (Timeline)
Hình 59: Màn hình lịch đặt phòng hệ thống HOTELPRO
Khoa khoa học và kỹ thuật máy tính
5.3.2.1 Mục đích Hiển thị lịch đặt phòng theo timeline để dễ dàng quản lý và tránh trùng lặp.

5.3.2.2 Thành phần giao diện

Timeline Header
Tiêu đề: "Lịch đặt phòng (Timeline)"
Cột ngày: 25/10, 26/10, 27/10, 28/10, 29/10, 30/10, 31/10, 01/11
Scroll ngang để xem thêm ngày
Room List (cột trái)
P.101 - STANDARD DOUBLE
P.102 - STANDARD DOUBLE
P.201 - DELUXE KING
P.202 - DELUXE KING
P.301 - SUITE
Booking Bars
P.101: Nguyễn Văn A (25/10-27/10) - Màu xanh lá
P.202: Trần Thị B (26/10-28/10) - Màu xanh lá
P.301: Le David (28/10-31/10) - Màu xanh dương
Độ dài bar = Số ngày lưu trú
Hover: Hiển thị thông tin booking đầy đủ
Màu sắc phân biệt
Xanh lá: Booking đã xác nhận
Xanh dương: Đang lưu trú (checked-in)
Cam: Chờ xác nhận
Đỏ: Đã hủy
Xám: Đã check-out
5.3.2.3 Tương tác

Click vào booking bar → Popup chi tiết booking
Click vào ô trống → Tạo booking mới cho phòng đó
Drag & drop bar → Thay đổi ngày (nếu phòng trống)
Scroll ngang xem timeline dài hơn
Khoa khoa học và kỹ thuật máy tính
5.3.3 Màn hình 3: Báo cáo doanh thu
Hình 60: Màn hình báo cáo doanh thu hệ thống HOTELPRO
5.3.3.1 Mục đích Phân tích doanh thu chi tiết theo nguồn và xu hướng.

5.3.3.2 Thành phần giao diện

Tỷ lệ lấp đầy (%) - Bar Chart
Trục X: T2 (40%), T3 (35%), T4 (50%), T5 (45%), T6 (85%), T7 (95%), CN (80%)
Trục Y: Occupancy (0-100%)
Màu cột: Blue gradient
Tooltip: "T3: occupancy 35%"
Cơ cấu nguồn khách - Pie Chart
Tím: Agoda - 40%
Xanh: Booking.com - 50%
Xanh lá: Trực tiếp - 10%
Label kèm % trên từng phần
Xu hướng doanh thu tuần - Line Chart
Tương tự Dashboard nhưng chi tiết hơn
Có thể chọn kỳ: Tuần này, Tháng này, Quý này
So sánh với kỳ trước (đường nét đứt)
5.3.3.3 Export và Filter

Nút "Xuất báo cáo" góc phải → Chọn Excel/PDF
Filter: Chọn khoảng thời gian tùy chỉnh
Nút "So sánh với kỳ trước" → Hiển thị 2 đường
Khoa khoa học và kỹ thuật máy tính
5.3.4 Màn hình 4: Quản lý kênh OTA
Hình 61: Màn hình quản lý OTA hệ thống HOTELPRO
5.3.4.1 Mục đích Quản lý kết nối với các kênh đặt phòng online (Booking.com, Agoda, Traveloka).

5.3.4.2 Thành phần giao diện

Nút "Kết nối kênh mới" (góc phải)
OTA Cards (3 cards ngang)
Card 1 - Booking.com
Icon: Globe
Trạng thái: "Đã kết nối" (badge xanh)
Hoa hồng: 15%
Đồng bộ cuối: 10 phút trước
Nút: "Đóng bộ" (reload icon)
Nút: "Cài đặt" (settings icon)
Card 2 - Agoda
Icon: Globe
Trạng thái: "Đã kết nối" (badge xanh)
Hoa hồng: 18%
Đồng bộ cuối: 5 phút trước
Nút: "Đóng bộ", "Cài đặt"
Card 3 - Traveloka
Icon: Globe
Trạng thái: "Ngắt kết nối" (badge đỏ)
Hoa hồng: 15%
Đồng bộ cuối: 2 ngày trước
Nút: "Đồng bộ" (disabled)
Nút: "Cài đặt"
5.3.4.3 Tương tác

Click "Đồng bộ" → Gọi API OTA, cập nhật giá & availability
Click "Cài đặt" → Popup cấu hình: API key, Room mapping, Pricing rules
Click "Kết nối kênh mới" → Form nhập thông tin OTA mới
Khoa khoa học và kỹ thuật máy tính
5.3.5 Màn hình 5: Danh sách phòng
Hình 62: Màn hình quản lý phòng, hạng phòng hệ thống HOTELPRO
5.3.5.1 Mục đích Hiển thị danh sách tất cả phòng với trạng thái real-time.

5.3.5.2 Thành phần giao diện

Header với nút "Thêm mới" (góc phải)
Table (3 cột)
Cột 1 - Số phòng: 101, 102, 201, 202, 301
Cột 2 - Hạng: Standard Double, Deluxe King, Suite
Cột 3 - Trạng thái:
101: OCCUPIED
102: VACANT
201: VACANT
202: OCCUPIED
301: OCCUPIED
Icon edit (bút) và delete (thùng rác) mỗi dòng
5.3.5.3 Tương tác

Click số phòng → Chi tiết phòng (lịch sử booking, sự cố)
Click edit → Form sửa thông tin phòng
Click delete → Confirm dialog → Xóa phòng
Click "Thêm mới" → Form tạo phòng mới
Khoa khoa học và kỹ thuật máy tính
5.3.6 Màn hình 6: Danh mục Dịch vụ lẻ
Hình 63: Màn hình quản lý dịch vụ hệ thống HOTELPRO
5.3.6.1 Mục đích Quản lý danh sách dịch vụ lẻ (nước suối, thuê xe, giặt ủi) với giá.

5.3.6.2 Thành phần giao diện

Header với nút "Thêm mới"
Table (3 cột)
Cột 1 - Tên dịch vụ: Giặt là (Kg), Thuê xe máy, Nước suối
Cột 2 - Đơn giá: 20.000 đ, 150.000 đ, 10.000 đ
Cột 3 - Đơn vị: kg, ngày, chai
Icon edit và delete mỗi dòng
5.3.6.3 Business Logic

Giá có thể thay đổi theo mùa
Giặt ủi tính theo kg hoặc theo món
Thuê xe tính theo ngày, có thể có phụ phí bảo hiểm
Khoa khoa học và kỹ thuật máy tính
5.3.7 Màn hình 7: Danh sách Đối tác
Hình 64: Màn hình quản lý đối tác hệ thống HOTELPRO
5.3.7.1 Mục đích Quản lý thông tin đối tác (agency, supplier).

5.3.7.2 Thành phần giao diện

Table (3 cột)
Cột 1 - Tên đối tác: Công ty Du lịch Việt, Nhà giặt ủi Sạch
Cột 2 - Loại: Agency (badge tím), Supplier (badge xanh)
Cột 3 - Liên hệ: 02839393939, 0988776655
Icon edit và delete
5.3.7.3 Chi tiết Đối tác

Agency: Hoa hồng %, Hợp đồng, Lịch sử booking
Supplier: Sản phẩm cung cấp, Giá, Lịch sử mua hàng
Khoa khoa học và kỹ thuật máy tính
5.3.8 Màn hình 8: Sổ cái Tài chính
Hình 65: Màn hình quản lý tài chính hệ thống HOTELPRO
5.3.8.1 Mục đích Theo dõi thu chi hàng ngày (General Ledger).

5.3.8.2 Thành phần giao diện

Header với nút "Thêm mới"
Table (4 cột)
Cột 1 - Ngày: 2023-10-25, 2023-10-25, 2023-10-26, 2023-10-27, 2023-10-28
Cột 2 - Hạng mục: Tiền phòng, Nhập kho, Dịch vụ giặt là, Tiền phòng, Tiền điện
Cột 3 - Loại:
INCOME (badge xanh): Thu
EXPENSE (badge đỏ): Chi
Cột 4 - Số tiền: 1.500.000 đ, 500.000 đ, 200.000 đ, 2.400.000 đ, 3.000.000 đ
Icon edit và delete
5.3.8.3 Tính toán

Tổng thu = INCOME
Tổng chi = EXPENSE
Số dư = Số dư đầu kỳ + Thu - Chi
Hiển thị ở footer table
Khoa khoa học và kỹ thuật máy tính
5.3.9 Màn hình 9: Quản lý Sự cố
Hình 66: Màn hình quản lý sự cố hệ thống HOTELPRO
5.3.9.1 Mục đích Theo dõi và xử lý các sự cố trong khách sạn.

5.3.9.2 Thành phần giao diện

Header với nút "Thêm mới"
Table (3 cột)
Cột 1 - Tiêu đề: Hỏng vòi sen P.201, Mất két nối Wifi tầng 3, Bóng đèn hành lang cháy
Cột 2 - Trạng thái:
RECEIVED (badge đỏ): Đã tiếp nhận
NEW (badge cam): Mới
RESOLVED (badge xanh): Đã giải quyết
Cột 3 - Người báo: Cô Lan (Buồng phòng), Lễ tân Minh, Bảo vệ Hùng
Icon edit và delete
5.3.9.3 Workflow Sự cố

NEW→ RECEIVED→ IN PROGRESS→ RESOLVED→ CLOSED

NEW: Vừa tạo, chưa ai nhận
RECEIVED: Kỹ thuật đã nhận
IN PROGRESS: Đang sửa
RESOLVED: Đã sửa xong, chờ xác nhận
CLOSED: Đã xác nhận OK
Khoa khoa học và kỹ thuật máy tính
5.3.10 Màn hình 10: Quản lý Giặt ủi

Hình 67: Màn hình quản lý giặt ủi
5.3.10.1 Mục đích Quản lý đơn giặt ủi của khách.

5.3.10.2 Thành phần giao diện

Header với nút "Thêm mới"
Table (2 cột)
Cột 1 - Khách: Trần Thị B, John Smith
Cột 2 - Cân nặng: 3.5 kg, 5 kg
Icon edit và delete
5.3.10.3 Chi tiết Đơn giặt

Danh sách đồ: 5 áo sơ mi, 3 quần tây, 2 váy
Loại dịch vụ: Giặt + Ủi
Thời gian: Nhanh 24h (+30%)
Tổng tiền: Cân nặng × Đơn giá × Hệ số dịch vụ
Trạng thái: Đã tiếp nhận → Đang giặt → Đã hoàn thành → Đã giao
Khoa khoa học và kỹ thuật máy tính
5.3.11 Màn hình 11: Quản lý Thuê xe
Hình 68: Màn hình quản lý thuê xe hệ thống HOTELPRO
5.3.11.1 Mục đích Quản lý dịch vụ cho thuê xe máy/xe ô tô.

5.3.11.2 Thành phần giao diện

Table (2 cột)
Cột 1 - Khách: Nguyễn Văn A
Cột 2 - Vendor: Motor Rental ĐN
Icon edit và delete
5.3.11.3 Chi tiết Thuê xe

Loại xe: Xe máy Honda Wave
Biển số: 43B1-12345
Ngày thuê: 25/10/2024
Ngày trả dự kiến: 27/10/2024
Số ngày: 2 ngày
Đơn giá: 150.000 đ/ngày
Tổng tiền: 300.000 đ
Đặt cọc: 1.000.000 đ (hoàn lại khi trả xe)
Trạng thái: Đang thuê / Đã trả
Khoa khoa học và kỹ thuật máy tính
5.3.12 Màn hình 12: Quản lý Nhân sự
Hình 69: Màn hình quản lý nhân sự hệ thống HOTELPRO
5.3.12.1 Mục đích Quản lý thông tin nhân viên và phân quyền.

5.3.12.2 Thành phần giao diện

Header với nút "Thêm mới"
Table (3 cột)
Cột 1 - Họ tên: Quản trị viên, Nguyễn Văn Lý
Cột 2 - Vai trò: OWNER (badge xanh đậm), MANAGER (badge xanh)
Icon edit và delete
5.3.12.3 Các vai trò (Roles)

OWNER: Chủ khách sạn - Full quyền
MANAGER: Quản lý - Quản lý vận hành, duyệt phiếu chi
RECEPTIONIST: Lễ tân - Booking, Check-in/out, Dịch vụ
HOUSEKEEPER: Buồng phòng - Dọn phòng, Minibar, Sự cố
LAUNDRY: Giặt ủi - Xử lý đơn giặt
ACCOUNTANT: Kế toán - Thu chi, Báo cáo tài chính
5.4 Hệ thống thiết kế (Design System)
5.4.1 Color Palette
Màu Hex Code Sử dụng
Navy Blue #293595 Sidebar, Primary buttons, Headers
Light Blue #5B8DEE Charts, Links, Active states
Green #4CAF50 Success, Available, Confirmed
Red #F44336 Error, Occupied, Expense
Orange #FF9800 Warning, Pending, In Progress
Gray #9E9E9E Disabled, Cancelled, Text secondary
White #FFFFFF Background, Cards
Light Gray #F5F5F5 Card background, Hover
Khoa khoa học và kỹ thuật máy tính
Dark Gray #333333 Text primary
5.4.2 Typography
Font Family: Inter (primary), Roboto (fallback)
H1 - Page Title: 28px, Bold, Navy Blue
H2 - Section Title: 24px, Semibold, Dark Gray
H3 - Card Title: 18px, Medium, Dark Gray
Body Text: 14px, Regular, Dark Gray
Small Text: 12px, Regular, Gray
Numbers/Metrics: 24px, Bold, thường kèm màu theo ngữ cảnh
5.4.3 Components Library
5.4.3.1 Buttons

Primary: Navy Blue background, White text, Rounded 4px
Secondary: White background, Navy Blue border + text
Success: Green background, White text
Danger: Red background, White text
Icon Button: Transparent, icon 24x24px, hover bg Light Gray
5.4.3.2 Badges

Rounded full, padding 4px 12px, font size 12px
Success: Green bg, White text
Error: Red bg, White text
Warning: Orange bg, White text
Info: Blue bg, White text
5.4.3.3 Cards

Background: White
Border: 1px solid #E0E0E0
Border radius: 8px
Shadow: 0 2px 4px rgba(0,0,0,0.1)
Padding: 16px
5.4.3.4 Tables

Header: Light Gray background, Bold text
Row: White background, Border bottom 1px #E0E0E0
Hover: Light Gray background
Padding: 12px
Font size: 14px
5.4.4 Icons
Sử dụng icon set: Material Icons hoặc Feather Icons

Tổng quan: Bar chart icon
Lịch đặt phòng: Calendar icon
Báo cáo: Trending up icon
Kênh OTA: Globe icon
Phòng: Bed icon
Dịch vụ: Briefcase icon
Đối tác: Users icon
Tài chính: Dollar sign icon
Sự cố: Alert triangle icon
Giặt ủi: Package icon
Thuê xe: Bike icon
Nhân sự: User icon
Khoa khoa học và kỹ thuật máy tính
5.5 Thiết kế Responsive
5.5.1 Breakpoints
Desktop: ≥ 1200px - Full layout với sidebar
Tablet: 768px - 1199px - Sidebar thu gọn (icons only)
Mobile: < 768px - Sidebar ẩn, hiện menu hamburger
5.5.2 Adaptive Layout
5.5.2.1 Desktop (≥1200px)

Sidebar: 290px fixed width, full text
Main content: Fluid, tối đa 1400px
Cards: 4 columns grid
Tables: Full width, tất cả cột hiển thị
5.5.2.2 Tablet (768px - 1199px)

Sidebar: 80px, chỉ hiện icons + tooltip
Main content: Fluid
Cards: 2 columns grid
Tables: Ẩn cột ít quan trọng
5.5.2.3 Mobile (<768px)

Sidebar: Ẩn, hiện hamburger menu (slide-in từ trái)
Main content: Full width
Cards: 1 column, stack dọc
Tables: Card view (vertical layout) hoặc horizontal scroll
Charts: Responsive, scale theo width
5.6 Kết luận
Wireframe của hệ thống HotelPro được thiết kế với mục tiêu mang lại trải nghiệm người dùng tối ưu cho nhân
viên khách sạn. Các điểm nổi bật:

Consistency: Toàn bộ hệ thống sử dụng chung 1 design system
Efficiency: Luồng nghiệp vụ được tối ưu, giảm thiểu thao tác
Visual Hierarchy: Thông tin quan trọng được highlight bằng màu sắc, kích thước
Data Visualization: Sử dụng charts, timeline để trực quan hóa dữ liệu
Responsive: Hoạt động tốt trên mọi thiết bị
Wireframe này là nền tảng để triển khai giao diện thực tế (High-fidelity mockup) và phát triển Frontend
trong giai đoạn tiếp theo.
6 Tổng kết và kế hoạch phát triển
6.1 Đánh giá công việc đã thực hiện (Task Evaluation)
Trong quá trình thực hiện đồ án tốt nghiệp này, chúng em đã hoàn thành các mục tiêu đề ra:

Phân tích nghiệp vụ: Khảo sát quy trình vận hành thực tế tại khách sạn, phỏng vấn nhân viên các vị trí
để xác định yêu cầu chức năng và phi chức năng.
Thiết kế hệ thống: Xây dựng 11 Use Case Diagrams chuẩn UML 2.0 với 73 use cases chi tiết, bao phủ đầy
đủ các module: Quản lý phòng, Booking, Check-in/out, Dịch vụ, Giặt ủi, Thuê xe, Housekeeper, Sự cố, Kho
hàng, Thu chi, và Báo cáo.
Thiết kế cơ sở dữ liệu: Thiết kế ERD , đảm bảo tính toàn vẹn dữ liệu và khả năng mở rộng.
Kiến trúc hệ thống: Thiết kế kiến trúc với khả năng scale và bảo mật cao.
Giao diện người dùng: Thiết kế 12 wireframes cho các màn hình chính (Dashboard, Lịch đặt phòng, Báo
cáo, Quản lý phòng, Dịch vụ, Thu chi, v.v.) với focus vào trải nghiệm người dùng nội bộ (nhân viên).
Tài liệu kỹ thuật: Hoàn thành 73 use case specifications chi tiết bằng LaTeX (291KB), có thể sử dụng làm
tài liệu hướng dẫn phát triển.
Khoa khoa học và kỹ thuật máy tính
Tích hợp OTA: Thiết kế khả năng kết nối với các kênh đặt phòng online như Booking.com, Agoda, Traveloka
để đồng bộ giá và phòng trống.
Hệ thống được thiết kế theo nguyên tắc "Staff-first", tối ưu hóa quy trình làm việc của nhân viên khách
sạn, tự động hóa nhiều công việc thủ công như tính giá phòng, tính phí minibar, tạo báo cáo tài chính, và cảnh
báo sự cố.
6.2 Kế hoạch phát triển (Future Plan)
Bảng 71 mô tả timeline phát triển cho giai đoạn tiếp theo. Trong giai đoạn này, chúng em sẽ tập trung vào
triển khai hệ thống và testing.

Bảng 71: Project Timeline - Giai đoạn Triển khai
Tuần Thời gian Công việc
1-2 2 tuần Setup môi trường:
Cài đặt môi trường development (Node.js, React,
PostgreSQL)
Setup Docker containers cho client và server
Cấu hình CI/CD pipeline (GitHub Actions)
Tạo dataset mẫu (phòng, khách hàng, booking,
dịch vụ)
3-10 8 tuần Triển khai hệ thống:
Tuần 3-4: Module Quản lý Phòng & Booking
Tuần 5-6: Module Check-in/out & Thanh toán
Tuần 7: Module Quản lý Dịch vụ (Giặt ủi, Thuê
xe, Minibar)
Tuần 8: Module Housekeeper & Sự cố
Tuần 9: Module Thu chi & Báo cáo
Tuần 10: Module Tích hợp OTA (API Book-
ing.com, Agoda)
11-12 2 tuần Testing & Deployment:
Unit testing (Jest, React Testing Library)
Integration testing (API testing với Postman)
E2E testing (Cypress)
Performance testing (Load test với k6)
Deploy lên AWS (EC2, RDS, S3)
User Acceptance Testing với 3 khách sạn pilot
6.3 Chiến lược Testing
Trong quá trình coding, chúng em sẽ áp dụng test-driven development:

API Testing: Test từng endpoint ngay khi code xong (Postman, Jest)
Frontend Testing: Component testing với React Testing Library
Database Testing: Verify data integrity, cascade delete/update
User Flow Testing: Test toàn bộ luồng Booking → Check-in → Check-out
Khoa khoa học và kỹ thuật máy tính
Tài liệu tham khảo
[1] What is Turborepo and Why Should You Care?
https://refine.dev/blog/how-to-use-turborepo
[2] Stack Overflow 2025 Survey
https://survey.stackoverflow.co/2025/technology
[3] Octoverse: AI leads Python to top language as the number of global developers surges
https://github.blog/news-insights/octoverse/octoverse-2024/
[4] Welcome to the State of Developer Ecosystem Report 2024
https://www.jetbrains.com/lp/devecosystem-2024
[5] Pros and Cons for using ESLint for Software Security
https://www.codiga.io/blog/eslint-software-security
[6] Why Prettier?
https://prettier.io/docs/why-prettier
[7] Early Adoption of Next.js App Router in Production: Our Thoughts
https://www.dmcinfo.com/blog/16587/early-adoption-of-next-js-app-router-in-production-our-thoughts
[8] The Dark Side of Next.js: Why This Popular Framework Might Not Be Right for You
https://javascript.plainenglish.io/the-dark-side-of-next-js-why-this-popular-framework-might-not-be-right-for-you-d121b59cd008
[9] Vite’s Features
https://vite.dev/guide/features
[10] The Future of React: Top Trends Shaping Frontend Development in 2025
https://www.netguru.com/blog/react-js-trends

[11] Axios: Getting Started
https://axios-http.com/docs/intro

[12] State Management: Comparing Redux Toolkit, Zustand, and React Context
https://prakashinfotech.com/state-management-comparing-redux-toolkit-zustand-and-react-context

[13] Zustand vs Redux: A Comprehensive Comparison
https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux
