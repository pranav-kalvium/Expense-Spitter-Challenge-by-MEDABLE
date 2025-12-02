import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Users, UserPlus, X, AlertTriangle } from 'lucide-react';

function PeopleManager() {
  const { people, addPerson, removePerson } = useExpense();
  const [newPersonName, setNewPersonName] = useState('');

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      addPerson(newPersonName.trim());
      setNewPersonName('');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-4 border-b-2 border-gray-200 pb-2">
        <Users className="text-indigo-500 w-6 h-6" />
        <h2 className="text-gray-700 text-xl font-semibold">
          Manage People
        </h2>
      </div>

      <form className="flex gap-2 mb-6" onSubmit={handleAddPerson}>
        <input
          type="text"
          placeholder="Enter person's name"
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-indigo-600 hover:-translate-y-px flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add
        </button>
      </form>

      <div className="mt-4">
        <h3 className="text-gray-600 my-2 text-lg font-medium">
          Current Members ({people.length})
        </h3>
        {people.length === 0 ? (
          <p className="text-center text-gray-400 py-8 italic">
            No people added yet
          </p>
        ) : (
          <ul className="list-none mt-2 space-y-2">
            {people.map((person, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100 border border-gray-100"
              >
                <span className="font-medium text-gray-800">{person}</span>
                <button
                  onClick={() => removePerson(person)}
                  className="bg-transparent text-gray-400 p-1 transition-colors hover:text-red-500 hover:bg-red-50 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {people.length < 2 && (
        <p className="bg-amber-50 text-amber-800 px-4 py-3 rounded-lg mt-4 flex items-center gap-3 border border-amber-100">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium">Add at least 2 people to start tracking expenses</span>
        </p>
      )}
    </div>
  );
}

export default PeopleManager;
