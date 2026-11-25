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
const flowStages = [
  {title:'Inbound receiving',copy:'Match the PO, count the delivery, and record receipt.'},
  {title:'Quality & exceptions',copy:'Inspect condition and isolate shortages or damage before put-away.'},
  {title:'Storage & replenishment',copy:'Use clear locations and replenish pick faces before they run dry.'},
  {title:'Pick & pack',copy:'Confirm the SKU, quantity, order, and packing standard.'},
  {title:'Dispatch & delivery',copy:'Release the load, hand over clearly, and track delivery closure.'}
];
let activeFlowStage = 0;
let stageRings = [];
const stageButtons = [...document.querySelectorAll('[data-flow-stage]')];
const stageTitle = document.querySelector('[data-stage-title]');
const stageCopy = document.querySelector('[data-stage-copy]');
const stageIndex = document.querySelector('.caption-index');
function selectFlowStage(index) {
  activeFlowStage = (index + flowStages.length) % flowStages.length;
  const stage = flowStages[activeFlowStage];
  if (stageTitle) stageTitle.textContent = stage.title;
  if (stageCopy) stageCopy.textContent = stage.copy;
  if (stageIndex) stageIndex.textContent = String(activeFlowStage + 1).padStart(2, '0') + ' / ' + String(flowStages.length).padStart(2, '0');
  stageButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeFlowStage)));
  stageRings.forEach((entry, i) => {
    entry.ring.material = i === activeFlowStage ? entry.activeMaterial : entry.idleMaterial;
    entry.ring.scale.setScalar(i === activeFlowStage ? 1.16 : 1);
    entry.beacon.material = i === activeFlowStage ? entry.activeMaterial : entry.idleMaterial;
  });
}
stageButtons.forEach((button, i) => button.addEventListener('click', () => selectFlowStage(i)));

if (canvas && art) {
  import('three').then(({
    Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh, MeshStandardMaterial,
    MeshBasicMaterial, BoxGeometry, PlaneGeometry, CylinderGeometry, SphereGeometry,
    TorusGeometry, Vector3, CatmullRomCurve3, TubeGeometry, AmbientLight,
    DirectionalLight, GridHelper, MathUtils, SRGBColorSpace
  }) => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(6.4, 5.6, 8.6);
    camera.lookAt(0, 0.68, 0);
    const renderer = new WebGLRenderer({
      canvas, alpha: true, antialias: !lowPower, powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.1 : 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    const warehouse = new Group();
    scene.add(warehouse);

    scene.add(new AmbientLight(0xb9c8d4, 1.65));
    const warmLight = new DirectionalLight(0xffd79a, 3.1);
    warmLight.position.set(4, 7, 5);
    scene.add(warmLight);
    const coolLight = new DirectionalLight(0x83a5c5, 2.0);
    coolLight.position.set(-5, 4, -3);
    scene.add(coolLight);

    const mat = {
      floor: new MeshStandardMaterial({color:0x172c42, roughness:.93}),
      steel: new MeshStandardMaterial({color:0x8fa4b6, roughness:.4, metalness:.48}),
      beam: new MeshStandardMaterial({color:0xc7d0d5, roughness:.48, metalness:.35}),
      belt: new MeshStandardMaterial({color:0x293e52, roughness:.78, metalness:.12}),
      brass: new MeshStandardMaterial({color:0xd1aa69, roughness:.38, metalness:.36}),
      dark: new MeshStandardMaterial({color:0x0d1c2c, roughness:.68, metalness:.22}),
      carton: [
        new MeshStandardMaterial({color:0xc99d58, roughness:.82}),
        new MeshStandardMaterial({color:0x8ca8bd, roughness:.78}),
        new MeshStandardMaterial({color:0xe5dac5, roughness:.85})
      ],
      teal: new MeshStandardMaterial({color:0x55c7bc, emissive:0x1a8279, emissiveIntensity:.65, roughness:.35}),
      route: new MeshBasicMaterial({color:0xe3bb75, transparent:true, opacity:.82}),
      idleRing: new MeshBasicMaterial({color:0x91a4b5, transparent:true, opacity:.48}),
      activeRing: new MeshBasicMaterial({color:0xf0c676, transparent:true, opacity:.95})
    };

    const addBox = (parent, x, y, z, sx, sy, sz, material, rotationY=0) => {
      const mesh = new Mesh(new BoxGeometry(sx, sy, sz), material);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotationY;
      parent.add(mesh);
      return mesh;
    };
    const addCylinder = (parent, x, y, z, radius, height, material, rotationX=0) => {
      const mesh = new Mesh(new CylinderGeometry(radius, radius, height, 12), material);
      mesh.position.set(x, y, z);
      mesh.rotation.x = rotationX;
      parent.add(mesh);
      return mesh;
    };

    // Open floor and location grid make the miniature read as a working warehouse.
    const floor = new Mesh(new PlaneGeometry(7.1, 5.2), mat.floor);
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -.08;
    warehouse.add(floor);
    const grid = new GridHelper(7, 28, 0x536a7f, 0x324960);
    grid.position.y = -.067;
    grid.material.transparent = true;
    grid.material.opacity = .22;
    warehouse.add(grid);

    // Open-frame building posts and roof rails frame the work area.
    for (const x of [-2.05, -0.7, 0.7, 2.05]) {
      addBox(warehouse, x, 1.08, -1.72, .075, 2.18, .075, mat.steel);
      addBox(warehouse, x, 1.08, 1.28, .075, 2.18, .075, mat.steel);
    }
    addBox(warehouse, 0, 2.17, -1.72, 4.25, .09, .08, mat.beam);
    addBox(warehouse, 0, 2.17, 1.28, 4.25, .09, .08, mat.beam);
    addBox(warehouse, 0, 2.14, -.22, .055, .07, 3.0, mat.beam);

    // Receiving bay: inbound pallet, receipt bench, and scan / quality gate.
    addBox(warehouse, -2.35, .13, -.45, .62, .22, .82, mat.belt);
    addBox(warehouse, -2.35, .28, -.45, .42, .1, .58, mat.brass);
    addBox(warehouse, -1.55, .43, -.18, .58, .13, .58, mat.beam);
    for (const x of [-1.8, -1.3]) addBox(warehouse, x, .2, -.18, .07, .38, .07, mat.steel);
    for (const x of [-1.85, -1.3]) {
      addBox(warehouse, x, .95, .24, .065, 1.55, .065, mat.steel);
      addBox(warehouse, x + .275, 1.68, .24, .55, .065, .065, mat.steel);
    }
    addBox(warehouse, -1.575, 1.68, .24, .09, .08, .1, mat.teal);

    // Three rack bays, labelled visually by location strips, hold mixed stock.
    const bayXs = [-.62, .43, 1.48];
    for (let bay=0; bay<bayXs.length; bay++) {
      const cx = bayXs[bay], backZ = -1.03;
      for (const dx of [-.45, .45]) {
        addBox(warehouse, cx+dx, .92, backZ, .07, 1.82, .07, mat.steel);
        addBox(warehouse, cx+dx, .14, backZ+.31, .14, .1, .16, mat.brass);
      }
      for (const y of [.35, .98, 1.61]) {
        addBox(warehouse, cx, y, backZ, .98, .07, .7, mat.beam);
        addBox(warehouse, cx, y-.13, backZ+.37, .98, .045, .05, mat.brass);
      }
      for (let level=0; level<2; level++) {
        for (let item=0; item<(lowPower?2:3); item++) {
          const count = lowPower?2:3;
          const x = cx + (item-(count-1)/2)*.28;
          const y = level===0?.61:1.24;
          const z = backZ + (item%2)*.22 - .04;
          addBox(warehouse, x, y, z, .23, .24, .24, mat.carton[(bay+item+level)%3], item%2?.025:-.025);
        }
      }
    }

    // Pick / pack workbench and staged order cartons.
    addBox(warehouse, 1.55, .43, .46, .8, .13, .48, mat.beam);
    for (const x of [1.23, 1.87]) addBox(warehouse, x, .2, .46, .07, .4, .07, mat.steel);
    addBox(warehouse, 1.37, .62, .43, .26, .25, .26, mat.carton[2]);
    addBox(warehouse, 1.69, .62, .43, .26, .25, .26, mat.carton[0]);
    addBox(warehouse, 1.55, .53, .8, .68, .035, .055, mat.belt);

    // Outbound dock door and lane.
    addBox(warehouse, 2.47, .67, .95, .09, 1.34, .09, mat.steel);
    addBox(warehouse, 3.02, .67, .95, .09, 1.34, .09, mat.steel);
    addBox(warehouse, 2.745, 1.31, .95, .64, .1, .09, mat.brass);
    addBox(warehouse, 2.745, .67, .91, .42, .9, .04, mat.dark);
    for (let i=0;i<4;i++) addBox(warehouse, 2.745, .34+i*.2, .875, .39, .025, .018, mat.steel);

    // Two compact vehicles connect supplier receipt and outbound delivery to the warehouse.
    const makeTruck = (x,z,accent,flip=1) => {
      const truck = new Group();
      truck.position.set(x,0,z);
      truck.rotation.y = flip===1 ? 0 : Math.PI;
      warehouse.add(truck);
      addBox(truck, -.08, .33, 0, .88, .48, .56, mat.beam);
      addBox(truck, .53, .3, 0, .36, .4, .52, accent);
      addBox(truck, .58, .43, 0, .19, .18, .43, mat.dark);
      for (const wx of [-.38,.28,.62]) for (const side of [-.27,.27]) {
        addCylinder(truck, wx, .12, side, .105, .07, mat.dark, Math.PI/2);
      }
      return truck;
    };
    makeTruck(-2.86, -1.12, mat.carton[1], 1);
    makeTruck(2.86, 1.28, mat.brass, -1);

    // The lit route links receiving, verification, storage, order preparation, and dispatch.
    const routePoints = [
      new Vector3(-2.3,.06,-.48),
      new Vector3(-1.55,.06,.35),
      new Vector3(-.45,.06,-.38),
      new Vector3(.42,.06,.43),
      new Vector3(1.55,.06,.48),
      new Vector3(2.72,.06,.9)
    ];
    const route = new CatmullRomCurve3(routePoints);
    warehouse.add(new Mesh(
      new TubeGeometry(route, lowPower?48:80, .022, 6, false),
      mat.route
    ));

    // Stage markers sit on the floor; the selected stage is highlighted by the controls above.
    const stagePositions = [
      routePoints[0].clone().lerp(routePoints[1],.56),
      routePoints[1],
      routePoints[2],
      routePoints[4],
      routePoints[5]
    ];
    stageRings = stagePositions.map((point, i) => {
      const ring = new Mesh(new TorusGeometry(.16,.016,5,30), mat.idleRing);
      ring.rotation.x = Math.PI/2;
      ring.position.set(point.x,.045,point.z);
      warehouse.add(ring);
      const beacon = new Mesh(new SphereGeometry(.045,10,8), mat.idleRing);
      beacon.position.set(point.x,.12,point.z);
      warehouse.add(beacon);
      return {ring,beacon,idleMaterial:mat.idleRing,activeMaterial:mat.activeRing};
    });
    selectFlowStage(activeFlowStage);

    // One pallet travels through the route, making the process visible rather than decorative.
    const movingPallet = new Group();
    addBox(movingPallet,0,.08,0,.45,.09,.36,mat.brass);
    addBox(movingPallet,-.105,.27,0,.21,.27,.28,mat.carton[1]);
    addBox(movingPallet,.12,.27,0,.21,.27,.28,mat.carton[0]);
    warehouse.add(movingPallet);

    let pointerX=0, pointerY=0, frame=0, elapsed=0, previousTime=0;
    art.addEventListener('pointermove',event=>{
      const rect=art.getBoundingClientRect();
      pointerX=(event.clientX-rect.left)/rect.width-.5;
      pointerY=(event.clientY-rect.top)/rect.height-.5;
    },{passive:true});
    art.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;},{passive:true});
    const resize=()=>{
      const rect=art.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      renderer.setSize(rect.width,rect.height,false);
      camera.aspect=rect.width/rect.height;
      camera.position.set(lowPower?6.8:6.4,5.6,lowPower?9.2:8.6);
      camera.lookAt(0,.68,0);
      camera.updateProjectionMatrix();
      if(reduceMotion) renderer.render(scene,camera);
    };
    new ResizeObserver(resize).observe(art);
    resize();

    const draw=(time=0)=>{
      if(!reduceMotion) frame=requestAnimationFrame(draw);
      if(previousTime) elapsed+=Math.min((time-previousTime)/1000,.05);
      previousTime=time;
      warehouse.rotation.y=MathUtils.lerp(warehouse.rotation.y,pointerX*.075,.04);
      warehouse.rotation.x=MathUtils.lerp(warehouse.rotation.x,-pointerY*.025,.04);
      const progress=reduceMotion?.42:(elapsed*.062)%1;
      const position=route.getPointAt(progress);
      movingPallet.position.set(position.x,position.y,position.z);
      const tangent=route.getTangentAt(progress);
      movingPallet.rotation.y=Math.atan2(tangent.x,tangent.z);
      renderer.render(scene,camera);
    };
    draw();
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){cancelAnimationFrame(frame);frame=0;}
      else if(!reduceMotion&&!frame){previousTime=0;frame=requestAnimationFrame(draw);}
    });
    canvas.dataset.ready='true';
  }).catch(()=>{
    canvas.hidden=true;
    art.classList.add('static-warehouse');
  });
}
