import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../ui/Modal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function LogMealModal({ isOpen, onClose }: Props) {
    const { addDietLog } = useStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [calories, setCalories] = useState('');

    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addDietLog({
            mealName: name,
            description,
            calories: Number(calories) || 0,
            protein: protein ? Number(protein) : undefined,
            carbs: carbs ? Number(carbs) : undefined,
            fat: fat ? Number(fat) : undefined,
            date: new Date().toISOString()
        });

        // Reset
        setName('');
        setDescription('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="LOG MEAL">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Meal Name</label>
                    <input
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-green-500/50 transition-colors"
                        placeholder="e.g. Oatmeal & Berries"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Description</label>
                    <textarea
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-green-500/50 transition-colors h-24 resize-none"
                        placeholder="Add ingredients, notes, etc."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Calories</label>
                    <div className="relative">
                        <input
                            type="number"
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-green-500/50 transition-colors pr-12"
                            placeholder="0"
                            value={calories}
                            onChange={e => setCalories(e.target.value)}
                            required
                        />
                        <span className="absolute right-4 top-3 text-gray-500 text-sm">kcal</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500 block">Macros (Optional)</label>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-2 text-sm text-center focus:border-green-500/50 focus:outline-none"
                                placeholder="?"
                                value={carbs}
                                onChange={e => setCarbs(e.target.value)}
                            />
                            <span className="text-[10px] text-gray-500 absolute bottom-[-18px] left-0 w-full text-center">Carbs (g)</span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-2 text-sm text-center focus:border-green-500/50 focus:outline-none"
                                placeholder="?"
                                value={protein}
                                onChange={e => setProtein(e.target.value)}
                            />
                            <span className="text-[10px] text-gray-500 absolute bottom-[-18px] left-0 w-full text-center">Protein (g)</span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-2 text-sm text-center focus:border-green-500/50 focus:outline-none"
                                placeholder="?"
                                value={fat}
                                onChange={e => setFat(e.target.value)}
                            />
                            <span className="text-[10px] text-gray-500 absolute bottom-[-18px] left-0 w-full text-center">Fat (g)</span>
                        </div>
                    </div>
                </div>

                <button className="w-full mt-6 bg-lime-500 text-black font-bold p-3 rounded-xl hover:bg-lime-400 transition-colors">
                    SAVE
                </button>
            </form>
        </Modal>
    );
}
