import React, { useEffect, useState } from 'react';
import { RiStackLine } from 'react-icons/ri';
import { BsCartCheck } from 'react-icons/bs';
import { AiOutlineCreditCard, AiOutlineShoppingCart } from 'react-icons/ai';
import { MdOutlinePending } from 'react-icons/md';
import { Col, Row } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import orderApi from 'api/orderApi';
import productApi from 'api/productApi';
import Loading from 'components/comon/loading/Loading';

function Main() {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState([]);

    const [dataChart, setDataChart] = useState(null);

    const [loading, setLoading] = useState(true);

    // price
    const [totalAmoutToday, setTotalAmoutToday] = useState(0);

    useEffect(() => {
        setLoading(true);
        // const getOrderToday = orders => {
        //     const curDate = {
        //         date: new Date().getDate(),
        //         month: new Date().getMonth(),
        //         year: new Date().getFullYear()
        //     };
        //     return orders
        //         .map(order => {
        //             const date = new Date(order.createdAt);
        //             if (
        //                 date.getDate() === curDate.date &&
        //                 date.getMonth() === curDate.month &&
        //                 date.getFullYear() === curDate.year
        //             ) {
        //                 return order;
        //             }
        //         })
        //         .filter(item => item);
        // };

        const totalPrice = orders =>
            orders.reduce((cur, item) => {
                return cur + item.total;
            }, 0);

        const getBestSellingProduct = async () => {
            try {
                const res = await productApi.popular();
                const newRes = res.products.splice(0, 3);
                const data = newRes.map(item => ({ label: item.product.title, total: item.total }));
                setDataChart(data);
            } catch (err) {
                console.log(err);
            }
        };

        const getData = async () => {
            try {
                const resOrders = await orderApi.getAll();
                // console.log(resOrders);
                setOrders(resOrders.orders);
                setStatus(resOrders.status);
                setTotalAmoutToday(totalPrice(resOrders.orders));
            } catch (err) {
                console.log(err);
            }
        };

        getData();
        getBestSellingProduct();
        setLoading(false);
    }, []);
    return loading ? (
        <Loading />
    ) : (
        <>
            <h2 className="mb-6 mt-0 font-bold text-xl text-gray-800 dark:text-[#d5d6d7]">Dashboard Overview</h2>
            {/* Total */}
            <Row gutter={24}>
                <Col span={8}>
                    <div className="py-6 w-full rounded-xl flex-column items-center text-white bg-cyan-700">
                        <RiStackLine size={32} />
                        <span className="text-base my-2 font-normal">Today Order</span>
                        <span className="text-xl font-bold">
                            {totalAmoutToday.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            })}
                        </span>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="py-6 w-full rounded-xl flex-column items-center text-white bg-slate-700">
                        <BsCartCheck size={32} />
                        <span className="text-base my-2 font-normal">This Month</span>
                        <span className="text-xl font-bold">120.000.000đ</span>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="py-6 w-full rounded-xl flex-column items-center text-white bg-green-800">
                        <AiOutlineCreditCard size={32} />
                        <span className="text-base my-2 font-normal">Total Order</span>
                        <span className="text-xl font-bold">120.000.000đ</span>
                    </div>
                </Col>
            </Row>
            {/* Order */}
            <Row gutter={24} className="mt-6">
                <Col span={6}>
                    <div className="py-4 pl-4 w-full rounded-xl flex items-center text-white bg-gray-bg">
                        <div className="rounded-full flex-center w-12 h-12 bg-orange-600">
                            <AiOutlineShoppingCart size={20} />
                        </div>
                        <div className="flex-column ml-4">
                            <span className="text-sm font-normal text-gray-text">Total order</span>
                            <span className="text-lg font-bold">{orders.length}</span>
                        </div>
                    </div>
                </Col>
                {status &&
                    status.map(
                        (item, index) =>
                            item.status !== 'cancel' && (
                                <Col span={6} key={index}>
                                    <div className="py-4 pl-4 w-full rounded-xl flex items-center text-white bg-gray-bg">
                                        <div className="rounded-full flex-center w-12 h-12 bg-sky-700">
                                            <MdOutlinePending size={20} />
                                        </div>
                                        <div className="flex-column ml-4">
                                            <span className="text-sm font-normal text-gray-text">
                                                Orders {item.status}
                                            </span>
                                            <span className="text-lg font-bold">{item.count}</span>
                                        </div>
                                    </div>
                                </Col>
                            )
                    )}
            </Row>
            <Row gutter={24} className="mt-6">
                <Col span={12}></Col>
                <Col span={12}>
                    <div className="flex-column bg-gray-bg rounded-xl p-6">
                        <h2 className="font-medium text-lg mb-4">Best selling product</h2>
                        <div className="h-80 w-80 m-auto">
                            <Pie
                                data={{
                                    labels: dataChart?.map(item => item.label),
                                    datasets: [
                                        {
                                            label: 'My First Dataset',
                                            data: dataChart?.map(item => item.total),
                                            backgroundColor: [
                                                'rgb(255, 99, 132)',
                                                'rgb(54, 162, 235)',
                                                'rgb(255, 205, 86)'
                                            ]
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default Main;
