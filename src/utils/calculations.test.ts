import { describe, it, expect } from 'vitest';
import { calculateBalances, simplifyDebts } from './calculations';
import { Expense } from '../types';

describe('calculateBalances', () => {
    it('should calculate balances for equal split', () => {
        const people = ['Alice', 'Bob'];
        const expenses: Expense[] = [
            {
                id: 1,
                description: 'Lunch',
                amount: 20,
                paidBy: 'Alice',
                splitBetween: ['Alice', 'Bob'],
                date: '2023-01-01',
                splitType: 'equal'
            }
        ];

        const balances = calculateBalances(people, expenses);
        expect(balances['Alice']).toBe(10); // Paid 20, share is 10 -> +10
        expect(balances['Bob']).toBe(-10);  // Paid 0, share is 10 -> -10
    });

    it('should calculate balances for custom split', () => {
        const people = ['Alice', 'Bob'];
        const expenses: Expense[] = [
            {
                id: 1,
                description: 'Taxi',
                amount: 30,
                paidBy: 'Bob',
                splitBetween: ['Alice', 'Bob'],
                date: '2023-01-01',
                splitType: 'custom',
                customAmounts: { 'Alice': 10, 'Bob': 20 }
            }
        ];

        const balances = calculateBalances(people, expenses);
        expect(balances['Bob']).toBe(10);   // Paid 30, share is 20 -> +10
        expect(balances['Alice']).toBe(-10); // Paid 0, share is 10 -> -10
    });
});

describe('simplifyDebts', () => {
    it('should simplify debts correctly', () => {
        // Alice owes Bob 10
        const balances = {
            'Alice': -10,
            'Bob': 10
        };

        const debts = simplifyDebts(balances);
        expect(debts).toHaveLength(1);
        expect(debts[0]).toEqual({ from: 'Alice', to: 'Bob', amount: 10 });
    });

    it('should handle complex debt simplification', () => {
        // A owes B 10, B owes C 10 -> A should owe C 10
        // Balances: A: -10, B: 0, C: +10
        const balances = {
            'A': -10,
            'B': 0,
            'C': 10
        };

        const debts = simplifyDebts(balances);
        expect(debts).toHaveLength(1);
        expect(debts[0]).toEqual({ from: 'A', to: 'C', amount: 10 });
    });
});
