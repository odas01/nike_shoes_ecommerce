import { useState, useEffect } from 'react';
import { Tooltip, Modal } from 'antd';
import { RiDeleteBin5Line } from 'react-icons/ri';

import { toast } from 'handler/toast.handler';
import userApi from 'api/userApi';
import Loading from 'components/comon/loading/Loading';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [customerActive, setCustomerActive] = useState({});

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCustomers();
    }, []);
    const getCustomers = async () => {
        try {
            const res = await userApi.getAll();
            res.users.forEach(user => {
                const date = new Date(user.createdAt);
                user.createdAt = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            });
            setCustomers(res.users);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        try {
            await userApi.delete(customerActive._id);
            getCustomers();
            toast('success', 'Deleted customer');
            closeModal();
        } catch (err) {
            toast('error', err.msg);
        }
    };

    const handleSearch = async e => {
        const value = e.target.value.trim();
        const keyCode = e.keyCode;
        if (keyCode === 13) {
            if (value) {
                try {
                    const res = await userApi.search(value);
                    res.forEach(user => {
                        const date = new Date(user.createdAt);
                        user.createdAt = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                    });
                    setCustomers(res);
                } catch (err) {
                    console.log(err);
                }
            } else {
                getCustomers();
            }
        }
    };

    const handleUpdateBlocked = async customer => {
        customer.blocked = !customer.blocked;
        try {
            await userApi.update(customer._id, {
                blocked: customer.blocked
            });
            toast('success', 'Updated customer');
            getCustomers();
        } catch (err) {
            toast('error', err.msg);
        }
    };

    const showModal = customer => {
        setCustomerActive(customer);
        setOpen(true);
    };

    const closeModal = () => {
        setCustomerActive({});
        setOpen(false);
    };

    return (
        <>
            {/* Title */}
            <h2 className="mb-6 mt-0 font-bold text-xl text-gray-800 dark:text-[#d5d6d7]">Customer</h2>

            {/* Search */}
            <div className="p-4 rounded-lg border border-solid border-gray-300 dark:border-none dark:bg-gray-bg">
                <div className="py-3 flex-center">
                    <input
                        type="text"
                        className="input w-full mr-6 hover:cursor-text"
                        placeholder="Search by name/email"
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>

            {/* Body */}
            {loading ? (
                <Loading />
            ) : customers.length ? (
                <div className="overflow-x-auto mt-4 rounded-lg border border-solid border-gray-300 dark:border-none dark:bg-gray-bg">
                    <table className="w-full">
                        <thead className="text-xs text-gray-500 font-extrabold border-b bg-gray-200 dark:bg-inherit border-gray-300 dark:border-[#24262d]">
                            <tr>
                                <td className="px-4 py-4w-[50px]"></td>
                                <td className="px-4 py-3">NAME</td>
                                <td className="px-4 py-3">JOINING DATE</td>
                                <td className="px-4 py-3">EMAIL</td>
                                <td className="px-4 py-4text-center ">BLOCKED</td>
                                <td className="px-4 py-4text-center  w-32">ACTIONS</td>
                            </tr>
                        </thead>
                        <tbody className="dark:divide-[#24262d] divide-y text-sm font-medium">
                            {customers &&
                                customers.map((customer, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-4 text-center text-xs dark:text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-4">{customer.fullname}</td>
                                        <td className="px-4 py-3">{customer.createdAt}</td>
                                        <td className="px-4 py-3">{customer.email}</td>
                                        <td className="px-4 py-4 text-center w-28">
                                            <div onClick={() => handleUpdateBlocked(customer)} className="flex-center">
                                                {customer.blocked ? (
                                                    <svg
                                                        stroke="currentColor"
                                                        fill="currentColor"
                                                        strokeWidth="0"
                                                        viewBox="0 0 16 16"
                                                        className="text-green-500 w-5 h-5 cursor-pointer"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        stroke="currentColor"
                                                        fill="currentColor"
                                                        strokeWidth="0"
                                                        viewBox="0 0 16 16"
                                                        className="text-orange-500 w-5 h-5 cursor-pointer"
                                                        height="1em"
                                                        width="1em"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"></path>
                                                    </svg>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex-center">
                                                <Tooltip title="Delete" color="#f42424">
                                                    <RiDeleteBin5Line
                                                        className="text-gray-500 hover:text-[#f42424] duration-150 cursor-pointer"
                                                        size="18px"
                                                        onClick={() => showModal(customer)}
                                                    />
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <span className="text-center block py-8 text-2xl">No customer</span>
            )}
            <Modal open={open} onOk={handleDelete} onCancel={closeModal} destroyOnClose={true}>
                <p>
                    Do you want to delete <strong>{customerActive.fullname}</strong>
                </p>
            </Modal>
        </>
    );
}

export default Customers;
