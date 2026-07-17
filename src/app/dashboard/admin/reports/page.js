'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button, AlertDialog } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';

export default function Reports() {
  const [reported, setReported] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      const res = await apiFetch(`/campaigns/reported?page=${page}`);
      setReported(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err) {
      toast.error('Failed to load reports');
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const confirmSuspend = async () => {
    if (!suspendTarget) return;
    try {
      await apiFetch(`/campaigns/${suspendTarget._id}/reject`, { method: 'PATCH' });
      toast.success('Campaign suspended');
      setSuspendTarget(null);
      fetchData();
    } catch (err) { toast.error('Failed to suspend campaign'); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/campaigns/${deleteTarget._id}/admin-delete`, { method: 'DELETE' });
      toast.success('Campaign deleted');
      setDeleteTarget(null);
      fetchData();
    } catch (err) { toast.error('Failed to delete campaign'); }
  };

  const columns = [
    { key: 'title', label: 'Campaign' },
    { key: 'reportedBy', label: 'Reported By' },
    { key: 'reportReason', label: 'Reason', render: (v) => <span className="text-red-600 truncate block max-w-[200px]">{v}</span> },
    { key: 'createdAt', label: 'Date', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex space-x-2">
        <Button onPress={() => setSuspendTarget(row)} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs">Suspend</Button>
        <Button onPress={() => setDeleteTarget(row)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Delete</Button>
      </div>
    )},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
      <ResponsiveTable columns={columns} data={reported} emptyMessage="No reported campaigns"
        totalPages={totalPages} page={page} onPageChange={setPage} totalItems={total} />
      {suspendTarget && (
        <AlertDialog isOpen onOpenChange={() => setSuspendTarget(null)}>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="warning" />
                  <AlertDialog.Heading>Suspend this campaign?</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>This will reject <strong>{suspendTarget.title}</strong> reported by {suspendTarget.reportedBy}. The campaign will no longer be visible to supporters.</p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary" onPress={() => setSuspendTarget(null)}>Cancel</Button>
                  <Button variant="danger" onPress={confirmSuspend}>Suspend Campaign</Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      )}
      {deleteTarget && (
        <AlertDialog isOpen onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>Delete this campaign permanently?</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>This will permanently delete <strong>{deleteTarget.title}</strong> and refund all approved supporters. This action cannot be undone.</p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary" onPress={() => setDeleteTarget(null)}>Cancel</Button>
                  <Button variant="danger" onPress={confirmDelete}>Delete Campaign</Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      )}
    </div>
  );
}
