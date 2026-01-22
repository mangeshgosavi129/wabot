export enum ConversationStage {
    GREETING = "greeting",
    QUALIFICATION = "qualification",
    PRICING = "pricing",
    CTA = "cta",
    FOLLOWUP = "followup",
    CLOSED = "closed",
    LOST = "lost",
    GHOSTED = "ghosted",
}

export enum IntentLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    VERY_HIGH = "very_high",
    UNKNOWN = "unknown",
}

export enum CTAType {
    BOOK_CALL = "book_call",
    BOOK_DEMO = "book_demo",
    BOOK_MEETING = "book_meeting",
}

export enum ConversationMode {
    BOT = "bot",
    HUMAN = "human",
    CLOSED = "closed",
    PAUSED = "paused",
}

export enum UserSentiment {
    ANNOYED = "annoyed",
    DISTRUSTFUL = "distrustful",
    CONFUSED = "confused",
    CURIOUS = "curious",
    DISAPPOINTED = "disappointed",
    NEUTRAL = "neutral",
    UNINTERESTED = "uninterested",
}

export enum TemplateStatus {
    PENDING = "pending",
    DRAFT = "draft",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    REJECTED = "rejected",
}

export enum MessageFrom {
    LEAD = "lead",
    BOT = "bot",
    HUMAN = "human",
}

// DTOs based on server/schemas.py

export interface AuthContext {
    user_id: string;
    organization_id: string;
    email: string;
    is_active: boolean;
}

export interface AuthTokenOut {
    access_token: string;
    token_type: "bearer";
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse extends AuthTokenOut {
    user_id: string;
    organization_id: string;
}

export interface SignupCreateOrgRequest {
    name: string;
    email: string;
    password: string;
    organization_name: string;
}

export interface SignupCreateOrgResponse extends AuthTokenOut {
    user_id: string;
    organization_id: string;
}

export interface SignupJoinOrgRequest {
    name: string;
    email: string;
    password: string;
    organization_id: string;
}

export interface SignupJoinOrgResponse extends AuthTokenOut {
    user_id: string;
    organization_id: string;
}

export interface APIError {
    code: string;
    message: string;
}

export interface ErrorResponse {
    success: false;
    error: APIError;
}

export interface SuccessResponse {
    success: true;
}

export interface OrganizationOut {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}


export interface DashboardStatsOut {
    total_conversations: number;
    total_messages: number;
    active_leads: number;
    peak_hours: Record<string, number>;
    sentiment_breakdown: Record<string, number>;
}

export interface UserOut {
    id: string;
    organization_id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface ConversationOut {
    id: string;
    organization_id: string;
    lead_id?: string;
    cta_id?: string;
    cta_scheduled_at?: string;
    stage: ConversationStage;
    intent_level?: IntentLevel;
    mode: ConversationMode;
    user_sentiment?: UserSentiment;
    rolling_summary?: string;
    last_message?: string;
    last_message_at?: string;
    created_at: string;
    updated_at?: string;
}

export interface ConversationTakeoverOut {
    conversation_id: string;
    assigned_user_id: string;
}

export interface MessageCreate {
    conversation_id: string;
    content: string;
}

export interface MessageOut {
    id: string;
    organization_id: string;
    conversation_id: string;
    message_from: MessageFrom;
    assigned_user_id?: string;
    content: string;
    status: "sent" | "delivered" | "read" | "failed";
    created_at: string;
}

export interface CTACreate {
    name: string;
    cta_type: CTAType;
}

export interface CTAUpdate {
    name?: string;
    is_active?: boolean;
}

export interface CTAOut {
    id: string;
    organization_id: string;
    name: string;
    cta_type: CTAType;
    is_active: boolean;
    scheduled_at?: string;
    created_at: string;
    updated_at?: string;
}

export interface TemplateCreate {
    name: string;
    content: string;
}

export interface TemplateUpdate {
    name?: string;
    content?: string;
}

export interface TemplateStatusOut {
    status: TemplateStatus;
    approved_at?: string;
    rejection_reason?: string;
}

export interface TemplateOut {
    id: string;
    organization_id: string;
    name: string;
    content: string;
    status: TemplateStatus;
    approved_at?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at?: string;
}

export interface FollowupCreate {
    template_id: string;
    delay_hours: number;
    sequence_order: number;
}

export interface FollowupOut {
    id: string;
    organization_id: string;
    template_id: string;
    delay_hours: number;
    sequence_order: number;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface LeadUpdate {
    name?: string;
    email?: string;
    company?: string;
    conversation_stage?: ConversationStage;
    intent_level?: IntentLevel;
    user_sentiment?: UserSentiment;
}

export interface LeadOut {
    id: string;
    organization_id: string;
    name?: string;
    phone: string;
    email?: string;
    company?: string;
    conversation_stage?: ConversationStage;
    intent_level?: IntentLevel;
    user_sentiment?: UserSentiment;
    created_at: string;
    updated_at?: string;
}

export interface AnalyticsOut {
    metric_date: string;
    total_conversations: number;
    total_messages: number;
}

export interface WhatsAppIntegrationCreate {
    access_token: string;
    version: string;
    verify_token: string;
    app_secret: string;
    phone_number_id: string;
}

export interface WhatsAppIntegrationUpdate {
    access_token?: string;
    version?: string;
    verify_token?: string;
    app_secret?: string;
    phone_number_id?: string;
}

export interface WhatsAppIntegrationOut {
    id: string;
    organization_id: string;
    phone_number_id: string;
    is_connected: boolean;
    created_at: string;
    updated_at?: string;
}

export interface WhatsAppStatusOut {
    is_connected: boolean;
}

export interface WebSocketEnvelope {
    event: string;
    payload: any;
}

export interface WSMessageReceived {
    message: MessageOut;
}

export interface WSMessageSent {
    message: MessageOut;
}

export interface AnalyticsReportOut {
    sentiment_breakdown: Record<string, number>;
    peak_activity_time: Record<string, number>;
    message_from_stats: Record<string, number>;
    intent_level_stats: Record<string, number>;
}


export interface WSConversationUpdated {
    conversation: ConversationOut;
}

export interface WSTakeoverStarted {
    conversation_id: string;
    assigned_user_id: string;
}

export interface WSTakeoverEnded {
    conversation_id: string;
}

export interface WSActionConversationsFlagged {
    cta_id: string;
    conversation_ids: string[];
}

export interface WSActionHumanAttentionRequired {
    conversation_ids: string[];
}

export enum WSEvents {
    // Inbox
    CONVERSATION_UPDATED = "conversation:updated",
    TAKEOVER_STARTED = "conversation:takeover_started",
    TAKEOVER_ENDED = "conversation:takeover_ended",

    // Action Center
    ACTION_CONVERSATIONS_FLAGGED = "action:conversations_flagged",
    ACTION_HUMAN_ATTENTION_REQUIRED = "action:human_attention_required",

    // System
    ACK = "ack",
    ERROR = "error",
    SERVER_HELLO = "server:hello",
    CLIENT_HEARTBEAT = "client:heartbeat",
}
