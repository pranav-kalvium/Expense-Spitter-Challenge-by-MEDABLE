# 🚀 Expense Splitter Challenge - Implementation Explanation

## 🎯 Project Overview
The goal was to build a React application to track shared expenses and calculate settlements. The core challenge involved managing state across multiple components and implementing the logic to split expenses and simplify debts.

## 🏗 Architecture & Design Decisions

### 1. State Management: React Context API
**Why?**
- The application requires shared state (`people`, `expenses`) accessible by multiple sibling components (`PeopleManager`, `ExpenseForm`, `BalanceView`).
- Prop drilling would be messy and hard to maintain.
- Redux or other external libraries would be overkill for this scope.
- **Implementation**: Created `ExpenseContext` to hold the state and expose actions (`addPerson`, `addExpense`, `removeExpense`).

### 2. Separation of Concerns
- **UI Components**: purely presentational or handling local form state.
- **Context**: manages global data and business actions.
- **Utils (`calculations.ts`)**: Pure functions for complex logic. This makes the logic **testable** and reusable.

### 3. Type Safety (TypeScript)
- Defined interfaces in `types.ts` (`Expense`, `Balance`, `SimplifiedDebt`).
- Ensures that we don't accidentally access missing properties or pass wrong data types.

## 🧩 Key Implementation Details

### 💡 Balance Calculation Algorithm
Located in `src/utils/calculations.ts`.
1.  **Initialize**: Start everyone with a balance of $0.
2.  **Iterate Expenses**:
    -   **Payer**: Add the full amount to their balance (they are "owed" this money by the group).
    -   **Splitters**: Subtract their share from their balance (they "owe" this money to the group).
3.  **Result**:
    -   Positive Balance (+): The person is owed money.
    -   Negative Balance (-): The person owes money.

### 💸 Debt Simplification
The "Splitwise" style simplification.
1.  Separate people into **Debtors** (negative balance) and **Creditors** (positive balance).
2.  Sort them by amount (optional, but helps with efficiency).
3.  **Greedy Approach**:
    -   Take the first Debtor and first Creditor.
    -   Match them: The debtor pays the creditor the minimum of (what they owe, what the creditor is owed).
    -   Update their remaining amounts.
    -   Repeat until everyone is settled.
This reduces the total number of transactions needed compared to everyone paying everyone directly.

## 🧪 Testing
- **Unit Tests**: Added `calculations.test.ts` using Vitest.
- **Why?** The math logic is the most critical part of the app. If the numbers are wrong, the app is useless. Testing pure functions is easy and provides high confidence.

## 🚀 Future Improvements (Talking Points)
If I had more time, I would add:
1.  **Persistence**: Save data to `localStorage` or a backend so data isn't lost on refresh.
2.  **Edit Functionality**: Allow editing existing expenses.
3.  **Validation**: Better error handling (e.g., preventing deleting a person involved in an expense).
4.  **Optimizations**: Memoize calculations with `useMemo` if the expense list grows very large.
