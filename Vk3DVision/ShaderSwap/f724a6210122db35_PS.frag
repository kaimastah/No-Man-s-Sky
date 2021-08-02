#version 450
// lens distortion 1
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

struct CustomPerMeshUniforms
{
    vec4 gDoFParamsVec4;
    vec4 gHDRParamsVec4;
    vec4 gHBAOParamsVec4;
    vec4 gThresholdParamsVec4;
    vec4 gCustomParamsVec4;
    vec4 gBlurParamsVec4;
    vec4 gColourLUTParamsVec4;
    vec4 gColourLUTStrengthsVec4;
    vec4 gTextureSizeMipLevelVec4;
    vec4 gSkyUpperParamsVec4;
    vec4 gLightShaftColourBottomVec4;
    vec4 gLightShaftColourTopVec4;
    vec4 gHDRParams2Vec4;
    vec4 gLensDirtDistortionVec4;
    vec4 gLensHaloDistortionVec4;
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

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CustomPerMeshUniforms mpCustomPerMesh;
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
} _79;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;
layout(location = 1) out vec4 out_color1;

void main()
{

vec2 lens = In.mTexCoordsVec2;
lens.x += vk3d_params.stereo.x * 0.5;

    vec3 _87a = textureLod(gBufferMap, lens, 0.0).xyz * _79.lUniforms.mpCustomPerMesh.gThresholdParamsVec4.x;
    float _203a = dot(_87a, vec3(0.1500000059604644775390625, 0.25, 0.60000002384185791015625));
    float _209a = max((_203a - 3.0) * 0.25, 0.0);
    vec3 _101a = textureLod(gBuffer1Map, lens, 0.0).xyz;

    vec3 _87 = textureLod(gBufferMap, In.mTexCoordsVec2, 0.0).xyz * _79.lUniforms.mpCustomPerMesh.gThresholdParamsVec4.x;
    float _203 = dot(_87, vec3(0.1500000059604644775390625, 0.25, 0.60000002384185791015625));
    float _209 = max((_203 - 3.0) * 0.25, 0.0);
    vec3 _101 = textureLod(gBuffer1Map, In.mTexCoordsVec2, 0.0).xyz;
    out_color0 = vec4(max((_87a * _209a) / vec3(1.0 + _209a), _101a), 1.0);
    float _116 = length(_101) * 1.2000000476837158203125;
    float _227 = max((_203 - max(5.0 - _116, 0.0)) * (0.75 + _116), 0.0);
    out_color1 = vec4((_87 * _227) / vec3(1.0 + _227), 1.0);
}


