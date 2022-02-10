import { Box, Button, Toolbar, Typography } from "@mui/material";
import { RouteType } from "../../../models/route-type";
import NavigatorTabs from "./navigator-tabs";
import { FC, Fragment, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

type NavigatorProps = {
    logo: string;
    menuItems: RouteType[];
    authItems: RouteType[];
}

const Navigator: FC<NavigatorProps> = (props) => {

    const { logo, menuItems, authItems } = props;

    const path = useLocation().pathname;

    const isMenuItem = useMemo(() => menuItems.find(item => item.path === path), [path]);

    return (
        <Fragment>
            {isMenuItem && <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: { xs: '100vw', md: '95vw' }
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            {logo}
                        </Typography>
                        <NavigatorTabs orientation='horizontal' items={menuItems} />
                    </Toolbar>
                    <Button
                        component={Link}
                        to={authItems[0].path}
                    >
                        {authItems[0].label}
                    </Button>
                </Toolbar>
            </Box>}
        </Fragment>
    )
}

export default Navigator;