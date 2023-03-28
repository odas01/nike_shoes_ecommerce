import { AiOutlineArrowUp } from 'react-icons/ai';

import './style.css';

function ScrollTop({ show, target = window }) {
    const handleScrollTop = () => {
        target.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div
            className={`fixed right-10 bottom-10 w-16 h-10 rounded overflow-hidden shadow-scrollTop cursor-pointer z-50 transition-all ${
                !show ? 'translate-x-[200%]' : 'translate-x-0'
            }`}
            onClick={handleScrollTop}
        >
            <div className="scrollTop">
                <div>
                    <span>
                        <AiOutlineArrowUp />
                    </span>
                    <span>
                        <AiOutlineArrowUp />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ScrollTop;
