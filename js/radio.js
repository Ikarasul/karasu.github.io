/* =========================================
   9. WORLD RADIO & GLOBE (DRAGGABLE + EXTENDED STATIONS)
   ========================================= */
(function () {
    // [UPDATE] Extended Station List
    const stations = [
        // Thailand (Famous stations from radio4u.in + Atime)
        { name: "Cool Fahrenheit 93", country: "Thailand", flag: "🇹🇭", genre: "Easy Listening", url: "https://coolism-web3rd.cdn.byteark.com/;stream/1", lat: 13.80, lon: 100.55 },
        { name: "Green Wave 106.5", country: "Thailand", flag: "🇹🇭", genre: "Easy Listening", url: "https://atimeonline2.smartclick.co.th/green/playlist.m3u8", lat: 13.74, lon: 100.56 },
        { name: "EFM 94", country: "Thailand", flag: "🇹🇭", genre: "Pop / Hits", url: "https://atimeonline2.smartclick.co.th/efm/playlist.m3u8", lat: 13.74, lon: 100.56 },
        { name: "Chill Online", country: "Thailand", flag: "🇹🇭", genre: "Chill / Indie", url: "https://atimeonline2.smartclick.co.th/chill/playlist.m3u8", lat: 13.74, lon: 100.56 },
        { name: "HITZ Thailand", country: "Thailand", flag: "🇹🇭", genre: "T-Pop / Hits", url: "https://stream.teroradio.com/hitz955", lat: 13.75, lon: 100.50 },
        { name: "Eazy FM 105.5", country: "Thailand", flag: "🇹🇭", genre: "Easy Listening", url: "https://stream.teroradio.com/eazyfm", lat: 12.56, lon: 99.95 },
        { name: "MCOT News 100.5", country: "Thailand", flag: "🇹🇭", genre: "News / Talk", url: "https://radio1.mcot.net/fm1005", lat: 13.76, lon: 100.57 },
        { name: "Thai Music Radio", country: "Thailand", flag: "🇹🇭", genre: "T-Pop / Hits", url: "https://www.thaimusic.me/128.mp3", lat: 13.75, lon: 100.50 },

        // Japan
        { name: "Listen.moe (J-Pop)", country: "Japan", flag: "🇯🇵", genre: "Anime / J-Pop", url: "https://listen.moe/stream", lat: 35.68, lon: 139.76 },
        { name: "Asia DREAM Radio", country: "Japan", flag: "🇯🇵", genre: "J-Pop / Sakura", url: "https://igor.torontocast.com:1025/;", lat: 34.69, lon: 135.50 },

        // Korea
        { name: "Listen.moe (K-Pop)", country: "Korea", flag: "🇰🇷", genre: "K-Pop Hits", url: "https://listen.moe/kpop/stream", lat: 37.56, lon: 126.97 },
        { name: "Big B Radio", country: "Korea", flag: "🇰🇷", genre: "K-Pop", url: "https://antares.dribbcast.com/proxy/kpop?mp=/s", lat: 35.17, lon: 129.07 },

        // USA
        { name: "SomaFM: Groove Salad", country: "USA", flag: "🇺🇸", genre: "Chill / Ambient", url: "http://ice1.somafm.com/groovesalad-128-mp3", lat: 37.77, lon: -122.41 },
        { name: "KEXP 90.3", country: "USA", flag: "🇺🇸", genre: "Alternative", url: "https://live.kexp.org/kexp/kexp-128.mp3", lat: 47.60, lon: -122.33 },

        // UK (BBC Radio)
        { name: "BBC Radio 1", country: "UK", flag: "🇬🇧", genre: "Pop / Hits", url: "https://as-hls-ww-live.akamaized.net/pool_01505109/live/ww/bbc_radio_one/bbc_radio_one.isml/bbc_radio_one-audio%3d96000.norewind.m3u8", lat: 51.52, lon: -0.14 },
        { name: "BBC Radio 2", country: "UK", flag: "🇬🇧", genre: "Adult Contemporary", url: "https://as-hls-ww-live.akamaized.net/pool_74208725/live/ww/bbc_radio_two/bbc_radio_two.isml/bbc_radio_two-audio%3d96000.norewind.m3u8", lat: 51.50, lon: -0.12 },
        { name: "BBC Radio 1Xtra", country: "UK", flag: "🇬🇧", genre: "Urban / Hip Hop", url: "https://as-hls-ww-live.akamaized.net/pool_92079267/live/ww/bbc_1xtra/bbc_1xtra.isml/bbc_1xtra-audio%3d96000.norewind.m3u8", lat: 51.51, lon: -0.13 },

        // France
        { name: "Europe 1", country: "France", flag: "🇫🇷", genre: "News / Talk", url: "http://stream.europe1.fr/europe1.mp3", lat: 48.85, lon: 2.35 }
    ];

    let audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = 0.1; // Default volume (Low)
    let isPlaying = false;
    let currentIdx = 0;
    let activeFilter = 'all';

    const btnPlay = document.getElementById('btn-radio-play');
    const stationList = document.getElementById('station-list');
    const radioFilters = document.getElementById('radio-filters');
    const txtName = document.getElementById('radio-station-name');
    const txtCountry = document.getElementById('radio-country');

    // --- Render Filters ---
    if (radioFilters) {
        const countries = [...new Set(stations.map(s => JSON.stringify({ name: s.country, flag: s.flag })))].map(s => JSON.parse(s));
        countries.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-light rounded-pill px-3 me-2';
            btn.textContent = `${c.flag} ${c.name}`;
            btn.dataset.filter = c.name;
            btn.onclick = () => {
                document.querySelectorAll('#radio-filters button').forEach(b => { b.classList.remove('active'); b.classList.add('btn-outline-light'); });
                btn.classList.add('active');
                btn.classList.remove('btn-outline-light');
                renderList(c.name);
            };
            radioFilters.appendChild(btn);
        });
        const btnAll = radioFilters.querySelector('[data-filter="all"]');
        if (btnAll) {
            btnAll.onclick = () => {
                document.querySelectorAll('#radio-filters button').forEach(b => { b.classList.remove('active'); b.classList.add('btn-outline-light'); });
                btnAll.classList.add('active');
                renderList('all');
            };
        }
    }

    // --- Render Station List ---
    function renderList(filter) {
        if (!stationList) return;
        activeFilter = filter;
        stationList.innerHTML = '';
        stations.forEach((s, idx) => {
            if (filter !== 'all' && s.country !== filter) return;
            const item = document.createElement('button');
            item.className = `list-group-item list-group-item-action radio-item p-3 d-flex align-items-center justify-content-between ${idx === currentIdx ? 'active' : ''}`;
            item.innerHTML = `<div class="d-flex align-items-center"><span class="badge bg-light text-dark me-3 rounded-pill" style="width:35px;">${idx + 1}</span><div class="text-start"><div class="fw-bold">${s.name}</div><small style="opacity:0.8">${s.flag} ${s.country}</small></div></div><i class="bi bi-play-circle fs-4 opacity-50"></i>`;
            item.onclick = () => loadStation(idx, true);
            stationList.appendChild(item);
        });
    }

    // --- Player Logic ---
    // --- Player Logic ---
    let hls = null; // HLS instance

    function loadStation(index, autoPlay = false) {
        currentIdx = index;
        const s = stations[index];
        if (txtName) txtName.textContent = s.name;
        if (txtCountry) txtCountry.innerHTML = `${s.flag} ${s.country} • ${s.genre}`;
        renderList(activeFilter);

        // Reset HLS if exists
        if (hls) {
            hls.destroy();
            hls = null;
        }

        // Check if HLS stream
        if (s.url.includes('.m3u8') && Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(s.url);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                if (autoPlay) playAudio();
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    console.error("HLS Error:", data);
                    handleError();
                }
            });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl') && s.url.includes('.m3u8')) {
            // Native HLS support (Safari)
            audio.src = s.url;
            audio.addEventListener('loadedmetadata', function () {
                if (autoPlay) playAudio();
            });
        } else {
            // Standard Stream (MP3/AAC)
            audio.src = s.url;
            if (autoPlay) playAudio();
        }

        audio.onerror = handleError;
    }

    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            if (btnPlay) btnPlay.innerHTML = '<i class="bi bi-pause-fill fs-1"></i>';
        }).catch(e => {
            console.warn("Autoplay blocked or stream error:", e);
            isPlaying = false;
            if (btnPlay) btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>';
        });
    }

    function handleError() {
        // Only alert if we tried to play and failed noticeably
        if (isPlaying) {
            alert("ขออภัย สถานีนี้ไม่สามารถเล่นได้ในขณะนี้ (อาจมีการปิดปรับปรุงหรือจำกัดโซน)");
            isPlaying = false;
            if (btnPlay) btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>';
        }
    }

    if (btnPlay) {
        btnPlay.onclick = () => {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>';
            } else {
                if (!audio.src && !hls) loadStation(currentIdx, true);
                else playAudio();
            }
        };
    }

    if (btnPlay) {
        btnPlay.onclick = () => {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>';
            } else {
                if (!audio.src) loadStation(0);
                audio.play();
                isPlaying = true;
                btnPlay.innerHTML = '<i class="bi bi-pause-fill fs-1"></i>';
            }
        };
    }
    document.getElementById('btn-radio-prev')?.addEventListener('click', () => { let newIdx = currentIdx - 1; if (newIdx < 0) newIdx = stations.length - 1; loadStation(newIdx, isPlaying); });
    document.getElementById('btn-radio-next')?.addEventListener('click', () => { let newIdx = currentIdx + 1; if (newIdx >= stations.length) newIdx = 0; loadStation(newIdx, isPlaying); });
    document.getElementById('radio-volume')?.addEventListener('input', (e) => { audio.volume = e.target.value; });

    // --- 3D Globe with DRAG Support ---
    function initGlobe() {
        const container = document.getElementById('globe-container');
        if (!container || !window.THREE) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 12;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);
        const texture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/1024px-Blue_Marble_2002.png');
        globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(4, 64, 64), new THREE.MeshPhongMaterial({ map: texture })));

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const pl = new THREE.PointLight(0xffffff, 0.5);
        pl.position.set(10, 10, 10);
        scene.add(pl);

        // Markers
        stations.forEach((s, i) => {
            const phi = (90 - s.lat) * (Math.PI / 180);
            const theta = (s.lon + 180) * (Math.PI / 180);
            const x = -(4.1 * Math.sin(phi) * Math.cos(theta));
            const z = (4.1 * Math.sin(phi) * Math.sin(theta));
            const y = (4.1 * Math.cos(phi));

            const marker = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshBasicMaterial({ color: 0x84fab0 }));
            marker.position.set(x, y, z);
            marker.userData = { id: i };
            globeGroup.add(marker);
        });

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // --- DRAG VARIABLES ---
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        // Mouse Down (Start Drag)
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
            container.style.cursor = 'grabbing';
        });

        // Mouse Up (Stop Drag)
        window.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });

        // Mouse Move (Drag & Hover)
        container.addEventListener('mousemove', (event) => {
            // 1. Dragging Logic
            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                const rotateSpeed = 0.005;
                globeGroup.rotation.y += deltaMove.x * rotateSpeed;
                globeGroup.rotation.x += deltaMove.y * rotateSpeed;

                previousMousePosition = { x: event.clientX, y: event.clientY };
                return; // Stop here if dragging (don't check hover)
            }

            // 2. Hover Logic (Raycasting)
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(globeGroup.children);

            // Reset scale
            globeGroup.children.forEach(child => {
                if (child.userData.id !== undefined) child.scale.set(1, 1, 1);
            });

            const hoveredMarker = intersects.find(hit => hit.object.userData.id !== undefined);
            if (hoveredMarker) {
                container.style.cursor = 'pointer';
                hoveredMarker.object.scale.set(1.5, 1.5, 1.5);
            } else {
                container.style.cursor = 'grab';
            }
        });

        // Click (Select Station - Only if not dragged far)
        container.addEventListener('click', (event) => {
            // Simple click check
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(globeGroup.children);
            if (intersects.length > 0 && intersects[0].object.userData.id !== undefined) {
                loadStation(intersects[0].object.userData.id, true);
            }
        });

        function animate() {
            requestAnimationFrame(animate);
            // Auto-rotate only if not dragging
            if (!isPlaying && !isDragging) globeGroup.rotation.y += 0.001;
            renderer.render(scene, camera);
        }
        animate();
    }

    window.addEventListener('load', () => {
        initGlobe();
        renderList('all');
        if (stations.length > 0) loadStation(0, false);
    });

})();
