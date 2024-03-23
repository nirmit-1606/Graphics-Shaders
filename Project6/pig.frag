#version 330 compatibility

#define M_PI 3.14159

//uniform sampler2D uTexUnit;
uniform float Timer;


in vec2 vST;

void main ( ) {

	vec3 rgb = vec3(.8, .3, .3);
	
    float s, t, u, v, w, a, r, pi = M_PI;

    s = vST.s + 0.5;
    t = vST.t + 0.5;

    a = atan( t, s );
    r = sqrt( s * s + t * t );

    u = a / pi + 0.005 * r;
    v = 40 * pow( r, 0.01 );

    v += (Timer);
	
	gl_FragColor = vec4( rgb, 1. );
	
}