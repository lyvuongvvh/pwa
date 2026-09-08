import { ChuNomTranslationResult } from '../types';

export interface ChuNomSample {
  id: string;
  title: string;
  author: string;
  period: string;
  genre: string;
  source: string;
  description: string;
  svgDataUrl: string;
  context: string;
  precomputedResult: ChuNomTranslationResult;
}

// Generates an antique parchment SVG with classical vertical/horizontal calligraphy & seals
function createAntiqueNomSvg(
  title: string,
  lines: string[],
  sealText: string = 'Viện Việt Học'
): string {
  const lineElements = lines
    .map((line, idx) => {
      const y = 80 + idx * 46;
      return `<text x="50%" y="${y}" text-anchor="middle" font-family="'Noto Serif', 'Songti SC', 'SimSun', serif" font-size="28" font-weight="bold" fill="#1c1917" letter-spacing="4">${line}</text>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="380" viewBox="0 0 640 380">
    <defs>
      <linearGradient id="parchment" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fdfbf7"/>
        <stop offset="50%" stop-color="#f5ede0"/>
        <stop offset="100%" stop-color="#ebe0cc"/>
      </linearGradient>
      <filter id="ink-bleed">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    <!-- Parchment background with vintage aging -->
    <rect width="640" height="380" fill="url(#parchment)"/>
    <rect x="16" y="16" width="608" height="348" fill="none" stroke="#b45309" stroke-width="2" stroke-dasharray="8 4" opacity="0.6"/>
    <rect x="22" y="22" width="596" height="336" fill="none" stroke="#78350f" stroke-width="0.75" opacity="0.4"/>
    
    <!-- Title banner -->
    <text x="50%" y="42" text-anchor="middle" font-family="'Be Vietnam Pro', sans-serif" font-size="12" font-weight="600" fill="#92400e" letter-spacing="2">${title.toUpperCase()}</text>
    
    <!-- Classical Calligraphy Lines -->
    <g filter="url(#ink-bleed)">
      ${lineElements}
    </g>

    <!-- Traditional Red Imperial/Scholarly Seal -->
    <g transform="translate(520, 270)">
      <rect x="0" y="0" width="70" height="70" rx="4" fill="#dc2626" opacity="0.85"/>
      <rect x="4" y="4" width="62" height="62" rx="2" fill="none" stroke="#fef2f2" stroke-width="1.5"/>
      <text x="35" y="32" text-anchor="middle" font-family="'Noto Serif', serif" font-size="11" font-weight="bold" fill="#fef2f2">${sealText.slice(0, 4)}</text>
      <text x="35" y="50" text-anchor="middle" font-family="'Noto Serif', serif" font-size="11" font-weight="bold" fill="#fef2f2">${sealText.slice(4)}</text>
    </g>

    <!-- Marginal note -->
    <text x="34" y="340" font-family="'Be Vietnam Pro', sans-serif" font-size="10" fill="#a8a29e">Tàng thư Viện Việt Học • Mộc bản &amp; Bản cổ</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CHU_NOM_SAMPLES: ChuNomSample[] = [
  {
    id: 'truyen-kieu-mo-dau',
    title: 'Truyện Kiều (Đoạn Trường Tân Thanh)',
    author: 'Đại thi hào Nguyễn Du (1766 – 1820)',
    period: 'Đầu thế kỷ XIX (Thời Gia Long / Minh Mạng)',
    genre: 'Truyện thơ Nôm Lục bát',
    source: 'Bản khắc Mộc bản Liễu Văn Đường (Hà Nội, 1871)',
    description: 'Bốn câu mở đầu kiệt tác Đoạn Trường Tân Thanh thể hiện triết lý tài mệnh tương đố và nhân sinh quan sâu sắc.',
    svgDataUrl: createAntiqueNomSvg('Bản Mộc Bản Đoạn Trường Tân Thanh', [
      '𤾓𢆥𥪝𡎝𠊛嗟',
      '𡨸才𡨸命巧羅恄饒',
      '𣦆戈𠬠局𣷭橷',
      '仍調𥉩𦹵罵忉疸𢚸',
    ]),
    context: 'Trang đầu tác phẩm Đoạn Trường Tân Thanh của Tiên Điền Nguyễn Du, khắc in mộc bản thời Nguyễn.',
    precomputedResult: {
      nomUnicode: '𤾓𢆥𥪝𡎝𠊛嗟\n𡨸才𡨸命巧羅恄饒\n𣦆戈𠬠局𣷭橷\n仍調𥉩𦹵罵忉疸𢚸',
      quocNgu: 'Trăm năm trong cõi người ta,\nChữ tài chữ mệnh khéo là ghét nhau.\nTrải qua một cuộc bể dâu,\nNhững điều trông thấy mà đau đớn lòng.',
      modernTranslation: 'Trong cõi đời trăm năm của kiếp nhân sinh, chữ tài và chữ mệnh dường như luôn ngang trái, đố kỵ lẫn nhau. Trải qua những biến thiên dâu bể của thời cuộc, những nỗi thống khổ tận mắt chứng kiến khiến lòng người không khỏi xót xa, quặn thắt.',
      scriptType: 'Mộc bản khắc gỗ (Liễu Văn Đường), chữ chân phương (Khải thư Nôm)',
      estimatedPeriod: 'Thế kỷ XIX (Thời Nguyễn)',
      literaryGenre: 'Truyện thơ Lục bát cổ điển',
      summary: 'Lời đề từ mở đầu kiệt tác Truyện Kiều, đúc kết triết lý tài mệnh tương đố và nỗi niềm xót xa trước kiếp người bể dâu.',
      lines: [
        {
          lineNumber: 1,
          nomText: '𤾓𢆥𥪝𡎝𠊛嗟',
          quocNguText: 'Trăm năm trong cõi người ta',
          words: [
            { nom: '𤾓', quocNgu: 'Trăm', hanViet: 'Bách', meaning: 'Một trăm (số từ chỉ sự trọn vẹn của đời người)' },
            { nom: '𢆥', quocNgu: 'năm', hanViet: 'Niên', meaning: 'Năm tháng, tuổi đời' },
            { nom: '𥪝', quocNgu: 'trong', hanViet: 'Trung', meaning: 'Bên trong, giới hạn' },
            { nom: '𡎝', quocNgu: 'cõi', hanViet: 'Giới', meaning: 'Cõi thế gian, trần thế' },
            { nom: '𠊛', quocNgu: 'người', hanViet: 'Nhân', meaning: 'Con người, nhân gian' },
            { nom: '嗟', quocNgu: 'ta', hanViet: 'Ta', meaning: 'Chúng ta, loài người' },
          ],
        },
        {
          lineNumber: 2,
          nomText: '𡨸才𡨸命巧羅恄饒',
          quocNguText: 'Chữ tài chữ mệnh khéo là ghét nhau',
          words: [
            { nom: '𡨸', quocNgu: 'Chữ', hanViet: 'Tự', meaning: 'Khái niệm, phận định' },
            { nom: '才', quocNgu: 'tài', hanViet: 'Tài', meaning: 'Tài năng, tài hoa xuất chúng' },
            { nom: '𡨸', quocNgu: 'chữ', hanViet: 'Tự', meaning: 'Số phận, mệnh vận' },
            { nom: '命', quocNgu: 'mệnh', hanViet: 'Mệnh', meaning: 'Định mệnh, số kiếp thiên định' },
            { nom: '巧', quocNgu: 'khéo', hanViet: 'Xảo', meaning: 'Khéo léo, trớ trêu thay' },
            { nom: '羅', quocNgu: 'là', hanViet: 'La', meaning: 'Thật là, hệ từ' },
            { nom: '恄', quocNgu: 'ghét', hanViet: 'Hận/Ghét', meaning: 'Đố kỵ, xung khắc' },
            { nom: '饒', quocNgu: 'nhau', hanViet: 'Tương', meaning: 'Lẫn nhau' },
          ],
        },
        {
          lineNumber: 3,
          nomText: '𣦆戈𠬠局𣷭橷',
          quocNguText: 'Trải qua một cuộc bể dâu',
          words: [
            { nom: '𣦆', quocNgu: 'Trải', hanViet: 'Kinh/Lịch', meaning: 'Nếm trải, qua bao năm tháng' },
            { nom: '戈', quocNgu: 'qua', hanViet: 'Qua', meaning: 'Đi qua' },
            { nom: '𠬠', quocNgu: 'một', hanViet: 'Nhất', meaning: 'Một lần, một chặng' },
            { nom: '局', quocNgu: 'cuộc', hanViet: 'Cuộc', meaning: 'Cuộc đời, thế cuộc' },
            { nom: '𣷭', quocNgu: 'bể', hanViet: 'Hải', meaning: 'Biển cả (trong thương hải tang điền)' },
            { nom: '橷', quocNgu: 'dâu', hanViet: 'Tang', meaning: 'Bãi dâu tằm biến thiên' },
          ],
        },
        {
          lineNumber: 4,
          nomText: '仍調𥉩𦹵罵忉疸𢚸',
          quocNguText: 'Những điều trông thấy mà đau đớn lòng',
          words: [
            { nom: '仍', quocNgu: 'Những', hanViet: 'Chư', meaning: 'Các điều, số nhiều' },
            { nom: '調', quocNgu: 'điều', hanViet: 'Điều', meaning: 'Sự việc, cảnh ngộ' },
            { nom: '𥉩', quocNgu: 'trông', hanViet: 'Trọng/Vọng', meaning: 'Nhìn thấy tận mắt' },
            { nom: '𦹵', quocNgu: 'thấy', hanViet: 'Kiến', meaning: 'Chứng kiến' },
            { nom: '罵', quocNgu: 'mà', hanViet: 'Nhi', meaning: 'Khiến cho' },
            { nom: '忉', quocNgu: 'đau', hanViet: 'Thống', meaning: 'Đau xót' },
            { nom: '疸', quocNgu: 'đớn', hanViet: 'Đởn', meaning: 'Khôn xiết' },
            { nom: '𢚸', quocNgu: 'lòng', hanViet: 'Tâm', meaning: 'Tâm can, đáy dạ' },
          ],
        },
      ],
      annotations: [
        {
          term: 'Trăm năm (𤾓𢆥)',
          explanation: 'Mượn ý từ câu cổ ngữ "Nhân sinh bách tuế" (đời người sống trăm năm), chỉ trọn vẹn một kiếp nhân sinh.',
        },
        {
          term: 'Tài mệnh tương đố (才命相妬)',
          explanation: 'Quan niệm triết học Á Đông cổ: Người có tài hoa xuất chúng thường gặp số phận trắc trở, gian truân.',
        },
        {
          term: 'Cuộc bể dâu (𣷭橷)',
          explanation: 'Từ thành ngữ Hán-Việt "Thương hải biến vi tang điền" (Biển xanh hóa thành bãi dâu), ngụ ý thế sự đổi thay khôn lường.',
        },
      ],
    },
  },
  {
    id: 'chinh-phu-ngam-khuc',
    title: 'Chinh Phụ Ngâm Khúc (Bản dịch Nôm)',
    author: 'Nguyên tác: Đặng Trần Côn — Diễn Nôm: Đoàn Thị Điểm',
    period: 'Thế kỷ XVIII (Thời Hậu Lê / Trịnh Nguyễn phân tranh)',
    genre: 'Song thất lục bát',
    source: 'Bản lưu trữ Viện Việt Học',
    description: 'Tác phẩm đỉnh cao diễn tả nỗi cô đơn, sầu muộn của người vợ có chồng tòng quân nơi biên ải.',
    svgDataUrl: createAntiqueNomSvg('Chinh Phụ Ngâm Khúc Bản Nôm', [
      '𪔠長城𢩣𢲿𩂀月',
      '塊甘泉𡐙𡑝式fc',
      '九重𠶔𠤩𩙋旗',
      '𠬠𢬣捲土𢺺飛𣋂𣋂',
    ], 'Chinh Phụ'),
    context: 'Khổ thơ mở đầu Chinh Phụ Ngâm Khúc, khắc họa cảnh tượng chiến tranh biên ải dấy loạn.',
    precomputedResult: {
      nomUnicode: '𪔠長城𢩣𢲿𩂀月\n塊甘泉𡐙𡑝式雲\n九重𠶔𠤩𩙋旗\n𠬠𢬣捲土𢺺飛𣋂𣋂',
      quocNgu: 'Trống Tràng thành lung lay bóng nguyệt,\nKhói Cam Tuyền mờ mịt thức mây.\nChín tầng gươm báu trao tay,\nNửa đêm truyền hịch, định ngày xuất chinh.',
      modernTranslation: 'Tiếng trống trận nơi trường thành dồn dập làm xao động cả ánh trăng khuya; khói lửa báo động từ ải Cam Tuyền bốc lên ngút ngàn che mờ bóng mây. Nơi cung cấm, đấng thiên tử ban gươm báu trao quyền thống soái; nửa đêm truyền hịch tướng sĩ lên đường dẹp loạn.',
      scriptType: 'Khải thư Nôm tao nhã, nét bút lông thanh đậm',
      estimatedPeriod: 'Thế kỷ XVIII (Thời Lê Trung Hưng)',
      literaryGenre: 'Khúc ngâm Song thất lục bát',
      summary: 'Khung cảnh biên thùy bốc khói lửa chiến tranh, tiếng trống trận giục giã và lệnh xuất chinh khẩn cấp của triều đình.',
      lines: [
        {
          lineNumber: 1,
          nomText: '𪔠長城𢩣𢲿𩂀月',
          quocNguText: 'Trống Tràng thành lung lay bóng nguyệt',
          words: [
            { nom: '𪔠', quocNgu: 'Trống', hanViet: 'Cổ', meaning: 'Trống trận báo nguy nơi biên cương' },
            { nom: '長', quocNgu: 'Tràng', hanViet: 'Trường', meaning: 'Vạn Lý Trường Thành hoặc thành trì biên ải' },
            { nom: '城', quocNgu: 'thành', hanViet: 'Thành', meaning: 'Thành lũy, quan ải' },
            { nom: '𢩣', quocNgu: 'lung', hanViet: 'Lung', meaning: 'Rung chuyển' },
            { nom: '𢲿', quocNgu: 'lay', hanViet: 'Lay', meaning: 'Chao đảo' },
            { nom: '𩂀', quocNgu: 'bóng', hanViet: 'Ảnh', meaning: 'Hình bóng, ánh sáng' },
            { nom: '月', quocNgu: 'nguyệt', hanViet: 'Nguyệt', meaning: 'Mặt trăng' },
          ],
        },
        {
          lineNumber: 2,
          nomText: '塊甘泉𡐙𡑝式雲',
          quocNguText: 'Khói Cam Tuyền mờ mịt thức mây',
          words: [
            { nom: '塊', quocNgu: 'Khói', hanViet: 'Yên', meaning: 'Khói lửa hiệu (phong yên)' },
            { nom: '甘', quocNgu: 'Cam', hanViet: 'Cam', meaning: 'Tên cung Cam Tuyền thời Hán' },
            { nom: '泉', quocNgu: 'Tuyền', hanViet: 'Tuyền', meaning: 'Điển tích khói lửa báo động biên ải' },
            { nom: '𡐙', quocNgu: 'mờ', hanViet: 'Minh', meaning: 'Mờ ảo' },
            { nom: '𡑝', quocNgu: 'mịt', hanViet: 'Mịch', meaning: 'Tăm tối, dày đặc' },
            { nom: '式', quocNgu: 'thức', hanViet: 'Sắc', meaning: 'Sắc thái, dáng vẻ' },
            { nom: '雲', quocNgu: 'mây', hanViet: 'Vân', meaning: 'Tầng mây' },
          ],
        },
      ],
      annotations: [
        {
          term: 'Tràng thành (長城)',
          explanation: 'Mượn hình ảnh Vạn Lý Trường Thành của Trung Hoa để phiếm chỉ các đồn lũy, phòng tuyến quan ải phía Bắc.',
        },
        {
          term: 'Cam Tuyền (甘泉)',
          explanation: 'Điển tích thời Hán Văn Đế: rợ Hung Nô xâm lấn, ban đêm đốt lửa hiệu ở núi Cam Tuyền báo tin cấp về kinh đô.',
        },
        {
          term: 'Chín tầng (九重)',
          explanation: 'Cửu trùng, chỉ cung đình hoàng đế ngự, nơi cơ mật tối cao ban bố chiếu chỉ.',
        },
      ],
    },
  },
  {
    id: 'qua-deo-ngang',
    title: 'Qua Đèo Ngang (Bà Huyện Thanh Quan)',
    author: 'Bà Huyện Thanh Quan (Nguyễn Thị Hinh, TK XIX)',
    period: 'Thời Nguyễn (Thế kỷ XIX)',
    genre: 'Thất ngôn bát cú Đường luật',
    source: 'Kho tàng Thơ Nôm Cổ Điển',
    description: 'Bài thơ kiệt tác hoài cổ với cảnh sắc Đèo Ngang hùng vĩ đượm buồn và tấm lòng nhớ nước thương nhà.',
    svgDataUrl: createAntiqueNomSvg('Qua Đèo Ngang Thi Tập', [
      '𨀈細𡸇横𩂀𣋂斜',
      '𦹵𣘃嗔 đá lá 嗔花',
      '𢺺𢬓低 núi 樵𠄩 chú',
      '落 đác Bên 瀧 chợ 𠄩 nhà',
    ], 'Thanh Quan'),
    context: 'Bốn câu đầu bài thơ Nôm Qua Đèo Ngang của Nữ sĩ Bà Huyện Thanh Quan trên đường vào kinh đô Huế nhậm chức.',
    precomputedResult: {
      nomUnicode: '𨀈細𡸇横𩂀𣋂斜\n𦹵𣘃嗔 đá lá 嗔花\n𢺺𢬓低 núi 樵𠄩 chú\n落 đác Bên 瀧 chợ 𠄩 nhà',
      quocNgu: 'Bước tới Đèo Ngang bóng xế tà,\nCỏ cây chen đá, lá chen hoa.\nLom khom dưới núi tiều vài chú,\nLác đác bên sông chợ mấy nhà.',
      modernTranslation: 'Bước chân đến Đèo Ngang vào lúc hoàng hôn bóng xế tà, cảnh vật thiên nhiên hoang sơ với cỏ cây chen chúc mọc xen kẽ cùng đá sỏi và hoa dại. Dưới chân núi thoang thoáng bóng vài người tiều phu lom khom đốn củi; thưa thớt bên bờ sông rải rác một vài mái lều chợ sớm.',
      scriptType: 'Hành thư mềm mại, chuẩn mực thể thơ Đường luật Nôm',
      estimatedPeriod: 'Thế kỷ XIX (Thời Minh Mạng / Thiệu Trị)',
      literaryGenre: 'Thơ Thất ngôn bát cú Đường luật',
      summary: 'Khung cảnh thiên nhiên buổi hoàng hôn trên đỉnh Đèo Ngang vắng lặng, hoang sơ và đượm tình hoài cổ.',
      lines: [
        {
          lineNumber: 1,
          nomText: '𨀈細𡸇横𩂀𣋂斜',
          quocNguText: 'Bước tới Đèo Ngang bóng xế tà',
          words: [
            { nom: '𨀈', quocNgu: 'Bước', hanViet: 'Bộ', meaning: 'Cất bước, đặt chân tới' },
            { nom: '細', quocNgu: 'tới', hanViet: 'Tế', meaning: 'Đến nơi' },
            { nom: '𡸇', quocNgu: 'Đèo', hanViet: 'Ải/Đèo', meaning: 'Đèo Hoành Sơn' },
            { nom: '横', quocNgu: 'Ngang', hanViet: 'Hoành', meaning: 'Ranh giới Hà Tĩnh - Quảng Bình' },
            { nom: '𩂀', quocNgu: 'bóng', hanViet: 'Ảnh', meaning: 'Bóng nắng mặt trời' },
            { nom: '𣋂', quocNgu: 'xế', hanViet: 'Tà', meaning: 'Xế chiều' },
            { nom: '斜', quocNgu: 'tà', hanViet: 'Tà', meaning: 'Hoàng hôn buông xuống' },
          ],
        },
      ],
      annotations: [
        {
          term: 'Đèo Ngang (𡸇横 - Hoành Sơn Quan)',
          explanation: 'Cửa ải hiểm trở ngăn cách giữa Hà Tĩnh và Quảng Bình, ranh giới lịch sử thời Đàng Trong - Đàng Ngoài.',
        },
        {
          term: 'Điệp từ "chen" (嗔)',
          explanation: 'Gợi sức sống bền bỉ, hoang dại của cỏ cây hoa lá trước đá núi cằn cỗi nơi đèo cao heo hút.',
        },
      ],
    },
  },
];
