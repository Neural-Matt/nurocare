import { Home, ShieldCheck, FileText, User, MapPin, type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Primary consumer-app destinations — shared by BottomNav (mobile) and Sidebar (tablet/desktop). */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home',      href: '/dashboard',  icon: Home        },
  { label: 'Plans',     href: '/plans',      icon: ShieldCheck },
  { label: 'Claims',    href: '/claims',     icon: FileText    },
  { label: 'Find Care', href: '/facilities', icon: MapPin      },
  { label: 'Profile',   href: '/profile',    icon: User        },
];

export function isNavItemActive(href: string, pathname: string): boolean {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
}
