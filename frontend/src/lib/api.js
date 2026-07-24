const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function getDishes() {
  const res = await fetch(`${API_URL}/api/dishes`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load the menu');
  }
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

export async function getOrders(token, status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await fetch(`${API_URL}/api/orders${query}`, {
    cache: 'no-store',
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function updateOrderStatus(token, id, estat) {
  const res = await fetch(`${API_URL}/api/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ estat }),
  });
  return handleResponse(res);
}

export async function getAllDishes(token) {
  const res = await fetch(`${API_URL}/api/dishes/all`, {
    cache: 'no-store',
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function createDish(token, dish) {
  const res = await fetch(`${API_URL}/api/dishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(dish),
  });
  return handleResponse(res);
}

export async function updateDish(token, id, dish) {
  const res = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(dish),
  });
  return handleResponse(res);
}

export async function deleteDish(token, id) {
  const res = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function createOrder(payload) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function simulatePayment(orderId) {
  const res = await fetch(`${API_URL}/api/orders/${orderId}/simulate-payment`, {
    method: 'POST',
  });
  return handleResponse(res);
}

export async function getOrderHistory(token) {
  const res = await fetch(`${API_URL}/api/orders/history`, {
    cache: 'no-store',
    headers: authHeaders(token),
  });
  return handleResponse(res);
}
