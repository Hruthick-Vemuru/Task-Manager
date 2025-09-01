"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import EditTaskModal from "./EditTaskModal"; // ✅ Import the new modal

// Simple SVG icons for actions
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path
      fillRule="evenodd"
      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
      clipRule="evenodd"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
const UndoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 00-1 1v1.172l-5.071 5.071a1 1 0 001.414 1.414L10 6.414l4.657 4.657a1 1 0 001.414-1.414L11 4.172V3a1 1 0 00-1-1zm-3.707 9.293a1 1 0 00-1.414 1.414L10 17.586l5.121-5.121a1 1 0 00-1.414-1.414L10 15.586l-3.707-3.293z"
      clipRule="evenodd"
    />
  </svg>
);

export default function TaskCard({ task, onUpdate, onDelete }) {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false); // ✅ State to control the modal

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        onDelete(task._id);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const toggleStatus = async () => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(data);
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const statusBadgeColor =
    task.status === "completed"
      ? "bg-green-500/20 text-green-400"
      : "bg-yellow-500/20 text-yellow-400";

  const cardBorderColor =
    task.status === "completed" ? "border-green-500/30" : "border-slate-700";

  return (
    <>
      <div
        className={`bg-slate-800 p-4 rounded-lg shadow-lg border ${cardBorderColor} transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-500/50`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1 break-words">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-slate-400 text-sm mb-3 break-words">
                {task.description}
              </p>
            )}
          </div>
          <span
            className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeColor}`}
          >
            {task.status.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between items-center mt-4 border-t border-slate-700 pt-3">
          <span className="text-xs text-slate-500">
            Created:{" "}
            {new Date(task.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={toggleStatus}
              className="text-slate-400 hover:text-white p-2 rounded-full transition-colors bg-slate-700/50 hover:bg-slate-700"
              title={
                task.status === "pending"
                  ? "Mark as Completed"
                  : "Mark as Pending"
              }
            >
              {task.status === "pending" ? <CheckIcon /> : <UndoIcon />}
            </button>

            {/* ✅ ADDED EDIT BUTTON */}
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-white p-2 rounded-full transition-colors bg-slate-700/50 hover:bg-slate-700"
              title="Edit Task"
            >
              <EditIcon />
            </button>

            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors bg-slate-700/50 hover:bg-slate-700"
              title="Delete Task"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ CONDITIONALLY RENDER THE MODAL */}
      {isEditing && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditing(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
