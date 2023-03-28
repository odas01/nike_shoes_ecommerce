import { Link } from 'react-router-dom';

function MenuItem({ to, curPath, icon, title }) {
    const active = curPath === to ? 'active' : '';
    const activeText = curPath === to ? 'text-[#0e9f6e] dark:text-[#f4f5f7]' : 'text-[#707275]';
    return (
        <Link
            to={to}
            className={`relative flex items-center py-4 px-5 font-medium transition-colors duration-300 ease 
            hover:text-[#0e9f6e]  dark:hover:text-[#f4f5f7] ${active} ${activeText}`}
        >
            {curPath === to && (
                <span
                    className={`absolute left-0 top-0 w-1 h-full bg-[#0e9f6e] rounded-tr-lg none rounded-br-lg`}
                ></span>
            )}
            {icon}
            <span className="ml-4 ">{title}</span>
        </Link>
    );
}

export default MenuItem;
