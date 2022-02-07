import { Alert, Avatar, Box, Button, createTheme, CssBaseline, Grid, IconButton, Link, Paper, TextField, ThemeProvider, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { LoginData } from '../../models/login-data';
import { Navigate } from 'react-router-dom';
import storeConfig from '../../config/store-config.json'
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { PATH_ADMIN_ORDERS_LIST, PATH_INDEX } from '../../config/routing';

type LoginFormProps = {
    loginFn: (loginData: LoginData) => Promise<boolean>;
}

const LoginForm: FC<LoginFormProps> = (props) => {

    const [loginData, setLoginData] = useState<LoginData>({email: '', password: ''});
    const [passwordFiledsIsHidden, setPasswordFiledsHiddenStatus] = useState(true);
    const [loginErrMsg, setLoginErrMsg] = useState('');
    const [isValid, setValid] = useState<boolean>(true);
    const theme = createTheme();

    // Activate Login button if user entered email
    useEffect(() => {
        setValid(!!loginData.email);
        setLoginErrMsg('');
    }, [loginData])

    function usernameHandler(event: any) {
        const email = event.target.value;
        loginData.email = email;
        setLoginData({...loginData});
        setPasswordFiledsHiddenStatus(!isAdmin(email));
    }

    function passwordHandler(event: any) {
        const password = event.target.value;
        loginData.password = password;
        setLoginData({...loginData});
    }

    async function loginWithSocialProvider(providerName: string) {
        await props.loginFn({email: providerName, password: ''});
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
            const res: boolean = await props.loginFn(loginData);
            if (!res) {
                setLoginData({email: '', password: ''})
                setLoginErrMsg('Wrong credentials! Try again.');
                setValid(false)
            } else {
                isAdmin(loginData.email) ? <Navigate to={PATH_ADMIN_ORDERS_LIST}/> : <Navigate to={PATH_INDEX}/>;
            }
        } catch (err) {
            setLoginErrMsg('The service is temporarily unavailable.')
        }
      };

    return  (
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
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  BEST PIZZA B7
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%'}}>
                  <TextField value={loginData.email} margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" onChange={usernameHandler} />
                  
                  {/* Show Password Field for admin */}
                  { !passwordFiledsIsHidden 
                    && <TextField value={loginData.password} margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" onChange={passwordHandler} />}
                  
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} color={'success'} disabled={!isValid}> 
                    Sign In
                  </Button>

                  { !!loginErrMsg && <Alert severity="error">{loginErrMsg}</Alert> }
                    <Grid container>
                        <Grid item xs>
                            {storeConfig.socialLoginProviders.map(name => socialButtons.get(name))}
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2" sx={{ color: '#ff6f04' }}>
                                {"Don't have an account? Sign Up!"}
                            </Link>
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
        {'Copyright © '}
        <Link color="inherit" href="http://localhost">
          Best Pizza B7
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }