export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: 'patient' | 'doctor' | 'admin';
    createdAt: Date;
    updatedAt: Date;
  }
  