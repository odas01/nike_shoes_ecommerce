import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'antd';
import orderApi from 'api/orderApi';
import { date } from 'handler/convertDate.handler.js';

function ProductDetail() {
    const [order, setOrder] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        const getOrder = async () => {
            const res = await orderApi.get(id);
            console.log(res.order.createdAt);
            res.order.createdAt = date(res.order.createdAt);
            setOrder(res.order);
        };

        getOrder();
    }, [id]);

    return (
        <>
            <h2 className="mb-6 mt-0 font-bold text-xl text-gray-800 dark:text-[#d5d6d7]">Invoice</h2>
            {order && (
                <div className="bg-gray-bg rounded-lg p-4">
                    <div className="pb-4 border-b border-gray-600">
                        <div className="text-sm">
                            Status: <span className="ml-1 capitalize font-medium">{order.status}</span>
                        </div>
                        <div className="text-sm">
                            Date order: <span className="ml-1 capitalize">{order.createdAt}</span>
                        </div>
                    </div>
                    <div className="pt-4">
                        <div className="text-sm mb-1">
                            Name: <span className="ml-1 font-medium">{order.fullname}</span>
                        </div>
                        <div className="text-sm mb-1">
                            Phone: <span className="ml-1 font-medium">{order.phone}</span>
                        </div>
                        <div className="text-sm mb-1">
                            Address:{' '}
                            <span className="ml-1 font-medium">
                                {order.specificAddress}, {order.address}
                            </span>
                        </div>
                        <div className="text-sm mb-1">
                            Note: <span className="ml-1 font-medium">{order.note}</span>
                        </div>
                    </div>
                    <div className="mt-8">
                        <Row gutter={24}>
                            <Col span={17}>
                                <div className="p-4 border border-gray-600 rounded">
                                    <div className="pb-2 border-b border-gray-600">
                                        <Row>
                                            <Col span={2}>
                                                <span>No</span>
                                            </Col>
                                            <Col span={13}>
                                                <span>Product name</span>
                                            </Col>
                                            <Col span={3}>
                                                <span>Size</span>
                                            </Col>
                                            <Col span={3}>
                                                <span>Quantity</span>
                                            </Col>
                                            <Col span={3}>
                                                <span>Amount</span>
                                            </Col>
                                        </Row>
                                    </div>
                                    {order?.details.map((detail, index) => (
                                        <div key={index} className="mt-2">
                                            <Row>
                                                <Col span={2}>
                                                    <span>{index + 1}</span>
                                                </Col>
                                                <Col span={13}>
                                                    <span>{detail.product.title}</span>
                                                </Col>
                                                <Col span={3}>
                                                    <span>{detail.size}</span>
                                                </Col>
                                                <Col span={3}>
                                                    <span>{detail.qty}</span>
                                                </Col>
                                                <Col span={3}>
                                                    <span>
                                                        {detail.total?.toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })}
                                                    </span>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                            <Col span={7}>
                                <div className="mb-2">
                                    Payment method:{' '}
                                    <span className="font-medium ml-1 text-base">{order.paymentMethod}</span>
                                </div>
                                <div className="mb-2">
                                    Delivery method:{' '}
                                    <span className="font-medium ml-1 text-base">{order.deliveryMethod}</span>
                                </div>
                                <div className="mb-2">
                                    Delivery cost:
                                    <span className="font-medium ml-1 text-base">
                                        {order.deliveryCost?.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    Total amount:
                                    <span className="font-semibold ml-1 text-lg">
                                        {order.total?.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetail;
