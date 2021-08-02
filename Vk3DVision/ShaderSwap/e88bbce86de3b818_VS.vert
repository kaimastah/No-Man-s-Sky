
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
layout(location = 8) in vec4 mkColourVec4;
layout(location = 13) in vec4 mkTransformMat4R4;

mat4 _799;

void main()
{
    vec4 _757 = mkLocalPositionVec4;
    _757.w = 1.0;
    mat4 _759 = _799;
    _759[0] = mkTransformMat4R0;
    mat4 _761 = _759;
    _761[1] = mkTransformMat4R1;
    mat4 _763 = _761;
    _763[2] = mkTransformMat4R2;
    mat4 _765 = _763;
    _765[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _768 = _765;
    _768[0].w = 0.0;
    mat4 _770 = _768;
    _770[1].w = 0.0;
    mat4 _772 = _770;
    _772[2].w = 0.0;
    mat4 _774 = _772;
    _774[3].w = 1.0;
    vec3 _332 = _774[3].xyz - _327.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _345 = ((_327.lUniforms.mpPerFrame.gfTime + _332.x) + _332.y) + _332.z;
    float _814;
    if (dot(_327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz, _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _800;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x > 0.0)
        {
            _800 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x;
        }
        else
        {
            _800 = 0.0;
        }
        float _801;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y > 0.0)
        {
            _801 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y;
        }
        else
        {
            _801 = 0.0;
        }
        float _802;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z > 0.0)
        {
            _802 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z;
        }
        else
        {
            _802 = 0.0;
        }
        _814 = dot(vec3(_800, _801, _802), _757.xyz);
    }
    else
    {
        _814 = 1.0;
    }
    float _818;
    if (dot(_327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz, _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _807;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x > 0.0)
        {
            _807 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x;
        }
        else
        {
            _807 = 0.0;
        }
        float _808;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y > 0.0)
        {
            _808 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y;
        }
        else
        {
            _808 = 0.0;
        }
        float _809;
        if (_327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z > 0.0)
        {
            _809 = 1.0 / _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z;
        }
        else
        {
            _809 = 0.0;
        }
        _818 = dot(vec3(_807, _808, _809), _757.xyz);
    }
    else
    {
        _818 = 1.0;
    }
    vec3 _657 = _757.xyz + (((vec3(sin(dot(_327.lUniforms.mpCustomPerMaterial.gWaveOneFrequencyVec4.xyz, _757.xyz) + (_345 * _327.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.w))) * _327.lUniforms.mpCustomPerMaterial.gWaveOneAmplitudeAndPosOffsetV4.xyz) * _814) + ((vec3(sin(dot(_327.lUniforms.mpCustomPerMaterial.gWaveTwoFrequencyVec4.xyz, _757.xyz) + (_345 * _327.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.w))) * _327.lUniforms.mpCustomPerMaterial.gWaveTwoAmplitudeVec4.xyz) * _818));
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _695 = _327.lUniforms.mpPerFrame.gViewProjectionMat4 * (_774 * (_327.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(_657.x, _657.y, _657.z, _757.w)));
    vec4 _798 = _695;
    _798.z = 0.5 - (max(_695.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _798;
    gl_Position = _798;
}

