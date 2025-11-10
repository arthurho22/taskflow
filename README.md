# TASKFLOW - GESTOR DE TAREFAS
Visão Geral: O TaskFlow é um sistema de gerenciamento de tarefas desenvolvido com Next.js 14+, TypeScript, Tailwind CSS e integração com Firebase (Firestore + Authentication). O objetivo é oferecer uma plataforma completa para organização de tarefas, com recursos como Kanban, Calendário, Dashboard com métricas, e acessibilidade digital.
Tecnologias Utilizadas:
Framework: Next.js (App Router) Linguagem: TypeScript Estilização: Tailwind CSS Banco de Dados: Firebase Firestore Autenticação: Firebase Authentication UI/UX: Aceternity UI, Tremor, Framer Motion, Lucide React Funcionalidades Extras:


# Formulários: React Hook Form + Zod Calendário: FullCalendar Kanban: Dnd Kit Temas: Next-Themes Notificações: Sonner Acessibilidade: VLibras + temas visuais


# Estrutura de Pastas:
/app ├── layout.tsx ├── page.tsx (Landing Page) ├── dashboard/page.tsx ├── tasks/page.tsx ├── tasks/[id]/page.tsx ├── kanban/page.tsx ├── calendar/page.tsx /components ├── ui/ ├── layout/ /lib /hooks /types


# Modelagem de Dados (TypeScript):
// /types/user.ts export interface User { id: string; name: string; email: string; }

// /types/task.ts export interface Subtask { id: string; title: string; completed: boolean; }

export interface Task { id: string; title: string; description: string; dueDate: string; priority: 'low' | 'medium' | 'high'; status: 'todo' | 'doing' | 'done'; subtasks: Subtask[]; }


# 1. Clone o repositório
git clone https://github.com/seu-usuario/taskflow.git cd taskflow


# 2. Instale as dependências
npm install
npm install next
npm install react
npm install react-dom
npm install firebase
npm install tailwindcss
npm install autoprefixer
npm install postcss
npm install next-themes
npm install @mui/material
npm install @emotion/react
npm install @emotion/styled
npm install lucide-react
npm install @fullcalendar/react
npm install @fullcalendar/daygrid
npm install @fullcalendar/interaction
npm install @fullcalendar/core
npm install @fullcalendar/core/locales/pt-br
npm install @hello-pangea/dnd
npm install react-firebase-hooks
npm install sonner
npm install -D typescript
npm install -D eslint
npm install -D eslint-config-next
npm install -D @types/react
npm install -D @types/node


# 3. Configure o Firebase
Crie um projeto no Firebase
Ative Firestore e Authentication
Adicione as credenciais no arquivo .env.local


# 4. Execute o projeto
npm run dev


# Funcionalidades:
. Landing Page com menu responsivo e call-to-action. . Cadastro e login via Firebase Authentication. . Dashboard com métricas e gráficos (Tremor). . CRUD completo de tarefas com subtarefas e barra de progresso. . Visualização em calendário (FullCalendar). . Quadro Kanban interativo (Dnd Kit). . Página de detalhes da tarefa com edição completa. . Recursos de acessibilidade (VLibras + temas).


# Desafios Técnicos e Soluções:
Gerenciamento de estado no Kanban: → Usar Zustand ou Context API para sincronizar tarefas entre lista e quadro. Performance do calendário com muitas tarefas: → Implementar lazy loading e paginação. Validação robusta de formulários: → Usar React Hook Form com Zod para tipagem e validação.
