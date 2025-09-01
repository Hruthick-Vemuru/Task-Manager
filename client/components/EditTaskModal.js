"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function EditTaskModal({ task, onClose, onUpdate }) {
  const { token } = useAuth();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Title cannot be empty.");
      return;
    }
    try {
      const { data: updatedTask } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(updatedTask); // Update the state on the dashboard
      onClose(); // Close the modal
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Update task error:", err);
    }
  };

  return (
    // Modal Backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose} // Close modal if backdrop is clicked
    >
      {/* Modal Content */}
      <div
        className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-2xl font-bold text-white mb-6">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
