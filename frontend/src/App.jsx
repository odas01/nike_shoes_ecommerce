import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';

import 'css/custom-antd.css';
import 'css/custom-scrollbar.css';
import 'css/custom-swiper.css';
import 'index.css';

// layout
import AuthLayout from 'components/layout/AuthLayout';
import AppLayout from 'components/layout/AppLayout';
import DashboardLayout from 'components/layout/DashboardLayout';

// auth layout
import Login from 'views/auth/Login';
import Register from 'views/auth/Register';

// dashboard layout
import Main from 'views/dashboard/Main';
import ProductDetail from 'views/dashboard/ProductDetail';
import CreateProduct from 'views/dashboard/CreateProduct';
import EditProduct from 'views/dashboard/EditProduct';
import Products from 'views/dashboard/Products';
import CategoryDashboard from 'views/dashboard/Category';
import Customers from 'views/dashboard/Customers';
import OrderDashboard from 'views/dashboard/Order';
import OrderDetai from 'views/dashboard/OrderDetail';

// app layout
import Home from 'views/Home';
import Cart from 'views/Cart';
import Category from 'views/Category';
import Detail from 'views/Detail';
import Contact from 'views/Contact';
import Checkout from 'views/Checkout';
import Order from 'views/Order';
import User from 'views/User';
import Profile from 'views/Profile';
import ChangePassword from 'views/ChangePassword';

// not found
import NotFound from 'components/comon/Notfound';

// private route
import PrivateRoute from 'components/route/PrivateRoute';

// theme route
import ThemeRoute from 'components/route/ThemeRoute';

function App() {
    const theme = localStorage.getItem('theme');
    if (!theme) {
        localStorage.setItem('theme', process.env.REACT_APP_THEME);
    }
    window.document.documentElement.classList.add(theme);

    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                {/* Dashboard layout */}
                <Route
                    path="dashboard"
                    element={
                        <ThemeRoute>
                            <DashboardLayout />
                        </ThemeRoute>
                    }
                >
                    <Route index element={<Navigate to="products" />} />
                    <Route path="products/create" element={<CreateProduct />} />
                    <Route path="products/:slug" element={<ProductDetail />} />
                    <Route path="products/:slug/edit" element={<EditProduct />} />
                    <Route path="products" element={<Products />} />
                    <Route path="category" element={<CategoryDashboard />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="orders" element={<OrderDashboard />} />
                    <Route path="orders/:id" element={<OrderDetai />} />
                </Route>

                {/* Auth layout */}
                <Route
                    element={
                        <ThemeRoute>
                            <AuthLayout />
                        </ThemeRoute>
                    }
                >
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                {/* App layout */}
                <Route element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="d/:slug" element={<Detail />} />
                    <Route path="c/:gender?/:category?" element={<Category />} />
                    <Route
                        path="cart"
                        element={
                            <PrivateRoute>
                                <Cart />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="checkout"
                        element={
                            <PrivateRoute>
                                <Checkout />
                            </PrivateRoute>
                        }
                    />
                    <Route path="user" element={<User />}>
                        <Route index element={<Navigate to="account/profile" />} />
                        <Route path="account" element={<Navigate to="profile" />} />
                        <Route path="account/profile" element={<Profile />} />
                        <Route path="account/change-password" element={<ChangePassword />} />
                        <Route path="order" element={<Order />} />
                    </Route>
                    <Route path="contact" element={<Contact />} />
                </Route>

                {/* Not found */}
                <Route path="*" element={<Navigate to="404" />} />
                <Route path="404" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
