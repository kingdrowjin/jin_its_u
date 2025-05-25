import { Edit, Flag, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const TileView = ({ employees, onEmployeeClick, onEdit, onFlag, onDelete, loading }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer relative"
          onClick={() => onEmployeeClick(employee)}
        >
          {/* Action Menu Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === employee.id ? null : employee.id);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={loading}
            >
              <MoreVertical size={16} className="text-gray-500" />
            </button>
            
            {/* Dropdown Menu */}
            {openMenuId === employee.id && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(employee);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={loading}
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFlag(employee);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={loading}
                  >
                    <Flag size={14} className="mr-2" />
                    Flag
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(employee);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    disabled={loading}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Employee Avatar */}
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
              {employee.name.charAt(0)}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.position}</p>
            </div>
          </div>

          {/* Employee Details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Department:</span>
              <span className="text-sm font-medium text-gray-900">{employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Age:</span>
              <span className="text-sm font-medium text-gray-900">{employee.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Salary:</span>
              <span className="text-sm font-medium text-gray-900">${employee.salary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Join Date:</span>
              <span className="text-sm font-medium text-gray-900">{employee.joinDate}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {employee.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TileView;
