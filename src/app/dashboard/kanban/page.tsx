'use client'

import React, { useState, useEffect } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { toast } from 'sonner'
import { Plus, MoreHorizontal, Clock, Play, CheckCircle2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { TaskService } from '@/services/taskService'
import { Task, TaskStats, Subtask } from '@/types/task' // ← Corrigi a importação

// Defina o tipo TaskStatus localmente se necessário
type TaskStatus = 'pendente' | 'andamento' | 'concluida'

const columns = [
  { 
    id: 'pendente' as TaskStatus, // ← CORRIGIDO: TaskStatus, não TaskStats
    title: 'Pendentes', 
    icon: Clock,
    color: 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700',
    headerColor: 'bg-gray-500',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    id: 'andamento' as TaskStatus, // ← CORRIGIDO
    title: 'Em Progresso', 
    icon: Play,
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700',
    headerColor: 'bg-blue-500',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  { 
    id: 'concluida' as TaskStatus, // ← CORRIGIDO
    title: 'Concluído', 
    icon: CheckCircle2,
    color: 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700',
    headerColor: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-300'
  },
]

export default function KanbanPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<'baixa' | 'media' | 'alta'>('media')
  const [newSubtask, setNewSubtask] = useState('')
  const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState<string | null>(null)

  // Carregar tarefas do Firebase
  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  const loadTasks = async () => {
    try {
      if (!user) throw new Error('Usuário não autenticado')
      const userTasks = await TaskService.getUserTasks(user.uid)
      setTasks(userTasks)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
      toast.error('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTitle.trim()) return toast.error('Digite um título para a tarefa')
    if (!user) return toast.error('Usuário não autenticado')
    
    try {
      const newTaskData = {
        title: newTitle,
        description: newDescription,
        dueDate: new Date().toISOString().split('T')[0],
        priority: newPriority,
        status: 'pendente' as TaskStatus, // ← CORRIGIDO: TaskStatus, não TaskStats
        subtasks: [],
        userId: user.uid,
      }
      
      await TaskService.createTask(newTaskData)
      await loadTasks()
      
      setNewTitle('')
      setNewDescription('')
      setNewPriority('media')
      toast.success('Tarefa criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      toast.error('Erro ao criar tarefa')
    }
  }

  const addSubtask = async (taskId: string) => {
    if (!newSubtask.trim()) return toast.error('Digite uma sub-tarefa')
    
    try {
      await TaskService.addSubtask(taskId, {
        title: newSubtask,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      
      setNewSubtask('')
      setSelectedTaskForSubtask(null)
      await loadTasks()
      toast.success('Sub-tarefa adicionada!')
    } catch (error) {
      console.error('Erro ao adicionar sub-tarefa:', error)
      toast.error('Erro ao adicionar sub-tarefa')
    }
  }

  const toggleSubtask = async (taskId: string, subtaskId: string, completed: boolean) => {
    try {
      await TaskService.updateSubtask(taskId, subtaskId, { completed })
      await loadTasks()
    } catch (error) {
      console.error('Erro ao atualizar sub-tarefa:', error)
      toast.error('Erro ao atualizar sub-tarefa')
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result
    
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    try {
      await TaskService.updateTask(draggableId, {
        status: destination.droppableId as TaskStatus // ← CORRIGIDO
      })
      await loadTasks()
      toast.success('Status atualizado!')
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      toast.error('Erro ao atualizar tarefa')
    }
  }

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-500'
      case 'media': return 'bg-yellow-500'
      case 'baixa': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'alta': return 'Alta'
      case 'media': return 'Média'
      case 'baixa': return 'Baixa'
      default: return ''
    }
  }

  const calculateProgress = (subtasks: Subtask[]) => {
    return TaskService.calculateTaskProgress(subtasks)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  if (!user) return <div className="p-8">Usuário não disponível</div>

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Quadro Kanban
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize e acompanhe o progresso das tarefas
          </p>
        </div>

        {/* Add Task Card */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Adicionar nova tarefa
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 space-y-3">
              <input
                type="text"
                placeholder="Título da tarefa..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <input
                type="text"
                placeholder="Descrição..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'baixa' | 'media' | 'alta')}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
              <button
                onClick={addTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={18} />
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6">
            {columns.map((col) => {
              const Icon = col.icon
              const columnTasks = tasks
                .filter((t) => t.status === col.id)
                .sort((a, b) => a.createdAt - b.createdAt)

              return (
                <div key={col.id} className="flex-1 min-w-[320px]">
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`h-full rounded-lg ${col.color} border-2 ${
                          snapshot.isDraggingOver ? 'ring-2 ring-blue-400 border-blue-300' : 'border-transparent'
                        } transition-all`}
                      >
                        {/* Column Header */}
                        <div className={`p-4 rounded-t-lg ${col.headerColor} text-white`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon size={18} />
                              <h3 className="font-semibold">{col.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm font-medium">
                                {columnTasks.length}
                              </span>
                              <button className="hover:bg-white hover:bg-opacity-20 p-1 rounded">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Tasks Container */}
                        <div className="p-3 space-y-3 min-h-[500px] max-h-[70vh] overflow-y-auto">
                          {columnTasks.map((task, index) => {
                            const progress = calculateProgress(task.subtasks)
                            const isExpanded = expandedTasks.has(task.id)
                            
                            return (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
                                      snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
                                    } transition-all cursor-grab active:cursor-grabbing`}
                                  >
                                    {/* Priority Indicator */}
                                    <div className="flex items-center justify-between mb-2 p-3 border-b border-gray-100 dark:border-gray-700">
                                      <div className="flex items-center gap-2">
                                        <GripVertical size={16} className="text-gray-400" />
                                        <div 
                                          className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}
                                          title={`Prioridade ${getPriorityText(task.priority)}`}
                                        />
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                          {getPriorityText(task.priority)}
                                        </span>
                                      </div>
                                      <button 
                                        onClick={() => toggleTaskExpansion(task.id)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                      >
                                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                      </button>
                                    </div>

                                    {/* Task Content */}
                                    <div className="p-3">
                                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm leading-tight">
                                        {task.title}
                                      </h4>
                                      {task.description && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                          {task.description}
                                        </p>
                                      )}

                                      {/* Barra de Progresso */}
                                      {task.subtasks.length > 0 && (
                                        <div className="mb-3">
                                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>Progresso</span>
                                            <span>{progress}%</span>
                                          </div>
                                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                              style={{ width: `${progress}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* Sub-tarefas */}
                                      {isExpanded && (
                                        <div className="mt-3 space-y-2">
                                          {task.subtasks.map((subtask) => (
                                            <div key={subtask.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                              <input
                                                type="checkbox"
                                                checked={subtask.completed}
                                                onChange={(e) => toggleSubtask(task.id, subtask.id, e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                              />
                                              <span className={`text-xs flex-1 ${
                                                subtask.completed 
                                                  ? 'line-through text-gray-400' 
                                                  : 'text-gray-700 dark:text-gray-300'
                                              }`}>
                                                {subtask.title}
                                              </span>
                                            </div>
                                          ))}
                                          
                                          {/* Adicionar sub-tarefa */}
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              placeholder="Nova sub-tarefa..."
                                              value={selectedTaskForSubtask === task.id ? newSubtask : ''}
                                              onChange={(e) => setNewSubtask(e.target.value)}
                                              className="flex-1 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-600"
                                              onKeyPress={(e) => e.key === 'Enter' && addSubtask(task.id)}
                                            />
                                            <button
                                              onClick={() => addSubtask(task.id)}
                                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                                            >
                                              <Plus size={12} />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Task Meta */}
                                    <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>
                                          {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          col.id === 'pendente' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                                          col.id === 'andamento' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-300' :
                                          'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-300'
                                        }`}>
                                          {col.id === 'pendente' ? 'Pendente' : 
                                          col.id === 'andamento' ? 'Em progresso' : 'Concluído'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}

                          {/* Empty State */}
                          {columnTasks.length === 0 && (
                            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                              <div className="text-2xl mb-2">📭</div>
                              <p className="text-sm">Nenhuma tarefa</p>
                              <p className="text-xs mt-1">Arraste tarefas para esta coluna</p>
                            </div>
                          )}
                        </div>

                        {/* Add Card Button */}
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                          <button className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 justify-center">
                            <Plus size={16} />
                            Adicionar cartão
                          </button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}