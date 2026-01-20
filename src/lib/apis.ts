import {
    LoginRequest,
    LoginResponse,
    SignupCreateOrgRequest,
    SignupCreateOrgResponse,
    SignupJoinOrgRequest,
    SignupJoinOrgResponse,
    DashboardStatsOut,
    LeadOut,
    LeadUpdate,
    ConversationOut,
    MessageOut,
    MessageCreate,
    CTAOut,
    CTACreate,
    CTAUpdate,
    TemplateOut,
    TemplateCreate,
    TemplateUpdate,
    TemplateStatusOut,
    AnalyticsOut,
    WhatsAppIntegrationOut,
    WhatsAppIntegrationCreate,
    WhatsAppIntegrationUpdate,
    SuccessResponse
} from './types';

const API_BASE_URL = 'http://localhost:8000';

class ApiClient {
    private getHeaders() {
        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(error.detail || 'Request failed');
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    // Auth
    async login(payload: LoginRequest): Promise<LoginResponse> {
        const res = await this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        localStorage.setItem('auth_token', res.access_token);
        return res;
    }

    async signupCreateOrg(payload: SignupCreateOrgRequest): Promise<SignupCreateOrgResponse> {
        const res = await this.request<SignupCreateOrgResponse>('/auth/signup/create-org', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        localStorage.setItem('auth_token', res.access_token);
        return res;
    }

    async signupJoinOrg(payload: SignupJoinOrgRequest): Promise<SignupJoinOrgResponse> {
        const res = await this.request<SignupJoinOrgResponse>('/auth/signup/join-org', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        localStorage.setItem('auth_token', res.access_token);
        return res;
    }

    // Dashboard
    async getDashboardStats(): Promise<DashboardStatsOut> {
        return this.request<DashboardStatsOut>('/dashboard/stats');
    }

    // Leads
    async getLeads(): Promise<LeadOut[]> {
        return this.request<LeadOut[]>('/leads');
    }

    async updateLead(leadId: string, payload: LeadUpdate): Promise<LeadOut> {
        return this.request<LeadOut>(`/leads/${leadId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    }

    async deleteLead(leadId: string): Promise<void> {
        return this.request<void>(`/leads/${leadId}`, {
            method: 'DELETE',
        });
    }

    // Conversations
    async getConversations(): Promise<ConversationOut[]> {
        return this.request<ConversationOut[]>('/conversations');
    }

    async getConversationMessages(conversationId: string): Promise<MessageOut[]> {
        return this.request<MessageOut[]>(`/conversations/${conversationId}/messages`);
    }

    async takeoverConversation(conversationId: string): Promise<ConversationOut> {
        return this.request<ConversationOut>(`/conversations/${conversationId}/takeover`, {
            method: 'POST',
        });
    }

    async releaseConversation(conversationId: string): Promise<ConversationOut> {
        return this.request<ConversationOut>(`/conversations/${conversationId}/release`, {
            method: 'POST',
        });
    }

    // Messages
    async sendMessage(payload: MessageCreate): Promise<MessageOut> {
        return this.request<MessageOut>('/messages/send', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    // CTAs
    async getCTAs(): Promise<CTAOut[]> {
        return this.request<CTAOut[]>('/ctas');
    }

    async createCTA(payload: CTACreate): Promise<CTAOut> {
        return this.request<CTAOut>('/ctas', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async updateCTA(ctaId: string, payload: CTAUpdate): Promise<CTAOut> {
        return this.request<CTAOut>(`/ctas/${ctaId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    }

    async deleteCTA(ctaId: string): Promise<void> {
        return this.request<void>(`/ctas/${ctaId}`, {
            method: 'DELETE',
        });
    }

    // Templates
    async getTemplates(): Promise<TemplateOut[]> {
        return this.request<TemplateOut[]>('/templates');
    }

    async createTemplate(payload: TemplateCreate): Promise<TemplateOut> {
        return this.request<TemplateOut>('/templates', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async updateTemplate(templateId: string, payload: TemplateUpdate): Promise<TemplateOut> {
        return this.request<TemplateOut>(`/templates/${templateId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    }

    async deleteTemplate(templateId: string): Promise<void> {
        return this.request<void>(`/templates/${templateId}`, {
            method: 'DELETE',
        });
    }

    async submitTemplate(templateId: string): Promise<TemplateOut> {
        return this.request<TemplateOut>(`/templates/${templateId}/submit`, {
            method: 'POST',
        });
    }

    async getTemplateStatus(templateId: string): Promise<TemplateStatusOut> {
        return this.request<TemplateStatusOut>(`/templates/${templateId}/status`);
    }

    // Analytics
    async getAnalytics(): Promise<AnalyticsOut[]> {
        return this.request<AnalyticsOut[]>('/analytics');
    }

    // Settings
    async connectWhatsApp(payload: WhatsAppIntegrationCreate): Promise<WhatsAppIntegrationOut> {
        return this.request<WhatsAppIntegrationOut>('/settings/whatsapp/connect', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async getWhatsAppStatus(): Promise<WhatsAppIntegrationOut> {
        return this.request<WhatsAppIntegrationOut>('/settings/whatsapp/status');
    }

    async updateWhatsAppConfig(payload: WhatsAppIntegrationUpdate): Promise<WhatsAppIntegrationOut> {
        return this.request<WhatsAppIntegrationOut>('/settings/whatsapp/config', {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    }

    async disconnectWhatsApp(): Promise<SuccessResponse> {
        return this.request<SuccessResponse>('/settings/whatsapp/disconnect', {
            method: 'DELETE',
        });
    }
}

export const api = new ApiClient();
