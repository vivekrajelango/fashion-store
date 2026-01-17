'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { ChatMessage } from '@/types/chat';

type ChatStep = 'details' | 'chat';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<ChatStep>('details');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // User Details Form
    const [customerName, setCustomerName] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [formError, setFormError] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Load session if exists
    useEffect(() => {
        const storedSessionId = localStorage.getItem('chatSessionId');
        if (storedSessionId) {
            verifyAndLoadSession(storedSessionId);
        }
    }, []);

    const verifyAndLoadSession = async (sid: string) => {
        const { data } = await supabase.from('chat_sessions').select('*').eq('id', sid).single();
        if (data && data.customer_name && data.customer_mobile) {
            setSessionId(sid);
            setStep('chat');
            fetchMessages(sid);
            subscribeToMessages(sid);

            // Pre-fill details if needed
            setCustomerName(data.customer_name);
            setCustomerMobile(data.customer_mobile);
        } else {
            // Invalid session or missing details, restart
            localStorage.removeItem('chatSessionId');
        }
    };

    const subscribeToMessages = (sid: string) => {
        const channel = supabase
            .channel(`session-${sid}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `session_id=eq.${sid}`,
                },
                (payload) => {
                    const newMsg = payload.new as ChatMessage;
                    // Prevent duplicate if we just sent it (though React state usually handles this, sometimes race conditions happen)
                    setMessages((prev) => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                }
            )
            .subscribe();
        return () => supabase.removeChannel(channel);
    };

    const fetchMessages = async (sid: string) => {
        const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sid)
            .order('created_at', { ascending: true });

        if (data) setMessages(data as ChatMessage[]);
    };

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim() || !customerMobile.trim()) {
            setFormError('Please fill in all details');
            return;
        }
        if (customerMobile.length < 10) {
            setFormError('Please enter a valid mobile number');
            return;
        }
        setFormError('');

        // Start Chat Session Directly
        if (!sessionId) {
            await createSession();
        } else {
            setStep('chat');
        }
    };

    const createSession = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('chat_sessions')
            .insert({
                customer_name: customerName,
                customer_mobile: customerMobile,
            })
            .select()
            .single();

        if (data) {
            const sid = data.id;
            setSessionId(sid);
            localStorage.setItem('chatSessionId', sid);
            subscribeToMessages(sid);
            setStep('chat');
        }
        setIsLoading(false);
    };

    const sendMessage = async (content: string, sid: string | null = sessionId) => {
        if (!sid || !content.trim()) return;

        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
                session_id: sid,
                content: content,
                sender_type: 'customer',
            })
            .select()
            .single();

        if (!error && data) {
            await supabase
                .from('chat_sessions')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', sid);

            // Notify Telegram
            // Notify Telegram via Edge Function
            const { error: fnError } = await supabase.functions.invoke('telegram-send', {
                body: {
                    message_id: data.id,
                    content: content,
                    customer_name: customerName,
                    session_id: sid
                }
            });

            if (fnError) {
                console.error('Failed to invoke telegram-send:', fnError);
            }
        }
    };

    const handleManualSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = newMessage;
        setNewMessage('');
        await sendMessage(msg);
    };

    // Auto-scroll
    useEffect(() => {
        if (isOpen && step === 'chat') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, step]);

    if (pathname?.startsWith('/dashboard')) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-6 z-50 p-4 bg-pink-600 text-white rounded-full shadow-2xl hover:bg-pink-700 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center transform hover:rotate-12"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
            </button>

            <div
                className={`fixed bottom-44 right-6 w-[calc(100vw-3rem)] md:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 origin-bottom-right transform border border-gray-100 flex flex-col max-h-[calc(100vh-13rem)] h-[60vh] md:h-[32rem] ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="bg-pink-600 p-4 text-white shrink-0">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        {step === 'chat' && (
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                            </span>
                        )}
                        Support Chat
                    </h3>
                    <p className="text-pink-100 text-xs mt-1">
                        {step === 'details' ? 'Please tell us who you are' :
                            'We typically reply within a few minutes.'}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col min-h-0">

                    {/* Step 1: Details Form */}
                    {step === 'details' && (
                        <div className="p-6 flex flex-col items-center justify-center h-full gap-4">
                            <div className="text-center mb-2">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 text-pink-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <h4 className="font-bold text-gray-800">Welcome!</h4>
                                <p className="text-sm text-gray-500">Enter your details to start chatting</p>
                            </div>

                            <form onSubmit={handleDetailsSubmit} className="w-full space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-sm"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-sm"
                                        value={customerMobile}
                                        onChange={e => setCustomerMobile(e.target.value)}
                                    />
                                </div>
                                {formError && <p className="text-red-500 text-xs text-center">{formError}</p>}
                                <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200">
                                    Continue
                                </button>
                            </form>
                        </div>
                    )}



                    {/* Step 3: Chat */}
                    {step === 'chat' && (
                        <div className="flex-1 p-4 flex flex-col gap-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.sender_type === 'customer'
                                            ? 'bg-pink-600 text-white rounded-br-none shadow-sm'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 text-sm py-10">
                                    <p>Start conversation...</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area (Only for Chat Step) */}
                {step === 'chat' && (
                    <form onSubmit={handleManualSend} className="p-4 bg-white border-t border-gray-100 shrink-0">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white text-sm text-gray-900"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !newMessage.trim()}
                                className="p-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
