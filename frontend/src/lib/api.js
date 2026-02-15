const API_URL = 'http://localhost:8000';

/**
 * Shared helper for API requests with 401 (Unauthorized) detection.
 */
async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
    });

    // If 401 and NOT trying to log in, redirect to login page
    if (response.status === 401 && endpoint !== '/token') {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new Error('Session expired');
    }

    return response;
}

export async function login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiRequest('/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }

    return response.json();
}

export async function logout() {
    const response = await apiRequest('/logout', {
        method: 'POST'
    });
    return response.json();
}

export async function getAdminMe() {
    const response = await apiRequest('/admin/me');

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    return response.json();
}

export async function getDashboardStats() {
    const response = await apiRequest('/dashboard-stats');

    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
}

// Products API
export async function getProducts() {
    const response = await apiRequest('/products/');
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
}

export async function createProduct(productData) {
    const response = await apiRequest('/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create product');
    }
    return response.json();
}

export async function updateProduct(id, productData) {
    const response = await apiRequest(`/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
}

export async function deleteProduct(id) {
    const response = await apiRequest(`/products/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return true;
}

// Denominations API
export async function getDenominations() {
    const response = await apiRequest('/denominations/');
    if (!response.ok) throw new Error('Failed to fetch denominations');
    return response.json();
}

export async function updateDenomination(id, count) {
    const response = await apiRequest(`/denominations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
    });
    if (!response.ok) throw new Error('Failed to update denomination');
    return response.json();
}
// Invoices API
export async function createInvoice(invoiceData) {
    const response = await apiRequest('/invoices/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create invoice');
    }
    return response.json();
}

export async function getInvoices() {
    const response = await apiRequest('/invoices/');
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
}

export async function getInvoice(id) {
    const response = await apiRequest(`/invoices/${id}`);
    if (!response.ok) throw new Error('Failed to fetch invoice details');
    return response.json();
}

export async function previewInvoice(previewData) {
    const response = await apiRequest('/invoices/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(previewData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to calculate preview');
    }
    return response.json();
}
