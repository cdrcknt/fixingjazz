import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { User, Mail, Calendar, UserCircle, Briefcase, Phone, MapPin, ChevronDown, ChevronRight } from 'lucide-react';

const EmployeeRecords = () => {
  const [employees, setEmployees] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Employee Records</h3>
        <p className="text-blue-600">View employee information</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div 
                className="flex justify-between items-start cursor-pointer"
                onClick={() => toggleExpand(employee.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{employee.name}</h4>
                    <p className="text-blue-600 font-medium">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {expandedId === employee.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedId === employee.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{employee.position} - {employee.department}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Birth Date: {new Date(employee.birth_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Hired: {new Date(employee.date_hired).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Emergency Contact: {employee.emergency_contact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Emergency Phone: {employee.emergency_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{employee.address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeRecords;