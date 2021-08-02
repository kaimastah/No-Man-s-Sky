
// Vk3DVision (http://3dsurroundgaming.com/) - Original Shader
#version 450

struct PerFrameUniforms
{
    mat4 gViewMat4;
    mat4 gProjectionMat4;
    mat4 gViewProjectionMat4;
    mat4 gCameraMat4;
    mat4 gCameraNoHeadTrackingMat4;
    mat4 gPrevViewProjectionMat4;
    mat4 gThisToPrevViewProjectionMat4;
    mat4 gInverseViewMat4;
    mat4 gInverseProjectionMat4;
    mat4 gInverseProjectionSCMat4;
    mat4 gInverseViewProjectionMat4;
    vec4 gInverseWorldUpMatVec4[3];
    vec3 gViewPositionVec3;
    float gfTime;
    vec3 gVREyeInfoVec3;
    float gfPrevTime;
    vec4 gClipPlanesVec4;
    vec4 gMBlurSettingsVec4;
    vec3 gDeJitterVec3;
    int giFrameIndex;
    vec4 gTaaSettingsVec4;
    vec4 gTessSettingsVec4;
    vec4 gShellsSettingsVec4;
    vec4 gFrameBufferSizeVec4;
    vec4 gFoVValuesVec4;
    vec4 gShadowSizeVec4;
    vec3 gShadowProjScaleVec3;
    int giDisableAmbientAllowed;
    vec4 gShadowFadeParamVec4;
};

struct CustomPerMaterialUniforms
{
    vec4 gSpaceSkyColour1Vec4;
    vec4 gSpaceSkyColour2Vec4;
    vec4 gSpaceSkyColour3Vec4;
    vec4 gSpaceCloudColourVec4;
    vec4 gSpaceSunColourVec4;
    vec4 gSpaceNebulaColour1Vec4;
    vec4 gSpaceNebulaColour2Vec4;
    vec4 gSpaceNebulaColour3Vec4;
    vec4 gSpaceNebulaColour4Vec4;
    vec4 gSpaceNormalParamsVec4;
    vec4 gSpaceNebulaParamsVec4;
    vec4 gSunPositionVec4;
    vec4 gScatteringParamsVec4;
};

struct CommonPerMeshUniforms
{
    vec4 gPlanetPositionVec4;
    mat4 gWorldMat4;
    mat4 gWorldNormalMat4;
    float fdFadeValueDummy;
    float gfShaderVariantData;
    vec4 gLightPositionVec4;
    vec4 gLightDirectionVec4;
    vec4 gLightOriginVec4;
    vec4 gScanParamsPosVec4;
    vec4 gScanParamsCfg1Vec4;
    vec4 gScanParamsCfg2Vec4;
    vec4 gScanParamsCfg3Vec4;
    vec4 gScanColourVec4;
    mat4 gaShadowMat4[3];
    vec4 gLightColourVec4;
    vec4 gLightCustomParamsVec4;
    mat4 gWorldMotionMat4;
    mat4 gInverseModelMat4Dummy;
    vec4 gUserDataVec4;
};

struct CustomPerMeshUniforms
{
    vec4 gDummyVec4;
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CustomPerMaterialUniforms mpCustomPerMaterial;
    CommonPerMeshUniforms mpCommonPerMesh;
    CustomPerMeshUniforms mpCustomPerMesh;
};

layout(set = 0, binding = 0, std140) uniform lUniforms_BLK
{
    UniformBuffer lUniforms;
} _111;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 0) out VertexBlock
{
    vec4 mWorldPositionVec4;
    vec4 mLocalPositionVec4;
} Out;

layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 7) in vec4 mkLocalNormalVec4;

void main()
{
    vec4 _227 = _111.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(mkLocalPositionVec4.xyz, 1.0);
    Out.mLocalPositionVec4 = mkLocalPositionVec4;
    Out.mWorldPositionVec4 = _227;
    vec4 _233 = _111.lUniforms.mpPerFrame.gViewMat4 * _227;
    vec4 _283 = _233;
    _283.z = -_233.z;
    float _240 = length(_283.xyz);
    vec3 _245 = _283.xyz / vec3(_240);
    float _250 = _245.z + 1.0;
    vec4 _290 = vec4(_245.x, _245.y, _245.z, _283.w);
    _290.x = _245.x / _250;
    vec4 _294 = _290;
    _294.y = _245.y / _250;
    vec4 _302 = _294;
    _302.z = 1.0 - ((_240 - _111.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_111.lUniforms.mpPerFrame.gClipPlanesVec4.y - _111.lUniforms.mpPerFrame.gClipPlanesVec4.x));
    vec4 _304 = _302;
    _304.w = 1.0;
    gl_Position = _304;
}

