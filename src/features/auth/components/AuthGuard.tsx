import { useAtomValue } from 'jotai';
import { Navigate, useLocation } from 'react-router-dom';
import { authAtom } from '../stores/authStore.ts';
import { ROUTES } from '@/shared/constants/routes.ts';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const auth = useAtomValue(authAtom);
  const location = useLocation();

  if (!auth) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
