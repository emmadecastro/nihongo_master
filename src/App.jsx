import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, ArrowLeft, RotateCw, CheckCircle, Home, Brain, Play } from 'lucide-react';
import { JAPANESE_DATA } from './japaneseData';

const CATEGORIES = [
  { id: 'hiragana', title: 'Hiragana', color: 'bg-pink-500', hover: 'hover:bg-pink-600' },
  { id: 'katakana', title: 'Katakana', color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
  { id: 'n5', title: 'Kanji N5', color: 'bg-green-500', hover: 'hover:bg-green-600' },
  { id: 'n4', title: 'Kanji N4', color: 'bg-teal-500', hover: 'hover:bg-teal-600' },
  { id: 'n3', title: 'Kanji N3', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  { id: 'n2', title: 'Kanji N2', color: 'bg-orange-500', hover: 'hover:bg-orange-600' },
  { id: 'n1', title: 'Kanji N1', color: 'bg-red-500', hover: 'hover:bg-red-600' }
];

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, flashcard, quiz
  const [activeCategory, setActiveCategory] = useState(null);
  const [progress, setProgress] = useState({
    hiragana: 0, katakana: 0, n5: 0, n4: 0, n3: 0, n2: 0, n1: 0
  });

  // Charger la progression depuis le localStorage au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('nihongoProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Sauvegarder la progression
  const updateProgress = (category, scorePercentage) => {
    const newProgress = { ...progress };
    // On ne garde que le meilleur score
    if (scorePercentage > newProgress[category]) {
      newProgress[category] = scorePercentage;
      setProgress(newProgress);
      localStorage.setItem('nihongoProgress', JSON.stringify(newProgress));
    }
  };

  const startMode = (mode, category) => {
    setActiveCategory(category);
    setCurrentView(mode);
  };

  const goHome = () => {
    setCurrentView('dashboard');
    setActiveCategory(null);
  };

  return (
    <div className="min-h-screen bg-indigo-50 font-sans text-gray-800 selection:bg-indigo-200">
      {/* HEADER */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Nihongo Master
          </h1>
        </div>
        {currentView !== 'dashboard' && (
          <button 
            onClick={goHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            <Home size={18} /> Accueil
          </button>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto p-6">
        {currentView === 'dashboard' && (
          <Dashboard 
            progress={progress} 
            onStart={startMode} 
          />
        )}
        
        {currentView === 'flashcard' && (
          <Flashcards 
            category={activeCategory} 
            data={JAPANESE_DATA[activeCategory]} 
            onBack={goHome} 
          />
        )}
        
        {currentView === 'quiz' && (
          <Quiz 
            category={activeCategory} 
            data={JAPANESE_DATA[activeCategory]} 
            onBack={goHome}
            onComplete={(score) => updateProgress(activeCategory, score)}
          />
        )}
      </main>
    </div>
  );
}

// --- COMPONENTS ---

function Dashboard({ progress, onStart }) {
  const totalProgress = Object.values(progress).reduce((a, b) => a + b, 0) / CATEGORIES.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Global Stats */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-100 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full text-indigo-100">
            <path className="stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="stroke-indigo-600" strokeWidth="3" strokeDasharray={`${totalProgress}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-indigo-900">{Math.round(totalProgress)}%</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Ta Progression Globale</h2>
          <p className="text-gray-500 mb-4">Continue comme ça ! L'apprentissage régulier est la clé.</p>
          <div className="flex justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-bold">
              <Trophy size={18} className="text-amber-500" />
              Niveau: Débutant
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{cat.title}</h3>
              <span className="text-sm font-bold text-gray-400">{progress[cat.id]}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
              <div 
                className={`${cat.color} h-2.5 rounded-full transition-all duration-1000`} 
                style={{ width: `${progress[cat.id]}%` }}
              ></div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => onStart('flashcard', cat.id)}
                className={`flex-1 flex justify-center items-center gap-2 py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition-colors`}
              >
                <Brain size={18} /> Cartes
              </button>
              <button 
                onClick={() => onStart('quiz', cat.id)}
                className={`flex-1 flex justify-center items-center gap-2 py-2 px-3 rounded-xl text-white ${cat.color} ${cat.hover} font-medium transition-colors shadow-sm`}
              >
                <Play size={18} /> Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Flashcards({ category, data, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    }, 150);
  };

  if (!data || data.length === 0) return <div>Données manquantes.</div>;

  const currentCard = data[currentIndex];
  const catInfo = CATEGORIES.find(c => c.id === category);

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto py-8 animate-in zoom-in-95 duration-300">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 font-medium p-2">
          <ArrowLeft size={20} /> Retour
        </button>
        <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full font-bold text-sm">
          {currentIndex + 1} / {data.length}
        </span>
      </div>

      {/* Card Container for 3D flip effect */}
      <div 
        className="relative w-full max-w-sm h-80 perspective-1000 mb-10 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full transition-transform duration-500 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border-2 border-indigo-50 flex flex-col items-center justify-center p-8 text-center">
            <span className="text-8xl font-black text-gray-800 mb-4">{currentCard.jp}</span>
            <div className="text-gray-400 flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <RotateCw size={16} /> Cliquez pour retourner
            </div>
          </div>

          {/* Back */}
          <div className={`absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl border-2 border-indigo-50 flex flex-col items-center justify-center p-8 text-center rotate-y-180`}>
            <span className="text-4xl font-bold text-white mb-2">{currentCard.fr}</span>
            <span className="text-indigo-100 mt-4 font-medium uppercase tracking-wider text-sm">{catInfo?.title}</span>
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 w-full max-w-sm">
        <button 
          onClick={(e) => { e.stopPropagation(); prevCard(); }}
          className="flex-1 py-4 bg-white rounded-2xl font-bold text-gray-600 shadow-sm hover:shadow hover:bg-gray-50 active:scale-95 transition-all"
        >
          Précédent
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }}
          className="flex-1 py-4 bg-indigo-600 rounded-2xl font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Suivant
        </button>
      </div>

      {/* CSS in JS for 3D flip since standard tailwind doesn't have it by default */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}

function Quiz({ category, data, onBack, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Générer le quiz
  useEffect(() => {
    if (data && data.length > 0) {
      // Pour faire un QCM, on a besoin de mauvaises réponses
      const allAnswers = data.map(d => d.fr);
      
      const shuffledData = [...data].sort(() => 0.5 - Math.random()).slice(0, 10); // max 10 questions
      
      const generatedQuestions = shuffledData.map(item => {
        // Prendre la bonne réponse + 3 mauvaises au hasard
        let options = [item.fr];
        while (options.length < Math.min(4, data.length)) {
          const randomOpt = allAnswers[Math.floor(Math.random() * allAnswers.length)];
          if (!options.includes(randomOpt)) {
            options.push(randomOpt);
          }
        }
        return {
          question: item.jp,
          answer: item.fr,
          options: options.sort(() => 0.5 - Math.random())
        };
      });
      setQuestions(generatedQuestions);
    }
  }, [data]);

  const handleAnswer = (option) => {
    if (selectedAnswer) return; // Empêcher le double clic
    setSelectedAnswer(option);

    const isCorrect = option === questions[currentIndex].answer;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        const finalScore = Math.round(( (score + (isCorrect ? 1 : 0)) / questions.length) * 100);
        onComplete(finalScore);
        setShowResult(true);
      }
    }, 1200);
  };

  if (questions.length === 0) return <div>Chargement du quiz...</div>;

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-in zoom-in-95">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-indigo-50">
          <Trophy size={64} className={`mx-auto mb-6 ${percentage >= 80 ? 'text-yellow-400' : 'text-indigo-400'}`} />
          <h2 className="text-3xl font-black text-gray-800 mb-2">Quiz Terminé !</h2>
          <p className="text-gray-500 mb-8">Score: {score} sur {questions.length}</p>
          
          <div className="text-5xl font-black text-indigo-600 mb-10">{percentage}%</div>
          
          <button 
            onClick={onBack}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors shadow-md shadow-indigo-200"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-right-8 duration-300">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-gray-500 hover:text-indigo-600 font-medium">Quitter le quiz</button>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full ${i === currentIndex ? 'bg-indigo-600' : i < currentIndex ? 'bg-indigo-300' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-indigo-50 p-8 md:p-12 mb-8 text-center">
        <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 block">Que signifie ce caractère ?</span>
        <div className="text-8xl font-black text-gray-800 my-8">{currentQ.question}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQ.options.map((option, index) => {
          let btnClass = "bg-white border-2 border-gray-100 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";
          
          if (selectedAnswer) {
            if (option === currentQ.answer) {
              btnClass = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200 scale-[1.02]";
            } else if (option === selectedAnswer) {
              btnClass = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200";
            } else {
              btnClass = "bg-gray-100 border-gray-100 text-gray-400 opacity-50";
            }
          }

          return (
            <button
              key={index}
              disabled={!!selectedAnswer}
              onClick={() => handleAnswer(option)}
              className={`p-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${btnClass}`}
            >
              {option}
              {selectedAnswer && option === currentQ.answer && <CheckCircle size={20} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

