import { DocumentItem, ArticleItem } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-nam-quoc-son-ha',
    title: 'Nam Quốc Sơn Hà - Tuyên Ngôn Độc Lập Thời Lý (Khảo Dị & Văn Bản Học)',
    fileName: 'nam-quoc-son-ha-khao-di.html',
    fileType: 'html',
    fileSize: 154200,
    category: 'Tư liệu & Văn kiện',
    summary: 'Khảo sát văn bản học và đối chiếu các dị bản của bài thơ Nam Quốc Sơn Hà trong Lĩnh Nam Chích Quái, Đại Việt Sử Ký Toàn Thư, cùng phân tích tư tưởng chủ quyền lãnh thổ dân tộc Đại Việt năm 1077.',
    tags: ['Lịch Sử', 'Thời Lý', 'Tuyên Ngôn Độc Lập', 'Chữ Hán', 'Văn Bản Học'],
    authorId: 'vien-viet-hoc-archive',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Ban Nghiên Cứu Lịch Sử Viện Việt Học',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
    pageCount: 12,
    wordCount: 7850,
    textContent: `Nam Quốc Sơn Hà - Bản Tuyên Ngôn Độc Lập Đầu Tiên Của Dân Tộc Việt Nam.
Nguyên văn chữ Hán:
南國山河南帝居 (Nam quốc sơn hà Nam đế cư)
截然定分在天書 (Tiệt nhiên định phận tại thiên thư)
如何逆虜來侵犯 (Như hà nghịch lỗ lai xâm phạm)
汝等行看取敗虛 (Nhữ đẳng hành khan thủ bại hư).

Dịch nghĩa:
Sông núi nước Nam thì vua Nam ở,
Rành rành đã định phận rõ ràng ở sách trời.
Cớ sao lũ giặc bạo ngược kia dám đến xâm phạm,
Chúng bay hãy chờ xem, ắt sẽ chuốc lấy sự bại vong tan tành.

Bối cảnh lịch sử:
Bài thơ thần vang lên trong đêm tối bên phòng tuyến sông Như Nguyệt (sông Cầu) vào mùa xuân năm Đinh Tỵ (1077), khi Thái úy Lý Thường Kiệt lãnh đạo quân dân Đại Việt chặn đứng 10 vạn đại quân viễn chinh nhà Tống do Quách Quỳ và Triệu Tiết chỉ huy.
Khảo dị văn bản:
1. Bản trong Lĩnh Nam Chích Quái (thế kỷ 14): Sử dụng chữ 'Nam đế cư', khẳng định vị thế Đế quyền ngang hàng với Hoàng đế phương Bắc, không phải chư hầu 'Vương'.
2. Bản trong Việt Điện U Linh Tập của Lý Tế Xuyên (1329): Nhấn mạnh yếu tố linh thiêng của hai vị thần Trương Hống, Trương Hát bảo vệ non sông Đại Việt.
3. Bản trong Đại Việt Sử Ký Toàn Thư của Ngô Sĩ Liên: Khẳng định tính 'thiên thư định phận' - ranh giới non sông đã được thiên lý chứng giám, bất khả xâm phạm.
Kết luận học thuật: Nam Quốc Sơn Hà không chỉ là áng thi ca hào sảng mà còn là cơ sở pháp lý và văn hóa khẳng định tư cách quốc gia độc lập có chủ quyền của người Việt.`,
    htmlContent: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Nam Quốc Sơn Hà - Tuyên Ngôn Độc Lập Thời Lý</title>
</head>
<body style="font-family: Georgia, serif; line-height: 1.8; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 2rem;">
  <header style="border-bottom: 2px solid #854d0e; padding-bottom: 1rem; margin-bottom: 2rem;">
    <h1 style="color: #991b1b; font-size: 1.8rem; margin-bottom: 0.5rem;">Nam Quốc Sơn Hà - Áng Thơ Thần Sông Như Nguyệt</h1>
    <p style="font-style: italic; color: #64748b;">Tư liệu Văn hiến Cổ đại &bull; Ban Nghiên Cứu Lịch Sử & Thư Viện Viện Việt Học</p>
  </header>

  <section style="background-color: #fefce8; border-left: 4px solid #ca8a04; padding: 1.5rem; margin-bottom: 2rem;">
    <h3 style="color: #854d0e; margin-top: 0;">Nguyên Tác Chữ Hán & Phiên Âm Hán Việt</h3>
    <p style="font-size: 1.25rem; font-weight: bold; line-height: 2;">
      南國山河南帝居 &bull; Nam quốc sơn hà Nam đế cư<br/>
      截然定分在天書 &bull; Tiệt nhiên định phận tại thiên thư<br/>
      如何逆虜來侵犯 &bull; Như hà nghịch lỗ lai xâm phạm<br/>
      汝等行看取敗虛 &bull; Nhữ đẳng hành khan thủ bại hư.
    </p>
  </section>

  <section>
    <h2 style="color: #991b1b;">1. Khảo Dị Giữa Các Cổ Bản</h2>
    <p>Các nhà nghiên cứu văn bản học tại Viện Việt Học đã tiến hành đối chiếu bản chép trong <em>Lĩnh Nam Chích Quái</em> và <em>Đại Việt Sử Ký Toàn Thư</em>. Điểm đặc sắc nhất là việc sử dụng danh xưng <strong>Nam Đế</strong> (南帝), biểu thị ý thức tự tôn độc lập, xác lập cương giới bất khả xâm phạm đối với các triều đại phương Bắc.</p>
    <h2 style="color: #991b1b;">2. Ý Nghĩa Lịch Sử & Tư Tưởng</h2>
    <p>Áng văn không chỉ có giá trị cổ động tinh thần ba quân tướng sĩ trong cuộc chiến kháng Tống năm 1077, mà còn mở đầu cho truyền thống tuyên ngôn chủ quyền của dân tộc Việt Nam, được tiếp nối bởi <em>Bình Ngô Đại Cáo</em> thời Hậu Lê và <em>Tuyên Ngôn Độc Lập</em> năm 1945.</p>
  </section>
</body>
</html>`,
  },
  {
    id: 'doc-truyen-kieu-nguyen-du',
    title: 'Đoạn Trường Tân Thanh (Truyện Kiều) - Khảo Luận Thi Pháp & Ngôn Ngữ Học',
    fileName: 'truyen-kieu-khao-luan-thi-phap.pdf',
    fileType: 'pdf',
    fileSize: 468000,
    category: 'Văn học & Nghệ thuật',
    summary: 'Công trình khảo cứu thi pháp truyện Kiều của Đại thi hào Nguyễn Du: sự chuyển hóa thể thơ Lục bát thành đỉnh cao ngôn ngữ dân tộc, phân tích 3.254 câu thơ và hệ thống từ vựng tiếng Việt thế kỷ 18-19.',
    tags: ['Truyện Kiều', 'Nguyễn Du', 'Văn Học', 'Thơ Lục Bát', 'Ngôn Ngữ Học'],
    authorId: 'vien-viet-hoc-archive',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'GS. Nguyễn Văn Sâm & Viện Việt Học',
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 3,
    pageCount: 48,
    wordCount: 24500,
    textContent: `Đoạn Trường Tân Thanh (Truyện Kiều) - Đỉnh Cao Ngôn Ngữ và Thi Pháp Việt Nam.
Tác giả: Tiên Điền Nguyễn Du (1765 - 1820).
Chủ đề nghiên cứu: Khảo luận ngôn ngữ học và cấu trúc thi pháp thơ lục bát trong Truyện Kiều.

Phần 1: Nghệ thuật sử dụng ngôn ngữ dân tộc.
Nguyễn Du đã tài tình dung hợp kho tàng từ vựng Hán Việt với tiếng Việt thuần túy của quần chúng nhân dân. Từ những thành ngữ dân gian mộc mạc như 'đầu trộm đuôi cướp', 'ba bảy đường', cho đến những khái niệm triết học sâu sắc về 'chữ Tâm', 'chữ Tài' và 'mệnh trời'.
'Trăm năm trong cõi người ta,
Chữ tài chữ mệnh khéo là ghét nhau.
Trải qua một cuộc bể dâu,
Những điều trông thấy mà đau đớn lòng.'

Phần 2: Thi pháp miêu tả tâm lý và không gian nghệ thuật.
1. Nghệ thuật tả cảnh ngụ tình: Cảnh sắc thiên nhiên bốn mùa trong Truyện Kiều luôn gắn liền với tâm trạng nhân vật. Buổi chiều thanh minh êm đềm ('Cỏ non xanh tận chân trời, Cành lê trắng điểm một vài bông hoa') đối lập hoàn toàn với chiều tà thê lương ở lầu Ngưng Bích ('Buồn trông cửa bể chiều hôm, Thuyền ai thấp thoáng cánh buồm xa xa').
2. Nhân vật Từ Hải - Khát vọng tự do và công lý: Hình tượng anh hùng 'Đội trời đạp đất ở đời', tượng trưng cho khí phách ngang tàng và khát vọng công lý của nhân dân trước một xã hội phong kiến suy tàn.
3. Giá trị nhân văn và tư tưởng nhân đạo: 'Thiện căn ở tại lòng ta, Chữ tâm kia mới bằng ba chữ tài'. Nguyễn Du đặt chữ Tâm - lòng trắc ẩn và tình thương con người - lên trên hết mọi chuẩn mực quy ước giáo điều.

Phần 3: Dị bản chữ Nôm và các bản dịch quốc tế.
Viện Việt Học hiện lưu trữ các bản Nôm cổ: Bản Liễu Văn Đường (1871), bản Duy Minh Thị (1872) và bản Kinh (1870), phục vụ công tác đối chiếu từ nguyên học và bảo tồn nguyên bản.`,
  },
  {
    id: 'doc-lich-su-chu-quoc-ngu',
    title: 'Lịch Sử Hình Thành Chữ Quốc Ngữ và Sự Tiến Hóa của Báo Chí Tiếng Việt',
    fileName: 'lich-su-chu-quoc-ngu-bao-chi.pdf',
    fileType: 'pdf',
    fileSize: 384000,
    category: 'Ngôn ngữ & Chữ viết',
    summary: 'Khảo luận toàn diện về quá trình La-tinh hóa tiếng Việt từ thế kỷ 17 qua tự điển Dictionarium Annamiticum Lusitanum et Latinum (1651), sự ra đời của Gia Định Báo (1865) và phong trào Đông Kinh Nghĩa Thục.',
    tags: ['Chữ Quốc Ngữ', 'Alexandre de Rhodes', 'Gia Định Báo', 'Lịch Sử Báo Chí', 'Ngôn Ngữ'],
    authorId: 'vien-viet-hoc-archive',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Hội Đồng Khoa Học Viện Việt Học',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
    pageCount: 36,
    wordCount: 18200,
    textContent: `Lịch Sử Hình Thành Chữ Quốc Ngữ và Sự Tiến Hóa của Báo Chí Tiếng Việt Hiện Đại.
1. Giai đoạn sơ khởi (Thế kỷ 17):
Sự tiếp xúc giữa các giáo sĩ phương Tây (Francisco de Pina, Gaspar do Amaral, Antonio Barbosa) và các học giả, giáo dân người Việt tại Đàng Trong và Đàng Ngoài đã đặt nền móng cho việc ký âm tiếng Việt bằng mẫu tự La-tinh.
Năm 1651 tại Roma, giáo sĩ Alexandre de Rhodes xuất bản cuốn 'Dictionarium Annamiticum Lusitanum et Latinum' (Từ điển Việt - Bồ - La) cùng cuốn giáo lý 'Phép giảng tám ngày'. Đây là mốc lịch sử đánh dấu sự định hình của Chữ Quốc Ngữ với hệ thống dấu thanh điệu (sắc, huyền, hỏi, ngã, nặng) phản ánh thanh âm ngữ điệu tiếng Việt.

2. Chữ Quốc Ngữ trong đời sống văn hóa và báo chí (Thế kỷ 19):
Ngày 15 tháng 4 năm 1865 tại Sài Gòn, tờ báo chữ Quốc ngữ đầu tiên - 'Gia Định Báo' - ra đời, do Ernest Potteaux và sau đó là học giả Trương Vĩnh Ký, Huỳnh Tịnh Của chủ bút.
Gia Định Báo không chỉ phổ biến công văn mà còn đăng tải các bài khảo cứu văn hóa, tục ngữ, ca dao, truyện cổ tích, giúp chữ Quốc ngữ trở thành phương tiện truyền tải tri thức và tư tưởng hiện đại.

3. Phong trào Đông Kinh Nghĩa Thục (1907) và cuộc cách mạng văn hóa:
Các nhà chí sĩ Phan Bội Châu, Phan Châu Trinh, Lương Văn Can, Nguyễn Quyền đã nhận thức sâu sắc rằng: Muốn nâng cao dân trí và giành lại độc lập dân tộc, phải phổ biến chữ Quốc ngữ rộng khắp. Đông Kinh Nghĩa Thục mở trường dạy không lấy tiền, in sách giáo khoa bằng chữ Quốc ngữ, thức tỉnh tinh thần tự cường dân tộc.

4. Vai trò bảo tồn chữ Quốc ngữ tại hải ngoại ngày nay:
Viện Việt Học tại Westminster, California tiếp tục sứ mệnh duy trì các lớp giảng dạy tiếng Việt, biên soạn giáo trình và bảo tồn các ấn phẩm báo chí cổ của cộng đồng người Việt toàn cầu.`,
  },
  {
    id: 'doc-van-hoa-dan-gian-tin-nguong',
    title: 'Khảo Cứu Văn Hóa Dân Gian & Phong Tục Tập Quán Cổ Truyền Việt Nam',
    fileName: 'van-hoa-dan-gian-phong-tuc.html',
    fileType: 'html',
    fileSize: 128500,
    category: 'Văn học & Nghệ thuật',
    summary: 'Công trình nghiên cứu cấu trúc làng xã Việt, tín ngưỡng thờ cúng Tổ tiên, lễ hội dân gian bốn mùa, kiến trúc đình làng Bắc Bộ và giá trị tinh thần gắn kết cộng đồng người Việt muôn phương.',
    tags: ['Văn Hóa Dân Gian', 'Phong Tục', 'Thờ Cúng Tổ Tiên', 'Lễ Hội', 'Đình Làng'],
    authorId: 'vien-viet-hoc-archive',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Tiểu Ban Văn Hóa & Phong Tục Viện Việt Học',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 4,
    pageCount: 16,
    wordCount: 9600,
    textContent: `Khảo Cứu Văn Hóa Dân Gian & Phong Tục Tập Quán Cổ Truyền Việt Nam.
Lời giới thiệu:
Văn hóa Việt Nam là dòng chảy ngàn năm hòa quyện giữa nền văn minh nông nghiệp lúa nước, truyền thống yêu nước chống ngoại xâm và đạo lý nhân hậu 'uống nước nhớ nguồn'.
Chương 1: Tín ngưỡng thờ cúng Tổ Tiên và đạo lý Hiếu nghĩa.
Bàn thờ gia tiên là không gian thiêng liêng nhất trong mỗi ngôi nhà Việt. Việc cúng giỗ cha ông, hướng về cội nguồn vào các dịp lễ Tết, Tiết Thanh minh, Vu Lan báo hiếu không chỉ là nghi thức tôn giáo mà là nền tảng luân lý, giữ gìn mối dây liên kết huyết thống qua nhiều thế hệ.
Chương 2: Không gian văn hóa Làng Xã và Ngôi Đình Việt.
'Cây đa, bến nước, sân đình' - biểu tượng bất diệt của làng quê Việt Nam. Ngôi đình làng vừa là nơi thờ Thành hoàng làng (người có công lập ấp, đánh giặc cứu nước), vừa là trung tâm sinh hoạt hội hè, biểu diễn chèo tuồng, bàn việc công ích của dân làng.
Chương 3: Lễ hội cổ truyền và Di sản phi vật thể.
Các lễ hội mùa xuân: Hội đền Hùng, Hội Gióng, Hội Chùa Hương, Lễ hội Cồng chiêng Tây Nguyên. Mỗi lễ hội là bảo tàng sống lưu giữ âm nhạc dân tộc, trò chơi dân gian (đấu vật, cờ người, đua thuyền) và triết lý sống hòa hợp giữa con người với vũ trụ trời đất.`,
    htmlContent: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Khảo Cứu Văn Hóa Dân Gian Việt Nam</title>
</head>
<body style="font-family: 'Times New Roman', Times, serif; line-height: 1.8; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 2rem;">
  <header style="border-bottom: 2px solid #b45309; padding-bottom: 1rem; margin-bottom: 2rem;">
    <h1 style="color: #831843; font-size: 1.8rem; margin-bottom: 0.5rem;">Không Gian Văn Hóa Làng Xã & Tín Ngưỡng Dân Gian Việt Nam</h1>
    <p style="color: #64748b; font-style: italic;">Chuyên Khảo Dân Tộc Học &bull; Thư Viện Viện Việt Học, Westminster</p>
  </header>

  <article>
    <h2 style="color: #991b1b;">1. Đạo Lý Uống Nước Nhớ Nguồn</h2>
    <p>Trọng tâm của đời sống tâm linh người Việt nằm ở lòng biết ơn: biết ơn Tổ tiên sinh thành, biết ơn các bậc tiền nhân có công khai hoang mở cõi và gìn giữ non sông. Bàn thờ gia tiên luôn chiếm vị trí trang trọng nhất trong gia đình.</p>

    <h2 style="color: #991b1b;">2. Biểu Tượng Ngôi Đình Làng</h2>
    <p>Mái đình cong vút hình rồng phượng, những bức chạm khắc gỗ tinh xảo mô tả cảnh săn bắn, cày cấy, lễ hội ca múa chính là đỉnh cao của mỹ thuật dân gian Việt Nam thế kỷ 16-18.</p>
  </article>
</body>
</html>`,
  },
  {
    id: 'doc-viet-nam-su-luoc',
    title: 'Việt Nam Sử Lược - Khái Luận Tiến Trình Lịch Sử & Các Triều Đại Dân Tộc',
    fileName: 'viet-nam-su-luoc-khai-luan.pdf',
    fileType: 'pdf',
    fileSize: 520000,
    category: 'Lịch sử',
    summary: 'Trích dẫn và phân tích tác phẩm sử học kinh điển Việt Nam Sử Lược của Trần Trọng Kim: phương pháp chép sử hiện đại đầu tiên bằng chữ Quốc ngữ, các triều đại Đinh, Lê, Lý, Trần, Lê, Nguyễn và bài học giữ nước.',
    tags: ['Việt Nam Sử Lược', 'Trần Trọng Kim', 'Lịch Sử', 'Sử Học', 'Triều Đại'],
    authorId: 'vien-viet-hoc-archive',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Học Bộ Lịch Sử Viện Việt Học',
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 86400000 * 1,
    pageCount: 52,
    wordCount: 26800,
    textContent: `Việt Nam Sử Lược - Khái Luận Tiến Trình Lịch Sử & Các Triều Đại Dân Tộc.
Tác giả nguyên tác: Sử gia Lệ Thần Trần Trọng Kim (1883 - 1953).
Xuất bản lần đầu: Năm 1920 tại Hà Nội.

Ý nghĩa sử học:
Trước khi 'Việt Nam Sử Lược' ra đời, các bộ chính sử của nước ta như 'Đại Việt Sử Ký Toàn Thư', 'Khâm Định Việt Sử Thông Giám Cương Mục' đều được viết bằng chữ Hán theo lối biên niên nghiêm ngặt. Trần Trọng Kim là người đầu tiên biên soạn một bộ quốc sử hoàn chỉnh bằng chữ Quốc ngữ với văn phong giản dị, mạch lạc, áp dụng phương pháp nghiên cứu lịch sử khoa học hiện đại.

Các thời kỳ lịch sử lớn:
1. Thượng cổ thời đại: Họ Hồng Bàng, truyền thuyết Lạc Long Quân và Âu Cơ, mười tám đời vua Hùng Vương dựng nước Văn Lang, An Dương Vương xây thành Cổ Loa.
2. Thời kỳ Bắc thuộc và các cuộc khởi nghĩa giành độc lập: Khởi nghĩa Hai Bà Trưng (năm 40), Bà Triệu (248), Lý Nam Đế dựng nước Vạn Xuân (544), Mai Thúc Loan, Phùng Hưng.
3. Kỷ nguyên độc lập tự chủ: Chiến thắng Bạch Đằng năm 938 của Ngô Quyền chấm dứt hơn 1.000 năm đô hộ, mở ra thời đại độc lập cho non sông. Tiếp nối qua các triều Đinh, Tiền Lê, Lý, Trần, Hậu Lê.
- Chiến công hiển hách ba lần đại phá quân Nguyên Mông thời nhà Trần dưới sự chỉ huy của Hưng Đạo Đại Vương Trần Quốc Tuấn.
- Khởi nghĩa Lam Sơn 10 năm gian khổ của Bình Định Vương Lê Lợi và Nguyễn Trãi quét sạch quân Minh xâm lược.
4. Thời cận đại và di sản sử học:
Bộ sách đúc kết tinh thần ái quốc, ý thức tự cường dân tộc và bài học sâu sắc về sự đoàn kết muôn dân: 'Vua tôi đồng lòng, anh em hòa mục, cả nước góp sức' thì giặc nào cũng đánh tan.`,
  },
  {
    id: 'doc-hien-chuong-vien-viet-hoc',
    title: 'Hiến Chương & Tôn Chỉ Hoạt Động Của Viện Việt Học (Westminster, California)',
    fileName: 'hien-chuong-vien-viet-hoc-2000.html',
    fileType: 'html',
    fileSize: 112000,
    category: 'Tư liệu & Văn kiện',
    summary: 'Văn kiện chính thức thành lập Viện Việt Học ngày 26 tháng 2 năm 2000 tại Westminster, California; mục tiêu bảo tồn văn hóa, thư viện hơn 8.000 tài liệu, các ban nghiên cứu và xuất bản văn hóa.',
    tags: ['Viện Việt Học', 'Hiến Chương', 'Westminster', 'Văn Hóa Hải Ngoại', 'Thư Viện'],
    authorId: 'vien-viet-hoc-archive',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Hội Đồng Quản Trị Viện Việt Học',
    createdAt: Date.now() - 86400000 * 40,
    updatedAt: Date.now() - 86400000 * 10,
    pageCount: 10,
    wordCount: 6500,
    textContent: `Hiến Chương & Tôn Chỉ Hoạt Động Của Viện Việt Học.
Địa chỉ: 15355 Brookhurst St # 222, Westminster, CA 92683, Hoa Kỳ.
Ngày thành lập: 26 tháng 2 năm 2000.

I. Tôn Chỉ & Sứ Mạng:
Viện Việt Học là một tổ chức bất vụ lợi chuyên về nghiên cứu, giáo dục và bảo tồn văn hóa dân tộc Việt Nam tại hải ngoại.
1. Thắt chặt tình tự dân tộc và mối dây liên lạc thân hữu giữa người Việt Nam trên toàn thế giới.
2. Tìm hiểu, phân tích sâu sắc những cái hay, cái đẹp cũng như những hạn chế trong truyền thống văn hóa để phát huy những tinh hoa giá trị tinh thần Việt.
3. Đánh giá khách quan vị thế và đóng góp của văn hóa Việt Nam trong nền văn minh nhân loại.
4. Cung cấp môi trường học thuật trung thực, tự do và nghiêm túc cho các học giả, sinh viên và thế hệ trẻ tìm hiểu về lịch sử, ngôn ngữ và nghệ thuật nước nhà.

II. Các Hoạt Động Trọng Tâm:
- Thư Viện Nghiên Cứu: Lưu trữ hơn 8.000 đầu sách, tài liệu quý hiếm, báo chí cổ và các luận án tiến sĩ về Việt Nam học. Hơn 2.000 đầu sách đã được phân loại theo hệ thống Thư Viện Quốc Hội Hoa Kỳ (Library of Congress).
- Sinh Hoạt Văn Hóa Định Kỳ: Tổ chức các buổi thuyết trình học thuật hàng tháng, hội thảo chuyên đề, triển lãm thư pháp, tranh ảnh và hòa nhạc dân tộc.
- Giáo Dục & Đào Tạo: Các lớp học Việt ngữ, triết học Đông phương, lịch sử và văn hóa dành cho thanh thiếu niên và người nước ngoài.
- Dự Án Số Hóa Tư Liệu Toàn Văn: Xây dựng kho lưu trữ số hóa PWA giúp người đọc tìm kiếm toàn văn trong hàng ngàn trang tài liệu PDF và HTML ở bất kỳ đâu, kể cả khi không có kết nối Internet.`,
    htmlContent: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Hiến Chương Viện Việt Học</title>
</head>
<body style="font-family: sans-serif; line-height: 1.8; color: #0f172a; max-width: 800px; margin: 0 auto; padding: 2rem;">
  <div style="text-align: center; border-bottom: 2px solid #854d0e; padding-bottom: 1.5rem; margin-bottom: 2rem;">
    <h1 style="color: #991b1b; font-size: 2rem; margin-bottom: 0.25rem;">VIỆN VIỆT HỌC</h1>
    <h2 style="color: #64748b; font-size: 1.1rem; font-weight: normal; margin-top: 0;">INSTITUTE OF VIETNAMESE STUDIES &bull; WESTMINSTER, CALIFORNIA</h2>
    <p style="color: #b45309; font-weight: bold; margin-top: 0.5rem;">Hiến Chương & Tôn Chỉ Thành Lập (26/02/2000)</p>
  </div>

  <section>
    <h3 style="color: #991b1b; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">I. Tôn Chỉ Hoạt Động</h3>
    <p>Viện Việt Học được sáng lập nhằm mục đích bảo tồn và phát huy di sản văn hóa, ngôn ngữ, tư tưởng và lịch sử của dân tộc Việt Nam. Viện duy trì thư viện hơn 8.000 đầu sách quý tại số <strong>15355 Brookhurst St #222, Westminster, CA 92683</strong>.</p>

    <h3 style="color: #991b1b; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">II. Chương Trình Số Hóa Toàn Văn (PWA)</h3>
    <p>Hệ thống Thư Viện Điện Tử và Tìm Kiếm Toàn Văn cho phép các nhà nghiên cứu tra cứu chính xác từng đoạn trích, câu thơ, văn kiện lịch sử trong các định dạng PDF và HTML với khả năng hoạt động ngoại tuyến (Offline-First) trên mọi thiết bị.</p>
  </section>
</body>
</html>`,
  },
];

export const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: 'art-chao-mung-cong-so-hoa',
    title: 'Chào Mừng Đến Với Cổng Lưu Trữ & Tra Cứu Toàn Văn Tài Liệu Viện Việt Học (PWA)',
    excerpt: 'Khai trương hệ thống thư viện số hóa Progressive Web App (PWA) của Viện Việt Học với công cụ tìm kiếm toàn văn hàng ngàn tài liệu PDF và HTML, đồng bộ Firebase và khả năng đọc ngoại tuyến.',
    category: 'Thông báo & Sinh hoạt',
    authorId: 'vien-viet-hoc-editorial',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Ban Quản Trị Viện Việt Học',
    published: true,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1,
    tags: ['Viện Việt Học', 'Thư Viện Số Hóa', 'PWA', 'Tìm Kiếm Toàn Văn', 'Thông Báo'],
    content: `## Cổng Tra Cứu Tư Liệu Số Hóa Viện Việt Học

Ban Điều Hành và Thư Viện **Viện Việt Học (Institute of Vietnamese Studies - Westminster, California)** trân trọng giới thiệu đến quý học giả, thân hữu và đồng hương ứng dụng tra cứu tư liệu số hóa theo chuẩn **Progressive Web App (PWA)** hiện đại.

### Các Tính Năng Nổi Bật:

- **Tìm Kiếm Toàn Văn Nhanh Chóng**: Hệ thống quét qua từng câu chữ trong tất cả các tập tin tài liệu HTML và ấn bản PDF, làm nổi bật ngay đoạn văn chứa từ khóa tìm kiếm (hỗ trợ cả chữ Quốc ngữ có dấu và không dấu).
- **Cài Đặt Dễ Dàng Trực Tiếp Trên Điện Thoại & Máy Tính**: Quý vị có thể nhấn nút **Cài Đặt Ứng Dụng** ở góc trên màn hình để đưa Viện Việt Học về màn hình chính thiết bị di động (iOS, Android) hoặc máy tính (Windows, macOS) như một ứng dụng chuyên biệt.
- **Hoạt Động Ngoại Tuyến (Offline-Ready)**: Ngay cả khi không có kết nối mạng Internet hoặc khi đang di chuyển, quý vị vẫn có thể mở và tra cứu toàn văn các tài liệu đã được lưu trữ trong bộ nhớ tạm của ứng dụng.
- **Phân Quyền Vai Trò Người Dùng (RBAC)**:
  - **Độc Giả (Viewer)**: Đọc, tìm kiếm toàn văn, xem trước tài liệu và tải về miễn phí các bản sao PDF và HTML.
  - **Biên Tập Viên (Editor)**: Tải lên các tập tin PDF và HTML mới, tự động trích xuất văn bản và viết bài viết hoặc thông báo học thuật mới.
  - **Quản Trị Viên (Admin)**: Quản lý phân quyền người dùng và kiểm duyệt toàn bộ kho lưu trữ.

Quý vị hãy sử dụng thanh tìm kiếm phía trên hoặc khám phá các chuyên mục: *Tư liệu & Văn kiện*, *Lịch sử*, *Văn học & Nghệ thuật*, *Ngôn ngữ & Chữ viết*!`,
  },
  {
    id: 'art-thuyet-trinh-am-nhac-co-truyen',
    title: 'Thông Báo Buổi Thuyết Trình Học Thuật: "Âm Nhạc Cổ Truyền Việt Nam"',
    excerpt: 'Viện Việt Học trân trọng kính mời quý đồng hương và giới nghiên cứu tham dự buổi thuyết trình và diễn họa âm nhạc dân tộc định kỳ tại hội trường Viện (Westminster, California).',
    category: 'Thông báo & Sinh hoạt',
    authorId: 'vien-viet-hoc-editorial',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Ban Tổ Chức Sinh Hoạt',
    published: true,
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 2,
    tags: ['Thuyết Trình', 'Âm Nhạc Cổ Truyền', 'Sinh Hoạt Viện', 'Westminster', 'Văn Hóa'],
    content: `## Sinh Hoạt Học Thuật Định Kỳ Tại Viện Việt Học

Nhằm tạo cơ hội tìm hiểu về cội nguồn âm thanh dân tộc, Viện Việt Học trân trọng kính mời quý vị tham dự buổi thuyết trình:

- **Chủ đề:** *Âm Nhạc Cổ Truyền Việt Nam - Từ Ca Trù, Nhã Nhạc Cung Đình Đến Đờn Ca Tài Tử Nam Bộ*
- **Thời gian:** 2:00 PM - 5:00 PM, Thứ Bảy tuần này.
- **Địa điểm:** Hội trường Viện Việt Học, 15355 Brookhurst St # 222, Westminster, CA 92683.
- **Diễn giả:** Các nhà nghiên cứu âm nhạc cổ truyền và các nghệ nhân đàn tranh, đàn bầu, đàn tỳ bà.

### Nội Dung Chương Trình:

1. Nguồn gốc thang âm ngũ cung trong âm nhạc truyền thống Việt.
2. Vẻ đẹp bác học và triết lý thanh nhã của Nhã Nhạc Cung Đình Huế (Di sản văn hóa phi vật thể của nhân loại).
3. Không gian diễn xướng Ca Trù Bắc Bộ và Đờn Ca Tài Tử Nam Bộ.
4. Trình tấu minh họa trực tiếp các khúc ngâm và làn điệu cổ truyền.
5. Thảo luận và giải đáp thắc mắc cùng quý diễn giả.

> Vào cửa hoàn toàn miễn phí. Kính mời quý vị cùng gia đình và các bạn trẻ đến tham dự để cùng hòa mình vào không gian âm nhạc truyền thống dân tộc!`,
  },
  {
    id: 'art-tiep-nhan-500-an-ban-quy',
    title: 'Thư Viện Viện Việt Học Tiếp Nhận Hơn 500 Ấn Bản Sách Quý & Bản Thảo Lịch Sử Mới',
    excerpt: 'Bộ sưu tập tài liệu quý giá về lịch sử, địa chí và báo chí tiền chiến vừa được các học giả và gia đình thân hữu trao tặng cho Thư viện Viện Việt Học để số hóa phục vụ công chúng.',
    category: 'Nghiên cứu',
    authorId: 'vien-viet-hoc-editorial',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Ban Thủ Thư Thư Viện',
    published: true,
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 3,
    tags: ['Thư Viện', 'Sách Quý', 'Số Hóa', 'Lịch Sử', 'Tư Liệu'],
    content: `## Tin Mừng Cho Giới Nghiên Cứu Văn Học & Sử Học

Thư viện Viện Việt Học vừa vinh dự tiếp nhận bộ sưu tập gồm hơn 500 đầu sách và tư liệu quý giá do gia đình một vị giáo sư tiền bối trao tặng.

### Danh Mục Các Tác Phẩm Tiêu Biểu:

- Các ấn bản nguyên bản của tạp chí *Nam Phong Tạp Chí* (chủ bút Phạm Quỳnh), *Tri Tân*, *Tao Đàn*.
- Các bản dịch thơ Đường của cụ Tản Đà Nguyễn Khắc Hiếu ấn hành tại Hà Nội những năm 1930.
- Các tập san khảo cứu dân tộc học miền núi Trung phần và Tây Nguyên trước năm 1975.
- Các bộ từ điển Hán - Nôm và tài liệu địa chí các tỉnh thành Trung Bộ và Nam Bộ.

Hiện nay, Ban Kỹ Thuật Số Hóa của Viện đang tiến hành làm sạch, quét ảnh độ phân giải cao và trích xuất toàn văn (OCR) sang định dạng PDF và HTML để đưa lên cổng tìm kiếm trực tuyến PWA này, giúp mọi người dễ dàng tra cứu miễn phí.`,
  },
  {
    id: 'art-chuong-trinh-bao-ton-tieng-viet',
    title: 'Chương Trình Phát Triển & Giữ Gìn Tiếng Việt Dành Cho Thế Hệ Trẻ Hải Ngoại',
    excerpt: 'Tổng kết các lớp học ngữ văn, lịch sử và các buổi sinh hoạt văn hóa dành cho thanh thiếu niên tại vùng Little Saigon, Quận Cam trong năm qua.',
    category: 'Giáo dục',
    authorId: 'vien-viet-hoc-editorial',
    authorEmail: 'lyvuong@viethoc.com',
    authorName: 'Ban Giáo Dục & Thanh Thiếu Niên',
    published: true,
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 5,
    tags: ['Giáo Dục', 'Tiếng Việt', 'Tuổi Trẻ', 'Bảo Tồn', 'Văn Hóa'],
    content: `## Giữ Gìn Tiếng Mẹ Đẻ Nơi Xứ Người

> 'Tiếng Việt còn thì văn hóa Việt còn' - đó là tâm niệm thiêng liêng mà Viện Việt Học luôn gìn giữ qua hơn hai thập niên hoạt động tại hải ngoại.

### Các Thành Quả Trong Năm Qua:

- **Các Khóa Học Việt Ngữ**: Khai giảng 6 khóa bồi dưỡng Tiếng Việt và Văn Hóa Dân Tộc cho hơn 120 học sinh, sinh viên gốc Việt tại miền Nam California.
- **Tiếp Cận Văn Học Cổ Điển**: Tổ chức các chuyến tham quan thư viện, hướng dẫn các em tiếp cận và đọc các tác phẩm văn học kinh điển như *Truyện Kiều*, *Lục Vân Tiên*, ca dao tục ngữ dân tộc.
- **Cuộc Thi Học Thuật**: Phát động cuộc thi viết văn và thuyết trình bằng tiếng Việt về chủ đề *'Gia Đình & Cội Nguồn Dân Tộc'*.

Chúng tôi xin gửi lời tri ân chân thành đến quý phụ huynh và các thầy cô giáo thiện nguyện đã chung tay góp sức trong sứ mệnh cao đẹp này.`,
  },
];
