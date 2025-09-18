import React, { useState } from 'react';
import { useMoodLog } from '../hooks/useMoodLog';
import type { MoodLog } from '../types';
import { MOOD_EMOJIS } from '../constants';
import Toast from './Toast';
import { IconCheckCircle } from '../components/Icons';
import { useTranslation } from '../App';

interface MoodLoggerProps {
    onLogSuccess: (newLog: MoodLog) => void;
}

const MoodLogger: React.FC<MoodLoggerProps> = ({ onLogSuccess }) => {
    const [score, setScore] = useState(5);
    const [emoji, setEmoji] = useState('😐');
    const [notes, setNotes] = useState('');
    const { addMoodLog } = useMoodLog();
    const [showToast, setShowToast] = useState(false);
    const { t } = useTranslation();

    const handleEmojiSelect = (selectedEmoji: string) => {
        setEmoji(selectedEmoji);
    };

    const handleSubmit = () => {
        const newLog = addMoodLog({
            score,
            emoji,
            notes: notes.trim() === '' ? undefined : notes.trim(),
        });
        
        setShowToast(true);
        onLogSuccess(newLog);

        // Reset form
        setScore(5);
        setEmoji('😐');
        setNotes('');
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-center text-slate-800 mb-2">{t('How are you feeling right now?')}</h3>
            <p className="text-center text-slate-600 mb-6">{t('Log your mood to track your wellness journey.')}</p>
            
            {/* Emoji Selector */}
            <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 mb-2 text-center">{t('Select an emoji that fits')}</p>
                <div className="flex justify-center items-center flex-wrap gap-2">
                    {MOOD_EMOJIS.map((e) => (
                        <button
                            key={e}
                            onClick={() => handleEmojiSelect(e)}
                            className={`p-2 rounded-full transition-all duration-200 ease-in-out ${emoji === e ? 'bg-blue-200 scale-125' : 'hover:bg-slate-200 hover:scale-110'}`}
                            aria-pressed={emoji === e}
                            aria-label={`Select emoji ${e}`}
                        >
                            <span className="text-4xl">{e}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Scale Slider */}
            <div className="mb-6">
                <label htmlFor="mood-score" className="block text-sm font-medium text-slate-700 mb-2 text-center">
                    {t('Rate your mood on a scale of 1-10')}
                </label>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">{t('Awful')}</span>
                    <input
                        id="mood-score"
                        type="range"
                        min="1"
                        max="10"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        style={{'--thumb-color': 'var(--color-primary)'} as React.CSSProperties}
                    />
                    <span className="text-sm text-slate-500">{t('Great')}</span>
                </div>
                 <div className="text-center mt-2 font-bold text-lg text-slate-800">{score}</div>
            </div>

            {/* Notes Textarea */}
            <div className="mb-6">
                <label htmlFor="mood-notes" className="block text-sm font-medium text-slate-700 mb-2">{t('Add a note (optional, private)')}</label>
                <textarea
                    id="mood-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('What’s on your mind?')}
                    className="w-full h-24 p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div className="text-center">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 disabled:bg-slate-400 transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                    {t('Save Mood Log')}
                </button>
            </div>
             <Toast
                message={t("Mood logged successfully!")}
                show={showToast}
                onClose={() => setShowToast(false)}
                icon={<IconCheckCircle className="w-6 h-6 text-green-500" />}
            />
        </div>
    );
};

export default MoodLogger;
