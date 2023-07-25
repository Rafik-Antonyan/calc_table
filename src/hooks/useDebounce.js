import { useEffect, useState } from "react";
// հենց գրելուց ստոպ ես տալիս էդ ժամանակ գրածդ բերումա(օրինակ որ շատ հարցումներ չանես search անելուց)
export function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounced(value)
        }, delay)

        return () => clearTimeout(handler)
    }, [value])

    return debounced
}
