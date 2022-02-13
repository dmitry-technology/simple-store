import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { RouteType } from "../../../models/route-type";
import NavigatorTabs from "./navigator-tabs";
import { FC, Fragment, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileMenu from "./profile-menu";
import { PATH_LOGIN } from "../../../config/routing";
import LoginIcon from '@mui/icons-material/Login';
import pages from "../../pages";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";
import { useSelector } from "react-redux";
import { UserData } from "../../../models/user-data";
import { userDataSelector } from "../../../redux/store";

type NavigatorProps = {
    logo: string;
    menuItems: RouteType[];
    authItems: RouteType[];
}

const Navigator: FC<NavigatorProps> = (props) => {

    const userData: UserData = useSelector(userDataSelector);
    let { logo, menuItems, authItems } = props;
    const path = useLocation().pathname;
    const isMenuItem = useMemo(() => menuItems.find(item => item.path === path), [path]);
    
    // TODO
    const categories = [
        'мясная', 'кошерная', 'морепродукты', 'напитки'
    ]

    useEffect(() => {
        if (userData.isAdmin) {
            // menuItems = categories;
        }
    }, [])

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <Fragment>
            { isMenuItem && <AppBar style={{ background: '#ff6f04' }}>
                <Container maxWidth="xl" >
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            {logo}
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {menuItems.map((page) => (
                                    <MenuItem key={page.path} onClick={handleCloseNavMenu} component={Link} to={page.path} >
                                        <Typography textAlign="center">{page.label}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                        >
                            {logo}
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {menuItems.map((page) => (
                                <Button
                                    component={Link}
                                    to={page.path}
                                    key={page.path}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}>
                                    {page.label}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                        { authItems[0].path === PATH_LOGIN ? <Button variant='contained' startIcon={<LoginIcon/ >} component={Link} to={authItems[0].path}>{authItems[0].label}</Button> : <ProfileMenu items={menuItems} userData={userData} /> }
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>}
        </Fragment>
    )
}

export default Navigator;