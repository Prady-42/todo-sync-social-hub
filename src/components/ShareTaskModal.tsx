
import React, { useState } from 'react';
import { X, Mail, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from './TaskCard';

interface ShareTaskModalProps {
  task: Task;
  onShare: (taskId: string, emails: string[]) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function ShareTaskModal({ task, onShare, onClose, isOpen }: ShareTaskModalProps) {
  const [email, setEmail] = useState('');
  const [sharedEmails, setSharedEmails] = useState<string[]>(task.sharedWith || []);

  const handleAddEmail = () => {
    if (email && !sharedEmails.includes(email)) {
      setSharedEmails([...sharedEmails, email]);
      setEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setSharedEmails(sharedEmails.filter(e => e !== emailToRemove));
  };

  const handleShare = () => {
    onShare(task.id, sharedEmails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Share Task</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-sm text-gray-600">Share this task with other users by email</p>
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
              />
              <Button onClick={handleAddEmail} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {sharedEmails.length > 0 && (
            <div>
              <Label>Shared with:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {sharedEmails.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleShare}>
              Share Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
