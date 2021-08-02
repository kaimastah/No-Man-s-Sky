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
    int dummy;
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
    CustomPerMaterialUniforms mpCustomPerMaterial;
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
} _131;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 1) in vec4 mkLocalNormalVec4;
layout(location = 7) in vec4 mkCustom1Vec4;
layout(location = 0) out VertexBlock
{
    vec2 mTexCoordsVec2;
    vec4 mWorldPositionVec4;
    float mfVertAlpha;
    vec4 mColourVec4;
} Out;


void main()
{
    vec4 laOffsetsUVs[8];
    laOffsetsUVs[0] = vec4(1.0, 1.0, 1.0, 0.0);
    laOffsetsUVs[1] = vec4(1.0, -1.0, 1.0, 1.0);
    laOffsetsUVs[2] = vec4(1.0, -1.0, 0.0, 0.0);
    laOffsetsUVs[3] = vec4(1.0, 1.0, 0.0, 1.0);
    laOffsetsUVs[4] = vec4(0.0, 1.0, 0.5, 0.0);
    laOffsetsUVs[5] = vec4(0.0, -1.0, 0.5, 1.0);
    laOffsetsUVs[6] = vec4(0.0, -1.0, 0.5, 0.0);
    laOffsetsUVs[7] = vec4(0.0, 1.0, 0.5, 1.0);
    vec4 _143 = _131.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(mkLocalPositionVec4.xyz, 1.0);
    vec4 _164 = _131.lUniforms.mpPerFrame.gViewProjectionMat4 * _143;
    vec4 _169 = _131.lUniforms.mpPerFrame.gViewProjectionMat4 * (_131.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(mkLocalNormalVec4.xyz, 1.0));
    int _372;
    if (mkLocalNormalVec4.w > 0.0)
    {
        _372 = int((((1.0 - sign(mkCustom1Vec4.x)) * 2.0) - (sign(mkCustom1Vec4.y) - 1.0)) - ((sign(mkCustom1Vec4.z) - 1.0) * 0.5));
    }
    else
    {
        _372 = 2;
    }
    vec2 _211 = laOffsetsUVs[_372].xy * mkLocalNormalVec4.w;
    vec2 _316 = _164.xy;
    vec2 _327 = normalize((_316 / _164.ww) - (_169.xy / _169.ww)) * 0.20000000298023223876953125;
    vec2 _373;
    if (sign(_164.w) != sign(_169.w))
    {
        _373 = -_327;
    }
    else
    {
        _373 = _327;
    }
    vec2 _359 = (_316 + ((_373 * _211.xx) * vec2(1.0, 1.77777779102325439453125))).xy + (((_373.yx * vec2(1.0, -1.0)) * _211.yy) * vec2(1.0, 1.77777779102325439453125));
    Out.mfVertAlpha = mkLocalPositionVec4.w;
    Out.mTexCoordsVec2 = laOffsetsUVs[_372].zw;
    Out.mWorldPositionVec4 = _143;
    Out.mColourVec4 = abs(mkCustom1Vec4) - vec4(1.0);
    gl_Position = vec4(_359.x, _359.y, _164.z, _164.w);
    
    gl_Position.x += vk3d_params.stereo.x * (gl_Position.w - vk3d_params.stereo.y);
    
}


