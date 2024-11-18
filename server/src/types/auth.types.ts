export interface UserPayload {
    userId: number;
    username: string;
  }

  export interface AuthRequest extends Express.Request {
    headers: any;
    user?: UserPayload;
  }

  export interface RegisterInput {
    username: string;
    password: string;
    profilePictureUrl: File | null
  }

  export interface LoginInput {
    username: string;
    password: string;
  }