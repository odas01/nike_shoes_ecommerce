import { useState, useEffect } from 'react';

function useAutoText(value, delay = '200', isHide = false) {
    const [text, setText] = useState('');
    const [count, setCount] = useState(-1);

    useEffect(() => {
        if (!isHide) {
            const timeout = setTimeout(() => {
                if (count < value.length - 1) {
                    setText(placeholder => placeholder + value[count + 1]);
                    setCount(count => count + 1);
                } else {
                    setText('');
                    setCount(-1);
                }
            }, delay);
            return () => clearTimeout(timeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    const resetText = () => {
        setCount(0);
        setText(value[0]);
    };

    const hideText = () => {
        setText('');
    };

    return { text, resetText, hideText };
}

export default useAutoText;
