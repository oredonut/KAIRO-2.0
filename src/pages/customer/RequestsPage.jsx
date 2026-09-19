import React from 'react';
import { ClipboardList, ChevronRight, Clock, MapPin, CheckCircle2, Phone, MessageSquare } from 'lucide-react';

export default function RequestsPage({ requests = [], onSelectRequest, onNewProblem }) {
  // Default mock requests if user hasn't sent any yet
  const displayRequests = requests.length > 0 ? requests : [
    {
      id: 'req-101',
      serviceLabel: 'Generator Repair',
      problemText: 'My generator starts but goes off after a few minutes.',
      artisanName: 'Emeka Generator Repairs',
      artisanPhone: '0803 555 0192',
      status: 'awaiting',
      statusText: 'Awaiting response',
      dateSent: 'Today at 2:15 PM',
      brand: 'Honda',
      location: 'Yaba, Lagos',
      matchReasons: ['Specializes in generator shutdown faults', '18 relevant work samples', 'Available today']
    },
    {
      id: 'req-102',
      serviceLabel: 'Device Repair',
      problemText: 'iPhone 13 screen cracked after drop.',
      artisanName: 'TechDoctor Tunde',
      artisanPhone: '0802 888 1234',
      status: 'accepted',
      statusText: 'Accepted',
      dateSent: 'Yesterday',
      brand: 'iPhone 13',
      location: 'Computer Village, Ikeja',
      matchReasons: ['Screen replacement specialist', 'OEM parts guaranteed']
    },
    {
      id: 'req-103',
      serviceLabel: 'Clothing Alterations',
      problemText: 'Ankara dress waist alteration.',
      artisanName: 'Ada Alterations Studio',
      artisanPhone: '0805 777 9900',
      status: 'completed',
      statusText: 'Completed',
      dateSent: '3 days ago',
      brand: 'Ankara',
      location: 'Surulere, Lagos',
      matchReasons: ['Same-day alterations expert']
    }
  ];

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div className="page-wrapper animate-fade-in" style={{ maxWidth: 960 }}>
        
        {/* Page Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: 8 }}>
              <ClipboardList size={14} /> REQUEST HISTORY
            </span>
            <h1 className="page-heading" style={{ color: 'var(--deep-evergreen)', margin: 0 }}>
              Your Requests
            </h1>
            <p className="supporting-text" style={{ fontSize: '16px', marginTop: 4 }}>
              Track enquiries sent to artisans and manage ongoing job connections.
            </p>
          </div>

          <button
            onClick={onNewProblem}
            className="btn btn-primary"
          >
            + New Request
          </button>
        </div>

        {/* Requests Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {displayRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelectRequest(req)}
              className="card card-interactive"
              style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span className="badge badge-green">{req.serviceLabel}</span>
                  <span className={`status-pill status-${req.status}`}>
                    {req.statusText}
                  </span>
                  <span className="small-metadata" style={{ marginLeft: 'auto' }}>
                    Sent {req.dateSent}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--main-text)', marginBottom: 6 }}>
                  "{req.problemText}"
                </h3>

                <div style={{ fontSize: '14.5px', color: 'var(--secondary-text)' }}>
                  Sent to: <strong style={{ color: 'var(--deep-evergreen)' }}>{req.artisanName}</strong> · {req.location}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--kairo-green)', fontWeight: 600, fontSize: '14.5px' }}>
                View details <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
