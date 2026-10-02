/* =========================================
   7. GOSSIP SECTION ROTATOR
   ========================================= */
(function () {
    const gossipSets = [
        { c1: { icon: 'bi-patch-question-fill', color: 'text-primary', title: 'เว็บนี้มีไว้ทำไมคะซิส?', content: `<p class="mb-2"><strong>ArtistHub คือ:</strong> พื้นที่ป้ายยาล้วนๆ!</p><span class="badge bg-secondary text-light">#พื้นที่อวยยศ</span>` }, c2: { icon: 'bi-heart-fill', color: 'text-danger', title: 'โมเม้นต์น่าเอ็นดู', content: `<ul class="list-unstyled mb-0"><li>👑 <strong>แม่โบกี้:</strong> ร้องสดกินแผ่น!</li><li>🎤 <strong>Ado:</strong> ตัวจริงขี้อายนะเออ</li></ul>` }, c3: { icon: 'bi-camera-reels-fill', color: 'text-success', title: 'เก็บตกงานอาร์ต', content: `<ul class="list-unstyled mb-0"><li>🔥 <strong>BKK Art Week:</strong> งานดี แต่ร้อนตับแตก</li></ul>` } },
        { c1: { icon: 'bi-stars', color: 'text-warning', title: 'ดวงช่วงนี้', content: `<p class="mb-2">🔮 <strong>ราศีธาตุลม:</strong> กดบัตรคอนได้แถวหน้า!</p>` }, c2: { icon: 'bi-chat-quote-fill', color: 'text-info', title: 'เรื่องลับฉบับติ่ง', content: `<ul class="list-unstyled mb-0"><li>🤫 <strong>เคล็ดลับ:</strong> บนด้วยชานมไข่มุก 3 แก้ว</li></ul>` }, c3: { icon: 'bi-award-fill', color: 'text-primary', title: 'Awards สาขาแปลก', content: `<ul class="list-unstyled mb-0"><li>🏆 <strong>สาขา "ยืนนิ่งๆ ก็เท่":</strong> Three Man Down</li></ul>` } },
        { c1: { icon: 'bi-backpack-fill', color: 'text-danger', title: 'Must Have', content: `<p class="mb-2">🎒 <strong>สิ่งที่ขาดไม่ได้:</strong> ยาดม, พัดลมจิ๋ว</p>` }, c2: { icon: 'bi-music-player-fill', color: 'text-success', title: 'How to ดูงานศิลป์', content: `<ul class="list-unstyled mb-0"><li>🎨 ยืนกอดอก ทำหน้าครุ่นคิด</li></ul>` }, c3: { icon: 'bi-emoji-laughing-fill', color: 'text-warning', title: 'จากแอดมิน', content: `<p class="mb-0">"ทำเว็บนี้เพราะใจรักล้วนๆ จ้า!"</p>` } }
    ];
    let curIdx = 0;
    const els = [1, 2, 3].map(n => ({ title: document.querySelector(`#sum-col${n}-title`), content: document.querySelector(`#sum-col${n}-content`) }));

    const updateSummary = (idx) => {
        const set = gossipSets[idx];
        if (els[0].title) { els[0].title.className = `fw-bold mb-2 text-primary`; els[0].title.innerHTML = `<i class="bi ${set.c1.icon} me-2"></i>${set.c1.title}`; els[0].content.innerHTML = set.c1.content; }
        if (els[1].title) { els[1].title.className = `fw-bold mb-2 text-dark`; els[1].title.innerHTML = `<i class="bi ${set.c2.icon} me-2"></i>${set.c2.title}`; els[1].content.innerHTML = set.c2.content; }
        if (els[2].title) { els[2].title.className = `fw-bold mb-2 text-primary`; els[2].title.innerHTML = `<i class="bi ${set.c3.icon} me-2"></i>${set.c3.title}`; els[2].content.innerHTML = set.c3.content; }
    };

    updateSummary(0);
    setInterval(() => {
        const container = document.getElementById('summary-container');
        if (container) container.classList.add('summary-fade');
        setTimeout(() => {
            curIdx = (curIdx + 1) % gossipSets.length;
            updateSummary(curIdx);
            if (container) container.classList.remove('summary-fade');
        }, 500);
    }, 6000);
})();
