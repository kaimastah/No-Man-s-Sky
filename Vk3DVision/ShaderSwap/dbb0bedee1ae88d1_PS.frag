#version 450

const float _416[7] = float[](1.25, 1.64999997615814208984375, 1.75, 2.5, 2.75, 2.75, 5.0);
const int _428[7] = int[](16, 12, 10, 8, 6, 6, 4);
const int _435[7] = int[](4, 4, 2, 2, 2, 2, 1);

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
    vec4 gMaterialParamsVec4;
    vec4 gMaterialSFXVec4;
    vec4 gMaterialSFXColVec4;
    vec4 gaPlanetPositionsVec4[6];
    vec4 gaPlanetColoursVec4[6];
    vec4 gSkyColourVec4;
    vec4 gHorizonColourVec4;
    vec4 gSunColourVec4;
    vec4 gScatteringParamsVec4;
    vec4 gSunPositionVec4;
    vec4 gSkyUpperParamsVec4;
    vec4 gSkyUpperColourVec4;
    vec4 gSkySolarColourVec4;
    vec4 gSkyGradientSpeedVec4;
    vec4 gFogParamsVec4;
    vec4 gFogColourVec4;
    vec4 gHeightFogParamsVec4;
    vec4 gHeightFogColourVec4;
    vec4 gWaterFogVec4;
    vec4 gWaterFogColourFarVec4;
    vec4 gWaterFogColourNearVec4;
    vec4 gSpaceHorizonColourVec4;
    vec4 gFogFadeHeightsVec4;
    vec4 gFogFadeHeights2Vec4;
    vec4 gFogFadeHeights3Vec4;
    vec4 gSpaceSkyColourVec4;
    vec4 gSpaceScatteringParamsVec4;
    vec4 gSpaceSkyColour1Vec4;
    vec4 gSpaceSkyColour2Vec4;
    vec4 gSpaceSkyColour3Vec4;
    vec4 gSpaceFogColourVec4;
    vec4 gSpaceFogColour2Vec4;
    vec4 gSpaceFogParamsVec4;
    vec4 gLightShaftParamsVec4;
    vec4 gLightTopColourVec4;
    vec4 gRainParametersVec4;
    vec4 gHueOverlayParamsVec4;
    vec4 gSaturationOverlayParamsVec4;
    vec4 gValueOverlayParamsVec4;
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
    vec4 gSpotlightPositionVec4;
    vec4 gSpotlightDirectionVec4;
    vec4 gSpotlightUpVec4;
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
} _971;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler3D gLightVolNoise3D;

layout(location = 0) in VertexBlock
{
    vec4 mScreenSpacePositionVec4;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _2312;
vec2 _2318;
vec3 _2347;
vec2 _2371;

void main()
{
    vec2 _947 = In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w);
    vec2 _1495 = (vec2(_947.x, 1.0 - _947.y) * 2.0) - vec2(1.0);
    vec4 _1497 = vec4(_1495.x, _1495.y, _2312.z, _2312.w);
    vec4 _2258 = _1497;
    _2258.z = texture(gBufferMap, _947).x;
    vec4 _2260 = _2258;
    _2260.w = 1.0;
    vec4 _1503 = _971.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2260;
    vec3 _1519 = (_1503.xyz / vec3(_1503.w)).xyz;
    vec4 _2265 = _1497;
    _2265.z = gl_FragCoord.z;
    
    _2265.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1503.w); 
    
    vec4 _2267 = _2265;
    _2267.w = 1.0;
    vec4 _1542 = _971.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2267;
    vec3 _1558 = (_1542.xyz / vec3(_1542.w)).xyz;
    vec3 _1015 = normalize(_1558);
    float _1021 = _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w * 1.0499999523162841796875;
    float _1027 = _971.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.9900000095367431640625;
    bool _2334;
    vec2 _2335;
    float _1603;
    float _1606;
    for (;;)
    {
        _1603 = dot(_1519, _1015);
        _1606 = dot(_1558, _1015);
        bool _2313;
        for (;;)
        {
            if (_1606 < _1603)
            {
                _2313 = true;
                break;
            }
            vec3 _1683 = _1519 - _971.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
            if (dot(_1683, _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz) > (_971.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.99989998340606689453125))
            {
                _2313 = false;
                break;
            }
            if (dot(normalize(_1683), _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz) <= (_971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w * 0.997499942779541015625))
            {
                _2313 = false;
                break;
            }
            _2313 = true;
            break;
        }
        if (!_2313)
        {
            _2335 = _2318;
            _2334 = false;
            break;
        }
        float _1745;
        bool _2326;
        vec2 _2327;
        for (;;)
        {
            float _1737 = _1021 * _1021;
            vec3 _1742 = -_971.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
            _1745 = dot(_1015, _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
            float _1751 = (_1745 * _1745) - _1737;
            float _1753 = 1.0 / _1751;
            float _1760 = dot(_1742, _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
            float _1768 = _1753 * ((_1745 * _1760) - (dot(_1015, _1742) * _1737));
            float _1788 = (_1768 * _1768) - (_1753 * ((_1760 * _1760) - (dot(_1742, _1742) * _1737)));
            if ((abs(_1751) < 0.0) || (_1788 < 0.0))
            {
                _2327 = _2318;
                _2326 = false;
                break;
            }
            float _1799 = sqrt(_1788);
            float _1801 = -_1768;
            float _1803 = _1801 - _1799;
            float _1807 = _1801 + _1799;
            float _1818 = dot((_1015 * _1803) - _971.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz, _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
            float _1829 = dot((_1015 * _1807) - _971.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz, _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
            bool _1833 = _1818 < 0.0;
            bool _1841;
            if (!_1833)
            {
                _1841 = _1818 > _1027;
            }
            else
            {
                _1841 = _1833;
            }
            float _2320;
            if (_1841)
            {
                _2320 = intBitsToFloat(2139095040);
            }
            else
            {
                _2320 = _1803;
            }
            vec2 _2279 = _2371;
            _2279.x = _2320;
            bool _1852 = _1829 < 0.0;
            bool _1860;
            if (!_1852)
            {
                _1860 = _1829 > _1027;
            }
            else
            {
                _1860 = _1852;
            }
            float _2323;
            if (_1860)
            {
                _2323 = intBitsToFloat(2139095040);
            }
            else
            {
                _2323 = _1807;
            }
            vec2 _2284 = _2279;
            _2284.y = _2323;
            vec2 _2325;
            if (_2320 > _2323)
            {
                _2325 = _2284.yx;
            }
            else
            {
                _2325 = _2284;
            }
            _2327 = _2325;
            _2326 = !isinf(_2325.x);
            break;
        }
        if (!_2326)
        {
            _2335 = _2327;
            _2334 = false;
            break;
        }
        vec2 _2333;
        if (isinf(_2327.y))
        {
            float _1917 = dot(_971.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz + (_971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz * _1027), _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz) / _1745;
            vec2 _2290 = _2327;
            _2290.y = _1917;
            if (!(!isinf(_1917)))
            {
                _2335 = _2290;
                _2334 = false;
                break;
            }
            vec2 _2332;
            if (_2327.x > _1917)
            {
                _2332 = _2290.yx;
            }
            else
            {
                _2332 = _2290;
            }
            _2333 = _2332;
        }
        else
        {
            _2333 = _2327;
        }
        _2335 = vec2(max(_2333.x, 0.0), min(_2333.y, _1603));
        _2334 = _1603 >= _2333.x;
        break;
    }
    if (!_2334)
    {
        discard;
    }
    uvec2 _1948 = uvec2(_947 * _971.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy) & uvec2(3u);
    uint _1953 = _1948.x;
    uint _1955 = _1948.y;
    mat4 _1944 = mat4(vec4(1.0, 9.0, 3.0, 11.0), vec4(13.0, 5.0, 15.0, 7.0), vec4(4.0, 12.0, 2.0, 10.0), vec4(16.0, 8.0, 14.0, 6.0));
    float _1971 = _2335.x + (_1944[_1953][_1955] * 0.23529411852359771728515625);
    int _1980 = clamp(int(_1971 * 0.125), 0, 6);
    int _1995 = min(_428[_1980], max(_435[_1980], int(max(0.0, _2335.y - _1971) / _416[_1980])));
    float _2003 = (_2335.y - _2335.x) / float(_1995);
    float _2039 = dot(_1015, _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
    float _2163 = intBitsToFloat(1597463007 - (floatBitsToInt(1.15999996662139892578125 - (0.800000011920928955078125 * _2039)) >> 1));
    float _2340;
    vec3 _2341;
    vec3 _2342;
    _2342 = _2347;
    _2341 = (_1015 * (_2335.x + ((_1944[_1953][_1955] * 0.0588235296308994293212890625) * _2003))) - _971.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
    _2340 = 0.0;
    for (int _2339 = 0; _2339 < _1995; )
    {
        float _2059 = dot(_2341, _2341);
        float _2182 = intBitsToFloat(2129859010 - floatBitsToInt((abs(sin(acos(_1021))) / _1021) * _1027));
        vec3 _2304 = _2342;
        _2304.x = dot(_2341, cross(_971.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.xyz, _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz)) * _2182;
        vec3 _2306 = _2304;
        _2306.y = dot(_2341, _971.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.xyz) * _2182;
        vec3 _2311 = _2306;
        _2311.z = mod((dot(_2341, _971.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz) * intBitsToFloat(2129859010 - floatBitsToInt(_1027))) - (_971.lUniforms.mpPerFrame.gfTime * 0.015625), 1.0);
        vec3 _2089 = _2311 * 2.0;
        vec4 _2092 = textureLod(gLightVolNoise3D, _2089, 0.0);
        float _2093 = _2092.x;
        float _2238 = intBitsToFloat(1597463007 - (floatBitsToInt(_2059) >> 1));
        _2342 = _2089;
        _2341 += (_1015 * _2003);
        _2340 += (min(_2238 * intBitsToFloat(532487669 + (floatBitsToInt(_2238) >> 1)), 1.0) * (_2093 * pow(_2093, 4.0)));
        _2339++;
        continue;
    }
    out_color0 = vec4(_971.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * (_2340 * ((((_2003 * _971.lUniforms.mpCommonPerMesh.gLightColourVec4.w) * _971.lUniforms.mpCommonPerMesh.gLightCustomParamsVec4.x) * ((((0.06684507429599761962890625 * _2163) * _2163) * _2163) + (fma(_2039, _2039, 1.0) * 0.09375))) * 4.0)), 1.0);
}


