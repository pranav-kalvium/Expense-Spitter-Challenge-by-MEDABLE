import { useState } from 'react';
import medableLogo from './assets/medable-logo.png';
import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import PeopleManager from './components/PeopleManager';
import SplashScreen from './components/SplashScreen';
import ParticlesBackground from './components/ParticlesBackground';
import { ExpenseProvider } from './context/ExpenseContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ExpenseProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
        <ParticlesBackground />

        <header className="bg-white/10 backdrop-blur-md p-6 border-b border-white/20 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
            <img src={medableLogo} alt="Medable Logo" className="h-10 object-contain drop-shadow-md" />
            <h1 className="text-white text-3xl font-bold tracking-wide drop-shadow-lg">Expense Splitter</h1>
          </div>
        </header>

        <main className="p-8 relative z-10">
          <div className="max-w-7xl mx-auto flex gap-8" style={{ minWidth: '1000px' }}>
            <div style={{ width: '50%', minWidth: '500px' }}>
              <PeopleManager />
              <ExpenseForm />
            </div>

            <div style={{ width: '50%', minWidth: '500px' }}>
              <BalanceView />
              <ExpenseList />
            </div>
          </div>
        </main>
      </div>
    </ExpenseProvider>
  );
}

export default App;
