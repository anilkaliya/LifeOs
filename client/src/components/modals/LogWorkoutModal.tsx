import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../ui/Modal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function LogWorkoutModal({ isOpen, onClose }: Props) {
    const { addWorkoutLog } = useStore();
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        addWorkoutLog({
            name,
            notes,
            date: new Date().toISOString()
        });

        setName('');
        setNotes('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="LOG WORKOUT">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Workout Name</label>
                    <input
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="e.g. Chest Exercise"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Notes (Optional)</label>
                    <textarea
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500/50 transition-colors h-24 resize-none"
                        placeholder="How did it feel?"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>

                <button className="w-full bg-cyan-500 text-black font-bold p-3 rounded-xl hover:bg-cyan-400 transition-colors">
                    SAVE
                </button>
            </form>
        </Modal>
    );
}
