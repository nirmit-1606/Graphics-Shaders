#version 330 compatibility

uniform sampler2D uImageUnit;
uniform float uSc;
uniform float uTc;
uniform float uDs;
uniform float uDt;
uniform bool uCircle;
uniform float uRad;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;
//uniform bool uEdgeDetect;
uniform float uEdge;

in vec2 vST;

const vec3 LUMCOEFFS = vec3( 0.2125,0.7154,0.0721 );

void main() {
	vec3 rgb;
	vec2 stp;
	bool testFlag;

	float s = vST.s;
	float t = vST.t;

	//boundary for rec
	float sMin = uSc - uDs/2;
	float sMax = uSc + uDs/2;
	float tMin = uTc - uDt/2;
	float tMax = uTc + uDt/2;
	
	//boundary for cir
	float dist = sqrt( (s-uSc)*(s-uSc) + (t-uTc)*(t-uTc) );
	
	// get resolution
	ivec2 ires = textureSize(uImageUnit, 0); 
	float ResS = float( ires.s );
	float ResT = float( ires.t );

	//For Extra
	if( (!uCircle) )
		testFlag = ((s >= sMin) && (s <= sMax) && (t >= tMin) && (t <= tMax));
	else
		testFlag = (dist <= uRad);
	
	if(testFlag)
	{
		// Do scale
		stp = vec2(uSc+(s-uSc)/uMagFactor, uTc+(t-uTc)/uMagFactor);
		
		// Do rotate
		stp = vec2((uSc+((stp.s-uSc)*cos(uRotAngle)-(stp.t-uTc)*sin(uRotAngle))), (uTc+((stp.s-uSc)*sin(uRotAngle)+(stp.t-uTc)*cos(uRotAngle))));

		// Do Sharpening
		vec2 stp0 = vec2(1./ResS, 0. );
		vec2 st0p = vec2(0. , 1./ResT);
		vec2 stpp = vec2(1./ResS, 1./ResT);
		vec2 stpm = vec2(1./ResS, -1./ResT);
		
		vec3 i00 = texture2D( uImageUnit, stp ).rgb;
		vec3 im1m1 = texture2D( uImageUnit, stp-stpp ).rgb;
		vec3 ip1p1 = texture2D( uImageUnit, stp+stpp ).rgb;
		vec3 im1p1 = texture2D( uImageUnit, stp-stpm ).rgb;
		vec3 ip1m1 = texture2D( uImageUnit, stp+stpm ).rgb;
		vec3 im10 = texture2D( uImageUnit, stp-stp0 ).rgb;
		vec3 ip10 = texture2D( uImageUnit, stp+stp0 ).rgb;
		vec3 i0m1 = texture2D( uImageUnit, stp-st0p ).rgb;
		vec3 i0p1 = texture2D( uImageUnit, stp+st0p ).rgb;

		vec3 blur = vec3(0.,0.,0.);
		blur += 1.*(im1m1+ip1m1+ip1p1+im1p1);
		blur += 2.*(im10+ip10+i0m1+i0p1);
		blur += 4.*(i00);
		blur /= 16.;

		// Put color
		rgb = texture2D( uImageUnit, stp ).rgb;
		rgb = mix( blur, rgb, uSharpFactor );

		// Edge Detection
		float _i00 = dot( i00 , LUMCOEFFS );
		float _im1m1 = dot( im1m1, LUMCOEFFS );
		float _ip1p1 = dot( ip1p1, LUMCOEFFS );
		float _im1p1 = dot( im1p1, LUMCOEFFS );
		float _ip1m1 = dot( ip1m1, LUMCOEFFS );
		float _im10 = dot( im10, LUMCOEFFS );
		float _ip10 = dot( ip10, LUMCOEFFS );
		float _i0m1 = dot( i0m1, LUMCOEFFS );
		float _i0p1 = dot( i0p1, LUMCOEFFS );

		float h = -1.*_im1p1 - 2.*_i0p1 - 1.*_ip1p1 + 1.*_im1m1 + 2.*_i0m1 + 1.*_ip1m1;
		float v = -1.*_im1m1 - 2.*_im10 - 1.*_im1p1 + 1.*_ip1m1 + 2.*_ip10 + 1.*_ip1p1;
		float mag = sqrt( h*h + v*v );

		vec3 target = vec3( mag,mag,mag );
		rgb = mix( rgb, target, uEdge );		
	}
	else
	{
		rgb = texture2D( uImageUnit, vST ).rgb;
	}
	gl_FragColor = vec4( rgb, 1. );
}