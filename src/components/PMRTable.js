import React, { useState } from 'react';
import { exportToExcel } from '../services/exportService';

function PMRTable({ pmrEntries, onDelete, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null); // Track which row is being edited
  const [formData, setFormData] = useState({}); // Temporary storage for edited data
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state


  const filteredEntries = pmrEntries
    .filter(entry => {
      const combinedText = Object.values(entry).join(' ').toLowerCase();
      return combinedText.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    const handleSort = (key) => {
      const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({ key, direction });
    };
  
    const renderSortArrow = (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === 'asc' ? '▲' : '▼';
      }
      return '⇅';
    };

  const handleExport = () => {
    exportToExcel(filteredEntries, 'PMR_Entries');
  };

  const startEditing = (entry) => {
    setEditingId(entry.id);
    setFormData(entry); // Initialize formData with the current entry data
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveEdit = () => {
    onEdit(editingId, formData); // Call the onEdit function passed from the parent
    cancelEditing(); // Exit edit mode
  };

  const ExpandableText = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    if (text.length <= 100) {
      return <span>{text}</span>;
    }
    return (
      <span>
        {expanded ? text : `${text.slice(0, 100)}...`}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sky-500 ml-2 underline"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </span>
    );
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
      <button onClick={handleExport} style={{borderRadius: "4px", background: "#FC6C85", color: "white", padding: "0px", width: "300px"}}><i className="fas fa-upload text-sky"></i> Export Table to Excel</button>
      <input
        type="text"
        placeholder="Type to start searching your PMR..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky"
      />
      </div>
   
    <br/>

      
  
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-sky text-white">
            <tr>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {renderSortArrow('name')}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort('dateOfInterview')}
              >
                Date of Interview {renderSortArrow('dateOfInterview')}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort('profession')}
              >
                Profession {renderSortArrow('profession')}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort('company')}
              >
                Company {renderSortArrow('company')}
              </th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Current Workflow</th>
              <th className="px-4 py-2 text-left">Challenges & Needs</th>
              <th className="px-4 py-2 text-left">What Was Helpful</th>
              <th className="px-4 py-2 text-left">Other Insights</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  {editingId === entry.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          name="name"
                          value={formData.name || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="dateOfInterview"
                          value={formData.dateOfInterview || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="profession"
                          value={formData.profession || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="company"
                          value={formData.company || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="email"
                          value={formData.email || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="currentWorkflow"
                          value={formData.currentWorkflow || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="challengesAndNeeds"
                          value={formData.challengesAndNeeds || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="whatWasHelpful"
                          value={formData.whatWasHelpful || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="otherInsights"
                          value={formData.otherInsights || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2 flex gap-2 justify-center">
                        <button
                          onClick={saveEdit}
                          className="bg-sky px-3 py-1 text-white rounded hover:bg-sky-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 text-gray-700">{entry.name}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {entry.dateOfInterview}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {entry.profession}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{entry.company}</td>
                      <td className="px-4 py-2 text-gray-700">{entry.email}</td>
                      <td className="px-4 py-2 text-gray-700">
                        <ExpandableText text={entry.currentWorkflow} />
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                      <ExpandableText text={entry.challengesAndNeeds} />
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                      <ExpandableText text={entry.whatWasHelpful} />
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                      <ExpandableText text={entry.otherInsights} />
                      </td>
                      <td className="px-4 py-2 flex gap-2 justify-center">
                        <button
                          onClick={() => startEditing(entry)}
                          className="bg-sky px-3 py-1 text-white rounded hover:bg-sky-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(entry.id)}
                          className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center text-gray-500 py-4"
                >
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );  
}

export default PMRTable;
