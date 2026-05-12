import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { heroSlides } from '../../data/products';

export default function HeroSlider() {
  const { products } = useSelector((state) => state.products);
  const liveSlides = Array.isArray(products)
    ? products.slice(0, 3).map((product, index) => ({
        id: product._id || product.id || index,
        title: product.name,
        subtitle: product.description,
        image: product.images?.[0]?.url || product.images?.[0] || `https://picsum.photos/seed/live-hero-${index}/1600/900`,
        cta: 'Shop Now'
      }))
    : [];
  const slides = liveSlides.length > 0 ? liveSlides : heroSlides;
  const canLoop = slides.length > 1;

  return (
    <section className="container-shell pt-4 sm:pt-8">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={canLoop ? { delay: 3500 } : false}
        pagination={{ clickable: true }}
        loop={canLoop}
        className="rounded-2xl sm:rounded-[2rem]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative overflow-hidden">
              <img src={slide.image} alt={slide.title} className="h-[280px] w-full object-cover sm:h-[400px] md:h-[520px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
              <div className="absolute inset-0 flex items-end sm:items-center">
                <div className="w-full px-6 pb-6 text-white sm:max-w-2xl sm:px-12 sm:pb-12">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-accent sm:text-sm">Omni selection</p>
                  <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">{slide.title}</h1>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-200 sm:mt-5 sm:max-w-xl sm:text-base">{slide.subtitle}</p>
                  <Link to="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 sm:mt-8 sm:px-6 sm:py-3">
                    {slide.cta}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
