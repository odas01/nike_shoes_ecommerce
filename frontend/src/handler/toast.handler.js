import { toast as toastReact } from 'react-toastify';

export const toast = (type, msg, position = 'top-center') => {
    return toastReact(msg, {
        type,
        position,
        autoClose: 2000,
        theme: 'light'
    });
};
