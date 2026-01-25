/* =========================================
   2. 3D PARTICLE BACKGROUND (Three.js)
   ========================================= */
(function () {
    const bgContainer = document.getElementById('canvas-bg');
    if (bgContainer && window.THREE) {
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

        for (let i = 0; i < particlesCount; i++) {
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
