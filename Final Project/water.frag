#version 400 compatibility

in vec3 vMC;
in vec3 vNf;
in vec3 vLf;
in vec3 vEf;

float Ka = 0.4;
float Kd = 0.6;
float Ks = 0.5;
float Shininess = 40.;

vec4 WaterColor = vec4(.4, .5, .8, .8);
vec4 SpecularColor = vec4(1., 1., 1., 1.);

void
main()
{
    vec3 Normal, Light, Eye;

    Normal = vNf;
	Light = normalize(vLf);
	Eye = normalize(vEf);

    vec4 rgb = WaterColor;
    
    vec4 ambient = Ka * rgb;

    float d = max(dot(Normal, Light), 0.);
    vec4 diffuse = Kd * d * rgb;

    float s = 0.;
    if(dot(Normal, Light) > 0.)     // only do specular if the light can see the point
    {
        vec3 ref = normalize(2. * Normal * dot(Normal, Light) - Light);
        s = pow(max(dot(Eye, ref), 0.), Shininess);
    }
    vec4 specular = Ks * s * SpecularColor;

    gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, rgb.w);
}