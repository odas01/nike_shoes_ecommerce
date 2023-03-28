import orderApi from 'api/orderApi';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Row, Col } from 'antd';
import { FcShipped } from 'react-icons/fc';
import { MdPendingActions, MdOutlineLocalShipping } from 'react-icons/md';
import { IoRocketOutline } from 'react-icons/io5';
import { TbTruckDelivery } from 'react-icons/tb';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { date } from 'handler/convertDate.handler.js';
import { Collapse } from 'antd';

function Order() {
    const [status, setStatus] = useState(null);
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        getOrders();
    }, [status]);

    const getOrders = async () => {
        try {
            const res = await orderApi.getAll(status ? { status } : {});
            setOrders(res.orders);
        } catch (err) {
            console.log(err);
        }
    };

    const onChange = key => {
        console.log(key);
    };

    return (
        <>
            <div className="">
                <span
                    className={`px-3 py-2 inline-block w-32 cursor-pointer text-center rounded-tl rounded-tr ${
                        !status ? 'bg-gray-300 text-white' : ''
                    }`}
                    onClick={() => setStatus(null)}
                >
                    All order
                </span>
                <span
                    className={`px-3 py-2 inline-block w-32 cursor-pointer text-center rounded-tl rounded-tr ${
                        status === 'pending' ? 'bg-gray-300 text-white' : ''
                    }`}
                    onClick={() => setStatus('pending')}
                >
                    Confirming
                </span>
                <span
                    className={`px-3 py-2 inline-block w-32 cursor-pointer text-center rounded-tl rounded-tr ${
                        status === 'processing' ? 'bg-gray-300 text-white' : ''
                    }`}
                    onClick={() => setStatus('processing')}
                >
                    Shipping
                </span>
                <span
                    className={`px-3 py-2 inline-block w-32 cursor-pointer text-center rounded-tl rounded-tr ${
                        status === 'delivered' ? 'bg-gray-300 text-white' : ''
                    }`}
                    onClick={() => setStatus('delivered')}
                >
                    Delivered
                </span>
            </div>
            <div className={`border-2 border-gray-300 rounded p-4 pb-0 ${status ? 'rounded-tl' : 'rounded-tl-none'}`}>
                {orders &&
                    orders.map((order, index) => (
                        <div key={index} className="mb-4 px-10 rounded bg-[#f6f6f6] border border-gray-300">
                            <Collapse
                                accordion
                                ghost
                                expandIcon={({ isActive }) => (!isActive ? <AiOutlinePlus /> : <AiOutlineMinus />)}
                                expandIconPosition="start"
                                onChange={onChange}
                            >
                                <Collapse.Panel
                                    header={
                                        <div className="flex-between-center py-4">
                                            <span>Order date: {date(order.createdAt)}</span>
                                            {order.status === 'pending' && (
                                                <p className="flex items-center gap-x-2 pb-3 text-[#F29339]">
                                                    <MdPendingActions size={18} /> Order is pending confirmation
                                                </p>
                                            )}
                                            {order.status === 'processing' && (
                                                <p className="flex items-center gap-x-2 pb-3 text-[#077E8C]">
                                                    <MdOutlineLocalShipping size={18} /> Your order is being delivered
                                                    to you
                                                </p>
                                            )}
                                            {order.status === 'delivered' && (
                                                <p className="flex items-center gap-x-2 pb-3 text-[#28a745]">
                                                    <FcShipped size={18} /> Order delivered successfully
                                                </p>
                                            )}
                                        </div>
                                    }
                                    key={index}
                                >
                                    <div className="border-t border-gray-300">
                                        {order.details.map((item, index) => (
                                            <div key={index} className="border-b border-gray-200 py-2">
                                                <Row className="flex items-center" key={index}>
                                                    <Col xl={3}>
                                                        <img
                                                            src={item.product.thumbnail.url}
                                                            className="w-24 h-24"
                                                            alt={item.product.title}
                                                        />
                                                    </Col>
                                                    <Col xl={13} className="relative pl-3">
                                                        <span className="text-base">{item.product.title}</span>
                                                        <span className="text-xs italic absolute left-3 top-7">
                                                            Size: {item.size}
                                                        </span>
                                                    </Col>
                                                    <Col xl={4} className="relative">
                                                        <span className="text-sm">
                                                            {item.product.price.toLocaleString('de-DE')}đ
                                                        </span>
                                                        <span className="text-xs italic absolute left-0 top-7">
                                                            x{item.qty}
                                                        </span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <p className="text-sm text-end">
                                                            {item.total.toLocaleString('de-DE')}đ
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                                        <div className="py-4 flex-between-center">
                                            <div className="flex-center gap-x-2">
                                                Shipping method:
                                                <div className="flex-center px-2 py-1 gap-x-2 border rounded">
                                                    {order.shippingMethod === 'normal' && <MdOutlineDeliveryDining />}
                                                    {order.shippingMethod === 'express' && <TbTruckDelivery />}
                                                    {order.shippingMethod === 'sameDay' && <IoRocketOutline />}
                                                    <span className="capitalize font-semibold">
                                                        {order.shippingMethod}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p>
                                                    Shipping Cost:
                                                    <span className="ml-2 font-semibold">
                                                        +{order.shippingCost.toLocaleString('de-DE')}đ
                                                    </span>
                                                </p>
                                                <p className="text-base flex-center">
                                                    Total:
                                                    <span className="ml-auto text-xl text-[#ee4d2d] font-semibold">
                                                        {order.total.toLocaleString('de-DE')}đ
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        </div>
                    ))}
            </div>
        </>
    );
}

export default Order;
