import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { format, subDays } from 'date-fns';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { Search, Activity, BookOpen, Sparkles, Utensils, Dumbbell } from 'lucide-react';

export function AnalyticsDashboard() {
    const { fetchAnalytics, analyticsData } = useStore();
    const [dateRange, setDateRange] = useState('7days'); // 7days, 30days
    const [search, setSearch] = useState('');

    // Calculate date range
    const getDates = () => {
        const end = new Date();
        let start = new Date();
        if (dateRange === '7days') start = subDays(end, 7);
        if (dateRange === '30days') start = subDays(end, 30);
        return {
            startDate: format(start, 'yyyy-MM-dd'),
            endDate: format(end, 'yyyy-MM-dd')
        };
    };

    useEffect(() => {
        const { startDate, endDate } = getDates();
        const timeoutId = setTimeout(() => {
            fetchAnalytics(startDate, endDate, search);
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [dateRange, search, fetchAnalytics]);

    if (!analyticsData) return <div className="text-white p-10">Loading analytics...</div>;

    const { totals, chartData, logs } = analyticsData;

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 border border-white/10 p-3 rounded-lg shadow-xl">
                    <p className="text-white font-bold mb-1">{format(new Date(label), 'MMM do, yyyy')}</p>
                    {payload.map((p: any, index: number) => (
                        <p key={index} style={{ color: p.color }} className="text-sm">
                            {p.name}: {p.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Analytics & Reports
                    </h1>
                    <p className="text-gray-400 text-sm">Visualize your life metrics and progress</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 w-full sm:w-64 transition-all"
                        />
                    </div>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-lime-500/10 blur-[60px] rounded-full pointer-events-none" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-lime-500/10 rounded-lg text-lime-400"><Utensils size={18} /></div>
                        <p className="text-gray-400 text-sm font-medium">Avg Calories</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {totals.calories > 0 ? Math.round(totals.calories / (dateRange === '7days' ? 7 : 30)) : 0}
                        <span className="text-sm text-gray-500 ml-1 font-normal">kcal/day</span>
                    </p>
                    <p className="text-xs text-lime-400/80 mt-1">Total: {totals.calories} kcal</p>
                </div>

                <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Dumbbell size={18} /></div>
                        <p className="text-gray-400 text-sm font-medium">Workouts</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {totals.workouts}
                        <span className="text-sm text-gray-500 ml-1 font-normal">sessions</span>
                    </p>
                </div>

                <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><BookOpen size={18} /></div>
                        <p className="text-gray-400 text-sm font-medium">Learning</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {(totals.learningMinutes / 60).toFixed(1)}
                        <span className="text-sm text-gray-500 ml-1 font-normal">hours</span>
                    </p>
                </div>

                <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Sparkles size={18} /></div>
                        <p className="text-gray-400 text-sm font-medium">Skincare</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {totals.skincareDays}
                        <span className="text-sm text-gray-500 ml-1 font-normal">days logged</span>
                    </p>
                </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calories & Learning Chart */}
                <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Activity Trends</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLearning" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(val) => format(new Date(val), 'dd MMM')} />
                                <YAxis yAxisId="left" stroke="#84cc16" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area yAxisId="left" type="monotone" dataKey="calories" name="Calories" stroke="#84cc16" fillOpacity={1} fill="url(#colorCalories)" />
                                <Area yAxisId="right" type="monotone" dataKey="learningMinutes" name="Learning (min)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLearning)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Workout Activity */}
                <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Workout Frequency</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(val) => format(new Date(val), 'dd MMM')} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="workoutCount" name="Workouts" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Activity Log */}
            <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Activity History</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm">
                                <th className="pb-3 pl-2">Type</th>
                                <th className="pb-3">Details</th>
                                <th className="pb-3">Metric</th>
                                <th className="pb-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.length > 0 ? logs.map((log: any, i: number) => {
                                let Icon = Activity;
                                let color = "text-gray-400";
                                let title = "";
                                let sub = "";
                                let metric = "";

                                if (log.type === 'meal') {
                                    Icon = Utensils;
                                    color = "text-lime-400";
                                    title = log.mealName;
                                    sub = log.description;
                                    metric = `${log.calories} kcal`;
                                } else if (log.type === 'workout') {
                                    Icon = Dumbbell;
                                    color = "text-purple-400";
                                    title = log.name;
                                    sub = log.notes;
                                    metric = "Workout";
                                } else if (log.type === 'learning') {
                                    Icon = BookOpen;
                                    color = "text-blue-400";
                                    title = log.topic;
                                    sub = "";
                                    metric = `${log.durationMinutes} min`;
                                } else if (log.type === 'skincare') {
                                    Icon = Sparkles;
                                    color = "text-emerald-400";
                                    title = "Skincare Routine";
                                    sub = [log.detan && 'Detan', log.oiling && 'Oil', log.sunscreen && 'SPF', log.customRoutine].filter(Boolean).join(', ');
                                    metric = "Logged";
                                }

                                return (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-2">
                                            <div className={`p-2 rounded-lg bg-white/5 border border-white/5 w-fit ${color}`}>
                                                <Icon size={18} />
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <p className="font-bold text-white text-sm">{title}</p>
                                            {sub && <p className="text-xs text-gray-500 truncate max-w-[200px]">{sub}</p>}
                                        </td>
                                        <td className="py-3 text-sm text-gray-300 font-mono">{metric}</td>
                                        <td className="py-3 text-sm text-gray-500">{format(new Date(log.date), 'MMM do')}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500 italic">No activity found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
