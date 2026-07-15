'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    title: 'Bring Your Ideas to Life',
    subtitle: 'Join thousands of creators who have funded their dreams through community support.',
    bg: 'bg-gradient-to-r from-indigo-600 to-purple-700',
    cta: 'Start a Campaign',
    link: '/register'
  },
  {
    title: 'Support Innovation Today',
    subtitle: 'Discover groundbreaking projects and help turn visions into reality.',
    bg: 'bg-gradient-to-r from-blue-600 to-teal-600',
    cta: 'Explore Campaigns',
    link: '/campaigns'
  },
  {
    title: 'Empower Creators Worldwide',
    subtitle: 'Every contribution makes a difference. Be part of something bigger.',
    bg: 'bg-gradient-to-r from-purple-600 to-pink-600',
    cta: 'Join Now',
    link: '/register'
  }
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      className="w-full h-[500px] md:h-[600px]"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className={`${slide.bg} h-full flex items-center justify-center text-white px-4`}>
            <div className="text-center max-w-3xl animate-fadeIn">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200">{slide.subtitle}</p>
              <a href={slide.link} className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
                {slide.cta}
              </a>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
