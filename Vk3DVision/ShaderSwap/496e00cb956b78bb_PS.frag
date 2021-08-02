#version 450
// AO3
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
} _361;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _979;

void main()
{
    vec2 _982;
    for (;;)
    {
        vec4 _838 = texture(gBufferMap, In.mTexCoordsVec2);
        vec4 _842 = texture(gBuffer1Map, In.mTexCoordsVec2);
        if (_838.x < 1.0)
        {
            _982 = _838.xy;
            break;
        }
        vec2 _886 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
        vec4 _962 = vec4(_886.x, _886.y, _979.z, _979.w);
        _962.z = (((_361.lUniforms.mpPerFrame.gClipPlanesVec4.x * _361.lUniforms.mpPerFrame.gClipPlanesVec4.y) / (_842.x * _361.lUniforms.mpPerFrame.gClipPlanesVec4.y)) - _361.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_361.lUniforms.mpPerFrame.gClipPlanesVec4.y - _361.lUniforms.mpPerFrame.gClipPlanesVec4.x);
        
        _962.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _962.z * 10) * 2;
        
        vec4 _964 = _962;
        _964.w = 1.0;
        vec4 _896 = _361.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _964;
        vec3 _908 = (_896.xyz / vec3(_896.w)).xyz + _361.lUniforms.mpPerFrame.gViewPositionVec3;
        vec4 _967 = vec4(_908.x, _908.y, _908.z, _979.w);
        _967.w = 1.0;
        vec4 _787 = _361.lUniforms.mpPerFrame.gPrevViewProjectionMat4 * _967;
        vec4 _970 = _787;
        _970.y = -_787.y;
        vec2 _808 = (((_970.xyz / vec3(_787.w)).xy * 0.5) + vec2(0.5)) - In.mTexCoordsVec2;
        
        _808.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y / _787.w);
        
        vec2 _981;
        if (_361.lUniforms.mpPerFrame.gFoVValuesVec4.z == 2.0)
        {
            _981 = _808 * 2.0;
        }
        else
        {
            _981 = _808;
        }
        vec2 _975 = _981;
        _975.y = -_981.y;
        vec2 _942 = _975 * 0.25;
        _982 = vec2(_942.x, -_942.y) + vec2(0.5);
        break;
    }
    out_color0 = vec4(_982, 0.5, 1.0);
}



