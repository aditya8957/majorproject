import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge } from '../../component/StatusBadge';
import { fetchApplications } from '../../store';
import { APPLICATION_STATUSES, getStatusLabel, normalizeApplicationStatus } from '../../../utils/applicationStatus';

export const ApplicationListPage = () => {
  const applications = useSelector((state) => state.app.applications);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const filteredApps =
    filter === 'ALL'
      ? applications
      : applications.filter((app) => normalizeApplicationStatus(app.status) === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Applications</h2>
          <p className="text-slate-500">
            Manage and process beneficiary requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium">
            <Filter size={16} className="text-slate-400" />
            <select
              className="bg-transparent outline-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>{getStatusLabel(status)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Application ID
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Device Requested
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filteredApps.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/admin/applications/${app.id}`)}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-bold text-emerald-600">
                    {app.id}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {app.applicantName}
                    </p>
                    <p className="text-xs text-slate-500">{app.contact}</p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">
                    {app.deviceRequested}
                  </p>
                  <p className="text-xs text-slate-400">{app.deviceType}</p>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {format(new Date(app.date), 'MMM dd, yyyy')}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={app.status} />
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApps.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              No applications found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};