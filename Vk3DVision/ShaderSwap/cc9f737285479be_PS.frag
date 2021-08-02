#version 450

const float _401[7] = float[](1.25, 1.64999997615814208984375, 1.75, 2.5, 2.75, 2.75, 5.0);
const int _413[7] = int[](16, 12, 10, 8, 6, 6, 4);
const int _420[7] = int[](4, 4, 2, 2, 2, 2, 1);

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
} _782;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler3D gLightVolNoise3D;

layout(location = 0) in VertexBlock
{
    vec4 mScreenSpacePositionVec4;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _1922;
vec2 _1930;
vec3 _1971;

void main()
{
    vec2 _758 = In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w);
    vec2 _1264 = (vec2(_758.x, 1.0 - _758.y) * 2.0) - vec2(1.0);
    vec4 _1266 = vec4(_1264.x, _1264.y, _1922.z, _1922.w);
    vec4 _1889 = _1266;
    _1889.z = texture(gBufferMap, _758).x;
    vec4 _1891 = _1889;
    _1891.w = 1.0;
    vec4 _1272 = _782.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1891;
    vec3 _1288 = (_1272.xyz / vec3(_1272.w)).xyz;
    vec4 _1896 = _1266;
    _1896.z = gl_FragCoord.z;
    
    _1896.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1272.w);
    
    vec4 _1898 = _1896;
    _1898.w = 1.0;
    vec4 _1311 = _782.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1898;
    vec3 _1327 = (_1311.xyz / vec3(_1311.w)).xyz;
    vec3 _816 = normalize(_1327);
    float _823 = _782.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.949999988079071044921875;
    bool _1931;
    vec2 _1932;
    float _1359;
    float _1362;
    for (;;)
    {
        _1359 = dot(_1288, _816);
        _1362 = dot(_1327, _816);
        bool _1923;
        for (;;)
        {
            if (_1362 < _1359)
            {
                _1923 = true;
                break;
            }
            float _1404 = _782.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.978499948978424072265625;
            vec3 _1407 = _1288 - _782.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
            _1923 = dot(_1407, _1407) < (_1404 * _1404);
            break;
        }
        if (!_1923)
        {
            _1932 = _1930;
            _1931 = false;
            break;
        }
        bool _1924;
        vec2 _1925;
        for (;;)
        {
            vec3 _1431 = -_782.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
            float _1434 = dot(_1431, _816);
            float _1446 = (_1434 * _1434) - (dot(_1431, _1431) - (_823 * _823));
            if (_1446 < 0.0)
            {
                _1925 = _1930;
                _1924 = false;
                break;
            }
            float _1452 = sqrt(_1446);
            float _1454 = -_1434;
            float _1460 = _1454 + _1452;
            _1925 = vec2(_1454 - _1452, _1460);
            _1924 = _1460 >= 0.0;
            break;
        }
        bool _1386;
        vec2 _1936;
        if (_1924)
        {
            _1936 = vec2(max(_1925.x, 0.0), min(_1925.y, _1359));
            _1386 = _1359 >= _1925.x;
        }
        else
        {
            _1936 = _1925;
            _1386 = _1924;
        }
        _1932 = _1936;
        _1931 = _1386;
        break;
    }
    if (!_1931)
    {
        discard;
    }
    uvec2 _1492 = uvec2(_758 * _782.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy) & uvec2(3u);
    uint _1497 = _1492.x;
    uint _1499 = _1492.y;
    mat4 _1488 = mat4(vec4(1.0, 9.0, 3.0, 11.0), vec4(13.0, 5.0, 15.0, 7.0), vec4(4.0, 12.0, 2.0, 10.0), vec4(16.0, 8.0, 14.0, 6.0));
    float _1515 = _1932.x + (_1488[_1497][_1499] * 0.23529411852359771728515625);
    int _1524 = clamp(int(_1515 * 0.125), 0, 6);
    int _1539 = min(_413[_1524], max(_420[_1524], int(max(0.0, _1932.y - _1515) / _401[_1524])));
    float _1547 = (_1932.y - _1932.x) / float(_1539);
    float _1938;
    vec3 _1939;
    _1939 = (_816 * (_1932.x + ((_1488[_1497][_1499] * 0.0588235296308994293212890625) * _1547))) - _782.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
    _1938 = 0.0;
    vec4 _1623;
    float _1624;
    vec3 _1632;
    float _1633;
    float _1666;
    float _1681;
    vec2 _1718;
    float _1836;
    vec3 _1921;
    vec2 _1940;
    for (int _1937 = 0; _1937 < _1539; _1718 = (_1940.xy * 0.5) + vec2(0.5), _1921 = vec3(_1718.x, _1718.y, _1971.z), _1921.z = fract(intBitsToFloat(532487669 + (floatBitsToInt(intBitsToFloat(532487669 + (floatBitsToInt(_1666) >> 1))) >> 1)) - (_782.lUniforms.mpPerFrame.gfTime * 0.03125)), _1623 = textureLod(gLightVolNoise3D, _1921, 0.0), _1624 = _1623.x, _1632 = _1939 * _1681, _1633 = dot(_816, _1632), _1836 = intBitsToFloat(1597463007 - (floatBitsToInt(1.15999996662139892578125 - (0.800000011920928955078125 * _1633)) >> 1)), _1939 += (_816 * _1547), _1938 += ((min(_1681 * intBitsToFloat(532487669 + (floatBitsToInt(_1681) >> 1)), 1.0) * ((((0.06684507429599761962890625 * _1836) * _1836) * _1836) + (fma(_1633, _1633, 1.0) * 0.09375))) * (_1624 * pow(_1624, 8.0))), _1937++)
    {
        int _1663 = floatBitsToInt(dot(_1939, _1939)) >> 1;
        _1666 = intBitsToFloat(532487669 + _1663);
        _1681 = intBitsToFloat(1597463007 - _1663);
        vec3 _1699 = _1939 * intBitsToFloat(2129859010 - floatBitsToInt((abs(_1939.x) + abs(_1939.y)) + abs(_1939.z)));
        if (_1699.z >= 0.0)
        {
            _1940 = _1699.xy;
        }
        else
        {
            _1940 = (vec2(1.0) - abs(_1699.yx)) * ((vec2(float(_1699.x >= 0.0), float(_1699.y >= 0.0)) * 2.0) - vec2(1.0));
        }
    }
    out_color0 = vec4(_782.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * (_1938 * (((_1547 * _782.lUniforms.mpCommonPerMesh.gLightColourVec4.w) * _782.lUniforms.mpCommonPerMesh.gLightCustomParamsVec4.x) * 8.0)), 1.0);
}


