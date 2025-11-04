'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth' // ajuste o path se necessário
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'

import { listenTasksByUser, updateTask } from '@/services/taskService'
import { Task, TaskStatus } from '@/types/task'
import { toast } from 'sonner'

const columns = [
  { id: 'pendente', title: '🕓 Pendentes' },
  { id: 'andamento', title: '🚧 Em andamento' },
  { id: 'concluida', title: '✅ Concluídas' },
]

export default function KanbanPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!user?.uid) return
    const unsubscribe = listenTasksByUser(user.uid, (data) => setTasks(data))
    return () => unsubscribe()
  }, [user])

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination || destination.droppableId === source.droppableId) return

    try {
      await updateTask(draggableId, { status: destination.droppableId as TaskStatus })
      toast.success('Status atualizado!')
    } catch {
      toast.error('Erro ao mover tarefa.')
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-950">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        🧩 Quadro Kanban
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 min-h-[500px]"
                >
                  <h2 className="text-xl font-semibold mb-3 text-center">
                    {col.title}
                  </h2>

                  {tasks
                    .filter((t) => t.status === col.id)
                    .map((task, index) => (
                      <Draggable
                        draggableId={task.id!}
                        index={index}
                        key={task.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-3 shadow-sm hover:shadow-md transition"
                          >
                            <h3 className="font-medium">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {task.description}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
