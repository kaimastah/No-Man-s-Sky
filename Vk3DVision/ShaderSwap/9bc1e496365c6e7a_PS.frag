#version 450
layout(early_fragment_tests) in;
// hidden volumetric lighting
const float _393[7] = float[](1.25, 1.64999997615814208984375, 1.75, 2.5, 2.75, 2.75, 5.0);
const int _405[7] = int[](16, 12, 10, 8, 6, 6, 4);
const int _412[7] = int[](4, 4, 2, 2, 2, 2, 1);

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
} _732;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler3D gLightVolNoise3D;

layout(location = 0) in VertexBlock
{
    vec4 mScreenSpacePositionVec4;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _1815;
vec2 _1821;
vec3 _1853;

void main()
{
    vec2 _708;
    vec3 _762;
    vec3 _766;
    float _773;
    float _1291;
    for (;;)
    {
        _708 = In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w);
        vec2 _1207 = (vec2(_708.x, 1.0 - _708.y) * 2.0) - vec2(1.0);
        vec4 _1209 = vec4(_1207.x, _1207.y, _1815.z, _1815.w);
        vec4 _1781 = _1209;
        _1781.z = texture(gBufferMap, _708).x;
        vec4 _1783 = _1781;
        _1783.w = 1.0;
        vec4 _1215 = _732.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1783;
        vec4 _1788 = _1209;
        _1788.z = gl_FragCoord.z;
        
        _1788.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1215.w);
        
        vec4 _1790 = _1788;
        _1790.w = 1.0;
        vec4 _1254 = _732.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1790;
        _762 = _732.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz;
        _766 = normalize((_1254.xyz / vec3(_1254.w)).xyz);
        _773 = _732.lUniforms.mpCommonPerMesh.gLightPositionVec4.w * 0.949999988079071044921875;
        _1291 = dot((_1215.xyz / vec3(_1215.w)).xyz, _766);
        bool _1817;
        vec2 _1818;
        for (;;)
        {
            vec3 _1323 = -_762;
            float _1326 = dot(_1323, _766);
            float _1338 = (_1326 * _1326) - (dot(_1323, _1323) - (_773 * _773));
            if (_1338 < 0.0)
            {
                _1818 = _1821;
                _1817 = false;
                break;
            }
            float _1344 = sqrt(_1338);
            float _1346 = -_1326;
            float _1352 = _1346 + _1344;
            _1818 = vec2(_1346 - _1344, _1352);
            _1817 = _1352 >= 0.0;
            break;
        }
        bool _1308;
        vec2 _1822;
        if (_1817)
        {
            _1822 = vec2(max(_1818.x, 0.0), min(_1818.y, _1291));
            _1308 = _1291 >= _1818.x;
        }
        else
        {
            _1822 = _1818;
            _1308 = _1817;
        }
        if (!_1308)
        {
            out_color0 = vec4(0.0, 0.0, 0.0, 1.0);
            break;
        }
        uvec2 _1384 = uvec2(_708 * _732.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy) & uvec2(3u);
        uint _1389 = _1384.x;
        uint _1391 = _1384.y;
        mat4 _1380 = mat4(vec4(1.0, 9.0, 3.0, 11.0), vec4(13.0, 5.0, 15.0, 7.0), vec4(4.0, 12.0, 2.0, 10.0), vec4(16.0, 8.0, 14.0, 6.0));
        float _1407 = _1822.x + (_1380[_1389][_1391] * 0.23529411852359771728515625);
        int _1416 = clamp(int(_1407 * 0.125), 0, 6);
        int _1431 = min(_405[_1416], max(_412[_1416], int(max(0.0, _1822.y - _1407) / _393[_1416])));
        float _1439 = (_1822.y - _1822.x) / float(_1431);
        float _1824;
        vec3 _1825;
        _1825 = (_766 * (_1822.x + ((_1380[_1389][_1391] * 0.0588235296308994293212890625) * _1439))) - _762;
        _1824 = 0.0;
        vec4 _1515;
        float _1516;
        vec3 _1524;
        float _1525;
        float _1558;
        float _1573;
        vec2 _1610;
        float _1728;
        vec3 _1813;
        vec2 _1826;
        for (int _1823 = 0; _1823 < _1431; _1610 = (_1826.xy * 0.5) + vec2(0.5), _1813 = vec3(_1610.x, _1610.y, _1853.z), _1813.z = fract(intBitsToFloat(532487669 + (floatBitsToInt(intBitsToFloat(532487669 + (floatBitsToInt(_1558) >> 1))) >> 1)) - (_732.lUniforms.mpPerFrame.gfTime * 0.03125)), _1515 = textureLod(gLightVolNoise3D, _1813, 0.0), _1516 = _1515.x, _1524 = _1825 * _1573, _1525 = dot(_766, _1524), _1728 = intBitsToFloat(1597463007 - (floatBitsToInt(1.15999996662139892578125 - (0.800000011920928955078125 * _1525)) >> 1)), _1825 += (_766 * _1439), _1824 += ((min(_1573 * intBitsToFloat(532487669 + (floatBitsToInt(_1573) >> 1)), 1.0) * ((((0.06684507429599761962890625 * _1728) * _1728) * _1728) + (fma(_1525, _1525, 1.0) * 0.09375))) * (_1516 * pow(_1516, 8.0))), _1823++)
        {
            int _1555 = floatBitsToInt(dot(_1825, _1825)) >> 1;
            _1558 = intBitsToFloat(532487669 + _1555);
            _1573 = intBitsToFloat(1597463007 - _1555);
            vec3 _1591 = _1825 * intBitsToFloat(2129859010 - floatBitsToInt((abs(_1825.x) + abs(_1825.y)) + abs(_1825.z)));
            if (_1591.z >= 0.0)
            {
                _1826 = _1591.xy;
            }
            else
            {
                _1826 = (vec2(1.0) - abs(_1591.yx)) * ((vec2(float(_1591.x >= 0.0), float(_1591.y >= 0.0)) * 2.0) - vec2(1.0));
            }
        }
        out_color0 = vec4(_732.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * (_1824 * (((_1439 * _732.lUniforms.mpCommonPerMesh.gLightColourVec4.w) * _732.lUniforms.mpCommonPerMesh.gLightCustomParamsVec4.x) * 8.0)), 1.0);
        break;
    }
}


