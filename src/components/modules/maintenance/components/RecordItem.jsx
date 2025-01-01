import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const RecordItem = ({ record, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-gray-900">{record.name}</h4>
        <p className="text-sm text-gray-500">
          {record.email} • {record.role}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(record)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(record.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RecordItem;