/* =========================================
   8. FAN ZONE (Google Sheets – Direct Read via gviz/tq)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    // ── ใช้ gviz/tq อ่านโดยตรงจาก Sheet (ไม่มีปัญหา CORS) ──
    const SHEET_ID      = '1JMG9MCnVnClsB0YzkGvPlsx2BlIVZAgcAMAlvtXjXtU';
    const SHEET_NAME    = 'Sheet1'; // ชื่อแท็บใน Google Sheets
    const GVIZ_URL      = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

    // Apps Script URL ยังใช้สำหรับ POST (เขียนข้อมูล)
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHB8xqMQpBCcLiP-KwL0dBnl8kLOFLF_kOXE981oI19_9s4mIusPAwpgXHi51pVuaA/exec';

    const chatContainer = document.getElementById('chat-messages');
    const chatForm      = document.getElementById('chat-form');
    const nameInput     = document.getElementById('chat-name');
    const msgInput      = document.getElementById('chat-input');
    const badWords = ['กู','มึง','สัส','เหี้ย','ควาย','ควย','เย็ด','shit','fuck','damn','bitch','heil','hitler'];

    /* ── Parse gviz response ──
       Response format: /*O_o* / google.visualization.Query.setResponse({...});
       We strip the JSONP wrapper and parse JSON.
       Columns: A=Timestamp, B=Name, C=Message
    */
    function parseGviz(raw) {
        // Strip JSONP wrapper: everything before first { and after last }
        const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
        const data = JSON.parse(json);
        const rows = data.table?.rows ?? [];
        return rows
            .map(row => ({
                timestamp: row.c?.[0]?.f ?? '',
                name:      row.c?.[1]?.v ?? '익명',
                message:   row.c?.[2]?.v ?? ''
            }))
            .filter(r => r.name && r.message); // กรองแถวว่าง
    }

    /* ── Post-it card ── */
    const POST_IT_COLORS = ['#ffe5d9','#e0c3fc','#d0f4de','#a9def9','#ffcfd2','#fef9c3'];
    function createPostIt(name, msg, timestamp) {
        const div = document.createElement('div');
        div.className = 'post-it animate__animated animate__zoomIn';
        const rotate = (Math.random() * 8) - 4;
        div.style.cssText = `transform:rotate(${rotate}deg); background:${POST_IT_COLORS[Math.floor(Math.random() * POST_IT_COLORS.length)]};`;
        div.innerHTML = `
            <div class="fw-bold text-dark text-truncate" style="font-size:0.88rem; max-width:100%;">
                <i class="bi bi-pin-angle-fill text-danger me-1"></i>${escapeHtml(name)}
            </div>
            <hr style="margin:5px 0; opacity:0.25;">
            <div style="word-wrap:break-word; color:#444; font-size:0.9rem; line-height:1.5;">${escapeHtml(msg)}</div>
            ${timestamp ? `<div style="font-size:0.7rem; color:#aaa; margin-top:6px; text-align:right;">${timestamp}</div>` : ''}
        `;
        return div;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g,'&amp;').replace(/</g,'&lt;')
            .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    /* ── Toast helper ── */
    function showToast(msg, type = 'danger') {
        const bg = type === 'success' ? '#16a34a' : type === 'info' ? '#2563eb' : '#dc2626';
        const t  = document.createElement('div');
        t.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${bg};color:#fff;padding:12px 24px;border-radius:999px;z-index:9999;font-size:0.88rem;box-shadow:0 6px 20px rgba(0,0,0,.3);transition:opacity .4s;white-space:nowrap;`;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3000);
    }

    /* ── Load Messages ── */
    let isLoading = false;
    let lastCount = 0;

    function loadMessages(isBackgroundUpdate = false) {
        if (!chatContainer || isLoading) return;
        isLoading = true;

        if (!isBackgroundUpdate) {
            chatContainer.innerHTML = `
                <div class="text-center w-100 py-5">
                    <div class="spinner-border text-secondary mb-2" role="status" style="width:1.8rem;height:1.8rem;"></div>
                    <p class="small text-muted mb-0">กำลังโหลดข้อความ...</p>
                </div>`;
        }

        fetch(GVIZ_URL)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then(raw => {
                isLoading = false;
                const posts = parseGviz(raw);

                if (posts.length === 0) {
                    chatContainer.innerHTML = '<div class="text-muted w-100 text-center py-5">ยังไม่มีข้อความ มาเจิมคนแรกเลย! 🌟</div>';
                    return;
                }

                // Background update: แจ้งเตือนถ้ามีข้อความใหม่
                if (isBackgroundUpdate && posts.length > lastCount && lastCount > 0) {
                    showToast(`🔔 มีข้อความใหม่ ${posts.length - lastCount} ข้อความ!`, 'info');
                }
                lastCount = posts.length;

                // แสดง 10 ข้อความล่าสุด
                chatContainer.innerHTML = '';
                const recent = posts.slice(-10);
                recent.forEach(post => chatContainer.appendChild(createPostIt(post.name, post.message, post.timestamp)));
            })
            .catch(err => {
                isLoading = false;
                console.error('Fan Zone load error:', err);
                if (!isBackgroundUpdate) {
                    chatContainer.innerHTML = `
                        <div class="w-100 text-center py-4">
                            <i class="bi bi-wifi-off fs-1 text-muted d-block mb-2"></i>
                            <p class="text-muted small mb-3">โหลดข้อมูลไม่สำเร็จ<br>
                            <small class="text-danger">${err.message}</small></p>
                            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                onclick="this.closest('.w-100').innerHTML='<div class=\\'spinner-border spinner-border-sm\\'></div>'; loadMessages && loadMessages(false)">
                                <i class="bi bi-arrow-clockwise me-1"></i>ลองใหม่
                            </button>
                        </div>`;
                }
            });
    }

    /* ── Submit Form (POST ผ่าน Apps Script) ── */
    if (chatForm) {
        chatForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = nameInput.value.trim();
            const msg  = msgInput.value.trim();

            if (!name || !msg) return;

            const hasBadWord = badWords.some(w =>
                name.toLowerCase().includes(w) || msg.toLowerCase().includes(w)
            );
            if (hasBadWord) {
                showToast('⚠️ กรุณาใช้คำสุภาพนะจ๊ะ 🙏');
                return;
            }

            const submitBtn = chatForm.querySelector('button[type="submit"]');
            const origHTML  = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
            submitBtn.disabled  = true;

            fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ name, message: msg })
            })
                .then(r => r.json())
                .then(data => {
                    if (data.result === 'success') {
                        nameInput.value = '';
                        msgInput.value  = '';
                        showToast('✅ ส่งข้อความสำเร็จ!', 'success');
                        // รอ 1.5 วิ แล้วโหลดใหม่ (Sheets ต้องการเวลา sync)
                        setTimeout(() => loadMessages(false), 1500);
                    } else {
                        showToast('❌ เกิดข้อผิดพลาด: ' + (data.message || JSON.stringify(data)));
                    }
                })
                .catch(err => {
                    console.error('Post error:', err);
                    showToast('❌ ส่งไม่สำเร็จ กรุณาลองใหม่');
                })
                .finally(() => {
                    submitBtn.innerHTML = origHTML;
                    submitBtn.disabled  = false;
                });
        });
    }

    // โหลดครั้งแรก + auto-refresh ทุก 12 วินาที
    loadMessages(false);
    setInterval(() => loadMessages(true), 12000);
});
