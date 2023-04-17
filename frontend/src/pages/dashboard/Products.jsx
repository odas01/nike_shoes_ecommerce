import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip, Modal } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { FaSearchPlus } from 'react-icons/fa';

import Button from 'components/comon/Button';
import Loading from 'components/comon/loading/Loading';
import LoadingOverlay from 'components/comon/loading/LoadingOverlay';
import productApi from 'api/productApi';
import categoryApi from 'api/categoryApi';
import images from 'assets/images';
import { toast } from 'handler/toast.handler';

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 15;

const inititalFilter = {
    price: '',
    category: '',
    genders: '',
    title: ''
};

function Products() {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [productActive, setProductActive] = useState({});
    const [categories, setCategories] = useState([]);

    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);
    const [skip, setSkip] = useState(DEFAULT_SKIP);
    const [filter, setFilter] = useState(inititalFilter);

    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skip, filter]);

    useEffect(() => {
        getCategories();
    }, []);

    // getProducts
    const getProducts = async () => {
        const res = await productApi.getAll({
            ...filter,
            skip: skip * DEFAULT_LIMIT,
            limit: DEFAULT_LIMIT
        });

        res.products &&
            res.products.forEach(product => {
                product.stock = product.options.reduce((cur, option) => option.stock + cur, 0);
                const date = new Date(product.createdAt);
                product.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            });

        setProducts(res.products);
        setTotal(res.total);
        setPage(res.page);
        setLastPage(res.lastPage);
        setLoading(false);
    };

    const getCategories = async () => {
        try {
            const res = await categoryApi.getAll();
            setCategories(res.categories);
        } catch (err) {
            console.log(err);
        }
    };

    const showModal = product => {
        setProductActive(product);
        setOpenModal(true);
    };

    // #------------------#
    const handleDelete = async () => {
        setOpenModal(false);
        setDeleteLoading(true);
        try {
            await productApi.delete(productActive.slug);
            toast('success', 'Deleted product');
            getProducts();
        } catch (err) {
            toast('error', err.msg);
        }
        setDeleteLoading(false);
        setProductActive({});
    };

    const handleChangePublic = async product => {
        product.published = !product.published;
        try {
            await productApi.update(product.slug, {
                published: product.published
            });
            toast('success', 'Updated product');
            getProducts();
        } catch (err) {
            toast('error', err.msg);
        }
    };

    const handleFilter = (e, type) => {
        setSkip(DEFAULT_SKIP);
        if (type === 'category') {
            setFilter(state => ({ ...state, category: e.target.value }));
        } else if (type === 'gender') {
            setFilter(state => ({ ...state, genders: e.target.value }));
        } else {
            setFilter(state => ({ ...state, price: e.target.value }));
        }
    };

    const handleSearch = e => {
        setSkip(DEFAULT_SKIP);
        e.keyCode === 13 && setFilter(state => ({ ...state, title: e.target.value.trim() }));
    };

    return (
        <div>
            {/* Title */}

            <h2 className="mb-6 mt-0 font-bold text-xl text-gray-800 dark:text-[#d5d6d7]">Product</h2>

            {/* Search */}
            <div className="p-4 rounded-lg border border-solid border-gray-300 dark:border-none bg-db-wrap dark:bg-gray-bg">
                <div className="py-3 flex-center">
                    <input
                        type="text"
                        className="input w-3/12 mr-6 hover:cursor-text"
                        placeholder="Search by product name"
                        onKeyDown={handleSearch}
                    />
                    <select
                        name="category"
                        className="input flex-1 mr-6 appearance capitalize"
                        onChange={e => handleFilter(e, 'category')}
                    >
                        <option value="">--- Category ---</option>
                        {categories.map(category => (
                            <option key={category._id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="gender"
                        className="input flex-1 mr-6 appearance"
                        onChange={e => handleFilter(e, 'gender')}
                    >
                        <option value="">--- Gender ---</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="boys">Boys</option>
                        <option value="girls">Girls</option>
                    </select>
                    <select
                        name="price"
                        className="input flex-1 mr-6 appearance"
                        onChange={e => handleFilter(e, 'price')}
                    >
                        <option value="">--- Price ---</option>
                        <option value="asc">Low to high</option>
                        <option value="desc">High to low</option>
                    </select>
                    <Button className="w-56 font-medium" onClick={() => navigate('create')}>
                        <AiOutlinePlus className="mr-2" /> Add Product
                    </Button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <Loading />
            ) : products.length ? (
                <>
                    <div className="overflow-x-auto mt-4 rounded-tr-lg rounded-tl-lg border border-solid border-gray-300 dark:border-none dark:bg-gray-bg">
                        <table className="w-full dark:bg-gray-bg">
                            <thead className="text-xs text-gray-500 font-extrabold border-b bg-gray-200 dark:bg-inherit border-gray-300 dark:border-[#24262d]">
                                <tr>
                                    <td className="px-4 py-4w-[50px]"></td>
                                    <td className="px-4 py-3">PRODUCT NAME</td>
                                    <td className="px-4 py-3">DATE</td>
                                    <td className="px-4 py-3">CATEGORY</td>
                                    <td className="px-4 py-3">GENDERS</td>
                                    <td className="px-4 py-3">PRICE</td>
                                    <td className="px-4 py-4">STATUS</td>
                                    {/* <td className="px-4 py-4 text-center">PUBLISHED</td> */}
                                    <td className="px-4 py-4 text-center">ACTIONS</td>
                                </tr>
                            </thead>
                            <tbody className="dark:divide-[#24262d] divide-y capitalize text-sm font-medium">
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-4 text-center text-xs dark:text-gray-500">
                                            {skip * DEFAULT_LIMIT + index + 1}
                                        </td>

                                        {/* Name */}
                                        <td className="px-4 py-4w-80">
                                            <div className="flex items-center">
                                                <img
                                                    src={product.thumbnail.url || images.no_image}
                                                    className="w-8 h-8 object-cover mr-3 rounded-full"
                                                    alt="product-img"
                                                />
                                                <span className="inline-block flex-1 truncate max-w-[240px]">
                                                    {product.title}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3">
                                            <span>{product.date}</span>
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-3">{product.category}</td>

                                        {/* Gender */}
                                        <td className="px-4 py-3">
                                            {product.genders.map((gender, index) => (
                                                <img
                                                    key={index}
                                                    className="mr-2 w-[25px]"
                                                    src={images[gender]}
                                                    alt={gender}
                                                />
                                            ))}
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3">{product.price?.toLocaleString('de-DE')}</td>

                                        {/* status */}
                                        <td className="px-4 py-4text-center w-28 font-medium">
                                            {product.stock > 0 ? (
                                                <span className="px-3 py-1 text-xs text-white rounded-[100rem] bg-green-900">
                                                    selling
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs text-white rounded-[100rem] bg-red-800">
                                                    sold out
                                                </span>
                                            )}
                                        </td>

                                        {/* Published */}
                                        {/* <td className="px-4 py-4text-center w-28">
                                            <div onClick={() => handleChangePublic(product)} className="flex-center">
                                                {product.published ? (
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
                                        </td> */}
                                        {/* action */}
                                        <td className="px-4 py-4 w-32">
                                            <div className="flex-center">
                                                <Tooltip title="Detail" color="#108ee9">
                                                    <Link
                                                        className="mr-3 w-4 h-4 duration-100 text-gray-500 hover:text-[#108ee9]"
                                                        to={`/dashboard/products/${product.slug}`}
                                                    >
                                                        <FaSearchPlus size={18} />
                                                    </Link>
                                                </Tooltip>
                                                <Tooltip title="Edit" color="#0E9F6E">
                                                    <FiEdit
                                                        className="mr-3 cursor-pointer text-gray-500 hover:text-[#0E9F6E]"
                                                        size={18}
                                                        onClick={() => navigate(`${product.slug}/edit`)}
                                                    />
                                                </Tooltip>
                                                <Tooltip title="Delete" color="#f42424">
                                                    <RiDeleteBin5Line
                                                        className="hover:text-[#f42424] duration-150 text-gray-500 cursor-pointer"
                                                        size={18}
                                                        onClick={() => showModal(product)}
                                                    />
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="flex-between-center py-3 px-4 text-xs dark:text-gray-400 text-gray-700  border border-t-0 border-gray-300 
                            dark:border-[#24262d] rounded-br-lg rounded-bl-lg bg-db-wrap dark:bg-gray-bg"
                    >
                        <div>
                            SHOWING {''}
                            <span>
                                {DEFAULT_LIMIT * skip + 1}- {DEFAULT_LIMIT * skip + products.length}
                            </span>
                            {''} OF
                            <span> {total}</span>
                        </div>
                        <ul className="flex-between-center text-[#9e9e9e]  mt-0">
                            <li className="py-1 px-3">
                                <button
                                    className={`bg-transparent px-0   dark:text-[#9e9e9e]  ${
                                        page === 1
                                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                            : 'text-gray-700'
                                    }`}
                                    disabled={page === 1}
                                    onClick={() => setSkip(skip => skip - 1)}
                                >
                                    Previous
                                </button>
                            </li>
                            <li className="py-1 px-3">
                                {Array.from({ length: lastPage }, (_, i) => i + 1).map(item => (
                                    <button
                                        key={item}
                                        className={`px-3 py-1 rounded-lg ${
                                            item === page
                                                ? 'text-white bg-[#0e9f6e]'
                                                : 'text-gray-700 dark:text-[#9e9e9e]'
                                        }`}
                                        onClick={() => setSkip(item - 1)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </li>
                            <li className="py-1 px-3">
                                <button
                                    className={`bg-transparent px-0   dark:text-[#9e9e9e] ${
                                        page === lastPage
                                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                            : 'text-gray-700'
                                    }`}
                                    disabled={page === lastPage}
                                    onClick={() => setSkip(skip => skip + 1)}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                <span className="text-center block py-8">No product</span>
            )}
            <Modal title="Delete" open={openModal} onOk={handleDelete} onCancel={() => setOpenModal(false)}>
                <p>
                    Do you want to delete <strong>{productActive.name}</strong>
                </p>
            </Modal>

            {deleteLoading && <LoadingOverlay title="Watting for delete" />}
        </div>
    );
}

export default Products;
