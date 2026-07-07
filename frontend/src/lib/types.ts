export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
