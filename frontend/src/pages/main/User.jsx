import { Link, Outlet, NavLink } from 'react-router-dom';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { MdEdit } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';
import { BsFileText } from 'react-icons/bs';
import { useState } from 'react';
import images from 'assets/images';

function User() {
    const user = useSelector(state => state.auth.currentUser);
    const [showAccount, setShowAccount] = useState(true);
    return (
        <div className="container py-5">
            <Row>
                <Col xl={5}>
                    <div>
                        <div className="flex items-center">
                            <img
                                src={user.avatar ? user.avatar.url : images.no_avatar}
                                className="w-16 h-16 rounded-full border border-gray-200"
                                alt=""
                            />
                            <div className="flex-column ml-4">
                                <span className="text-base font-semibold text-card max-w-[150px] text-dots">
                                    {user.fullname}
                                </span>
                                <Link
                                    to="/user/account/profile"
                                    className="flex items-center gap-2 text-gray-400 hover:text-gray-500"
                                    onClick={() => setShowAccount(true)}
                                >
                                    <MdEdit /> Edit profile
                                </Link>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                to="/user/account/profile"
                                className="pb-2 gap-x-2 flex items-center hover:text-orange-700"
                                onClick={() => setShowAccount(true)}
                            >
                                <FiUser />
                                My account
                            </Link>

                            {showAccount && (
                                <div className="pl-6">
                                    <NavLink
                                        to="/user/account/profile"
                                        className={({ isActive }) =>
                                            `pb-2 gap-x-2 flex items-center  hover:text-orange-700 ${
                                                isActive ? 'text-orange-700' : ''
                                            }`
                                        }
                                    >
                                        Profile
                                    </NavLink>
                                    <NavLink
                                        to="/user/account/change-password"
                                        className={({ isActive }) =>
                                            `pb-2 gap-x-2 flex items-center  hover:text-orange-700 ${
                                                isActive ? 'text-orange-700' : ''
                                            }`
                                        }
                                    >
                                        Change password
                                    </NavLink>
                                </div>
                            )}
                            <NavLink
                                to="/user/order"
                                className={({ isActive }) =>
                                    `pb-2 gap-x-2 flex items-center hover:text-orange-700 ${
                                        isActive ? 'text-orange-700' : ''
                                    }`
                                }
                                onClick={() => setShowAccount(false)}
                            >
                                <BsFileText />
                                Orders
                            </NavLink>
                        </div>
                    </div>
                </Col>
                <Col xl={19}>
                    <Outlet />
                </Col>
            </Row>
        </div>
    );
}

export default User;
