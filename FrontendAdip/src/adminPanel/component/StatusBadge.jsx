import React from 'react';
import { ApplicationStatus } from '../store';
import {
  Clock,
  Eye,
  CheckCircle2,
  Building2,
  Package,
  Truck,
  Target,
  XCircle
} from 'lucide-react';

export const StatusBadge = ({ status }) => {

  const config = {
    [ApplicationStatus.PENDING_VERIFICATION]: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      label: 'Pending Verification'
    },
    [ApplicationStatus.UNDER_REVIEW]: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Eye,
      label: 'Under Review'
    },
    [ApplicationStatus.APPROVED]: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle2,
      label: 'Approved'
    },
    [ApplicationStatus.NGO_ASSIGNED]: {
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Building2,
      label: 'NGO Assigned'
    },
    [ApplicationStatus.PROCESSING_AT_NGO]: {
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Package,
      label: 'Processing at NGO'
    },
    [ApplicationStatus.READY_FOR_DISTRIBUTION]: {
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Truck,
      label: 'Ready for Distribution'
    },
    [ApplicationStatus.DELIVERED]: {
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Target,
      label: 'Delivered'
    },
    [ApplicationStatus.REJECTED]: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      label: 'Rejected'
    },
  };

  const { color, icon: Icon, label } = config[status] || {};

  if (!color) return null; // safety check

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
};