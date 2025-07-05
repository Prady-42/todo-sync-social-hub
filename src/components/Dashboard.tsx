import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { TaskCard, Task } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { ShareTaskModal } from '@/components/ShareTaskModal';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [shareModalTask, setShareModalTask] = useState<Task | undefined>();
  const { toast } = useToast();

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/placeholder.svg'
  };

  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Write and submit the Q1 project proposal',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-01-15',
        createdAt: '2024-01-01',
        createdBy: 'john@example.com',
        sharedWith: ['alice@example.com']
      },
      {
        id: '2',
        title: 'Review team feedback',
        description: 'Go through all team feedback from last sprint',
        status: 'todo',
        priority: 'medium',
        dueDate: '2024-01-12',
        createdAt: '2024-01-02',
        createdBy: 'john@example.com',
        sharedWith: []
      },
      {
        id: '3',
        title: 'Update documentation',
        description: 'Update API documentation with latest changes',
        status: 'completed',
        priority: 'low',
        dueDate: '2024-01-10',
        createdAt: '2024-01-03',
        createdBy: 'john@example.com',
        sharedWith: ['bob@example.com']
      }
    ];
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
  }, []);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: user.email
    };
    
    setTasks(prev => [newTask, ...prev]);
    setIsTaskFormOpen(false);
    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!editingTask) return;
    
    const updatedTask: Task = {
      ...editingTask,
      ...taskData
    };
    
    setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    });
  };

  const handleShareTask = (task: Task) => {
    setShareModalTask(task);
  };

  const handleTaskShare = (taskId: string, emails: string[]) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, sharedWith: [...(task.sharedWith || []), ...emails] }
        : task
    ));
    setShareModalTask(undefined);
    toast({
      title: "Task shared",
      description: `Task shared with ${emails.join(', ')}`,
    });
  };

  const handleFiltersChange = (filtered: Task[]) => {
    setFilteredTasks(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-1">Manage your tasks and collaborate with others</p>
          </div>
          <Button onClick={() => setIsTaskFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <TaskFilters tasks={tasks} onFiltersChange={handleFiltersChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onShare={handleShareTask}
              currentUser={user.email}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks found</p>
            <p className="text-gray-400">Create your first task to get started</p>
          </div>
        )}
      </div>

      <TaskForm
        task={editingTask}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        onCancel={() => {
          setIsTaskFormOpen(false);
          setEditingTask(undefined);
        }}
        isOpen={isTaskFormOpen}
      />

      <ShareTaskModal
        task={shareModalTask}
        onShare={handleTaskShare}
        onClose={() => setShareModalTask(undefined)}
        isOpen={!!shareModalTask}
      />
    </div>
  );
}
