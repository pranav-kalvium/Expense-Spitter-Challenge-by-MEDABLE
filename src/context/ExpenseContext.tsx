import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Expense } from '../types';
import { initialPeople, initialExpenses } from '../initialData';

interface ExpenseContextType {
    people: string[];
    expenses: Expense[];
    addPerson: (name: string) => void;
    removePerson: (name: string) => void;
    addExpense: (expense: Expense) => void;
    removeExpense: (id: number) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [people, setPeople] = useState<string[]>(initialPeople);
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

    const addPerson = (name: string) => {
        if (!people.includes(name)) {
            setPeople([...people, name]);
        }
    };

    const removePerson = (name: string) => {
        setPeople(people.filter(p => p !== name));
        // Also remove this person from existing expenses? 
        // For simplicity, we'll keep expenses as is, but in a real app we might want to handle this.
        // However, the requirements say "Remove Person: Users should be able to remove people from the group".
        // It doesn't specify cascading deletes. Let's keep it simple for now.
    };

    const addExpense = (expense: Expense) => {
        setExpenses([...expenses, expense]);
    };

    const removeExpense = (id: number) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    return (
        <ExpenseContext.Provider value={{ people, expenses, addPerson, removePerson, addExpense, removeExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpense = () => {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpense must be used within an ExpenseProvider');
    }
    return context;
};
