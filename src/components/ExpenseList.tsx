import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { FileText, Trash2, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';

function ExpenseList() {
  const { expenses, removeExpense } = useExpense();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-4 border-b-2 border-gray-200 pb-2">
        <FileText className="text-indigo-500 w-6 h-6" />
        <h2 className="text-gray-700 text-xl font-semibold">
          Expense History
        </h2>
      </div>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-400 py-8 italic">
          No expenses added yet. Add your first expense to get started!
        </p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => {
            const isExpanded = expandedId === expense.id;
            const splitAmount = expense.splitType === 'equal'
              ? expense.amount / expense.splitBetween.length
              : 0;

            return (
              <div
                key={expense.id}
                className={`bg-gray-50 rounded-lg border transition-all overflow-hidden ${isExpanded ? 'border-indigo-300 shadow-md' : 'border-gray-200 hover:border-indigo-200'
                  }`}
              >
                <div
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(expense.id)}
                >
                  <div className="flex-1">
                    <h4 className="text-gray-800 mb-1 text-lg font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {expense.description}
                    </h4>
                    <div className="flex gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(expense.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Paid by {expense.paidBy}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-700">
                      ${expense.amount.toFixed(2)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <div
                  className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="p-4 bg-white">
                    <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Split Details ({expense.splitType})
                    </h5>
                    <div className="space-y-2 mb-4">
                      {expense.splitBetween.map(person => {
                        const amountOwed = expense.splitType === 'equal'
                          ? splitAmount
                          : (expense.customAmounts?.[person] || 0);

                        const isPayer = person === expense.paidBy;

                        return (
                          <div key={person} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 font-medium">{person}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${isPayer ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                                }`}>
                                {isPayer ? 'paid' : 'owes'}
                              </span>
                              <span className="font-bold text-gray-800">
                                ${amountOwed.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExpense(expense.id);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Expense
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-600 mt-4 border border-gray-100">
        <p className="text-sm font-medium">
          Total Expenses: <strong className="text-indigo-600">{expenses.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ExpenseList;
