/* =========================================
   6. AI GURU (GEMINI API)
   ========================================= */
(function () {
    const chatBox = document.getElementById('ai-response');
    const userInput = document.getElementById('ai-user-input');
    const btnSend = document.getElementById('btn-ask-ai');

    // 🔴🔴 ใส่ API Key ของคุณที่นี่ 🔴🔴
    const apiKey = "AIzaSyBW6AL8bM4KriJjdsEzfkNLwoVg59c25NY";

    if (btnSend && userInput && chatBox) {
        const addMessage = (text, isUser = false) => {
            const p = document.createElement('p');
            p.className = isUser ? 'text-end mt-3' : 'text-start mt-3';
            const span = document.createElement('span');
            span.className = isUser ?
                'd-inline-block p-3 rounded-3 bg-primary text-white shadow-sm' :
                'd-inline-block p-3 rounded-3 bg-white border border-light text-dark shadow-sm';

            span.innerHTML = isUser ? text : marked.parse(text);

            if (!isUser) {
                span.querySelectorAll('a').forEach(link => link.setAttribute('target', '_blank'));
            }

            p.appendChild(span);
            chatBox.appendChild(p);
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        const callGemini = async (prompt) => {
            const loadingId = 'loading-' + Date.now();
            const loadingHtml = `<span id="${loadingId}" class="typing-indicator"><i class="bi bi-three-dots-vertical"></i> น้องแมวกำลังคิด... 🐾</span>`;
            addMessage(loadingHtml);

            if (!apiKey || apiKey.includes("ใส่_API")) {
                setTimeout(() => {
                    document.getElementById(loadingId)?.closest('p')?.remove();
                    addMessage(`<strong>⚠️ กรุณาใส่ API Key ในโค้ด script.js ก่อนใช้งานเมี๊ยว!</strong>`);
                }, 1500);
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
                if (data.error) throw new Error(data.error.message || "API Error");
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

                document.getElementById(loadingId)?.closest('p')?.remove();
                if (aiText) addMessage(aiText);
                else addMessage("ขออภัยเมี๊ยว... ระบบขัดข้องชั่วคราว 😿");
            } catch (error) {
                document.getElementById(loadingId)?.closest('p')?.remove();
                addMessage(`ขออภัยเมี๊ยว... เกิดข้อผิดพลาด: ${error.message} 😿`);
            }
        };

        btnSend.addEventListener('click', () => {
            const text = userInput.value.trim();
            if (!text) return;
            addMessage(text, true);
            userInput.value = '';
            callGemini(text);
        });
        userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') btnSend.click(); });
    }
})();
