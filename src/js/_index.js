
let stats,
    camera, scene, renderer,
    mesh;

const init = () => {
    const container = document.querySelector('.canvas__container');
    //
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    camera.position.z = 2000;
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );
    
    //

    //scene.add( new THREE.AmbientLight( 0x444444 ) );

    const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    const light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, - 1, 0 );
    scene.add( light2 );

    //
    let triangles = 12000;
    let trianglesX = Math.floor(Math.sqrt(triangles));
    let geometry = new THREE.BufferGeometry();
    let positions = [];
    let normals = [];
    let colors = [];
    let color = new THREE.Color();
    let n = 2750, n2 = n / 2;	// triangles spread in the cube
    let d = 25, d2 = d / 2;	// individual triangle size
    let pA = new THREE.Vector3();
    let pB = new THREE.Vector3();
    let pC = new THREE.Vector3();
    let cb = new THREE.Vector3();
    let ab = new THREE.Vector3();
    for ( let ix = 0; ix < trianglesX; ix++ ) {
        for ( let iy = 0; iy < trianglesX; iy++ ) {
            // positions
            let x = (ix/trianglesX) * n - n2;
            let y = 0;
            let z = (iy/trianglesX) * n - n2;
            let ax = x + Math.random() * d - d2;
            let ay = y + Math.random() * d - d2;
            let az = z + Math.random() * d - d2;
            let bx = x + Math.random() * d - d2;
            let by = y + Math.random() * d - d2;
            let bz = z + Math.random() * d - d2;
            let cx = x + Math.random() * d - d2;
            let cy = y + Math.random() * d - d2;
            let cz = z + Math.random() * d - d2;
            positions.push( ax, ay, az );
            positions.push( bx, by, bz );
            positions.push( cx, cy, cz );
            // flat face normals
            pA.set( ax, ay, az );
            pB.set( bx, by, bz );
            pC.set( cx, cy, cz );
            cb.subVectors( pC, pB );
            ab.subVectors( pA, pB );
            cb.cross( ab );
            cb.normalize();
            let nx = cb.x;
            let ny = cb.y;
            let nz = cb.z;
            normals.push( nx, ny, nz );
            normals.push( nx, ny, nz );
            normals.push( nx, ny, nz );
            // colors
            let vx = ( x / n ) + 0.5;
            let vy = ( y / n ) + 0.5;
            let vz = ( z / n ) + 0.5;
            color.setRGB( vx, vy, vz );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
        }
    }
    const disposeArray = () => {
        this.array = null;
    }
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
    geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ).onUpload( disposeArray ) );
    geometry.computeBoundingSphere();
    let material = new THREE.MeshPhongMaterial( {
        color: 0x444444, specular: 0xffffff, shininess: 2500,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.x = (Math.PI/180) * 45;
    scene.add( mesh );
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    //
    stats = new Stats();
    container.appendChild( stats.dom );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//
const animate = () => {
    stats.begin();
    requestAnimationFrame( animate );
    render();
    stats.end();
}

let lastTime = Date.now();
const render = () => {
    const timescale = (Date.now() - lastTime)/1000;
    mesh.rotation.y += 0.1*timescale;
    renderer.render( scene, camera );
    lastTime = Date.now();
}


window.addEventListener('load', ()=>{
    init();
    animate();
})