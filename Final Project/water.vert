#version 330 compatibility

uniform float Timer;

out vec3 vMC;
out vec3 vNf;
out vec3 vLf;
out vec3 vEf;

const float PI = 3.1415926;

vec3 eyeLightPosition = vec3( 20., 20., 20. );

vec2 directionA = vec2(-5, -3.5);
vec2 directionB = vec2(3, -4);
vec2 directionC = vec2(0, -1);

vec3 
createWave(vec4 wave, vec3 p, inout vec3 tangent, inout vec3 binormal)
{
    float steepness = wave.z;
    float wavelength = wave.w;
    float k = 2 * PI / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(wave.xy);
    float f = k * (dot(d, p.xz) - c * Timer);
    float a = steepness / k;

    //x += d.x * a * cos(f);
    //y = a * sin(f);
    //z += d.y * a * cos(f);

    tangent += vec3( - d.x * d.x * (steepness * sin(f)), d.x * (steepness * cos(f)), -d.x * d.y * (steepness * sin(f)));
    binormal += vec3( -d.x * d.y * (steepness * sin(f)), d.y * (steepness * cos(f)), - d.y * d.y * (steepness * sin(f)));

    return vec3(d.x * (a * cos(f)), a * sin(f), d.y * (a * cos(f)));
}

void 
main()
{
    vec3 gridPoint = gl_Vertex.xyz;

    // wave: ( direction, steepness, wavelength )
    vec4 waveA = vec4(directionA, 0.25, 1.2);
    vec4 waveB = vec4(directionB, 0.2, 1.6);
    vec4 waveC = vec4(directionC, 0.3, 0.5);

    vec3 tangent = vec3(1., 0., 0.);
    vec3 binormal = vec3(0., 0., 1.);
    vec3 _p = gridPoint;

    _p += createWave(waveA, gridPoint, tangent, binormal);
    _p += createWave(waveB, gridPoint, tangent, binormal);
    _p += createWave(waveC, gridPoint, tangent, binormal);

    vec4 p = vec4(_p, 1.);
    vMC = p.xyz;

    vec3 normal = normalize(cross(binormal, tangent));

    vec4 ECposition = gl_ModelViewMatrix * p;

    vNf = normalize(gl_NormalMatrix * normal);
	vLf = eyeLightPosition - ECposition.xyz;
	vEf = vec3(0., 0., 0.) - ECposition.xyz;

    gl_Position = gl_ModelViewProjectionMatrix * p;
}