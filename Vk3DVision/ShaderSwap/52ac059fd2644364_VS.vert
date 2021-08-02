
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
} _99;

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
layout(location = 8) in vec4 mkColourVec4;
layout(location = 13) in vec4 mkTransformMat4R4;

mat4 _299;

void main()
{
    vec4 _260 = mkLocalPositionVec4;
    _260.w = 1.0;
    mat4 _262 = _299;
    _262[0] = mkTransformMat4R0;
    mat4 _264 = _262;
    _264[1] = mkTransformMat4R1;
    mat4 _266 = _264;
    _266[2] = mkTransformMat4R2;
    mat4 _268 = _266;
    _268[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _271 = _268;
    _271[0].w = 0.0;
    mat4 _273 = _271;
    _273[1].w = 0.0;
    mat4 _275 = _273;
    _275[2].w = 0.0;
    mat4 _277 = _275;
    _277[3].w = 1.0;
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec2 _104 = _277[3].xz - _99.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xz;
    float _116 = (_104.x * 0.125) + (_104.y * 10.0);
    vec4 _286 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    _286.x = (mkTexCoordsVec4.x / _99.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z) + (floor(mod(_116, _99.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z)) / _99.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z);
    vec4 _292 = _286;
    _292.y = (mkTexCoordsVec4.y / _99.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w) + (floor(mod(_116, _99.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w)) / _99.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w);
    Out.mTexCoordsVec4 = _292;
    vec4 _258 = _99.lUniforms.mpPerFrame.gViewProjectionMat4 * (_277 * (_99.lUniforms.mpCommonPerMesh.gWorldMat4 * _260));
    vec4 _298 = _258;
    _298.z = 0.5 - (max(_258.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _298;
    gl_Position = _298;
}

