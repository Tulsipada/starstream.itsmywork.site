import { useEffect } from 'react';

export const useDropdownPreventShake = (isOpen: boolean) => {
    useEffect(() => {
        if (isOpen) {
            // Simple approach - just prevent scrolling
            document.body.style.overflow = 'hidden';
            document.body.classList.add('dropdown-open');
        } else {
            // Restore scrolling
            document.body.style.overflow = '';
            document.body.classList.remove('dropdown-open');
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('dropdown-open');
        };
    }, [isOpen]);
};
