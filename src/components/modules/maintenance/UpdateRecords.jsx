import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import EditForm from './components/EditForm';
import RecordItem from './components/RecordItem';
import { updateEmployee, deleteEmployee, fetchEmployees } from '../../../services/maintenance/employeeService';

const UpdateRecords = () => {
  const [activeTab] = useState('employees'); // Simplified for now to focus on employees
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState('');

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees();
      setRecords(data);
      setError('');
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleUpdate = async (record) => {
    try {
      setLoading(true);
      setError('');
      
      await updateEmployee(record.id, record);
      await loadRecords();
      
      setEditingRecord(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      setError(`Failed to update employee: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      setError('');
      
      await deleteEmployee(id);
      await loadRecords();
      
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError(`Failed to delete employee: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record =>
    record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Update Records</h3>
        <p className="text-gray-600">Update or remove employee records</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading records...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-gray-50 rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
                  >
                    {editingRecord?.id === record.id ? (
                      <EditForm
                        record={editingRecord}
                        onSave={handleUpdate}
                        onCancel={() => setEditingRecord(null)}
                      />
                    ) : (
                      <RecordItem
                        record={record}
                        onEdit={() => setEditingRecord(record)}
                        onDelete={() => handleDelete(record.id)}
                      />
                    )}
                  </div>
                ))}

                {filteredRecords.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No records found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRecords;