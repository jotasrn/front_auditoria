import type { User, AutoInfracao } from '../../types';

const AUDITS_STORAGE_KEY = 'semob_audits';
const USER_STORAGE_KEY = 'semob_user';

export const mockInitialUser: User = {
    id: 1560,
    full_name: 'Usuário Não Autenticado',
    sigla: 'GUEST'
};

export const getAudits = (): AutoInfracao[] => {
    const data = localStorage.getItem(AUDITS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const getAuditById = (id: string): AutoInfracao | null => {
    const audits = getAudits();
    return audits.find(audit => audit.id === id) || null;
};

export const saveAudit = (auditData: AutoInfracao): void => {
    let audits = getAudits();
    const existingIndex = audits.findIndex(audit => audit.id === auditData.id);

    if (existingIndex > -1) {
        audits[existingIndex] = auditData;
    } else {
        audits.unshift(auditData);
    }

    localStorage.setItem(AUDITS_STORAGE_KEY, JSON.stringify(audits));
};

export const getUser = (): User | null => {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

export const saveUser = (userData: User): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
}

export const clearUser = (): void => {
    localStorage.removeItem(USER_STORAGE_KEY);
}
