import React from 'react';
import {
  Building,
  MapPin,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Globe,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Masthead */}
      <div className="relative overflow-hidden bg-linear-to-r from-[#800020] via-[#8b1538] to-[#580d23] rounded-2xl p-8 text-white shadow-xl border border-[#9f2244]">
        <div className="absolute inset-0 bg-[url('/viethoc-header-bg.png')] bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-5xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold uppercase mb-3">
              <Building className="w-3.5 h-3.5 text-amber-300" />
              <span>Thành lập ngày 26 tháng 2 năm 2000</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white mb-2">
              Giới Thiệu Viện Việt Học
            </h1>
            <p className="text-base font-medium text-amber-200 uppercase tracking-wider mb-4">
              INSTITUTE OF VIETNAMESE STUDIES &bull; WESTMINSTER, CALIFORNIA
            </p>
            <p className="text-sm sm:text-base text-rose-100 leading-relaxed italic">
              &ldquo;Viện Việt Học là một tổ chức nghiên cứu và giáo dục bất vụ lợi, hướng tới mục tiêu giữ gìn và thắp sáng ngọn lửa văn hóa, lịch sử và ngôn ngữ dân tộc Việt Nam cho các thế hệ hôm nay và mai sau.&rdquo;
            </p>
          </div>
          <div className="shrink-0 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border-2 border-amber-400/50 shadow-xl self-center md:self-auto">
            <img
              src="/viethoc-logo.jpg"
              alt="Logo Viện Việt Học"
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Grid: Tôn chỉ & Lịch sử */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            Tôn Chỉ & Mục Đích Hoạt Động
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <span><strong>Thắt chặt tình tự dân tộc:</strong> Tạo nhịp cầu gắn kết thân hữu và chia sẻ tri thức giữa cộng đồng người Việt trên khắp thế giới.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <span><strong>Nghiên cứu & Khảo luận:</strong> Đánh giá một cách khoa học, khách quan và trung thực những giá trị nhân bản trong kho tàng văn hóa Việt Nam.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <span><strong>Đóng góp vào văn minh nhân loại:</strong> Giới thiệu những tinh hoa nghệ thuật, triết học và văn học Việt Nam đến bạn bè quốc tế.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <span><strong>Phục vụ giới trẻ:</strong> Đào tạo ngôn ngữ và văn hóa cho thanh thiếu niên gốc Việt sinh ra và lớn lên ở hải ngoại.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            Thư Viện & Kho Sách Nghiên Cứu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Thư viện Viện Việt Học hiện lưu trữ hơn <strong>8.000 đầu sách</strong> và tài liệu quý hiếm, bao gồm nhiều ấn bản trước năm 1975, các tạp chí văn học nghệ thuật và luận văn nghiên cứu.
          </p>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <p><strong>Phân loại chuẩn mực:</strong> Hơn 2.000 tác phẩm đã được phân loại theo hệ thống Thư Viện Quốc Hội Hoa Kỳ (Library of Congress Classification - LCC).</p>
            <p><strong>Dự án Số Hóa Toàn Văn (PWA):</strong> Toàn bộ các tài liệu văn bản đang được trích xuất dữ liệu toàn văn và lưu trữ trên hệ thống PWA này để độc giả có thể tra cứu tức thì mọi lúc mọi nơi.</p>
          </div>
        </div>
      </div>

      {/* Các Ban Chuyên Môn */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
          Các Hoạt Động & Ban Chuyên Môn
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <GraduationCap className="w-6 h-6 text-[#800020] mb-2" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">Giáo Dục & Huấn Luyện</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các lớp học Tiếng Việt, Lịch sử, Văn phạm, Triết học Đông phương dành cho các cấp độ từ cơ bản đến nâng cao.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <Calendar className="w-6 h-6 text-amber-700 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">Thuyết Trình Định Kỳ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hội thảo văn hóa, các buổi ra mắt sách và diễn thuyết học thuật diễn ra vào các chiều Thứ Bảy hàng tháng.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <Globe className="w-6 h-6 text-sky-700 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">Xuất Bản & Số Hóa</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ấn hành sách nghiên cứu, tài liệu kỷ yếu và xây dựng cơ sở dữ liệu số hóa phục vụ độc giả toàn cầu.
            </p>
          </div>
        </div>
      </div>

      {/* Thông tin liên lạc & Trụ sở */}
      <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
              Trụ Sở & Thư Viện Viện Việt Học
            </h2>
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-700 shrink-0" />
                <span>15355 Brookhurst St # 222, Westminster, CA 92683, USA</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                <span>info@viethoc.org &bull; lyvuong@viethoc.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-700 shrink-0" />
                <span>www.viethoc.com &bull; www.viethoc.org</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs text-slate-700 max-w-xs space-y-1.5">
            <span className="font-bold text-[#800020] block">Giờ Mở Cửa Thư Viện:</span>
            <p>Thứ Ba - Thứ Bảy: 10:00 AM - 5:00 PM</p>
            <p>Chủ Nhật & Thứ Hai: Nghỉ</p>
            <p className="text-[11px] text-slate-500 italic pt-1">Kính mời quý độc giả và học giả đến tham quan và tra cứu tài liệu.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
