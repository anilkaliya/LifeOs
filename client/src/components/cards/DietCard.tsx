import { useState } from 'react';
import { Plus, Utensils, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { LogMealModal } from '../modals/LogMealModal';
import { DietDetailModal } from '../modals/DietDetailModal';

export function DietCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const { dietLogs, deleteDietLog } = useStore();

    const totalCalories = dietLogs.reduce((acc, log) => acc + log.calories, 0);
    const GOAL = 2500; // Hardcoded goal for now
    const progress = Math.min((totalCalories / GOAL) * 100, 100);

    return (
        <>
            <div className="p-6 bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl h-full flex flex-col relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-400">Diet</h3>
                    <div className="bg-lime-400/10 p-2 rounded-lg text-lime-400">
                        <Utensils size={20} />
                    </div>
                </div>

                {/* Calories Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-400">Calories</span>
                        <span>{totalCalories} / {GOAL} kcal</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-lime-500 to-green-500 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Recent Logs List */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-[280px] pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    {dietLogs.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center italic mt-4">No meals logged yet.</p>
                    ) : (
                        dietLogs.slice().reverse().map(log => (
                            <div
                                key={log.id}
                                className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl text-sm group/item cursor-pointer hover:bg-white/10 transition-all"
                                onClick={() => setSelectedLog(log)}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate">{log.mealName}</p>
                                    <p className="text-xs text-gray-400 truncate">{log.description}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-2">
                                    <span className="font-mono text-lime-400 text-sm">{log.calories}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteDietLog(log.id);
                                        }}
                                        className="text-gray-600 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white/5 hover:bg-lime-500/20 text-lime-400 border border-lime-500/30 p-3 rounded-xl flex items-center justify-center transition-all group-hover:border-lime-500/50"
                >
                    <Plus size={24} />
                </button>
            </div>

            <LogMealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <DietDetailModal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} log={selectedLog} />
        </>
    );
}
