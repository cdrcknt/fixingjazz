import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Search } from 'lucide-react';
import { updateEmployee, deleteEmployee } from '../../../utils/employee/employeeService';
import EditForm from './components/EditForm';
import RecordItem from './components/RecordItem';

const UpdateRecords = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [activeTab]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      setError(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (record) => {
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'employees') {
        await updateEmployee(record);
      } else {
        const { error } = await supabase
          .from(activeTab)
          .update(record)
          .eq('id', record.id);
        if (error) throw error;
      }
      
      setEditingRecord(null);
      await fetchRecords();
      setError('');
    } catch (error) {
      console.error(`Error updating ${activeTab}:`, error);
      setError(`Failed to update ${activeTab}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'employees') {
        await deleteEmployee(id);
      } else {
        const { error } = await supabase
          .from(activeTab)
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
      
      await fetchRecords();
      setError('');
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
      setError(`Failed to delete ${activeTab}: ${error.message}`);
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
        <p className="text-gray-600">Update or remove system records</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'employees'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Products
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search records..."
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
                        onDelete={handleDelete}
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