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

struct CustomPerMaterialUniforms
{
    vec4 gMinPixelSize_Glow;
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CommonPerMeshUniforms mpCommonPerMesh;
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
} _124;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 1) in vec4 mkLocalNormalVec4;
layout(location = 7) in vec4 mkCustom1Vec4;
layout(location = 8) in vec4 mkCustom2Vec4;
layout(location = 0) out VertexBlock
{
    vec2 mfTexCoord;
    float mfFade;
} Out;


void main()
{
    vec4 _130 = _124.lUniforms.mpPerFrame.gViewProjectionMat4 * mkLocalPositionVec4;
    vec4 _136 = _124.lUniforms.mpPerFrame.gViewProjectionMat4 * mkLocalNormalVec4;
    vec4 _142 = _124.lUniforms.mpPerFrame.gViewProjectionMat4 * mkCustom1Vec4;
    float _155 = mkCustom2Vec4.y * _124.lUniforms.mpCommonPerMesh.gaParticleSizeAndRotationsVec4[0].x;
    vec2 _160 = vec2(0.0, _155);
    vec2 _333 = _130.xy;
    vec2 _336 = _333 / _130.ww;
    vec2 _344 = normalize(_336 - (_136.xy / _136.ww)) * 1.0;
    float _346 = _130.w;
    float _347 = sign(_346);
    vec2 _452;
    if (_347 != sign(_136.w))
    {
        _452 = -_344;
    }
    else
    {
        _452 = _344;
    }
    vec2 _376 = (_333 + ((_452 * _160.xx) * vec2(1.0, 1.77777779102325439453125))).xy + (((_452.yx * vec2(1.0, -1.0)) * _160.yy) * vec2(1.0, 1.77777779102325439453125));
    vec2 _173 = vec2(0.0, -_155);
    vec2 _395 = normalize(_336 - (_142.xy / _142.ww)) * 1.0;
    vec2 _453;
    if (_347 != sign(_142.w))
    {
        _453 = -_395;
    }
    else
    {
        _453 = _395;
    }
    vec2 _427 = (_333 + ((_453 * _173.xx) * vec2(1.0, 1.77777779102325439453125))).xy + (((_453.yx * vec2(1.0, -1.0)) * _173.yy) * vec2(1.0, 1.77777779102325439453125));
    vec4 _187 = (vec4(_376.x, _376.y, _130.z, _130.w) + vec4(_427.x, _427.y, _130.z, _130.w)) * 0.5;
    vec2 _198 = ((_376.xy + _427.xy) * 0.5) - _333;
    float _201 = length(_198);
    vec2 _457;
    if (_201 > 0.0)
    {
        _457 = _198 * (1.0 / _201);
    }
    else
    {
        _457 = _198;
    }
    float _219 = (_124.lUniforms.mpCustomPerMaterial.gMinPixelSize_Glow.x / _124.lUniforms.mpPerFrame.gFrameBufferSizeVec4.y) * _187.w;
    float _223 = abs(_155);
    float _455;
    if (_223 < _219)
    {
        _455 = _219 * 0.5;
    }
    else
    {
        _455 = _223 * 0.5;
    }
    vec2 _244 = _333 + ((_457 * vec2(1.0, 1.77777779102325439453125)) * _455);
    Out.mfTexCoord = mkCustom2Vec4.zw;
    Out.mfFade = _124.lUniforms.mpCommonPerMesh.gaParticleSizeAndRotationsVec4[0].y * clamp((_130.z * _346) * 5.0, 0.0, 1.0);
    gl_Position = vec4(_244.x, _244.y, _187.z, _187.w);
    
    gl_Position.x += vk3d_params.stereo.x * (gl_Position.w - vk3d_params.stereo.y);
    
}


