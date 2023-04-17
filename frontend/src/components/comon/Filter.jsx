import { memo, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Checkbox, Row, Col } from 'antd';
import { Collapse } from 'antd';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

const listSize = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];

function Filter({ setFilter }) {
    const [priceOptions, setPriceOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);

    const params = useParams();
    const gender = useSelector(state => state.category.genders).find(item => item.name === params.gender);

    useEffect(() => {
        setPriceOptions([]);
        setSizeOptions([]);

        setFilter(null);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleChange = value => {
        setPriceOptions(value);
        setFilter(state => ({ ...state, price: value.join(',') }));
    };

    const choseSize = value => {
        const isExist = sizeOptions.some(item => item === value);

        let newSizeOptions = [];
        if (isExist) {
            newSizeOptions = sizeOptions.filter(item => item !== value);
        } else {
            newSizeOptions = [...sizeOptions, value];
        }
        setSizeOptions(newSizeOptions);
        setFilter(state => ({ ...state, size: newSizeOptions.join(',') }));
    };
    return (
        <div className="sticky top-[75px]">
            <div className="pr-8 text-sm max-h-[640px] overflow-hidden overflow-y-auto">
                {/* cagegory */}
                {gender && (
                    <div className="flex-column pt-2 mb-5 border-t border-gray-200">
                        {gender.children.map((item, index) => (
                            <NavLink
                                key={index}
                                to={`/c/${gender.name}/${item.slug}`}
                                className={({ isActive }) =>
                                    `capitalize mb-1 duration-200 hover:underline hover:underline-offset-4 ${
                                        isActive ? 'underline underline-offset-4 decoration-gray-400 font-semibold' : ''
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                )}

                {/* price */}
                <div className="py-2 border-t border-gray-200 overflow-hidden">
                    {/* <div
                        className="flex-between-center cursor-pointer"
                        onClick={() => setShow(state => ({ ...state, price: !state.price }))}
                    >
                        <span className="text-[15px] mb-2">by Price</span>
                        {show.price ? <BsChevronDown /> : <BsChevronUp />}
                    </div> */}
                    <Collapse
                        accordion
                        ghost
                        expandIcon={({ isActive }) => (!isActive ? <AiOutlinePlus /> : <AiOutlineMinus />)}
                        expandIconPosition="end"
                        defaultActiveKey={['1']}
                    >
                        <Collapse.Panel
                            header={<span className="text-[15px] cursor-pointer block py-2">by Price</span>}
                            key="1"
                        >
                            <Checkbox.Group
                                className="flex-column"
                                options={[
                                    { label: 'Under 1.000.000đ', value: '0-1000000' },
                                    { label: '1.000.000đ - 2.999.999đ', value: '1000000-2999999' },
                                    { label: '3.000.000đ - 4.999.999đ', value: '3000000-4999999' },
                                    { label: 'Over 5.000.000đ', value: '5000000' }
                                ]}
                                value={priceOptions}
                                onChange={e => handleChange(e, 'price')}
                            />
                        </Collapse.Panel>
                    </Collapse>
                </div>

                {/* size */}
                <div className="py-2 border-t border-gray-200 overflow-hidden">
                    <Collapse
                        accordion
                        ghost
                        expandIcon={({ isActive }) => (!isActive ? <AiOutlinePlus /> : <AiOutlineMinus />)}
                        expandIconPosition="end"
                        defaultActiveKey={['1']}
                    >
                        <Collapse.Panel
                            header={<span className="text-[15px] cursor-pointer block py-2 mb-2">by Size</span>}
                            key="1"
                        >
                            <Row gutter={[5, 5]}>
                                {listSize.map((item, index) => (
                                    <Col span={8} key={index}>
                                        <span
                                            className={`py-[5px] w-full h-[30px] block text-center  transition-all border-b border-gray-300 rounded text-xs cursor-pointer          
                                    ${
                                        sizeOptions.includes(item)
                                            ? 'border-[#26acbb] border-b-[3px] text-[#26acbb]'
                                            : ' border-gray-300'
                                    }`}
                                            onClick={() => choseSize(item)}
                                        >
                                            {item}
                                        </span>
                                    </Col>
                                ))}
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                </div>
            </div>
        </div>
    );
}

export default memo(Filter);
