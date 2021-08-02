#version 450
// station flare
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
layout(set = 0, binding = 45, std140) uniform Vk3DParams
{
    vec4 stereo;
    vec4 custom_params;
} vk3d_params;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;

void main()
{

    vec2 tex = In.mTexCoordsVec2;
    tex.x += vk3d_params.stereo.x * 0.5; 

    out_color0 = textureLod(gBufferMap, tex, 0.0);
}


