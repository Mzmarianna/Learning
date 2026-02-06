/**
 * Privacy & Compliance System
 * 
 * Handles COPPA, FERPA, and state privacy law compliance
 * for educational platforms serving minors ages 4-18
 */

import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

// ============================================================================
// TYPES
// ============================================================================

export interface ParentalConsent {
  id: string;
  studentId: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  studentName: string;
  studentDateOfBirth: Date;
  consentGivenAt: Date;
  ipAddress: string;
  userAgent: string;
  
  // Specific consents
  consents: {
    dataCollection: boolean;          // Collect educational data
    dataSharing: boolean;              // Share with tutors
    emailCommunication: boolean;       // Send emails to parent
    studentEmailCommunication: boolean; // Send emails to student
    progressReports: boolean;          // Generate & share reports
    thirdPartyTools: boolean;          // Use 3rd party tools (Zoom, etc.)
    researchParticipation: boolean;    // Anonymous data for research
  };
  
  // COPPA specific (for under 13, though platform is 12-18)
  coppaCompliant: boolean;
  
  // Version tracking (important for policy updates)
  privacyPolicyVersion: string;
  termsOfServiceVersion: string;
  
  // Audit trail
  updatedAt?: Date;
  revokedAt?: Date;
  revokedReason?: string;
}

export interface DataExportRequest {
  id: string;
  requestedBy: string; // parentId
  requestedAt: Date;
  studentId: string;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'expired';
  exportData?: {
    profile: any;
    quests: any[];
    progress: any[];
    assessments: any[];
    communications: any[];
  };
  deliveredAt?: Date;
  expiresAt: Date; // Export links expire after 7 days
}

export interface DataDeletionRequest {
  id: string;
  requestedBy: string; // parentId
  requestedAt: Date;
  studentId: string;
  studentName: string;
  reason?: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'denied';
  scheduledDeletionDate?: Date;
  completedAt?: Date;
  deniedReason?: string;
  
  // What to delete
  deleteScope: {
    studentProfile: boolean;
    learningData: boolean;
    communications: boolean;
    billingHistory: boolean; // Often must retain for tax/legal
  };
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: 'student' | 'parent' | 'tutor' | 'admin';
  action: string;
  resourceType: string;
  resourceId: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// CONSENT MANAGEMENT
// ============================================================================

/**
 * Record parental consent during account creation
 */
export async function recordParentalConsent(
  consent: Omit<ParentalConsent, 'id' | 'consentGivenAt'>
): Promise<string> {
  const consentId = `consent-${consent.studentId}-${Date.now()}`;
  
  const consentRecord: ParentalConsent = {
    ...consent,
    id: consentId,
    consentGivenAt: new Date(),
  };
  
  // Save to Firestore or localStorage
  if (db) {
    await setDoc(doc(db, 'parental_consents', consentId), {
      ...consentRecord,
      consentGivenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    // Demo mode: localStorage
    localStorage.setItem(`consent-${consentId}`, JSON.stringify(consentRecord));
  }
  
  // Audit log
  await logAudit({
    userId: consent.parentId,
    userRole: 'parent',
    action: 'CONSENT_GIVEN',
    resourceType: 'parental_consent',
    resourceId: consentId,
    details: { studentId: consent.studentId },
  });
  
  return consentId;
}

/**
 * Get parental consent for a student
 */
export async function getParentalConsent(studentId: string): Promise<ParentalConsent | null> {
  if (db) {
    // In production, query by studentId
    const consentDoc = await getDoc(doc(db, 'parental_consents', `consent-${studentId}`));
    if (consentDoc.exists()) {
      const data = consentDoc.data();
      return {
        ...data,
        consentGivenAt: data.consentGivenAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        revokedAt: data.revokedAt?.toDate(),
      } as ParentalConsent;
    }
  } else {
    // Demo mode
    const keys = Object.keys(localStorage).filter(k => k.startsWith('consent-') && k.includes(studentId));
    if (keys.length > 0) {
      const data = localStorage.getItem(keys[0]);
      return data ? JSON.parse(data) : null;
    }
  }
  
  return null;
}

/**
 * Update parental consent (when parent changes preferences)
 */
export async function updateParentalConsent(
  studentId: string,
  updates: Partial<ParentalConsent['consents']>
): Promise<void> {
  const existing = await getParentalConsent(studentId);
  if (!existing) {
    throw new Error('No consent record found for student');
  }
  
  const updated = {
    ...existing,
    consents: { ...existing.consents, ...updates },
    updatedAt: new Date(),
  };
  
  if (db) {
    await updateDoc(doc(db, 'parental_consents', existing.id), {
      consents: updated.consents,
      updatedAt: serverTimestamp(),
    });
  } else {
    localStorage.setItem(`consent-${existing.id}`, JSON.stringify(updated));
  }
  
  await logAudit({
    userId: existing.parentId,
    userRole: 'parent',
    action: 'CONSENT_UPDATED',
    resourceType: 'parental_consent',
    resourceId: existing.id,
    details: { updates },
  });
}

/**
 * Revoke parental consent (parent withdraws consent)
 */
export async function revokeParentalConsent(
  studentId: string,
  reason?: string
): Promise<void> {
  const existing = await getParentalConsent(studentId);
  if (!existing) {
    throw new Error('No consent record found for student');
  }
  
  const updated = {
    ...existing,
    revokedAt: new Date(),
    revokedReason: reason,
  };
  
  if (db) {
    await updateDoc(doc(db, 'parental_consents', existing.id), {
      revokedAt: serverTimestamp(),
      revokedReason: reason,
    });
  } else {
    localStorage.setItem(`consent-${existing.id}`, JSON.stringify(updated));
  }
  
  await logAudit({
    userId: existing.parentId,
    userRole: 'parent',
    action: 'CONSENT_REVOKED',
    resourceType: 'parental_consent',
    resourceId: existing.id,
    details: { reason },
  });
}

// ============================================================================
// DATA EXPORT (FERPA Right to Access)
// ============================================================================

/**
 * Request data export for a student
 */
export async function requestDataExport(
  parentId: string,
  studentId: string
): Promise<string> {
  const requestId = `export-${studentId}-${Date.now()}`;
  
  const request: DataExportRequest = {
    id: requestId,
    requestedBy: parentId,
    requestedAt: new Date(),
    studentId,
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
  
  if (db) {
    await setDoc(doc(db, 'data_export_requests', requestId), {
      ...request,
      requestedAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(request.expiresAt),
    });
  } else {
    localStorage.setItem(`export-request-${requestId}`, JSON.stringify(request));
  }
  
  await logAudit({
    userId: parentId,
    userRole: 'parent',
    action: 'DATA_EXPORT_REQUESTED',
    resourceType: 'data_export',
    resourceId: requestId,
    details: { studentId },
  });
  
  // In production, trigger background job to generate export
  // For now, we'll process immediately
  await processDataExport(requestId);
  
  return requestId;
}

/**
 * Process data export (generate the export package)
 */
async function processDataExport(requestId: string): Promise<void> {
  // This would be a background job in production
  // For now, we'll do it inline
  
  const request = await getDataExportRequest(requestId);
  if (!request) return;
  
  // Collect all student data
  const exportData = {
    profile: await getStudentProfile(request.studentId),
    quests: await getStudentQuests(request.studentId),
    progress: await getStudentProgress(request.studentId),
    assessments: await getStudentAssessments(request.studentId),
    communications: await getStudentCommunications(request.studentId),
    generatedAt: new Date().toISOString(),
  };
  
  if (db) {
    await updateDoc(doc(db, 'data_export_requests', requestId), {
      status: 'ready',
      exportData,
      deliveredAt: serverTimestamp(),
    });
  } else {
    const updated = { ...request, status: 'ready' as const, exportData, deliveredAt: new Date() };
    localStorage.setItem(`export-request-${requestId}`, JSON.stringify(updated));
  }
  
  await logAudit({
    userId: request.requestedBy,
    userRole: 'parent',
    action: 'DATA_EXPORT_READY',
    resourceType: 'data_export',
    resourceId: requestId,
  });
}

async function getDataExportRequest(requestId: string): Promise<DataExportRequest | null> {
  if (db) {
    const doc_ref = await getDoc(doc(db, 'data_export_requests', requestId));
    if (doc_ref.exists()) {
      const data = doc_ref.data();
      return {
        ...data,
        requestedAt: data.requestedAt?.toDate(),
        expiresAt: data.expiresAt?.toDate(),
        deliveredAt: data.deliveredAt?.toDate(),
      } as DataExportRequest;
    }
  } else {
    const data = localStorage.getItem(`export-request-${requestId}`);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// Helper functions to gather student data
async function getStudentProfile(studentId: string) {
  // Gather from various sources
  return {
    id: studentId,
    // ... collect all profile data
  };
}

async function getStudentQuests(studentId: string) {
  // Get all quest assignments
  return [];
}

async function getStudentProgress(studentId: string) {
  // Get all progress records
  return [];
}

async function getStudentAssessments(studentId: string) {
  // Get all assessment results
  return [];
}

async function getStudentCommunications(studentId: string) {
  // Get messages, notifications, etc.
  return [];
}

// ============================================================================
// DATA DELETION (FERPA Right to Delete)
// ============================================================================

/**
 * Request data deletion for a student
 */
export async function requestDataDeletion(
  parentId: string,
  studentId: string,
  studentName: string,
  deleteScope: DataDeletionRequest['deleteScope'],
  reason?: string
): Promise<string> {
  const requestId = `deletion-${studentId}-${Date.now()}`;
  
  const request: DataDeletionRequest = {
    id: requestId,
    requestedBy: parentId,
    requestedAt: new Date(),
    studentId,
    studentName,
    reason,
    status: 'pending',
    deleteScope,
    // Schedule deletion for 30 days out (gives time to cancel)
    scheduledDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
  
  if (db) {
    await setDoc(doc(db, 'data_deletion_requests', requestId), {
      ...request,
      requestedAt: serverTimestamp(),
      scheduledDeletionDate: Timestamp.fromDate(request.scheduledDeletionDate!),
    });
  } else {
    localStorage.setItem(`deletion-request-${requestId}`, JSON.stringify(request));
  }
  
  await logAudit({
    userId: parentId,
    userRole: 'parent',
    action: 'DATA_DELETION_REQUESTED',
    resourceType: 'data_deletion',
    resourceId: requestId,
    details: { studentId, deleteScope, reason },
  });
  
  return requestId;
}

/**
 * Cancel a pending deletion request
 */
export async function cancelDataDeletion(requestId: string): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'data_deletion_requests', requestId), {
      status: 'denied',
      deniedReason: 'Cancelled by parent',
    });
  } else {
    const data = localStorage.getItem(`deletion-request-${requestId}`);
    if (data) {
      const request = JSON.parse(data);
      request.status = 'denied';
      request.deniedReason = 'Cancelled by parent';
      localStorage.setItem(`deletion-request-${requestId}`, JSON.stringify(request));
    }
  }
  
  await logAudit({
    userId: 'system',
    userRole: 'admin',
    action: 'DATA_DELETION_CANCELLED',
    resourceType: 'data_deletion',
    resourceId: requestId,
  });
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Log security and privacy related events
 */
export async function logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
  const logId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const auditLog: AuditLog = {
    id: logId,
    timestamp: new Date(),
    ...log,
  };
  
  if (db) {
    await setDoc(doc(db, 'audit_logs', logId), {
      ...auditLog,
      timestamp: serverTimestamp(),
    });
  } else {
    // In demo mode, store in localStorage (limit to last 100)
    const logs = getAuditLogs().slice(-99); // Keep last 99
    logs.push(auditLog);
    localStorage.setItem('audit-logs', JSON.stringify(logs));
  }
}

/**
 * Get audit logs (for admin/compliance review)
 */
export function getAuditLogs(): AuditLog[] {
  if (db) {
    // In production, query Firestore with filters
    return [];
  } else {
    const data = localStorage.getItem('audit-logs');
    return data ? JSON.parse(data) : [];
  }
}

/**
 * Get audit logs for a specific user
 */
export function getUserAuditLogs(userId: string): AuditLog[] {
  const logs = getAuditLogs();
  return logs.filter(log => log.userId === userId);
}

// ============================================================================
// AGE VERIFICATION
// ============================================================================

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Check if student is in target age range (4-18)
 */
export function isAgeEligible(dateOfBirth: Date): boolean {
  const age = calculateAge(dateOfBirth);
  return age >= 4 && age <= 18;
}

/**
 * Check if student is under 13 (requires extra COPPA compliance)
 */
export function requiresCOPPA(dateOfBirth: Date): boolean {
  const age = calculateAge(dateOfBirth);
  return age < 13;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CURRENT_PRIVACY_POLICY_VERSION = '1.0.0';
export const CURRENT_TERMS_OF_SERVICE_VERSION = '1.0.0';

export const PRIVACY_POLICY_URL = '/privacy-policy';
export const TERMS_OF_SERVICE_URL = '/terms-of-service';

/**
 * Data retention periods (in days)
 */
export const DATA_RETENTION = {
  STUDENT_PROFILE: 365 * 3, // 3 years after account closure
  LEARNING_DATA: 365 * 7,   // 7 years (educational records standard)
  COMMUNICATIONS: 365 * 2,  // 2 years
  AUDIT_LOGS: 365 * 7,      // 7 years (compliance requirement)
  BILLING_HISTORY: 365 * 7, // 7 years (tax/legal requirement)
};