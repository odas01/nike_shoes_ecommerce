import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateItem, deleteItem } from 'redux/cartSlice';
import { Row, Col } from 'antd';
import { RiDeleteBin5Line } from 'react-icons/ri';

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
    return (
        qty && (
            <div className="container pb-8">
                <h2 className="text-center font-semibold">Your cart ({qty})</h2>

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
                        <div className="py-5 border-b border-gray-200" key={index}>
                            <Row>
                                <Col span={11}>
                                    <Link to={'/d/' + item.product.slug} className="flex pr-6 hover:text-inherit">
                                        <div className="w-[80px] h-[80px]">
                                            <img
                                                src={item.product.thumbnail.url}
                                                className=""
                                                alt={item.product.title}
                                            />
                                        </div>
                                        <div className="relative flex-1">
                                            <span className="absolute translate-y-1/2 left-4 font-medium text-[17px]">
                                                {item.product?.title}
                                            </span>
                                            <span className="absolute bottom-2 left-4 italic">Size: {item.size}</span>
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
                                            className={`flex-1 h-full text-xl border border-solid border-gray-300 cursor-pointer
                                            rounded-md transition-all ${
                                                loading || item.qty === 1
                                                    ? 'opacity-50 cursor-not-allowed select-none'
                                                    : 'hover:bg-[#F55050] hover:text-white'
                                            }`}
                                            onClick={() => !loading && item.qty > 1 && changeQty('minus', item)}
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center" onChange={changeQty}>
                                            {item.qty}
                                        </span>
                                        <button
                                            className={`flex-1 h-full text-xl border border-solid border-gray-300 cursor-pointer
                                            rounded-md transition-all ${
                                                loading || item.qty === item.stock
                                                    ? 'opacity-50 select-none cursor-not-allowed'
                                                    : 'hover:bg-[#F55050] hover:text-white'
                                            }`}
                                            onClick={() => !loading && item.qty < item.stock && changeQty('plus', item)}
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
                                    <div className="flex-center" onClick={() => handleDelete(item._id)}>
                                        <RiDeleteBin5Line size={18} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </div>

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
                            <div className="mt-8 w-60 h-14 rounded-xl flex-center text-[#5B8FB9]  border-[3px] border-current transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_currentcolor]">
                                <button
                                    className="text-base font-bold w-full h-full text-inherit"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Check out
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    );
}

export default Cart;
