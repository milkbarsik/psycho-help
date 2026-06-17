export type TPoll = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  imageSrc?: string | null;
  questionsCount?: number | null;
  durationMinutes?: number | null;
  passedCount?: number | null;
  recommendPercent?: number | null;
  rating?: number | null;
};
