import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function LoadingOverlay({ title }) {
    return (
        <div className="h-[100vh] bg-[rgba(0,0,0,0.5)] fixed z-50 inset-0 flex-center flex-col text-2xl text-white">
            <AiOutlineLoading3Quarters size="40px" className="animate-waving-hand" />
            {title}
        </div>
    );
}

export default LoadingOverlay;
