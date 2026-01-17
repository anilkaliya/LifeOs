import { X as XIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { format } from 'date-fns';

interface DietDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    log: {
        id: string;
        mealName: string;
        description: string;
        calories: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        date: string;
        createdAt?: string;
    } | null;
}

export function DietDetailModal({ isOpen, onClose, log }: DietDetailModalProps) {
    if (!log) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Meal Details">
            <div className="space-y-4">
                <div>
                    <h3 className="text-2xl font-bold mb-2">{log.mealName}</h3>
                    <p className="text-gray-400 text-sm">{log.description}</p>
                </div>

                <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Nutrition</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Calories</p>
                            <p className="text-lg font-bold text-lime-400">{log.calories}</p>
                        </div>
                        {log.protein && (
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Protein</p>
                                <p className="text-lg font-bold">{log.protein}g</p>
                            </div>
                        )}
                        {log.carbs && (
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Carbs</p>
                                <p className="text-lg font-bold">{log.carbs}g</p>
                            </div>
                        )}
                        {log.fat && (
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Fat</p>
                                <p className="text-lg font-bold">{log.fat}g</p>
                            </div>
                        )}
                    </div>
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
