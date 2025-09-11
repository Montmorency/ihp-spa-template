import { UUID } from "ihp-datasync";
import { useMemo } from "react";

export default function useCurrentUserId(): UUID {
    return useMemo(() => {
        const rootEl = document.getElementById('root') as HTMLElement;
        return rootEl.dataset.userId as UUID;
    }, []);
}