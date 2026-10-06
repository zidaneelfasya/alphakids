'use client';

import { useState } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface AdminOrderItem {
  id: string;
  orderNumber: string;
  status: 'draft' | 'pending' | 'paid' | 'expired' | 'failed' | 'cancelled';
  subtotal: number;
  discountTotal: number;
  total: number;
  createdAt: Date | string;
  user: {
    id: string;
    fullName: string | null;
    email: string | null;
  };
  programTitle: string;
  payment?: {
    provider: string;
    providerTransactionId: string | null;
    paymentMethod: string | null;
    status: string;
    paidAt: Date | string | null;
  } | null;
  voucherCode?: string | null;
}

interface TransactionsManagerProps {
  orders: AdminOrderItem[];
}

export function TransactionsManager({ orders }: TransactionsManagerProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.user.email && o.user.email.toLowerCase().includes(search.toLowerCase())) ||
      (o.user.fullName && o.user.fullName.toLowerCase().includes(search.toLowerCase())) ||
      o.programTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Lunas
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu
          </span>
        );
      case 'cancelled':
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            {status === 'cancelled' ? 'Batal' : 'Gagal'}
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            Kadaluarsa
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            Monitoring Transaksi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar seluruh riwayat pesanan dan status penyelesaian pembayaran peserta.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-slate-400 font-medium">Total Pesanan: </span>
            <span className="font-bold text-slate-900">{orders.length}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-emerald-600 font-medium">Lunas: </span>
            <span className="font-bold text-emerald-800">
              {orders.filter((o) => o.status === 'paid').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor pesanan, nama peserta, email, atau judul program..."
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-full sm:w-auto"
          >
            <option value="all">Semua Status</option>
            <option value="paid">Lunas (Paid)</option>
            <option value="pending">Menunggu Pembayaran</option>
            <option value="cancelled">Dibatalkan</option>
            <option value="expired">Kadaluarsa</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="py-3 px-4">No. Pesanan</th>
                <th className="py-3 px-4">Peserta</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada transaksi yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                      <span className="block font-sans text-[10px] text-slate-400 font-normal">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block line-clamp-1">
                        {order.user.fullName || 'Tanpa Nama'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {order.user.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium max-w-[200px] truncate">
                      {order.programTitle}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      Rp {order.total.toLocaleString('id-ID')}
                      {order.discountTotal > 0 && (
                        <span className="block text-[10px] text-amber-600 font-sans font-normal">
                          Hemat Rp {order.discountTotal.toLocaleString('id-ID')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {order.payment?.provider ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 uppercase tracking-wider text-slate-700">
                          {order.payment.provider}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg flex items-center justify-between">
              <span>Detail Transaksi</span>
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-2 text-xs">
              {/* Order Info */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Pesanan:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Pemesanan:</span>
                  <span className="text-slate-700">
                    {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Program:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {selectedOrder.programTitle}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-900 block">
                  Informasi Pembeli:
                </span>
                <div className="border border-slate-100 p-3 rounded-xl space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama:</span>
                    <span className="text-slate-800 font-medium">
                      {selectedOrder.user.fullName || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-slate-800">
                      {selectedOrder.user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-900 block">
                  Rincian Pembayaran:
                </span>
                <div className="border border-slate-100 p-3 rounded-xl space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Harga Program:</span>
                    <span className="font-mono text-slate-800">
                      Rp {selectedOrder.subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {selectedOrder.discountTotal > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span>Potongan Diskon:</span>
                      <span className="font-mono font-semibold">
                        - Rp {selectedOrder.discountTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Pembayaran:</span>
                    <span className="font-mono">
                      Rp {selectedOrder.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gateway Provider Details */}
              {selectedOrder.payment && (
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-900 block">
                    Data Settlement Gateway:
                  </span>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Provider:</span>
                      <span className="font-bold uppercase text-slate-800">
                        {selectedOrder.payment.provider}
                      </span>
                    </div>
                    {selectedOrder.payment.providerTransactionId && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">ID Transaksi Gateway:</span>
                        <span className="text-slate-800 truncate max-w-[200px]">
                          {selectedOrder.payment.providerTransactionId}
                        </span>
                      </div>
                    )}
                    {selectedOrder.payment.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Metode:</span>
                        <span className="text-slate-800 capitalize">
                          {selectedOrder.payment.paymentMethod}
                        </span>
                      </div>
                    )}
                    {selectedOrder.payment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Waktu Lunas:</span>
                        <span className="text-slate-800">
                          {new Date(selectedOrder.payment.paidAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
