import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';

// dashboard layout
// import Main from 'pages/dashboard/Main';
import ProductDetail from 'pages/dashboard/ProductDetail';
import CreateProduct from 'pages/dashboard/CreateProduct';
import EditProduct from 'pages/dashboard/EditProduct';
import Products from 'pages/dashboard/Products';
import CategoryDashboard from 'pages/dashboard/Category';
import Customers from 'pages/dashboard/Customers';
import OrderDashboard from 'pages/dashboard/Order';
import OrderDetai from 'pages/dashboard/OrderDetail';

// app layout
import Home from 'pages/main/Home';
import Cart from 'pages/main/Cart';
import Category from 'pages/main/Category';
import Detail from 'pages/main/Detail';
import Contact from 'pages/main/Contact';
import Checkout from 'pages/main/Checkout';
import Order from 'pages/main/user/Order';
import User from 'pages/main/User';
import Profile from 'pages/main/user/Profile';
import ChangePassword from 'pages/main/user/ChangePassword';

// not found
import NotFound from 'components/comon/Notfound';

// private route
import PrivateRoute from 'components/route/PrivateRoute';

// theme route
import ThemeRoute from 'components/route/ThemeRoute';

function App() {
    const cartQty = useSelector(state => state.cart.qty);

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
                            cartQty > 0 ? (
                                <PrivateRoute>
                                    <Checkout />
                                </PrivateRoute>
                            ) : (
                                <Navigate to="/cart" />
                            )
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
