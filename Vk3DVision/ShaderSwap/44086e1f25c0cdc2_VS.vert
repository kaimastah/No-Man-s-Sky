
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
layout(location = 8) in vec4 mkColourVec4;

mat4 _2226;

void main()
{
    vec4 _2157 = mkLocalPositionVec4;
    _2157.w = 1.0;
    int _1804 = int(mkJointsVec4.x) * 3;
    mat4 _2160 = _2226;
    _2160[0] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1804];
    mat4 _2162 = _2160;
    _2162[1] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1804 + 1];
    mat4 _2164 = _2162;
    _2164[2] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1804 + 2];
    mat4 _2166 = _2164;
    _2166[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 _1742 = (_2157 * _2166) * mkWeightsVec4.x;
    vec4 _2228;
    if (mkWeightsVec4.y > 0.001000000047497451305389404296875)
    {
        int _1825 = int(mkJointsVec4.y) * 3;
        mat4 _2171 = _2226;
        _2171[0] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1825];
        mat4 _2173 = _2171;
        _2173[1] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1825 + 1];
        mat4 _2175 = _2173;
        _2175[2] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1825 + 2];
        mat4 _2177 = _2175;
        _2177[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _2228 = _1742 + ((_2157 * _2177) * mkWeightsVec4.y);
    }
    else
    {
        _2228 = _1742;
    }
    vec4 _2231;
    if (mkWeightsVec4.z > 0.001000000047497451305389404296875)
    {
        int _1846 = int(mkJointsVec4.z) * 3;
        mat4 _2182 = _2226;
        _2182[0] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1846];
        mat4 _2184 = _2182;
        _2184[1] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1846 + 1];
        mat4 _2186 = _2184;
        _2186[2] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1846 + 2];
        mat4 _2188 = _2186;
        _2188[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _2231 = _2228 + ((_2157 * _2188) * mkWeightsVec4.z);
    }
    else
    {
        _2231 = _2228;
    }
    vec4 _2232;
    if (mkWeightsVec4.w > 0.001000000047497451305389404296875)
    {
        int _1867 = int(mkJointsVec4.w) * 3;
        mat4 _2193 = _2226;
        _2193[0] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1867];
        mat4 _2195 = _2193;
        _2195[1] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1867 + 1];
        mat4 _2197 = _2195;
        _2197[2] = _94.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1867 + 2];
        mat4 _2199 = _2197;
        _2199[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _2232 = _2231 + ((_2157 * _2199) * mkWeightsVec4.w);
    }
    else
    {
        _2232 = _2231;
    }
    vec4 _1799 = _2232 / vec4(max(_2232.w, 9.9999999747524270787835121154785e-07));
    vec3 _1576 = _94.lUniforms.mpCommonPerMesh.gWorldMat4[3].xyz - _94.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _1588 = ((_94.lUniforms.mpPerFrame.gfTime + _1576.x) + _1576.y) + _1576.z;
    vec3 _1923 = _1799.xyz;
    float _2247;
    if (dot(_94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz, _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _2233;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x > 0.0)
        {
            _2233 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.x;
        }
        else
        {
            _2233 = 0.0;
        }
        float _2234;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y > 0.0)
        {
            _2234 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.y;
        }
        else
        {
            _2234 = 0.0;
        }
        float _2235;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z > 0.0)
        {
            _2235 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.z;
        }
        else
        {
            _2235 = 0.0;
        }
        _2247 = dot(vec3(_2233, _2234, _2235), _1923);
    }
    else
    {
        _2247 = 1.0;
    }
    float _2251;
    if (dot(_94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz, _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.xyz) > 0.0)
    {
        float _2240;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x > 0.0)
        {
            _2240 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.x;
        }
        else
        {
            _2240 = 0.0;
        }
        float _2241;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y > 0.0)
        {
            _2241 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.y;
        }
        else
        {
            _2241 = 0.0;
        }
        float _2242;
        if (_94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z > 0.0)
        {
            _2242 = 1.0 / _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.z;
        }
        else
        {
            _2242 = 0.0;
        }
        _2251 = dot(vec3(_2240, _2241, _2242), _1923);
    }
    else
    {
        _2251 = 1.0;
    }
    vec3 _2057 = _1923 + (((vec3(sin(dot(_94.lUniforms.mpCustomPerMaterial.gWaveOneFrequencyVec4.xyz, _1923) + (_1588 * _94.lUniforms.mpCustomPerMaterial.gWaveOneFallOffAndSpeedVec4.w))) * _94.lUniforms.mpCustomPerMaterial.gWaveOneAmplitudeAndPosOffsetV4.xyz) * _2247) + ((vec3(sin(dot(_94.lUniforms.mpCustomPerMaterial.gWaveTwoFrequencyVec4.xyz, _1923) + (_1588 * _94.lUniforms.mpCustomPerMaterial.gWaveTwoFallOffAndSpeedVec4.w))) * _94.lUniforms.mpCustomPerMaterial.gWaveTwoAmplitudeVec4.xyz) * _2251));
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _2095 = _94.lUniforms.mpPerFrame.gViewProjectionMat4 * (_94.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(_2057.x, _2057.y, _2057.z, _1799.w));
    vec4 _2225 = _2095;
    _2225.z = 0.5 - (max(_2095.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _2225;
    gl_Position = _2225;
}

