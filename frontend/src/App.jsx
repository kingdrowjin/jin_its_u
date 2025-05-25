import { useState } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import client from './utils/apolloClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GET_EMPLOYEES } from './graphql/queries';
import { DELETE_EMPLOYEE } from './graphql/mutations';
import Header from './components/Header';
import GridView from './components/GridView';
import TileView from './components/TileView';
import EmployeeDetail from './components/EmployeeDetail';
import EmployeeForm from './components/EmployeeForm';
import Login from './components/Login';
import { Plus, Loader2, RefreshCw } from 'lucide-react';

const EmployeeApp = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('grid');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ field: 'createdAt', order: 'DESC' });

  // Fetch employees
  const { 
    data, 
    loading: employeesLoading, 
    error, 
    refetch,
    fetchMore 
  } = useQuery(GET_EMPLOYEES, {
    variables: { 
      page, 
      limit, 
      filter: filters,
      sort 
    },
    skip: !isAuthenticated,
    errorPolicy: 'all'
  });

  // Delete employee mutation
  const [deleteEmployee, { loading: deleteLoading }] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ 
      query: GET_EMPLOYEES, 
      variables: { page, limit, filter: filters, sort } 
    }],
    onError: (error) => {
      alert(`Error deleting employee: ${error.message}`);
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const employees = data?.employees?.employees || [];
  const pageInfo = data?.employees?.pageInfo;

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDetail = () => {
    setSelectedEmployee(null);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
    setSelectedEmployee(null);
  };

  const handleCloseForm = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

  const handleFlag = (employee) => {
    alert(`Employee ${employee.name} has been flagged for review.`);
  };

  const handleDelete = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        await deleteEmployee({ variables: { id: employee.id } });
        if (selectedEmployee?.id === employee.id) {
          setSelectedEmployee(null);
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1); // Reset to first page when sorting
  };

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Error loading employees</p>
            <p className="text-sm">{error.message}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onViewChange={handleViewChange} 
        currentView={currentView}
        user={user}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Employee Directory</h2>
            <p className="text-gray-600 mt-2">
              {pageInfo ? `${pageInfo.totalCount} employees total` : 'Manage employee information'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={employeesLoading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center disabled:opacity-50"
            >
              <RefreshCw size={16} className={`mr-2 ${employeesLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleAddEmployee}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Loading State */}
        {employeesLoading && employees.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading employees...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!employeesLoading && employees.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <p className="text-lg">No employees found</p>
              <p className="text-sm">Get started by adding your first employee</p>
            </div>
            <button
              onClick={handleAddEmployee}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
            >
              <Plus size={16} className="mr-2" />
              Add First Employee
            </button>
          </div>
        )}

        {/* Employee List */}
        {employees.length > 0 && (
          <>
            {currentView === 'grid' ? (
              <GridView
                employees={employees}
                onEmployeeClick={handleEmployeeClick}
                onEdit={handleEditEmployee}
                onFlag={handleFlag}
                onDelete={handleDelete}
                loading={deleteLoading}
              />
            ) : (
              <TileView
                employees={employees}
                onEmployeeClick={handleEmployeeClick}
                onEdit={handleEditEmployee}
                onFlag={handleFlag}
                onDelete={handleDelete}
                loading={deleteLoading}
              />
            )}

            {/* Pagination */}
            {pageInfo && pageInfo.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!pageInfo.hasPreviousPage || employeesLoading}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {pageInfo.currentPage} of {pageInfo.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!pageInfo.hasNextPage || employeesLoading}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={handleCloseDetail}
          onEdit={handleEditEmployee}
        />
      )}

      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleCloseForm}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <EmployeeApp />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
