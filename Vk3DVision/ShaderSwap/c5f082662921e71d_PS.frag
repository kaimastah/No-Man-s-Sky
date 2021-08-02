#version 450
layout(early_fragment_tests) in;

const float _406[7] = float[](1.25, 1.64999997615814208984375, 1.75, 2.5, 2.75, 2.75, 5.0);
const int _418[7] = int[](16, 12, 10, 8, 6, 6, 4);
const int _425[7] = int[](4, 4, 2, 2, 2, 2, 1);

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
} _904;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler3D gLightVolNoise3D;

layout(location = 0) in VertexBlock
{
    vec4 mScreenSpacePositionVec4;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _2190;
vec2 _2195;
vec3 _2221;
vec2 _2242;

void main()
{
    vec2 _880;
    vec3 _934;
    vec3 _939;
    vec3 _944;
    vec3 _948;
    float _954;
    float _960;
    float _969;
    vec3 _1452;
    for (;;)
    {
        _880 = In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w);
        vec2 _1428 = (vec2(_880.x, 1.0 - _880.y) * 2.0) - vec2(1.0);
        vec4 _1430 = vec4(_1428.x, _1428.y, _2190.z, _2190.w);
        vec4 _2135 = _1430;
        _2135.z = texture(gBufferMap, _880).x;
        vec4 _2137 = _2135;
        _2137.w = 1.0;
        vec4 _1436 = _904.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2137;
        _1452 = (_1436.xyz / vec3(_1436.w)).xyz;
        vec4 _2142 = _1430;
        _2142.z = gl_FragCoord.z;
        
        _2142.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1436.w); 
        
        vec4 _2144 = _2142;
        _2144.w = 1.0;
        vec4 _1475 = _904.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2144;
        _934 = _904.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
        _939 = _904.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz;
        _944 = _904.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.xyz;
        _948 = normalize((_1475.xyz / vec3(_1475.w)).xyz);
        _954 = _904.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w * 1.0499999523162841796875;
        _960 = _904.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.9900000095367431640625;
        _969 = (abs(sin(acos(_954))) / _954) * _960;
        float _1622;
        bool _2210;
        vec2 _2211;
        float _1529;
        for (;;)
        {
            _1529 = dot(_1452, _948);
            bool _2203;
            vec2 _2204;
            for (;;)
            {
                float _1614 = _954 * _954;
                vec3 _1619 = -_934;
                _1622 = dot(_948, _939);
                float _1628 = (_1622 * _1622) - _1614;
                float _1630 = 1.0 / _1628;
                float _1637 = dot(_1619, _939);
                float _1645 = _1630 * ((_1622 * _1637) - (dot(_948, _1619) * _1614));
                float _1665 = (_1645 * _1645) - (_1630 * ((_1637 * _1637) - (dot(_1619, _1619) * _1614)));
                if ((abs(_1628) < 0.0) || (_1665 < 0.0))
                {
                    _2204 = _2195;
                    _2203 = false;
                    break;
                }
                float _1676 = sqrt(_1665);
                float _1678 = -_1645;
                float _1680 = _1678 - _1676;
                float _1684 = _1678 + _1676;
                float _1695 = dot((_948 * _1680) - _934, _939);
                float _1706 = dot((_948 * _1684) - _934, _939);
                bool _1710 = _1695 < 0.0;
                bool _1718;
                if (!_1710)
                {
                    _1718 = _1695 > _960;
                }
                else
                {
                    _1718 = _1710;
                }
                float _2197;
                if (_1718)
                {
                    _2197 = intBitsToFloat(2139095040);
                }
                else
                {
                    _2197 = _1680;
                }
                vec2 _2156 = _2242;
                _2156.x = _2197;
                bool _1729 = _1706 < 0.0;
                bool _1737;
                if (!_1729)
                {
                    _1737 = _1706 > _960;
                }
                else
                {
                    _1737 = _1729;
                }
                float _2200;
                if (_1737)
                {
                    _2200 = intBitsToFloat(2139095040);
                }
                else
                {
                    _2200 = _1684;
                }
                vec2 _2161 = _2156;
                _2161.y = _2200;
                vec2 _2202;
                if (_2197 > _2200)
                {
                    _2202 = _2161.yx;
                }
                else
                {
                    _2202 = _2161;
                }
                _2204 = _2202;
                _2203 = !isinf(_2202.x);
                break;
            }
            if (!_2203)
            {
                _2211 = _2204;
                _2210 = false;
                break;
            }
            vec2 _2209;
            if (isinf(_2204.y))
            {
                float _1794 = dot(_934 + (_939 * _960), _939) / _1622;
                vec2 _2167 = _2204;
                _2167.y = _1794;
                if (!(!isinf(_1794)))
                {
                    _2211 = _2167;
                    _2210 = false;
                    break;
                }
                vec2 _2208;
                if (_2204.x > _1794)
                {
                    _2208 = _2167.yx;
                }
                else
                {
                    _2208 = _2167;
                }
                _2209 = _2208;
            }
            else
            {
                _2209 = _2204;
            }
            _2211 = vec2(max(_2209.x, 0.0), min(_2209.y, _1529));
            _2210 = _1529 >= _2209.x;
            break;
        }
        if (!_2210)
        {
            out_color0 = vec4(0.0, 0.0, 0.0, 1.0);
            break;
        }
        uvec2 _1825 = uvec2(_880 * _904.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy) & uvec2(3u);
        uint _1830 = _1825.x;
        uint _1832 = _1825.y;
        mat4 _1821 = mat4(vec4(1.0, 9.0, 3.0, 11.0), vec4(13.0, 5.0, 15.0, 7.0), vec4(4.0, 12.0, 2.0, 10.0), vec4(16.0, 8.0, 14.0, 6.0));
        float _1848 = _2211.x + (_1821[_1830][_1832] * 0.23529411852359771728515625);
        int _1857 = clamp(int(_1848 * 0.125), 0, 6);
        int _1872 = min(_418[_1857], max(_425[_1857], int(max(0.0, _2211.y - _1848) / _406[_1857])));
        float _1880 = (_2211.y - _2211.x) / float(_1872);
        float _2040 = intBitsToFloat(1597463007 - (floatBitsToInt(1.15999996662139892578125 - (0.800000011920928955078125 * _1622)) >> 1));
        float _2213;
        vec3 _2214;
        vec3 _2215;
        _2215 = _2221;
        _2214 = (_948 * (_2211.x + ((_1821[_1830][_1832] * 0.0588235296308994293212890625) * _1880))) - _934;
        _2213 = 0.0;
        for (int _2212 = 0; _2212 < _1872; )
        {
            float _1936 = dot(_2214, _2214);
            float _2059 = intBitsToFloat(2129859010 - floatBitsToInt(_969));
            vec3 _2181 = _2215;
            _2181.x = dot(_2214, cross(_944, _939)) * _2059;
            vec3 _2183 = _2181;
            _2183.y = dot(_2214, _944) * _2059;
            vec3 _2188 = _2183;
            _2188.z = mod((dot(_2214, _939) * intBitsToFloat(2129859010 - floatBitsToInt(_960))) - (_904.lUniforms.mpPerFrame.gfTime * 0.015625), 1.0);
            vec3 _1966 = _2188 * 2.0;
            vec4 _1969 = textureLod(gLightVolNoise3D, _1966, 0.0);
            float _1970 = _1969.x;
            float _2115 = intBitsToFloat(1597463007 - (floatBitsToInt(_1936) >> 1));
            _2215 = _1966;
            _2214 += (_948 * _1880);
            _2213 += (min(_2115 * intBitsToFloat(532487669 + (floatBitsToInt(_2115) >> 1)), 1.0) * (_1970 * pow(_1970, 4.0)));
            _2212++;
            continue;
        }
        out_color0 = vec4(_904.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * (_2213 * ((((_1880 * _904.lUniforms.mpCommonPerMesh.gLightColourVec4.w) * _904.lUniforms.mpCommonPerMesh.gLightCustomParamsVec4.x) * ((((0.06684507429599761962890625 * _2040) * _2040) * _2040) + (fma(_1622, _1622, 1.0) * 0.09375))) * 4.0)), 1.0);
        break;
    }
}


