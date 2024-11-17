import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const AssignmentModal = ({ seance, isEditing, groups, onSave, onDelete, onClose }) => {
  const [assignmentData, setAssignmentData] = useState({
    title: seance ? seance.title : "",
    group: seance ? seance.group : "",
    startTime: seance ? seance.startTime : "",
    endTime: seance ? seance.endTime : "",
    saleName: seance ? seance.saleName : "",
    day: seance ? seance.day : "",
    id: seance ? seance.id : null,
  });

  useEffect(() => {
    if (seance) {
      setAssignmentData({
        title: seance.title,
        group: seance.group,
        startTime: seance.startTime,
        endTime: seance.endTime,
        saleName: seance.saleName,
        day: seance.day,
        id: seance.id,
      });
    }
  }, [seance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(assignmentData);
    onClose();  // Close modal after saving
  };

  const handleDelete = () => {
    onDelete(assignmentData.id);
    onClose();  // Close modal after deleting
  };

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? "Edit Assignment" : "New Assignment"}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}  // Close the modal
            />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={assignmentData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Group</label>
              <select
                className="form-control"
                name="group"
                value={assignmentData.group}
                onChange={handleInputChange}
              >
                {groups.length === 0 ? (
                  <option>No groups available</option>
                ) : (
                  groups.map((group) => (
                    <option key={group.codeGroupe} value={group.intituleGroupe}>
                      {group.intituleGroupe}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Sale Name</label>
              <input
                type="text"
                className="form-control"
                name="saleName"
                value={assignmentData.saleName}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                name="startTime"
                value={assignmentData.startTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                name="endTime"
                value={assignmentData.endTime}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            {isEditing ? (
              <>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                <button className="btn btn-primary" onClick={handleSave}>Save changes</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleSave}>Save new assignment</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
