import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { authAtom } from '@/features/auth/stores/authStore.ts';
import { LoginPage } from '@/features/auth/pages/LoginPage.tsx';
import { ProductsPage } from '@/features/product/pages/ProductsPage.tsx';
import { ROUTES } from '@/shared/constants/routes.ts';

function LoginRedirect() {
  const auth = useAtomValue(authAtom);
  return auth ? <Navigate to={ROUTES.PRODUCTS} replace /> : <LoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.PRODUCTS} replace />} />
        <Route path={ROUTES.LOGIN} element={<LoginRedirect />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
