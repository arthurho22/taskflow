// src/app/dashboard/calendar/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { useAuth } from '@/hooks/useAuth' // ← CORREÇÃO: use hooks/useAuth
import { TaskService } from '@/services/taskService' // ← CORREÇÃO: import TaskService
import { Task } from '@/types/task'
import { Modal, Box, Typography, Chip } from '@mui/material'

const locales = [ptBrLocale]

export default function CalendarPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    // CORREÇÃO: Use getUserTasks em vez de listenTasksByUser (mais simples)
    const loadTasks = async () => {
      try {
        const userTasks = await TaskService.getUserTasks(user.uid)
        setTasks(userTasks)
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error)
      }
    }

    loadTasks()

    // SE QUISER TEMPO REAL, DESCOMENTE ESTE CÓDIGO:
    // const unsubscribe = TaskService.listenTasksByUser(user.uid, setTasks)
    // return () => unsubscribe()
  }, [user])

  const events = tasks
    .filter(task => task.dueDate)
    .map(task => ({
      id: task.id,
      title: task.title,
      date: task.dueDate,
      extendedProps: {
        task: task
      },
      color: getEventColor(task.priority)
    }))

  const getEventColor = (priority: string) => {
    switch (priority) {
      case 'alta': return '#ef4444'
      case 'media': return '#f59e0b'
      case 'baixa': return '#10b981'
      default: return '#6b7280'
    }
  }

  const handleEventClick = (clickInfo: any) => {
    setSelectedTask(clickInfo.event.extendedProps.task)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTask(null)
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'alta': return 'Alta'
      case 'media': return 'Média'
      case 'baixa': return 'Baixa'
      default: return ''
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'warning'
      case 'andamento': return 'info'
      case 'concluida': return 'success'
      default: return 'default'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Usuário não autenticado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Calendário de Tarefas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize suas tarefas por data de vencimento
          </p>
        </div>

        {/* Calendar Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={locales}
            locale="pt-br"
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            height="auto"
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            }}
          />
        </div>

        {/* Modal de Detalhes */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="task-detail-modal"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
            className="dark:bg-gray-800"
          >
            {selectedTask && (
              <div className="space-y-4">
                <Typography id="task-detail-modal" variant="h6" component="h2" className="dark:text-white">
                  {selectedTask.title}
                </Typography>
                
                {selectedTask.description && (
                  <Typography className="dark:text-gray-300">
                    {selectedTask.description}
                  </Typography>
                )}

                <div className="flex gap-2">
                  <Chip 
                    label={getPriorityText(selectedTask.priority)} 
                    color={
                      selectedTask.priority === 'alta' ? 'error' :
                      selectedTask.priority === 'media' ? 'warning' : 'success'
                    }
                    size="small"
                  />
                  <Chip 
                    label={
                      selectedTask.status === 'pendente' ? 'Pendente' :
                      selectedTask.status === 'andamento' ? 'Em Andamento' : 'Concluída'
                    } 
                    color={getStatusColor(selectedTask.status) as any}
                    size="small"
                  />
                </div>

                <Typography className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Vencimento:</strong> {new Date(selectedTask.dueDate).toLocaleDateString('pt-BR')}
                </Typography>

                <Typography className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Criada em:</strong> {new Date(selectedTask.createdAt).toLocaleDateString('pt-BR')}
                </Typography>

                {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                  <div>
                    <Typography variant="subtitle2" className="dark:text-gray-300 mb-2">
                      Sub-tarefas ({selectedTask.subtasks.filter(st => st.completed).length}/{selectedTask.subtasks.length})
                    </Typography>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {selectedTask.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            readOnly
                            className="rounded text-blue-600"
                          />
                          <span className={
                            subtask.completed 
                              ? 'line-through text-gray-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  )
}