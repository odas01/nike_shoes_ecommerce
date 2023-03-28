import React from 'react';
import { TiDeleteOutline } from 'react-icons/ti';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Select, Slider } from 'antd';

import Button from 'components/comon/Button';
import { UploadImage, UploadImageMultiple } from 'components/comon/UploadImage';

function FormProduct({ categories, formValue, setFormValue, options, setOptions, handleSubmit, action }) {
    const selectCategory = {
        options: categories.map(category => ({
            value: category.name,
            label: category.name
        })),
        onChange: value => {
            setFormValue(state => ({ ...state, category: value, genders: [] }));
        }
    };

    const selectGenders = {
        options: categories
            .find(category => category.name === formValue.category)
            ?.genders.map(category => ({
                value: category,
                label: category
            })),
        onChange: value => {
            setFormValue(state => ({ ...state, genders: value }));
        }
    };

    const handleChange = e => {
        const key = e.target?.name;
        const value = e.target?.value;

        setFormValue(state => ({ ...state, [key]: value }));
    };

    const handleChangeOptions = (e, index, name) => {
        let value;
        if (name === 'size') value = +e.target.value;
        else value = +e;
        setOptions(
            options.map((option, indexOption) => {
                if (!option.stock) option.stock = 25;
                if (index === indexOption) return { ...option, [name]: value };
                else return option;
            })
        );
    };

    return (
        <form className="flex-column h-full" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="flex-between-center">
                <label className="w-[200px] ">Title / name</label>
                <input
                    className="input flex-1 hover:cursor-text"
                    placeholder="Please enter Title"
                    name="title"
                    value={formValue.title}
                    onChange={handleChange}
                />
            </div>

            {/* Sub title */}
            <div className="flex-between-center mt-8">
                <label className="w-[200px] ">Sub Title</label>
                <input
                    className="input flex-1 hover:cursor-text"
                    placeholder="Please enter subTitle"
                    name="subTitle"
                    value={formValue.subTitle}
                    onChange={handleChange}
                />
            </div>

            {/* Thumbnail */}
            <div className="flex-between-center mt-8">
                <label className="w-[200px] ">Thumbnail</label>
                <div className="flex-1">
                    <UploadImage thumbnail={formValue.thumbnail} setFormValue={setFormValue} />
                </div>
            </div>

            {/* Images */}
            <div className="flex-between-center mt-8">
                <label className="w-[200px] ">Images</label>
                <div className="flex-1">
                    <UploadImageMultiple urlList={formValue.images} setFormValue={setFormValue} />
                </div>
            </div>

            {/* Price */}
            <div className="flex-between-center mt-8">
                <label className="w-[200px] ">Price</label>
                <input
                    className="input flex-1 hover:cursor-text"
                    placeholder="Please enter Price"
                    name="price"
                    value={formValue.price}
                    onChange={handleChange}
                />
            </div>

            {/* Category */}
            <div className="flex-between-center mt-8">
                <label className="w-[200px] " htmlFor="category">
                    Category
                </label>
                <Select
                    className="flex-1 capitalize"
                    value={formValue.category}
                    onChange={selectCategory.onChange}
                    options={selectCategory.options}
                />
            </div>

            {/* Genders */}
            <div className="flex-between-center mt-8">
                <label className="w-[200px] " htmlFor="genders">
                    Genders
                </label>
                <Select
                    className="flex-1 capitalize cursor-pointer"
                    mode="tags"
                    value={formValue.genders}
                    disabled={!formValue.category}
                    onChange={selectGenders.onChange}
                    options={selectGenders.options}
                />
            </div>

            {/* Description */}
            <div className="flex-between-center mt-8">
                <label className="w-[200px] " htmlFor="description">
                    Description
                </label>
                <textarea
                    className="input h-fit flex-1 hover:cursor-text py-4"
                    name="description"
                    rows="2"
                    cols="50"
                    value={formValue.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            {/* Options */}
            <div className="flex justify-between mt-8">
                <label className="w-[200px] " htmlFor="size">
                    Size - Stock
                </label>
                <div className="flex-1 flex-column">
                    {options.map((option, index) => (
                        <div className="flex-between-center mb-4" key={index}>
                            <input
                                className="input w-[100px] hover:cursor-text"
                                value={option.size || ''}
                                onChange={e => handleChangeOptions(e, index, 'size')}
                                onKeyUp={e => e.keyCode === 32 && setOptions(state => [...state, {}])}
                            />
                            <Slider
                                className="mx-8 flex-1"
                                value={option.stock || 25}
                                disabled={!option.size}
                                onChange={e => handleChangeOptions(e, index, 'stock')}
                            />

                            {options.length !== 1 && (
                                <TiDeleteOutline
                                    className="hover:cursor-pointer"
                                    onClick={() =>
                                        setOptions(state => state.filter((_, indexOption) => index !== indexOption))
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* More option */}
            <div
                className="ml-[200px] text-xs flex items-center gap-2 hover:cursor-pointer"
                onClick={() => setOptions(state => [...state, {}])}
            >
                <span>Add more size</span>
                <AiOutlinePlusCircle />
            </div>

            <Button type="submit" className="w-[200px] ml-[200px] mt-5 capitalize">
                {action}
            </Button>
        </form>
    );
}

export default FormProduct;
