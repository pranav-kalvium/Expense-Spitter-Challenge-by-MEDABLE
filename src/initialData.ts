import { Expense } from './types';

export const initialPeople: string[] = ["Ayush", "Debjit", "Varsha", "Harish"];

export const initialExpenses: Expense[] = [
  {
    id: 1,
    description: "Lunch at restaurant",
    amount: 120,
    paidBy: "Ayush",
    splitBetween: ["Ayush", "Debjit", "Varsha", "Harish"],
    date: "2024-01-28",
    splitType: "equal"
  },
  {
    id: 2,
    description: "Uber to airport",
    amount: 45,
    paidBy: "Debjit",
    splitBetween: ["Debjit", "Varsha"],
    date: "2024-01-27",
    splitType: "equal"
  },
  {
    id: 3,
    description: "Concert tickets",
    amount: 200,
    paidBy: "Varsha",
    splitBetween: ["Ayush", "Varsha", "Harish"],
    date: "2024-01-26",
    splitType: "equal"
  }
];
