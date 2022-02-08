import { Box, Button, Toolbar, Typography } from "@mui/material";
import { RouteType } from "../../../models/route-type";
import NavigatorTabs from "./navigator-tabs";
import { FC } from 'react';
import { Link } from 'react-router-dom';

type NavigatorProps = {
    logo: string;
    menuItems: RouteType[];
    authItems: RouteType[];
}

const Navigator: FC<NavigatorProps> = (props) => {

    const { logo, menuItems, authItems } = props;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100vw' }}>
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
        </Box>
    )
}

export default Navigator;