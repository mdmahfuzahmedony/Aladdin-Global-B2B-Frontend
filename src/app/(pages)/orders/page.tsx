'use client';


import React, { useCallback, useEffect, useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ChevronRight,
  X,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '../../../../lib/supabase-client';
import { getValidImageUrl } from '../../../../lib/image-util';


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Delivered'
  | 'Cancelled';

interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  totalAmount: number;
  subtotal?: number;
  deliveryCharge?: number;
  paymentStatus?: string;
  deliveryPaymentStatus?: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  itemsCount: number;
  items: OrderItem[];
}

const normalizeStatus = (status: unknown): OrderStatus => {
  const value = String(status ?? '').toUpperCase();

  if (value === 'DELIVERED') return 'Delivered';

  if (value === 'CANCELLED' || value === 'CANCELED') {
    return 'Cancelled';
  }

  if (
    value === 'PROCESSING' ||
    value === 'CONFIRMED' ||
    value === 'PACKED' ||
    value === 'SHIPPED' ||
    value === 'OUT_FOR_DELIVERY'
  ) {
    return 'Processing';
  }

  return 'Pending';
};

const formatDate = (date: unknown) => {
  if (!date) return '—';

  const parsedDate = new Date(String(date));

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const normalizeOrder = (raw: any): Order => {
  const rawItems = Array.isArray(raw?.items) ? raw.items : [];

  const items: OrderItem[] = rawItems.map((item: any) => {
    const rawImage =
      item.productImage ||
      item.image ||
      item.product?.images?.[0] ||
      item.product?.image ||
      '';
    const image = getValidImageUrl(rawImage);

    return {
      id: String(item.id ?? ''),
      productId: item.productId,
      name: String(
        item.productTitle ??
          item.productName ??
          item.product?.name ??
          item.product?.title ??
          'Product'
      ),
      quantity: Number(item.quantity ?? 0),
      price: Number(item.unitPrice ?? item.price ?? 0),
      image,
    };
  });

  return {
    id: String(raw.id),
    orderNumber: String(raw.orderNumber ?? raw.id),
    date: formatDate(raw.createdAt),
    status: normalizeStatus(raw.status),
    totalAmount: Number(raw.totalAmount ?? 0),
    subtotal: Number(raw.subtotal ?? 0),
    deliveryCharge: Number(raw.deliveryCharge ?? 0),
    paymentStatus: String(raw.paymentStatus ?? 'PENDING'),
    deliveryPaymentStatus: String(raw.deliveryPaymentStatus ?? 'PENDING'),
    shippingName: raw.shippingName ? String(raw.shippingName) : undefined,
    shippingPhone: raw.shippingPhone ? String(raw.shippingPhone) : undefined,
    shippingAddress: [
      raw.shippingAddress,
      raw.shippingUpazila,
      raw.shippingDistrict,
      raw.shippingDivision,
    ]
      .filter(Boolean)
      .join(', '),
    itemsCount: items.reduce((total, item) => total + item.quantity, 0),
    items,
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error('লগইন সেশন যাচাই করা যায়নি।');
      }

      if (!session?.access_token) {
        throw new Error('অর্ডার দেখতে প্রথমে লগইন করো।');
      }

      const response = await fetch(`${API_BASE_URL}/api/customer/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || 'অর্ডার লোড করা যায়নি। আবার চেষ্টা করো।'
        );
      }

      // Controller response: { success: true, count, data: orders }
      const rows = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.orders)
          ? result.data.orders
          : Array.isArray(result.orders)
            ? result.orders
            : [];

      setOrders(rows.map(normalizeOrder));
    } catch (err) {
      setOrders([]);
      setError(
        err instanceof Error
          ? err.message
          : 'অর্ডার লোড করতে সমস্যা হয়েছে।'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search) ||
      order.items.some((item) => item.name.toLowerCase().includes(search));

    const matchesStatus =
      filterStatus === 'All' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
            <CheckCircle size={14} /> Delivered
          </span>
        );

      case 'Processing':
        return (
          <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-medium">
            <Clock size={14} /> Processing
          </span>
        );

      case 'Cancelled':
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-medium">
            <XCircle size={14} /> Cancelled
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-xs font-medium">
            <Package size={14} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">
              My Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and manage your B2B wholesale orders seamlessly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchOrders()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Order ID or product..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-[#0F172A] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void fetchOrders()}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <RefreshCw
                className="mx-auto text-gray-400 mb-3 animate-spin"
                size={32}
              />
              <p className="text-gray-500 font-medium">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-gray-400">Order ID</span>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {order.orderNumber}
                    </h3>
                    <span className="text-xs text-gray-500">
                      Placed on: {order.date}
                    </span>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    {order.items.length > 0 && (
                      <div className="flex -space-x-2 overflow-hidden shrink-0">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border-2 border-white bg-gray-50 shadow-sm"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package size={18} className="text-gray-300" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Items:{' '}
                      <span className="text-gray-500">
                        {order.items.length > 0
                          ? order.items
                              .map((item) => `${item.quantity}x ${item.name}`)
                              .join(', ')
                          : 'No item details'}
                      </span>
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Total quantity: {order.itemsCount}
                    </p>

                    <p className="text-sm font-semibold text-[#0F172A] mt-1">
                      Total: ৳
                      {order.totalAmount.toLocaleString('en-BD', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 text-sm font-semibold text-[#F59E0B] hover:text-[#d97706] transition-colors"
                  >
                    View Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <Package className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500 font-medium">
                {orders.length === 0
                  ? 'No orders found yet.'
                  : 'No orders match your search.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2
                  id="order-details-title"
                  className="text-xl font-bold text-[#0F172A]"
                >
                  Order Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close order details"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-sm text-gray-500">
                {selectedOrder.date}
              </span>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {selectedOrder.shippingAddress && (
              <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-xs">
                <p className="font-semibold text-gray-700">ডেলিভারি ঠিকানা (Shipping Address)</p>
                <p className="mt-1 text-gray-600 font-medium">
                  {selectedOrder.shippingName} {selectedOrder.shippingPhone ? `(${selectedOrder.shippingPhone})` : ''}
                </p>
                <p className="text-gray-500 mt-0.5">{selectedOrder.shippingAddress}</p>
              </div>
            )}

            <div className="border-y border-gray-100 divide-y divide-gray-100">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                            const fallback = event.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="items-center justify-center text-gray-300"
                        style={{ display: item.image ? 'none' : 'flex' }}
                      >
                        <Package size={20} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: {item.quantity} × ৳{item.price.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                    ৳
                    {(item.price * item.quantity).toLocaleString('en-BD', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-1.5 text-xs">
              {Boolean(selectedOrder.subtotal) && (
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>৳{Number(selectedOrder.subtotal).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {Boolean(selectedOrder.deliveryCharge) && (
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Charge</span>
                  <span>৳{Number(selectedOrder.deliveryCharge).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 text-sm font-bold text-[#0F172A] border-t border-gray-100">
                <span>Order Total</span>
                <span className="text-base text-emerald-700">
                  ৳
                  {selectedOrder.totalAmount.toLocaleString('en-BD', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
