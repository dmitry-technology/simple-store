import { Alert, AlertTitle, LinearProgress } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Subscription } from 'rxjs';
import { routes } from './config/routing';
import { authService, orederStore, clientStore, productStore } from './config/servicesConfig';
import { Client } from './models/client-type';
import ErrorType from './models/error-types';
import { Order } from './models/order-type';
import { Product } from './models/product';
import { RouteType } from './models/route-type';
import { nonAuthorisedUser, UserData } from './models/user-data';
import { setClients, setErrorCode, setOrders, setProducts, setUserData } from './redux/actions';
import { errorCodeSelector, userDataSelector } from './redux/store';

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
  useEffect( () => setRelevantRoutes(getRelevantRoutes((userData))), [userData])

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
          console.log(relevantRoutes); 
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
                : <Routes>
                  {getRoutes(relevantRoutes)}
                  <Route path={'*'} element={<Navigate to={relevantRoutes[0].path}/>}></Route>
                  </Routes>
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

  return routes.filter(route => true
    // (route.isAdmin && route.isUser && route.isGuest) ||
    // (isGuest && route.isGuest) || 
    // ((isUser || isAdmin) && route.isUser && route.isAdmin) ||
    // (isUser && route.isUser && !route.isAdmin) || 
    // (isAdmin && route.isAdmin)
    )
}

