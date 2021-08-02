
// Vk3DVision (http://3dsurroundgaming.com/) - Original Shader
#version 450

struct PerFrameUniforms
{
    mat4 gViewMat4;
    mat4 gViewProjectionMat4;
    mat4 gCameraMat4;
    vec3 gViewPositionVec3;
    float gfTime;
    vec4 gFrameBufferSizeVec4;
};

struct CommonPerMeshUniforms
{
    vec4 gPlanetPositionVec4;
    mat4 gWorldMat4;
    float fdFadeValueDummy;
    float gfShaderVariantData;
    vec4 gUserDataVec4;
};

struct CustomPerMaterialUniforms
{
    vec4 gImposterDataVec4;
    vec4 gTileBlendScalesVec4;
    vec4 gHueOverlayParamsVec4;
    vec4 gSaturationOverlayParamsVec4;
    vec4 gValueOverlayParamsVec4;
    vec4 gTerrainColour1Vec4;
    vec4 gTerrainColour2Vec4;
};

struct CustomPerMeshUniforms
{
    vec4 gUVScrollStepVec4;
    vec4 gCustomParams01Vec4;
    vec4 gBboxDepthAndClips;
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CommonPerMeshUniforms mpCommonPerMesh;
    CustomPerMaterialUniforms mpCustomPerMaterial;
    CustomPerMeshUniforms mpCustomPerMesh;
};

layout(set = 0, binding = 0, std140) uniform lUniforms_BLK
{
    UniformBuffer lUniforms;
} _95;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 9) in vec4 mkTransformMat4R0;
layout(location = 10) in vec4 mkTransformMat4R1;
layout(location = 11) in vec4 mkTransformMat4R2;
layout(location = 12) in vec4 mkTransformMat4R3;
layout(location = 14) in vec4 mkTransformMat4R5;
layout(location = 0) out VertexBlock
{
    vec4 mScreenSpacePositionVec4;
    vec4 mTexCoordsVec4;
    vec3 mPixelZandW_mfFadeValueForInstance;
} Out;

layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;
layout(location = 13) in vec4 mkTransformMat4R4;

mat4 _223;

void main()
{
    vec4 _199 = mkLocalPositionVec4;
    _199.w = 1.0;
    mat4 _201 = _223;
    _201[0] = mkTransformMat4R0;
    mat4 _203 = _201;
    _203[1] = mkTransformMat4R1;
    mat4 _205 = _203;
    _205[2] = mkTransformMat4R2;
    mat4 _207 = _205;
    _207[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _210 = _207;
    _210[0].w = 0.0;
    mat4 _212 = _210;
    _212[1].w = 0.0;
    mat4 _214 = _212;
    _214[2].w = 0.0;
    mat4 _216 = _214;
    _216[3].w = 1.0;
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _197 = _95.lUniforms.mpPerFrame.gViewProjectionMat4 * (_216 * (_95.lUniforms.mpCommonPerMesh.gWorldMat4 * _199));
    vec4 _222 = _197;
    _222.z = 0.5 - (max(_197.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _222;
    gl_Position = _222;
}

