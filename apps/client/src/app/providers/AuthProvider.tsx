import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api } from '@/shared/utils/axios';
import SignUpDialog from '@/shared/components/auth/SignUpDialog';
import SignInDialog from '@/shared/components/auth/SignInDialog';

interface User {
  userId: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  signIn: (accessToken: string) => Promise<void>;
  signOut: () => Promise<void>;

  openSignInDialog: () => void;
  openSignUpDialog: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const tokenRef = useRef<string | null>(null);
  const refreshInProgressRef = useRef(false);

  // Request interceptor
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, []);

  // Response interceptor (refresh on 401)
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!refreshInProgressRef.current) {
            refreshInProgressRef.current = true;

            try {
              const refreshResponse = await api.get('/auth/refresh');
              const newToken = refreshResponse.data.accessToken;
              tokenRef.current = newToken;

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            } catch (err) {
              console.error('Token refresh failed', err);
              return Promise.reject(err);
            } finally {
              refreshInProgressRef.current = false;
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  // Restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        refreshInProgressRef.current = true;

        const refreshResponse = await api.get('/auth/refresh');
        const newToken = refreshResponse.data.accessToken;
        tokenRef.current = newToken;

        const meResponse = await api.get<User>('/auth/me');
        setUser(meResponse.data);
      } catch (err) {
        console.warn('Failed to restore session', err);
        tokenRef.current = null;
        setUser(null);
      } finally {
        refreshInProgressRef.current = false;
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (accessToken: string) => {
    tokenRef.current = accessToken;
    try {
      const res = await api.get<User>('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user after signIn', err);
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Failed to log out', err);
    } finally {
      tokenRef.current = null;
      setUser(null);
    }
  };

  const openSignInModal = () => setOpenSignIn(true);
  const openSignUpModal = () => setOpenSignUp(true);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        openSignInDialog: openSignInModal,
        openSignUpDialog: openSignUpModal,
      }}
    >
      {!loading && children}
      {openSignIn && <SignInDialog onClose={() => setOpenSignIn(false)} />}
      {openSignUp && <SignUpDialog onClose={() => setOpenSignUp(false)} />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
