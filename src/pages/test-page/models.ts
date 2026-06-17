export type TTestOption = {
  id: string;
  label: string;
};

export type TTestQuestion = {
  id: string;
  title: string;
  options: TTestOption[];
};

export type TTestData = {
  id: string;
  slug: string;
  title: string;
  questions: TTestQuestion[];
};

// questionId -> optionId
export type TTestAnswers = Record<string, string>;
