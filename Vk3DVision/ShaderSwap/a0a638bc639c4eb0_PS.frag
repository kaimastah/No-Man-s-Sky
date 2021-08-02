#version 450
//volumetric lights 2
const float _386[7] = float[](1.25, 1.64999997615814208984375, 1.75, 2.5, 2.75, 2.75, 5.0);
const int _398[7] = int[](16, 12, 10, 8, 6, 6, 4);
const int _405[7] = int[](4, 4, 2, 2, 2, 2, 1);

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
} _941;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler3D gLightVolNoise3D;

layout(location = 0) in VertexBlock
{
    vec4 mScreenSpacePositionVec4;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _2261;
vec2 _2267;
vec3 _2296;
vec2 _2320;

void main()
{
    vec2 _917 = In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w);
    vec2 _1465 = (vec2(_917.x, 1.0 - _917.y) * 2.0) - vec2(1.0);
    vec4 _1467 = vec4(_1465.x, _1465.y, _2261.z, _2261.w);
    vec4 _2207 = _1467;
    _2207.z = texture(gBufferMap, _917).x;
    vec4 _2209 = _2207;
    _2209.w = 1.0;
    vec4 _1473 = _941.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2209;
    vec3 _1489 = (_1473.xyz / vec3(_1473.w)).xyz;
    vec4 _2214 = _1467;
    _2214.z = gl_FragCoord.z;
    
    _2214.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1473.w); 
    
    vec4 _2216 = _2214;
    _2216.w = 1.0;
    vec4 _1512 = _941.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2216;
    vec3 _1528 = (_1512.xyz / vec3(_1512.w)).xyz;
    vec3 _985 = normalize(_1528);
    float _991 = _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w * 1.0499999523162841796875;
    float _997 = _941.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.9900000095367431640625;
    bool _2283;
    vec2 _2284;
    float _1573;
    float _1576;
    for (;;)
    {
        _1573 = dot(_1489, _985);
        _1576 = dot(_1528, _985);
        bool _2262;
        for (;;)
        {
            if (_1576 < _1573)
            {
                _2262 = true;
                break;
            }
            vec3 _1653 = _1489 - _941.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
            if (dot(_1653, _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz) > (_941.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.99989998340606689453125))
            {
                _2262 = false;
                break;
            }
            if (dot(normalize(_1653), _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz) <= (_941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w * 0.997499942779541015625))
            {
                _2262 = false;
                break;
            }
            _2262 = true;
            break;
        }
        if (!_2262)
        {
            _2284 = _2267;
            _2283 = false;
            break;
        }
        float _1715;
        bool _2275;
        vec2 _2276;
        for (;;)
        {
            float _1707 = _991 * _991;
            vec3 _1712 = -_941.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
            _1715 = dot(_985, _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
            float _1721 = (_1715 * _1715) - _1707;
            float _1723 = 1.0 / _1721;
            float _1730 = dot(_1712, _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
            float _1738 = _1723 * ((_1715 * _1730) - (dot(_985, _1712) * _1707));
            float _1758 = (_1738 * _1738) - (_1723 * ((_1730 * _1730) - (dot(_1712, _1712) * _1707)));
            if ((abs(_1721) < 0.0) || (_1758 < 0.0))
            {
                _2276 = _2267;
                _2275 = false;
                break;
            }
            float _1769 = sqrt(_1758);
            float _1771 = -_1738;
            float _1773 = _1771 - _1769;
            float _1777 = _1771 + _1769;
            float _1788 = dot((_985 * _1773) - _941.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz, _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
            float _1799 = dot((_985 * _1777) - _941.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz, _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
            bool _1803 = _1788 < 0.0;
            bool _1811;
            if (!_1803)
            {
                _1811 = _1788 > _997;
            }
            else
            {
                _1811 = _1803;
            }
            float _2269;
            if (_1811)
            {
                _2269 = intBitsToFloat(2139095040);
            }
            else
            {
                _2269 = _1773;
            }
            vec2 _2228 = _2320;
            _2228.x = _2269;
            bool _1822 = _1799 < 0.0;
            bool _1830;
            if (!_1822)
            {
                _1830 = _1799 > _997;
            }
            else
            {
                _1830 = _1822;
            }
            float _2272;
            if (_1830)
            {
                _2272 = intBitsToFloat(2139095040);
            }
            else
            {
                _2272 = _1777;
            }
            vec2 _2233 = _2228;
            _2233.y = _2272;
            vec2 _2274;
            if (_2269 > _2272)
            {
                _2274 = _2233.yx;
            }
            else
            {
                _2274 = _2233;
            }
            _2276 = _2274;
            _2275 = !isinf(_2274.x);
            break;
        }
        if (!_2275)
        {
            _2284 = _2276;
            _2283 = false;
            break;
        }
        vec2 _2282;
        if (isinf(_2276.y))
        {
            float _1887 = dot(_941.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz + (_941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz * _997), _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz) / _1715;
            vec2 _2239 = _2276;
            _2239.y = _1887;
            if (!(!isinf(_1887)))
            {
                _2284 = _2239;
                _2283 = false;
                break;
            }
            vec2 _2281;
            if (_2276.x > _1887)
            {
                _2281 = _2239.yx;
            }
            else
            {
                _2281 = _2239;
            }
            _2282 = _2281;
        }
        else
        {
            _2282 = _2276;
        }
        _2284 = vec2(max(_2282.x, 0.0), min(_2282.y, _1573));
        _2283 = _1573 >= _2282.x;
        break;
    }
    if (!_2283)
    {
        discard;
    }
    uvec2 _1918 = uvec2(_917 * _941.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy) & uvec2(3u);
    uint _1923 = _1918.x;
    uint _1925 = _1918.y;
    mat4 _1914 = mat4(vec4(1.0, 9.0, 3.0, 11.0), vec4(13.0, 5.0, 15.0, 7.0), vec4(4.0, 12.0, 2.0, 10.0), vec4(16.0, 8.0, 14.0, 6.0));
    float _1941 = _2284.x + (_1914[_1923][_1925] * 0.23529411852359771728515625);
    int _1950 = clamp(int(_1941 * 0.125), 0, 6);
    int _1965 = min(_398[_1950], max(_405[_1950], int(max(0.0, _2284.y - _1941) / _386[_1950])));
    float _1973 = (_2284.y - _2284.x) / float(_1965);
    float _2009 = dot(_985, _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz);
    float _2133 = intBitsToFloat(1597463007 - (floatBitsToInt(1.15999996662139892578125 - (0.800000011920928955078125 * _2009)) >> 1));
    float _2289;
    vec3 _2290;
    vec3 _2291;
    _2291 = _2296;
    _2290 = (_985 * (_2284.x + ((_1914[_1923][_1925] * 0.0588235296308994293212890625) * _1973))) - _941.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
    _2289 = 0.0;
    for (int _2288 = 0; _2288 < _1965; )
    {
        float _2029 = dot(_2290, _2290);
        float _2152 = intBitsToFloat(2129859010 - floatBitsToInt((abs(sin(acos(_991))) / _991) * _997));
        vec3 _2253 = _2291;
        _2253.x = dot(_2290, cross(_941.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.xyz, _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz)) * _2152;
        vec3 _2255 = _2253;
        _2255.y = dot(_2290, _941.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.xyz) * _2152;
        vec3 _2260 = _2255;
        _2260.z = mod((dot(_2290, _941.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz) * intBitsToFloat(2129859010 - floatBitsToInt(_997))) - (_941.lUniforms.mpPerFrame.gfTime * 0.015625), 1.0);
        vec3 _2059 = _2260 * 2.0;
        vec4 _2062 = textureLod(gLightVolNoise3D, _2059, 0.0);
        float _2063 = _2062.x;
        _2291 = _2059;
        _2290 += (_985 * _1973);
        _2289 += (min(intBitsToFloat(2129859010 - floatBitsToInt(_2029)), 1.0) * (_2063 * pow(_2063, 4.0)));
        _2288++;
        continue;
    }
    out_color0 = vec4(_941.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * (_2289 * ((((_1973 * _941.lUniforms.mpCommonPerMesh.gLightColourVec4.w) * _941.lUniforms.mpCommonPerMesh.gLightCustomParamsVec4.x) * ((((0.06684507429599761962890625 * _2133) * _2133) * _2133) + (fma(_2009, _2009, 1.0) * 0.09375))) * 4.0)), 1.0);
}



