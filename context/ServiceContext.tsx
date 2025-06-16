import React, { createContext, useContext, ReactNode } from 'react';
import { IAppFacadeService } from '@/services/IAppFacadeService';
import { AppFacadeService } from '@/services/AppFacadeService';

interface ServiceContextType {
    appFacade: IAppFacadeService;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

interface ServiceProviderProps {
    children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
    const appFacade = AppFacadeService.getInstance();

    return (
        <ServiceContext.Provider value={{ appFacade }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServices = (): ServiceContextType => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
};

export const useAppFacade = (): IAppFacadeService => {
    const { appFacade } = useServices();
    return appFacade;
};