
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
    float gfFadeValue;
    float gfShaderVariantData;
    vec4 gLightPositionVec4;
    vec4 gLightDirectionVec4;
    vec4 gLightOriginVec4;
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
} _327;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 0) out VertexBlock
{
    vec4 mScreenSpacePositionVec4;
    vec4 mTexCoordsVec4;
} Out;

layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;

vec4 _833;
mat3 _834;

void main()
{
    vec3 _346 = -_327.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz;
    float _621 = mkTexCoordsVec4.x - 0.5;
    float _624 = 0.5 - mkTexCoordsVec4.y;
    vec4 _643 = _327.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(mkLocalPositionVec4.xy - vec2(_621, _624), mkLocalPositionVec4.z, 1.0);
    mat4 _785 = _327.lUniforms.mpCommonPerMesh.gWorldMat4;
    _785[3] = _643;
    vec3 _684 = normalize(_327.lUniforms.mpCommonPerMesh.gWorldMat4[1].xyz);
    vec3 _688 = normalize(cross(_684, _346.xyz));
    vec3 _706 = normalize(mix(normalize(_327.lUniforms.mpPerFrame.gViewMat4[3].xyz - _643.xyz), normalize(cross(_688, _684)), vec3((_327.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x * _327.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x) * _327.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x)));
    mat3 _792 = _834;
    _792[2] = _706;
    mat3 _795 = _792;
    _795[0] = normalize(mix(cross(_684, _706), _688, vec3(_327.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x)));
    mat3 _797 = _795;
    _797[1] = _684;
    vec3 _723 = _797 * vec4(_621, _624, 0.0, 1.0).xyz;
    vec4 _799 = vec4(_723.x, _723.y, _723.z, _833.w);
    _799.w = 1.0;
    mat4 _769 = inverse(_785);
    mat4 _802 = _769;
    _802[0] = normalize(_769[0]);
    mat4 _805 = _802;
    _805[1] = normalize(_769[1]);
    mat4 _808 = _805;
    _808[2] = normalize(_769[2]);
    mat4 _810 = _808;
    _810[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 _586 = _785 * vec4((_810 * _799).xyz, 1.0);
    vec3 _386 = _586.xyz + (_346 * (-2.0));
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec2 _411 = (_327.lUniforms.mpCommonPerMesh.gWorldMat4[3].xz - _327.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xz) + (mkLocalPositionVec4.xz - vec2(_621, 0.0));
    float _421 = (_411.x * 0.125) + (_411.y * 10.0);
    vec4 _820 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    _820.x = (mkTexCoordsVec4.x / _327.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z) + (floor(mod(_421, _327.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z)) / _327.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z);
    vec4 _826 = _820;
    _826.y = (mkTexCoordsVec4.y / _327.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w) + (floor(mod(_421, _327.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w)) / _327.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w);
    Out.mTexCoordsVec4 = _826;
    vec4 _773 = _327.lUniforms.mpPerFrame.gViewProjectionMat4 * vec4(_386.x, _386.y, _386.z, _586.w);
    vec4 _832 = _773;
    _832.z = 0.5 - (max(_773.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _832;
    gl_Position = _832;
}

