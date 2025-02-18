import React, { createContext, useState, useContext } from 'react';
import { UserProviderProps, UserContextType } from '../types/context';
import { User } from '../types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: User = {
    _id: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    stylePreferences: {
        primaryButtonColor: '#0039FF',
        secondaryButtonColor: '#5549FF',
        backgroundColor: '#222227',
        textColor: '#000000',
        labelColor: '#ffffff',
        noteColor: '#ffffff'
    },
    layout: 'tiles'
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>(defaultUser); // Default is the guest user

    return (
    <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
    );
};

// Create a custom hook to consume the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
    throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};