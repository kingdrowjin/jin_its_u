import { X, Mail, Phone, Calendar, DollarSign, User, Building, Edit } from 'lucide-react';

const EmployeeDetail = ({ employee, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(employee)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center mb-8">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
              {employee.name.charAt(0)}
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-900">{employee.name}</h3>
              <p className="text-lg text-gray-600">{employee.position}</p>
              <p className="text-sm text-gray-500">Employee ID: {employee.id}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h4>
              
              <div className="flex items-center space-x-3">
                <User size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium text-gray-900">{employee.age} years old</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{employee.phone}</p>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Work Information
              </h4>
              
              <div className="flex items-center space-x-3">
                <Building size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{employee.department}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium text-gray-900">${employee.salary.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium text-gray-900">{employee.joinDate}</p>
                </div>
              </div>

              {employee.attendance && (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-500">Attendance</p>
                    <p className="font-medium text-gray-900">{employee.attendance}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {employee.bio && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Additional Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{employee.bio}</p>
              </div>
            </div>
          )}

          {/* Skills/Subjects */}
          {employee.subjects && employee.subjects.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills/Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {employee.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(employee)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
