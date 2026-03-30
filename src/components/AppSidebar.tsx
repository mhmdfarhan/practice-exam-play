import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useApp } from '@/contexts/AppContext';
import { BookOpen, LayoutDashboard, FolderOpen, CalendarDays, HelpCircle, BarChart3, History, LogOut } from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const userMenu = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Riwayat Ujian', url: '/history', icon: History },
];

const adminMenu = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Kategori', url: '/admin/categories', icon: FolderOpen },
  { title: 'Periode', url: '/admin/periods', icon: CalendarDays },
  { title: 'Soal', url: '/admin/questions', icon: HelpCircle },
  { title: 'Hasil Ujian', url: '/admin/results', icon: BarChart3 },
];

export function AppSidebar() {
  const { currentUser, logout } = useApp();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const isAdmin = currentUser?.role === 'admin';
  const menu = isAdmin ? adminMenu : userMenu;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          {!collapsed && <span className="font-bold text-lg">CBT Exam</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? 'Admin' : 'Menu'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {!collapsed && currentUser && (
          <div className="text-xs text-muted-foreground mb-2 truncate">
            {currentUser.name} ({currentUser.role})
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && 'Keluar'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
