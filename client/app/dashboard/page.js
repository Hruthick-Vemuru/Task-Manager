"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/NavBar";
import TaskCard from "../../components/TaskCard";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { token, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(data);
      } catch (error) {
        console.error("Could not fetch tasks", error);
      }
    };
    if (user) fetchTasks();
  }, [token, user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([data, ...tasks]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task._id !== id));
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-slate-400">Loading...</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content: Task Columns */}
          <main className="flex-grow">
            <h1 className="text-3xl font-bold text-white mb-6">
              Task Management
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pending Tasks Column */}
              <div>
                <h2 className="text-xl font-semibold text-yellow-400 mb-4 tracking-wider">
                  IN PROGRESS ({pendingTasks.length})
                </h2>
                <div className="space-y-4">
                  {pendingTasks.length > 0 ? (
                    pendingTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No pending tasks.</p>
                  )}
                </div>
              </div>

              {/* Completed Tasks Column */}
              <div>
                <h2 className="text-xl font-semibold text-green-400 mb-4 tracking-wider">
                  DONE ({completedTasks.length})
                </h2>
                <div className="space-y-4">
                  {completedTasks.length > 0 ? (
                    completedTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No completed tasks.</p>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">
                Add a New Task
              </h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <input
                    type="text"
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <textarea
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    rows="3"
                    placeholder="Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                >
                  Add Task
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
