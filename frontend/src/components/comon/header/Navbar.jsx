import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Dropdown } from 'antd';

function Navbar({ offset }) {
    const genders = useSelector(state => state.category.genders);
    const { gender: genderParams } = useParams();
    return (
        <div id="dropdown_navbar" className="flex-center capitalize absolute right-1/2 translate-x-1/2 z-50 gap-x-1">
            {genders &&
                genders.map((gender, index) => (
                    <Dropdown
                        menu={{
                            items: gender.children.map((item, index) => ({
                                key: index,
                                category: gender.name,
                                label: (
                                    <Link to={`c/${gender.name}/${item.slug}`} className="block px-2 py-1 font-medium">
                                        {item.name}
                                    </Link>
                                )
                            }))
                        }}
                        key={index}
                        placement="bottom"
                        arrow
                        overlayStyle={{
                            minWidth: '140%'
                        }}
                        getPopupContainer={() => document.querySelector('#dropdown_navbar')}
                    >
                        <Link
                            to={`c/${gender.name}`}
                            className={`px-5 transition-all ${
                                gender.name === genderParams
                                    ? 'duration-500 text-white before:before_navbar_item relative'
                                    : ''
                            } ${offset ? 'text-lg' : 'text-base'}`}
                        >
                            {gender.name}
                        </Link>
                    </Dropdown>
                ))}
        </div>
    );
}

export default Navbar;
