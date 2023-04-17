import addressApi from 'api/addressApi';
import { useEffect, useState } from 'react';

function Address({ address, setAddress }) {
    const [show, setShow] = useState(false);
    const [listProvince, setListProvince] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listWard, setListWard] = useState([]);

    const [active, setActive] = useState(1);

    useEffect(() => {
        const getProvinces = async () => {
            try {
                const res = await addressApi.getProvinces();
                setListProvince(res.reverse());
            } catch (err) {
                console.log(err);
            }
        };
        getProvinces();
    }, []);

    const getDistricts = async code => {
        try {
            const res = await addressApi.getDistricts(code);
            setListDistrict(res.districts);
        } catch (err) {
            console.log(err);
        }
    };
    const getWards = async code => {
        try {
            const res = await addressApi.getWards(code);
            setListWard(res.wards);
        } catch (err) {
            console.log(err);
        }
    };

    const saveProvince = async item => {
        setAddress({ province: item.name });
        await getDistricts(item.code);
        setActive(2);
    };
    const saveDistrict = async item => {
        setAddress(state => ({ ...state, district: item.name }));
        await getWards(item.code);
        setActive(3);
    };
    const saveWard = item => {
        setAddress(state => ({ ...state, ward: item.name }));
        setShow(false);
    };

    return (
        <>
            <div className="relative">
                <input
                    className="input w-full peer appearance"
                    type="text"
                    name="address"
                    value={address !== {} ? Object.values(address).join(', ') : ''}
                    placeholder=" "
                    disabled
                />
                <label htmlFor="address" className="label_top">
                    City/Town*
                </label>
                <div
                    className="absolute w-full h-full z-10 top-0 left-0 bg-transparent cursor-pointer"
                    onClick={() => setShow(!show)}
                ></div>
            </div>
            {show && (
                <div className="mt-1 border border-gray-300 rounded">
                    <div className="flex">
                        <span
                            className={`flex-1 text-center cursor-pointer py-2 ${
                                active === 1 ? 'text-orange-500' : ''
                            }`}
                            onClick={() => setActive(1)}
                        >
                            Tỉnh/Thành phố
                        </span>
                        <span
                            className={`flex-1 text-center cursor-pointer py-2 ${
                                active === 2 ? 'text-orange-500' : ''
                            } ${!address.province ? 'cursor-not-allowed' : ''}`}
                            onClick={() => address.province && setActive(2)}
                        >
                            Quận/Huyện
                        </span>
                        <span
                            className={`flex-1 text-center cursor-pointer py-2 ${
                                active === 3 ? 'text-orange-500' : ''
                            } ${!address.district ? 'cursor-not-allowed' : ''}`}
                            onClick={() => address.district && setActive(3)}
                        >
                            Phường/Xã
                        </span>
                    </div>
                    <div className="h-[2px] relative">
                        <div
                            className="w-1/3 h-full bg-orange-600 duration-500"
                            style={{ marginLeft: `${(100 * (active - 1)) / 3}%` }}
                        ></div>
                    </div>
                    <div className="h-[200px] overflow-hidden overflow-y-auto flex-column">
                        {active === 1 &&
                            listProvince &&
                            listProvince.map((item, index) => (
                                <span
                                    key={index}
                                    className={`cursor-pointer px-2 py-1 hover:text-orange-400 duration-150 ${
                                        address.province === item.name ? 'text-red-500' : ''
                                    }`}
                                    onClick={() => saveProvince(item)}
                                >
                                    {item.name}
                                </span>
                            ))}
                        {active === 2 &&
                            listDistrict.map((item, index) => (
                                <span
                                    key={index}
                                    className={`cursor-pointer px-2 py-1 hover:text-orange-400 duration-150 ${
                                        address.district === item.name ? 'text-red-500' : ''
                                    }`}
                                    onClick={() => saveDistrict(item)}
                                >
                                    {item.name}
                                </span>
                            ))}
                        {active === 3 &&
                            listWard.map((item, index) => (
                                <span
                                    key={index}
                                    className={`cursor-pointer px-2 py-1 hover:text-orange-400 duration-150 ${
                                        address.ward === item.name ? 'text-red-500' : ''
                                    }`}
                                    onClick={() => saveWard(item)}
                                >
                                    {item.name}
                                </span>
                            ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Address;
