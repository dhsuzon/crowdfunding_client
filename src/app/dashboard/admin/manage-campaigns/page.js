'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button, AlertDialog } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';

export default function ManageCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const res = await apiFetch(`/campaigns/all?page=${page}`);
      setCampaigns(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err) {
      toast.error('Failed to load campaigns');
    }
  };

  useEffect(() => { fetchCampaigns(); }, [page]);

  const handleApprove = async (id) => {
    try {
      await apiFetch(`/campaigns/${id}/approve`, { method: 'PATCH' });
      toast.success('Campaign approved');
      fetchCampaigns();
    } catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const handleReject = async (id) => {
    try {
      await apiFetch(`/campaigns/${id}/reject`, { method: 'PATCH' });
      toast.success('Campaign rejected');
      fetchCampaigns();
    } catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/campaigns/${deleteTarget._id}/admin-delete`, { method: 'DELETE' });
      toast.success('Campaign deleted');
      setDeleteTarget(null);
      fetchCampaigns();
    } catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const confirmReport = async () => {
    if (!reportTarget || !reportReason.trim()) return;
    try {
      await apiFetch(`/campaigns/${reportTarget._id}/report`, {
        method: 'POST',
        body: JSON.stringify({ reason: reportReason.trim() }),
      });
      toast.success('Campaign reported');
      setReportTarget(null);
      setReportReason('');
      fetchCampaigns();
    } catch (err) { toast.error(err?.message || 'Failed to report'); }
  };

  const columns = [
    { key: 'title', label: 'Title', render: (v) => <span className="truncate block max-w-[200px]">{v}</span> },
    { key: 'creatorName', label: 'Creator' },
    { key: 'category', label: 'Category' },
    { key: 'fundingGoal', label: 'Goal', render: (v) => <span className="font-medium">${v}</span> },
    { key: 'amountRaised', label: 'Raised', render: (v) => <span className="text-indigo-600">${v}</span> },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'approved' ? 'bg-green-100 text-green-700' : v === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{v}</span>
    )},
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex space-x-2">
        {row.status === 'pending' && <>
          <Button onPress={() => handleApprove(row._id)} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">Approve</Button>
          <Button onPress={() => handleReject(row._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Reject</Button>
        </>}
        <Button onPress={() => setReportTarget(row)} className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 text-xs">Report</Button>
        <Button onPress={() => setDeleteTarget(row)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs">Delete</Button>
      </div>
    )},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Campaigns</h1>
      <ResponsiveTable columns={columns} data={campaigns} emptyMessage="No campaigns found"
        totalPages={totalPages} page={page} onPageChange={setPage} totalItems={total} />
      {reportTarget && (
        <AlertDialog isOpen onOpenChange={() => { setReportTarget(null); setReportReason(''); }}>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="warning" />
                  <AlertDialog.Heading>Report Campaign</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p className="mb-3">Report <strong>{reportTarget.title}</strong> by {reportTarget.creatorName} as suspicious or fraudulent.</p>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg outline-none resize-none"
                    placeholder="Describe why this campaign is being reported..."
                  />
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary" onPress={() => { setReportTarget(null); setReportReason(''); }}>Cancel</Button>
                  <Button variant="danger" onPress={confirmReport} isDisabled={!reportReason.trim()}>Submit Report</Button>
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
                  <AlertDialog.Heading>Delete campaign permanently?</AlertDialog.Heading>
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
