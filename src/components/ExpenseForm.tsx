import { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Expense } from '../types';
import { Receipt, Plus, Calendar, DollarSign, User, Split } from 'lucide-react';

function ExpenseForm() {
  const { people, addExpense } = useExpense();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<{ [key: string]: number }>({});

  // Initialize selected people when people list changes
  useEffect(() => {
    if (people.length > 0 && selectedPeople.length === 0) {
      setSelectedPeople(people);
    }
  }, [people]);

  const handleTogglePerson = (person: string) => {
    if (selectedPeople.includes(person)) {
      setSelectedPeople(selectedPeople.filter(p => p !== person));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const handleCustomAmountChange = (person: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomAmounts({
      ...customAmounts,
      [person]: numValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !paidBy || selectedPeople.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);

    // Validate custom split total
    if (splitType === 'custom') {
      const totalCustom = selectedPeople.reduce((sum, person) => sum + (customAmounts[person] || 0), 0);
      if (Math.abs(totalCustom - numAmount) > 0.01) {
        alert(`Custom amounts must sum to ${numAmount}. Current sum: ${totalCustom}`);
        return;
      }
    }

    const newExpense: Expense = {
      id: Date.now(),
      description,
      amount: numAmount,
      paidBy,
      date,
      splitType,
      splitBetween: selectedPeople,
      customAmounts: splitType === 'custom' ? customAmounts : undefined
    };

    addExpense(newExpense);

    // Reset form
    setDescription('');
    setAmount('');
    setPaidBy('');
    setSplitType('equal');
    setCustomAmounts({});
    // Keep selected people as is for convenience
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-4 border-b-2 border-gray-200 pb-2">
        <Receipt className="text-indigo-500 w-6 h-6" />
        <h2 className="text-gray-700 text-xl font-semibold">
          Add Expense
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was the expense for?"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 mb-4">
            <label
              htmlFor="amount"
              className="block mb-1 text-gray-700 font-medium text-sm flex items-center gap-1"
            >
              <DollarSign className="w-3 h-3" /> Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex-1 mb-4">
            <label
              htmlFor="date"
              className="block mb-1 text-gray-700 font-medium text-sm flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" /> Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="paidBy"
            className="block mb-1 text-gray-700 font-medium text-sm flex items-center gap-1"
          >
            <User className="w-3 h-3" /> Paid By
          </label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 cursor-pointer"
            required
          >
            <option value="">Select person...</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm flex items-center gap-1">
            <Split className="w-3 h-3" /> Split Type
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="equal"
                name="splitType"
                checked={splitType === 'equal'}
                onChange={() => setSplitType('equal')}
                className="cursor-pointer accent-indigo-500"
              />
              <span className="text-sm">Equal Split</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="custom"
                name="splitType"
                checked={splitType === 'custom'}
                onChange={() => setSplitType('custom')}
                className="cursor-pointer accent-indigo-500"
              />
              <span className="text-sm">Custom Amounts</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Between
          </label>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {people.map((person) => (
              <div
                key={person}
                className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1 border border-gray-100"
              >
                <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50 flex-1">
                  <input
                    type="checkbox"
                    className="cursor-pointer accent-indigo-500"
                    checked={selectedPeople.includes(person)}
                    onChange={() => handleTogglePerson(person)}
                  />
                  <span className="text-sm font-medium text-gray-700">{person}</span>
                </label>
                {splitType === 'custom' && selectedPeople.includes(person) && (
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:border-indigo-500 focus:outline-none"
                    value={customAmounts[person] || ''}
                    onChange={(e) => handleCustomAmountChange(person, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-indigo-600 hover:-translate-y-px flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
