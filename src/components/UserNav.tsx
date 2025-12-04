'use client';

import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, User, Settings } from 'lucide-react';
import Link from 'next/link';

export function UserNav() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />;
  }

  if (!user) {
    return (
      <Button asChild className="bg-brand-red-600 hover:bg-brand-red-700 text-white">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  const userInitials = user.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-brand-red-50">
          <Avatar className="h-8 w-8 border-2 border-brand-red-600">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-brand-red-100 text-brand-red-600">{userInitials || <User />}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-brand-red-200" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900">{user.displayName}</p>
            <p className="text-xs leading-none text-gray-600">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-brand-red-100" />
        <DropdownMenuItem asChild className="focus:bg-brand-red-50 focus:text-brand-red-600 cursor-pointer">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-brand-red-100" />
        <DropdownMenuItem onClick={logout} className="focus:bg-brand-red-50 focus:text-brand-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
