import { Alert, AlertTitle, LinearProgress } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { routes } from './config/routing';
import { authService } from './config/servicesConfig';
import ErrorType from './models/error-types';
import { RouteType } from './models/route-type';
import { nonAuthorisedUser, UserData } from './models/user-data';
import { setErrorCode, setUserData } from './redux/actions';
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
        }
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
  return routes.map(el => <Route key={el.path} path={el.path} element={el.element} ></Route>)
}

function getRelevantRoutes(userData: UserData): RouteType[] {
  const isGuest = !userData.displayName;
  const isUser = (!!userData.displayName && !userData.isAdmin);
  const isAdmin = userData.isAdmin;

  return routes.filter(route => 
    (route.isAdmin && route.isUser && route.isGuest) ||
    (isGuest && route.isGuest) || 
    ((isUser || isAdmin) && route.isUser && route.isAdmin) ||
    (isUser && route.isUser && !route.isAdmin) || 
    (isAdmin && route.isAdmin)
    )
}