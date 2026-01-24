import { useState } from 'react';
import { Sparkles, Droplets, Sun, Check, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function SkinCareCard() {
    const { skinCareLog, saveSkinCare } = useStore();
    const [localState, setLocalState] = useState({
        detan: false,
        oiling: false,
        sunscreen: false,
        customRoutine: ''
    });

    // Sync specific fields on mount is handled by store fetching, 
    // but typically we might want to initialize local state from store if needed.
    // However, existing logic seems to use local state for "new" entry toggling and then clears it.
    // Let's stick to that pattern but maybe pre-fill customRoutine if user wants to edit?
    // The current pattern clears state on submit. Let's keep it consistent.

    const handleToggle = (field: 'detan' | 'oiling' | 'sunscreen') => {
        setLocalState(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async () => {
        if (!localState.detan && !localState.oiling && !localState.sunscreen && !localState.customRoutine.trim()) return;

        await saveSkinCare(localState.detan, localState.oiling, localState.sunscreen, localState.customRoutine);
        setLocalState({ detan: false, oiling: false, sunscreen: false, customRoutine: '' });
    };

    const appliedItems = [];
    if (skinCareLog?.detan) appliedItems.push({ icon: Sparkles, label: 'Applied Detan Mask', color: '#f59e0b', key: 'detan' });
    if (skinCareLog?.oiling) appliedItems.push({ icon: Droplets, label: 'Applied Oil', color: '#8b5cf6', key: 'oiling' });
    if (skinCareLog?.sunscreen) appliedItems.push({ icon: Sun, label: 'Applied Sunscreen', color: '#facc15', key: 'sunscreen' });
    if (skinCareLog?.customRoutine) appliedItems.push({ icon: Check, label: skinCareLog.customRoutine, color: '#34d399', key: 'customRoutine' });

    return (
        <div className="p-6 bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full point-events-none" />

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Skin Care</h3>
                <div className="bg-teal-400/10 p-2 rounded-lg text-teal-400">
                    <Sparkles size={20} />
                </div>
            </div>

            {/* Saved Logs at TOP */}
            <div className="mb-3 min-h-[60px] max-h-[150px] overflow-y-auto custom-scrollbar">
                {appliedItems.length > 0 ? (
                    <div className="space-y-2">
                        {appliedItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between gap-2 bg-white/5 p-2 rounded-lg group/item">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <item.icon size={14} style={{ color: item.color }} className="flex-shrink-0" />
                                    <span className="text-sm font-medium truncate">{item.label}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        // Re-save with the item toggled off or cleared
                                        const newState = {
                                            detan: skinCareLog?.detan || false,
                                            oiling: skinCareLog?.oiling || false,
                                            sunscreen: skinCareLog?.sunscreen || false,
                                            customRoutine: skinCareLog?.customRoutine || ''
                                        };
                                        if (item.key === 'detan') newState.detan = false;
                                        else if (item.key === 'oiling') newState.oiling = false;
                                        else if (item.key === 'sunscreen') newState.sunscreen = false;
                                        else if (item.key === 'customRoutine') newState.customRoutine = '';

                                        saveSkinCare(newState.detan, newState.oiling, newState.sunscreen, newState.customRoutine);
                                    }}
                                    className="p-2 -mr-2 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-lg transition-all flex-shrink-0"
                                    title="Remove"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-500 italic text-center py-2">No routine logged today.</p>
                )}
            </div>

            <div className="border-t border-white/10 mb-3" />

            {/* Input Form */}
            <div className="space-y-3 mt-auto">
                <label className="text-xs font-bold text-gray-500 uppercase block">Log Routine</label>

                <div className="space-y-2">
                    {[
                        { key: 'detan', icon: Sparkles, label: 'Detan Mask', color: '#f59e0b' },
                        { key: 'oiling', icon: Droplets, label: 'Oil', color: '#8b5cf6' },
                        { key: 'sunscreen', icon: Sun, label: 'Sunscreen', color: '#facc15' }
                    ].map((item) => (
                        <div
                            key={item.key}
                            onClick={() => handleToggle(item.key as 'detan' | 'oiling' | 'sunscreen')}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={16} style={{ color: item.color }} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${localState[item.key as keyof typeof localState]
                                    ? 'border-transparent bg-teal-500'
                                    : 'border-white/30'
                                    }`}
                            >
                                {localState[item.key as keyof typeof localState] && (
                                    <Check size={14} className="text-white" strokeWidth={3} />
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Custom Routine Input */}
                    <div className="bg-white/5 p-3 rounded-xl">
                        <input
                            type="text"
                            placeholder="Add custom step (e.g., Night Serum)..."
                            value={localState.customRoutine}
                            onChange={(e) => setLocalState(prev => ({ ...prev, customRoutine: e.target.value }))}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-gray-500 p-0"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!localState.detan && !localState.oiling && !localState.sunscreen && !localState.customRoutine.trim()}
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 p-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    SAVE LOG
                </button>
            </div>
        </div>
    );
}
