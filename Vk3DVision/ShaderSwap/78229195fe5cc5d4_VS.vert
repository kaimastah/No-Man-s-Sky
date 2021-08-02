
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
    vec4 gaSkinMatrixRowsVec4[225];
    vec4 gaPrevSkinMatrixRowsVec4[225];
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
} _94;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 6) in vec4 mkWeightsVec4;
layout(location = 5) in vec4 mkJointsVec4;
layout(location = 0) out VertexBlock
{
    vec4 mScreenSpacePositionVec4;
    vec4 mTexCoordsVec4;
} Out;

layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;

mat4 _2225;

void main()
{
    vec4 _2156 = mkLocalPositionVec4;
    _2156.w = 1.0;
    int _1803 = int(mkJointsVec4.x) * 3;
    mat4 _2159 = _2225;
    _2159[0] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1803];
    mat4 _2161 = _2159;
    _2161[1] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1803 + 1];
    mat4 _2163 = _2161;
    _2163[2] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1803 + 2];
    mat4 _2165 = _2163;
    _2165[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 _1741 = (_2156 * _2165) * mkWeightsVec4.x;
    vec4 _2227;
    if (mkWeightsVec4.y > 0.001000000047497451305389404296875)
    {
        int _1824 = int(mkJointsVec4.y) * 3;
        mat4 _2170 = _2225;
        _2170[0] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1824];
        mat4 _2172 = _2170;
        _2172[1] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1824 + 1];
        mat4 _2174 = _2172;
        _2174[2] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1824 + 2];
        mat4 _2176 = _2174;
        _2176[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _2227 = _1741 + ((_2156 * _2176) * mkWeightsVec4.y);
    }
    else
    {
        _2227 = _1741;
    }
    vec4 _2230;
    if (mkWeightsVec4.z > 0.001000000047497451305389404296875)
    {
        int _1845 = int(mkJointsVec4.z) * 3;
        mat4 _2181 = _2225;
        _2181[0] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1845];
        mat4 _2183 = _2181;
        _2183[1] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1845 + 1];
        mat4 _2185 = _2183;
        _2185[2] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1845 + 2];
        mat4 _2187 = _2185;
        _2187[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _2230 = _2227 + ((_2156 * _2187) * mkWeightsVec4.z);
    }
    else
    {
        _2230 = _2227;
    }
    vec4 _2231;
    if (mkWeightsVec4.w > 0.001000000047497451305389404296875)
    {
        int _1866 = int(mkJointsVec4.w) * 3;
        mat4 _2192 = _2225;
        _2192[0] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1866];
        mat4 _2194 = _2192;
        _2194[1] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1866 + 1];
        mat4 _2196 = _2194;
        _2196[2] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1866 + 2];
        mat4 _2198 = _2196;
        _2198[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _2231 = _2230 + ((_2156 * _2198) * mkWeightsVec4.w);
    }
    else
    {
        _2231 = _2230;
    }
    vec4 _1798 = _2231 / vec4(max(_2231.w, 9.9999999747524270787835121154785e-07));
    vec3 _1576 = _94.lUniforms.mpCommonPerMesh.gWorldMat4[3].xyz - _94.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _1588 = ((_94.lUniforms.mpPerFrame.gfTime + _1576.x) + _1576.y) + _1576.z;
    vec3 _1922 = _1798.xyz;
    float _2246;
    if (dot(_94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz, _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _2232;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x > 0.0)
        {
            _2232 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x;
        }
        else
        {
            _2232 = 0.0;
        }
        float _2233;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y > 0.0)
        {
            _2233 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y;
        }
        else
        {
            _2233 = 0.0;
        }
        float _2234;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z > 0.0)
        {
            _2234 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z;
        }
        else
        {
            _2234 = 0.0;
        }
        _2246 = dot(vec3(_2232, _2233, _2234), _1922);
    }
    else
    {
        _2246 = 1.0;
    }
    float _2250;
    if (dot(_94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz, _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _2239;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x > 0.0)
        {
            _2239 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x;
        }
        else
        {
            _2239 = 0.0;
        }
        float _2240;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y > 0.0)
        {
            _2240 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y;
        }
        else
        {
            _2240 = 0.0;
        }
        float _2241;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z > 0.0)
        {
            _2241 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z;
        }
        else
        {
            _2241 = 0.0;
        }
        _2250 = dot(vec3(_2239, _2240, _2241), _1922);
    }
    else
    {
        _2250 = 1.0;
    }
    vec3 _2056 = _1922 + (((vec3(sin(dot(_94.lUniforms.mpCustomPerMaterial.gWaveOneFrequencyVec4.xyz, _1922) + (_1588 * _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.w))) * _94.lUniforms.mpCustomPerMaterial.gWaveOneAmplitudeAndPosOffsetV4.xyz) * _2246) + ((vec3(sin(dot(_94.lUniforms.mpCustomPerMaterial.gWaveTwoFrequencyVec4.xyz, _1922) + (_1588 * _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.w))) * _94.lUniforms.mpCustomPerMaterial.gWaveTwoAmplitudeVec4.xyz) * _2250));
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _2094 = _94.lUniforms.mpPerFrame.gViewProjectionMat4 * (_94.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(_2056.x, _2056.y, _2056.z, _1798.w));
    vec4 _2224 = _2094;
    _2224.z = 0.5 - (max(_2094.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _2224;
    gl_Position = _2224;
}

