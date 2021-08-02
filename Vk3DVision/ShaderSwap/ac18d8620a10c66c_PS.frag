#version 450
// lens distortion 2
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
} _201;

layout(set = 1, binding = 1) uniform sampler2D gLensNoise;
layout(set = 1, binding = 2) uniform sampler2D gLensDirtGhost;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;

mat3 _611;
vec3 _625;

void main()
{

vec2 lens = In.mTexCoordsVec2;
lens.x -= vk3d_params.stereo.x * 0.5;

    vec4 _451 = _201.lUniforms.mpCustomPerMesh.gLensHaloDistortionVec4 * vec4(1.0, 0.5, 0.5, 1.0);
    mat3 _582 = _611;
    _582[0] = vec3(_451.xy, 0.0);
    mat3 _586 = _582;
    _586[1] = vec3(_451.zw, 0.0);
    mat3 _588 = _586;
    _588[2] = vec3(0.0, 0.0, 1.0);
    vec2 _225 = clamp(lens, vec2(0.00200000009499490261077880859375), vec2(0.99800002574920654296875));
    vec2 _232 = (vec2(0.5) - _225) * 0.300000011920928955078125;
    vec2 _236 = normalize(_232) * 0.449999988079071044921875;
    vec2 _497 = normalize(_225 - vec2(0.5));
    vec4 _276 = textureLod(gLensNoise, vec2(atan(_497.y, _497.x) * 0.636619746685028076171875, mod(_201.lUniforms.mpPerFrame.gfTime * 0.0024999999441206455230712890625, 1.0)), float(int(round(float(textureSize(gLensNoise, 0).x) / _201.lUniforms.mpPerFrame.gFrameBufferSizeVec4.x))));
    vec2 _288 = ((((_588 * vec3(lens - vec2(0.5), 1.0)).xy * 0.5) * 1.85000002384185791015625) + vec2(0.5)) + _236;
    vec3 _593 = _625;
    _593.x = textureLod(gBufferMap, _288 + (_236 * 0.014999999664723873138427734375), 0.0).x;
    vec3 _596 = _593;
    _596.y = textureLod(gBufferMap, _288 + (_236 * 0.0350000001490116119384765625), 0.0).y;
    vec3 _599 = _596;
    _599.z = textureLod(gBufferMap, _288 + (_236 * 0.054999999701976776123046875), 0.0).z;
    float _301 = _276.x;
    vec3 _613;
    _613 = vec3(0.0);
    for (int _612 = 0; _612 < 5; )
    {
        float _328 = float(_612);
        vec2 _329 = _232 * _328;
        vec2 _333 = _225 + _329;
        vec3 _604 = _625;
        _604.x = textureLod(gBufferMap, _333 + (_329 * 0.014999999664723873138427734375), 0.0).x;
        vec3 _607 = _604;
        _607.y = textureLod(gBufferMap, _333 + (_329 * 0.0350000001490116119384765625), 0.0).y;
        vec3 _610 = _607;
        _610.z = textureLod(gBufferMap, _333 + (_329 * 0.054999999701976776123046875), 0.0).z;
        _613 += ((_610 * 1.0) / vec3((0.5 * _328) + 1.0));
        _612++;
        continue;
    }
    out_color0 = vec4((((_599 * mix(1.0, (_301 * _301) * 1.5, 0.949999988079071044921875)) * clamp(smoothstep(0.25, 0.449999988079071044921875, distance(_225, vec2(0.5))), 0.0, 1.0)) * 0.070000000298023223876953125) + ((_613 * (dot(_232, _232) * 16.0)) * (((texture(gLensDirtGhost, lens).xyz * 0.5) + vec3(0.699999988079071044921875)) * 0.85000002384185791015625)), 1.0);
}


