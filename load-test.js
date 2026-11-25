import http from 'k6/http';
import { check, sleep } from 'k6';

const budget = Number(__ENV.P95_LIMIT_MS);
const staged = __ENV.MODE === 'staged';

export const options = {
  summaryTrendStats: ['avg', 'med', 'min', 'max', 'p(90)', 'p(95)', 'p(99)'],
  ...(staged
    ? {
        stages: [
          { duration: '30s', target: 5 },
          { duration: '1m', target: 30 },
          { duration: '30s', target: 100 },
          { duration: '30s', target: 0 },
        ],
      }
    : { vus: 5, duration: '30s' }),
  ...(budget > 0
    ? {
        thresholds: {
          http_req_duration: ['p(95)<' + budget],
          http_req_failed: ['rate<0.01'],
        },
      }
    : {}),
};

export default function () {
  const response = http.get('http://127.0.0.1:3202/health');
  check(response, { 'health endpoint returns 200': (result) => result.status === 200 });
  sleep(1);
}
