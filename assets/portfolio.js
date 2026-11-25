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
  import('three').then(({Scene, PerspectiveCamera, WebGLRenderer, Group, SphereGeometry, Mesh, MeshBasicMaterial, LineBasicMaterial, BufferGeometry, Line, Vector3, TorusGeometry, MeshStandardMaterial, AmbientLight, PointLight, BoxGeometry, MathUtils}) => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(37, 1, 0.1, 100);
    camera.position.set(0, 0, 8.3);
    const renderer = new WebGLRenderer({canvas, alpha:true, antialias:!lowPower, powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.8));
    renderer.setClearColor(0x000000, 0);
    const world = new Group(); scene.add(world);
    const globe = new Group(); world.add(globe);
    const wire = new Mesh(new SphereGeometry(2.05, lowPower ? 18 : 30, lowPower ? 12 : 20), new MeshBasicMaterial({color:0xcda563, wireframe:true, transparent:true, opacity:.22}));
    globe.add(wire);
    const core = new Mesh(new SphereGeometry(1.96, lowPower ? 20 : 36, lowPower ? 14 : 24), new MeshStandardMaterial({color:0x182c44, roughness:.8, metalness:.12, transparent:true, opacity:.28, wireframe:false}));
    globe.add(core);
    scene.add(new AmbientLight(0x8ba0b6, 1.7));
    const keyLight = new PointLight(0xd4ad6b, 9, 15); keyLight.position.set(3, 4, 5); scene.add(keyLight);
    const rimLight = new PointLight(0x7092b4, 6, 13); rimLight.position.set(-4, -1, -3); scene.add(rimLight);
    const orbitMaterial = new MeshBasicMaterial({color:0xcda563, transparent:true, opacity:.56});
    const routeMaterial = new LineBasicMaterial({color:0xc0d0df, transparent:true, opacity:.65});
    const points = [];
    const nodeMaterial = new MeshStandardMaterial({color:0xe2bb74, emissive:0x725a32, emissiveIntensity:.65, metalness:.3, roughness:.45});
    const nodeBlue = new MeshStandardMaterial({color:0xbcd0e2, emissive:0x374b61, emissiveIntensity:.5, metalness:.2, roughness:.45});
    const radius = 2.075;
    const count = lowPower ? 12 : 20;
    for (let i=0;i<count;i++) {
      const lat = Math.asin(-1 + 2 * (i + .5) / count);
      const lon = i * Math.PI * (3 - Math.sqrt(5));
      const point = new Vector3(radius*Math.cos(lat)*Math.cos(lon), radius*Math.sin(lat), radius*Math.cos(lat)*Math.sin(lon));
      points.push(point);
      const node = new Mesh(new SphereGeometry(i%4===0?.075:.042, 8, 6), i%3===0?nodeBlue:nodeMaterial);
      node.position.copy(point); globe.add(node);
    }
    const routeIndices = [[0,4,8,12,16],[2,6,10,14,18],[1,7,13,19]];
    for (const route of routeIndices) {
      const vertices=[];
      for (let j=0;j<route.length;j++) {
        const a=points[route[j]%points.length], b=points[route[(j+1)%route.length]%points.length];
        for (let k=0;k<=24;k++) {
          const t=k/24, base=a.clone().lerp(b,t).normalize();
          const lift=Math.sin(Math.PI*t)*.12;
          vertices.push(base.x*(radius+lift),base.y*(radius+lift),base.z*(radius+lift));
        }
      }
      const line=new Line(new BufferGeometry().setFromPoints(Array.from({length:vertices.length/3},(_,i)=>new Vector3(vertices[i*3],vertices[i*3+1],vertices[i*3+2]))),routeMaterial);
      globe.add(line);
    }
    const ring1 = new Mesh(new TorusGeometry(2.42,.006,4,120), orbitMaterial); ring1.rotation.set(.9,.2,-.45); world.add(ring1);
    const ring2 = new Mesh(new TorusGeometry(2.62,.004,4,120), new MeshBasicMaterial({color:0x9db5ca,transparent:true,opacity:.25})); ring2.rotation.set(1.24,.7,.15); world.add(ring2);
    const crateGroup = new Group(); world.add(crateGroup);
    if (!lowPower) for(let i=0;i<5;i++) {
      const crate = new Mesh(new BoxGeometry(.13,.13,.13), new MeshStandardMaterial({color:i%2?0xb08b4c:0x9eb2c4,roughness:.75,metalness:.12}));
      const angle=i*1.256, dist=2.78+(i%2)*.17; crate.position.set(Math.cos(angle)*dist,Math.sin(angle*1.4)*.65,Math.sin(angle)*dist*.7); crate.rotation.set(.4,angle,.2); crateGroup.add(crate);
    }
    let pointerX=0, pointerY=0, raf=0;
    art.addEventListener('pointermove', event => { const r=art.getBoundingClientRect(); pointerX=(event.clientX-r.left)/r.width-.5; pointerY=(event.clientY-r.top)/r.height-.5; }, {passive:true});
    art.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;},{passive:true});
    const resize=()=>{const rect=art.getBoundingClientRect(); if(!rect.width||!rect.height)return; renderer.setSize(rect.width,rect.height,false); camera.aspect=rect.width/rect.height; camera.position.z=lowPower?8.9:8.2; camera.updateProjectionMatrix(); if(reduceMotion) renderer.render(scene,camera);};
    new ResizeObserver(resize).observe(art); resize();
    const render=()=>{raf=requestAnimationFrame(render);globe.rotation.y+=.0017;globe.rotation.x+=.00035;world.rotation.y=MathUtils.lerp(world.rotation.y,pointerX*.13,.035);world.rotation.x=MathUtils.lerp(world.rotation.x,-pointerY*.09,.035);ring1.rotation.z+=.0005;ring2.rotation.y-=.0003;renderer.render(scene,camera);}; if(reduceMotion) renderer.render(scene,camera); else render();
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(!reduceMotion&&!raf)render();});
    canvas.dataset.ready='true';
  }).catch(() => { canvas.hidden = true; art.classList.add('static-globe'); });
}
