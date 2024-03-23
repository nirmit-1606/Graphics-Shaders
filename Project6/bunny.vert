#version 330 compatibility

uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float Timer;

out vec3 vColor;
out float vX, vY;
out vec3  vMCposition;
out float vLightIntensity;

vec3 LIGHTPOS   = vec3( 0., 0., 5. );

const float PI = 3.141592653589;

void
main()
{
	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vColor = gl_Color.rgb;
	vMCposition = gl_Vertex.xyz;
	vX = vMCposition.x;
	vY = vMCposition.y;

	// converting 0-1 range to -pi to pi
	float v_Timer = (2 * PI) * (Timer - .5);

	if (Timer > .5){
		vX = vX + uNoiseAmp * sin(v_Timer) * tan( cos(uNoiseFreq * vY) );
	}
	else{
		vX = vX + uNoiseAmp * sin(v_Timer) * sin(uNoiseFreq * vY) * vY;
	}
	
	//vX = tan(vX + uNoiseAmp * cos(uNoiseFreq * vY) );

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}