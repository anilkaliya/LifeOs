import { useEffect } from 'react';
import { LearningCard } from './cards/LearningCard';
import { SkinCareCard } from './cards/SkinCareCard';
import { DietCard } from './cards/DietCard';
import { ExerciseCard } from './cards/ExerciseCard';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

export function Dashboard() {
    const { selectedDate, fetchData } = useStore();

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate, fetchData]);

    return (
        <div className="space-y-8">
            {/* Date Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {format(selectedDate, 'EEEE, MMM do')}
                </h2>
            </div>

            {/* Vertical Card List */}
            <div className="flex flex-col gap-6">
                {/* Learning Card */}
                <div className="w-full">
                    <LearningCard />
                </div>

                {/* Exercise Card */}
                <div className="w-full">
                    <ExerciseCard />
                </div>

                {/* Skin Care Card */}
                <div className="w-full">
                    <SkinCareCard />
                </div>

                {/* Diet Card */}
                <div className="w-full">
                    <DietCard />
                </div>
            </div>
        </div>
    );
}
