import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { Row, Col } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Thumbs, Scrollbar } from 'swiper';
import 'swiper/css/scrollbar';

import productApi from 'api/productApi';
import { getCart, createCart } from 'redux/cartSlice';
import { setRedirectOfLogin } from 'redux/authSlice';
import Card from 'components/comon/Card';
import { toast } from 'handler/toast.handler';
import images from 'assets/images';

function Detail() {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState(null);

    const [size, setSize] = useState(null);
    const [stock, setStock] = useState(null);
    const [qty, setQty] = useState(1);

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [error, setError] = useState(false);

    const userId = useSelector(state => state.auth.currentUser?._id);

    const { slug } = useParams();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const getProduct = async () => {
        try {
            const { product } = await productApi.get(slug);
            setProduct(product);

            getRelated(product.slug, product.category.name);
        } catch (err) {
            navigate('404');
        }
    };

    const getRelated = async (slug, category) => {
        try {
            const res = await productApi.related(slug, category);
            setRelatedProducts(res.products);
        } catch (err) {
            console.log(err);
        }
    };

    const choseSize = option => {
        setSize(option.size);
        setStock(option.stock);
        if (error) setError(false);
    };

    const changeQty = type => {
        if (!size) {
            setError(true);
        } else {
            const stock = product.options.find(item => item.size === size).stock;

            if (type === 'minus') {
                qty > 1 && setQty(qty => qty - 1);
            } else if (type === 'plus') {
                qty < stock && setQty(qty => qty + 1);
            } else {
                const value = type.target.value;

                if (value > stock) setQty(stock);
                else if (value < 1) setQty(1);
                else setQty(value);
            }
        }
    };

    const addToCart = async path => {
        if (!size) {
            setError(true);
        } else if (!userId) {
            dispatch(setRedirectOfLogin(pathname));

            navigate('/login');
        } else {
            const data = {
                product: product._id,
                size: Number(size),
                qty,
                stock
            };

            await dispatch(createCart(data));
            await dispatch(getCart(userId));
            toast('success', 'Successfully added', 'top-right');
            navigate('/' + path);
        }
    };

    return (
        product && (
            <div className="container py-5">
                <Row gutter={24}>
                    <Col span={16}>
                        <Row gutter={[12, 12]} justify="center">
                            <Col span={12}>
                                <Swiper
                                    thumbs={{ swiper: thumbsSwiper }}
                                    spaceBetween={4}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false
                                    }}
                                    loop={true}
                                    modules={[FreeMode, Thumbs, Autoplay]}
                                    className="mySwiper2"
                                >
                                    {product.images.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={item.url}
                                                className="rounded cursor-pointer "
                                                alt={`slide ${index}`}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </Col>
                            <Col span={12}>
                                <img src={product.thumbnail.url} className="rounded" alt={`${product.title}-0`} />
                            </Col>

                            <Col span={12}>
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    slidesPerView={4}
                                    spaceBetween={20}
                                    loop={true}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Thumbs]}
                                    className="mySwiper w-[80%]"
                                >
                                    {product.images.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={item.url}
                                                alt={`slide ${index}`}
                                                className="rounded cursor-pointer"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div className="px-5 flex-column">
                            <h1 className="capitalize font-medium text-4xl">{product.title}</h1>
                            <span className="text-base">{product.subTitle}</span>
                            <span className="mt-4 text-xl text-red-500">{product.price.toLocaleString('de-DE')}đ</span>
                            <p className="mt-4 text-sm">{product.description}</p>

                            {/* <div className="mt-5 flex items-center gap-x-2 capitalize">
                                <span className="font-semibold text-base">Category: </span>
                                <Link to={`/c/${product.genders[0]}/${product.category.name}`}>
                                    {product.category.name}
                                </Link>
                            </div>
                            <div className="mt-5 flex items-center gap-x-2 capitalize">
                                <span className="font-semibold text-base">Gender: </span>
                                {product.genders.map((gender, index) => (
                                    <Link to={`/c/${gender}`} key={index}>
                                        {gender}
                                    </Link>
                                ))}
                            </div> */}

                            <div className="mt-5 flex-column gap-x-3">
                                <span className="text-base">Choose a size </span>
                                <div className="flex-1 mt-2">
                                    <div className="mb-2">
                                        <Row gutter={[0, 12]}>
                                            {product.options.map((option, index) => (
                                                <Col span={4} key={index}>
                                                    <span
                                                        className={`py-[5px] h-[30px] w-full block text-center transition-all border-b text-xs
                                                    ${
                                                        option.size === size
                                                            ? 'border-[#26acbb] border-b-[3px] text-[#26acbb]'
                                                            : ' border-gray-300'
                                                    }
                                                    ${
                                                        option.stock === 0
                                                            ? 'opacity-50 cursor-default select-none'
                                                            : 'cursor-pointer'
                                                    }`}
                                                        onClick={() => option.stock !== 0 && choseSize(option)}
                                                    >
                                                        {option.size}
                                                    </span>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>

                                    <div className="h-[20px] italic pt-1">
                                        <span
                                            className={`cursor-pointer transition-all duration-200 pl-1 hover:opacity-40 ${
                                                !size ? 'hidden' : 'block'
                                            }`}
                                            onClick={() => {
                                                setSize(null);
                                                setStock(null);
                                            }}
                                        >
                                            Clear
                                        </span>
                                        <span className={`text-red-600 ${!error ? 'hidden' : 'block'}`}>
                                            Please select size
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-x-6">
                                <div className="py-3 flex-between-center bg-[#f6f6f6] w-40 rounded-full">
                                    <button
                                        className="flex-1 h-full transition-all cursor-pointer font-medium"
                                        onClick={() => changeQty('minus')}
                                    >
                                        <AiOutlineMinus size={16} />
                                    </button>
                                    <input
                                        type="number"
                                        value={qty}
                                        className="w-12 text-center text-base font-medium"
                                        onChange={changeQty}
                                    />
                                    <button
                                        className="flex-1 h-full transition-all cursor-pointer font-medium"
                                        onClick={() => changeQty('plus')}
                                    >
                                        <AiOutlinePlus size={16} />
                                    </button>
                                </div>

                                {stock && (
                                    <div className="text-xs">
                                        Only <span className="text-[#ED9857] font-semibold">{stock} item</span>! <br />
                                        Don't miss it
                                    </div>
                                )}
                            </div>

                            <div className="flex mt-8 h-14 gap-x-4">
                                <div className="flex-1 rounded-full flex-center bg-[#5B8FB9] text-white duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_#5B8FB9]">
                                    <button
                                        className="text-base font-bold w-full h-full text-inherit cursor-pointer"
                                        onClick={() => addToCart('checkout')}
                                    >
                                        Buy now
                                    </button>
                                </div>
                                <div className="flex-1 rounded-full flex-center text-[#5B8FB9] border-[3px] border-current duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_currentcolor]">
                                    <button
                                        className="text-base font-bold w-full h-full text-inherit cursor-pointer"
                                        onClick={() => addToCart('cart')}
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center">
                                <span className="text-base">Share: </span>
                                <div className="flex-center">
                                    <div
                                        className="w-8 h-8 shadow-[0px_7px_29px_0px_#006fff87] rounded-full flex-center ml-4 transition-all 
                                    duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1"
                                    >
                                        <img className="w-4 h-4" src={images.social.facebook} alt="facebook" />
                                    </div>
                                    <div
                                        className="w-8 h-8 shadow-[0px_7px_29px_0px_#006fff87] rounded-full flex-center ml-4 transition-all 
                                    duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1"
                                    >
                                        <img className="w-4 h-4" src={images.social.instagram} alt="instagram" />
                                    </div>
                                    <div
                                        className="w-8 h-8 shadow-[0px_7px_29px_0px_#006fff87] rounded-full flex-center ml-4 transition-all 
                                    duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1"
                                    >
                                        <img className="w-4 h-4" src={images.social.google} alt="google" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* <h3 className="text-xl my-8">You Might Also Like</h3> */}
                <h2 className="font-medium mt-8 mb-6">Related products</h2>
                <div className="mb-8">
                    <Swiper
                        spaceBetween={12}
                        slidesPerView={3}
                        scrollbar={{
                            hide: false
                        }}
                        modules={[Scrollbar]}
                    >
                        {relatedProducts?.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Card data={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        )
    );
}

export default Detail;
