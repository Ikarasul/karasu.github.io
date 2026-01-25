/* =========================================
   8. FAN ZONE (Google Sheets Chat - AUTO REFRESH)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyHB8xqMQpBCcLiP-KwL0dBnl8kLOFLF_kOXE981oI19_9s4mIusPAwpgXHi51pVuaA/exec";
    const chatContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const nameInput = document.getElementById('chat-name');
    const msgInput = document.getElementById('chat-input');
    const badWords = ['กู', 'มึง', 'สัส', 'เหี้ย', 'ควาย', 'ควย', 'เย็ด', 'shit', 'fuck', 'damn', 'bitch'];

    const createPostIt = (name, msg) => {
        const div = document.createElement('div');
        div.className = 'post-it animate__animated animate__zoomIn';
        const rotate = Math.floor(Math.random() * 6) - 3;
        div.style.transform = `rotate(${rotate}deg)`;
        const colors = ['#ffe5d9', '#e0c3fc', '#d0f4de', '#a9def9', '#ffcfd2'];
        div.style.background = colors[Math.floor(Math.random() * colors.length)];

        div.innerHTML = `
          <div class="fw-bold text-dark text-truncate" style="max-width:100%; font-size:0.9rem;">
              <i class="bi bi-pin-angle-fill text-danger me-1"></i>${name}
          </div>
          <hr style="margin:5px 0; opacity:0.3;">
          <div style="word-wrap: break-word; color:#555;">${msg}</div>
      `;
        return div;
    };

    const loadMessages = (isBackgroundUpdate = false) => {
        if (!chatContainer) return;

        if (!isBackgroundUpdate) {
            chatContainer.innerHTML = '<div class="text-center w-100 py-5"><div class="spinner-border text-secondary mb-2" role="status"></div><p class="small text-muted">กำลังโหลดข้อความจาก Sheets...</p></div>';
        }

        fetch(GOOGLE_SCRIPT_URL)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    chatContainer.innerHTML = '<div class="text-muted w-100 text-center py-5">ยังไม่มีข้อความ มาเจิมคนแรกเลย!</div>';
                    return;
                }

                chatContainer.innerHTML = '';
                const recentPosts = data.slice(-8);
                recentPosts.forEach(post => {
                    chatContainer.appendChild(createPostIt(post.name, post.message));
                });
            })
            .catch(error => {
                console.error('Error:', error);
                if (!isBackgroundUpdate) {
                    chatContainer.innerHTML = '<div class="text-danger w-100 text-center">โหลดข้อมูลไม่สำเร็จ T_T (ตรวจสอบชื่อแท็บ Sheet1 ใน Google Sheets)</div>';
                }
            });
    };

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = nameInput.value.trim();
            const msg = msgInput.value.trim();

            if (!name || !msg) return;
            if (badWords.some(w => name.toLowerCase().includes(w) || msg.toLowerCase().includes(w))) {
                alert("กรุณาใช้คำสุภาพครับ");
                return;
            }

            const submitBtn = chatForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
            submitBtn.disabled = true;

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ name: name, message: msg })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        msgInput.value = '';
                        loadMessages(false);
                    } else {
                        alert('เกิดข้อผิดพลาดในการบันทึก: ' + JSON.stringify(data));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    loadMessages(false);

    // Auto-refresh every 9 seconds
    setInterval(() => {
        loadMessages(true);
    }, 9000);
});
