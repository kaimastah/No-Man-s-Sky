#version 450
//volumetric lights 1
layout(early_fragment_tests) in;

const float _376[7] = float[](1.25, 1.64999997615814208984375, 1.75, 2.5, 2.75, 2.75, 5.0);
const int _388[7] = int[](16, 12, 10, 8, 6, 6, 4);
const int _395[7] = int[](4, 4, 2, 2, 2, 2, 1);

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
} _874;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler3D gLightVolNoise3D;

layout(location = 0) in VertexBlock
{
    vec4 mScreenSpacePositionVec4;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _2139;
vec2 _2144;
vec3 _2170;
vec2 _2191;

void main()
{
    vec2 _850;
    vec3 _904;
    vec3 _909;
    vec3 _914;
    vec3 _918;
    float _924;
    float _930;
    float _939;
    vec3 _1422;
    for (;;)
    {
        _850 = In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w);
        vec2 _1398 = (vec2(_850.x, 1.0 - _850.y) * 2.0) - vec2(1.0);
        vec4 _1400 = vec4(_1398.x, _1398.y, _2139.z, _2139.w);
        vec4 _2084 = _1400;
        _2084.z = texture(gBufferMap, _850).x;
        vec4 _2086 = _2084;
        _2086.w = 1.0;
        vec4 _1406 = _874.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2086;
        _1422 = (_1406.xyz / vec3(_1406.w)).xyz;
        vec4 _2091 = _1400;
        _2091.z = gl_FragCoord.z;
        
        _2091.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1406.w); 
        
        vec4 _2093 = _2091;
        _2093.w = 1.0;
        vec4 _1445 = _874.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2093;
        _904 = _874.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
        _909 = _874.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz;
        _914 = _874.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.xyz;
        _918 = normalize((_1445.xyz / vec3(_1445.w)).xyz);
        _924 = _874.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w * 1.0499999523162841796875;
        _930 = _874.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.9900000095367431640625;
        _939 = (abs(sin(acos(_924))) / _924) * _930;
        float _1592;
        bool _2159;
        vec2 _2160;
        float _1499;
        for (;;)
        {
            _1499 = dot(_1422, _918);
            bool _2152;
            vec2 _2153;
            for (;;)
            {
                float _1584 = _924 * _924;
                vec3 _1589 = -_904;
                _1592 = dot(_918, _909);
                float _1598 = (_1592 * _1592) - _1584;
                float _1600 = 1.0 / _1598;
                float _1607 = dot(_1589, _909);
                float _1615 = _1600 * ((_1592 * _1607) - (dot(_918, _1589) * _1584));
                float _1635 = (_1615 * _1615) - (_1600 * ((_1607 * _1607) - (dot(_1589, _1589) * _1584)));
                if ((abs(_1598) < 0.0) || (_1635 < 0.0))
                {
                    _2153 = _2144;
                    _2152 = false;
                    break;
                }
                float _1646 = sqrt(_1635);
                float _1648 = -_1615;
                float _1650 = _1648 - _1646;
                float _1654 = _1648 + _1646;
                float _1665 = dot((_918 * _1650) - _904, _909);
                float _1676 = dot((_918 * _1654) - _904, _909);
                bool _1680 = _1665 < 0.0;
                bool _1688;
                if (!_1680)
                {
                    _1688 = _1665 > _930;
                }
                else
                {
                    _1688 = _1680;
                }
                float _2146;
                if (_1688)
                {
                    _2146 = intBitsToFloat(2139095040);
                }
                else
                {
                    _2146 = _1650;
                }
                vec2 _2105 = _2191;
                _2105.x = _2146;
                bool _1699 = _1676 < 0.0;
                bool _1707;
                if (!_1699)
                {
                    _1707 = _1676 > _930;
                }
                else
                {
                    _1707 = _1699;
                }
                float _2149;
                if (_1707)
                {
                    _2149 = intBitsToFloat(2139095040);
                }
                else
                {
                    _2149 = _1654;
                }
                vec2 _2110 = _2105;
                _2110.y = _2149;
                vec2 _2151;
                if (_2146 > _2149)
                {
                    _2151 = _2110.yx;
                }
                else
                {
                    _2151 = _2110;
                }
                _2153 = _2151;
                _2152 = !isinf(_2151.x);
                break;
            }
            if (!_2152)
            {
                _2160 = _2153;
                _2159 = false;
                break;
            }
            vec2 _2158;
            if (isinf(_2153.y))
            {
                float _1764 = dot(_904 + (_909 * _930), _909) / _1592;
                vec2 _2116 = _2153;
                _2116.y = _1764;
                if (!(!isinf(_1764)))
                {
                    _2160 = _2116;
                    _2159 = false;
                    break;
                }
                vec2 _2157;
                if (_2153.x > _1764)
                {
                    _2157 = _2116.yx;
                }
                else
                {
                    _2157 = _2116;
                }
                _2158 = _2157;
            }
            else
            {
                _2158 = _2153;
            }
            _2160 = vec2(max(_2158.x, 0.0), min(_2158.y, _1499));
            _2159 = _1499 >= _2158.x;
            break;
        }
        if (!_2159)
        {
            out_color0 = vec4(0.0, 0.0, 0.0, 1.0);
            break;
        }
        uvec2 _1795 = uvec2(_850 * _874.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy) & uvec2(3u);
        uint _1800 = _1795.x;
        uint _1802 = _1795.y;
        mat4 _1791 = mat4(vec4(1.0, 9.0, 3.0, 11.0), vec4(13.0, 5.0, 15.0, 7.0), vec4(4.0, 12.0, 2.0, 10.0), vec4(16.0, 8.0, 14.0, 6.0));
        float _1818 = _2160.x + (_1791[_1800][_1802] * 0.23529411852359771728515625);
        int _1827 = clamp(int(_1818 * 0.125), 0, 6);
        int _1842 = min(_388[_1827], max(_395[_1827], int(max(0.0, _2160.y - _1818) / _376[_1827])));
        float _1850 = (_2160.y - _2160.x) / float(_1842);
        float _2010 = intBitsToFloat(1597463007 - (floatBitsToInt(1.15999996662139892578125 - (0.800000011920928955078125 * _1592)) >> 1));
        float _2162;
        vec3 _2163;
        vec3 _2164;
        _2164 = _2170;
        _2163 = (_918 * (_2160.x + ((_1791[_1800][_1802] * 0.0588235296308994293212890625) * _1850))) - _904;
        _2162 = 0.0;
        for (int _2161 = 0; _2161 < _1842; )
        {
            float _1906 = dot(_2163, _2163);
            float _2029 = intBitsToFloat(2129859010 - floatBitsToInt(_939));
            vec3 _2130 = _2164;
            _2130.x = dot(_2163, cross(_914, _909)) * _2029;
            vec3 _2132 = _2130;
            _2132.y = dot(_2163, _914) * _2029;
            vec3 _2137 = _2132;
            _2137.z = mod((dot(_2163, _909) * intBitsToFloat(2129859010 - floatBitsToInt(_930))) - (_874.lUniforms.mpPerFrame.gfTime * 0.015625), 1.0);
            vec3 _1936 = _2137 * 2.0;
            vec4 _1939 = textureLod(gLightVolNoise3D, _1936, 0.0);
            float _1940 = _1939.x;
            _2164 = _1936;
            _2163 += (_918 * _1850);
            _2162 += (min(intBitsToFloat(2129859010 - floatBitsToInt(_1906)), 1.0) * (_1940 * pow(_1940, 4.0)));
            _2161++;
            continue;
        }
        out_color0 = vec4(_874.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * (_2162 * ((((_1850 * _874.lUniforms.mpCommonPerMesh.gLightColourVec4.w) * _874.lUniforms.mpCommonPerMesh.gLightCustomParamsVec4.x) * ((((0.06684507429599761962890625 * _2010) * _2010) * _2010) + (fma(_1592, _1592, 1.0) * 0.09375))) * 4.0)), 1.0);
        break;
    }
}





