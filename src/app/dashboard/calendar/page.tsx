'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { listenTasksByUser } from '@/services/taskService'
import { Task } from '@/types/task'

const locales = {
  'pt-BR': ptBR,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = listenTasksByUser(user.uid, (data: Task[]) => {
      const mapped = data.map((task) => ({
        id: task.id,
        title: `${task.title} (${task.status})`,
        start: new Date(task.createdAt),
        end: new Date(task.createdAt + 60 * 60 * 1000), // 1h de duração
        allDay: false,
      }))
      setEvents(mapped)
    })

    return () => unsubscribe()
  }, [user])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        📅 Calendário de Tarefas
      </h1>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          messages={{
            next: 'Próximo',
            previous: 'Anterior',
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            agenda: 'Agenda',
            showMore: (total) => `+${total} mais`,
          }}
        />
      </div>
    </div>
  )
}
