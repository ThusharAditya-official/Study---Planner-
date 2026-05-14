import { useState, useEffect, useMemo } from 'react';
import { addDays, isBefore, endOfDay } from 'date-fns';
import { Concept } from '../types';

export const useRevisionLogic = () => {
  const [concepts, setConcepts] = useState<Concept[]>(() => {
    const saved = localStorage.getItem('sr_concepts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sr_concepts', JSON.stringify(concepts));
  }, [concepts]);

  const addConcept = (title: string, intervalType: 3 | 5) => {
    const intervals = intervalType === 5 ? [1, 3, 7, 14, 30] : [1, 3, 7];
    const now = new Date();
    
    const newConcept: Concept = {
      id: crypto.randomUUID(),
      title,
      originalDate: now.toISOString(),
      totalSessions: intervalType,
      isArchived: false,
      revisions: intervals.map(days => ({
        label: `${days}D`,
        date: addDays(now, days).toISOString(),
        isCompleted: false
      }))
    };

    setConcepts(prev => [newConcept, ...prev]);
  };

  const toggleRevision = (conceptId: string, revisionIndex: number) => {
    setConcepts(prev => prev.map(concept => {
      if (concept.id !== conceptId) return concept;

      const updatedRevisions = concept.revisions.map((rev, idx) => 
        idx === revisionIndex ? { ...rev, isCompleted: !rev.isCompleted } : rev
      );

      // Archive logic: Check if all are completed
      const allDone = updatedRevisions.every(r => r.isCompleted);
      
      return { 
        ...concept, 
        revisions: updatedRevisions, 
        isArchived: allDone 
      };
    }));
  };

  const deleteConcept = (conceptId: string) => {
    setConcepts(prev => prev.filter(concept => concept.id !== conceptId));
  }

  // Notification Logic: Today, Overdue, and Tomorrow (24h early)
  const notificationCount = useMemo(() => {
    const tomorrowEnd = endOfDay(addDays(new Date(), 1));
    return concepts.reduce((count, concept) => {
      if (concept.isArchived) return count;
      const dueSessions = concept.revisions.filter(rev => 
        !rev.isCompleted && isBefore(new Date(rev.date), tomorrowEnd)
      );
      return count + dueSessions.length;
    }, 0);
  }, [concepts]);

  return { concepts, addConcept, toggleRevision, deleteConcept, notificationCount };
};
