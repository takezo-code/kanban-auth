import { useState, useEffect } from 'react';
import { taskService } from '../services/task.service';
import { userService } from '../services/user.service';
import type { User } from '../services/user.service';
import './CreateTaskModal.css';

interface CreateTaskModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTaskModal({ onClose, onSuccess }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await taskService.create({
        title,
        description: description || undefined,
        assignedTo,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Task</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Digite o título da task"
            />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Digite a descrição (opcional)"
            />
          </div>
          <div className="form-group">
            <label>Atribuir a</label>
            <select
              value={assignedTo || ''}
              onChange={(e) => setAssignedTo(e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">Ninguém</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Criando...' : 'Criar Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

