import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillSunFill, BsFillMoonFill, BsCartCheck } from 'react-icons/bs';
import { GiSonicShoes } from 'react-icons/gi';
import { AiOutlineBars, AiOutlineUser } from 'react-icons/ai';
import { CiLogout } from 'react-icons/ci';

import Loading from 'components/comon/loading/Loading';
import MenuItem from 'components/comon/MenuItem';
import Button from 'components/comon/Button';
import useDarkMode from 'hooks/useDarkMode';
import avt from 'assets/images/avt.png';
import { logOut, authUser } from 'redux/slice/authSlice';
import Logo from 'components/comon/Logo';

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');

    const [darkMode, setDarkMode] = useDarkMode();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bodyRef = useRef();
    const isAuth = useSelector(state => state.auth.isAuth);

    const { pathname } = useLocation();
    const curPath = pathname.replace('dashboard', '').split('/').join('');

    useEffect(() => {
        if (!isAuth)
            dispatch(authUser({ navigate, type: 'DASHBOARD' }))
                .then(({ payload }) => {
                    setFullName(payload.fullname);
                    setLoading(false);
                })
                .catch(err => console.log(err));
        else setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogOut = () => {
        dispatch(logOut());
        navigate('/login');
    };

    return (
        <div className="flex h-[100vh] overflow-hidden dark:text-gray-text dark:bg-gray-bg">
            {/* Aside */}

            <aside className="flex-column w-[232px] overflow-y-auto">
                {/* Logo */}
                <div className="h-[64px] flex items-center pl-12">
                    <Logo size={56} isTheme={true} />
                </div>

                {/* Navbar */}
                <nav>
                    {/* <MenuItem to="" title="Overview" icon={<RxDashboard size="20px" />} curPath={curPath} /> */}
                    <MenuItem to="products" title="Products" icon={<GiSonicShoes size="20px" />} curPath={curPath} />
                    <MenuItem to="category" title="Categorys" icon={<AiOutlineBars size="20px" />} curPath={curPath} />
                    <MenuItem to="customers" title="Customers" icon={<AiOutlineUser size="20px" />} curPath={curPath} />
                    <MenuItem to="orders" title="Orders" icon={<BsCartCheck size="20px" />} curPath={curPath} />
                </nav>

                {/* Button Logout */}
                <div className="p-6 mt-auto">
                    <Button handleClick={handleLogOut} className="w-full">
                        <CiLogout className="mr-2" size="20px" />
                        Log out
                    </Button>
                </div>
            </aside>

            {/* Content Dashboard */}
            <div className="flex-1 flex-column">
                {/* Header */}
                <header className="pr-5 h-[64px] flex justify-end items-center border-l border-gray-100 dark:border-none">
                    {/* Button dark mode */}
                    <button onClick={() => setDarkMode()}>
                        {darkMode ? (
                            <BsFillSunFill size="20px" color="#0E9F6E" />
                        ) : (
                            <BsFillMoonFill size="20px" color="#0E9F6E" />
                        )}
                    </button>

                    {/* Avartar */}
                    <button className="w-8 h-8 p-0 ml-4 border border-solid border-gray-300 rounded-full">
                        <img src={avt} className="w-full h-full rounded-full" alt="avatar" />
                    </button>

                    {/* FullName */}
                    <span className="ml-2">{fullName}</span>
                </header>

                {/* Layout Component */}
                {loading ? (
                    <Loading />
                ) : (
                    <main
                        className="pl-6 pt-6 pb-10 pr-10 p flex-1 overflow-y-overlay rounded-tl-md border-t border-l border-gray-100 
                        text-gray-800  bg-light-behind dark:text-gray-300 dark:bg-black-behind dark:border-none"
                        ref={bodyRef}
                    >
                        <Outlet />
                    </main>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
