import { Alert, Avatar, Box, Button, createTheme, CssBaseline, Grid, IconButton, Link, Paper, TextField, ThemeProvider, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { LoginData, LoginType } from '../../models/login-data';
import storeConfig from '../../config/store-config.json'
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AuthErrorType, { getAuthErrorMessage } from '../../models/auth-error-types';

type LoginFormProps = {
  loginFn: (loginData: LoginData) => Promise<AuthErrorType>;
}

const LoginForm: FC<LoginFormProps> = (props) => {

  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
  const [passwordFiledsIsHidden, setPasswordFiledsHiddenStatus] = useState(true);
  const [loginErrMsg, setLoginErrMsg] = useState('');
  const [emailHelperText, setEmailHelperText] = useState('');
  const [isValid, setValid] = useState<boolean>(true);
  const theme = createTheme();

  // Activate Login button if user entered email
  useEffect(() => {
    setValid(!!loginData.email && !emailHelperText);
    setLoginErrMsg('');
  }, [loginData])

  function usernameHandler(event: any) {
    const email = event.target.value;
    loginData.email = email;
    loginData.loginType = LoginType.WITH_EMAIL_LINK;
    setLoginData({ ...loginData });
    setPasswordFiledsHiddenStatus(!isAdmin(email));
    setEmailHelperText(isEmailValid(email) ? '' : getAuthErrorMessage(AuthErrorType.INVALID_EMAIL));
  }

  function passwordHandler(event: any) {
    const password = event.target.value;
    loginData.password = password;
    loginData.loginType = LoginType.WITH_PASSWORD;
    setLoginData({ ...loginData });
  }

  async function loginWithSocialProvider(providerName: string) {
    await props.loginFn({ email: providerName, password: '', loginType: LoginType.WITH_SOCIAL_PROVIDER });
  }

  const socialButtons = new Map([
    ["Google", <IconButton key="Google" onClick={() => loginWithSocialProvider("Google")}><GoogleIcon /></IconButton>],
    ["Twitter", <IconButton key="Twitter" onClick={() => loginWithSocialProvider("Twitter")}><TwitterIcon /></IconButton>],
    ["Facebook", <IconButton key="Facebook" onClick={() => loginWithSocialProvider("Facebook")}><FacebookIcon /></IconButton>]
  ]);

  function isAdmin(email: string) {
    return email === storeConfig.adminEmail;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {

      const res: AuthErrorType = await props.loginFn(loginData);

      if (res === AuthErrorType.NO_ERROR) {
        setLoginErrMsg('');
      } else if (res === AuthErrorType.AWAITING_CONFIRMATION) {
        setLoginData({ email: '', password: '' })
        setLoginErrMsg(getAuthErrorMessage(res));
      } else {
        setLoginData({ email: '', password: '' })
        setLoginErrMsg(getAuthErrorMessage(res));
        setValid(false)
      }

    } catch (err) {
      setLoginErrMsg(getAuthErrorMessage(AuthErrorType.SERVER_UNAVAILABLE));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} sx={{
          backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/simple-store-fbe1f.appspot.com/o/login_pic.jpg?alt=media&token=92b8331c-73d1-485e-96cb-3760c0743ec1)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: '#ff6f04' }}>
              {/* <LockOutlinedIcon /> */}
            </Avatar>
            <Typography component="h1" variant="h5">
              BEST PIZZA B7
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField value={loginData.email} margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" onChange={usernameHandler} helperText={emailHelperText} error={!!emailHelperText} />

              {/* Show Password Field for admin */}
              {!passwordFiledsIsHidden
                && <TextField value={loginData.password} margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" onChange={passwordHandler} />}

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} color={'success'} disabled={!isValid}>
                Log in / Sign Up
              </Button>

              {!!loginErrMsg && <Alert severity={loginErrMsg === getAuthErrorMessage(AuthErrorType.AWAITING_CONFIRMATION) ? 'success' : 'error'} sx={{mb: 2}}>{loginErrMsg}</Alert>}
              <Grid container>
                <Grid item xs>
                  {storeConfig.socialLoginProviders.map(name => socialButtons.get(name))}
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LoginForm;

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {' © '}
      <Link color="inherit" href="http://localhost:3000">
        Best Pizza B7
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function isEmailValid(email: string): boolean {
  const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regularExpression.test(String(email).toLowerCase());
}