import React from 'react';
import { useMoodLog } from '../hooks/useMoodLog';
import { IconJournal, IconChartBar } from '../components/Icons';
import MoodChart from '../components/MoodChart';

const MoodLogHistory: React.FC = () => {
  const { moodLogs } = useMoodLog();
  
  // Sort logs from newest to oldest for display, but oldest to newest for chart
  const sortedLogsForDisplay = [...moodLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const sortedLogsForChart = [...moodLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl flex items-center justify-center gap-4">
            <IconChartBar className="w-10 h-10" />
            Mood History
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Review your past entries to reflect on your journey and identify patterns.
        </p>
      </div>

      {sortedLogsForChart.length > 1 ? (
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Mood Trend</h2>
              <MoodChart data={sortedLogsForChart} />
          </div>
      ) : null}

      <div className="space-y-6">
        {sortedLogsForDisplay.length > 0 ? (
          sortedLogsForDisplay.map(log => (
            <div key={log.id} className="bg-white shadow-md rounded-lg p-6 flex items-start gap-6">
              <div className="text-5xl">{log.emoji}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-xl font-bold text-slate-800">Mood Score: {log.score}/10</p>
                  <p className="text-sm text-slate-500 text-right">
                    {new Date(log.timestamp).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                {log.notes && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-700 whitespace-pre-wrap">{log.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center bg-white shadow-md rounded-lg p-12">
            <IconJournal className="w-16 h-16 mx-auto text-slate-400" />
            <h2 className="mt-4 text-2xl font-bold text-slate-800">No Moods Logged Yet</h2>
            <p className="mt-2 text-slate-600">Start logging your mood on the dashboard to see your history here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodLogHistory;