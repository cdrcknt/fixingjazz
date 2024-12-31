import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Calendar, Clock, User, Plus, Edit2, Save, X } from 'lucide-react';

const Scheduling = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    start_time: '',
    end_time: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
    if (selectedEmployee) {
      fetchSchedules();
    }
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('employee_id', selectedEmployee)
        .order('date', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('schedules')
        .insert([
          {
            employee_id: selectedEmployee,
            ...newSchedule
          }
        ]);

      if (error) throw error;
      
      setNewSchedule({
        date: '',
        start_time: '',
        end_time: '',
      });
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({
          date: editingSchedule.date,
          start_time: editingSchedule.start_time,
          end_time: editingSchedule.end_time
        })
        .eq('id', editingSchedule.id);

      if (error) throw error;
      setEditingSchedule(null);
      fetchSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-purple-800 mb-2">Employee Scheduling</h3>
        <p className="text-purple-600">Manage employee work schedules and shifts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && (
            <>
              <form onSubmit={handleScheduleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newSchedule.date}
                      onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newSchedule.start_time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newSchedule.end_time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Schedule
                </button>
              </form>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Shifts</h4>
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      {editingSchedule?.id === schedule.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                              <input
                                type="date"
                                value={editingSchedule.date}
                                onChange={(e) => setEditingSchedule({
                                  ...editingSchedule,
                                  date: e.target.value
                                })}
                                className="w-full p-2 border rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                              <input
                                type="time"
                                value={editingSchedule.start_time}
                                onChange={(e) => setEditingSchedule({
                                  ...editingSchedule,
                                  start_time: e.target.value
                                })}
                                className="w-full p-2 border rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                              <input
                                type="time"
                                value={editingSchedule.end_time}
                                onChange={(e) => setEditingSchedule({
                                  ...editingSchedule,
                                  end_time: e.target.value
                                })}
                                className="w-full p-2 border rounded-lg"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingSchedule(null)}
                              className="px-3 py-1 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleEditSubmit}
                              className="px-3 py-1 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-50 rounded-lg">
                              <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {new Date(schedule.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                {schedule.start_time} - {schedule.end_time}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingSchedule(schedule)}
                            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheduling;