import { useState } from 'react';
import { Plus, Dumbbell, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { LogWorkoutModal } from '../modals/LogWorkoutModal';
import { WorkoutDetailModal } from '../modals/WorkoutDetailModal';

export function ExerciseCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const { workoutLogs, deleteWorkoutLog } = useStore();

    return (
        <>
            <div className="p-6 bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl h-full flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Exercise</h3>
                    <div className="bg-purple-400/10 p-2 rounded-lg text-purple-400">
                        <Dumbbell size={20} />
                    </div>
                </div>

                {/* Workout List */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-[280px] pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    {workoutLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                            <p className="text-sm italic">No workouts yet.</p>
                        </div>
                    ) : (
                        workoutLogs.slice().reverse().map(log => (
                            <div
                                key={log.id}
                                className="bg-white/5 p-2.5 rounded-xl border-l-4 border-purple-500 relative group/item cursor-pointer hover:bg-white/10 transition-all"
                                onClick={() => setSelectedLog(log)}
                            >
                                <div className="pr-6">
                                    <p className="font-bold text-base">{log.name}</p>
                                    {log.notes && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{log.notes}</p>}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteWorkoutLog(log.id);
                                    }}
                                    className="absolute top-2.5 right-2.5 text-gray-600 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white/5 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 p-3 rounded-xl flex items-center justify-center transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>

            <LogWorkoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <WorkoutDetailModal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} log={selectedLog} />
        </>
    );
}
