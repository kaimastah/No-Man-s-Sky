#version 450
// HUD
struct CommonPerMeshUniforms
{
    vec2 viewSize;
    vec4 frag[12];
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
} _44;

layout(location = 0) out VertexBlock
{
    vec2 mTexCoordsVec2;
    vec2 mPosVec2;
} Out;

layout(location = 1) in vec2 mkTexCoordsVec4;
layout(location = 0) in vec2 mkLocalPositionVec4;

void main()
{
    Out.mTexCoordsVec2 = mkTexCoordsVec4;
    Out.mPosVec2 = mkLocalPositionVec4;
    gl_Position = vec4((2.0 * (mkLocalPositionVec4.x / _44.lUniforms.mpCommonPerMesh.viewSize.x)) - 1.0, 1.0 - (2.0 * (mkLocalPositionVec4.y / _44.lUniforms.mpCommonPerMesh.viewSize.y)), 0.0, 1.0);

gl_Position.x += vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * vk3d_params.custom_params.w);

}


