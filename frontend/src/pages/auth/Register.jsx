import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGoogleLogin } from '@react-oauth/google';

import LoadingOverlay from 'components/comon/loading/LoadingOverlay';
import Button from 'components/comon/Button';
import { toast } from 'handler/toast.handler';
import { registerUser, googleLogin } from 'redux/slice/authSlice';
import images from 'assets/images';

function Regis() {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: 'lntthanh3317',
            confirmPassword: 'lntthanh3317'
        },
        validationSchema: Yup.object({
            fullname: Yup.string()
                .min(5, 'Name must be at least 5 character.')
                .max(20, 'Name must be under 20 character.')
                .required('Name is required.'),
            email: Yup.string().email('Invalid email.').required('Email is required.'),
            password: Yup.string().min(5, 'Password must be least 5 character.').required('Password is required.'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Password does not match!')
                .required('Confirm password is required.')
        }),
        onSubmit: async values => {
            setLoading(true);
            dispatch(registerUser({ values, navigate }))
                .unwrap()
                .then(() => {
                    setLoading(false);
                    toast('success', 'Register successfully');
                })
                .catch(err => {
                    setLoading(false);
                    toast('error', err.msg);
                });
        }
    });
    const login = useGoogleLogin({
        onSuccess: async response => {
            dispatch(googleLogin({ token: response.access_token, navigate }))
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
            {loading && <LoadingOverlay title="Waiting for register...." />}

            <h1 className="login__title mb-6">Create account</h1>

            <form onSubmit={formik.handleSubmit}>
                <div className="mb-6 flex-column">
                    <label className="font-medium" htmlFor="fullname">
                        Fullname
                    </label>
                    <input
                        className="input hover:cursor-text mt-2"
                        type="text"
                        name="fullname"
                        placeholder="abcdef"
                        defaultValue={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.name && formik.touched.name && (
                        <span className="msg-error">{formik.errors.name}</span>
                    )}
                </div>

                <div className="mb-6 flex-column">
                    <label className="font-medium" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="input hover:cursor-text mt-2"
                        type="text"
                        name="email"
                        placeholder="abc@gmail.com"
                        defaultValue={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                        className="input hover:cursor-text mt-2"
                        type="password"
                        name="password"
                        placeholder="****************"
                        defaultValue={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password && (
                        <span className="msg-error">{formik.errors.password}</span>
                    )}
                </div>

                <div className="mb-6 flex-column">
                    <label className="font-medium" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        className="input hover:cursor-text mt-2"
                        type="password"
                        name="confirmPassword"
                        placeholder="****************"
                        defaultValue={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                        <span className="msg-error">{formik.errors.confirmPassword}</span>
                    )}
                </div>
                <Button type="submit" className="w-full">
                    Create
                </Button>
            </form>
            <hr className="my-10 hr" />
            <Button
                className="mt-4 w-full"
                type="submit"
                title="Login With Google"
                color="#000"
                bgColor="#fff"
                onClick={() => login()}
            >
                <img src={images.social.google} alt="google" className="w-4 h-4 mr-4" /> Login With Google
            </Button>
            <p className="mb-0 mt-4">
                <Link to="/login" className="text-green-700 hover:text-green-700 hover:underline">
                    Already have an account? Login
                </Link>
            </p>
        </div>
    );
}

export default Regis;
