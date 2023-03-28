import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Drawer, Checkbox, Tooltip, Modal } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';

import Button from 'components/comon/Button';
import categoryApi from 'api/categoryApi';
import images from 'assets/images';
import { toast } from 'handler/toast.handler';

const initialCategory = { name: '', genders: ['men', 'women', 'boys', 'girls'] };

function Categorys() {
    const [categories, setCategories] = useState([]);

    const [formValue, setFormValue] = useState(initialCategory);

    const [isEdit, setIsEdit] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async (filter = {}) => {
        try {
            const res = await categoryApi.getAll(filter);
            setCategories(res.categories);
        } catch (err) {
            console.log(err);
        }
    };

    const createCategory = async values => {
        try {
            await categoryApi.create(values);
            toast('success', 'Created category');

            getCategories();
            closeDrawer();
        } catch (err) {
            toast('error', err.msg);
        }
    };

    const editCategory = async (_id, values) => {
        try {
            await categoryApi.update(_id, values);
            toast('success', 'Updated category');

            setCategories(categories => {
                const index = categories.findIndex(x => x._id === _id);
                categories[index] = { ...categories[index], ...values };
                return categories;
            });
            closeDrawer();
        } catch (err) {
            toast('error', err.msg);
        }
    };

    const deleteCategory = async _id => {
        try {
            await categoryApi.delete(_id);
            toast('success', 'Deleted category');

            setCategories(categories => categories.filter(category => category._id !== _id));
        } catch (err) {
            toast('error', err.msg);
        }
    };

    const searchCategory = async value => {
        try {
            const res = await categoryApi.search(value);
            setCategories(res.categories);
        } catch (err) {
            console.log(err);
        }
    };

    // handle func
    const handleSubmit = e => {
        e.preventDefault();
        const newFormValue = {
            name: formValue.name.toLowerCase(),
            genders: formValue.genders
        };
        if (isEdit) editCategory(formValue._id, newFormValue);
        else createCategory(newFormValue);
    };

    const handleEdit = category => {
        setFormValue(category);
        setOpenDrawer(true);
        setIsEdit(true);
    };

    const handleSearch = e => {
        const value = e.target.value.trim();
        if (e.which === 13)
            if (value) searchCategory(value);
            else getCategories();
    };

    const filterByGender = e => {
        const filter = e.target.value ? { genders: e.target.value } : {};
        getCategories(filter);
    };

    const closeModal = () => {
        setOpenModal(false);
        setFormValue(initialCategory);
    };

    const closeDrawer = () => {
        setOpenDrawer(false);
        setFormValue(initialCategory);
        setIsEdit(false);
    };

    return (
        <>
            {/* Title */}
            <h2 className="mb-6 mt-0 font-bold text-xl text-gray-800 dark:text-[#d5d6d7]">Category</h2>

            {/* Filter */}
            <div className="p-4 rounded-lg border border-solid border-gray-300 dark:border-none dark:bg-gray-bg">
                <div className="py-3 flex-center">
                    <input
                        type="text"
                        className="input w-4/12 mr-6 hover:cursor-text"
                        placeholder="Search by category name"
                        onKeyDown={handleSearch}
                    />
                    <select name="price" className="input flex-1 mr-6 appearance" onChange={filterByGender}>
                        <option value="">--- Gender ---</option>
                        <option value="men">MEN</option>
                        <option value="women">WOMEN</option>
                        <option value="boys">BOYS</option>
                        <option value="girls">GIRLS</option>
                    </select>
                    <Button className="w-56 font-medium" onClick={() => setOpenDrawer(true)}>
                        <AiOutlinePlus className="mr-2" /> ADD CATEGORY
                    </Button>
                    <Drawer
                        title="Add category"
                        placement="right"
                        closable={false}
                        open={openDrawer}
                        width={'40%'}
                        className="dark:bg-gray-bg text-gray-text"
                        onClose={closeDrawer}
                        headerStyle={{
                            backgroundColor: '#121317'
                        }}
                    >
                        <form className="flex-column h-full" onSubmit={handleSubmit}>
                            <div className="flex-between-center">
                                <label className="w-[200px]" htmlFor="categoryName">
                                    Category name
                                </label>
                                <input
                                    className="input flex-1 hover:cursor-text"
                                    value={formValue.name}
                                    onChange={e =>
                                        setFormValue(value => ({
                                            ...value,
                                            name: e.target.value
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex-between-center mt-8">
                                <label className="w-[200px]" htmlFor="gender">
                                    Genders
                                </label>
                                <Checkbox.Group
                                    className="flex-1 flex-between-center"
                                    value={formValue.genders}
                                    name="genders[]"
                                    options={[
                                        { label: 'MEN', value: 'men' },
                                        { label: 'WOMEN', value: 'women' },
                                        { label: 'BOYS', value: 'boys' },
                                        { label: 'GIRLS', value: 'girls' }
                                    ]}
                                    onChange={genders => setFormValue(value => ({ ...value, genders }))}
                                />
                            </div>
                            <Button className="w-40 mt-auto mr-auto ml-auto" type="submit">
                                Create
                            </Button>
                        </form>
                    </Drawer>
                </div>
            </div>

            {/* Body */}
            {categories.length ? (
                <div className="overflow-x-auto mt-4 rounded-lg border border-solid border-gray-300 dark:border-none dark:bg-gray-bg">
                    <table className="w-full">
                        <thead className="text-xs text-gray-500 font-extrabold border-b bg-gray-200 dark:bg-inherit border-gray-300 dark:border-[#24262d]">
                            <tr>
                                <td className="px-4 py-4w-[50px]"></td>
                                <td className="px-4 py-3">CATEGORY NAME</td>
                                <td className="px-4 py-3">GENDERS</td>
                                <td className="px-4 py-4text-center w-32">ACTIONS</td>
                            </tr>
                        </thead>
                        <tbody className="dark:divide-[#24262d] divide-y capitalize text-sm font-medium">
                            {categories.map((category, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 text-center text-xs dark:text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-4uppercase">{category.name}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex align-middle">
                                            {category.genders.map((gender, index) => (
                                                <img
                                                    key={index}
                                                    src={images[gender]}
                                                    alt="men"
                                                    className="w-[25px] mr-4"
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4  w-32">
                                        <div className="flex-center">
                                            <Tooltip title="Edit" color="#0E9F6E">
                                                <FiEdit
                                                    className="mr-3 cursor-pointer text-gray-500 hover:text-[#0E9F6E]"
                                                    size={18}
                                                    onClick={() => handleEdit(category)}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Delete" color="#f42424">
                                                <RiDeleteBin5Line
                                                    className="text-gray-500 hover:text-[#f42424] duration-150 cursor-pointer"
                                                    size={18}
                                                    onClick={() => {
                                                        setOpenModal(true);
                                                        setFormValue(category);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <span className="text-center block py-8 text-2xl ">No category</span>
            )}
            <Modal
                title="Delete category"
                open={openModal}
                onOk={() => {
                    deleteCategory(formValue._id);
                    closeModal();
                }}
                onCancel={closeModal}
            >
                <p>
                    Are you sure delete <strong>{formValue.name}</strong>
                </p>
            </Modal>
        </>
    );
}

export default Categorys;
