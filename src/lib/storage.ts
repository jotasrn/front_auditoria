// src/lib/storage.ts

const AUDITS_STORAGE_KEY = 'semob_audits';
const USER_STORAGE_KEY = 'semob_user';

interface StoredUser {
    id: number; 
    full_name: string;
    sigla: string;
}

export const mockInitialUser: StoredUser = {
    id: 1560,
    full_name: 'Usuário Não Autenticado',
    sigla: 'GUEST'
};

// --- Funções para Auditorias ---

export const getAudits = (): any[] => {
    const data = localStorage.getItem(AUDITS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const getAuditById = (id: string): any | null => {
    const audits = getAudits();
    return audits.find(audit => audit.id === id) || null;
};

export const saveAudit = (auditData: any): void => {
    let audits = getAudits();
    const existingIndex = audits.findIndex(audit => audit.id === auditData.id);

    if (existingIndex > -1) {
        audits[existingIndex] = auditData;
    } else {
        audits.unshift(auditData);
    }

    localStorage.setItem(AUDITS_STORAGE_KEY, JSON.stringify(audits));
};

export const getUser = (): StoredUser | null => { 
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null; 
}

export const saveUser = (userData: StoredUser): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
}

export const clearUser = (): void => {
    localStorage.removeItem(USER_STORAGE_KEY);
}