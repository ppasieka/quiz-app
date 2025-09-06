import { useEffect, useState } from 'react';
import i18n from '../i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for i18n to be initialized
    const checkInitialization = () => {
      if (i18n.isInitialized) {
        setIsInitialized(true);
        console.log('i18n is initialized, language:', i18n.language);
      } else {
        // Check again in a short while
        setTimeout(checkInitialization, 100);
      }
    };

    checkInitialization();

    // Also listen for the initialized event
    i18n.on('initialized', () => {
      setIsInitialized(true);
      console.log('i18n initialized event fired');
    });

    return () => {
      i18n.off('initialized', () => setIsInitialized(true));
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading translations...</p>
      </div>
    );
  }

  return <>{children}</>;
}