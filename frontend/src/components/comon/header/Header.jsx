import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsBag } from 'react-icons/bs';

import Logo from '../Logo';
import Search from './Search';
import Navbar from './Navbar';

function Header({ offset }) {
    const cartQuantity = useSelector(state => state.cart.qty);

    return (
        <div
            className={`bg-white transition-all duration-1000 h-[74px] ${
                !offset ? 'fixed top-0 right-0 left-0 z-40' : 'relative'
            }`}
        >
            <div className="container h-full flex-between-center">
                <Link to="/">
                    <Logo size={56} />
                </Link>

                <Navbar offset={offset} />

                <div className="flex-center py-4">
                    <div id="search">
                        <Search />
                    </div>
                    <div className="relative group">
                        <Link to="/cart">
                            <BsBag size={20} className="transition-all ml-6 group-hover:scale-110" />
                            <span
                                className="w-6 h-6 bg-white flex-center absolute -top-3 -right-4 
                                shadow-badge rounded-full text-[10px] font-bold"
                            >
                                {cartQuantity}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
