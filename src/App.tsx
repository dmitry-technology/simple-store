import { Alert, AlertTitle, LinearProgress } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Subscription } from 'rxjs';
import { authService, orederStore, clientStore, productStore } from './config/servicesConfig';
import { Client } from './models/client-type';
import { authRoutes, menuRoutes, routes } from './config/routing';
import { Category } from './models/category-type';
import ErrorType from './models/error-types';
import { Order } from './models/order-type';
import { Product } from './models/product';
import { RouteType } from './models/route-type';
import { nonAuthorisedUser, UserData } from './models/user-data';
import { setClients, setErrorCode, setOrders, setProducts, setUserData } from './redux/actions';
import { errorCodeSelector, userDataSelector } from './redux/store';
import Navigator from './components/UI/common/navigator';

function App() {

  const dispatch = useDispatch();

  const userData: UserData = useSelector(userDataSelector);

  const relevantRoutes = useMemo(() => getRelevantRoutes(routes, userData), [userData]);
  const menuItems = useMemo(() => getRelevantRoutes(menuRoutes, userData), [userData]);
  const authItems = useMemo(() => getRelevantRoutes(authRoutes, userData), [userData]);

  // Error Handling
  const code: ErrorType = useSelector(errorCodeSelector);
  const [serverUnavailable, setServerUnavailable] = useState(false);
  useMemo(() => handleError(), [code]);

  function handleError() {
    if (code === ErrorType.NO_ERROR) {
      serverUnavailable && setServerUnavailable(false);
    } else if (code === ErrorType.AUTH_ERROR) {
      if (!!userData.userName) { authService.logout(); console.log('auth error') }
      serverUnavailable && setServerUnavailable(false);
    } else {
      !serverUnavailable && setServerUnavailable(true);
    }
  }

  // Subscribe User Token
  useEffect(() => {
    let subscriptionToUserToken = subscribeToUserToken();
    return () => subscriptionToUserToken.unsubscribe();
  }, []);

  function subscribeToUserToken() {
    return authService.getUserData().subscribe({
      next(ud) {
        if (ud.displayName === '') {
          if (userData.displayName) {
            dispatch(setErrorCode(ErrorType.AUTH_ERROR));
          }
          dispatch(setUserData(nonAuthorisedUser));
        } else {
          dispatch(setErrorCode(ErrorType.NO_ERROR));
          dispatch(setUserData(ud));
        }
      }
    })
  }

  //**subscriber orders */
  useEffect(() => {
    let subscription: any;
    subscription = getData();
    function getData(): Subscription {
      subscription && subscription.unsubscribe();
      return orederStore.getAll().subscribe({
        next(arr: Order[]) {
          dispatch(setErrorCode(ErrorType.NO_ERROR));
          dispatch(setOrders(arr));
        },
        error(err: any): void {
          dispatch(setErrorCode(err));
          setTimeout(() => {
            subscription = getData();
          }, 1000);
        }
      });
    }
    return () => subscription.unsubscribe();
  }, []);

    //**subscriber client */
    useEffect(() => {
      let subscription: any;
      subscription = getData();
      function getData(): Subscription {
        subscription && subscription.unsubscribe();
        return clientStore.getAll().subscribe({
          next(arr: Client[]) {
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setClients(arr));
          },
          error(err: any): void {
            dispatch(setErrorCode(err));
            setTimeout(() => {
              subscription = getData();
            }, 1000);
          }
        });
      }
      return () => subscription.unsubscribe();
    }, []);

    //**subscriber product */
    useEffect(() => {
      let subscription: any;
      subscription = getData();
      function getData(): Subscription {
        subscription && subscription.unsubscribe();
        return productStore.getAll().subscribe({
          next(arr: Product[]) {
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setProducts(arr));
          },
          error(err: any): void {
            dispatch(setErrorCode(err));
            setTimeout(() => {
              subscription = getData();
            }, 1000);
          }
        });
      }
      return () => subscription.unsubscribe();
    }, []);


    // useEffect(()=> {
    //   clientStore.get(300800100).then(e=>console.log(e)).catch(e=>console.log("err"+e))
    // })


  return (
    <BrowserRouter>
      {/* Show Alert if Connection refused*/}
      {serverUnavailable
        ? <React.Fragment>
          <Alert severity="error">
            <AlertTitle>Error connecting to the database.</AlertTitle>
            <strong>Trying to reconnect...</strong>
          </Alert>
          <LinearProgress sx={{ width: '100%' }} />
        </React.Fragment>
        : <React.Fragment>
          <Navigator logo={'BEST PIZZA B7'} menuItems={menuItems} authItems={authItems} />
          <Routes>
            {getRoutes(relevantRoutes)}
            <Route path={'*'} element={<Navigate to={relevantRoutes[0].path} />}></Route>
          </Routes>
        </React.Fragment>
      }
    </BrowserRouter>
  )
}

export default App;

// Routes managment
function getRoutes(routes: RouteType[]): React.ReactNode[] {
  return routes.map(el => <Route key={el.label} path={el.path} element={el.element} ></Route>)
}

function getRelevantRoutes(items: RouteType[], userData: UserData): RouteType[] {
  const isGuest = !userData.displayName;
  const isUser = (!!userData.displayName && !userData.isAdmin);
  const isAdmin = userData.isAdmin;

  // console.log("isGuest:" + isGuest + " isUser:" + isUser + " isAdmin:" + isAdmin);

  const res = items.filter(route =>
    (route.isAdmin && route.isUser && route.isGuest) ||
    (isGuest && route.isGuest) ||
    ((isUser || isAdmin) && route.isUser && route.isAdmin) ||
    (isUser && route.isUser && !route.isAdmin) ||
    (isAdmin && route.isAdmin) ||
    (isUser && route.isUser)
  )

  // console.log(res);


  return res;
}
