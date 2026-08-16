"use client";

import { usePathname } from "next/navigation";

/**
 * Der Pfad, den die Navigation als aktiv markiert.
 *
 * `override` gewinnt immer. Das braucht der Pages Router, wo die Route aus
 * `useRouter()` kommt, und es hilft beim Ausprobieren im Katalog.
 */
export const useActivePath = (override?: string): string => {
    const pathname = usePathname();
    return override ?? pathname ?? "/";
};
