#version 450
// POI icons
struct CommonPerMeshUniforms
{
    vec4 gImmediateRenderParams;
    mat4 gWorldViewProjectionMat4;
};

struct UniformBuffer
{
    CommonPerMeshUniforms mpCommonPerMesh;
};


// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
layout(set = 0, binding = 45, std140) uniform Vk3DParams
{
    vec4 stereo;
    vec4 custom_params;
} vk3d_params;

layout(set = 0, binding = 0, std140) uniform lUniforms_BLK
{
    UniformBuffer lUniforms;
} _29;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 0) out VertexBlock
{
    vec2 UV;
    vec4 Color;
} Out;

layout(location = 2) in vec4 mkColourVec4;
layout(location = 1) in vec2 mkTexCoordsVec4;

void main()
{
    vec4 _64 = mkLocalPositionVec4;
    _64.w = 1.0;
    gl_Position = _29.lUniforms.mpCommonPerMesh.gWorldViewProjectionMat4 * _64;
    Out.Color = mkColourVec4;
    Out.UV = mkTexCoordsVec4;

if (gl_Position.y > 0.7)

gl_Position.x += vk3d_params.stereo.x;

else

gl_Position.x += vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * vk3d_params.custom_params.w);

}



