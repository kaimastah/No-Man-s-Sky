
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
layout(location = 8) in vec4 mkColourVec4;

void main()
{
    vec4 _732 = mkLocalPositionVec4;
    _732.w = 1.0;
    vec3 _308 = _287.lUniforms.mpCommonPerMesh.gWorldMat4[3].xyz - _287.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _321 = ((_287.lUniforms.mpPerFrame.gfTime + _308.x) + _308.y) + _308.z;
    float _771;
    if (dot(_287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz, _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _757;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x > 0.0)
        {
            _757 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x;
        }
        else
        {
            _757 = 0.0;
        }
        float _758;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y > 0.0)
        {
            _758 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y;
        }
        else
        {
            _758 = 0.0;
        }
        float _759;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z > 0.0)
        {
            _759 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z;
        }
        else
        {
            _759 = 0.0;
        }
        _771 = dot(vec3(_757, _758, _759), _732.xyz);
    }
    else
    {
        _771 = 1.0;
    }
    float _775;
    if (dot(_287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz, _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _764;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x > 0.0)
        {
            _764 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x;
        }
        else
        {
            _764 = 0.0;
        }
        float _765;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y > 0.0)
        {
            _765 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y;
        }
        else
        {
            _765 = 0.0;
        }
        float _766;
        if (_287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z > 0.0)
        {
            _766 = 1.0 / _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z;
        }
        else
        {
            _766 = 0.0;
        }
        _775 = dot(vec3(_764, _765, _766), _732.xyz);
    }
    else
    {
        _775 = 1.0;
    }
    vec3 _632 = _732.xyz + (((vec3(sin(dot(_287.lUniforms.mpCustomPerMaterial.gWaveOneFrequencyVec4.xyz, _732.xyz) + (_321 * _287.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.w))) * _287.lUniforms.mpCustomPerMaterial.gWaveOneAmplitudeAndPosOffsetV4.xyz) * _771) + ((vec3(sin(dot(_287.lUniforms.mpCustomPerMaterial.gWaveTwoFrequencyVec4.xyz, _732.xyz) + (_321 * _287.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.w))) * _287.lUniforms.mpCustomPerMaterial.gWaveTwoAmplitudeVec4.xyz) * _775));
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _670 = _287.lUniforms.mpPerFrame.gViewProjectionMat4 * (_287.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(_632.x, _632.y, _632.z, _732.w));
    vec4 _756 = _670;
    _756.z = 0.5 - (max(_670.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _756;
    gl_Position = _756;
}

