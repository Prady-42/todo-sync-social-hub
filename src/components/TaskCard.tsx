
import React from 'react';
import { Check, Edit, Trash2, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string[];
  createdBy: string;
  createdAt: string;
  sharedWith?: string[];
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onShare: (task: Task) => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete, onShare }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
      task.status === 'completed' && "opacity-70",
      isOverdue && "border-red-200 bg-red-50/30"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(task.id)}
              className={cn(
                "h-6 w-6 rounded-full border-2 p-0",
                task.status === 'completed' 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-gray-300 hover:border-green-400"
              )}
            >
              {task.status === 'completed' && <Check className="h-3 w-3" />}
            </Button>
            <h3 className={cn(
              "font-semibold text-gray-900",
              task.status === 'completed' && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onShare(task)}>
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('-', ' ')}
            </Badge>
          </div>
          
          {task.dueDate && (
            <div className={cn(
              "flex items-center space-x-1 text-sm",
              isOverdue ? "text-red-600" : "text-gray-500"
            )}>
              <Clock className="h-4 w-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {task.sharedWith && task.sharedWith.length > 0 && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
            <User className="h-3 w-3" />
            <span>Shared with {task.sharedWith.length} user{task.sharedWith.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
