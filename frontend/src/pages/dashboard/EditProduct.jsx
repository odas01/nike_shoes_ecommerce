import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import categoryApi from 'api/categoryApi';
import productApi from 'api/productApi';
import LoadingOverlay from 'components/comon/loading/LoadingOverlay';
import FormProduct from 'components/comon/FormProduct';
import { useParams } from 'react-router-dom';

const initialFormValue = {
    title: '',
    subTitle: '',
    genders: [],
    category: '',
    price: '',
    description: '',
    thumbnail: '',
    images: []
};

function EditProduct() {
    const [categories, setCategories] = useState([]);

    const [formValue, setFormValue] = useState(initialFormValue);
    const [options, setOptions] = useState([{}]);

    const [loading, setLoading] = useState(false);

    const { slug } = useParams();

    useEffect(() => {
        const getCategories = async () => {
            const res = await categoryApi.getAll();
            setCategories(
                res.categories.map(category => ({
                    name: category.name,
                    genders: category.genders
                }))
            );
        };
        const getProduct = async () => {
            const res = await productApi.get(slug);
            res.product.category = res.product.category.name;
            setFormValue(res.product);
            setOptions(res.product.options);
        };

        getProduct();
        getCategories();
    }, [slug]);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        // checkOptions
        const newOptions = options.reduce((cur, option) => {
            option.size = +option.size;
            const isExist = cur.find(x => x.size === option.size);
            return !isExist ? [...cur, option] : cur;
        }, []);

        const values = { ...formValue, options: newOptions };

        try {
            const res = await productApi.update(slug, values);
            toastFunc('success', 'Updated product');

            setFormValue(res.product);
            setOptions(res.product.options);
        } catch (err) {
            toastFunc('error', err.data.msg);
        }
        setLoading(false);
    };
    const toastFunc = (type, msg) => {
        return toast(msg, {
            type,
            position: 'top-center',
            autoClose: 2000,
            theme: 'light'
        });
    };

    return (
        <div className="min-h-full d-flex flex-column">
            {loading && <LoadingOverlay title="Waiting for create...." />}
            <h2 className="mb-6 mt-0 font-bold text-xl text-gray-800 dark:text-[#d5d6d7]">Edit product ({slug})</h2>
            <div className="w-[60%] flex-1 mx-auto p-8 rounded  border border-solid border-gray-300 dark:border-none dark:shadow-[0px_7px_30px_-10px_#263958]">
                <FormProduct
                    categories={categories}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    options={options}
                    setOptions={setOptions}
                    handleSubmit={handleSubmit}
                    action="edit"
                />
            </div>
        </div>
    );
}

export default EditProduct;
