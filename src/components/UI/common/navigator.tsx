import { Box, Toolbar } from "@mui/material";
import { FC } from "react";
import { RouteType } from "../../../models/route-type";
import NavigatorTabs from "./navigator-tabs";

type NavigatorProps = {
    items: RouteType[];
}

const Navigator: FC<NavigatorProps> = (props) => {


    return (
        <Toolbar
            sx={{
                justifyContent: 'space-between'
            }}
        >
            <NavigatorTabs
                orientation='horizontal'
                items={props.items}
            />
        </Toolbar>
    )
}

export default Navigator;