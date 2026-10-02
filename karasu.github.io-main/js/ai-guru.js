/* =========================================
   6. AI GURU (GEMINI API)
   ========================================= */
(function () {
    const chatBox = document.getElementById('ai-response');
    const userInput = document.getElementById('ai-user-input');
    const btnSend = document.getElementById('btn-ask-ai');

    // 🔴🔴 ใส่ API Key ของคุณที่นี่ 🔴🔴
    const apiKey = "AIzaSyBW6AL8bM4KriJjdsEzfkNLwoVg59c25NY";
    const MAX_CHARS = 200;

    if (!btnSend || !userInput || !chatBox) return;

    // Character counter
    const counterEl = document.querySelector('.char-counter');
    if (counterEl && userInput) {
        userInput.addEventListener('input', () => {
            const len = userInput.value.length;
            if (counterEl) {
                counterEl.textContent = `${len} / ${MAX_CHARS}`;
                counterEl.classList.toggle('warning', len > MAX_CHARS * 0.8);
                counterEl.classList.toggle('danger', len > MAX_CHARS);
            }
        });
    }

    const scrollToBottom = () => {
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    };

    const addMessage = (html, isUser = false) => {
        const wrapper = document.createElement('p');
        wrapper.className = isUser ? 'text-end mt-3 mb-1' : 'text-start mt-3 mb-1';

        const bubble = document.createElement('span');
        bubble.className = isUser ? 'chat-bubble-user' : 'chat-bubble-ai';
        bubble.innerHTML = isUser ? html : marked.parse(html);

        if (!isUser) {
            bubble.querySelectorAll('a').forEach(link => link.setAttribute('target', '_blank'));
        }

        wrapper.appendChild(bubble);
        chatBox.appendChild(wrapper);
        scrollToBottom();
        return wrapper;
    };

    const showTyping = () => {
        const wrapper = document.createElement('p');
        wrapper.className = 'text-start mt-3 mb-1 typing-msg';

        const bubble = document.createElement('span');
        bubble.className = 'chat-bubble-ai';
        bubble.innerHTML = `<span class="typing-dots"><span></span><span></span><span></span></span>`;

        wrapper.appendChild(bubble);
        chatBox.appendChild(wrapper);
        scrollToBottom();
        return wrapper;
    };

    const callGemini = async (prompt) => {
        const typingEl = showTyping();

        if (!apiKey || apiKey.includes('ใส่_API')) {
            setTimeout(() => {
                typingEl.remove();
                addMessage('⚠️ กรุณาใส่ API Key ในโค้ด js/ai-guru.js ก่อนใช้งานเมี๊ยว!');
            }, 1000);
            return;
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Role: You are 'MeowGuru', a cute cat DJ and concert guide 🐱🎧.
User Input: "${prompt}"

Instructions:
1. 🇹🇭 Reply in Thai language, acting like a cute cat (end sentences with "เมี๊ยว" or "นะเมี๊ยว").
2. 💬 **If the user says a greeting (e.g., "hi", "hello", "สวัสดี") or small talk:**
   - Reply with a SHORT, cute, and friendly greeting only. Do NOT recommend music.
3. 🎵 **If the user shares a mood, feeling, or asks for music:**
   - Recommend 3 Songs: Must use this Markdown format for links: [Song Name - Artist](https://www.youtube.com/results?search_query=Song+Name+Artist).
   - Add a short 1-line description for each song.
   - Recommend 1 Concert or Artist known for great live shows.
   - Use cute emojis! Keep it concise.`
                        }]
                    }]
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message || 'API Error');
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            typingEl.remove();
            if (aiText) addMessage(aiText);
            else addMessage('ขออภัยเมี๊ยว... ระบบขัดข้องชั่วคราว 😿');
        } catch (error) {
            typingEl.remove();
            addMessage(`ขออภัยเมี๊ยว... เกิดข้อผิดพลาด: ${error.message} 😿`);
        }
    };

    const handleSend = () => {
        const text = userInput.value.trim();
        if (!text || text.length > MAX_CHARS) return;
        addMessage(text, true);
        userInput.value = '';
        if (counterEl) counterEl.textContent = `0 / ${MAX_CHARS}`;
        callGemini(text);
    };

    btnSend.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
})();
