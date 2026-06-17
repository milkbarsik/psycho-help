export type TPollOption = {
  id: string;
  label: string;
};

export type TPollQuestion = {
  id: string;
  title: string;
  options: TPollOption[];
};

export type TPollData = {
  id: string;
  slug: string;
  title: string;
  questions: TPollQuestion[];
};

// questionId -> optionId
export type TPollAnswers = Record<string, string>;

export type TPollFeedback = {
  rating: number; // 1–5
  recommend: boolean;
};
