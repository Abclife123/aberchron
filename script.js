// ── Intersection Observer for scroll reveals ──────────────────────
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    },
    {
        threshold: 0.15,
    }
);

document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
});

// ── Three.js 3D Background ─────────────────────────────────────────
let scene, camera, renderer, particles = [];

function init3D() {
    const canvas = document.getElementById("3d-canvas");
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x0a1f24, 0.002);

    // Camera
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Create 3D objects
    createGeometries();

    // Light
    const light = new THREE.PointLight(0x1eeee6, 1.5);
    light.position.set(50, 50, 100);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x1eeee6, 0.4);
    scene.add(ambientLight);

    // Animation loop
    animate();

    // Handle resize
    window.addEventListener("resize", onWindowResize, false);
}

function createGeometries() {
    const geometries = [
        new THREE.IcosahedronGeometry(3, 4),
        new THREE.OctahedronGeometry(3, 0),
        new THREE.TorusGeometry(4, 1, 16, 8),
        new THREE.TetrahedronGeometry(3, 0),
    ];

    const colors = [0x1eeee6, 0x0db4a8, 0x00ff99, 0x00d9ff];

    for (let i = 0; i < 6; i++) {
        const geom = geometries[i % geometries.length];
        const color = colors[i % colors.length];
        const material = new THREE.MeshPhongMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.3,
            wireframe: Math.random() > 0.5,
            transparent: true,
            opacity: 0.6,
        });

        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );

        mesh.vx = (Math.random() - 0.5) * 0.02;
        mesh.vy = (Math.random() - 0.5) * 0.02;
        mesh.vz = (Math.random() - 0.5) * 0.02;
        mesh.rx = (Math.random() - 0.5) * 0.006;
        mesh.ry = (Math.random() - 0.5) * 0.006;
        mesh.rz = (Math.random() - 0.5) * 0.006;

        scene.add(mesh);
        particles.push(mesh);
    }
}

function animate() {
    requestAnimationFrame(animate);

    particles.forEach((p) => {
        p.position.x += p.vx;
        p.position.y += p.vy;
        p.position.z += p.vz;

        p.rotation.x += p.rx;
        p.rotation.y += p.ry;
        p.rotation.z += p.rz;

        // Wrap around edges
        if (p.position.x > 60) p.position.x = -60;
        if (p.position.x < -60) p.position.x = 60;
        if (p.position.y > 60) p.position.y = -60;
        if (p.position.y < -60) p.position.y = 60;
        if (p.position.z > 60) p.position.z = -60;
        if (p.position.z < -60) p.position.z = 60;
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

// Initialize 3D on load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init3D);
} else {
    init3D();
}