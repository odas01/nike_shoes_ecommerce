import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from 'components/comon/loading/Loading';
import orderApi from 'api/orderApi';
import { FaSearchPlus } from 'react-icons/fa';
import { date } from 'handler/convertDate.handler.js';
import { toast } from 'handler/toast.handler.js';
import { AiOutlineCheck } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';
import { RiDeleteBin5Line } from 'react-icons/ri';

function Order() {
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async filter => {
        try {
            const res = await orderApi.getAll(filter);
            setOrders(res.orders);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };
    const updateOrder = async (id, value) => {
        try {
            await orderApi.update(id, value);
            toast('success', 'Update successfully.');
        } catch (err) {
            console.log(err);
            toast('error', err.data.msg);
        }
    };
    const searchOrder = async value => {
        try {
            const res = await orderApi.search({ phone: value });
            setOrders(res.orders);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteOrder = async id => {
        try {
            await orderApi.delete(id);
            toast('success', 'Delete successfully.');
        } catch (err) {
            console.log(err);
            toast('error', err.data.msg);
        }
    };

    const handleSearch = async value => {
        console.log(value);
        if (value) searchOrder(value);
        else getOrders();
    };

    const handleChange = async (e, id) => {
        await updateOrder(id, { status: e });
        getOrders();
    };

    const handleFilter = async e => {
        if (e.target.value) getOrders({ status: e.target.value });
        else getOrders();
    };

    const handleDelete = async id => {
        await deleteOrder(id);
        getOrders();
    };

    return (
        <>
            {/* Title */}
            <h2 className="mb-6 mt-0 font-bold text-xl text-gray-800 dark:text-[#d5d6d7]">Order</h2>

            {/* Search */}
            <div className="p-4 rounded-lg border border-solid border-gray-300 dark:border-none dark:bg-gray-bg">
                <div className="py-3 flex-center">
                    <input
                        type="text"
                        className="input w-4/12 mr-6 hover:cursor-text"
                        placeholder="Search by phone"
                        onKeyDown={e => e.keyCode === 13 && handleSearch(e.target.value)}
                    />
                    <select name="price" className="input flex-1 mr-6 appearance" onChange={handleFilter}>
                        <option value="">--- Status ---</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancel">Cancel</option>
                    </select>
                    <select
                        name="price"
                        className="input flex-1 mr-6 appearance"
                        // onChange={()}
                    >
                        <option value="">--- Order limits ---</option>
                        <option value="5">Last 5 days order</option>
                        <option value="7">Last 7 days order</option>
                        <option value="15">Last 15days order</option>
                        <option value="30">Last 30 days order</option>
                    </select>
                </div>
            </div>

            {/* Body */}
            {loading ? (
                <Loading />
            ) : orders.length ? (
                <div className="overflow-x-auto mt-4 rounded-lg border border-solid border-gray-300 dark:border-none dark:bg-gray-bg">
                    <table className="w-full">
                        <thead className="text-xs text-gray-500 font-extrabold border-b bg-gray-200 dark:bg-inherit border-gray-300 dark:border-[#24262d]">
                            <tr>
                                <td className="px-4 py-4w-[50px]">NO</td>
                                <td className="px-4 py-3">ORDER DATE</td>
                                <td className="px-4 py-3">ADDRESS</td>
                                <td className="px-4 py-3">PHONE</td>
                                <td className="px-4 py-3">METHOD</td>
                                <td className="px-4 py-3">AMOUNT</td>
                                {/* <td className="px-4 py-3">STATUS</td> */}
                                <td className="px-4 py-3">STATUS</td>
                                <td className="px-4 py-3">INVOICE</td>
                            </tr>
                        </thead>
                        <tbody className="dark:divide-[#24262d] divide-y text-sm font-medium">
                            {orders &&
                                orders.map((order, index) => (
                                    <tr key={index} className={`${order.status === 'cancel' ? 'opacity-40' : ''} `}>
                                        <td className="px-4 py-4 text-center text-xs dark:text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span>{date(order.createdAt)}</span>
                                        </td>
                                        <td className="px-4 py-3 max-w-[200px] truncate">
                                            <span>{order.specificAddress}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span>{order.phone}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span>{order.paymentMethod}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span>
                                                {order.total?.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}
                                            </span>
                                        </td>
                                        {/* <td className="px-4 py-3">
                                            <span>{order.status}</span>
                                        </td> */}
                                        <td className="px-4 py-3">
                                            {order.status === 'pending' && (
                                                <div className=" flex items-center">
                                                    <div
                                                        className="px-2 py-1 bg-gray-600 rounded w-9 h-6 flex-center cursor-pointer mr-3"
                                                        onClick={() => handleChange('processing', order._id)}
                                                    >
                                                        <AiOutlineCheck color="#16FF00" />
                                                    </div>
                                                    <div
                                                        className="px-2 py-1 bg-gray-600 rounded w-9 h-6 flex-center cursor-pointer"
                                                        onClick={() => handleChange('cancel', order._id)}
                                                    >
                                                        <ImCancelCircle color="#DC3535" />
                                                    </div>
                                                </div>
                                            )}
                                            {order.status === 'processing' && (
                                                <select
                                                    name="price"
                                                    className="input flex-1 mr-6 appearance cursor-pointer"
                                                    onChange={e => handleChange(e.target.value, order._id)}
                                                    value={order.status}
                                                >
                                                    <option value="processing">Processing</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancel">Cancel</option>
                                                </select>
                                            )}
                                            {(order.status === 'cancel' || order.status === 'delivered') && (
                                                <div className="flex items-center">
                                                    <span className="capitalize mr-2">{order.status}</span>
                                                    {order.status === 'delivered' ? (
                                                        <AiOutlineCheck color="#16FF00" />
                                                    ) : (
                                                        <ImCancelCircle color="#DC3535" />
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex-center">
                                                <Link
                                                    to={`${order._id}`}
                                                    className="flex-center text-gray-500 duration-150 hover:text-gray-400"
                                                >
                                                    <FaSearchPlus size={18} />
                                                </Link>
                                                {(order.status === 'cancel' || order.status === 'delivered') && (
                                                    <div
                                                        className="cursor-pointer ml-2 flex-center text-gray-500 hover:text-gray-400"
                                                        onClick={() => handleDelete(order._id)}
                                                    >
                                                        <RiDeleteBin5Line size={18} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <span className="text-center block py-8 text-2xl">No order</span>
            )}
        </>
    );
}

export default Order;
