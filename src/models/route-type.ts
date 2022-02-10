import { ReactNode } from "react";
export type RouteType = {
    path: string,
    element: ReactNode,
    label?: string,
    isGuest?: boolean
    isUser?: boolean,
    isAdmin?: boolean
};