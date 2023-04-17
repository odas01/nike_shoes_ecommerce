import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
// import { Scrollbar } from 'swiper';

import 'swiper/css/scrollbar';
import Card from 'components/comon/Card';
import images from 'assets/images';
import productApi from 'api/productApi';
import { BsArrowRight } from 'react-icons/bs';

function Home() {
    const [popularProducts, setPopularProducts] = useState(null);

    useEffect(() => {
        const getPopularProducts = async () => {
            try {
                const { products } = await productApi.popular();
                setPopularProducts(products.map(item => item.product));
            } catch (err) {
                console.log(err);
            }
        };
        getPopularProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* Banner */}
            <div className="banner relative">
                <img src={images.bannerr} alt="" className="w-[580px] absolute right-28 bottom-0 object-contain" />
                <div className="flex-column absolute top-1/3 left-28 text-white">
                    <span className="font-nikeFutura tracking-[8px] text-8xl overflow-hidden whitespace-nowrap animate-typing">
                        JUST DO IT
                    </span>
                    <span className="font-nikeFutura text-3xl italic mt-2">Play With Electric Nike Shoes</span>
                    <Link
                        to="/c"
                        className="relative mt-24 px-5 py-3 flex-center rounded-full bg-white text-black w-fit cursor-pointer group"
                    >
                        <span className="text-lg mr-4 font-medium z-10 duration-300 group-hover:text-white">
                            Start Shopping
                        </span>
                        <div className="rounded-full p-2 pr-0 flex-center z-10">
                            <BsArrowRight color="#fff" />
                        </div>
                        <div className="absolute right-[10px] w-10 h-10 bg-[#181823] rounded-full duration-300 group-hover:w-[102%] group-hover:h-[102%] group-hover:right-[-1px]"></div>
                    </Link>
                </div>
            </div>

            {/* Body */}
            <div className="container">
                {/* Popular product */}
                <h2 className="mt-10 mb-6 font-medium">Popular products</h2>
                <div>
                    <Swiper
                        spaceBetween={12}
                        slidesPerView={4}
                        // scrollbar={{
                        //     hide: false
                        // }}
                        // modules={[Scrollbar]}
                    >
                        {popularProducts?.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Card data={item} size={16} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* ----------------- */}
                <div className="text-center mt-10 mb-14 ">
                    <h1 className="font-nikeFutura text-5xl uppercase">Just do it</h1>
                    <p className="font-medium text-base my-1">Free your sparkle</p>
                    <Link
                        to="c"
                        className="mt-6 bg-[#181823] text-white inline-block px-5 py-2 rounded-full 
                    cursor-pointer hover:opacity-80 hover:text-white"
                    >
                        Shop now
                    </Link>
                </div>
                <img className="rounded-lg" src={images.banner.men} alt="banner-kids" />

                <div className="text-center mt-16 mb-14 ">
                    <h1 className="font-nikeFutura text-5xl uppercase">Keep up the spirit</h1>
                    <Link
                        to="c"
                        className="mt-6 bg-[#181823] text-white inline-block px-5 py-2 rounded-full 
                    cursor-pointer hover:opacity-80 hover:text-white"
                    >
                        Shop now
                    </Link>
                </div>
                <img className="rounded-lg" src={images.banner.kids} alt="banner-kids" />
            </div>
        </>
    );
}

export default Home;
