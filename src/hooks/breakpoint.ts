export enum BREAKPOINT {
    XS = 360,
    SM = 600,
    MD = 960,
    LG = 1280,
    XL = 1920,
    XXL = 2560,
}

export const BreakpointsMinQuery = {
    xs: `(min-width: ${BREAKPOINT.XS}px)`,
    sm: `(min-width: ${BREAKPOINT.SM}px)`,
    md: `(min-width: ${BREAKPOINT.MD}px)`,
    lg: `(min-width: ${BREAKPOINT.LG}px)`,
    xl: `(min-width: ${BREAKPOINT.XL}px)`,
    xxl: `(min-width: ${BREAKPOINT.XXL}px)`,
};

export const BreakpointsMaxQuery = {
    xs: `(max-width: ${BREAKPOINT.XS - 1}px)`,
    sm: `(max-width: ${BREAKPOINT.SM - 1}px)`,
    md: `(max-width: ${BREAKPOINT.MD - 1}px)`,
    lg: `(max-width: ${BREAKPOINT.LG - 1}px)`,
    xl: `(max-width: ${BREAKPOINT.XL - 1}px)`,
    xxl: `(max-width: ${BREAKPOINT.XXL - 1}px)`,
};
