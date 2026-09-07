import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  scenarios: {
    // Scenario 1: 100 concurrent users booking walks
    concurrent_bookings: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'bookingFlow',
    },
    // Scenario 2: 50 concurrent sitters responding to job offers
    concurrent_sitters: {
      executor: 'constant-vus',
      vus: 50,
      duration: '1m',
      exec: 'sitterAcceptFlow',
    },
    // Scenario 3: 200 concurrent chatbot queries
    concurrent_chatbot: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 100 },
        { duration: '40s', target: 200 },
        { duration: '20s', target: 0 },
      ],
      exec: 'chatbotFlow',
    },
    // Scenario 4: 30 simultaneous Razorpay webhook events
    concurrent_webhooks: {
      executor: 'per-vu-iterations',
      vus: 30,
      iterations: 5,
      maxDuration: '30s',
      exec: 'webhookFlow',
    },
  },
  thresholds: {
    'http_req_duration{scenario:concurrent_bookings}': ['p(95)<300'], // Core booking p95 < 300ms
    'http_req_duration{scenario:concurrent_chatbot}': ['p(95)<2500'],
    'http_req_failed': ['rate<0.01'], // Error rate < 1%
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

export function bookingFlow() {
  group('Customer Booking Flow', () => {
    const payload = JSON.stringify({
      petId: 'pet_demo_labrador_01',
      serviceCode: 'DOG_WALK_30',
      addressId: 'addr_demo_ahmedabad_01',
      servicePriceId: 'price_demo_walk30_01',
      scheduledStart: new Date(Date.now() + 86400000).toISOString(),
    });
    const params = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-customer-jwt',
      },
    };
    const res = http.post(`${BASE_URL}/api/bookings`, payload, params);
    check(res, {
      'booking created or handled safely': (r) => r.status === 201 || r.status === 409 || r.status === 429,
    });
    sleep(1);
  });
}

export function sitterAcceptFlow() {
  group('Sitter Accept Flow', () => {
    const res = http.post(
      `${BASE_URL}/api/saathi/assignments/assign_demo_101/response`,
      JSON.stringify({ action: 'ACCEPT' }),
      { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer demo-sitter-jwt' } }
    );
    check(res, {
      'sitter response processed': (r) => [200, 409, 404].includes(r.status),
    });
    sleep(1);
  });
}

export function chatbotFlow() {
  group('AI Chatbot Queries', () => {
    const res = http.post(
      `${BASE_URL}/api/ai/chat`,
      JSON.stringify({ message: 'What precautions should I take for my Labrador during monsoon in Mumbai?' }),
      { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer demo-customer-jwt' } }
    );
    check(res, {
      'chatbot query succeeded or rate-limited': (r) => [200, 429].includes(r.status),
    });
    sleep(2);
  });
}

export function webhookFlow() {
  group('Razorpay Webhook Flood', () => {
    const res = http.post(
      `${BASE_URL}/api/webhooks/razorpay`,
      JSON.stringify({
        event: 'payment.captured',
        payload: { payment: { entity: { id: `pay_loadtest_${__VU}`, order_id: 'order_loadtest_01', amount: 29900, currency: 'INR' } } }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'simulated_signature_for_test_load',
          'x-razorpay-event-id': `evt_load_${__VU}_${Date.now()}`,
        }
      }
    );
    check(res, {
      'webhook acknowledged safely': (r) => [200, 202, 401].includes(r.status),
    });
  });
}
