import { Routes, Route, Navigate } from 'react-router-dom';
import AuthWrapper from '@/modules/AuthModule/AuthWrapper';
import ForgetPassword from '@/pages/ForgetPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

import Landing from '@/pages/Landing';

export default function AuthRouter() {
  return (
    <Routes>
      <Route element={<Landing />} path="/" />
      <Route element={<Landing />} path="/landing" />
      <Route element={<AuthWrapper />} path="/login" />
      <Route element={<AuthWrapper />} path="/register" />
      <Route element={<AuthWrapper />} path="/signup" />
      <Route element={<Navigate to="/login" replace />} path="/logout" />
      <Route element={<ForgetPassword />} path="/forgetpassword" />
      <Route element={<ResetPassword />} path="/resetpassword/:userId/:resetToken" />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
