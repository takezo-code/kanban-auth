import { useEffect, useState } from 'react';
import { taskService } from '../services/task.service';
import type { Task } from '../services/task.service';
import { authService } from '../services/auth.service';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import './KanbanBoard.css';

const STATUSES: Task['status'][] = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DONE'];
const STATUS_LABELS: Record<Task['status'], string> = {
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'Em Progresso',
  REVIEW: 'Revisão',
  DONE: 'Concluído',
};

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const user = authService.getUser();
  const isAdmin = user?.role === 'ADMIN';

  const loadTasks = async () => {
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async () => {
    await loadTasks();
    setShowCreateModal(false);
  };

  const handleMoveTask = async (taskId: number, newStatus: Task['status']) => {
    try {
      await taskService.move(taskId, { newStatus });
      await loadTasks();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao mover task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta task?')) return;
    try {
      await taskService.delete(taskId);
      await loadTasks();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao deletar task');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    window.location.reload();
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="kanban-container">
      <header className="kanban-header">
        <div>
          <h1>Kanban Board</h1>
          <p className="user-info">
            {user?.name} ({user?.role})
          </p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              + Nova Task
            </button>
          )}
          <button onClick={handleLogout} className="btn-secondary">
            Sair
          </button>
        </div>
      </header>

      <div className="kanban-board">
        {STATUSES.map((status) => (
          <div key={status} className="kanban-column">
            <div className="column-header">
              <h3>{STATUS_LABELS[status]}</h3>
              <span className="task-count">{getTasksByStatus(status).length}</span>
            </div>
            <div className="column-content">
              {getTasksByStatus(status).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onMove={handleMoveTask}
                  onDelete={handleDeleteTask}
                  canEdit={isAdmin}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateTask}
        />
      )}
    </div>
  );
}

