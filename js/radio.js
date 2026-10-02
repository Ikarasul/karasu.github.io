/* =========================================
   9. WORLD RADIO & GLOBE (DRAGGABLE + EXTENDED STATIONS)
   ========================================= */
(function () {
    // Station List
    const stations = [
        // Thailand
        { name: "Cool Fahrenheit 93",  country: "Thailand", flag: "🇹🇭", genre: "Easy Listening", url: "https://coolism-web3rd.cdn.byteark.com/;stream/1",                  lat: 13.80, lon: 100.55 },
        { name: "Green Wave 106.5",    country: "Thailand", flag: "🇹🇭", genre: "Easy Listening", url: "https://atimeonline2.smartclick.co.th/green/playlist.m3u8",         lat: 13.74, lon: 100.56 },
        { name: "EFM 94",              country: "Thailand", flag: "🇹🇭", genre: "Pop / Hits",     url: "https://atimeonline2.smartclick.co.th/efm/playlist.m3u8",           lat: 13.74, lon: 100.56 },
        { name: "Chill Online",        country: "Thailand", flag: "🇹🇭", genre: "Chill / Indie",  url: "https://atimeonline2.smartclick.co.th/chill/playlist.m3u8",          lat: 13.74, lon: 100.56 },
        { name: "HITZ Thailand",       country: "Thailand", flag: "🇹🇭", genre: "T-Pop / Hits",   url: "https://stream.teroradio.com/hitz955",                              lat: 13.75, lon: 100.50 },
        { name: "Eazy FM 105.5",       country: "Thailand", flag: "🇹🇭", genre: "Easy Listening", url: "https://stream.teroradio.com/eazyfm",                               lat: 12.56, lon: 99.95  },
        { name: "MCOT News 100.5",     country: "Thailand", flag: "🇹🇭", genre: "News / Talk",    url: "https://radio1.mcot.net/fm1005",                                    lat: 13.76, lon: 100.57 },
        { name: "Thai Music Radio",    country: "Thailand", flag: "🇹🇭", genre: "T-Pop / Hits",   url: "https://www.thaimusic.me/128.mp3",                                  lat: 13.75, lon: 100.50 },
        // Japan
        { name: "Listen.moe (J-Pop)",  country: "Japan",   flag: "🇯🇵", genre: "Anime / J-Pop",  url: "https://listen.moe/stream",                                         lat: 35.68, lon: 139.76 },
        { name: "Asia DREAM Radio",    country: "Japan",   flag: "🇯🇵", genre: "J-Pop / Sakura", url: "https://igor.torontocast.com:1025/;",                               lat: 34.69, lon: 135.50 },
        // Korea
        { name: "Listen.moe (K-Pop)",  country: "Korea",   flag: "🇰🇷", genre: "K-Pop Hits",     url: "https://listen.moe/kpop/stream",                                    lat: 37.56, lon: 126.97 },
        { name: "Big B Radio",         country: "Korea",   flag: "🇰🇷", genre: "K-Pop",          url: "https://antares.dribbcast.com/proxy/kpop?mp=/s",                    lat: 35.17, lon: 129.07 },
        // USA
        { name: "SomaFM: Groove Salad",country: "USA",    flag: "🇺🇸", genre: "Chill / Ambient", url: "http://ice1.somafm.com/groovesalad-128-mp3",                        lat: 37.77, lon: -122.41},
        { name: "KEXP 90.3",           country: "USA",    flag: "🇺🇸", genre: "Alternative",     url: "https://live.kexp.org/kexp/kexp-128.mp3",                           lat: 47.60, lon: -122.33},
        // UK
        { name: "BBC Radio 1",         country: "UK",     flag: "🇬🇧", genre: "Pop / Hits",      url: "https://as-hls-ww-live.akamaized.net/pool_01505109/live/ww/bbc_radio_one/bbc_radio_one.isml/bbc_radio_one-audio%3d96000.norewind.m3u8", lat: 51.52, lon: -0.14 },
        { name: "BBC Radio 2",         country: "UK",     flag: "🇬🇧", genre: "Adult Contemp.",  url: "https://as-hls-ww-live.akamaized.net/pool_74208725/live/ww/bbc_radio_two/bbc_radio_two.isml/bbc_radio_two-audio%3d96000.norewind.m3u8", lat: 51.50, lon: -0.12 },
        { name: "BBC Radio 1Xtra",     country: "UK",     flag: "🇬🇧", genre: "Urban / Hip Hop", url: "https://as-hls-ww-live.akamaized.net/pool_92079267/live/ww/bbc_1xtra/bbc_1xtra.isml/bbc_1xtra-audio%3d96000.norewind.m3u8",           lat: 51.51, lon: -0.13 },
        // France
        { name: "Europe 1",            country: "France", flag: "🇫🇷", genre: "News / Talk",     url: "http://stream.europe1.fr/europe1.mp3",                               lat: 48.85, lon: 2.35  },
    ];

    let audio       = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume    = 0.1;
    let isPlaying   = false;
    let currentIdx  = 0;
    let activeFilter= 'all';
    let hls         = null;
    let globeRenderer = null;  // keep reference for resize

    const btnPlay    = document.getElementById('btn-radio-play');
    const stationList= document.getElementById('station-list');
    const radioFilters=document.getElementById('radio-filters');
    const txtName    = document.getElementById('radio-station-name');
    const txtCountry = document.getElementById('radio-country');

    /* ── Filters ── */
    if (radioFilters) {
        const countries = [...new Set(stations.map(s => JSON.stringify({ name: s.country, flag: s.flag })))].map(s => JSON.parse(s));
        countries.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-light rounded-pill px-3';
            btn.textContent = `${c.flag} ${c.name}`;
            btn.dataset.filter = c.name;
            btn.onclick = () => {
                radioFilters.querySelectorAll('button').forEach(b => { b.classList.remove('active'); b.classList.add('btn-outline-light'); });
                btn.classList.add('active'); btn.classList.remove('btn-outline-light');
                renderList(c.name);
            };
            radioFilters.appendChild(btn);
        });
        const btnAll = radioFilters.querySelector('[data-filter="all"]');
        if (btnAll) {
            btnAll.onclick = () => {
                radioFilters.querySelectorAll('button').forEach(b => { b.classList.remove('active'); b.classList.add('btn-outline-light'); });
                btnAll.classList.add('active');
                renderList('all');
            };
        }
    }

    /* ── Station List ── */
    function renderList(filter) {
        if (!stationList) return;
        activeFilter = filter;
        stationList.innerHTML = '';
        stations.forEach((s, idx) => {
            if (filter !== 'all' && s.country !== filter) return;
            const item = document.createElement('button');
            const isActive = idx === currentIdx;
            item.className = `list-group-item list-group-item-action radio-item p-3 d-flex align-items-center justify-content-between${isActive ? ' active' : ''}`;
            item.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <span class="badge bg-secondary bg-opacity-25 text-inherit rounded-pill" style="min-width:32px">${idx + 1}</span>
                    <div class="text-start">
                        <div class="fw-bold">${s.name}</div>
                        <small style="opacity:0.75">${s.flag} ${s.country} · ${s.genre}</small>
                    </div>
                </div>
                <i class="bi bi-${isActive && isPlaying ? 'pause-circle-fill text-primary' : 'play-circle'} fs-4 opacity-75"></i>`;
            item.onclick = () => loadStation(idx, true);
            stationList.appendChild(item);
        });
    }

    /* ── Audio ── */
    function playAudio() {
        audio.play()
            .then(() => {
                isPlaying = true;
                if (btnPlay) btnPlay.innerHTML = '<i class="bi bi-pause-fill fs-1"></i>';
                renderList(activeFilter);
            })
            .catch(e => {
                console.warn('Autoplay blocked or stream error:', e);
                isPlaying = false;
                if (btnPlay) btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>';
            });
    }

    function stopAudio() {
        audio.pause();
        isPlaying = false;
        if (btnPlay) btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>';
        renderList(activeFilter);
    }

    function handleError() {
        if (isPlaying) {
            stopAudio();
            // Non-blocking toast-style fallback instead of alert()
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:12px 24px;border-radius:999px;z-index:9999;font-size:0.9rem;box-shadow:0 8px 24px rgba(0,0,0,0.3);transition:opacity 0.5s';
            toast.textContent = '⚠️ สถานีนี้เล่นไม่ได้ในขณะนี้ ลองสถานีอื่นนะ';
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
        }
    }

    function loadStation(index, autoPlay = false) {
        currentIdx = index;
        const s = stations[index];

        if (txtName) txtName.textContent = s.name;
        if (txtCountry) txtCountry.innerHTML = `${s.flag} ${s.country} · ${s.genre}`;

        // Show loading state on play button
        if (autoPlay && btnPlay) btnPlay.innerHTML = '<div class="spinner-border spinner-border-sm text-secondary" role="status" style="width:1.2rem;height:1.2rem"></div>';

        if (hls) { hls.destroy(); hls = null; }
        audio.pause(); audio.src = '';

        if (s.url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
            hls = new Hls({ maxBufferLength: 10, maxMaxBufferLength: 30 });
            hls.loadSource(s.url);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => { if (autoPlay) playAudio(); else renderList(activeFilter); });
            hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) handleError(); });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl') && s.url.includes('.m3u8')) {
            audio.src = s.url;
            audio.addEventListener('loadedmetadata', () => { if (autoPlay) playAudio(); }, { once: true });
        } else {
            audio.src = s.url;
            audio.onerror = handleError;
            if (autoPlay) playAudio();
            else renderList(activeFilter);
        }
    }

    if (btnPlay) {
        btnPlay.onclick = () => {
            if (isPlaying) {
                stopAudio();
            } else {
                if (!audio.src && !hls) loadStation(currentIdx, true);
                else playAudio();
            }
        };
    }

    document.getElementById('btn-radio-prev')?.addEventListener('click', () => {
        const newIdx = (currentIdx - 1 + stations.length) % stations.length;
        loadStation(newIdx, isPlaying);
    });
    document.getElementById('btn-radio-next')?.addEventListener('click', () => {
        const newIdx = (currentIdx + 1) % stations.length;
        loadStation(newIdx, isPlaying);
    });
    document.getElementById('radio-volume')?.addEventListener('input', e => { audio.volume = parseFloat(e.target.value); });

    /* ── 3D Globe ── */
    function initGlobe() {
        const container = document.getElementById('globe-container');
        if (!container || !window.THREE) {
            console.warn('Globe: container or THREE not found');
            return;
        }

        // ── Force explicit size so clientWidth/Height are nonzero ──
        const SIZE = container.offsetWidth || parseInt(getComputedStyle(container).width) || 320;
        container.style.width  = SIZE + 'px';
        container.style.height = SIZE + 'px';

        const scene    = new THREE.Scene();
        const camera   = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
        camera.position.z = 11;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(SIZE, SIZE);
        renderer.domElement.style.cssText = 'width:100%;height:100%;border-radius:50%;display:block;';
        container.innerHTML = ''; // clear any old canvas
        container.appendChild(renderer.domElement);
        globeRenderer = renderer;

        /* ── Earth ── */
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        const texLoader = new THREE.TextureLoader();
        texLoader.crossOrigin = 'anonymous';

        // Helper: create Earth sphere with a given texture or color
        function addEarthSphere(texture) {
            // Remove any existing sphere (index 0 is always Earth)
            if (globeGroup.children[0] && globeGroup.children[0].userData.isEarth) {
                globeGroup.children[0].geometry.dispose();
                globeGroup.children[0].material.dispose();
                globeGroup.remove(globeGroup.children[0]);
            }
            const mat = texture
                ? new THREE.MeshPhongMaterial({ map: texture, specular: new THREE.Color(0x333333), shininess: 18 })
                : new THREE.MeshPhongMaterial({ color: 0x1e6fa8, emissive: new THREE.Color(0x0a2a44), shininess: 10 });
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(4, 64, 64), mat);
            sphere.userData.isEarth = true;
            globeGroup.add(sphere);
        }

        // Try multiple texture sources (CORS-friendly)
        const TEXTURE_URLS = [
            // NASA / unpkg hosted – CORS ok
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            // CartoDB hosted Earth
            'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
            // Fallback: canvas-painted Earth
            null
        ];

        function tryLoadTexture(urls, idx = 0) {
            if (idx >= urls.length || urls[idx] === null) {
                addEarthSphere(null); // canvas fallback color
                return;
            }
            texLoader.load(
                urls[idx],
                (tex) => addEarthSphere(tex),
                undefined,
                () => tryLoadTexture(urls, idx + 1) // try next on error
            );
        }
        tryLoadTexture(TEXTURE_URLS);

        /* ── Atmosphere glow ── */
        const atmoMesh = new THREE.Mesh(
            new THREE.SphereGeometry(4.28, 64, 64),
            new THREE.MeshPhongMaterial({
                color: 0x4af3ff, transparent: true, opacity: 0.08,
                side: THREE.BackSide, depthWrite: false
            })
        );
        globeGroup.add(atmoMesh);

        /* ── Lighting ── */
        scene.add(new THREE.AmbientLight(0xffffff, 0.75));
        const sun = new THREE.DirectionalLight(0xfff5d0, 1.0);
        sun.position.set(10, 5, 8);
        scene.add(sun);

        /* ── Station Markers ── */
        // Each marker gets its OWN geometry instance (not shared) to avoid position contamination
        stations.forEach((s, i) => {
            const phi   = (90 - s.lat) * (Math.PI / 180);
            const theta = (s.lon + 180) * (Math.PI / 180);
            const R = 4.18;

            // Pulsing outer glow
            const glow = new THREE.Mesh(
                new THREE.SphereGeometry(0.32, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0x84fab0, transparent: true, opacity: 0.35 })
            );
            // Inner bright dot
            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0x00ffaa })
            );

            const pos = new THREE.Vector3(
                -R * Math.sin(phi) * Math.cos(theta),
                 R * Math.cos(phi),
                 R * Math.sin(phi) * Math.sin(theta)
            );
            glow.position.copy(pos);
            dot.position.copy(pos);
            glow.userData = { stationId: i, isGlow: true };
            dot.userData  = { stationId: i };
            globeGroup.add(glow);
            globeGroup.add(dot);
        });

        /* ── Raycaster ── */
        const raycaster = new THREE.Raycaster();
        const mouse     = new THREE.Vector2();

        function getMouseNDC(clientX, clientY) {
            const rect = renderer.domElement.getBoundingClientRect();
            return {
                x:  ((clientX - rect.left)  / rect.width)  * 2 - 1,
                y: -((clientY - rect.top)   / rect.height) * 2 + 1
            };
        }

        /* ── Drag / Touch ── */
        let isDragging = false;
        let pointerPrev = { x: 0, y: 0 };
        let clickMoved  = false;
        const ROTATE_SPEED = 0.006;

        function onPointerDown(x, y) {
            isDragging = true;
            clickMoved = false;
            pointerPrev = { x, y };
            container.style.cursor = 'grabbing';
        }
        function onPointerMove(x, y) {
            if (isDragging) {
                const dx = x - pointerPrev.x;
                const dy = y - pointerPrev.y;
                if (Math.abs(dx) + Math.abs(dy) > 2) clickMoved = true;
                globeGroup.rotation.y += dx * ROTATE_SPEED;
                globeGroup.rotation.x += dy * ROTATE_SPEED;
                pointerPrev = { x, y };
            } else {
                // Hover highlight
                const ndc = getMouseNDC(x, y);
                mouse.set(ndc.x, ndc.y);
                raycaster.setFromCamera(mouse, camera);
                const hits = raycaster.intersectObjects(globeGroup.children);
                globeGroup.children.forEach(c => { if (c.userData.stationId !== undefined) c.scale.setScalar(1); });
                const hit = hits.find(h => h.object.userData.stationId !== undefined);
                container.style.cursor = hit ? 'pointer' : 'grab';
                if (hit) hit.object.scale.setScalar(1.6);
            }
        }
        function onPointerUp(clientX, clientY) {
            isDragging = false;
            container.style.cursor = 'grab';
            if (!clickMoved) {
                const ndc = getMouseNDC(clientX, clientY);
                mouse.set(ndc.x, ndc.y);
                raycaster.setFromCamera(mouse, camera);
                const hits = raycaster.intersectObjects(globeGroup.children);
                const hit = hits.find(h => h.object.userData.stationId !== undefined);
                if (hit) loadStation(hit.object.userData.stationId, true);
            }
        }

        // Mouse
        container.addEventListener('mousedown', e => onPointerDown(e.clientX, e.clientY));
        window.addEventListener('mousemove',    e => { if (isDragging) onPointerMove(e.clientX, e.clientY); });
        container.addEventListener('mousemove', e => { if (!isDragging) onPointerMove(e.clientX, e.clientY); });
        window.addEventListener('mouseup',      e => onPointerUp(e.clientX, e.clientY));

        // Touch
        container.addEventListener('touchstart', e => {
            e.preventDefault();
            onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        container.addEventListener('touchmove', e => {
            e.preventDefault();
            onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        container.addEventListener('touchend', e => {
            const t = e.changedTouches[0];
            onPointerUp(t.clientX, t.clientY);
        });

        /* ── Animate ── */
        let clock = 0;
        function animate() {
            requestAnimationFrame(animate);
            clock += 0.04;

            // Pulse glow markers
            globeGroup.children.forEach(c => {
                if (c.userData.isGlow) {
                    const pulse = 1 + 0.25 * Math.sin(clock + c.userData.stationId * 0.8);
                    c.scale.setScalar(pulse);
                    c.material.opacity = 0.2 + 0.15 * Math.sin(clock + c.userData.stationId * 0.8);
                }
            });

            if (!isDragging) globeGroup.rotation.y += isPlaying ? 0.0005 : 0.0015;
            renderer.render(scene, camera);
        }
        animate();

        /* ── Resize ── */
        const ro = new ResizeObserver(() => {
            const s = container.offsetWidth;
            renderer.setSize(s, s);
            // camera aspect stays 1:1
        });
        ro.observe(container);
    }

    /* ── Init on load ── */
    // Use requestIdleCallback / fallback so globe inits after layout is stable
    function startGlobe() {
        // Small delay to ensure container has dimensions
        setTimeout(initGlobe, 150);
    }

    if (document.readyState === 'complete') {
        startGlobe();
        renderList('all');
        loadStation(0, false);
    } else {
        window.addEventListener('load', () => {
            startGlobe();
            renderList('all');
            loadStation(0, false);
        });
    }

})();
