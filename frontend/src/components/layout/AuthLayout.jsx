import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';

import Loading from 'components/comon/loading/Loading';
import login from 'assets/images/auth/login.jpeg';
import register from 'assets/images/auth/register.jpeg';
import { authUser } from 'redux/slice/authSlice';

function Auth({ authRoute }) {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuth);

    useEffect(() => {
        if (!isAuth)
            dispatch(authUser({ navigate, type: 'AUTH' }))
                .then(() => {
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                });
        else setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? (
        <div className="h-[100vh]">
            <Loading />
        </div>
    ) : (
        <div className="flex-center px-6 py-7 relative min-h-[100vh] bg-light-behind dark:bg-[#121317] text-[#24262d] dark:text-[#e5e7eb]">
            <div className="max-w-[896px] h-full rounded-lg overflow-hidden shadow-[0px_7px_30px_-10px_#263958] dark:bg-[#1A1C23]">
                <Row>
                    <Col xs={12}>
                        <img src={authRoute === 'login' ? login : register} alt="" />
                    </Col>
                    <Col xs={12} className="p-12">
                        <Outlet />
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Auth;
