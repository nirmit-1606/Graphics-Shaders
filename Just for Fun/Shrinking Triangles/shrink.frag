#version 330 compatibility

in float gLightIntensity;

const vec3 COLOR = vec3(.5, .8, 0.);

void main( )
{
    gl_FragColor = vec4( gLightIntensity * COLOR, 1. );
}