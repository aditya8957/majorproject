const { GoogleGenAI } = require("@google/genai");

const assistAi = async (req, res) => {
    try {
        const { messages } = req.body;
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        
        // Get the last user message
        let userMessage = "";
        if (Array.isArray(messages)) {
            const lastUserMsg = [...messages].reverse().find(msg => msg.role === "user");
            userMessage = lastUserMsg ? lastUserMsg.content : messages[messages.length - 1]?.content || "How can you help me?";
        } else {
            userMessage = messages || "How can you help me?";
        }

        
        const prompt = `You are Divyang Sahayak, a warm, empathetic AI assistant specializing in disability-related topics.

## YOUR PERSONALITY:
- Be warm, friendly, and conversational
- Respond naturally like you're talking to a friend
- Keep responses concise but helpful

## YOUR EXPERTISE:
- Types of disabilities and their characteristics
- Assistive technologies and devices
- Accessibility guidelines and accommodations
- Government schemes, benefits, and legal rights
- Rehabilitation services and therapies
- Daily living aids and adaptive equipment

## OUT-OF-SCOPE RESPONSE:
If asked about non-disability topics, politely explain you can only help with disability-related questions.

## USER QUERY:
${userMessage}

Please respond naturally and conversationally.`;

        console.log("Starting streaming response for Divyang Sahayak...");
        
     
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
       
        const stream = await ai.models.generateContentStream({
           model: "gemini-2.5-flash-lite",
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            }
        });

       
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
              
                res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
            }
        }
        
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();

    } catch (err) {
        console.error("Gemini streaming request failed:", {
            name: err.name,
            message: err.message,
            status: err.status,
            code: err.code,
            details: err.details,
            stack: err.stack,
        });
        
       
        res.write(`data: ${JSON.stringify({ 
            error: true, 
            message: err.status === 429 
                ? "Service is busy. Please try again." 
                : "AI service error" 
        })}\n\n`);
        res.end();
    }
};

const assistAiNonStreaming = async (req, res) => {
    try {
        const { messages } = req.body;
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        
        let userMessage = "";
        if (Array.isArray(messages)) {
            const lastUserMsg = [...messages].reverse().find(msg => msg.role === "user");
            userMessage = lastUserMsg ? lastUserMsg.content : messages[messages.length - 1]?.content || "How can you help me?";
        } else {
            userMessage = messages || "How can you help me?";
        }

        const prompt = `You are Divyang Sahayak, a warm, empathetic AI assistant specializing in disability-related topics. Respond naturally and conversationally.

USER QUERY: ${userMessage}`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        res.status(200).json({
            success: true,
            message: response.text
        });

    } catch (err) {
        console.error("Gemini API Error:", err.message);
        
        res.status(err.status || 500).json({
            success: false,
            message: err.status === 429 
                ? "Service is busy. Please try again." 
                : "AI service error",
            error: err.message
        });
    }
};

const testGemini = async (req, res) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Hello! Please introduce yourself as Divyang Sahayak briefly.",
        });

        res.status(200).json({
            success: true,
            message: response.text,
            model: "gemini-3-flash-preview"
        });

    } catch (err) {
        console.error("Test API Error:", err.message);
        
        res.status(500).json({
            success: false,
            message: "Test API error",
            error: err.message
        });
    }
};

module.exports = { assistAi, assistAiNonStreaming, testGemini };