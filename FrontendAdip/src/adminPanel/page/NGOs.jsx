import React from 'react';
import { useSelector } from 'react-redux';
import { Building2, Target } from 'lucide-react';

export const NGOManagementPage = () => {

  const ngos = useSelector((state) => state.app.ngos);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            NGO Management
          </h2>
          <p className="text-slate-500">
            Manage implementing agencies and their workload.
          </p>
        </div>

        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
          Add New NGO
        </button>
      </div>

      {/* NGO Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngos.map((ngo) => {

          const isAvailable = ngo.workload < ngo.capacity * 0.8;
          const workloadPercent = (ngo.workload / ngo.capacity) * 100;

          return (
            <div
              key={ngo.id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >

              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Building2 size={24} />
                </div>

                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isAvailable ? 'Available' : 'Near Capacity'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {ngo.name}
              </h3>

              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <Target size={14} className="text-slate-400" />
                {ngo.location}
              </p>

              {/* Workload Section */}
              <div className="mt-6 space-y-4">

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1">
                    <span>Current Workload</span>
                    <span>{ngo.workload}/{ngo.capacity}</span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${workloadPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ngo.deviceTypes.map((type, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100"
                    >
                      {type}
                    </span>
                  ))}
                </div>

              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                  {ngo.contact}
                </p>
                <button className="text-emerald-500 text-sm font-bold hover:underline">
                  View Details
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};