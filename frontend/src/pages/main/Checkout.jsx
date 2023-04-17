import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiChevronLeft, BiChevronDown } from 'react-icons/bi';
import { IoRocketOutline } from 'react-icons/io5';
import { TbTruckDelivery } from 'react-icons/tb';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { Row, Col } from 'antd';
import { Collapse } from 'antd';

import Address from 'components/comon/Address';
import orderApi from 'api/orderApi';
import { deleteCart } from 'redux/slice/cartSlice';

import { toast } from 'handler/toast.handler.js';

function Checkout() {
    const [address, setAddress] = useState({});
    const [shippingMethod, setShippingMethod] = useState('normal');
    const [shippingCost, setShippingCost] = useState(10000);

    const formRef = useRef();

    const dispatch = useDispatch();
    const { items: cart, qty } = useSelector(state => state.cart);
    const totalPrice = cart?.reduce((cur, item) => cur + item.qty * item.product.price, 0);

    const createOrder = async () => {
        const formData = Object.fromEntries(new FormData(formRef.current));
        const values = {
            ...formData,
            shippingCost,
            shippingMethod,
            total: totalPrice + shippingCost,
            address: Object.values(address).reverse().join(', ')
        };

        try {
            await orderApi.create(values);
            await dispatch(deleteCart());
            toast('success', 'Create order successfully');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        qty && (
            <div className="container py-8">
                <Link to="/cart" className="flex items-center mb-4 hover:text-inherit">
                    <span className="px-2 py-1 rounded border-2 flex-center">
                        <BiChevronLeft size={28} />
                    </span>
                    <span className="ml-4 text-lg">Back to cart</span>
                </Link>
                <Row gutter={24}>
                    <Col span={16}>
                        <div className="border-2 border-[#eaeaea] rounded-lg p-6 mb-6">
                            <Collapse
                                accordion
                                ghost
                                expandIcon={({ isActive }) =>
                                    isActive ? <BiChevronDown size={28} /> : <BiChevronLeft size={28} />
                                }
                                expandIconPosition="end"
                            >
                                <Collapse.Panel
                                    header={
                                        <div className="flex-between-center cursor-pointer">
                                            <h2 className="font-semibold text-[22px]">Review Item ({qty} items): </h2>
                                        </div>
                                    }
                                >
                                    <div className="mt-6">
                                        {cart &&
                                            cart.map((item, index) => (
                                                <Row gutter={24} key={index} className="flex items-center mb-6">
                                                    <Col xl={4}>
                                                        <img
                                                            src={item.product.thumbnail.url}
                                                            className="w-32 h-32 rounded"
                                                            alt=""
                                                        />
                                                    </Col>
                                                    <Col xl={14} className="flex-column">
                                                        <span className="text-xl font-semibold">
                                                            {item.product.title}
                                                        </span>
                                                        <span className="font-normal italic">Size: {item.size}</span>
                                                    </Col>
                                                    <Col xl={6} className="flex-column items-end">
                                                        <span className="text-xl">
                                                            {item.product.price.toLocaleString('de-DE')}đ
                                                        </span>
                                                        <span>Quantity: {item.qty}</span>
                                                    </Col>
                                                </Row>
                                            ))}
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        </div>
                        <div className="border-2 border-[#eaeaea] rounded-lg p-6">
                            <h2 className="font-semibold text-[22px] mb-6">Delivery Information</h2>

                            <div className="mt-6">
                                <form name="info" className="mt-4" ref={formRef}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <div className="w-full relative">
                                                <input
                                                    className="input w-full peer"
                                                    type="text"
                                                    name="fullname"
                                                    placeholder=" "
                                                />
                                                <label htmlFor="fullname" className="label_top">
                                                    Fullname*
                                                </label>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="w-full relative">
                                                <input
                                                    className="input w-full peer"
                                                    type="text"
                                                    name="phone"
                                                    placeholder=" "
                                                />
                                                <label htmlFor="phone" className="label_top">
                                                    Phone*
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <div className="mt-8 w-full relative">
                                                <input
                                                    className="input w-full peer"
                                                    name="specificAddress"
                                                    placeholder=" "
                                                />
                                                <label htmlFor="specificAddress" className="label_top">
                                                    Address*
                                                </label>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mt-8 w-full relative">
                                                <input
                                                    className="input w-full peer"
                                                    type="email"
                                                    name="email"
                                                    placeholder=" "
                                                />
                                                <label htmlFor="email" className="label_top">
                                                    Email*
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="mt-8">
                                        <Address address={address} setAddress={setAddress} />
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* 
                        </div>
                        <div className="mt-4">
                            <div
                                className="flex-between-center py-3 px-4 border border-gray-300 rounded-lg cursor-pointer"
                                onClick={() => setShow(state => ({ ...state, delivery: !state.delivery }))}
                            >
                                <h2 className="font-medium text-xl">2. Delivery</h2>
                                <BiChevronDown size={28} />
                            </div>
                            {show.delivery && (
                                <div className="mt-4 flex items-center">
                                    <div
                                        className={`flex-between-center p-3 border rounded-lg mr-4 cursor-pointer duration-150 ${
                                            shippingMethod === 'normal' ? 'bg-[#20262E] text-white' : ''
                                        }`}
                                        onClick={() => {
                                            setShippingMethod('normal');
                                            setShippingCost(10000);
                                        }}
                                    >
                                        <TbTruckDelivery size={18} />
                                        <span className="text-sm font-medium ml-2">Normal</span>
                                    </div>
                                    <div
                                        className={`flex-between-center p-3 border rounded-lg mr-4 cursor-pointer duration-150 ${
                                            shippingMethod === 'express' ? 'bg-[#20262E] text-white' : ''
                                        }`}
                                        onClick={() => {
                                            setShippingMethod('express');
                                            setShippingCost(50000);
                                        }}
                                    >
                                        <MdOutlineDeliveryDining size={18} />
                                        <span className="text-sm font-medium ml-2">Express</span>
                                    </div>
                                    <div
                                        className={`flex-between-center p-3 border rounded-lg mr-4 cursor-pointer duration-150 ${
                                            shippingMethod === 'sameDay' ? 'bg-[#20262E] text-white' : ''
                                        }`}
                                        onClick={() => {
                                            setShippingMethod('sameDay');
                                            setShippingCost(70000);
                                        }}
                                    >
                                        <IoRocketOutline size={18} />
                                        <span className="text-sm font-medium ml-2">Same day</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <div
                                className="flex-between-center py-3 px-4 border border-gray-300 rounded-lg cursor-pointer"
                                onClick={() => setShow(state => ({ ...state, payment: !state.payment }))}
                            >
                                <h2 className="font-medium text-xl">3.Payment</h2>
                                <BiChevronDown size={28} />
                            </div>
                            {show.payment && <div className="mt-4">payment</div>}
                        </div> */}
                    </Col>
                    <Col span={8}>
                        <div className="border-2 border-[#eaeaea] rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-[22px]">Order summery</h3>
                            <hr className="hr my-4" />
                            <span className="text-lg font-semibold">Shipping Method</span>
                            <div className="flex">
                                <div className="mt-4 flex items-center">
                                    <div
                                        className={`flex-between-center p-3 border rounded-lg mr-4 cursor-pointer duration-150 ${
                                            shippingMethod === 'normal' ? 'bg-[#20262E] text-white' : ''
                                        }`}
                                        onClick={() => {
                                            setShippingMethod('normal');
                                            setShippingCost(10000);
                                        }}
                                    >
                                        <TbTruckDelivery size={16} />
                                        <span className="text-xs font-medium ml-2">Normal</span>
                                    </div>
                                    <div
                                        className={`flex-between-center p-3 border rounded-lg mr-4 cursor-pointer duration-150 ${
                                            shippingMethod === 'express' ? 'bg-[#20262E] text-white' : ''
                                        }`}
                                        onClick={() => {
                                            setShippingMethod('express');
                                            setShippingCost(50000);
                                        }}
                                    >
                                        <MdOutlineDeliveryDining size={16} />
                                        <span className="text-xs font-medium ml-2">Express</span>
                                    </div>
                                    <div
                                        className={`flex-between-center p-3 border rounded-lg mr-4 cursor-pointer duration-150 ${
                                            shippingMethod === 'sameDay' ? 'bg-[#20262E] text-white' : ''
                                        }`}
                                        onClick={() => {
                                            setShippingMethod('sameDay');
                                            setShippingCost(70000);
                                        }}
                                    >
                                        <IoRocketOutline size={16} />
                                        <span className="text-xs font-medium ml-2">Same day</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <div className="flex-between-center mb-2">
                                    <span className="font-semibold text-base">Sub Total</span>
                                    <span className="font-semibold text-base">
                                        {totalPrice.toLocaleString('de-DE')}đ
                                    </span>
                                </div>
                                <div className="flex-between-center">
                                    <span className="font-semibold text-base">Shipping Cost</span>
                                    <span className="font-semibold text-base">
                                        +{shippingCost.toLocaleString('de-DE')}đ
                                    </span>
                                </div>
                                <hr className="hr my-4" />
                                <div className="flex-between-center">
                                    <span className="font-semibold text-lg">Total</span>
                                    <span className="font-semibold text-base">
                                        ={(totalPrice + shippingCost).toLocaleString('de-DE')}đ
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <div className="mt-8 h-14 w-full rounded-full flex-center bg-[#5B8FB9] text-white duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_#5B8FB9]">
                                    <button
                                        className="text-base font-bold w-full h-full text-inherit cursor-pointer"
                                        onClick={createOrder}
                                    >
                                        Pay {(totalPrice + shippingCost).toLocaleString('de-DE')}đ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    );
}

export default Checkout;
