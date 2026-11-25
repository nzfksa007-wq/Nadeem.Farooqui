const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
if (menuButton && nav) {
  const closeMenu = () => { menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
}
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
const form = document.getElementById('contact-form');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const name = String(fields.get('name')).trim();
  const region = String(fields.get('region')).trim();
  const challenge = String(fields.get('challenge')).trim();
  const subject = encodeURIComponent(`Supply chain consultation — ${region}`);
  const body = encodeURIComponent(`Hello Nadeem,\n\nMy name is ${name}.\n\nMy operation is based in ${region}.\n\nI would like to improve:\n${challenge}\n\nPlease let me know a convenient time to talk.\n\nRegards,\n${name}`);
  const note = document.getElementById('form-note');
  if (note) note.textContent = 'Opening your email app with the inquiry details…';
  window.location.href = `mailto:nadeem.farooqui1@outlook.com?subject=${subject}&body=${body}`;
});

const canvas = document.getElementById('supply-globe');
const art = document.querySelector('.hero-art');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowPower = window.matchMedia('(max-width: 700px)').matches;

if (canvas && art) {
  import('three').then(({
    Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh, MeshStandardMaterial,
    MeshBasicMaterial, BoxGeometry, PlaneGeometry, SphereGeometry, Vector3, SRGBColorSpace,
    CatmullRomCurve3, TubeGeometry, Line, LineBasicMaterial, AmbientLight,
    DirectionalLight, GridHelper, MathUtils
  }) => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(6.2, 5.3, 8.4);
    camera.lookAt(0, 0.72, 0);
    const renderer = new WebGLRenderer({
      canvas, alpha: true, antialias: !lowPower, powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.15 : 1.55));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    const world = new Group();
    scene.add(world);

    scene.add(new AmbientLight(0xaebfd0, 1.8));
    const keyLight = new DirectionalLight(0xffd99a, 3.4);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);
    const fillLight = new DirectionalLight(0x7898b7, 2.1);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    const floorMat = new MeshStandardMaterial({color: 0x162a40, roughness: 0.92, metalness: 0.04});
    const frameMat = new MeshStandardMaterial({color: 0x7890a5, roughness: 0.42, metalness: 0.48});
    const beamMat = new MeshStandardMaterial({color: 0xc5d0d6, roughness: 0.5, metalness: 0.38});
    const beltMat = new MeshStandardMaterial({color: 0x26394b, roughness: 0.78, metalness: 0.18});
    const brassMat = new MeshStandardMaterial({color: 0xd2aa66, roughness: 0.4, metalness: 0.42});
    const cartons = [
      new MeshStandardMaterial({color: 0xc79d59, roughness: 0.82}),
      new MeshStandardMaterial({color: 0x8da8bd, roughness: 0.8}),
      new MeshStandardMaterial({color: 0xe1d6c0, roughness: 0.86})
    ];
    const ground = new Mesh(new PlaneGeometry(7.2, 5.6), floorMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.08;
    world.add(ground);

    const grid = new GridHelper(7, 28, 0x49617a, 0x31465d);
    grid.position.y = -0.065;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    world.add(grid);

    const addBox = (parent, x, y, z, sx, sy, sz, material) => {
      const mesh = new Mesh(new BoxGeometry(sx, sy, sz), material);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    };

    // Three short rack bays make the warehouse recognizable without crowding the hero.
    for (let bay = 0; bay < 3; bay++) {
      const centerX = (bay - 1) * 1.23;
      const backZ = -1.05;
      for (const offset of [-0.53, 0.53]) {
        addBox(world, centerX + offset, 0.89, backZ, 0.075, 1.82, 0.075, frameMat);
        addBox(world, centerX + offset, 0.13, backZ + 0.08, 0.15, 0.12, 0.17, brassMat);
      }
      for (const shelfY of [0.34, 0.98, 1.62]) {
        addBox(world, centerX, shelfY, backZ, 1.15, 0.075, 0.82, beamMat);
        addBox(world, centerX, shelfY - 0.12, backZ + 0.42, 1.15, 0.055, 0.06, brassMat);
      }
      const qty = lowPower ? 2 : 3;
      for (let level = 0; level < 2; level++) {
        for (let item = 0; item < qty; item++) {
          const x = centerX + (item - (qty - 1) / 2) * 0.32;
          const z = backZ + (item % 2) * 0.26 - 0.1;
          const y = level === 0 ? 0.61 : 1.25;
          const box = addBox(world, x, y, z, 0.27, 0.27, 0.28, cartons[(bay + item + level) % cartons.length]);
          box.rotation.y = (item % 2 ? 0.025 : -0.025);
        }
      }
    }

    // A compact dispatch bay at the end of the route.
    addBox(world, 2.2, 0.62, 1.18, 0.14, 1.24, 0.13, frameMat);
    addBox(world, 2.82, 0.62, 1.18, 0.14, 1.24, 0.13, frameMat);
    addBox(world, 2.51, 1.22, 1.18, 0.75, 0.12, 0.13, brassMat);
    addBox(world, 2.51, 0.62, 1.11, 0.47, 0.9, 0.045, beltMat);

    // The route is a continuous pick-to-dispatch lane; one pallet moves along it.
    const routePoints = [
      new Vector3(-0.82, 0.035, -0.43),
      new Vector3(-0.55, 0.04, 0.02),
      new Vector3(-0.08, 0.045, 0.4),
      new Vector3(0.68, 0.05, 0.72),
      new Vector3(1.96, 0.055, 1.02)
    ];
    const route = new CatmullRomCurve3(routePoints);
    const routeMesh = new Mesh(
      new TubeGeometry(route, lowPower ? 42 : 72, 0.018, 5, false),
      new MeshBasicMaterial({color: 0xd6b16e, transparent: true, opacity: 0.82})
    );
    world.add(routeMesh);

    const pallet = new Group();
    addBox(pallet, 0, 0.08, 0, 0.48, 0.09, 0.38, brassMat);
    addBox(pallet, -0.1, 0.27, 0, 0.22, 0.27, 0.29, cartons[1]);
    addBox(pallet, 0.13, 0.27, 0, 0.22, 0.27, 0.29, cartons[0]);
    world.add(pallet);

    const markers = routePoints.filter((_, i) => i === 0 || i === routePoints.length - 1);
    for (const point of markers) {
      const marker = new Mesh(
        new SphereGeometry(0.055, 10, 8),
        new MeshBasicMaterial({color: 0xf1ca80})
      );
      marker.position.copy(point);
      marker.position.y += 0.02;
      world.add(marker);
    }

    let pointerX = 0, pointerY = 0, raf = 0, elapsed = 0;
    art.addEventListener('pointermove', event => {
      const rect = art.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    }, {passive: true});
    art.addEventListener('pointerleave', () => {
      pointerX = 0; pointerY = 0;
    }, {passive: true});

    const resize = () => {
      const rect = art.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.position.set(lowPower ? 6.7 : 6.2, 5.3, lowPower ? 9.1 : 8.4);
      camera.lookAt(0, 0.72, 0);
      camera.updateProjectionMatrix();
      if (reduceMotion) renderer.render(scene, camera);
    };
    new ResizeObserver(resize).observe(art);
    resize();

    let previous = 0;
    const render = time => {
      raf = requestAnimationFrame(render);
      if (previous) elapsed += Math.min((time - previous) / 1000, 0.05);
      previous = time;
      world.rotation.y = MathUtils.lerp(world.rotation.y, pointerX * 0.09, 0.04);
      world.rotation.x = MathUtils.lerp(world.rotation.x, -pointerY * 0.035, 0.04);
      const progress = (elapsed * 0.075) % 1;
      const position = route.getPointAt(progress);
      pallet.position.set(position.x, position.y, position.z);
      pallet.rotation.y = Math.atan2(position.x, Math.max(0.01, position.z)) * 0.25;
      renderer.render(scene, camera);
    };
    if (reduceMotion) {
      const position = route.getPointAt(0.35);
      pallet.position.copy(position);
      renderer.render(scene, camera);
    } else {
      render(0);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
        else if (!raf) render(0);
      });
    }
    canvas.dataset.ready = 'true';
  }).catch(() => {
    canvas.hidden = true;
    art.classList.add('static-globe');
  });
}
