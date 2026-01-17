import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Modal } from '../ui/Modal';

interface LogLearningModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LogLearningModal({ isOpen, onClose }: LogLearningModalProps) {
    const { addLearningLog } = useStore();
    const [topic, setTopic] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) return;

        const totalMinutes = (Number(hours) || 0) * 60 + (Number(minutes) || 0);
        if (totalMinutes === 0) return;

        await addLearningLog({
            topic,
            durationMinutes: totalMinutes,
            date: new Date().toISOString()
        });

        setTopic('');
        setHours('');
        setMinutes('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log Learning Session">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Topic</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="e.g. React System Design"
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pl-12 text-lg focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-700"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            autoFocus
                        />
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Duration</label>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-center text-lg focus:outline-none focus:border-blue-500/50 transition-colors"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                            />
                            <span className="text-xs text-gray-500 absolute bottom-[-20px] left-0 w-full text-center">Hours</span>
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="0"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-center text-lg focus:outline-none focus:border-blue-500/50 transition-colors"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                            />
                            <span className="text-xs text-gray-500 absolute bottom-[-20px] left-0 w-full text-center">Minutes</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-95"
                    >
                        Save Session
                    </button>
                </div>
            </form>
        </Modal>
    );
}
