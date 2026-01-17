export interface ChatSession {
    id: string;
    created_at: string;
    status: 'active' | 'closed';
    last_message_at: string;
    customer_name?: string;
    customer_mobile?: string;
}

export interface ChatMessage {
    id: string;
    session_id: string;
    content: string;
    sender_type: 'customer' | 'admin';
    created_at: string;
    is_read: boolean;
}
