import { useState, memo } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { BiShow, BiHide } from 'react-icons/bi';

const label = [
    {
        text: 'Price: Low to High',
        value: 'price:desc'
    },
    {
        text: 'Price: High to Low',
        value: 'price:asc'
    }
];

function Sort({ sort, onSort, hideFilter, onHideFilter }) {
    // show Sort
    const [show, setShow] = useState(false);
    const [text, setText] = useState('');

    const handleSort = e => {
        const [type, value] = e.target.value.split(':');
        if (type && value) onSort(type + ':' + value);
        else onSort(null);

        setText(e.target.value ? e.target.textContent : 'Default');
        setShow(false);
    };

    const handleHide = () => {
        onHideFilter(!hideFilter);
        show && setShow(false);
    };

    return (
        <div className="relative flex gap-5">
            <div className="flex-center cursor-pointer" onClick={handleHide}>
                {!hideFilter ? (
                    <span className="gap-2 flex-center">
                        Hide filter
                        <BiHide />
                    </span>
                ) : (
                    <span className="gap-2 flex-center">
                        Show filter
                        <BiShow />
                    </span>
                )}
            </div>

            <span className="flex items-center gap-1 cursor-pointer" onClick={() => setShow(!show)}>
                Sort by: <span className="text-sm opacity-75 mx-1">{text}</span> <BsChevronDown />
            </span>
            <div className="absolute right-0 top-full w-44 z-30 overflow-hidden">
                <div
                    className={`relative p-2 flex-column items-end rounded-md border border-gray-100 bg-white duration-500 ${
                        show ? '-top-[4px]' : ' -top-[150px]'
                    }`}
                >
                    {sort && (
                        <button
                            className="py-1 text-sm cursor-pointer hover:opacity-75 w-full text-end"
                            value=""
                            onClick={handleSort}
                        >
                            Default
                        </button>
                    )}
                    {label.map((item, index) => (
                        <button
                            key={index}
                            className="py-1 text-sm cursor-pointer hover:opacity-75 disabled:opacity-100 w-full text-end"
                            value={item.value}
                            onClick={handleSort}
                            disabled={item.value === sort}
                        >
                            {item.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(Sort);
