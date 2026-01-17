import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Get authorization header to verify user is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's token to verify their identity
    const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role client to check admin status (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { action, property_id, notes } = await req.json();
    
    if (!action || !property_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: action, property_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be "approve" or "reject"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the property's current state for audit log
    const { data: oldProperty, error: fetchError } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', property_id)
      .single();

    if (fetchError || !oldProperty) {
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const updateData: Record<string, any> = {
      verification_status: newStatus,
      is_published: action === 'approve', // Set true if approved, false if rejected
      updated_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.risk_notes = notes;
    }

    console.log(`Processing ${action} for property ${property_id} by admin ${user.id}`);
    console.log('Update data:', JSON.stringify(updateData));

    // Update the property
    const { data: updatedProperty, error: updateError } = await supabaseAdmin
      .from('properties')
      .update(updateData)
      .eq('id', property_id)
      .select()
      .single();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Failed to update property: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the audit event using service role
    const { error: auditError } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: action === 'approve' ? 'APPROVE' : 'REJECT',
        entity_type: 'property',
        entity_id: property_id,
        old_data: oldProperty,
        new_data: updatedProperty,
      });

    if (auditError) {
      console.error('Audit log error:', auditError);
      // Don't fail the request if audit logging fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        property: updatedProperty,
        message: `Property ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin verify error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
