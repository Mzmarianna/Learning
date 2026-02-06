/**
 * LEAD CAPTURE SYSTEM
 * Store email leads from marketing funnel in Supabase
 */

import { supabase } from './client';

export interface LeadCapture {
  id?: string;
  email: string;
  child_age?: number;
  biggest_struggle?: string;
  source: 'homepage' | 'free-guide-page' | 'popup' | 'other';
  created_at?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
}

/**
 * Capture a new lead from marketing funnel
 */
export async function captureEmailLead(data: LeadCapture) {
  try {
    const { data: lead, error } = await supabase
      .from('email_leads')
      .insert({
        email: data.email.toLowerCase().trim(),
        child_age: data.child_age || null,
        biggest_struggle: data.biggest_struggle || null,
        source: data.source,
        utm_source: data.utm_source || null,
        utm_campaign: data.utm_campaign || null,
        utm_medium: data.utm_medium || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // If duplicate email (unique constraint), that's OK
      if (error.code === '23505') {
        console.log('Lead already exists:', data.email);
        return { success: true, duplicate: true };
      }
      throw error;
    }

    console.log('✅ Lead captured:', lead);
    return { success: true, data: lead };
  } catch (error) {
    console.error('❌ Error capturing lead:', error);
    return { success: false, error };
  }
}

/**
 * Get all leads (admin only)
 */
export async function getAllLeads(limit = 100) {
  const { data, error } = await supabase
    .from('email_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leads:', error);
    return { data: [], error };
  }

  return { data, error: null };
}

/**
 * Get lead statistics
 */
export async function getLeadStats() {
  try {
    // Total leads
    const { count: totalLeads } = await supabase
      .from('email_leads')
      .select('*', { count: 'exact', head: true });

    // Leads by source
    const { data: bySource } = await supabase
      .from('email_leads')
      .select('source')
      .order('source');

    // Leads by struggle
    const { data: byStruggle } = await supabase
      .from('email_leads')
      .select('biggest_struggle')
      .order('biggest_struggle');

    // Count by source
    const sourceStats = bySource?.reduce((acc: any, lead: any) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    // Count by struggle
    const struggleStats = byStruggle?.reduce((acc: any, lead: any) => {
      if (lead.biggest_struggle) {
        acc[lead.biggest_struggle] = (acc[lead.biggest_struggle] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      totalLeads: totalLeads || 0,
      bySource: sourceStats || {},
      byStruggle: struggleStats || {},
    };
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    return null;
  }
}
