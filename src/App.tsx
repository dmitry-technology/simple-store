import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { routes } from './config/routing';
import { authService, orederStore } from './config/servicesConfig';
import ErrorType from './models/error-types';
import { Order, OrderStatus } from './models/order-type';
import { RouteType } from './models/route-type';
import { UserData } from './models/user-data';
import { setErrorCode, setUserData } from './redux/actions';
import { userDataSelector } from './redux/store';

function App() {

  

  // const order:Order = {
  //   userId: 10203040,
  //   status: OrderStatus.WORKING,
  //   products: [{productId: 100001, count: 5},{productId: 100002, count: 3},{productId: 100003, count: 1}],
  //   totalPrice: 500,
  //   dateCreate: new Date().toISOString()
  // }
  
  // orederStore.add(order).then((e)=>console.log(e)).catch((e)=>console.log("error="+e));

  // useEffect( () => {
  //   // orederStore.get(1000999).then((e)=> {
  //   //   console.log(e);
  //   // });
  //   orederStore.add(order).then((e)=>console.log(e)).catch((e)=>console.log("error="+e));
  //   orederStore.update(114301, order)
  // }, []);


  

  const dispatch = useDispatch();
  const [relevantRoutes, setRelevantRoutes] = useState<RouteType[]>(routes);
  const userData: UserData = useSelector(userDataSelector);

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
          dispatch(setErrorCode(ErrorType.SERVER_UNAVAILABLE));
        } else {
          dispatch(setErrorCode(ErrorType.NO_ERROR));
          dispatch(setUserData(ud));
          console.log(relevantRoutes); 
        }
      }
    })
  }

  return  <BrowserRouter>
            <Routes>
              {getRoutes(relevantRoutes)}
            </Routes>
          </BrowserRouter>
}

export default App;

// Routes managment

function getRoutes(routes: RouteType[]): React.ReactNode[] {
  return routes.map(el => <Route key={el.path} path={el.path} element={el.element} ></Route>)
}

function getRelevantRoutes(userData: UserData): RouteType[] {
  return routes.filter(route => 
    (!!userData.userName && route.authenticated) || 
    (userData.isAdmin && route.adminOnly) || 
    (!userData.userName && !route.authenticated && !route.adminOnly) )
}