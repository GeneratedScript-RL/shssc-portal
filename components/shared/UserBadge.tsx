import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface UserBadgeProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserBadge({ userId, size = 'md' }: UserBadgeProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      const { data } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();
      if (isMounted) setUser(data);
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (!user) return null;

  return (
    <div className={`user-badge user-badge-${size}`}>
      <img src={user.avatar_url} alt={user.full_name} className="avatar" />
      <span>{user.full_name}</span>
    </div>
  );
}