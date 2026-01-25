/* =========================================
   4. ARTIST SYSTEM (Filter, Search, Details)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const filters = document.querySelectorAll('#artistFilters .filter-chip');
    const items = document.querySelectorAll('.artist-btn');
    const searchInput = document.getElementById('artistSearch');
    const sortBtn = document.getElementById('btnSortAZ');
    const artistListContainer = document.getElementById('artistList');
    const headers = document.querySelectorAll('.artist-group-header');

    const dPhoto = document.getElementById('dPhoto');
    const dName = document.getElementById('dName');
    const dCountry = document.getElementById('dCountry');
    const dStyle = document.getElementById('dStyle');
    const dBio = document.getElementById('dBio');
    const dYoutube = document.getElementById('dYoutube');
    const dApple = document.getElementById('dApple');

    const originalOrder = Array.from(artistListContainer.children);
    let isSorted = false;

    // --- Filtering ---
    const applyFilter = (filterVal) => {
        items.forEach(item => {
            const group = item.dataset.group || item.dataset.country;
            if (filterVal === 'all' || filterVal === group) item.classList.remove('hidden');
            else item.classList.add('hidden');
        });
        headers.forEach(h => {
            if (filterVal === 'all') h.classList.remove('hidden');
            else {
                if (filterVal === h.dataset.group) h.classList.remove('hidden');
                else h.classList.add('hidden');
            }
        });
    };

    filters.forEach(f => {
        f.addEventListener('click', () => {
            filters.forEach(el => el.classList.remove('active')); f.classList.add('active');
            applyFilter(f.dataset.filter);
            if (searchInput) searchInput.value = '';
            if (isSorted && sortBtn) sortBtn.click();
        });
    });

    // --- Searching ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            headers.forEach(h => h.classList.add('hidden'));
            items.forEach(item => {
                const name = item.dataset.name.toLowerCase();
                const country = item.dataset.country.toLowerCase();
                if (name.includes(term) || country.includes(term)) item.classList.remove('hidden');
                else item.classList.add('hidden');
            });
            if (term === '') {
                const activeFilter = document.querySelector('#artistFilters .filter-chip.active').dataset.filter;
                applyFilter(activeFilter);
            }
        });
    }

    // --- Sorting ---
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            if (!isSorted) {
                const itemsArray = Array.from(items);
                itemsArray.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name, 'th'));
                headers.forEach(h => h.classList.add('hidden'));
                itemsArray.forEach(item => artistListContainer.appendChild(item));
                sortBtn.classList.add('active');
                sortBtn.innerHTML = '<i class="bi bi-sort-alpha-up"></i>';
                isSorted = true;
            } else {
                originalOrder.forEach(child => artistListContainer.appendChild(child));
                const activeFilter = document.querySelector('#artistFilters .filter-chip.active').dataset.filter;
                applyFilter(activeFilter);
                sortBtn.classList.remove('active');
                sortBtn.innerHTML = '<i class="bi bi-sort-alpha-down"></i>';
                isSorted = false;
            }
        });
    }

    // --- Detail View Logic ---
    function updateArtistDetail(btn) {
        items.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        const data = btn.dataset;

        if (dPhoto) { dPhoto.style.opacity = 0; setTimeout(() => { dPhoto.src = data.photo; dPhoto.style.opacity = 1; }, 200); }
        if (dName) dName.textContent = data.name;
        if (dCountry) dCountry.textContent = data.country;
        if (dStyle) dStyle.textContent = data.style;
        if (dBio) {
            dBio.classList.remove('bio-anim');
            void dBio.offsetWidth;
            dBio.innerHTML = data.bio;
            dBio.classList.add('bio-anim');
        }

        let extra = {}; try { extra = JSON.parse(data.extra); } catch (e) { }

        if (dYoutube) {
            dYoutube.innerHTML = '';
            if (extra.youtube) {
                extra.youtube.forEach(v => {
                    let vidId = '';
                    if (v.url.includes('youtu.be/')) vidId = v.url.split('youtu.be/')[1].split('?')[0];
                    else if (v.url.includes('v=')) vidId = v.url.split('v=')[1].split('&')[0];
                    if (vidId) dYoutube.innerHTML += `<div class="video-card" onclick="window.open('${v.url}')"><img src="https://img.youtube.com/vi/${vidId}/hqdefault.jpg"><div class="p-2 small fw-bold text-truncate text-dark">${v.title}</div></div>`;
                });
            }
        }

        // --- ส่วนที่แก้ไข: Apple Music Loading Spinner ---
        if (dApple) {
            dApple.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-secondary spinner-border-sm" role="status"></div><span class="ms-2 small text-muted">กำลังโหลดเพลง...</span></div>';

            setTimeout(() => {
                if (extra.apple && extra.apple.length > 0) {
                    let appleHtml = '';
                    extra.apple.forEach(v => {
                        const embedUrl = v.url.replace('music.apple.com', 'embed.music.apple.com');
                        appleHtml += `
                        <div class="ratio ratio-16x9 mb-3 shadow-sm" style="--bs-aspect-ratio: 150px; border-radius: 12px; overflow: hidden; background: #f9f9f9;">
                            <iframe src="${embedUrl}" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" style="border:0; width:100%; height:100%;" loading="lazy"></iframe>
                        </div>`;
                    });
                    dApple.innerHTML = appleHtml;
                } else {
                    dApple.innerHTML = '<div class="text-muted small fst-italic text-center py-3">ยังไม่มีข้อมูล Apple Music</div>';
                }
            }, 50);
        }
    }

    if (items.length > 0) updateArtistDetail(items[0]);
    items.forEach(btn => btn.addEventListener('click', () => updateArtistDetail(btn)));
});
