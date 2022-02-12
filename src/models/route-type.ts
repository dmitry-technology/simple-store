import { ReactNode } from "react";
export type RouteType = {
    path: string,
    element: ReactNode,
    label?: string,
    icon?: any,
    isGuest?: boolean
    isUser?: boolean,
    isAdmin?: boolean
};