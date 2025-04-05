import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    prueba_1_us_daily: {
      executor: 'constant-vus',
      exec: 'pruebaUSDaily',
      vus: 20,
      duration: '15s',
    },
    prueba_2_estados: {
      executor: 'constant-vus',
      exec: 'pruebaStatesList',
      vus: 30,
      duration: '15s',
      startTime: '16s',
    },
    prueba_3_estado_especifico: {
      executor: 'constant-vus',
      exec: 'pruebaStateCA',
      vus: 25,
      duration: '15s',
      startTime: '32s',
    },
    prueba_4_info_general: {
      executor: 'constant-vus',
      exec: 'pruebaInfoGeneral',
      vus: 20,
      duration: '15s',
      startTime: '48s',
    },
    prueba_5_estres: {
      executor: 'ramping-vus',
      exec: 'pruebaEstres',
      startTime: '64s',
      stages: [
        { duration: '10s', target: 50 },
        { duration: '10s', target: 100 },
        { duration: '10s', target: 200 },
        { duration: '10s', target: 0 },
      ],
    },
  },
};

// Prueba 1: Datos diarios de EE. UU.
export function pruebaUSDaily() {
  const res = http.get('https://api.covidtracking.com/v1/us/daily.json');
  check(res, {
    'Prueba 1: status 200': (r) => r.status === 200,
    'Prueba 1: contiene datos': (r) => Array.isArray(r.json()) && r.json().length > 0,
  });
  sleep(1);
}

// Prueba 2: Lista de estados disponibles
export function pruebaStatesList() {
  const res = http.get('https://api.covidtracking.com/v1/states/info.json');
  check(res, {
    'Prueba 2: status 200': (r) => r.status === 200,
    'Prueba 2: contiene lista de estados': (r) => Array.isArray(r.json()) && r.json().length > 0,
  });
  sleep(1);
}

// Prueba 3: Estado específico (California)
export function pruebaStateCA() {
  const res = http.get('https://api.covidtracking.com/v1/states/ca/daily.json');
  check(res, {
    'Prueba 3: status 200': (r) => r.status === 200,
    'Prueba 3: contiene datos para CA': (r) => Array.isArray(r.json()) && r.json().length > 0,
  });
  sleep(1);
}

// Prueba 4: Información general (meta)
export function pruebaInfoGeneral() {
  const res = http.get('https://api.covidtracking.com/v1/info.json');
  check(res, {
    'Prueba 4: status 200': (r) => r.status === 200,
    'Prueba 4: contiene campo totalTestResults': (r) => r.json().totalTestResults !== undefined,
  });
  sleep(1);
}

// Prueba 5: Estrés sobre endpoint general
export function pruebaEstres() {
  const res = http.get('https://api.covidtracking.com/v1/us/current.json');
  check(res, {
    'Prueba 5 (estrés): status 200': (r) => r.status === 200,
    'Prueba 5 (estrés): respuesta < 800ms': (r) => r.timings.duration < 800,
  });
  sleep(0.5);
}
