export type RevisionSession = {
  label: string;
  date: string; // ISO string
  isCompleted: boolean;
};

export type Concept = {
  id: string;
  title: string;
  originalDate: string; // ISO string
  totalSessions: 3 | 5;
  revisions: RevisionSession[];
  isArchived: boolean;
};
