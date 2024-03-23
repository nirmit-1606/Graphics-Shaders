#version 330 compatibility

out vec3 vMC;
out vec3 vNf;
out vec3 vLf;
out vec3 vEf;

vec3 eyeLightPosition = vec3( 20., 20., 20. );

vec3 
createMountain(vec4 mountain, vec3 p, inout vec3 tangent, inout vec3 binormal)
{
    float Xc = mountain.x;
    float Zc = mountain.y;
    float height = mountain.z;
    float k = mountain.w;

    float expEq = height * exp(-k * (pow(p.x-Xc, 2) + pow(p.z-Zc, 2)));

    tangent += vec3( 0., -2 * k * (p.x - Xc) * expEq, 0. );
    binormal += vec3( 0., -2 * k * (p.z - Zc) * expEq, 0. );

    return vec3(p.x, expEq, p.z);
}

void 
main()
{
    float x = gl_Vertex.x;
    float z = gl_Vertex.z;
    float y;
    //float sphereEq = pow(uRadius, 2) - pow(x-Xc, 2) - pow(z-Zc, 2);

    vec3 gridPoint = gl_Vertex.xyz;

    vec4 mountain1 = vec4(-1.4, -1.4, 1.5, 4.);
    vec4 mountain2 = vec4(-0.4, -1., 1.2, 7.);
    vec4 mountain3 = vec4(0.6, -1.5, 1.7, 3.3);
    vec4 mountain4 = vec4(1.6, -1.2, 1.3, 6.);
    vec4 mountain5 = vec4(-1., 0., 1., 3.7);
    vec4 mountain6 = vec4(0.4, -0.1, 1.2, 7.);
    vec4 mountain7 = vec4(1.5, 0.1, 0.7, 3.);

    vec3 tangent = vec3(1., 0., 0.);
    vec3 binormal = vec3(0., 0., 1.);
    vec3 _p = gridPoint;

    _p.y += createMountain(mountain1, gridPoint, tangent, binormal).y;
    _p.y += createMountain(mountain2, gridPoint, tangent, binormal).y;
    _p.y += createMountain(mountain3, gridPoint, tangent, binormal).y;
    _p.y += createMountain(mountain4, gridPoint, tangent, binormal).y;
    _p.y += createMountain(mountain5, gridPoint, tangent, binormal).y;
    _p.y += createMountain(mountain6, gridPoint, tangent, binormal).y;
    _p.y += createMountain(mountain7, gridPoint, tangent, binormal).y;

    vec4 p = vec4(_p, 1.);
    vMC = p.xyz;
    
    // bending edge on front
    if(z > 1.5){
        p.y = -pow(z-1.5, 2./3.) + pow(z-1.5, 5./4.);
    }
    if(z > 1.2 && z < 1.7){
        p.y = -pow(z-1., 1./3.) - pow(z-1, 4.) + pow(z-1, 3) + 0.6;
    }

    vec3 normal = normalize(cross(binormal, tangent));

	vec4 ECposition = gl_ModelViewMatrix * p;

    vNf = normalize(gl_NormalMatrix * normal);
	vLf = eyeLightPosition - ECposition.xyz;
	vEf = vec3(0., 0., 0.) - ECposition.xyz;

    gl_Position = gl_ModelViewProjectionMatrix * p;
}