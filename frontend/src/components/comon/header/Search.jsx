import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { TbMoodEmpty } from 'react-icons/tb';
import { MdOutlineCancel } from 'react-icons/md';

import useDebounce from 'hooks/useDebounce';
import productApi from 'api/productApi';

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([1]);
    const [showResult, setShowResult] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef(null);

    const debouncedValue = useDebounce(searchValue, 500);

    useEffect(() => {
        const searchProduct = async () => {
            if (!debouncedValue.trim()) {
                setSearchResult([]);
                return;
            }
            try {
                const res = await productApi.getAll({ title: debouncedValue, limit: 7 });
                setSearchResult(res.products);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        searchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    // event Input
    const handleChange = e => {
        setSearchResult([]);
        setLoading(true);
        setSearchValue(e.target.value);
    };
    // event Tippy
    const redirectToDetail = (slug = '') => {
        setShowResult(false);
        setSearchValue('');

        slug && navigate('/d/' + slug);
    };

    const redirectToSearch = () => {
        setShowResult(false);
        setSearchValue('');

        navigate(`c?q=${searchValue}`);
        inputRef.current.blur();
    };

    return (
        <div className="relative flex-center pr-3 pl-10 bg-white border border-gray-300 rounded-full max-w-[300px]">
            <div className="h-10 w-10 flex-center absolute left-0 cursor-pointer" onClick={redirectToSearch}>
                <BiSearch size={20} color="#ced4d9" />
            </div>

            <input
                className="pl-1 pr-5 py-3 cursor-text transition-all w-64 z-10 peer"
                ref={inputRef}
                value={searchValue}
                placeholder="Enter your product..."
                onChange={handleChange}
                onKeyDown={e => searchValue && e.key === 'Enter' && redirectToSearch()}
                onFocus={() => setShowResult(true)}
                onBlur={() => setShowResult(false)}
            />

            {/* <div className="inline-block absolute left-[44px] peer-focus:hidden peer-[&:not(:placeholder-shown)]:hidden">
                <p className="text-sm text-gray-400 font-normal overflow-hidden whitespace-nowrap pointer-events-none animate-typing">
                    Enter your product...
                </p>
            </div> */}
            <div
                className="absolute right-2 peer-placeholder-shown:hidden cursor-pointer px-2 z-40"
                onClick={() => setSearchValue('')}
            >
                <MdOutlineCancel size={12} />
            </div>
            <div
                className={`absolute top-[50px] right-0 z-50 shadow-[0px_5px_15px_#00000059] bg-white w-full max-h-[500px] overflow-y-auto p-2 rounded-md duration-200 ${
                    showResult && (searchValue || searchResult.length >= 1)
                        ? 'visible opacity-100 top-12'
                        : 'invisible opacity-0 top-20'
                }`}
            >
                <div className="flex-column">
                    {searchResult.length > 0 &&
                        searchResult.map((result, index) => (
                            <div
                                key={index}
                                className="flex items-center px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-md"
                                onClick={() => redirectToDetail(result.slug)}
                            >
                                <div className="w-[40px] h-[40px] mr-4">
                                    <img
                                        alt={result.title}
                                        src={result.thumbnail?.url}
                                        className="w-full h-full object-cover rounded-full border border-solid border-gray-100"
                                    />
                                </div>
                                <span className="span_text font-medium flex-1 text-[15px]">{result.title}</span>
                            </div>
                        ))}

                    {searchResult.length === 0 && !loading && (
                        <span className="flex-center p-2 text-lg italic" onClick={() => redirectToDetail()}>
                            <TbMoodEmpty size={20} className="mr-2" />
                            No product
                        </span>
                    )}

                    {loading && (
                        <div className="flex-center h-[60px]">
                            <AiOutlineLoading3Quarters size={24} className="animate-spin" />
                        </div>
                    )}
                    <div
                        className="flex items-center px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-md"
                        onClick={redirectToSearch}
                    >
                        <div className="w-[40px] h-[40px] mr-3 flex-center bg-[#26acbb] rounded-full">
                            <BiSearch size={20} color="#fff" />
                        </div>
                        <div className="span_text flex-1 text-[15px] text-[#26acbb]">
                            Search:
                            <span className="ml-1 font-bold">{searchValue}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
