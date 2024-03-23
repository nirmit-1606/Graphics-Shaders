#version 330 compatibility

uniform float uA;
uniform float uP;
uniform float uTol;
uniform sampler3D Noise3;
uniform bool uDisc;

in vec3 vColor;
in float vX, vY;
in vec3  vMCposition;
in float vLightIntensity;

const vec3 WHITE = vec3( 1., 1., 1. );

void
main() {
	float r = sqrt( vX*vX + vY*vY );
	float rfrac = fract( uA*r );
	
	//float f = fract( uA*vX );
	float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, rfrac ) - smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, rfrac );
	vec3 rgb = mix( WHITE, vColor, t );

	if(uDisc){
		if ( all( equal( rgb, WHITE ) ) ){
			discard;
		}
	}
	rgb = rgb * vLightIntensity;
	
	gl_FragColor = vec4( rgb, 1. );

}