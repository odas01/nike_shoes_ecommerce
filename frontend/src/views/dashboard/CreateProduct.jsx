import { useState, useEffect } from 'react';

import categoryApi from 'api/categoryApi';
import productApi from 'api/productApi';
import { toast } from 'handler/toast.handler';
import LoadingOverlay from 'components/comon/loading/LoadingOverlay';
import FormProduct from 'components/comon/FormProduct';

const initialForm = {
    title: '',
    subTitle: '',
    genders: [],
    category: '',
    price: '',
    description: '',
    thumbnail: '',
    images: []
};

const initialOptions = [
    {}
    // { size: 38, stock: 15 },
    // { size: 39, stock: 15 },
    // { size: 40, stock: 15 },
    // { size: 41, stock: 15 },
    // { size: 42, stock: 15 },
    // { size: 43, stock: 15 },
    // { size: 44, stock: 15 },
    // { size: 45, stock: 15 },
    // { size: 46, stock: 15 },
    // { size: 47, stock: 15 }
    // { size: 35, stock: 15 },
    // { size: 36, stock: 15 },
    // { size: 37, stock: 15 },
    // { size: 38, stock: 15 },
    // { size: 39, stock: 15 },
    // { size: 40, stock: 15 },
    // { size: 41, stock: 15 },
    // { size: 42, stock: 15 }
];

function CreateProduct() {
    const [categories, setCategories] = useState([]);

    const [formValue, setFormValue] = useState(initialForm);
    const [options, setOptions] = useState(initialOptions);

    const [loading, setLoading] = useState(false);

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
        getCategories();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();

        // checkOptions
        const newOptions = options.reduce((cur, option) => {
            const isExist = cur.find(x => x.size === option.size);
            return !isExist && option.size ? [...cur, option] : cur;
        }, []);

        const newPrice = +formValue.price.replace(/[^0-9]/g, '');

        const values = { ...formValue, options: newOptions, price: newPrice };

        const valid = validCheck(values);

        if (valid) {
            setLoading(true);

            try {
                await productApi.create(values);
                toast('success', 'Created product');

                setFormValue(initialForm);
                setOptions(initialOptions);
            } catch (err) {
                toast('error', err.msg);
            }

            setLoading(false);
        } else toast('error', 'Please double check the data');
    };
    const validCheck = values => {
        const { title, thumbnail, images, price, category, genders, options } = values;
        if (!title || !thumbnail || !price || !category) return false;
        if (!images.length || !genders.length || !options.length) return false;
        return true;
    };

    return (
        <div className="min-h-full d-flex flex-column">
            {loading && <LoadingOverlay title="Waiting for create product...." />}

            <h2 className="mb-6 mt-0 font-bold text-xl text-gray-800 dark:text-[#d5d6d7]">Create product</h2>

            <div className="w-[60%] flex-1 mx-auto p-8 rounded  border border-solid border-gray-300 dark:border-none dark:shadow-[0px_7px_30px_-10px_#263958]">
                <FormProduct
                    categories={categories}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    options={options}
                    setOptions={setOptions}
                    handleSubmit={handleSubmit}
                    action="create"
                />
            </div>
        </div>
    );
}

export default CreateProduct;
