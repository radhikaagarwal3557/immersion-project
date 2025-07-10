import React, { createContext, useState, useEffect } from 'react';

// Create the context
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState({
    name: 'John Doe',
    totalDays: 100,
    presentDays: 85,
    subjects: [
      { name: 'Math', teacherName: 'Mr. Sharma', teacherEmail: 'sharma@school.com' },
      { name: 'Science', teacherName: 'Ms. Rao', teacherEmail: 'rao@school.com' }
    ],
    results: [
      { subject: 'Math', marks: 85, grade: 'A', status: 'Pass' },
      { subject: 'Science', marks: 70, grade: 'B', status: 'Pass' }
    ]
  });

  const [assignments, setAssignments] = useState([]);

  // Dummy fetch function for assignments
  const fetchAssignments = () => {
    const mockAssignments = [
      { id: 1, title: 'Assignment 1', score: 80 },
      { id: 2, title: 'Assignment 2', score: 90 },
      { id: 3, title: 'Assignment 3', score: 75 }
    ];
    setAssignments(mockAssignments);
  };

  // You can run this on mount or from a component
  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <DataContext.Provider
      value={{
        loggedUser,
        setLoggedUser,
        assignments,
        setAssignments,
        fetchAssignments
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
