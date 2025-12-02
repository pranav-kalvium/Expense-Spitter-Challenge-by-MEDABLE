import { Expense, Balance, SimplifiedDebt } from '../types';

export const calculateBalances = (people: string[], expenses: Expense[]): Balance => {
    const balances: Balance = {};

    // Initialize balances for everyone
    people.forEach(person => {
        balances[person] = 0;
    });

    expenses.forEach(expense => {
        const paidBy = expense.paidBy;
        const amount = expense.amount;

        // Add amount to payer
        if (balances[paidBy] !== undefined) {
            balances[paidBy] += amount;
        }

        // Subtract share from splitters
        if (expense.splitType === 'equal') {
            const splitCount = expense.splitBetween.length;
            if (splitCount > 0) {
                const splitAmount = amount / splitCount;
                expense.splitBetween.forEach(person => {
                    if (balances[person] !== undefined) {
                        balances[person] -= splitAmount;
                    }
                });
            }
        } else if (expense.splitType === 'custom' && expense.customAmounts) {
            Object.entries(expense.customAmounts).forEach(([person, customAmount]) => {
                if (balances[person] !== undefined) {
                    balances[person] -= customAmount;
                }
            });
        }
    });

    return balances;
};

export const simplifyDebts = (balances: Balance): SimplifiedDebt[] => {
    const debtors: { person: string; amount: number }[] = [];
    const creditors: { person: string; amount: number }[] = [];

    Object.entries(balances).forEach(([person, amount]) => {
        // Round to 2 decimal places to avoid floating point errors
        const roundedAmount = Math.round(amount * 100) / 100;
        if (roundedAmount < -0.01) {
            debtors.push({ person, amount: roundedAmount }); // Negative balance means they owe money
        } else if (roundedAmount > 0.01) {
            creditors.push({ person, amount: roundedAmount }); // Positive balance means they are owed money
        }
    });

    // Sort by magnitude to optimize matching
    debtors.sort((a, b) => a.amount - b.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const debts: SimplifiedDebt[] = [];
    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to settle is the minimum of what the debtor owes and what the creditor is owed
        const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

        if (amount > 0) {
            debts.push({
                from: debtor.person,
                to: creditor.person,
                amount: Math.round(amount * 100) / 100
            });
        }

        // Update remaining amounts
        debtor.amount += amount;
        creditor.amount -= amount;

        // Move to next person if settled (using a small epsilon for float comparison)
        if (Math.abs(debtor.amount) < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return debts;
};
