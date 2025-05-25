import { Edit, Flag, Trash2 } from 'lucide-react';

const GridView = ({ employees, onEmployeeClick, onEdit, onFlag, onDelete, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onEmployeeClick(employee)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {employee.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.salary.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEdit(employee)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      disabled={loading}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onFlag(employee)}
                      className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                      disabled={loading}
                    >
                      <Flag size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GridView;
