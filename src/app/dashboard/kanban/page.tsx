"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TaskService } from "@/services/taskService";
import type { Task } from "@/types/task";
import { Loader2, ListTodo, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function KanbanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const unsubscribe = TaskService.listenTasksByUser(user.uid, (userTasks) => {
      setTasks(userTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, router]);

  const grouped: Record<string, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
    overdue: tasks.filter((t) => t.status === "overdue"),
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const fromCol = source.droppableId;
    const toCol = destination.droppableId;
    if (fromCol === toCol) return;

    try {
      await TaskService.updateTask(draggableId, { status: toCol as any });
    } catch (err) {
      console.error("Erro ao mover tarefa:", err);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return alert("Digite um título para a tarefa.");
    try {
      await TaskService.createTask(user!.uid, {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status as any,
        priority: "media", // ✅ prioridade padrão
      });
      setShowModal(false);
      setNewTask({ title: "", description: "", status: "todo" });
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
          Carregando seu Kanban...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg">
              <ListTodo className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kanban
            </h1>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
          >
            <Plus size={20} /> Nova Tarefa
          </button>
        </header>

        <DragDropContext onDragEnd={onDragEnd}>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "A Fazer", key: "todo", color: "blue" },
              { title: "Em Progresso", key: "in-progress", color: "amber" },
              { title: "Concluídas", key: "done", color: "emerald" },
              { title: "Atrasadas", key: "overdue", color: "rose" },
            ].map((col) => {
              const normalizedKey = col.key.replace("-", "");
              const tasksInColumn = grouped[normalizedKey] || [];

              return (
                <Droppable droppableId={col.key} key={col.key}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20 p-4 min-h-[400px]"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3
                          className={`text-lg font-semibold text-${col.color}-600 dark:text-${col.color}-400`}
                        >
                          {col.title} ({tasksInColumn.length})
                        </h3>
                        <button
                          onClick={() => {
                            setNewTask({ ...newTask, status: col.key });
                            setShowModal(true);
                          }}
                          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          title="Nova tarefa nesta coluna"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {tasksInColumn.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-sm text-center italic">
                            Nenhuma tarefa
                          </p>
                        ) : (
                          tasksInColumn.map((task, index) => (
                            <Draggable
                              draggableId={task.id}
                              index={index}
                              key={task.id}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200/30 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-all relative"
                                >
                                  <button
                                    onClick={async () => {
                                      if (
                                        confirm(
                                          `Tem certeza que deseja deletar "${task.title}"?`
                                        )
                                      ) {
                                        try {
                                          await TaskService.deleteTask(task.id);
                                        } catch (err) {
                                          console.error(
                                            "Erro ao deletar tarefa:",
                                            err
                                          );
                                          alert("Erro ao deletar tarefa.");
                                        }
                                      }
                                    }}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Excluir tarefa"
                                  >
                                    🗑️
                                  </button>

                                  <p className="font-medium text-gray-800 dark:text-gray-200 pr-6">
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </section>
        </DragDropContext>
      </div>

      {/* 🔹 Modal de criação */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Nova Tarefa
            </h2>

            <input
              type="text"
              placeholder="Título"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
