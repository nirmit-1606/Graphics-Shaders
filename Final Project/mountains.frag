#version 330 compatibility

in vec3 vMC;
in vec3 vNf;
in vec3 vLf;
in vec3 vEf;

uniform float uDetails;
uniform float uSnow;

uniform sampler3D Noise3;

float Tol = 0.15;

float NoiseAmp = 0.7;
float NoiseFreq = 2.5;

float Ka = 0.4;
float Kd = 0.6;
float Ks = 0.1;
float Shininess = 1.;

const vec4 GREEN = vec4(.1, .6, .1, 1.);
const vec4 BROWN = vec4(.5, .35, .15, 1.);
const vec4 WHITE = vec4(.9, .9, .9, 1.);
const vec4 SAND_COLOR = vec4(0.8, 0.7, 0.25, 1.);

vec4 SpecularColor = WHITE;

float 
random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    //return fract(sin(dot(st.xy, vec2(3., 10.))) * 100.);
}

vec3
RotateNormal( float angx, float angy, vec3 n )
{
    float cx = cos( angx );
    float sx = sin( angx );
    float cy = cos( angy );
    float sy = sin( angy );

    // rotate about x:
    float yp =  n.y*cx - n.z*sx;    // y'
    n.z      =  n.y*sx + n.z*cx;    // z'
    n.y      =  yp;

    // rotate about y:
    float xp =  n.x*cy + n.z*sy;    // x'
    n.z      = -n.x*sy + n.z*cy;    // z'
    n.x      =  xp;

    return normalize( n );
}

void
main()
{
    vec3 Normal, Light, Eye;

	vec4 nvx = texture( Noise3, NoiseFreq * vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= NoiseAmp;
    	
    vec4 nvz = texture( Noise3, NoiseFreq*vec3(vMC.xz,vMC.y+0.5) );
	float angz = nvz.r + nvz.g + nvz.b + nvz.a  -  2.;
	angz *= NoiseAmp;

	Normal = RotateNormal(angx, angz, vNf);
	Light = normalize(vLf);
	Eye = normalize(vEf);

    vec4 rgb;

    float f = random(vec2(vMC.x, vMC.y));
    float details = smoothstep(f - Tol, f + Tol, uDetails);
    rgb = mix(BROWN, GREEN, details);

    float f0 = random(vec2(vMC.x, vMC.z)) + 0.5;
    float snow = smoothstep(f0 - Tol, f0 + Tol, vMC.y * uSnow);
    rgb = mix(rgb, WHITE, snow);

    float f1 = 0.12;
    float sand = smoothstep(f1 - Tol, f1 + Tol, vMC.y);
    rgb = mix(SAND_COLOR, rgb, sand);


    vec4 ambient = Ka * rgb;

    float d = max(dot(Normal, Light), 0.);
    vec4 diffuse = Kd * d * rgb;

    if(rgb.r > 0.7 && rgb.g > 0.7 && rgb.b > 0.7){
        Ks = 0.3;
        Shininess = 10;
    }

    float s = 0.;
    if(dot(Normal, Light) > 0.)     // only do specular if the light can see the point
    {
        vec3 ref = normalize(2. * Normal * dot(Normal, Light) - Light);
        s = pow(max(dot(Eye, ref), 0.), Shininess);
    }
    vec4 specular = Ks * s * SpecularColor;

    gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1);
}