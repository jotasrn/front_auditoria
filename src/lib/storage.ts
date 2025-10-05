import { mockAutos, mockUser } from './mock-data';

const AUDITS_STORAGE_KEY = 'semob_audits';
const USER_STORAGE_KEY = 'semob_user';

// --- Funções para Auditorias ---

export const getAudits = (): any[] => {
  const data = localStorage.getItem(AUDITS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(AUDITS_STORAGE_KEY, JSON.stringify(mockAutos));
    return mockAutos;
  }
  return JSON.parse(data);
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

// --- Funções para Usuário ---

export const getUser = (): any => {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    if (!data) {
        // Se for a primeira vez, salva o mock user e o retorna
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
        return mockUser;
    }
    return JSON.parse(data);
}

export const saveUser = (userData: any): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
}