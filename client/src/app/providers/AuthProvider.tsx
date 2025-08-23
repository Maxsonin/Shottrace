import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { api } from '@/shared/utils/axios';

type AuthContext = {
  token: string | null;
  user: any;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);
  const refreshAttemptedRef = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      console.log('[AuthProvider] Initializing auth...');
      try {
        const userResponse = await api.get('/auth/me');
        console.log('[AuthProvider] /auth/me success:', userResponse.data);

        setUser(userResponse.data);
      } catch (err) {
        setToken(null);
        setUser(null);
      } finally {
        console.log('[AuthProvider] Initial auth check finished');
        if (!refreshAttemptedRef.current) {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.log('[AuthProvider] No token found, setting user to null');
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get('/auth/me');
        console.log('[AuthProvider] /auth/me success with token:', res.data);

        setUser(res.data);
      } catch (err) {
        console.warn(
          '[AuthProvider] Failed fetching user with token, clearing token and user',
          err
        );
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      if (tokenRef.current && !config._retry) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
        console.log('[AuthProvider] Attaching access token to request');
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, []);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (err) => {
        const originalRequest = err.config;

        if (originalRequest.url === '/auth/refresh') {
          console.warn('[AuthProvider] Refresh token failed, logging out');
          setToken(null);
          setUser(null);
          setLoading(false);
          return Promise.reject(err);
        }

        if (
          err.response?.status === 401 &&
          err.response?.data?.message === 'Unauthorized' &&
          !originalRequest._retry
        ) {
          console.log(
            '[AuthProvider] 401 Unauthorized, attempting refresh token'
          );
          originalRequest._retry = true;
          refreshAttemptedRef.current = true;

          try {
            const response = await api.get('/auth/refresh');
            console.log('[AuthProvider] Refresh token success:', response.data);

            setToken(response.data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            console.log(
              '[AuthProvider] Retrying original request with new token'
            );

            return api(originalRequest);
          } catch (error) {
            console.error(
              '[AuthProvider] Refresh token failed, logging out',
              error
            );
            setToken(null);
            setUser(null);
            setLoading(false);
            return Promise.reject(error);
          } finally {
            console.log('[AuthProvider] Refresh attempt finished');
            setLoading(false);
          }
        }

        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
