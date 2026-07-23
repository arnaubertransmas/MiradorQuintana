'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getRole, dashboardPathForRole } from '@/lib/auth';

export default function RequireAuth({ role, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    const currentRole = getRole();
    if (role && currentRole !== role) {
      router.replace(dashboardPathForRole(currentRole));
      return;
    }

    setReady(true);
  }, [router, role]);

  if (!ready) {
    return null;
  }

  return children;
}
