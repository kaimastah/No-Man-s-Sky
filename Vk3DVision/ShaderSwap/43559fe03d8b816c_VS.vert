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
    vec4 gLightColourVec4;
    vec4 gLightCustomParamsVec4;
    mat4 gWorldMotionMat4;
    mat4 gInverseModelMat4Dummy;
    vec4 gUserDataVec4;
    vec4 gaParticleCornersVec4[4];
    vec4 gaParticlePositionsVec4[32];
    vec4 gaParticleSizeAndRotationsVec4[32];
    vec4 gaParticleNormalsVec4[32];
    vec4 gaParticleColoursVec4[32];
};

struct CustomPerMeshUniforms
{
    vec4 gColour;
};

struct CustomPerMaterialUniforms
{
    int dummy;
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
} _134;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 1) in vec4 mkLocalNormalVec4;
layout(location = 7) in vec4 mkCustom1Vec4;
layout(location = 8) in vec4 mkCustom2Vec4;
layout(location = 0) out VertexBlock
{
    vec2 mfTexCoord;
    float mfFade;
    vec4 mColourVec4;
} Out;

layout(location = 9) in vec4 mkColourVec4;

void main()
{
    vec4 _305 = _134.lUniforms.mpPerFrame.gViewProjectionMat4 * mkLocalPositionVec4;
    vec4 _309 = _134.lUniforms.mpPerFrame.gViewProjectionMat4 * mkLocalNormalVec4;
    vec4 _313 = _134.lUniforms.mpPerFrame.gViewProjectionMat4 * mkCustom1Vec4;
    vec2 _167 = vec2(0.0, mkCustom2Vec4.y);
    vec2 _318 = _305.xy;
    vec2 _321 = _318 / _305.ww;
    vec2 _329 = normalize(_321 - (_309.xy / _309.ww)) * 1.0;
    float _332 = sign(_305.w);
    vec2 _430;
    if (_332 != sign(_309.w))
    {
        _430 = -_329;
    }
    else
    {
        _430 = _329;
    }
    vec2 _361 = (_318 + ((_430 * _167.xx) * vec2(1.0, 1.77777779102325439453125))).xy + (((_430.yx * vec2(1.0, -1.0)) * _167.yy) * vec2(1.0, 1.77777779102325439453125));
    vec2 _180 = vec2(0.0, -mkCustom2Vec4.y);
    vec2 _380 = normalize(_321 - (_313.xy / _313.ww)) * 1.0;
    vec2 _431;
    if (_332 != sign(_313.w))
    {
        _431 = -_380;
    }
    else
    {
        _431 = _380;
    }
    vec2 _412 = (_318 + ((_431 * _180.xx) * vec2(1.0, 1.77777779102325439453125))).xy + (((_431.yx * vec2(1.0, -1.0)) * _180.yy) * vec2(1.0, 1.77777779102325439453125));
    vec4 _194 = (vec4(_361.x, _361.y, _305.z, _305.w) + vec4(_412.x, _412.y, _305.z, _305.w)) * 0.5;
    vec2 _226 = _318 + ((normalize(((_361.xy + _412.xy) * 0.5) - _318) * vec2(1.0, 1.77777779102325439453125)) * ((abs(mkCustom2Vec4.y) / _134.lUniforms.mpPerFrame.gFrameBufferSizeVec4.y) * _194.w));
    Out.mfTexCoord = mkCustom2Vec4.zw;
    Out.mfFade = _134.lUniforms.mpCommonPerMesh.gaParticleSizeAndRotationsVec4[0].y;
    Out.mColourVec4 = mkColourVec4;
    gl_Position = vec4(_226.x, _226.y, _194.z, _194.w);
    
    gl_Position.x += vk3d_params.stereo.x * (gl_Position.w - vk3d_params.stereo.y);
    
}


