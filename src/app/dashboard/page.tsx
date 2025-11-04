'use client'

import Protected from '@/components/protected'
import TaskForm from '@/components/taskForm'
import TaskList from '@/components/taskList'

export default function DashboardPage() {
  return (
    <Protected>
      <div className="max-w-4xl mx-auto py-10">
        <TaskForm />
        <TaskList />
      </div>
    </Protected>
  )
}
