import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Globe } from 'lucide-react';
import { domainsAPI, testsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDomains: 0,
    verifiedDomains: 0,
    recentTests: 0,
    passedTests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [domainsRes, testsRes] = await Promise.all([
        domainsAPI.getAll(),
        testsAPI.getResults({ limit: 10 }),
      ]);

      const domains = domainsRes.data.domains;
      const tests = testsRes.data.tests;

      setStats({
        totalDomains: domains.length,
        verifiedDomains: domains.filter((d) => d.status === 'verified').length,
        recentTests: tests.length,
        passedTests: tests.filter((t) => t.status === 'pass').length,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Domains',
      value: stats.totalDomains,
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Verified Domains',
      value: stats.verifiedDomains,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Recent Tests',
      value: stats.recentTests,
      icon: AlertCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Passed Tests',
      value: stats.passedTests,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Add your domain</h3>
              <p className="text-sm text-gray-600">
                Go to Domains and add the domain you want to monitor
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Run tests</h3>
              <p className="text-sm text-gray-600">
                Test SPF, DKIM, DMARC and more to ensure proper email configuration
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Monitor & fix</h3>
              <p className="text-sm text-gray-600">
                Review test results and follow recommendations to improve deliverability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
