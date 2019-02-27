import * as THREE from 'three';

let container;
let camera, scene, renderer;
let uniforms,material;
let mouse = new THREE.Vector2();
let SCREEN_WIDTH,SCREEN_HEIGHT,VIEW_ANGLE = 85,mesh;
init();
animate();

function init() {
    container = document.getElementById( 'container' );

    scene = new THREE.Scene();

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
 
  
    let ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    const NEAR = 0.1;
    const FAR = 1000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT,  NEAR, FAR);
    scene.add(camera);
    //camera.position.set(0,0,5);
    //camera.lookAt(scene.position);
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.position.set( 0, 0, 1 );


    var geometry = new THREE.PlaneBufferGeometry(3.5,2);

   


    var originalTexture = new THREE.TextureLoader().load('/img/gold.jpg');
    var mapTexture = new THREE.TextureLoader().load('/img/map_gold.jpg');

    uniforms= {
        u_resolution: { type: "v2", value: new THREE.Vector2() },                          
        u_mouse: { type: "v2", value: mouse },
        u_originalImage: {type: 't', value: originalTexture},
        u_mapImage: {type: 't', value: mapTexture},
        wireframe: false,
        side: THREE.FrontSide
    };


    material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: `
            varying vec2 v_position;
            varying vec3 vecPos;

            void main() {
                v_position = uv;

                vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;

                gl_Position = projectionMatrix * modelViewMatrix  * vec4(position,1.0);
            
            }

        `,
        fragmentShader: `
            varying vec2 v_position;

            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform sampler2D u_originalImage;
            uniform sampler2D u_mapImage;
            

            vec2 depth(vec2 pos){
                    vec2 intensity=vec2(-0.001,0.0015);
                    float d=0.0-pow(texture2D(u_mapImage,pos).r,1.0);
                    return pos+(intensity*u_mouse*d);
            }

            void main(){
                    vec2 pos=v_position.xy;
                    vec4 c=texture2D(u_originalImage ,depth( pos));
                    gl_FragColor=vec4(c.rgb,1.0);

            }

        `
    } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );

    container.appendChild( renderer.domElement );

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}
function onDocumentMouseMove(event) {

    //mouse.x = (event.clientX /window.innerWidth  * 2 - 1) ;
    //mouse.y= (event.clientY / window.innerHeight * 2 - 1) ;

    mouse.x = (SCREEN_WIDTH / 2 - event.clientX) / VIEW_ANGLE;
    mouse.y = (SCREEN_HEIGHT / 2 - event.clientY) / VIEW_ANGLE;


    uniforms.u_originalImage.needsUpdate = true;
    uniforms.u_mapImage.needsUpdate = true;
}
function onWindowResize( event ) {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize( SCREEN_WIDTH, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
   

}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
   

    renderer.render( scene, camera );
}