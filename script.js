/* =========================================
   1. THEME MANAGEMENT & ASSET UPDATES
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const meowImg = document.getElementById('meowGuruImg');
    const mainLogo = document.getElementById('mainLogo');
  
    // --- Initialize Theme ---
    const savedTheme = localStorage.getItem('artistHubTheme');
    if (savedTheme === 'dark') {
      body.classList.add('dark');
      if(themeIcon) themeIcon.className = 'bi bi-sun-fill';
    }
  
    // --- Toggle Logic ---
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        
        // Icon Update
        if(themeIcon) themeIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        
        // Save Preference
        localStorage.setItem('artistHubTheme', isDark ? 'dark' : 'light');
  
        // Trigger updates for dynamic assets
        updateDynamicAssets(isDark);
      });
    }
  
    // --- Dynamic Asset Updater ---
    function updateDynamicAssets(isDark) {
      if (meowImg) {
        meowImg.src = isDark ? meowImg.dataset.dark : meowImg.dataset.light;
      }
      if (mainLogo) {
        mainLogo.src = isDark ? mainLogo.dataset.dark : mainLogo.dataset.light;
      }
    }
  
    updateDynamicAssets(body.classList.contains('dark'));
  });
  
  /* =========================================
     2. 3D PARTICLE BACKGROUND (Three.js)
     ========================================= */
  (function(){
    const bgContainer = document.getElementById('canvas-bg');
    if(bgContainer && window.THREE) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        bgContainer.appendChild(renderer.domElement);
  
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 600; 
        const posArray = new Float32Array(particlesCount * 3);
        const colorsArray = new Float32Array(particlesCount * 3);
  
        const palette = [
            new THREE.Color("#FF9A9E"), new THREE.Color("#A18CD1"), 
            new THREE.Color("#84FAB0"), new THREE.Color("#fad0c4"), new THREE.Color("#a1c4fd")
        ];
  
        for(let i = 0; i < particlesCount; i++) {
            posArray[i * 3 + 0] = (Math.random() - 0.5) * 20;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 15;
            const color = palette[Math.floor(Math.random() * palette.length)];
            colorsArray[i * 3 + 0] = color.r;
            colorsArray[i * 3 + 1] = color.g;
            colorsArray[i * 3 + 2] = color.b;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
  
        const material = new THREE.PointsMaterial({
            size: 0.12, vertexColors: true, transparent: true, opacity: 0.6,
            blending: THREE.AdditiveBlending, depthWrite: false
        });
  
        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);
        camera.position.z = 5;
  
        let mouseX = 0; let mouseY = 0;
        let targetX = 0; let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
  
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });
  
        const animateBg = () => {
            targetX = mouseX * 0.0003; targetY = mouseY * 0.0003;
            particlesMesh.rotation.y += 0.0008; 
            particlesMesh.rotation.z += 0.0004;
            particlesMesh.rotation.x += 0.03 * (targetY - particlesMesh.rotation.x);
            particlesMesh.rotation.y += 0.03 * (targetX - particlesMesh.rotation.y);
            renderer.render(scene, camera);
            requestAnimationFrame(animateBg);
        };
        animateBg();
  
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
  })();
  
  /* =========================================
     3. NAVIGATION & SCROLL EFFECTS
     ========================================= */
  (function(){
    // Reveal Animations
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 100;
  
      reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        const elementBottom = reveal.getBoundingClientRect().bottom;
        if (elementTop < windowHeight - elementVisible && elementBottom > elementVisible) {
          reveal.classList.add('active');
        } else {
          reveal.classList.remove('active');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
  
    // Navbar Scroll Spy
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${id}`) link.classList.add('active');
          });
        }
      });
    }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  
    // Navbar Glass Effect
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.navbar');
      if(nav) {
          if(window.scrollY > 50) { 
              nav.style.background = 'rgba(255,255,255,0.98)'; 
              nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; 
          } else { 
              nav.style.background = 'rgba(255,255,255,0.95)'; 
              nav.style.boxShadow = 'none'; 
          }
      }
    });
  })();
  
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
              if(filterVal === 'all') h.classList.remove('hidden');
              else { 
                  if(filterVal === h.dataset.group) h.classList.remove('hidden'); 
                  else h.classList.add('hidden'); 
              }
          });
      };
  
      filters.forEach(f => {
        f.addEventListener('click', () => {
          filters.forEach(el => el.classList.remove('active')); f.classList.add('active');
          applyFilter(f.dataset.filter);
          if(searchInput) searchInput.value = '';
          if(isSorted && sortBtn) sortBtn.click(); 
        });
      });
  
      // --- Searching ---
      if(searchInput) {
          searchInput.addEventListener('input', (e) => {
              const term = e.target.value.toLowerCase();
              headers.forEach(h => h.classList.add('hidden'));
              items.forEach(item => {
                  const name = item.dataset.name.toLowerCase();
                  const country = item.dataset.country.toLowerCase();
                  if(name.includes(term) || country.includes(term)) item.classList.remove('hidden');
                  else item.classList.add('hidden');
              });
              if(term === '') {
                  const activeFilter = document.querySelector('#artistFilters .filter-chip.active').dataset.filter;
                  applyFilter(activeFilter);
              }
          });
      }
  
      // --- Sorting ---
      if(sortBtn) {
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
        
        if(dPhoto) { dPhoto.style.opacity = 0; setTimeout(() => { dPhoto.src = data.photo; dPhoto.style.opacity = 1; }, 200); }
        if(dName) dName.textContent = data.name;
        if(dCountry) dCountry.textContent = data.country;
        if(dStyle) dStyle.textContent = data.style;
        if(dBio) {
            dBio.classList.remove('bio-anim'); 
            void dBio.offsetWidth; 
            dBio.innerHTML = data.bio; 
            dBio.classList.add('bio-anim');
        }
        
        let extra = {}; try { extra = JSON.parse(data.extra); } catch(e){}
        
        if(dYoutube) {
            dYoutube.innerHTML = '';
            if(extra.youtube) {
                extra.youtube.forEach(v => {
                    let vidId = '';
                    if (v.url.includes('youtu.be/')) vidId = v.url.split('youtu.be/')[1].split('?')[0];
                    else if (v.url.includes('v=')) vidId = v.url.split('v=')[1].split('&')[0];
                    if(vidId) dYoutube.innerHTML += `<div class="video-card" onclick="window.open('${v.url}')"><img src="https://img.youtube.com/vi/${vidId}/hqdefault.jpg"><div class="p-2 small fw-bold text-truncate text-dark">${v.title}</div></div>`;
                });
            }
        }
        
        // --- ส่วนที่แก้ไข: Apple Music Loading Spinner ---
        if(dApple) {
            dApple.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-secondary spinner-border-sm" role="status"></div><span class="ms-2 small text-muted">กำลังโหลดเพลง...</span></div>';
            
            setTimeout(() => {
                if(extra.apple && extra.apple.length > 0) {
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
  
      if(items.length > 0) updateArtistDetail(items[0]);
      items.forEach(btn => btn.addEventListener('click', () => updateArtistDetail(btn)));
  });
  
  /* =========================================
     5. HERO CAROUSEL ROTATOR
     ========================================= */
  (function() {
    const artistSets = [
      { 
        name: "Three Man Down", 
        titleHTML: "Three Man<br><span class='hero-highlight'>Down</span>", 
        desc: "วงป๊อปร็อกหน้าใหม่ที่มาแรงที่สุดในขณะนี้", 
        genre: "THAI POP / ROCK",
        headline: "วงป๊อปร็อกขวัญใจวัยรุ่น",
        longBio: "เจ้าของเพลงฮิต 'ฝนตกไหม' ที่กวาดยอดวิวถล่มทลาย พร้อมสไตล์ดนตรีที่เป็นเอกลักษณ์",
        profileImage: "https://mintmagth.s3.ap-southeast-1.amazonaws.com/photos/shares/Mint%20Story/2023/June%202023/Three%20Man%20Down%20Con/647c174726716.jpg", 
        imgPos: "center center" 
      },
      { 
        name: "BOWKYLION", 
        titleHTML: "BOWKY<br><span class='hero-highlight'>LION</span>", 
        desc: "เจ้าแม่เพลงเศร้าและแฟชั่นไอคอนแห่งยุค", 
        genre: "THAI POP / INDIE",
        headline: "เจ้าแม่เพลงเศร้าแห่งยุค",
        longBio: "ศิลปินหญิงมากความสามารถ เจ้าของเพลงฮิต 'วาดไว้' และ 'ลงใจ'",
        profileImage: "https://media.atime.live/content/c7a34615-d6a7-43ab-a59d-17b3bae0c99e.jpeg", 
        imgPos: "top center" 
      },
      { 
        name: "ADO (อาโดะ)", 
        titleHTML: "ADO<br><span class='hero-highlight'>Uta</span>", 
        desc: "พลังเสียงปีศาจจากญี่ปุ่น", 
        genre: "J-POP / ROCK",
        headline: "พลังเสียงปีศาจจากญี่ปุ่น",
        longBio: "เจ้าของเสียงร้องสุดทรงพลังที่เขย่าวงการเพลงทั่วโลก ผู้อยู่เบื้องหลังเสียงร้องของ 'Uta'",
        profileImage: "https://cms.dmpcdn.com/musicarticle/2025/01/14/e5577330-d28d-11ef-af62-bbb29a1bba7c_webp_original.webp", 
        imgPos: "center 20%" 
      },
      { 
        name: "Roseanne Park", 
        titleHTML: "Roseanne<br><span class='hero-highlight'>Park</span>", 
        desc: "เสียงร้องเอกลักษณ์และเสน่ห์ที่ไม่อาจต้านทาน", 
        genre: "K-POP / GLOBAL",
        headline: "กุหลาบงามแห่ง BLACKPINK",
        longBio: "Main Vocalist น้ำเสียงเอกลักษณ์ ผู้สร้างปรากฏการณ์โซโล่ 'On The Ground' และล่าสุดกับ 'APT.'",
        profileImage: "https://i.namu.wiki/i/fjnLZhByeJypmPtNpoH0W6BnJFw7l3AyZVH9LdhsQOdJWZS5jDSOCaE37ochEp4rvje_IgOfP1A36aMwcNvZcg.webp", 
        imgPos: "top center" 
      },
      { 
        name: "Taylor Swift", 
        titleHTML: "Taylor<br><span class='hero-highlight'>Swift</span>", 
        desc: "ศิลปินหญิงผู้ทรงอิทธิพลระดับโลก", 
        genre: "GLOBAL POP",
        headline: "ศิลปินหญิงผู้ทรงอิทธิพล",
        longBio: "ไอคอนระดับโลกผู้สร้างสรรค์บทเพลงจากประสบการณ์จริง เจ้าของสถิติรางวัลมากมาย",
        profileImage: "https://freight.cargo.site/t/original/i/e81c27bbe95fc33e5a72a3591bf94db6a7714c39ba290393489ff1ffcfc6a10c/MS_Swift_Taylor_CloseUp.jpg", 
        imgPos: "center center" 
      }
    ];
  
    let currentIndex = 0;
    
    const heroImg = document.getElementById('hero-img');
    const heroGenre = document.getElementById('hero-genre');
    const heroName = document.getElementById('hero-name');
    const heroHeadline = document.getElementById('hero-headline');
    const heroDesc = document.getElementById('hero-desc');
    const heroBtn = document.getElementById('hero-btn');
  
    const updateCarousel = () => {
      const nextArtist = artistSets[currentIndex];
  
      if(heroImg) heroImg.style.opacity = 0;
      if(heroName) heroName.style.opacity = 0;
      if(heroHeadline) heroHeadline.style.opacity = 0;
      if(heroDesc) heroDesc.style.opacity = 0;
  
      setTimeout(() => {
        if(heroImg) { heroImg.src = nextArtist.profileImage; heroImg.style.objectPosition = nextArtist.imgPos; }
        if(heroGenre) heroGenre.textContent = nextArtist.genre;
        if(heroName) heroName.innerHTML = nextArtist.titleHTML;
        if(heroHeadline) heroHeadline.textContent = `"${nextArtist.headline}"`;
        if(heroDesc) heroDesc.textContent = nextArtist.longBio;
        
        if(heroBtn) {
            heroBtn.onclick = () => {
                const targetBtn = document.querySelector(`.artist-btn[data-name="${nextArtist.name}"]`) || 
                                  document.querySelector(`.artist-btn[data-name*="${nextArtist.name.split(' ')[0]}"]`);
                if(targetBtn) { targetBtn.click(); document.getElementById('dName').scrollIntoView({behavior: 'smooth', block: 'center'}); }
            };
        }
  
        setTimeout(() => {
          if(heroImg) heroImg.style.opacity = 1;
          if(heroName) heroName.style.opacity = 1;
          if(heroHeadline) heroHeadline.style.opacity = 1;
          if(heroDesc) heroDesc.style.opacity = 1;
        }, 100);
      }, 500);
      
      currentIndex = (currentIndex + 1) % artistSets.length;
    };
  
    updateCarousel();
    setInterval(updateCarousel, 8000);
  })();
  
  /* =========================================
     6. AI GURU (GEMINI API)
     ========================================= */
  (function() {
     const chatBox = document.getElementById('ai-response');
     const userInput = document.getElementById('ai-user-input');
     const btnSend = document.getElementById('btn-ask-ai');
     
     // 🔴🔴 ใส่ API Key ของคุณที่นี่ 🔴🔴
     const apiKey = "AIzaSyAtalhKPaE8KY8iwPK1jmfyytOOb0g2rs4"; 
  
     if(btnSend && userInput && chatBox) {
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
  Task: Recommend music and concerts based on this mood: "${prompt}".
  Requirements:
  1. 🇹🇭 Reply in Thai language, acting like a cute cat (end sentences with "เมี๊ยว" or "นะเมี๊ยว").
  2. 🎵 Recommend 3 Songs: Must include a clickable YouTube link in Markdown format: [Song Name - Artist](https://www.youtube.com/results?search_query=Song+Name+Artist).
  3. 📝 Add a short 1-line description for each song.
  4. 🎫 Recommend 1 Concert or Artist known for great live shows.
  5. Use cute emojis! Keep it concise.`
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
           if(!text) return;
           addMessage(text, true);
           userInput.value = '';
           callGemini(text);
        });
        userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') btnSend.click(); });
     }
  })();
  
  /* =========================================
     7. GOSSIP SECTION ROTATOR
     ========================================= */
  (function(){
     const gossipSets = [
       { c1: { icon: 'bi-patch-question-fill', color: 'text-primary', title: 'เว็บนี้มีไว้ทำไมคะซิส?', content: `<p class="mb-2"><strong>ArtistHub คือ:</strong> พื้นที่ป้ายยาล้วนๆ!</p><span class="badge bg-secondary text-light">#พื้นที่อวยยศ</span>` }, c2: { icon: 'bi-heart-fill', color: 'text-danger', title: 'โมเม้นต์น่าเอ็นดู', content: `<ul class="list-unstyled mb-0"><li>👑 <strong>แม่โบกี้:</strong> ร้องสดกินแผ่น!</li><li>🎤 <strong>Ado:</strong> ตัวจริงขี้อายนะเออ</li></ul>` }, c3: { icon: 'bi-camera-reels-fill', color: 'text-success', title: 'เก็บตกงานอาร์ต', content: `<ul class="list-unstyled mb-0"><li>🔥 <strong>BKK Art Week:</strong> งานดี แต่ร้อนตับแตก</li></ul>` } },
       { c1: { icon: 'bi-stars', color: 'text-warning', title: 'ดวงช่วงนี้', content: `<p class="mb-2">🔮 <strong>ราศีธาตุลม:</strong> กดบัตรคอนได้แถวหน้า!</p>` }, c2: { icon: 'bi-chat-quote-fill', color: 'text-info', title: 'เรื่องลับฉบับติ่ง', content: `<ul class="list-unstyled mb-0"><li>🤫 <strong>เคล็ดลับ:</strong> บนด้วยชานมไข่มุก 3 แก้ว</li></ul>` }, c3: { icon: 'bi-award-fill', color: 'text-primary', title: 'Awards สาขาแปลก', content: `<ul class="list-unstyled mb-0"><li>🏆 <strong>สาขา "ยืนนิ่งๆ ก็เท่":</strong> Three Man Down</li></ul>` } },
       { c1: { icon: 'bi-backpack-fill', color: 'text-danger', title: 'Must Have', content: `<p class="mb-2">🎒 <strong>สิ่งที่ขาดไม่ได้:</strong> ยาดม, พัดลมจิ๋ว</p>` }, c2: { icon: 'bi-music-player-fill', color: 'text-success', title: 'How to ดูงานศิลป์', content: `<ul class="list-unstyled mb-0"><li>🎨 ยืนกอดอก ทำหน้าครุ่นคิด</li></ul>` }, c3: { icon: 'bi-emoji-laughing-fill', color: 'text-warning', title: 'จากแอดมิน', content: `<p class="mb-0">"ทำเว็บนี้เพราะใจรักล้วนๆ จ้า!"</p>` } }
     ];
     let curIdx = 0;
     const els = [1,2,3].map(n => ({ title: document.querySelector(`#sum-col${n}-title`), content: document.querySelector(`#sum-col${n}-content`) }));
     
     const updateSummary = (idx) => {
       const set = gossipSets[idx];
       if(els[0].title) { els[0].title.className = `fw-bold mb-2 text-primary`; els[0].title.innerHTML = `<i class="bi ${set.c1.icon} me-2"></i>${set.c1.title}`; els[0].content.innerHTML = set.c1.content; }
       if(els[1].title) { els[1].title.className = `fw-bold mb-2 text-dark`; els[1].title.innerHTML = `<i class="bi ${set.c2.icon} me-2"></i>${set.c2.title}`; els[1].content.innerHTML = set.c2.content; }
       if(els[2].title) { els[2].title.className = `fw-bold mb-2 text-primary`; els[2].title.innerHTML = `<i class="bi ${set.c3.icon} me-2"></i>${set.c3.title}`; els[2].content.innerHTML = set.c3.content; }
     };
     
     updateSummary(0);
     setInterval(() => {
       const container = document.getElementById('summary-container');
       if(container) container.classList.add('summary-fade');
       setTimeout(() => { 
           curIdx = (curIdx + 1) % gossipSets.length; 
           updateSummary(curIdx); 
           if(container) container.classList.remove('summary-fade'); 
       }, 500);
     }, 6000); 
  })();
  
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
        if(!chatContainer) return;
        
        if (!isBackgroundUpdate) {
            chatContainer.innerHTML = '<div class="text-center w-100 py-5"><div class="spinner-border text-secondary mb-2" role="status"></div><p class="small text-muted">กำลังโหลดข้อความจาก Sheets...</p></div>';
        }
  
        fetch(GOOGLE_SCRIPT_URL)
            .then(response => response.json())
            .then(data => {
                if(data.length === 0) {
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
  
    if(chatForm) {
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
                if(data.result === 'success') {
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
  
  /* =========================================
     9. WORLD RADIO & GLOBE (DRAGGABLE + EXTENDED STATIONS)
     ========================================= */
  (function(){
    // [UPDATE] Extended Station List
    const stations = [
      // Thailand (HITZ & Eazy from original request + Cat Radio)
      { name: "HITZ Thailand", country: "Thailand", flag: "🇹🇭", genre: "T-Pop / Hits", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/HITZ_955AAC.aac", lat: 13.75, lon: 100.50 },
      { name: "Eazy FM 105.5", country: "Thailand", flag: "🇹🇭", genre: "Easy Listening", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/EAZY_FM_AAC.aac", lat: 12.56, lon: 99.95 },
      { name: "Cat Radio", country: "Thailand", flag: "🇹🇭", genre: "Indie / Pop", url: "https://radio11.plathong.net/7028/stream", lat: 13.73, lon: 100.52 },

      // Japan
      { name: "Listen.moe (J-Pop)", country: "Japan", flag: "🇯🇵", genre: "Anime / J-Pop", url: "https://listen.moe/stream", lat: 35.68, lon: 139.76 },
      { name: "Asia DREAM Radio", country: "Japan", flag: "🇯🇵", genre: "J-Pop / Sakura", url: "https://igor.torontocast.com:1025/;", lat: 34.69, lon: 135.50 },

      // Korea
      { name: "Listen.moe (K-Pop)", country: "Korea", flag: "🇰🇷", genre: "K-Pop Hits", url: "https://listen.moe/kpop/stream", lat: 37.56, lon: 126.97 },
      { name: "Big B Radio", country: "Korea", flag: "🇰🇷", genre: "K-Pop", url: "http://192.99.8.192:3074/stream", lat: 35.17, lon: 129.07 },

      // USA
      { name: "SomaFM: Groove Salad", country: "USA", flag: "🇺🇸", genre: "Chill / Ambient", url: "https://ice1.somafm.com/groovesalad-128-mp3", lat: 37.77, lon: -122.41 },
      { name: "KEXP 90.3", country: "USA", flag: "🇺🇸", genre: "Alternative", url: "https://live.kexp.org/kexp/kexp-128.mp3", lat: 47.60, lon: -122.33 },

      // UK
      { name: "LBC News", country: "UK", flag: "🇬🇧", genre: "News / Talk", url: "https://media-ice.musicradio.com/LBCNews", lat: 51.50, lon: -0.12 },

      // France
      { name: "Europe 1", country: "France", flag: "🇫🇷", genre: "News / Talk", url: "https://stream.europe1.fr/europe1.mp3", lat: 48.85, lon: 2.35 }
    ];
  
    let audio = new Audio(); 
    audio.crossOrigin = "anonymous"; 
    let isPlaying = false; 
    let currentIdx = 0; 
    let activeFilter = 'all';
    
    const btnPlay = document.getElementById('btn-radio-play');
    const stationList = document.getElementById('station-list');
    const radioFilters = document.getElementById('radio-filters');
    const txtName = document.getElementById('radio-station-name'); 
    const txtCountry = document.getElementById('radio-country');
  
    // --- Render Filters ---
    if(radioFilters) {
        const countries = [...new Set(stations.map(s => JSON.stringify({name: s.country, flag: s.flag})))].map(s => JSON.parse(s));
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
        if(btnAll) {
            btnAll.onclick = () => { 
                document.querySelectorAll('#radio-filters button').forEach(b => { b.classList.remove('active'); b.classList.add('btn-outline-light'); }); 
                btnAll.classList.add('active'); 
                renderList('all'); 
            };
        }
    }
  
    // --- Render Station List ---
    function renderList(filter) {
        if(!stationList) return;
        activeFilter = filter; 
        stationList.innerHTML = '';
        stations.forEach((s, idx) => {
            if(filter !== 'all' && s.country !== filter) return;
            const item = document.createElement('button');
            item.className = `list-group-item list-group-item-action radio-item p-3 d-flex align-items-center justify-content-between ${idx === currentIdx ? 'active' : ''}`;
            item.innerHTML = `<div class="d-flex align-items-center"><span class="badge bg-light text-dark me-3 rounded-pill" style="width:35px;">${idx + 1}</span><div class="text-start"><div class="fw-bold">${s.name}</div><small style="opacity:0.8">${s.flag} ${s.country}</small></div></div><i class="bi bi-play-circle fs-4 opacity-50"></i>`;
            item.onclick = () => loadStation(idx, true); 
            stationList.appendChild(item);
        });
    }
  
    // --- Player Logic ---
    function loadStation(index, autoPlay = false) {
        currentIdx = index; 
        const s = stations[index]; 
        if(txtName) txtName.textContent = s.name; 
        if(txtCountry) txtCountry.innerHTML = `${s.flag} ${s.country} • ${s.genre}`;
        renderList(activeFilter); 
        
        audio.src = s.url;
        
        audio.onerror = function() {
            alert("ขออภัย สถานีนี้ไม่สามารถเล่นได้ในขณะนี้ (อาจมีการปิดปรับปรุงหรือจำกัดโซน)");
            isPlaying = false;
            if(btnPlay) btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>'; 
        };

        if(autoPlay) { 
            audio.play().then(() => { 
                isPlaying = true; 
                if(btnPlay) btnPlay.innerHTML = '<i class="bi bi-pause-fill fs-1"></i>'; 
            }).catch(e => { 
                isPlaying = false; 
                if(btnPlay) btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>'; 
            }); 
        } else { 
            audio.pause(); 
            isPlaying = false; 
            if(btnPlay) btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>'; 
        }
    }
  
    if(btnPlay) {
        btnPlay.onclick = () => { 
            if(isPlaying) { 
                audio.pause(); 
                isPlaying = false; 
                btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1 ms-1"></i>'; 
            } else { 
                if(!audio.src) loadStation(0); 
                audio.play(); 
                isPlaying = true; 
                btnPlay.innerHTML = '<i class="bi bi-pause-fill fs-1"></i>'; 
            } 
        };
    }
    document.getElementById('btn-radio-prev')?.addEventListener('click', () => { let newIdx = currentIdx - 1; if(newIdx < 0) newIdx = stations.length - 1; loadStation(newIdx, isPlaying); });
    document.getElementById('btn-radio-next')?.addEventListener('click', () => { let newIdx = currentIdx + 1; if(newIdx >= stations.length) newIdx = 0; loadStation(newIdx, isPlaying); });
    document.getElementById('radio-volume')?.addEventListener('input', (e) => { audio.volume = e.target.value; });
  
    // --- 3D Globe with DRAG Support ---
    function initGlobe() {
        const container = document.getElementById('globe-container'); 
        if(!container || !window.THREE) return;
        
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
                if(child.userData.id !== undefined) child.scale.set(1, 1, 1);
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
            if(!isPlaying && !isDragging) globeGroup.rotation.y += 0.001; 
            renderer.render(scene, camera); 
        } 
        animate();
    }
    
    window.addEventListener('load', () => {
        initGlobe(); 
        renderList('all'); 
        if(stations.length > 0) loadStation(0, false);
    });

  })();





