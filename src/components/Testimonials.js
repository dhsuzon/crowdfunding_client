'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  { name: 'Sarah Ahmed', role: 'Creator', quote: 'This platform helped me raise funds for my community art project. The process was smooth and the community is incredibly supportive.', img: 'https://i.pravatar.cc/150?img=1' },
  { name: 'John Doe', role: 'Supporter', quote: 'I love discovering new projects and supporting creators. The credit system is easy to use and I feel good knowing I am making a difference.', img: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Emily Chen', role: 'Creator', quote: 'I launched my tech startup campaign here and reached my funding goal in just two weeks. Highly recommend for any aspiring entrepreneur.', img: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Michael Rivera', role: 'Supporter', quote: 'The platform is very transparent. I can see exactly where my contributions go and how campaigns are progressing.', img: 'https://i.pravatar.cc/150?img=4' },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">What Our Users Say</h2>
        <p className="text-center text-gray-600 mb-12">Hear from creators and supporters who have used our platform.</p>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="pb-12"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="bg-gray-50 p-8 rounded-xl text-center h-full">
                <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
                <p className="text-gray-600 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                <h4 className="font-semibold text-gray-900">{t.name}</h4>
                <p className="text-sm text-indigo-600">{t.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
