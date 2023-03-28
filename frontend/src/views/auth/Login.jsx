import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from 'components/comon/Button';
import LoadingOverlay from 'components/comon/loading/LoadingOverlay';
import { toast } from 'handler/toast.handler';
import { loginUser } from 'redux/authSlice';
import authApi from 'api/authApi';

function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: 'lntthanh3317@gmail.com',
            password: 'lntthanh3317'
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email.').required('Email is required.'),
            password: Yup.string().min(5, 'Password must be least 5 character.').required('Password is required.')
        }),
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);

            dispatch(loginUser({ values, navigate }))
                .unwrap()
                .then(() => {
                    setLoading(false);
                    toast('success', 'Login successfully');
                })
                .catch(err => {
                    setLoading(false);
                    toast('error', err.msg);
                });
        }
    });

    return (
        <div className="login">
            {loading && <LoadingOverlay title="Waiting for login...." />}
            <h1 className="login__title mb-6">Login</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-6 flex-column">
                    <label className="font-medium" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="input hover:cursor-text mt-2 "
                        name="email"
                        placeholder="abc@gmail.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                    />
                    {formik.errors.email && formik.touched.email && (
                        <span className="msg-error">{formik.errors.email}</span>
                    )}
                </div>
                <div className="mb-6 flex-column">
                    <label className="font-medium" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="input hover:cursor-text mt-2 "
                        type="password"
                        name="password"
                        placeholder="****************"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password && (
                        <span className="msg-error">{formik.errors.password}</span>
                    )}
                </div>
                <Button type="submit">Log in</Button>
            </form>
            <hr className="my-10 hr" />
            <Button type="submit" color="#000" bgColor="#fff">
                Login With Facebook
            </Button>
            <Button className="mt-4" type="submit" title="Login With Google" color="#000" bgColor="#fff">
                Login With Google
            </Button>
            <p className="mb-0 mt-4">
                <Link to="/forgot-password" className=" text-green-700 hover:text-green-700 hover:underline">
                    Forgot your password?
                </Link>
            </p>
            <p className="mb-0 mt-1">
                <Link to="/register" className=" text-green-700 hover:text-green-700 hover:underline">
                    Create account
                </Link>
            </p>
        </div>
    );
}

export default Login;
