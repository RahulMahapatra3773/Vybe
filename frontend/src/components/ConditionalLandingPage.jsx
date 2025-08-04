import { useSelector } from 'react-redux';
import ProtectedRoutes from './ProtectedRoutes';
import MainLayout from './MainLayout';
import LandingPage from './LandingPage';

export default function ConditionalLandingPage() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <LandingPage />;
  }

  return (
    <ProtectedRoutes>
      <MainLayout />
    </ProtectedRoutes>
  );
}
