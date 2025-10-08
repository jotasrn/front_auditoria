import MD5 from 'crypto-js/md5';

const BASE_URL = 'http://10.233.144.111:8080';
const basicAuthCredentials = btoa('LEVEL_33:SEMOB_LEVEL_33_DESEN');

export interface LoginResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const LoginService = {
  convertToMd5Hex(password: string): string {
    return MD5(password).toString().toUpperCase();
  },

  async login(username: string, senha: string): Promise<LoginResponse> {
    const url = `${BASE_URL}/valida-md5/validar`;
    const senhaHasheada = this.convertToMd5Hex(senha);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha: senhaHasheada }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 200 || response.status === 201) {
        const json = await response.json();

        if (json.mensagem === 'Acesso permitido') {
          if (json.id_usuario) {
            localStorage.setItem('userId', json.id_usuario.toString());
          }
          if (username) {
            localStorage.setItem('username', username);
          }

          return { success: true, data: json };
        } else {
          return { success: false, error: 'Credenciais inválidas' };
        }
      }

      if (response.status === 401) {
        return { success: false, error: 'Credenciais inválidas' };
      } else if (response.status === 403) {
        return {
          success: false,
          error: 'Acesso não permitido.\nEntre em contato com o Administrador.',
        };
      }

      return {
        success: false,
        error: `Erro no servidor: ${response.status}`,
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Timeout' };
      }

      console.error('Erro de conexão:', error);
      return {
        success: false,
        error: 'Erro de conexão: Verifique sua conexão com a internet.',
      };
    }
  },

  async getFuncionarioDetails(userId: number): Promise<any> {
  const url = `${BASE_URL}/funcionario/${userId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuthCredentials}`,
      }
    });
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados do funcionário: ${response.status}`);
    }
      return await response.json();
    } catch (error: any) {
      console.error('Erro ao buscar detalhes do funcionário:', error);
      throw error;
    }
  },
};
