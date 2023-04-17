import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import TopHeader from 'components/comon/TopHeader';
import Header from 'components/comon/header/Header';
import Footer from 'components/comon/Footer';
import ScrollTop from 'components/comon/scrollTop/ScrollTop';
import { getCategories } from 'redux/categorySlice';
import { getCart } from 'redux/cartSlice';

function Main() {
    const location = useLocation();
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.currentUser?._id);

    const [offset, setOffset] = useState(true);
    const [showScrolTop, setShowScrolTop] = useState(false);

    useEffect(() => {
        dispatch(getCategories());
        userId && dispatch(getCart(userId));

        window.document.documentElement.classList.remove('dark');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onScroll = () => {
            setOffset(window.pageYOffset <= 36);
            setShowScrolTop(window.pageYOffset >= 300);
        };

        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [offset]);

    useEffect(() => {
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' //
        });
    }, [location]);

    return (
        <div className="min-h-screen flex-column text-[#151935]" id="body">
            <TopHeader />
            <ScrollTop show={showScrolTop} />
            <Header offset={offset} />

            <div className={`pb-10 ${!offset ? 'mt-[74px]' : ''}`}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default Main;
