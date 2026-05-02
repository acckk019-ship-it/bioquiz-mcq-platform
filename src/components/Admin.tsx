import React, { useState } from 'react';
import { QuizData, Subject } from '../types';

interface AdminProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminProps> = ({ onClose }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subject, setSubject] = useState<Subject>('chemistry');
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Incorrect PIN');
    }
  };

  const saveToLocal = (newQuiz: QuizData) => {
    try {
      const existing = localStorage.getItem('custom_quizzes');
      const quizzes: QuizData[] = existing ? JSON.parse(existing) : [];
      quizzes.push({ ...newQuiz, id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, subject });
      localStorage.setItem('custom_quizzes', JSON.stringify(quizzes));
      setMessage('Successfully uploaded and saved!');
      setTimeout(() => window.location.reload(), 1500); // Reload to fetch new data
    } catch (e) {
      setMessage('Error saving quiz: ' + e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          saveToLocal(parsed);
        } catch (err) {
          setMessage('Invalid JSON file format.');
        }
      } else if (file.type === 'text/html' || file.name.endsWith('.html')) {
        saveToLocal({
          id: '',
          title_en: file.name.replace('.html', ''),
          title_ar: file.name.replace('.html', ''),
          type: 'html',
          htmlContent: content,
          questions: []
        });
      } else {
        setMessage('Unsupported file type. Please upload JSON or HTML.');
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="w-full text-center tracking-[0.5em] text-2xl p-4 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            {message && <p className="text-red-400 text-sm">{message}</p>}
            <div className="flex gap-4 mt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg w-full border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times; Close</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="physics">Physics</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".json,.html"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="text-lg font-medium text-white mb-1">Click or drag file to upload</p>
              <p className="text-sm">Supports .json (Quiz Data) or .html (Content)</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${message.includes('Error') || message.includes('Invalid') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
