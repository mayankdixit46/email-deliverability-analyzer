import { useEffect, useState } from 'react';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { domainsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState({ domain_name: '', description: '' });

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const { data } = await domainsAPI.getAll();
      setDomains(data.domains);
    } catch (error) {
      toast.error('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    try {
      await domainsAPI.create(newDomain);
      toast.success('Domain added successfully');
      setNewDomain({ domain_name: '', description: '' });
      setShowAddModal(false);
      fetchDomains();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add domain');
    }
  };

  const handleDeleteDomain = async (id) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;

    try {
      await domainsAPI.delete(id);
      toast.success('Domain deleted successfully');
      fetchDomains();
    } catch (error) {
      toast.error('Failed to delete domain');
    }
  };

  const handleVerifyDomain = async (id) => {
    try {
      await domainsAPI.verify(id);
      toast.success('Domain verified successfully');
      fetchDomains();
    } catch (error) {
      toast.error('Failed to verify domain');
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Domains</h1>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Domain
        </button>
      </div>

      {domains.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No domains added yet</p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            Add your first domain
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {domains.map((domain) => (
            <div key={domain.id} className="card flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{domain.domain_name}</h3>
                  {domain.status === 'verified' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {domain.description && (
                  <p className="text-sm text-gray-600 mt-1">{domain.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Added {new Date(domain.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {domain.status !== 'verified' && (
                  <button
                    onClick={() => handleVerifyDomain(domain.id)}
                    className="btn btn-secondary text-sm"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDomain(domain.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Domain</h2>
            <form onSubmit={handleAddDomain} className="space-y-4">
              <div>
                <label className="label">Domain Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="example.com"
                  value={newDomain.domain_name}
                  onChange={(e) => setNewDomain({ ...newDomain, domain_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Description (optional)</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Production domain for main website"
                  value={newDomain.description}
                  onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Domain
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
