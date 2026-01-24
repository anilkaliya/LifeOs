import React from 'react';
import { LayoutDashboard, Calendar, PieChart, Settings, Menu, LogOut, type LucideProps } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

function UserProfile() {
    const { user, logout } = useStore();

    if (!user) return null;

    return (
        <div className="space-y-2">
            <div className="flex items-center p-3 space-x-3 bg-white/5 rounded-xl">
                {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                    </div>
                )}
                <div className="overflow-hidden transition-all lg:hidden lg:group-hover:block flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
            </div>
            <button
                onClick={logout}
                className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
                <LogOut size={24} />
                <span className="font-medium lg:hidden lg:group-hover:block">Logout</span>
            </button>
        </div>
    );
}

interface NavItemProps {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    label: string;
    active?: boolean;
    onClick?: () => void;
    isOpen?: boolean;
}

const NavItem = ({ icon: Icon, label, active, onClick, isOpen }: NavItemProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all",
                active ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-400 hover:text-white"
            )}
        >
            <Icon size={20} />
            <span className={cn("font-medium", !isOpen && "lg:hidden lg:group-hover:block")}>{label}</span>
        </div>
    );
};

export function Layout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { user } = useStore();

    return (
        <div className="flex min-h-screen bg-background text-white overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <div
                className={cn("fixed inset-0 bg-black/50 z-40 lg:hidden", isOpen ? "block" : "hidden")}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card/50 backdrop-blur-xl border-r border-white/10 p-4 transform transition-transform duration-300 lg:transform-none lg:w-20 lg:hover:w-64 group",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="h-12 flex items-center justify-center mb-8">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-full" />
                    </div>

                    <nav className="flex-1 space-y-2">
                        <NavItem icon={LayoutDashboard} label="Dashboard" active={window.location.pathname === '/'} onClick={() => window.location.href = '/'} isOpen={isOpen} />
                        <NavItem icon={PieChart} label="Analytics" active={window.location.pathname === '/analytics'} onClick={() => window.location.href = '/analytics'} isOpen={isOpen} />
                        <NavItem icon={Calendar} label="History" isOpen={isOpen} />
                        <NavItem icon={Settings} label="Settings" isOpen={isOpen} />
                    </nav>

                    <div className="mt-auto">
                        <UserProfile />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto">
                <header className="h-16 flex items-center justify-between px-6 lg:hidden">
                    <button onClick={() => setIsOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <span className="font-bold">Good Morning</span>
                    <div className="w-8" />
                </header>

                <div className="p-6 max-w-7xl mx-auto">
                    <header className="hidden lg:flex flex-col mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Good Morning, {user?.name || 'User'}
                        </h1>
                        <p className="text-gray-400 mt-1">Ready to track your day?</p>
                    </header>
                    {children}
                </div>
            </main>
        </div>
    );
}
