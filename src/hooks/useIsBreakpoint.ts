"use client";

import { useEffect, useState } from "react";
import { BREAKPOINT } from "./breakpoint";

/**
 * `true`, solange das Fenster schmaler als `breakpoint` ist.
 *
 * Der Wert wird beim Mount einmal berechnet (nicht erst beim ersten Resize)
 * und ist auf dem Server `false`, damit SSR und erster Client-Render
 * übereinstimmen.
 */
export const useIsBreakpoint = (breakpoint: number = BREAKPOINT.MD): boolean => {
    const [isBreakpoint, setIsBreakpoint] = useState(false);

    useEffect(() => {
        const calcBreakpoint = () =>
            setIsBreakpoint(window.innerWidth < breakpoint);

        calcBreakpoint();
        window.addEventListener("resize", calcBreakpoint);

        return () => window.removeEventListener("resize", calcBreakpoint);
    }, [breakpoint]);

    return isBreakpoint;
};
