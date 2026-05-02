import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Languages, 
  Moon, 
  Sun, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Brain,
  FileText,
  Volume2,
  Home,
  Play,
  Pause,
  Eye,
  Settings
} from 'lucide-react';
import { allQuizzes, knowledgeGapsData } from '../data';
import { QuizData, Question, GapsData, Subject } from '../types';
import { AdminDashboard } from './Admin';

export default function QuizPlatform() {
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [view, setView] = useState<'home' | 'quiz' | 'gaps' | 'notes' | 'explanations' | 'html'>('home');
  const [selectedGapTopic, setSelectedGapTopic] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');

  const isRtl = lang === 'ar';

  const speak = (text: string, language: 'en' | 'ar') => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get all available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find the best voice for the language
      // For Arabic, look for 'ar-SA', 'ar-EG', etc.
      // For English, look for 'en-US', 'en-GB', etc.
      let voice = voices.find(v => v.lang === (language === 'ar' ? 'ar-SA' : 'en-US'));
      
      // Fallback to any voice starting with the language code
      if (!voice) {
        voice = voices.find(v => v.lang.startsWith(language === 'ar' ? 'ar' : 'en'));
      }
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const startQuiz = (quiz: QuizData) => {
    setCurrentQuiz(quiz);
    if (quiz.type === 'html') {
      setView('html');
      return;
    }
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setIsFinished(false);
    setView('quiz');
  };

  const startExplanations = (quiz: QuizData) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIdx(0);
    setIsAutoplay(false);
    setView('explanations');
  };

  useEffect(() => {
    let timer: any;
    if (view === 'explanations' && isAutoplay && !isSpeaking) {
      timer = setTimeout(() => {
        if (currentQuiz && currentQuestionIdx < currentQuiz.questions.length - 1) {
          setCurrentQuestionIdx(i => i + 1);
        } else {
          setIsAutoplay(false);
        }
      }, 1500); // Small delay after speaking ends
    }
    return () => clearTimeout(timer);
  }, [isAutoplay, isSpeaking, view, currentQuestionIdx, currentQuiz]);

  useEffect(() => {
    if (view === 'explanations' && isAutoplay) {
      const q = currentQuiz?.questions[currentQuestionIdx];
      if (q) {
        const questionLabel = lang === 'en' ? 'Question' : 'السؤال';
        const explanationLabel = lang === 'en' ? 'Explanation' : 'الشرح';
        const questionText = lang === 'en' ? q.question_en : q.question_ar;
        const explanationText = lang === 'en' ? q.explanation.en : q.explanation.ar;
        
        const fullText = `${questionLabel}: ${questionText}. ${explanationLabel}: ${explanationText}`;
        speak(fullText, lang);
      }
    }
  }, [currentQuestionIdx, isAutoplay, view]);

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQuiz?.questions[currentQuestionIdx].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (!currentQuiz) return;
    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx(i => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="p-2 bg-emerald-600 rounded-lg">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">BioQuiz</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2"
              >
                <Languages className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{lang}</span>
              </button>
              
              <button 
                onClick={() => setShowAdmin(true)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold uppercase">{lang === 'en' ? 'Admin' : 'مسؤول'}</span>
              </button>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                  {lang === 'en' ? 'Master Biology & Chemistry' : 'أتقن الأحياء والكيمياء'}
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                  {lang === 'en' 
                    ? 'Comprehensive MCQ platform for students.' 
                    : 'منصة شاملة لأسئلة الاختيار من متعدد للطلاب.'}
                </p>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {(['all', 'chemistry', 'biology', 'physics'] as const).map(subj => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-colors border-2 ${
                      selectedSubject === subj
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allQuizzes.filter(q => selectedSubject === 'all' || q.subject === selectedSubject).map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
                        <FileText className="text-emerald-600 w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {lang === 'en' ? quiz.title_en : quiz.title_ar}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8">
                        {lang === 'en' ? 'Questions' : 'سؤال'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => startQuiz(quiz)}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                      >
                        {lang === 'en' ? 'Start Quiz' : 'ابدأ الاختبار'}
                        <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                      <button 
                        onClick={() => startExplanations(quiz)}
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        {lang === 'en' ? 'Study Mode' : 'وضع الدراسة'}
                      </button>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-indigo-600 p-8 rounded-3xl shadow-xl flex flex-col justify-between text-white"
                >
                  <div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                      <Brain className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {lang === 'en' ? 'Knowledge Map' : 'خريطة المعرفة'}
                    </h3>
                    <p className="text-indigo-100 mb-8">
                      {lang === 'en' ? 'Visualize your learning gaps' : 'تصور فجواتك التعليمية'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setView('gaps')}
                    className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {lang === 'en' ? 'Explore Map' : 'استكشف الخريطة'}
                    <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {view === 'quiz' && currentQuiz && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto"
            >
              {!isFinished ? (
                <div className={`bg-white dark:bg-slate-900 p-6 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 ${isRtl ? 'rtl' : ''}`}>
                    <div className="flex justify-between items-center mb-12">
                      <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest">
                        {lang === 'en' ? `Question ${currentQuestionIdx + 1} / ${currentQuiz.questions.length}` : `السؤال ${currentQuestionIdx + 1} / ${currentQuiz.questions.length}`}
                      </span>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => speak(lang === 'en' ? currentQuiz.questions[currentQuestionIdx].question_en : currentQuiz.questions[currentQuestionIdx].question_ar, lang)}
                          className={`p-2 rounded-full transition-colors ${isSpeaking ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => setView('home')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <Home className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-10 leading-tight">
                    {lang === 'en' ? currentQuiz.questions[currentQuestionIdx].question_en : currentQuiz.questions[currentQuestionIdx].question_ar}
                  </h2>

                  <div className="grid gap-4">
                    {(lang === 'en' ? currentQuiz.questions[currentQuestionIdx].options_en : currentQuiz.questions[currentQuestionIdx].options_ar).map((option, idx) => {
                      const isCorrect = idx === currentQuiz.questions[currentQuestionIdx].correctIndex;
                      const isSelected = selectedOption === idx;
                      
                      let btnClass = "w-full text-left p-6 rounded-2xl border-2 transition-all font-bold flex justify-between items-center ";
                      if (selectedOption === null) {
                        btnClass += "border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300";
                      } else if (isCorrect) {
                        btnClass += "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30";
                      } else if (isSelected && !isCorrect) {
                        btnClass += "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30";
                      } else {
                        btnClass += "border-slate-100 dark:border-slate-800 opacity-50 text-slate-400 dark:text-slate-600";
                      }

                      return (
                        <button 
                          key={idx}
                          disabled={selectedOption !== null}
                          onClick={() => handleOptionSelect(idx)}
                          className={btnClass}
                        >
                          <span>{option}</span>
                          {selectedOption !== null && (
                            isCorrect ? <CheckCircle2 className="w-6 h-6" /> : isSelected ? <XCircle className="w-6 h-6" /> : null
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-10 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-l-4 border-emerald-500"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-emerald-800 dark:text-emerald-400 uppercase text-sm tracking-widest">
                            {lang === 'en' ? 'Explanation' : 'الشرح'}
                          </h4>
                          <button 
                            onClick={() => speak(lang === 'en' ? currentQuiz.questions[currentQuestionIdx].explanation.en : currentQuiz.questions[currentQuestionIdx].explanation.ar, lang)}
                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {lang === 'en' ? currentQuiz.questions[currentQuestionIdx].explanation.en : currentQuiz.questions[currentQuestionIdx].explanation.ar}
                        </p>
                        <button 
                          onClick={nextQuestion}
                          className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                        >
                          {currentQuestionIdx < currentQuiz.questions.length - 1 
                            ? (lang === 'en' ? 'Next Question' : 'السؤال التالي')
                            : (lang === 'en' ? 'See Results' : 'رؤية النتائج')}
                          <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center bg-emerald-600 p-12 sm:p-20 rounded-[3rem] shadow-2xl text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-4">
                    {lang === 'en' ? 'Great Job!' : 'عمل رائع!'}
                  </h2>
                  <p className="text-emerald-100 text-xl mb-12">
                    {lang === 'en' ? 'You completed the quiz' : 'لقد أكملت الاختبار'}
                  </p>
                  <div className="text-8xl font-black mb-12">
                    {Math.round((score / currentQuiz.questions.length) * 100)}%
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => startQuiz(currentQuiz)}
                      className="bg-white text-emerald-700 px-10 py-5 rounded-2xl font-black hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      {lang === 'en' ? 'Try Again' : 'حاول مرة أخرى'}
                    </button>
                    <button 
                      onClick={() => setView('home')}
                      className="bg-emerald-700 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-800 transition-colors"
                    >
                      {lang === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'html' && currentQuiz && (
            <motion.div 
              key="html"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {lang === 'en' ? currentQuiz.title_en : currentQuiz.title_ar}
                  </h2>
                  <button onClick={() => setView('home')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Home className="w-5 h-5" /> {lang === 'en' ? 'Back' : 'رجوع'}
                  </button>
                </div>
                <div 
                  className="prose dark:prose-invert max-w-none prose-emerald"
                  dangerouslySetInnerHTML={{ __html: currentQuiz.htmlContent || '' }}
                />
              </div>
            </motion.div>
          )}

          {view === 'explanations' && currentQuiz && (
            <motion.div 
              key="explanations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setView('home')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold"
                >
                  <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                  {lang === 'en' ? 'Back' : 'رجوع'}
                </button>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsAutoplay(!isAutoplay)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-black transition-all ${isAutoplay ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}
                  >
                    {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {lang === 'en' ? (isAutoplay ? 'Stop Autoplay' : 'Autoplay') : (isAutoplay ? 'إيقاف التشغيل' : 'تشغيل تلقائي')}
                  </button>
                </div>
              </div>

              <div className={`bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 ${isRtl ? 'rtl' : ''}`}>
                <div className="flex justify-between items-center mb-10">
                  <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest">
                    {lang === 'en' ? `Explanation ${currentQuestionIdx + 1} / ${currentQuiz.questions.length}` : `شرح ${currentQuestionIdx + 1} / ${currentQuiz.questions.length}`}
                  </span>
                  <button 
                    onClick={() => speak(lang === 'en' ? currentQuiz.questions[currentQuestionIdx].explanation.en : currentQuiz.questions[currentQuestionIdx].explanation.ar, lang)}
                    className={`p-3 rounded-full transition-colors ${isSpeaking ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600'}`}
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      {lang === 'en' ? 'Question' : 'السؤال'}
                    </p>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                      {lang === 'en' ? currentQuiz.questions[currentQuestionIdx].question_en : currentQuiz.questions[currentQuestionIdx].question_ar}
                    </h3>
                  </div>

                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-l-4 border-emerald-500">
                    <p className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-4">
                      {lang === 'en' ? 'Explanation' : 'الشرح'}
                    </p>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'en' ? currentQuiz.questions[currentQuestionIdx].explanation.en : currentQuiz.questions[currentQuestionIdx].explanation.ar}
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-between gap-4">
                  <button 
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(i => i - 1)}
                    className="flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-black border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                    {lang === 'en' ? 'Previous' : 'السابق'}
                  </button>
                  <button 
                    disabled={currentQuestionIdx === currentQuiz.questions.length - 1}
                    onClick={() => setCurrentQuestionIdx(i => i + 1)}
                    className="flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-30 hover:opacity-90 transition-all"
                  >
                    {lang === 'en' ? 'Next' : 'التالي'}
                    <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="px-8">
                <input 
                  type="range"
                  min="0"
                  max={currentQuiz.questions.length - 1}
                  value={currentQuestionIdx}
                  onChange={(e) => setCurrentQuestionIdx(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </motion.div>
          )}

          {view === 'gaps' && (
            <motion.div 
              key="gaps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold dark:text-white">
                  {lang === 'en' ? 'Knowledge Gap Map' : 'خريطة فجوات المعرفة'}
                </h2>
                <button onClick={() => setView('home')} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
                  <Home className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[400px]">
                  <div className="flex flex-wrap gap-4 justify-center items-center h-full">
                    {Object.keys(knowledgeGapsData).map((topic) => (
                      <motion.button
                        key={topic}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedGapTopic(topic)}
                        className={`px-6 py-4 rounded-2xl font-bold transition-all border-2 ${
                          selectedGapTopic === topic 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {topic}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <AnimatePresence mode="wait">
                    {selectedGapTopic ? (
                      <motion.div 
                        key={selectedGapTopic}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{selectedGapTopic}</h3>
                        <div className="space-y-4">
                          {knowledgeGapsData[selectedGapTopic].map((gap, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{gap.question}</p>
                                <button 
                                  onClick={() => speak(gap.question, 'en')}
                                  className="text-slate-400 hover:text-indigo-600"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="text-xs space-y-1">
                                <p className="text-emerald-600 font-bold">Correct: {gap.options[gap.correctIndex]}</p>
                                <div className="flex justify-between items-start gap-2 mt-2">
                                  <p className="text-slate-500 italic">"{lang === 'en' ? gap.explanation.en : gap.explanation.ar}"</p>
                                  <button 
                                    onClick={() => speak(lang === 'en' ? gap.explanation.en : gap.explanation.ar, lang)}
                                    className="text-slate-400 hover:text-emerald-600"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center text-slate-400 py-20">
                        <Brain className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>{lang === 'en' ? 'Select a topic to see gaps' : 'اختر موضوعًا لرؤية الفجوات'}</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-400 text-sm">
          © 2026 BioQuiz MCQ Platform • {lang === 'en' ? 'Empowering Students' : 'تمكين الطلاب'}
        </p>
      </footer>
    </div>
  );
}
