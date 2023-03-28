import React from 'react';
import { SiNike } from 'react-icons/si';

function Logo({ size, isTheme = false }) {
    return <SiNike size={size} className={isTheme ? 'dark:text-white' : ''} />;
}

export default Logo;
