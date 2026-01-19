import { useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { isSameDay, parseISO } from 'date-fns';
import { LogLearningModal } from '../modals/LogLearningModal';
import { LearningDetailModal } from '../modals/LearningDetailModal';

export function LearningCard() {
    const { learningLogs, deleteLearningLog, selectedDate } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);

    // Filter logs for the selected date
    const todaysLogs = Array.isArray(learningLogs) ? learningLogs.filter(log => isSameDay(parseISO(log.date), selectedDate)) : [];

    return (
        <>
            <div className="p-6 bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl h-full flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full point-events-none" />

                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Learning</h3>
                    <div className="bg-blue-400/10 p-2 rounded-lg text-blue-400">
                        <BookOpen size={20} />
                    </div>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2 scrollbar-thin scrollbar-thumb-white/10 min-h-[100px] max-h-[280px]">
                    {todaysLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                            <p className="text-sm italic">No sessions yet.</p>
                        </div>
                    ) : (
                        todaysLogs.slice().reverse().map(log => (
                            <div
                                key={log.id}
                                className="bg-white/5 p-2.5 rounded-xl border-l-4 border-blue-500 relative group/item cursor-pointer hover:bg-white/10 transition-all"
                                onClick={() => setSelectedLog(log)}
                            >
                                <div className="pr-6">
                                    <p className="font-bold text-base">{log.topic}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {Math.floor(log.durationMinutes / 60)}h {log.durationMinutes % 60}m
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteLearningLog(log.id);
                                    }}
                                    className="absolute top-1 right-1 p-2 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-lg transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white/5 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 p-3 rounded-xl flex items-center justify-center transition-all group-hover:border-blue-500/50"
                >
                    <Plus size={24} />
                </button>
            </div>

            <LogLearningModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <LearningDetailModal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} log={selectedLog} />
        </>
    );
}
