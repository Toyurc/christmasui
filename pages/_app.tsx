import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContext } from '../auth.context';
import { useEffect, useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { useRouter } from 'next/router';


const Hydrated = ({ children }: { children?: any }) => {
  const [hydration, setHydration] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHydration(true);
    }
  }, []);
  return hydration ? children : null;
};

function MyApp({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState('');
  const router = useRouter();

  const addUserToken = (myToken: string) => {
    const decoded = jwt.decode(myToken as string);
    if (token !== "" && (decoded as JwtPayload)?.exp as number < Date.now() / 1000) {
      localStorage.removeItem('accessToken');
      router.push('/');
    }
    setToken(myToken)
  }


  useEffect(() => {
    const myToken = localStorage.getItem('accessToken');
    addUserToken(myToken as string)
    if (token !== "" && (jwt.decode(token as string) as JwtPayload)?.exp as number < Date.now() / 1000) {
      localStorage.removeItem('accessToken');
      router.push('/');
    }
  }, [token])

  return (
    <Hydrated>
      <AuthContext.Provider value={{
        accessToken: token as string,
        addToken: (token) => addUserToken(token),
        isAuthenticated: !!token
      }}>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </Hydrated>
  )
}

export default MyApp;
