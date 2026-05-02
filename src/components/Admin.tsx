import React, { useState, useEffect } from 'react';
import { QuizData, Subject } from '../types';
import { allQuizzes as staticQuizzes } from '../data';

interface AdminProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminProps> = ({ onClose }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subject, setSubject] = useState<Subject>('chemistry');
  const [message, setMessage] = useState('');
  
  const [quizzes, setQuizzes] = useState<QuizData[]>(staticQuizzes);
  const [editingQuiz, setEditingQuiz] = useState<QuizData | null>(null);
  const [editJsonStr, setEditJsonStr] = useState('');
  
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (isLocalhost && isAuthenticated) {
      fetch('/api/quizzes')
        .then(res => res.json())
        .then(data => setQuizzes(data))
        .catch(err => console.error('Failed to fetch from local API', err));
    }
  }, [isLocalhost, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Incorrect PIN');
    }
  };

  const saveToServer = async (updatedQuizzes: QuizData[]) => {
    if (!isLocalhost) {
      setMessage('Error: You can only save changes when running locally (npm run dev).');
      return;
    }
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuizzes)
      });
      if (res.ok) {
        setQuizzes(updatedQuizzes);
        setMessage('Changes saved successfully!');
      } else {
        setMessage('Failed to save to server.');
      }
    } catch (e) {
      setMessage('Error saving to server: ' + e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      let newQuiz: QuizData;
      
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        try {
          newQuiz = JSON.parse(content);
          newQuiz.subject = subject;
          if (!newQuiz.id) newQuiz.id = `custom_${Date.now()}`;
        } catch (err) {
          setMessage('Invalid JSON file format.');
          return;
        }
      } else if (file.type === 'text/html' || file.name.endsWith('.html')) {
        newQuiz = {
          id: `html_${Date.now()}`,
          title_en: file.name.replace('.html', ''),
          title_ar: file.name.replace('.html', ''),
          type: 'html',
          htmlContent: content,
          subject,
          questions: []
        };
      } else {
        setMessage('Unsupported file type. Please upload JSON or HTML.');
        return;
      }
      
      const newQuizzes = [...quizzes, newQuiz];
      saveToServer(newQuizzes);
    };
    reader.readAsText(file);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      const newQuizzes = quizzes.filter(q => q.id !== id);
      saveToServer(newQuizzes);
    }
  };

  const openEditor = (quiz: QuizData) => {
    setEditingQuiz(quiz);
    setEditJsonStr(JSON.stringify(quiz, null, 2));
  };

  const saveEdit = () => {
    try {
      const parsed = JSON.parse(editJsonStr);
      const newQuizzes = quizzes.map(q => q.id === parsed.id ? parsed : q);
      saveToServer(newQuizzes);
      setEditingQuiz(null);
    } catch (e) {
      setMessage('Invalid JSON in editor.');
    }
  };

  const handlePublish = async () => {
    if (!isLocalhost) return;
    if (!confirm('This will build and deploy the current quizzes to the live website. Continue?')) return;
    
    setMessage('Publishing... Please wait.');
    try {
      const res = await fetch('/api/publish', { method: 'POST' });
      if (res.ok) {
        setMessage('Successfully published to live website!');
      } else {
        setMessage('Publish failed. Check terminal for details.');
      }
    } catch (e) {
      setMessage('Publish error: ' + e);
    }
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
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <div className="flex gap-4">
            {isLocalhost && (
              <button onClick={handlePublish} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors font-bold">
                Publish Live
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white">&times; Close</button>
          </div>
        </div>

        {!isLocalhost && (
          <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 p-4 rounded-lg mb-6">
            <strong>Warning:</strong> You are viewing the live website. To edit or publish quizzes, you must run the app locally on your computer.
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.includes('Error') || message.includes('failed') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {message}
          </div>
        )}

        {editingQuiz ? (
          <div className="space-y-4">
            <h3 className="text-xl text-white">Edit Quiz Data</h3>
            <textarea
              className="w-full h-96 p-4 bg-slate-900 text-slate-300 font-mono text-sm rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none"
              value={editJsonStr}
              onChange={(e) => setEditJsonStr(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setEditingQuiz(null)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500">Save Changes</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Upload New</h3>
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
                  disabled={!isLocalhost}
                />
                <div className="text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <p className="text-lg font-medium text-white mb-1">Click or drag file</p>
                  <p className="text-sm">Supports .json or .html</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Manage Content</h3>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {quizzes.map(quiz => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{quiz.title_en}</div>
                      <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{quiz.subject} • {quiz.type || 'quiz'}</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditor(quiz)}
                        disabled={!isLocalhost}
                        className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 text-sm disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(quiz.id)}
                        disabled={!isLocalhost}
                        className="px-3 py-1 bg-red-900/50 text-red-400 rounded hover:bg-red-900/80 text-sm disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {quizzes.length === 0 && <p className="text-slate-400 text-sm">No quizzes found.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
