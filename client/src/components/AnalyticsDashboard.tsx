import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { DietLog, WorkoutLog, LearningLog, SkinCareLog } from '../store/useStore';
import { format, subDays } from 'date-fns';
import { Search, Activity, BookOpen, Sparkles, Utensils, Dumbbell } from 'lucide-react';

export function AnalyticsDashboard() {
    const { fetchAnalytics, analyticsData } = useStore();
    const [dateRange, setDateRange] = useState('7days'); // 7days, 30days, custom
    const [search, setSearch] = useState('');
    const [customStart, setCustomStart] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    const [customEnd, setCustomEnd] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        // Calculate date range
        const end = new Date();
        let start = new Date();
        let startDateStr = '';
        let endDateStr = '';

        if (dateRange === '7days') {
            start = subDays(end, 7);
            startDateStr = format(start, 'yyyy-MM-dd');
            endDateStr = format(end, 'yyyy-MM-dd');
        } else if (dateRange === '30days') {
            start = subDays(end, 30);
            startDateStr = format(start, 'yyyy-MM-dd');
            endDateStr = format(end, 'yyyy-MM-dd');
        } else if (dateRange === 'custom') {
            startDateStr = customStart;
            endDateStr = customEnd;
        }

        const timeoutId = setTimeout(() => {
            if (startDateStr && endDateStr) {
                fetchAnalytics(startDateStr, endDateStr, search);
            }
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [dateRange, search, fetchAnalytics, customStart, customEnd]);

    if (!analyticsData) return <div className="text-white p-10">Loading analytics...</div>;

    const { totals, logs } = analyticsData;

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
                    {dateRange === 'custom' && (
                        <div className="flex gap-2 items-center">
                            <input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    )}
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="custom">Custom Range</option>
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
                            {logs.length > 0 ? logs.map((log, i) => {
                                let Icon = Activity;
                                let color = "text-gray-400";
                                let title = "";
                                let sub = "";
                                let metric = "";

                                // Type guard helpers or manual checks
                                if ('mealName' in log) { // DietLog
                                    const dietLog = log as DietLog;
                                    Icon = Utensils;
                                    color = "text-lime-400";
                                    title = dietLog.mealName;
                                    sub = dietLog.description;
                                    metric = `${dietLog.calories} kcal`;
                                } else if ('name' in log) { // WorkoutLog
                                    const workoutLog = log as WorkoutLog;
                                    Icon = Dumbbell;
                                    color = "text-purple-400";
                                    title = workoutLog.name;
                                    sub = workoutLog.notes || '';
                                    metric = "Workout";
                                } else if ('topic' in log) { // LearningLog
                                    const learningLog = log as LearningLog;
                                    Icon = BookOpen;
                                    color = "text-blue-400";
                                    title = learningLog.topic;
                                    sub = "";
                                    metric = `${learningLog.durationMinutes} min`;
                                } else if ('sunscreen' in log) { // SkinCareLog
                                    const skinLog = log as SkinCareLog;
                                    Icon = Sparkles;
                                    color = "text-emerald-400";
                                    title = "Skincare Routine";
                                    sub = [skinLog.detan && 'Detan', skinLog.oiling && 'Oil', skinLog.sunscreen && 'SPF', skinLog.customRoutine].filter(Boolean).join(', ');
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
