import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellRing } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useNotifications } from '../hooks/useNotifications';
import { cn } from '../cn';

interface NotificationBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const { unreadCount, hasUnreadNotifications, isLoading } = useNotifications();

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const badgeSize = {
    sm: 'h-4 min-w-[1rem] text-xs px-1',
    md: 'h-5 min-w-[1.25rem] text-xs px-1.5',
    lg: 'h-6 min-w-[1.5rem] text-sm px-2'
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className={className} disabled>
        <Bell className={iconSize[size]} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("relative", className)}
      asChild
    >
      <Link to="/notifications">
        {hasUnreadNotifications ? (
          <BellRing className={cn(iconSize[size], "text-blue-600")} />
        ) : (
          <Bell className={iconSize[size]} />
        )}
        
        {hasUnreadNotifications && (
          <Badge 
            variant="destructive" 
            className={cn(
              "absolute -top-1 -right-1 flex items-center justify-center",
              badgeSize[size]
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default NotificationBadge;
