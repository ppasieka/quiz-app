export interface TranslationKeys {
  common: {
    app: {
      title: string;
      subtitle: string;
      demo: string;
    };
    navigation: {
      dashboard: string;
      createQuiz: string;
    };
    buttons: {
      back: string;
      create: string;
      submit: string;
      remove: string;
      add: string;
      retake: string;
    };
    status: {
      loading: string;
      error: string;
      success: string;
      warning: string;
    };
  };
  quiz: {
    dashboard: {
      title: string;
      subtitle: string;
      noQuizzes: string;
      createFirst: string;
      createFirstButton: string;
      availableQuizzes: string;
      createNew: string;
      takeQuiz: string;
      questionCount: string;
    };
    create: {
      title: string;
      subtitle: string;
      details: string;
      questions: string;
      quizTitle: string;
      quizTitlePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      questionNumber: string;
      questionText: string;
      questionPlaceholder: string;
      answerChoices: string;
      selectCorrect: string;
      answerPlaceholder: string;
      addChoice: string;
      addQuestion: string;
      creating: string;
      create: string;
    };
    take: {
      title: string;
      loading: string;
      questionNumber: string;
      selectBest: string;
      readyToSubmit: string;
      answeredCount: string;
      submit: string;
      submitting: string;
      answerAll: string;
    };
    summary: {
      title: string;
      noSummary: string;
      unableToLoad: string;
      tryAgain: string;
      backToQuiz: string;
      complete: string;
      yourResults: string;
      score: string;
      percentage: string;
      passed: string;
      needsImprovement: string;
      excellent: string;
      keepPracticing: string;
      questionBreakdown: string;
      correct: string;
      incorrect: string;
      backToList: string;
      retake: string;
    };
  };
  errors: {
    submissionFailed: string;
    failedToCreate: string;
  };
}