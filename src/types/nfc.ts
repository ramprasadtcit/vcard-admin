// Unified NFC Types for both Super Admin and Org Admin operations

export interface NFCRequest {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userEmail: string;
  cardDesign?: string;
  deliveryAddress: string;
  notes?: string;
  status: 'pending' | 'approved' | 'printed' | 'shipped' | 'delivered' | 'rejected';
  cardUrl?: string;
  requestedAt: string;
  approvedAt?: string;
  printedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  rejectedAt?: string;
  rejectedReason?: string;
  suggestions?: string[];
  processedBy?: string;
  // Status history for tracking workflow
  statusHistory: {
    status: string;
    date: string;
    updatedBy?: string;
    notes?: string;
  }[];
  // Card preview data for showing the actual card design
  cardPreview?: {
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    website?: string;
    avatar?: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
    };
  };
  // Additional fields for Super Admin operations
  requestType: 'b2b' | 'b2c';
  organizationName?: string;
  subscriptionPlan?: string;
  designImage?: string;
}

// NFC Card Template
export interface NFCCardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'personal' | 'creative' | 'minimal';
  previewImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  organizationId?: string; // For organization-specific templates
}

// NFC Card Assignment
export interface NFCCardAssignment {
  id: string;
  cardId: string;
  userId: string;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;
  isActive: boolean;
  usageCount: number;
  lastUsedAt?: string;
}

// NFC Card
export interface NFCCard {
  id: string;
  userId: string;
  userName: string;
  organizationId?: string;
  cardType: 'individual' | 'organization';
  status: 'active' | 'inactive' | 'pending';
  nfcTagId?: string;
  customUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// NFC Card Usage Analytics
export interface NFCCardAnalytics {
  cardId: string;
  totalScans: number;
  uniqueScans: number;
  lastScanAt?: string;
  scanLocations: {
    location: string;
    count: number;
    lastScanAt: string;
  }[];
  deviceTypes: {
    type: string;
    count: number;
  }[];
  timeDistribution: {
    hour: number;
    count: number;
  }[];
} 