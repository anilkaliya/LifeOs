import React from 'react';
import { X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { format } from 'date-fns';

interface WorkoutDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    log: {
        id: string;
        name: string;
        notes?: string;
        date: string;
        createdAt?: string;
    } | null;
}

export function WorkoutDetailModal({ isOpen, onClose, log }: WorkoutDetailModalProps) {
    if (!log) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Workout Details">
            <div className="space-y-4">
                <div>
                    <h3 className="text-2xl font-bold mb-2">{log.name}</h3>
                    {log.notes && <p className="text-gray-400">{log.notes}</p>}
                </div>

                {log.createdAt && (
                    <div className="border-t border-white/10 pt-4">
                        <p className="text-xs text-gray-500">Logged at</p>
                        <p className="text-sm font-mono">{format(new Date(log.createdAt), 'PPpp')}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
