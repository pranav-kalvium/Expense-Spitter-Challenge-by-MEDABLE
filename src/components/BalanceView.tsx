import { useExpense } from '../context/ExpenseContext';
import { calculateBalances, simplifyDebts } from '../utils/calculations';
import { Wallet, CheckCircle, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

function BalanceView() {
  const { people, expenses } = useExpense();

  const balances = calculateBalances(people, expenses);
  const debts = simplifyDebts(balances);
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-4 border-b-2 border-gray-200 pb-2">
        <Wallet className="text-indigo-500 w-6 h-6" />
        <h2 className="text-gray-700 text-xl font-semibold">
          Balances
        </h2>
      </div>

      <div className="flex justify-between items-center p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl mb-6 shadow-md">
        <span className="font-medium opacity-90">Total Group Spending</span>
        <strong className="text-3xl font-bold tracking-tight">${totalSpending.toFixed(2)}</strong>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-600 my-3 text-sm font-semibold uppercase tracking-wider">Individual Balances</h3>
        <div className="space-y-2">
          {people.map((person) => {
            const balance = balances[person] || 0;
            const isOwed = balance > 0.01;
            const owes = balance < -0.01;
            const isSettled = !isOwed && !owes;

            return (
              <div
                key={person}
                className={`flex justify-between items-center px-4 py-3 rounded-lg transition-all hover:translate-x-1 border ${isOwed ? 'bg-green-50 border-green-100' :
                    owes ? 'bg-red-50 border-red-100' :
                      'bg-gray-50 border-gray-100'
                  }`}
              >
                <span className="font-semibold text-gray-800">{person}</span>
                <span className="flex items-center gap-2">
                  {isOwed && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase bg-green-100 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" /> Gets back
                    </span>
                  )}
                  {owes && (
                    <span className="flex items-center gap-1 text-red-600 text-xs font-bold uppercase bg-red-100 px-2 py-0.5 rounded-full">
                      <TrendingDown className="w-3 h-3" /> Owes
                    </span>
                  )}
                  {isSettled && (
                    <span className="flex items-center gap-1 text-gray-500 text-xs font-bold uppercase bg-gray-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Settled
                    </span>
                  )}

                  <strong className={`text-lg font-bold ${isOwed ? 'text-green-700' :
                      owes ? 'text-red-700' :
                        'text-gray-500'
                    }`}>
                    ${Math.abs(balance).toFixed(2)}
                  </strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {debts.length > 0 ? (
        <div>
          <h3 className="text-gray-600 my-3 text-sm font-semibold uppercase tracking-wider">Suggested Settlements</h3>
          <div className="space-y-2">
            {debts.map((debt, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-900 rounded-lg border border-indigo-100 shadow-sm">
                <span className="font-bold">{debt.from}</span>
                <span className="text-indigo-400 flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="font-bold">{debt.to}</span>
                <span className="font-bold ml-auto text-lg bg-white px-2 py-0.5 rounded text-indigo-700 shadow-sm">
                  ${debt.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-green-50 rounded-xl text-green-800 border border-green-100 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="font-medium">All balances are settled!</p>
        </div>
      )}
    </div>
  );
}

export default BalanceView;
