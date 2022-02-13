import { AppBar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { RouteType } from "../../models/route-type";
import { FC, Fragment, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import ProfileMenu from "./common/profile-menu";
import { PATH_LOGIN } from "../../config/routing";
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";
import { useSelector } from "react-redux";
import { UserData } from "../../models/user-data";
import { categoriesSelector, userDataSelector } from "../../redux/store";
import { Category } from "../../models/category-type";

type NavigatorProps = {
    logo: string;
    menuItems: RouteType[];
    authItems: RouteType[];
}

function generateMenu(categories: Category[]): RouteType[] {
    return categories.map(item => ({path: `/#cat_${item.id}`, label: item.name}));
}

const MainNavigator: FC<NavigatorProps> = (props) => {

    const { logo, menuItems, authItems } = props;
    const userData: UserData = useSelector(userDataSelector);
    const categories: Category[] = useSelector(categoriesSelector);
    const items = userData.isAdmin ? menuItems : generateMenu(categories);

    const path = useLocation().pathname;
    const isMenuItem = useMemo(() => menuItems.find(item => item.path === path), [menuItems, path]);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <Fragment>
            { isMenuItem && <Fragment>
                <AppBar style={{ background: '#ff6f04' }}>
                    <Container maxWidth="xl" >
                        <Toolbar disableGutters>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/"
                                sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                            >
                                <img src="logo_main.png" height="40px" alt="Logo"></img>
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
                                    {items.map((page) => (
                                        <MenuItem key={page.path} onClick={handleCloseNavMenu} component={Link} to={page.path}>
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
                                <img src="logo_main.png" height="35px" alt="Logo"></img>
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                {items.map((page) => (
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
                            { authItems[0].path === PATH_LOGIN 
                                ? <Button style={{ background: '#fff', color: '#ff6f04' }} variant='contained' startIcon={<LoginIcon/ >} component={Link} to={authItems[0].path}>{authItems[0].label}</Button> 
                                : <ProfileMenu items={menuItems} userData={userData} /> }
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Box sx={{marginBottom: '70px'}}></Box>
            </Fragment>}
        </Fragment>
    )
}

export default MainNavigator;