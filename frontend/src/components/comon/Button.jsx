function Button({
    type,
    title,
    color = 'white',
    bgColor = '#0e9f6e',
    className = '',
    handleClick,
    children,
    ...props
}) {
    const classNameProp = `flex-center h-[46px] bg-[${bgColor}] text-[${color}] rounded-lg
     transition-colors duration-200 ease cursor-pointer hover:bg-[#057A55]
    disabled:bg-[#057A55] ${className}`;
    return (
        <button
            className={classNameProp}
            style={{
                color: color,
                backgroundColor: bgColor
            }}
            type={type}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
