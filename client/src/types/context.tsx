import { ReactNode } from 'react';
import { User } from "./user";

export type UserProviderProps = {
    children: ReactNode
}

export type UserContextType = {
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>;
}