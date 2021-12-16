import fetch from 'node-fetch';
import querystring from 'querystring';
import LoginCookie from './loginCookie.js';
import { BASE_ENDPOINT, DEFAULT_HEADERS } from './constants.js';
import BBChecking from './checking/index.js';

const refreshHash = async () => {
  const hashUrl = 'hash';
  const params = { id: '00000000000000000000000000000000' };

  const response = await fetch(`${BASE_ENDPOINT}${hashUrl}`, {
    headers: DEFAULT_HEADERS,
    method: 'POST',
    body: querystring.stringify(params),
  });

  const hash = await response.text();

  return hash;
};

export default class BB {
  checking = null;

  savings = null;

  creditCard = null;

  constructor() {
    LoginCookie.setGlobal();
  }

  isLoggedIn() {
    return !!LoginCookie.getGlobal();
  }

  async login({ branch, account, password }) {
    const loginUrl = 'servico/ServicoLogin/login';
    const hash = await refreshHash();

    const params = {
      idh: hash,
      dependenciaOrigem: branch,
      numeroContratoOrigem: account,
      senhaConta: password,
      titularidade: '1',
      apelido: 'NickRandom.123456',
      idDispositivo: '2131296671',
    };

    const response = await fetch(`${BASE_ENDPOINT}${loginUrl}`, {
      headers: DEFAULT_HEADERS,
      method: 'POST',
      body: querystring.stringify(params),
    });

    LoginCookie.setGlobal(response.headers.get('set-cookie'));

    const text = await response.text();
    const { login } = JSON.parse(text);

    this.checking = new BBChecking();

    return login;
  }
}
