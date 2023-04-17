import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateItem, deleteItem } from 'redux/cartSlice';
import { Row, Col } from 'antd';
import { RiDeleteBin5Line } from 'react-icons/ri';

import images from 'assets/images';

function Cart() {
    const [loading, setLoading] = useState(false);

    const { items: cart, qty } = useSelector(state => state.cart);
    const totalPrice = cart?.reduce((cur, item) => cur + item.qty * item.product.price, 0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeQty = async (type, item) => {
        setLoading(true);
        let newQty = item.qty;
        if (type === 'plus') {
            newQty += 1;
        } else if (type === 'minus') {
            newQty -= 1;
        }
        await dispatch(updateItem({ itemId: item._id, qty: newQty }));
        setLoading(false);
    };

    const handleDelete = async id => {
        dispatch(deleteItem(id));
    };
    console.log(cart);
    return (
        <div className="container pb-8">
            <h2 className="text-center font-semibold">Your cart {qty > 0 && <span>({qty})</span>}</h2>
            {qty > 0 ? (
                <>
                    <div className="pb-2 mt-8 mb-4 border-b border-gray-400">
                        <Row>
                            <Col span={11}>
                                <span className="font-semibold text-base">Product</span>
                            </Col>
                            <Col span={4}>
                                <span className="font-semibold text-base">Price</span>
                            </Col>
                            <Col span={4} className="text-center">
                                <span className="font-semibold text-base">Quantity</span>
                            </Col>
                            <Col span={4} className="flex justify-end">
                                <span className="font-semibold text-base">Total</span>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    </div>

                    <div className="mb-6">
                        {cart.map((item, index) => (
                            <div className="py-2 border-b border-gray-300" key={index}>
                                <Row>
                                    <Col span={11}>
                                        <Link to={'/d/' + item.product.slug} className="flex pr-6 hover:text-inherit">
                                            <div className="w-[100px] h-[100px]">
                                                <img
                                                    src={item.product.thumbnail.url}
                                                    className=""
                                                    alt={item.product.title}
                                                />
                                            </div>
                                            <div className="relative flex-1">
                                                <span className="absolute translate-y-[80%] left-4 font-medium text-[17px]">
                                                    {item.product?.title}
                                                </span>
                                                <span className="absolute bottom-4 left-4 italic opacity-75">
                                                    Size: {item.size}
                                                </span>
                                            </div>
                                        </Link>
                                    </Col>
                                    <Col span={4} className="flex">
                                        <span className="my-auto font-normal text-base">
                                            {item.product.price?.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                        </span>
                                    </Col>
                                    <Col span={4} className="flex-center">
                                        <div className="flex justify-between items-center w-32 h-8 overflow-hidden">
                                            <button
                                                className={`flex-1 h-full text-xl border border-solid border-gray-400 rounded-md transition-all ${
                                                    loading || item.qty === 1
                                                        ? 'opacity-50 cursor-not-allowed select-none'
                                                        : 'hover:bg-[#F55050] hover:text-white cursor-pointer'
                                                }`}
                                                onClick={() => !loading && item.qty > 1 && changeQty('minus', item)}
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center" onChange={changeQty}>
                                                {item.qty}
                                            </span>
                                            <button
                                                className={`flex-1 h-full text-xl border border-solid border-gray-400 rounded-md transition-all ${
                                                    loading || item.qty === item.stock
                                                        ? 'opacity-50 select-none cursor-not-allowed'
                                                        : 'hover:bg-[#F55050] hover:text-white cursor-pointer'
                                                }`}
                                                onClick={() =>
                                                    !loading && item.qty < item.stock && changeQty('plus', item)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </Col>
                                    <Col span={4} className="flex justify-end">
                                        <span className="my-auto font-semibold text-base">
                                            {(item.product.price * item.qty)?.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                        </span>
                                    </Col>
                                    <Col span={1} className="flex justify-end">
                                        <button
                                            className="flex-center cursor-pointer"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            <RiDeleteBin5Line size={18} />
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8">
                        <Row justify="end">
                            <Col span={7}>
                                <div className="flex-between-center">
                                    <span className="font-medium text-base">Grand total:</span>
                                    <span className="font-semibold text-xl">
                                        {totalPrice?.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-end">
                                    <div className="mt-8 w-60 h-14 rounded-xl flex-center text-[#5B8FB9] border-[3px] border-current transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_currentcolor]">
                                        <button
                                            className="text-base font-bold w-full h-full text-inherit cursor-pointer"
                                            onClick={() => navigate('/checkout')}
                                        >
                                            Check out
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </>
            ) : (
                <div className="flex-column flex-center">
                    <div className="w-[20%] py-10">
                        <img src={images.empty_cart} alt="empty_cart" />
                    </div>
                    <p className="text-2xl font-semibold">Your Shopping List is Empty</p>
                    <span className="w-[300px] text-center opacity-75 text-sm">
                        Search for items to start addding them to your cart
                    </span>
                    <button
                        className="mt-10 py-6 w-[300px] shadow-[0_4px_20px_-6px_#000] rounded-full text-lg text-red-500 font-semibold cursor-pointer"
                        onClick={() => navigate('/c')}
                    >
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;
