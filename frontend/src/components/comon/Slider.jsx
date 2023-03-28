import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';

import images from 'assets/images';

function Slider() {
    return (
        <Swiper
            className="rounded h-[660px]"
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
                delay: 10000,
                disableOnInteraction: false
            }}
            pagination={{
                clickable: true
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
        >
            {images.slide.map((item, index) => (
                <SwiperSlide key={index}>
                    <img src={item} alt={`slide ${index}`} className="w-full" />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default Slider;
