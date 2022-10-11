export interface User {
    email?: string;
    password?: string;
    confPassword?: string;
    age?: number;
    name?: string;
    lastName?: string;
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
