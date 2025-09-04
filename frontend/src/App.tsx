import { Link, Route, Routes } from 'react-router-dom';
import QuizList from './pages/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import QuizSummary from './pages/QuizSummary';

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>
          <Link to="/">Quiz App</Link>
        </h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/create" className="button primary">
            Create Quiz
          </Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/quiz/:id/summary" element={<QuizSummary />} />
        </Routes>
      </main>
      <footer className="footer">Demo only. No auth. Keep it simple.</footer>
    </div>
  );
}
