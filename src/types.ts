export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  color: string | null;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pendiente' | 'completada';
  createdAt: string;
  dueDate: string | null;
  categoryId: number;
  category: Category;
  users: User[];
}
