export interface User {
    id?: string;
    email?: string;
    password?: string;
    confPassword?: string;
    age?: number;
    name?: string;
    lastName?: string;
    birthDate?: Date;
    url?: any;
}

export interface Product {
  id?: string;
  type?: string;
  brand?: string;
  price?: number;
  model?: string;
  quantity?: number;
  description?: string;
  url?: string;
  availability?: boolean;
}

export interface Store {
  name?: string;
  id?: string;
}
