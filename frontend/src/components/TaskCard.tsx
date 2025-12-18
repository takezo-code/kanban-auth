import type { Task } from '../services/task.service';
import { authService } from '../services/auth.service';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onMove: (taskId: number, newStatus: Task['status']) => void;
  onDelete: (taskId: number) => void;
  canEdit: boolean;
}

export function TaskCard({ task, onMove, onDelete, canEdit }: TaskCardProps) {
  const user = authService.getUser();
  const canMove = canEdit || (user?.id === task.assignedTo);

  const getNextStatus = (): Task['status'][] => {
    const transitions: Record<Task['status'], Task['status'][]> = {
      BACKLOG: ['IN_PROGRESS'],
      IN_PROGRESS: ['REVIEW'],
      REVIEW: ['DONE', 'IN_PROGRESS'],
      DONE: [],
    };
    return transitions[task.status] || [];
  };

  const nextStatuses = getNextStatus();

  const handleMove = (newStatus: Task['status']) => {
    onMove(task.id, newStatus);
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
        {canEdit && (
          <button
            className="delete-btn"
            onClick={() => onDelete(task.id)}
            title="Deletar task"
          >
            ×
          </button>
        )}
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-meta">
        {task.assignedToName && (
          <span className="assigned-to">👤 {task.assignedToName}</span>
        )}
        <span className="created-by">Por: {task.createdByName}</span>
      </div>
      {canMove && nextStatuses.length > 0 && (
        <div className="task-actions">
          {nextStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleMove(status)}
              className="move-btn"
            >
              → {status === 'IN_PROGRESS' ? 'Em Progresso' : status === 'REVIEW' ? 'Revisão' : 'Concluído'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

