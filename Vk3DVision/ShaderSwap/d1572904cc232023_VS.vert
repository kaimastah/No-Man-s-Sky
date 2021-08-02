
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
    float gfFadeValue;
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
} _287;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 0) out VertexBlock
{
    vec4 mScreenSpacePositionVec4;
    vec4 mTexCoordsVec4;
} Out;

layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;

void main()
{
    vec4 _731 = mkLocalPositionVec4;
    _731.w = 1.0;
    vec3 _308 = _287.lUniforms.mpCommonPerMesh.gWorldMat4[3].xyz - _287.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _321 = ((_287.lUniforms.mpPerFrame.gfTime + _308.x) + _308.y) + _308.z;
    float _770;
    if (dot(_287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz, _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _756;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x > 0.0)
        {
            _756 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x;
        }
        else
        {
            _756 = 0.0;
        }
        float _757;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y > 0.0)
        {
            _757 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y;
        }
        else
        {
            _757 = 0.0;
        }
        float _758;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z > 0.0)
        {
            _758 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z;
        }
        else
        {
            _758 = 0.0;
        }
        _770 = dot(vec3(_756, _757, _758), _731.xyz);
    }
    else
    {
        _770 = 1.0;
    }
    float _774;
    if (dot(_287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz, _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _763;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x > 0.0)
        {
            _763 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x;
        }
        else
        {
            _763 = 0.0;
        }
        float _764;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y > 0.0)
        {
            _764 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y;
        }
        else
        {
            _764 = 0.0;
        }
        float _765;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z > 0.0)
        {
            _765 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z;
        }
        else
        {
            _765 = 0.0;
        }
        _774 = dot(vec3(_763, _764, _765), _731.xyz);
    }
    else
    {
        _774 = 1.0;
    }
    vec3 _631 = _731.xyz + (((vec3(sin(dot(_287.lUniforms.mpCustomPerMaterial.gWaveOneFrequencyVec4.xyz, _731.xyz) + (_321 * _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.w))) * _287.lUniforms.mpCustomPerMaterial.gWaveOneAmplitudeAndPosOffsetV4.xyz) * _770) + ((vec3(sin(dot(_287.lUniforms.mpCustomPerMaterial.gWaveTwoFrequencyVec4.xyz, _731.xyz) + (_321 * _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.w))) * _287.lUniforms.mpCustomPerMaterial.gWaveTwoAmplitudeVec4.xyz) * _774));
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _669 = _287.lUniforms.mpPerFrame.gViewProjectionMat4 * (_287.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(_631.x, _631.y, _631.z, _731.w));
    vec4 _755 = _669;
    _755.z = 0.5 - (max(_669.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _755;
    gl_Position = _755;
}

