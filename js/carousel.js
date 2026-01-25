/* =========================================
   5. HERO CAROUSEL ROTATOR
   ========================================= */
(function () {
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

        if (heroImg) heroImg.style.opacity = 0;
        if (heroName) heroName.style.opacity = 0;
        if (heroHeadline) heroHeadline.style.opacity = 0;
        if (heroDesc) heroDesc.style.opacity = 0;

        setTimeout(() => {
            if (heroImg) { heroImg.src = nextArtist.profileImage; heroImg.style.objectPosition = nextArtist.imgPos; }
            if (heroGenre) heroGenre.textContent = nextArtist.genre;
            if (heroName) heroName.innerHTML = nextArtist.titleHTML;
            if (heroHeadline) heroHeadline.textContent = `"${nextArtist.headline}"`;
            if (heroDesc) heroDesc.textContent = nextArtist.longBio;

            if (heroBtn) {
                heroBtn.onclick = () => {
                    const targetBtn = document.querySelector(`.artist-btn[data-name="${nextArtist.name}"]`) ||
                        document.querySelector(`.artist-btn[data-name*="${nextArtist.name.split(' ')[0]}"]`);
                    if (targetBtn) { targetBtn.click(); document.getElementById('dName').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                };
            }

            setTimeout(() => {
                if (heroImg) heroImg.style.opacity = 1;
                if (heroName) heroName.style.opacity = 1;
                if (heroHeadline) heroHeadline.style.opacity = 1;
                if (heroDesc) heroDesc.style.opacity = 1;
            }, 100);
        }, 500);

        currentIndex = (currentIndex + 1) % artistSets.length;
    };

    updateCarousel();
    setInterval(updateCarousel, 8000);
})();
