
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { TaskFilters } from './TaskFilters';
import { TaskCard, Task } from './TaskCard';
import { TaskForm } from './TaskForm';
import { ShareTaskModal } from './ShareTaskModal';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new product landing page',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-07-08',
    createdBy: 'user1',
    createdAt: '2025-07-01',
    sharedWith: ['john@example.com'],
  },
  {
    id: '2',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-07-10',
    createdBy: 'user1',
    createdAt: '2025-07-02',
  },
  {
    id: '3',
    title: 'Review pull requests',
    description: 'Review and merge pending pull requests',
    status: 'completed',
    priority: 'low',
    dueDate: '2025-07-05',
    createdBy: 'user1',
    createdAt: '2025-07-03',
  },
  {
    id: '4',
    title: 'Client meeting preparation',
    description: 'Prepare presentation and demo for client meeting',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-07-06',
    createdBy: 'user1',
    createdAt: '2025-07-04',
    sharedWith: ['sarah@example.com', 'mike@example.com'],
  },
];

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
};

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [sharingTask, setSharingTask] = useState<Task | undefined>();
  const { toast } = useToast();

  // Filter and sort tasks
  useEffect(() => {
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'due':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          const statusOrder = { todo: 1, 'in-progress': 2, completed: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy]);

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData }
          : task
      ));
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: 'user1',
      };
      setTasks(prev => [newTask, ...prev]);
      toast({
        title: "Task created",
        description: "Your new task has been successfully created.",
      });
    }
    setIsTaskFormOpen(false);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed' }
        : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast({
        title: task.status === 'completed' ? "Task reopened" : "Task completed",
        description: task.status === 'completed' ? "Task has been marked as todo." : "Great job completing this task!",
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleShareTask = (task: Task) => {
    setSharingTask(task);
    setIsShareModalOpen(true);
  };

  const handleSaveSharedTask = (taskId: string, emails: string[]) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, sharedWith: emails }
        : task
    ));
    toast({
      title: "Task shared",
      description: `Task has been shared with ${emails.length} user${emails.length > 1 ? 's' : ''}.`,
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length;
    
    return { total, completed, inProgress, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar user={mockUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onCreateTask={handleCreateTask}
        />

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onShare={handleShareTask}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No tasks found</div>
            <div className="text-gray-400 text-sm mt-1">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Create your first task to get started'}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskForm
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={() => setIsTaskFormOpen(false)}
        isOpen={isTaskFormOpen}
      />

      {sharingTask && (
        <ShareTaskModal
          task={sharingTask}
          onShare={handleSaveSharedTask}
          onClose={() => setIsShareModalOpen(false)}
          isOpen={isShareModalOpen}
        />
      )}
    </div>
  );
}
