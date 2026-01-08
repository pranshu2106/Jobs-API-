import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import store from './store';
import { loadUserFromToken } from './store/authSlice';
import { setTheme } from './store/uiSlice';

import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Theme and auth initializer component
const AppInitializer = ({ children }) => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.ui);

    useEffect(() => {
        // Initialize theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            dispatch(setTheme(savedTheme));
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            dispatch(setTheme('dark'));
        }

        // Load user from token if exists
        dispatch(loadUserFromToken());
    }, [dispatch]);

    // Apply theme class to document
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return children;
};

// Main App Routes
const AppRoutes = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <AnimatePresence mode="wait">
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
                />

                {/* Protected Routes with Layout */}
                <Route element={<Layout />}>
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                </Route>

                {/* Redirect root to dashboard or login */}
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppInitializer>
                    <AppRoutes />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: 'var(--toast-bg, #fff)',
                                color: 'var(--toast-color, #1e293b)',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </AppInitializer>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
