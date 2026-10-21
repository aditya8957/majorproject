import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Send, Trash2, Bot, User, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';

function AssistAi({ problem }) {
    const welcomeMessage = {
        role: 'assistant',
        parts: [{ 
            text: "👋 Hello! I'm Divyang Sahayak, your disability assistance companion. I'm here to help with questions about disabilities, assistive technologies, accessibility, government schemes, and more. What would you like to know today?" 
        }]
    };

    const [messages, setMessages] = useState([welcomeMessage]);
    const [isSending, setIsSending] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [showSuggestions, setShowSuggestions] = useState(true);

    // Suggested questions for new users
    const suggestedQuestions = [
        "What assistive devices are available for blind people?",
        "How can I get a disability certificate in India?",
        "What government schemes are there for persons with disabilities?",
        "Tell me about accessible transportation options",
        "What accommodations are available for students with disabilities?",
        "How can I make my home more accessible?"
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingMessage]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Hide suggestions when user starts conversation
    useEffect(() => {
        if (messages.length > 1) {
            setShowSuggestions(false);
        }
    }, [messages]);

    const sendConversation = async (conversation) => {
        setIsSending(true);
        setStreamingMessage("");
        
        // Create a placeholder for the streaming response
        setMessages(prev => [...prev, { role: 'assistant', parts: [{ text: '' }] }]);
        
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('http://localhost:4000/ai/assist', {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    messages: conversation,
                    title: problem?.title || "",
                    description: problem?.description || "",
                    testCases: problem?.visibleTestCases || [],
                    startCode: problem?.startCode || []
                })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";
            let eventBuffer = "";

            const processSseEvent = (event) => {
                const dataLine = event.split(/\r?\n/).find(line => line.startsWith('data:'));
                if (!dataLine) return false;

                let data;
                try {
                    data = JSON.parse(dataLine.slice(5).trimStart());
                } catch (error) {
                    console.error("Invalid SSE JSON:", error);
                    return false;
                }

                if (data.error) throw new Error(data.message || "AI service error");
                if (data.done) return true;

                if (data.text) {
                    accumulatedText += data.text;
                    setStreamingMessage(accumulatedText);

                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = {
                            role: 'assistant',
                            parts: [{ text: accumulatedText }]
                        };
                        return newMessages;
                    });
                }

                return false;
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                eventBuffer += decoder.decode(value, { stream: true });
                const events = eventBuffer.split(/\r?\n\r?\n/);
                eventBuffer = events.pop() || "";

                for (const event of events) {
                    if (processSseEvent(event)) break;
                }
            }

            eventBuffer += decoder.decode();
            if (eventBuffer.trim()) {
                processSseEvent(eventBuffer);
            }
            
        } catch (error) {
            console.error("Streaming Error:", error);
            
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    parts: [{ text: "😔 Sorry, I'm having trouble connecting. Please try again in a moment." }]
                };
                return newMessages;
            });
        } finally {
            setIsSending(false);
            setStreamingMessage("");
            inputRef.current?.focus();
        }
    };

    const onSubmit = async (data) => {
        if (!data.message || !data.message.trim()) return;

        const userMessage = { role: 'user', parts: [{ text: data.message.trim() }] };
        setMessages(prev => [...prev, userMessage]);
        reset();

        const recent = [...messages, userMessage].slice(-12).map(msg => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.parts[0].text
        }));

        await sendConversation(recent);
    };

    const handleSuggestionClick = (question) => {
        const userMessage = { role: 'user', parts: [{ text: question }] };
        setMessages(prev => [...prev, userMessage]);
        
        const recent = [...messages, userMessage].slice(-12).map(msg => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.parts[0].text
        }));
        
        sendConversation(recent);
    };

    const handleClear = () => {
        setMessages([welcomeMessage]);
        setShowSuggestions(true);
        inputRef.current?.focus();
    };

    const handleNewChat = () => {
        setMessages([welcomeMessage]);
        setShowSuggestions(true);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-[678px] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-semibold flex items-center gap-2">
                            AssistAI
                            {/* <span className="bg-green-400 text-xs text-green-900 px-2 py-0.5 rounded-full font-normal">Online</span> */}
                        </h2>
                        <p className="text-blue-100 text-xs">Your Disability Assistance Companion</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleNewChat}
                        title="New chat"
                        className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={handleClear}
                        title="Clear conversation"
                        className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 ${msg.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-100' 
                                        : 'bg-blue-600'
                                }`}>
                                    {msg.role === 'user' ? (
                                        <User className="w-5 h-5 text-blue-600" />
                                    ) : (
                                        <Bot className="w-5 h-5 text-white" />
                                    )}
                                </div>
                            </div>
                            
                            {/* Message Bubble */}
                            <div>
                                <div className={`text-xs text-gray-500 mb-1 ${
                                    msg.role === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {msg.role === 'user' ? 'You' : 'Divyang Sahayak'}
                                </div>
                                <div
                                    className={`rounded-2xl px-4 py-2 ${
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {msg.parts[0].text}
                                        {index === messages.length - 1 && 
                                         msg.role === 'assistant' && 
                                         isSending && 
                                         streamingMessage === msg.parts[0].text && (
                                            <span className="inline-block w-1 h-4 ml-1 bg-gray-400 animate-pulse">▊</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isSending && messages[messages.length - 1]?.parts[0].text === '' && (
                    <div className="flex justify-start">
                        <div className="flex">
                            <div className="mr-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggested Questions */}
                {showSuggestions && messages.length === 1 && (
                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <p className="text-sm font-medium text-gray-700">Suggested questions to get started:</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {suggestedQuestions.map((question, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSuggestionClick(question)}
                                    className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                >
                                    <p className="text-sm text-gray-600 group-hover:text-blue-700 line-clamp-2">
                                        {question}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white border-t border-gray-200 p-3">
    
    <div className="relative max-w-3xl mx-auto">
        
        <input
            placeholder="Ask me anything about disabilities or accessibility..."
            className="w-full px-4 py-2 pr-20 bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("message", { required: true })}
            ref={(e) => {
                register("message").ref(e);
                inputRef.current = e;
            }}
            disabled={isSending}
        />

        {/* Send Button INSIDE */}
        <button
            type="submit"
            disabled={isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
        >
            <Send size={16} />
        </button>

    </div>

    {errors.message && (
        <p className="text-red-500 text-xs mt-1 text-center">Please enter a message</p>
    )}

    <p className="text-xs text-gray-400 mt-2 text-center">
        Divyang Sahayak provides information about disabilities and related services. For medical advice, please consult a professional.
    </p>
</form>
        </div>
    );
}

export default AssistAi;