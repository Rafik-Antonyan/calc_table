import { useEffect } from "react";
export const useEnter = (handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (event.charCode === 13) {
                event.preventDefault()
                handler()
            }
        };
        document.addEventListener('keypress', listener);
        return () => {
            document.removeEventListener('keypress', listener);
        };
    }, [handler]);
}