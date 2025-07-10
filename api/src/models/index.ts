export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean
  organisationId?: string;
}

export interface Organisation {
  id: string;
  email: string;
  name: string;
  website: string;
  tier: string;
  phone?: string;
  logoUrl?: string;
  address?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  documents?: Document[];
}

export enum Role {
  ADMIN = 1,
  SUPERADMIN = 2,
}
