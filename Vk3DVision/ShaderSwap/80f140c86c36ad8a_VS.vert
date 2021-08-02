#version 450
// stars
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
    vec4 gDoFParamsVec4;
};

struct CustomPerMaterialUniforms
{
    vec4 gSpaceCloudColourVec4;
    vec4 gSpaceNebulaColour3Vec4;
    vec4 gSpaceNebulaParamsVec4;
    vec4 gSpaceSkyColour1Vec4;
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CommonPerMeshUniforms mpCommonPerMesh;
    CustomPerMeshUniforms mpCustomPerMesh;
    CustomPerMaterialUniforms mpCustomPerMaterial;
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
} _86;

layout(location = 1) in vec3 mkCustom1Vec4;
layout(location = 0) in vec2 mkfParticleCornerId;
layout(location = 7) in vec4 mkCustom2Vec4;
layout(location = 8) in vec4 mkCustom3Vec4;
layout(location = 0) out VertexBlock
{
    vec2 mUV;
    vec4 mDepth_Field_Seed2;
    vec4 mColour;
    vec4 mBlends;
    vec4 mWorldPositionVec4;
} Out;


vec4 _363;
float _367;

void main()
{
    vec2 _113 = mkfParticleCornerId - vec2(0.5);
    vec4 _139 = _86.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(mkCustom2Vec4.xyz, 1.0);
    vec3 _159 = (_139.xyz + (_86.lUniforms.mpPerFrame.gCameraMat4[0].xyz * (_113.x * mkCustom1Vec4.x))).xyz + (_86.lUniforms.mpPerFrame.gCameraMat4[1].xyz * (_113.y * mkCustom1Vec4.x));
    float _346 = clamp((length(_159.xyz - _86.lUniforms.mpPerFrame.gCameraMat4[3].xyz) - _86.lUniforms.mpCommonPerMesh.gLightColourVec4.x) * _86.lUniforms.mpCommonPerMesh.gLightColourVec4.y, 0.0, 1.0);
    gl_Position = _86.lUniforms.mpPerFrame.gViewProjectionMat4 * vec4(_159.x, _159.y, _159.z, _139.w);

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
gl_Position.x += vk3d_params.stereo.x * gl_Position.w; 
    float _202 = 1.0 - _346;
    vec4 _354 = _363;
    _354.x = smoothstep(0.87999999523162841796875, 1.0, _202);
    vec4 _356 = _354;
    _356.y = smoothstep(0.959999978542327880859375, 1.0, _202);
    vec4 _358 = _356;
    _358.z = smoothstep(0.100000001490116119384765625, 1.0, _202);
    vec4 _360 = _358;
    _360.w = sin(clamp((_346 - 0.20000000298023223876953125) * 1.60000002384185791015625, 0.0, 1.0) * 1.5707962512969970703125);
    Out.mUV = mkfParticleCornerId;
    Out.mDepth_Field_Seed2 = vec4(_346, 0.0, fract(sin(vec3(dot(mkCustom2Vec4.xz, vec2(127.09999847412109375, 311.70001220703125)), dot(mkCustom2Vec4.xz, vec2(269.5, 183.3000030517578125)), _367)) * 43758.546875).xy);
    Out.mColour = mkCustom3Vec4;
    Out.mBlends = _360;
    Out.mWorldPositionVec4 = vec4(normalize(mkCustom2Vec4.xyz), 1.0);
}


