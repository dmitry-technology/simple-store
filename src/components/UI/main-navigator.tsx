import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { RouteType } from "../../models/route-type";
import { FC, Fragment, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import ProfileMenu from "./common/profile-menu";
import { PATH_LOGIN } from "../../config/routing";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";
import { useSelector } from "react-redux";
import { UserData } from "../../models/user-data";
import { categoriesSelector, userDataSelector } from "../../redux/store";
import { Category } from "../../models/category-type";
import ShoppingCartButton from "./common/cart-button-view";
import PersonIcon from '@mui/icons-material/Person';
import config from "../../config/store-config.json";

type NavigatorProps = {
    menuItems: RouteType[];
    authItems: RouteType[];
}

function generateMenu(categories: Category[]): RouteType[] {
    return categories.map(item => ({ path: `/#cat_${item.id}`, label: item.name }));
}

const MainNavigator: FC<NavigatorProps> = (props) => {

    const { menuItems, authItems } = props;
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
            {isMenuItem && <Fragment>
                <AppBar style={{ background: '#ff6f04' }}>
                    <Box sx={{ width: { xs: '100%', sm: '90%' }, alignSelf: 'center' }}>
                        <Toolbar disableGutters>
                            <Typography variant="h6" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
                                <img src={config.logoPictureUrl} height="40px" alt="Logo"></img>
                            </Typography>

                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                                    <MenuIcon />
                                </IconButton>
                                <Menu id="menu-appbar" anchorEl={anchorElNav}
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
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <img src={config.logoPictureUrl} height="35px" alt="Logo"></img>
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


                            {/* Show Shopping Cart Button */}
                            {!userData.isAdmin && <Box sx={{ flexGrow: 0, marginRight: '15px' }}><ShoppingCartButton /></Box>}

                            {/* Show Login button or User menu */}
                            <Box sx={{ flexGrow: 0 }}>
                                {authItems[0].path === PATH_LOGIN
                                    ? <Link to={authItems[0].path}><IconButton sx={{ ":hover": { bgcolor: '#a23b0e' }, backgroundColor: '#ff6f04', color: '#fff', border: '2px solid white', width: 40, height: 40 }}><PersonIcon /></IconButton></Link>
                                    : <ProfileMenu items={menuItems} userData={userData} />}
                            </Box>

                        </Toolbar>
                    </Box>
                </AppBar>
                <Box sx={{ marginBottom: { xs: '57px', sm: '70px' } }}></Box>
            </Fragment>}
        </Fragment>
    )
}

export default MainNavigator;