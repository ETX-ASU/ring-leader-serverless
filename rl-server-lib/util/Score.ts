export interface Score {
  scoreGiven: number;
  timestamp?: string;
  comment: string;
  activityProgress: string;
  gradingProgress: string;
  userId?: string;
  scoreMaximum?: number;
}
