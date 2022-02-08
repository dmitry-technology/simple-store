import { Alert, AlertTitle, LinearProgress } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Subscription } from 'rxjs';
import { routes } from './config/routing';
import { authService, categoriesStore, productStore } from './config/servicesConfig';
import { Category } from './models/category-type';
import ErrorType from './models/error-types';
import { Product } from './models/product';
import { RouteType } from './models/route-type';
import { nonAuthorisedUser, UserData } from './models/user-data';
import { setCategories, setErrorCode, setProducts, setUserData } from './redux/actions';
import { errorCodeSelector, userDataSelector } from './redux/store';
import Navigator from './components/UI/common/navigator';

function App() {

  const dispatch = useDispatch();
  const [relevantRoutes, setRelevantRoutes] = useState<RouteType[]>(routes);
  const userData: UserData = useSelector(userDataSelector);

  // Error Handling
  const code: ErrorType = useSelector(errorCodeSelector);
  const [serverUnavailable, setServerUnavailable] = useState(false);
  const handleErrorCallback = useCallback(handleError, [code]);
  function handleError() {
    if (code === ErrorType.NO_ERROR) {
      setServerUnavailable(false);
    } else if (code === ErrorType.AUTH_ERROR) {
      if (!!userData.userName) { authService.logout() }
      setServerUnavailable(false)
    } else {
      setServerUnavailable(true);
    }
  }
  useEffect( () => handleErrorCallback(), [handleErrorCallback] )

  // Update relevant routes
  useMemo( () => setRelevantRoutes(getRelevantRoutes((userData))), [userData])

  // Subscribe User Token
  useEffect(() => {
    let subscriptionToUserToken = subscribeToUserToken();
    return () => subscriptionToUserToken.unsubscribe();
  }, []);

  function subscribeToUserToken() {
    return authService.getUserData().subscribe({
      next(ud) {
        if (ud.displayName === '') {
          dispatch(setErrorCode(ErrorType.AUTH_ERROR));
          dispatch(setUserData(nonAuthorisedUser));
        } else {
          dispatch(setErrorCode(ErrorType.NO_ERROR));
          dispatch(setUserData(ud));
        }
      }
    })
  }

  // Subscribe to categories
  useEffect(() => {
    const subscription = subscribeToCategories();
    return () => subscription.unsubscribe();
  }, [])

  function subscribeToCategories(): Subscription {
    return categoriesStore.getAll().subscribe({
      next(cat: Category[]) {
        dispatch(setCategories(cat));
      }
    })
  }

  // Subscribe to products
  useEffect(() => {
    const subscription = subscribeToProducts();
    return () => subscription.unsubscribe();
  }, [])

  function subscribeToProducts(): Subscription {
    return productStore.getAll().subscribe({
      next(prod: Product[]) {
        dispatch(setProducts(prod));
      }
    })
  }

  return  <BrowserRouter>
            {/* Show Alert if Connection refused*/}
            {serverUnavailable 
                ? <React.Fragment> 
                    <Alert severity="error">
                      <AlertTitle>Error connecting to the database.</AlertTitle>
                        <strong>Trying to reconnect...</strong>
                    </Alert> 
                    <LinearProgress sx={{width: '100%'}} />
                  </React.Fragment> 
                : <React.Fragment>
                    <Navigator items={relevantRoutes} />
                    <Routes>
                    {getRoutes(relevantRoutes)}
                    <Route path={'*'} element={<Navigate to={relevantRoutes[0].path}/>}></Route>
                    </Routes>
                  </React.Fragment>
              }
          </BrowserRouter>
}

export default App;

// Routes managment
function getRoutes(routes: RouteType[]): React.ReactNode[] {
  return routes.map(el => <Route key={el.label} path={el.path} element={el.element} ></Route>)
}

function getRelevantRoutes(userData: UserData): RouteType[] {
  const isGuest = !userData.displayName;
  const isUser = (!!userData.displayName && !userData.isAdmin);
  const isAdmin = userData.isAdmin;

  console.log("isGuest:" + isGuest + " isUser:" + isUser + " isAdmin:" + isAdmin);
  
  const res = routes.filter(route => 
    (route.isAdmin && route.isUser && route.isGuest) ||
    (isGuest && route.isGuest) || 
    ((isUser || isAdmin) && route.isUser && route.isAdmin) ||
    (isUser && route.isUser && !route.isAdmin) || 
    (isAdmin && route.isAdmin) ||
    (isUser && route.isUser)
    )

    console.log(res);
    

    return res;
}