import { Link, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QuizList from './pages/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import QuizSummary from './pages/QuizSummary';
import LanguageSwitcher from './components/LanguageSwitcher';
import I18nProvider from './components/I18nProvider';

export default function App() {
  const { t } = useTranslation();

  return (
    <I18nProvider>
      <div className="container">
        <header className="header">
          <h1>
            <Link to="/">{t('common:app.title')}</Link>
          </h1>
          <nav>
            <Link to="/">{t('common:navigation.dashboard')}</Link>
            <Link to="/create" className="button primary">
              {t('common:navigation.createQuiz')}
            </Link>
            <LanguageSwitcher />
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
        <footer className="footer">
          <p>{t('common:app.title')} - {t('common:app.subtitle')}</p>
          <p>{t('common:app.demo')}</p>
        </footer>
      </div>
    </I18nProvider>
  );
}
