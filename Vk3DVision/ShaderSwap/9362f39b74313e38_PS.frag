#version 450
//SSR temporal stuff
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
    vec4 gCustomParamsVec4;
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
} _948;

layout(set = 1, binding = 7) uniform sampler2D gBuffer7Map;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 6) uniform sampler2D gBuffer6Map;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 2) uniform sampler2D gBuffer2Map;
layout(set = 1, binding = 3) uniform sampler2D gBuffer3Map;
layout(set = 1, binding = 4) uniform sampler2D gBuffer4Map;
layout(set = 1, binding = 5) uniform sampler2D gBuffer5Map;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;
layout(location = 1) out vec4 out_color1;
layout(location = 2) out vec4 out_color2;

vec4 _2754;

void main()
{
    for (;;)
    {
        vec2 _1324 = In.mTexCoordsVec2 + vec2(_948.lUniforms.mpPerFrame.gDeJitterVec3.x, -_948.lUniforms.mpPerFrame.gDeJitterVec3.y);
        vec4 _967 = textureLod(gBufferMap, In.mTexCoordsVec2, 0.0);
        vec4 _973 = texture(gBuffer6Map, In.mTexCoordsVec2);
        vec2 _1428 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
        vec4 _2657 = vec4(_1428.x, _1428.y, _2754.z, _2754.w);
        _2657.z = textureLod(gBuffer7Map, In.mTexCoordsVec2, 0.0).x;
        vec4 _2659 = _2657;
        _2659.w = 1.0;
        vec4 _1436 = _948.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2659;
        vec3 _1452 = ((_1436.xyz / vec3(_1436.w)).xyz + _948.lUniforms.mpPerFrame.gViewPositionVec3).xyz;
        vec2 _1467 = (vec2(_967.x, 1.0 - _967.y) * 2.0) - vec2(1.0);
        vec4 _2664 = vec4(_1467.x, _1467.y, _2754.z, _2754.w);
        _2664.z = textureLod(gBuffer7Map, _967.xy, 0.0).x;
        vec4 _2666 = _2664;
        _2666.w = 1.0;
        vec4 _1475 = _948.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2666;
        vec4 _1396 = _948.lUniforms.mpPerFrame.gPrevViewProjectionMat4 * vec4(_1452 + (normalize(_1452 - _948.lUniforms.mpPerFrame.gViewPositionVec3) * length(((_1475.xyz / vec3(_1475.w)).xyz + _948.lUniforms.mpPerFrame.gViewPositionVec3).xyz - _1452)), 1.0);
        vec2 _1409 = ((_1396.xyz / vec3(_1396.w)).xy * 0.5) + vec2(0.5);
        
        _1409.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y / _1396.w); 
        
        vec2 _1414 = vec2(_1409.x, 1.0 - _1409.y).xy;
        vec4 _1082 = texture(gBuffer1Map, In.mTexCoordsVec2);
        bool _1509 = all(greaterThan(_1414, vec2(0.0)));
        bool _1515;
        if (_1509)
        {
            _1515 = all(lessThan(_1414, vec2(1.0)));
        }
        else
        {
            _1515 = _1509;
        }
        if (!_1515)
        {
            out_color0 = vec4(_1082.xyz, 1.0);
            out_color1 = vec4(1.0, 0.0, 0.0, 1.0);
            out_color2 = vec4(1.0, 0.0, 0.0, 1.0);
            break;
        }
        vec4 _1105 = textureLod(gBuffer2Map, _1414, 0.0);
        float _1108 = _1105.x;
        if (_1108 <= 0.0)
        {
            out_color0 = vec4(_1082.xyz, 1.0);
            out_color1 = vec4(1.0, 0.0, 0.0, 1.0);
            out_color2 = vec4(1.0, 0.0, 0.0, 1.0);
            break;
        }
        vec4 _1122 = textureLod(gBuffer3Map, _1414, 0.0);
        float _1123 = _1122.x;
        vec4 _1128 = textureLod(gBuffer4Map, In.mTexCoordsVec2, 0.0);
        float _1129 = _1128.x;
        vec4 _1134 = textureLod(gBuffer5Map, In.mTexCoordsVec2, 0.0);
        float _1135 = _1134.y;
        vec2 _1535 = vec2(1.0) / vec2(textureSize(gBuffer1Map, 0)) * 0.3;//hack
        float _1537 = _1535.x;
        float _1539 = _1535.y;
        float _1543 = -_1537;
        float _1545 = -_1539;
        vec4 _1548 = texture(gBuffer1Map, _1324 + vec2(_1543, _1545));
        float _1636 = _1548.x;
        float _1638 = _1548.z;
        float _1640 = 0.25 * (_1636 + _1638);
        float _1643 = 0.5 * _1548.y;
        vec3 _1659 = vec3(_1640 + _1643, _1643 - _1640, 0.5 * (_1636 - _1638));
        vec4 _1558 = texture(gBuffer1Map, _1324 + vec2(0.0, _1545));
        float _1667 = _1558.x;
        float _1669 = _1558.z;
        float _1671 = 0.25 * (_1667 + _1669);
        float _1674 = 0.5 * _1558.y;
        vec3 _1690 = vec3(_1671 + _1674, _1674 - _1671, 0.5 * (_1667 - _1669));
        vec4 _1569 = texture(gBuffer1Map, _1324 + vec2(_1537, _1545));
        float _1698 = _1569.x;
        float _1700 = _1569.z;
        float _1702 = 0.25 * (_1698 + _1700);
        float _1705 = 0.5 * _1569.y;
        vec3 _1721 = vec3(_1702 + _1705, _1705 - _1702, 0.5 * (_1698 - _1700));
        vec4 _1579 = texture(gBuffer1Map, _1324 + vec2(_1543, 0.0));
        float _1729 = _1579.x;
        float _1731 = _1579.z;
        float _1733 = 0.25 * (_1729 + _1731);
        float _1736 = 0.5 * _1579.y;
        vec3 _1752 = vec3(_1733 + _1736, _1736 - _1733, 0.5 * (_1729 - _1731));
        vec4 _1586 = texture(gBuffer1Map, _1324);
        float _1760 = _1586.x;
        float _1762 = _1586.z;
        float _1764 = 0.25 * (_1760 + _1762);
        float _1767 = 0.5 * _1586.y;
        vec3 _1783 = vec3(_1764 + _1767, _1767 - _1764, 0.5 * (_1760 - _1762));
        vec4 _1595 = texture(gBuffer1Map, _1324 + vec2(_1537, 0.0));
        float _1791 = _1595.x;
        float _1793 = _1595.z;
        float _1795 = 0.25 * (_1791 + _1793);
        float _1798 = 0.5 * _1595.y;
        vec3 _1814 = vec3(_1795 + _1798, _1798 - _1795, 0.5 * (_1791 - _1793));
        vec4 _1606 = texture(gBuffer1Map, _1324 + vec2(_1543, _1539));
        float _1822 = _1606.x;
        float _1824 = _1606.z;
        float _1826 = 0.25 * (_1822 + _1824);
        float _1829 = 0.5 * _1606.y;
        vec3 _1845 = vec3(_1826 + _1829, _1829 - _1826, 0.5 * (_1822 - _1824));
        vec4 _1615 = texture(gBuffer1Map, _1324 + vec2(0.0, _1539));
        float _1853 = _1615.x;
        float _1855 = _1615.z;
        float _1857 = 0.25 * (_1853 + _1855);
        float _1860 = 0.5 * _1615.y;
        vec3 _1876 = vec3(_1857 + _1860, _1860 - _1857, 0.5 * (_1853 - _1855));
        vec4 _1625 = texture(gBuffer1Map, _1324 + _1535);
        float _1884 = _1625.x;
        float _1886 = _1625.z;
        float _1888 = 0.25 * (_1884 + _1886);
        float _1891 = 0.5 * _1625.y;
        vec3 _1907 = vec3(_1888 + _1891, _1891 - _1888, 0.5 * (_1884 - _1886));
        float _1911 = length((_973.xy - vec2(0.5)) * 2.0);
        float _1919 = _1911 * step(0.00150000001303851604461669921875, _1911);
        float _1925 = mix(max(_1129 * step(0.00150000001303851604461669921875, _1129), _1919 * 0.25), _1919, 0.5);
        float _2083 = _1105.z;
        float _2085 = 0.25 * (_1108 + _2083);
        float _2088 = 0.5 * _1105.y;
        float _2091 = _2085 + _2088;
        vec3 _1999 = ((((((((_1659 + _1690) + _1721) + _1752) + _1814) + _1845) + _1876) + _1907) + _1783) * vec3(0.111111111938953399658203125);
        vec3 _2002 = _1659 - _1999;
        vec3 _2006 = _1690 - _1999;
        vec3 _2011 = _1721 - _1999;
        vec3 _2016 = _1752 - _1999;
        vec3 _2021 = _1814 - _1999;
        vec3 _2026 = _1845 - _1999;
        vec3 _2031 = _1876 - _1999;
        vec3 _2036 = _1907 - _1999;
        vec3 _2041 = _1783 - _1999;
        vec3 _2045 = (((((((((_2002 * _2002) + (_2006 * _2006)) + (_2011 * _2011)) + (_2016 * _2016)) + (_2021 * _2021)) + (_2026 * _2026)) + (_2031 * _2031)) + (_2036 * _2036)) + (_2041 * _2041)) * vec3(0.125);
        
        _2045.x += vk3d_params.stereo.x;
        
        float _2049 = _2045.x;
        vec3 _2061 = sqrt(_2045) * mix(4.0, 8.0, _1135 * _1135);
        vec3 _2062 = _1999 - _2061;
        vec3 _2067 = _1999 + _2061;
        vec3 _2151 = (_2067 + _2062) * 0.5;
        vec3 _2158 = vec3(_2091, _2088 - _2085, 0.5 * (_1108 - _2083)) - _2151;
        vec3 _2163 = abs(((_2067 - _2062) * 0.5) / _2158);
        vec3 _2177 = _2151 + (_2158 * clamp(min(_2163.x, min(_2163.y, _2163.z)), 0.0, 1.0));
        float _2187 = _2177.x;
        float _2189 = _2177.y;
        float _2191 = _2177.z;
        float _2194 = _2187 - _2189;
        float _2215 = _1135 * 0.875;
        float _2222 = clamp(1.0 - _1123, 0.0, 1.0);
        float _2226 = _2215 * _2215;
        float _2238 = clamp((_1925 * 256.0) * mix(1.0, 0.25, _2215), 0.0, 1.0);
        vec3 param[9] = vec3[](_1659, _1690, _1721, _1752, _1783, _1814, _1845, _1876, _1907);
        float _2359 = _1082.x;
        float _2361 = _1082.z;
        float _2363 = 0.25 * (_2359 + _2361);
        float _2366 = 0.5 * _1082.y;
        float _2758;
        vec3 _2759;
        float _2760;
        _2760 = 0.0;
        _2759 = vec3(0.0);
        _2758 = 0.0;
        for (int _2757 = 0; _2757 < 9; )
        {
            vec3 _2279 = vec3(_2363 + _2366, _2366 - _2363, 0.5 * (_2359 - _2361)) - param[_2757];
            float _2287 = float(_2757 % 3) - 1.0;
            float _2291 = float(_2757 / 3) - 1.0;
            float _2311 = exp(-((dot(_2279, _2279) * 0.100000001490116119384765625) + (((_2287 * _2287) + (_2291 * _2291)) * 0.5))) / (1.0 + param[_2757].x);
            _2760 += float(int(_2311 > 0.0));
            _2759 += (param[_2757] * _2311);
            _2758 += _2311;
            _2757++;
            continue;
        }
        vec3 _2349 = mix(_2759 / vec3(_2758), vec3(_2363 + _2366, _2366 - _2363, 0.5 * (_2359 - _2361)), vec3((_2760 > 0.0) ? 0.0 : 1.0));
        float _2392 = _2349.x;
        float _2394 = _2349.y;
        float _2396 = _2349.z;
        float _2399 = _2392 - _2394;
        vec3 _1199 = max(mix(mix(_1105.xyz, vec3(_2194 + _2191, _2187 + _2189, _2194 - _2191), vec3(mix(mix(1.0, _2222 * 0.5, _2226), 1.0, _2238))), vec3(_2399 + _2396, _2392 + _2394, _2399 - _2396), vec3(mix(0.02500000037252902984619140625, mix(0.25, _2222 * 0.014999999664723873138427734375, _2226), _2238))), vec3(1.000000016862383526387164645044e-16));
        float _2476 = _1199.x;
        float _2486 = (0.25 * (_2476 + _1199.z)) + (0.5 * _1199.y);
        float _2430 = (_2486 + _2091) * 0.5;
        float _2433 = _2486 - _2430;
        float _2437 = _2091 - _2430;
        float _2439 = (_2433 * _2433) + (_2437 * _2437);
        float _2454 = sqrt(max((_2049 / (1.0 + _2049)) * 0.001000000047497451305389404296875, (_2439 / (1.0 + _2439)) / max(1.0, _1925 * 512.0)) * 524288.0);
        out_color0 = vec4(_2476, _1199.yz, 1.0);
        out_color1 = vec4(min(mix(max(_2454 * 0.75, _1123), _2454, 0.100000001490116119384765625), 0.996078431606292724609375), 0.0, 0.0, 1.0);
        out_color2 = vec4(_1925, 0.0, 0.0, 1.0);
        break;
    }
}










































































