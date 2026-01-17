'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase';
import { ChatSession, ChatMessage } from '@/types/chat';

export default function AdminChatPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [reply, setReply] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch sessions
    useEffect(() => {
        const fetchSessions = async () => {
            const { data } = await supabase
                .from('chat_sessions')
                .select('*')
                .order('last_message_at', { ascending: false });
            if (data) setSessions(data as ChatSession[]);
        };

        fetchSessions();

        const channel = supabase
            .channel('admin-sessions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' },
                () => fetchSessions() // Re-fetch on any change
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Fetch messages for selected session
    useEffect(() => {
        if (!selectedSessionId) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', selectedSessionId)
                .order('created_at', { ascending: true });
            if (data) setMessages(data as ChatMessage[]);

            // Mark as read (implicitly, or add update query here)
            await supabase
                .from('chat_messages')
                .update({ is_read: true })
                .eq('session_id', selectedSessionId)
                .eq('sender_type', 'customer')
                .eq('is_read', false);
        };

        fetchMessages();

        const channel = supabase
            .channel(`admin-chat-${selectedSessionId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${selectedSessionId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as ChatMessage]);
                    // If it's a customer message, mark read
                    if ((payload.new as ChatMessage).sender_type === 'customer') {
                        supabase
                            .from('chat_messages')
                            .update({ is_read: true })
                            .eq('id', (payload.new as ChatMessage).id);
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [selectedSessionId]);

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !selectedSessionId) return;

        await supabase.from('chat_messages').insert({
            session_id: selectedSessionId,
            content: reply,
            sender_type: 'admin',
        });

        // Update session timestamp
        await supabase.from('chat_sessions').update({ last_message_at: new Date().toISOString() }).eq('id', selectedSessionId);

        setReply('');
    };

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* Sidebar List */}
            <div className="w-1/3 md:w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-800">Innox</h2>
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-bold">{sessions.length} Chats</span>
                </div>
                <div className="overflow-y-auto flex-1">
                    {sessions.length === 0 && <div className="p-4 text-center text-gray-400 text-sm">No active chats</div>}
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => setSelectedSessionId(session.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-all duration-200 relative group ${selectedSessionId === session.id ? 'bg-pink-50/50 border-l-4 border-pink-500' : 'border-l-4 border-transparent'}`}
                        >
                            <div className="flex justify-between mb-1 items-center">
                                <span className="font-bold text-sm text-gray-800">
                                    {session.customer_name || 'Guest User'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded">{new Date(session.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="text-xs text-gray-500 truncate font-mono bg-gray-100/50 px-1 rounded inline-block">
                                    {session.customer_mobile ? `📱 ${session.customer_mobile}` : `ID: ${session.id.slice(0, 6)}`}
                                </p>
                                <span className={`inline-block px-2 py-0.5 rounded-[4px] text-[9px] uppercase font-bold tracking-wider ${session.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {session.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative">
                {selectedSessionId ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">
                                    {selectedSessionId && sessions.find(s => s.id === selectedSessionId)?.customer_name?.charAt(0) || 'G'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{selectedSessionId && sessions.find(s => s.id === selectedSessionId)?.customer_name || 'Guest Customer'}</h3>
                                    <p className="text-xs text-gray-500 font-mono">
                                        {selectedSessionId && sessions.find(s => s.id === selectedSessionId)?.customer_mobile || `ID: ${selectedSessionId}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                onClick={async () => {
                                    if (confirm('Are you sure you want to end this chat?')) {
                                        await supabase.from('chat_sessions').update({ status: 'closed' }).eq('id', selectedSessionId);
                                    }
                                }}
                            >
                                End Chat
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex w-full ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex flex-col max-w-[70%] ${msg.sender_type === 'admin' ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.sender_type === 'admin'
                                            ? 'bg-pink-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {msg.sender_type === 'admin' && msg.is_read && <span className="ml-1 text-pink-400">✓✓</span>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendReply} className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                                    placeholder="Type your reply to the customer..."
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!reply.trim()}
                                    className="bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 font-bold shadow-lg shadow-pink-200 transition-all disabled:opacity-50 disabled:shadow-none hover:translate-y-[-1px] active:translate-y-[1px]"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 bg-gray-50/30">
                        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <p className="font-medium">Select a conversation from the sidebar to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
