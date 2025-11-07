"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { useAuth } from "@/hooks/useAuth";
import { TaskService } from "@/services/taskService";
import { Task } from "@/types/task";
import {
  Modal,
  Box,
  Typography,
  Chip,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const locales = [ptBrLocale];

export default function CalendarPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: "alta" | "media" | "baixa";
  }>({
    title: "",
    description: "",
    priority: "media",
  });

  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      try {
        const userTasks = await TaskService.getUserTasks(user.uid);
        setTasks(userTasks);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    };

    loadTasks();
  }, [user]);

  const getEventColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "#ef4444";
      case "media":
        return "#f59e0b";
      case "baixa":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      id: task.id,
      title: task.title,
      date: task.dueDate,
      extendedProps: {
        task: task,
      },
      color: getEventColor(task.priority),
    }));

  const handleEventClick = (clickInfo: any) => {
    setSelectedTask(clickInfo.event.extendedProps.task);
    setModalOpen(true);
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !selectedDate || !user) {
      alert("Preencha o título e selecione uma data.");
      return;
    }

    try {
      await TaskService.createTask(user.uid, {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority, // ✅ usa o valor escolhido
        status: "todo",
        dueDate: selectedDate.toISOString().split("T")[0],
      });

      setCreateModalOpen(false);
      setNewTask({ title: "", description: "", priority: "media" });

      // 🔥 Corrigido: buscar as tarefas novamente
      const updated = await TaskService.getUserTasks(user.uid);
      setTasks(updated);
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "alta":
        return "Alta";
      case "media":
        return "Média";
      case "baixa":
        return "Baixa";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "warning";
      case "andamento":
        return "info";
      case "concluida":
        return "success";
      default:
        return "default";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Usuário não autenticado
          </p>
        </div>
      </div>
    );
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
            Visualize e crie tarefas por data de vencimento
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={locales}
            locale="pt-br"
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            selectable={true}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            height="auto"
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
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
            className="dark:bg-gray-800"
          >
            {selectedTask && (
              <div className="space-y-4">
                <Typography
                  id="task-detail-modal"
                  variant="h6"
                  component="h2"
                  className="dark:text-white"
                >
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
                      selectedTask.priority === "alta"
                        ? "error"
                        : selectedTask.priority === "media"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                  <Chip
                    label={
                      selectedTask.status === "todo"
                        ? "Pendente"
                        : selectedTask.status === "in-progress"
                        ? "Em Andamento"
                        : selectedTask.status === "done"
                        ? "Concluída"
                        : "Atrasada"
                    }
                    color={getStatusColor(selectedTask.status) as any}
                    size="small"
                  />
                </div>

                {selectedTask.dueDate && (
                  <Typography className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Vencimento:</strong>{" "}
                    {new Date(selectedTask.dueDate).toLocaleDateString("pt-BR")}
                  </Typography>
                )}
              </div>
            )}
          </Box>
        </Modal>

        {/* Modal de Criação */}
        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          aria-labelledby="create-task-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
            className="dark:bg-gray-800"
          >
            <Typography
              variant="h6"
              component="h2"
              className="dark:text-white mb-4"
            >
              Nova Tarefa - {selectedDate?.toLocaleDateString("pt-BR")}
            </Typography>

            <TextField
              label="Título"
              fullWidth
              margin="dense"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <TextField
              label="Descrição"
              fullWidth
              margin="dense"
              multiline
              minRows={2}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <TextField
              select
              label="Prioridade"
              fullWidth
              margin="dense"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value as "alta" | "media" | "baixa",
                })
              }
            >
              <MenuItem value="alta">Alta</MenuItem>
              <MenuItem value="media">Média</MenuItem>
              <MenuItem value="baixa">Baixa</MenuItem>
            </TextField>

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => setCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTask}
              >
                Criar
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
