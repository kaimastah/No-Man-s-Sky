
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
    vec4 gWaveOneAmplitudeAndPosOffsetV4;
    vec4 gWaveOneFrequencyVec4;
    vec4 gWaveOneFallOffAndSpeedVec4;
    vec4 gWaveTwoAmplitudeVec4;
    vec4 gWaveTwoFrequencyVec4;
    vec4 gWaveTwoFallOffAndSpeedVec4;
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
layout(location = 13) in vec4 mkTransformMat4R4;

mat4 _798;

void main()
{
    vec4 _756 = mkLocalPositionVec4;
    _756.w = 1.0;
    mat4 _758 = _798;
    _758[0] = mkTransformMat4R0;
    mat4 _760 = _758;
    _760[1] = mkTransformMat4R1;
    mat4 _762 = _760;
    _762[2] = mkTransformMat4R2;
    mat4 _764 = _762;
    _764[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _767 = _764;
    _767[0].w = 0.0;
    mat4 _769 = _767;
    _769[1].w = 0.0;
    mat4 _771 = _769;
    _771[2].w = 0.0;
    mat4 _773 = _771;
    _773[3].w = 1.0;
    vec3 _332 = _773[3].xyz - _327.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _345 = ((_327.lUniforms.mpPerFrame.gfTime + _332.x) + _332.y) + _332.z;
    float _813;
    if (dot(_327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz, _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _799;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x > 0.0)
        {
            _799 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x;
        }
        else
        {
            _799 = 0.0;
        }
        float _800;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y > 0.0)
        {
            _800 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y;
        }
        else
        {
            _800 = 0.0;
        }
        float _801;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z > 0.0)
        {
            _801 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z;
        }
        else
        {
            _801 = 0.0;
        }
        _813 = dot(vec3(_799, _800, _801), _756.xyz);
    }
    else
    {
        _813 = 1.0;
    }
    float _817;
    if (dot(_327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz, _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _806;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x > 0.0)
        {
            _806 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x;
        }
        else
        {
            _806 = 0.0;
        }
        float _807;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y > 0.0)
        {
            _807 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y;
        }
        else
        {
            _807 = 0.0;
        }
        float _808;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z > 0.0)
        {
            _808 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z;
        }
        else
        {
            _808 = 0.0;
        }
        _817 = dot(vec3(_806, _807, _808), _756.xyz);
    }
    else
    {
        _817 = 1.0;
    }
    vec3 _656 = _756.xyz + (((vec3(sin(dot(_327.lUniforms.mpCustomPerMaterial.gWaveOneFrequencyVec4.xyz, _756.xyz) + (_345 * _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.w))) * _327.lUniforms.mpCustomPerMaterial.gWaveOneAmplitudeAndPosOffsetV4.xyz) * _813) + ((vec3(sin(dot(_327.lUniforms.mpCustomPerMaterial.gWaveTwoFrequencyVec4.xyz, _756.xyz) + (_345 * _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.w))) * _327.lUniforms.mpCustomPerMaterial.gWaveTwoAmplitudeVec4.xyz) * _817));
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _694 = _327.lUniforms.mpPerFrame.gViewProjectionMat4 * (_773 * (_327.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(_656.x, _656.y, _656.z, _756.w)));
    vec4 _797 = _694;
    _797.z = 0.5 - (max(_694.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _797;
    gl_Position = _797;
}

