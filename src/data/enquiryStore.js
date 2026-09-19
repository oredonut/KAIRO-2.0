// ── Real-Time Multi-User Enquiry Store & Sync Engine ─────────────────────────

const STORAGE_KEY = 'kairo_enquiries_store_v2';
const NOTIF_KEY = 'kairo_notifications_v2';

// Pre-populated initial seed data
const SEED_ENQUIRIES = [
  {
    id: 'req-101',
    artisanId: 'art-1', // Emeka Generator Repairs
    customerName: 'Chidi N.',
    customerPhone: '0803 555 0192',
    problemText: 'My generator dey start but e go just off after five minutes.',
    serviceLabel: 'Generator Repair',
    brand: 'Honda',
    location: 'Yaba, Lagos',
    when: 'Today',
    status: 'new', // 'new' | 'accepted' | 'in-progress' | 'completed' | 'declined' | 'cancelled'
    statusText: 'New Enquiry',
    dateSent: 'Just now',
    matchReasons: [
      'Specializes in generator shutdown troubleshooting',
      '18 verified work samples',
      'Available today in Yaba'
    ]
  },
  {
    id: 'req-102',
    artisanId: 'art-3', // TechDoctor Tunde
    customerName: 'Mrs. Funmi A.',
    customerPhone: '0802 888 1234',
    problemText: 'iPhone 13 screen cracked after drop.',
    serviceLabel: 'Device Repair',
    brand: 'iPhone 13',
    location: 'Computer Village, Ikeja',
    when: 'Today',
    status: 'accepted',
    statusText: 'Accepted',
    dateSent: 'Yesterday',
    matchReasons: ['Screen replacement specialist', 'OEM parts guaranteed']
  },
  {
    id: 'req-103',
    artisanId: 'art-4', // Fatimah Couture
    customerName: 'Blessing O.',
    customerPhone: '0805 777 9900',
    problemText: 'Need Ankara dress waist alteration for wedding.',
    serviceLabel: 'Clothing Alterations',
    brand: 'Ankara',
    location: 'Surulere, Lagos',
    when: 'Tomorrow',
    status: 'completed',
    statusText: 'Completed',
    dateSent: '3 days ago',
    matchReasons: ['Same-day alterations expert']
  }
];

// Initialize Store
export function getStoredEnquiries() {
  if (typeof window === 'undefined') return SEED_ENQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENQUIRIES));
      return SEED_ENQUIRIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SEED_ENQUIRIES;
  }
}

export function saveEnquiriesStore(enquiries) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
    window.dispatchEvent(new Event('kairo_enquiries_updated'));
  } catch (e) {
    console.error('Failed to save KAIRO store', e);
  }
}

// Add new enquiry from Customer (Session A) -> Broadcasts to target Artisan (Session B)
export function addCustomerEnquiry(newEnquiryData) {
  const enquiries = getStoredEnquiries();
  const newEnquiry = {
    id: 'req-' + Date.now(),
    dateSent: 'Just now',
    status: 'new',
    statusText: 'New Enquiry',
    ...newEnquiryData
  };

  const updated = [newEnquiry, ...enquiries];
  saveEnquiriesStore(updated);

  // Broadcast In-App Notification
  broadcastNotification({
    id: 'notif-' + Date.now(),
    artisanId: newEnquiry.artisanId,
    title: 'New Customer Enquiry Received!',
    message: `${newEnquiry.customerName || 'A customer'} sent an enquiry for ${newEnquiry.serviceLabel || 'a service'} in ${newEnquiry.location || 'your area'}.`,
    time: 'Just now',
    enquiryId: newEnquiry.id
  });

  return newEnquiry;
}

// Update Enquiry Status (e.g. Artisan accepts or declines)
export function updateEnquiryStatus(enquiryId, newStatus, extraData = {}) {
  const enquiries = getStoredEnquiries();
  const statusTexts = {
    new: 'New Enquiry',
    accepted: 'Accepted',
    declined: 'Declined',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  const updated = enquiries.map(e => {
    if (e.id === enquiryId) {
      return {
        ...e,
        status: newStatus,
        statusText: statusTexts[newStatus] || newStatus,
        ...extraData
      };
    }
    return e;
  });

  saveEnquiriesStore(updated);
}

// Get user-specific enquiries for an artisan (strictly enquiry.artisanId === artisanId)
export function getEnquiriesForArtisan(artisanId) {
  const all = getStoredEnquiries();
  return all.filter(e => e.artisanId === artisanId);
}

// Notification system
export function getNotifications(artisanId) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    const all = raw ? JSON.parse(raw) : [];
    return artisanId ? all.filter(n => n.artisanId === artisanId) : all;
  } catch (e) {
    return [];
  }
}

export function broadcastNotification(notif) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    const all = raw ? JSON.parse(raw) : [];
    const updated = [notif, ...all].slice(0, 20);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('kairo_notification_received'));
  } catch (e) {
    console.error('Failed to broadcast notification', e);
  }
}
