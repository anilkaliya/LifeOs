import React from 'react';
import { X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { format } from 'date-fns';

interface LearningDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    log: {
        id: string;
        topic: string;
        durationMinutes: number;
        date: string;
        createdAt?: string;
    } | null;
}

export function LearningDetailModal({ isOpen, onClose, log }: LearningDetailModalProps) {
    if (!log) return null;

    const hours = Math.floor(log.durationMinutes / 60);
    const minutes = log.durationMinutes % 60;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Learning Session Details">
            <div className="space-y-4">
                <div>
                    <h3 className="text-2xl font-bold mb-2">{log.topic}</h3>
                </div>

                <div className="border-t border-white/10 pt-4">
                    <p className="text-xs text-gray-500 mb-2">Duration</p>
                    <p className="text-lg font-bold text-blue-400">
                        {hours > 0 && `${hours} hour${hours > 1 ? 's' : ''} `}
                        {minutes} minute{minutes !== 1 ? 's' : ''}
                    </p>
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
