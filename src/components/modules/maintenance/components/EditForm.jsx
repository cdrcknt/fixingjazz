import React from 'react';

const EditForm = ({ record, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState(record);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Full Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Email"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="Barista">Barista</option>
          <option value="Cashier">Cashier</option>
          <option value="Manager">Manager</option>
          <option value="Supervisor">Supervisor</option>
        </select>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Position"
        />
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Department"
        />
        <input
          type="date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="date_hired"
          value={formData.date_hired}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="emergency_contact"
          value={formData.emergency_contact}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Emergency Contact"
        />
        <input
          type="text"
          name="emergency_phone"
          value={formData.emergency_phone}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Emergency Phone"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="p-2 border rounded md:col-span-2"
          placeholder="Address"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onCancel()}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(formData)}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditForm;