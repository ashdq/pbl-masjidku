"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Logout() {
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleLogout = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            await logout();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md"
            >
                {isLoading ? (
                    <>
                        <span className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        Logging out...
                    </>
                ) : (
                    <>
                        <LogOut className="h-4 w-4" />
                        Logout
                    </>
                )}
            </button>
            
            {error && (
                <div className="absolute top-full mt-2 left-0 bg-red-50 text-red-600 text-sm px-3 py-1 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
}

