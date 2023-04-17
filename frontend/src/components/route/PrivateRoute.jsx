import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { setRedirectOfLogin } from 'redux/slice/authSlice';

function PrivateRoute({ children }) {
    const { isLogin } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (!isLogin) {
            dispatch(setRedirectOfLogin(pathname));
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return children;
}

export default PrivateRoute;
