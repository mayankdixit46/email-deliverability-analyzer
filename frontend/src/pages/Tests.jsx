import { useEffect, useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { testsAPI, domainsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, domainsRes] = await Promise.all([
        testsAPI.getResults(),
        domainsAPI.getAll(),
      ]);
      setTests(testsRes.data.tests);
      setDomains(domainsRes.data.domains);
      if (domainsRes.data.domains.length > 0) {
        setSelectedDomain(domainsRes.data.domains[0].id);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const runTest = async (testType) => {
    if (!selectedDomain) {
      toast.error('Please select a domain first');
      return;
    }

    setRunning({ ...running, [testType]: true });

    try {
      let result;
      switch (testType) {
        case 'spf':
          result = await testsAPI.runSPF({ domain_id: selectedDomain });
          break;
        case 'dkim':
          result = await testsAPI.runDKIM({ domain_id: selectedDomain, selector: 'default' });
          break;
        case 'dmarc':
          result = await testsAPI.runDMARC({ domain_id: selectedDomain });
          break;
        default:
          throw new Error('Unknown test type');
      }
      toast.success(`${testType.toUpperCase()} test completed`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to run ${testType.toUpperCase()} test`);
    } finally {
      setRunning({ ...running, [testType]: false });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const testTypes = [
    { id: 'spf', name: 'SPF Test', description: 'Verify Sender Policy Framework records' },
    { id: 'dkim', name: 'DKIM Test', description: 'Verify DomainKeys Identified Mail signature' },
    { id: 'dmarc', name: 'DMARC Test', description: 'Verify Domain-based Message Authentication' },
  ];

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Tests</h1>

      {/* Run Tests Section */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Run New Test</h2>

        {domains.length === 0 ? (
          <p className="text-gray-600">Please add a domain first to run tests.</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="label">Select Domain</label>
              <select
                className="input"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.domain_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testTypes.map((test) => (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{test.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                  <button
                    onClick={() => runTest(test.id)}
                    disabled={running[test.id]}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {running[test.id] ? 'Running...' : 'Run Test'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Test Results Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Results</h2>

        {tests.length === 0 ? (
          <p className="text-gray-600">No tests run yet. Run your first test above!</p>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {test.test_type.toUpperCase()} - {test.domain_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(test.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      test.status === 'pass'
                        ? 'bg-green-100 text-green-800'
                        : test.status === 'fail'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {test.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
