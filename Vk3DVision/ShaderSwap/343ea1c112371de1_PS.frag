#version 450

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
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CustomPerMeshUniforms mpCustomPerMesh;
    CommonPerMeshUniforms mpCommonPerMesh;
};

layout(constant_id = 0) const int gIsLowEnd = 0;
const bool _1372 = (gIsLowEnd == 1);
const bool _1598 = (gIsLowEnd == 1);

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
layout(set = 0, binding = 45, std140) uniform Vk3DParams
{
    vec4 stereo;
    vec4 custom_params;
} vk3d_params;

layout(set = 0, binding = 0, std140) uniform lUniforms_BLK
{
    UniformBuffer lUniforms;
} _816;

layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 1) out vec4 out_color1;
layout(location = 0) out vec4 out_color0;

vec4 _3672;
vec3 _4396;

void main()
{
    for (;;)
    {
        if (_816.lUniforms.mpPerFrame.gFoVValuesVec4.z == 2.0)
        {
            vec4 _831 = texture(gBuffer1Map, In.mTexCoordsVec2);
            bool _835 = _831.x == 0.0;
            bool _841;
            if (_835)
            {
                _841 = _831.y == 0.0;
            }
            else
            {
                _841 = _835;
            }
            bool _847;
            if (_841)
            {
                _847 = _831.z == 0.0;
            }
            else
            {
                _847 = _841;
            }
            if (_847)
            {
                discard;
            }
        }
        vec4 _858 = texture(gBufferMap, In.mTexCoordsVec2);
        float _2305 = _858.x * _816.lUniforms.mpPerFrame.gClipPlanesVec4.y;
        out_color1 = vec4(0.0);
        bool _876 = _2305 >= (_816.lUniforms.mpPerFrame.gClipPlanesVec4.y - 100.0);
        vec2 _2314 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
        vec4 _3608 = vec4(_2314.x, _2314.y, _3672.z, _3672.w);
        
        _3608.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y / (_876 ? 50000.0 : _2305)); 
        
        _3608.z = 0.0;
        vec4 _3610 = _3608;
        _3610.w = 1.0;
        vec4 _2321 = _816.lUniforms.mpPerFrame.gInverseProjectionMat4 * _3610;
        mat4 _3613 = _816.lUniforms.mpPerFrame.gInverseViewMat4;
        _3613[3] = vec4(0.0, 0.0, 0.0, 1.0);
        vec3 _2343 = ((_3613 * ((_2321 / vec4(abs(_2321.z))) * (_876 ? 50000.0 : _2305))).xyz + _816.lUniforms.mpPerFrame.gViewPositionVec3).xyz;
        vec3 _901 = _2343 - _816.lUniforms.mpPerFrame.gViewPositionVec3;
        vec3 _914 = _816.lUniforms.mpPerFrame.gViewPositionVec3 - _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
        vec3 _918 = _2343 - _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
        bool _925 = _816.lUniforms.mpCustomPerMesh.gFogColourVec4.w > 0.0;
        bool _933 = !_925;
        vec3 _3689;
        float _3702;
        vec3 _3711;
        vec3 _3716;
        if ((_816.lUniforms.mpCustomPerMesh.gWaterFogVec4.x > 0.0) && _933)
        {
            float _940 = _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _816.lUniforms.mpCustomPerMesh.gWaterFogVec4.x;
            float _2371;
            float _3678;
            vec3 _3679;
            for (;;)
            {
                vec3 _2370 = _914 - _918;
                _2371 = length(_2370);
                vec3 _2375 = normalize(_2370);
                float _2378 = dot(_914, _2375);
                float _2379 = 2.0 * _2378;
                float _2392 = (_2379 * _2379) - (4.0 * (dot(_914, _914) - (_940 * _940)));
                if ((_2392 >= 0.0) && (_2371 != 0.0))
                {
                    float _2401 = sqrt(_2392);
                    float _2403 = _2378 * (-2.0);
                    vec3 _2416 = _914 + (_2375 * (0.5 * (_2403 - _2401)));
                    vec3 _2421 = _914 + (_2375 * (0.5 * (_2403 + _2401)));
                    bool _2432 = max(length(_2421 - _918), length(_2421 - _914)) > _2371;
                    float _4401 = _2432 ? 2.0 : 1.0;
                    float _3677;
                    if (max(length(_2416 - _918), length(_2416 - _914)) > _2371)
                    {
                        _3677 = _4401 + 2.0;
                    }
                    else
                    {
                        _3677 = _4401;
                    }
                    _3679 = mix(_2421, _914, bvec3(_2432));
                    _3678 = _3677;
                    break;
                }
                _3679 = _914;
                _3678 = 0.0;
                break;
            }
            bool _953 = _3678 > 0.0;
            bool _965;
            if (_953)
            {
                _965 = _2371 > length(_914 - _3679);
            }
            else
            {
                _965 = _953;
            }
            bool _973;
            if (_965)
            {
                _973 = length(_914 - _3679) > 0.0;
            }
            else
            {
                _973 = _965;
            }
            vec3 _3690;
            vec3 _3717;
            if (_973)
            {
                vec3 _978 = _3679 + _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
                _3717 = _978 - _816.lUniforms.mpPerFrame.gViewPositionVec3;
                _3690 = _978;
            }
            else
            {
                if (_876)
                {
                    out_color0 = vec4(0.0);
                    break;
                }
                _3717 = _901;
                _3690 = _2343;
            }
            _3716 = _3717;
            _3711 = _3679;
            _3702 = float(_973);
            _3689 = _3690;
        }
        else
        {
            if (_876)
            {
                out_color0 = vec4(0.0);
                break;
            }
            _3716 = _901;
            _3711 = vec3(0.0);
            _3702 = 0.0;
            _3689 = _2343;
        }
        vec3 _3698;
        float _3699;
        vec3 _3834;
        _3834 = _816.lUniforms.mpCustomPerMesh.gHorizonColourVec4.xyz;
        _3699 = _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
        _3698 = _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
        vec3 _1030;
        float _1036;
        float _1038;
        bool _1048;
        vec3 _4306;
        int _3697 = 0;
        float _4266 = length(_816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz - _3689);
        for (; _3697 < 6; _4266 = _1048 ? _1038 : _4266, _3834 = _4306, _3699 = _1048 ? _1036 : _3699, _3698 = mix(_3698, _1030, bvec3(_1048)), _3697++)
        {
            _1030 = _816.lUniforms.mpCustomPerMesh.gaPlanetPositionsVec4[_3697].xyz;
            _1036 = _816.lUniforms.mpCustomPerMesh.gaPlanetPositionsVec4[_3697].w;
            _1038 = length(_1030 - _3689) - _1036;
            bool _1041 = _1038 <= _4266;
            if (_1041)
            {
                _1048 = _1036 > 0.0;
            }
            else
            {
                _1048 = _1041;
            }
            if (_1048)
            {
                _4306 = _816.lUniforms.mpCustomPerMesh.gaPlanetColoursVec4[_3697].xyz;
            }
            else
            {
                _4306 = _3834;
            }
        }
        vec3 _1121 = _816.lUniforms.mpPerFrame.gViewPositionVec3 - _3698;
        float _1122 = length(_1121);
        float _1124 = _1122 - _3699;
        float _1132 = length(_914) - _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
        float _1139 = clamp((_1132 - _816.lUniforms.mpCustomPerMesh.gFogFadeHeights2Vec4.z) / _816.lUniforms.mpCustomPerMesh.gFogFadeHeights2Vec4.w, 0.0, 1.0);
        float _1151 = mix(_1139, 0.0, (1.0 - _1139) * clamp((_1124 - _816.lUniforms.mpCustomPerMesh.gFogFadeHeights2Vec4.z) / _816.lUniforms.mpCustomPerMesh.gFogFadeHeights2Vec4.w, 0.0, 1.0));
        float _1157 = clamp((_1132 - _816.lUniforms.mpCustomPerMesh.gFogFadeHeightsVec4.x) / _816.lUniforms.mpCustomPerMesh.gFogFadeHeightsVec4.y, 0.0, 1.0);
        float _1169 = mix(_1157, 0.0, (1.0 - _1157) * clamp((_1124 - _816.lUniforms.mpCustomPerMesh.gFogFadeHeightsVec4.x) / _816.lUniforms.mpCustomPerMesh.gFogFadeHeightsVec4.y, 0.0, 1.0));
        float _1175 = clamp((_1132 - _816.lUniforms.mpCustomPerMesh.gFogFadeHeightsVec4.z) / _816.lUniforms.mpCustomPerMesh.gFogFadeHeightsVec4.w, 0.0, 1.0);
        float _1196 = _925 ? 0.0 : (1.0 - clamp(pow(1.0 - mix(_1175, 0.0, (1.0 - _1175) * clamp((_1124 - _816.lUniforms.mpCustomPerMesh.gFogFadeHeightsVec4.z) / _816.lUniforms.mpCustomPerMesh.gFogFadeHeightsVec4.w, 0.0, 1.0)), _816.lUniforms.mpCustomPerMesh.gSpaceFogParamsVec4.w), 0.0, 1.0));
        float _1202 = float(abs(_1124 - _1132) < 100.0);
        float _1211 = max(_1169, _1202);
        float _1223 = clamp((_1124 - _816.lUniforms.mpCustomPerMesh.gFogFadeHeights3Vec4.z) / _816.lUniforms.mpCustomPerMesh.gFogFadeHeights3Vec4.w, 0.0, 1.0);
        vec3 _1242 = _3689 - _3698;
        vec3 _4408 = mix(_1242, _3711, bvec3(_3702 > 0.0));
        bool _1257 = _1211 < 1.0;
        float _3897;
        vec3 _3935;
        if (((_1151 < 1.0) || _1257) && _933)
        {
            vec3 _1270 = _816.lUniforms.mpCustomPerMesh.gHorizonColourVec4.xyz * _816.lUniforms.mpCustomPerMesh.gSunPositionVec4.w;
            vec3 _1277 = _914 / vec3(_816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w);
            vec3 _1280 = normalize(_3716);
            float _1302 = 1.08000004291534423828125 * _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
            vec3 _3724;
            for (;;)
            {
                float _2470 = dot(_914, _1280);
                float _2471 = 2.0 * _2470;
                float _2484 = (_2471 * _2471) - (4.0 * (dot(_914, _914) - (_1302 * _1302)));
                if (_2484 >= 0.0)
                {
                    _3724 = _914 + (_1280 * (0.5 * ((_2470 * (-2.0)) + sqrt(_2484))));
                    break;
                }
                else
                {
                    _3724 = vec3(0.0);
                    break;
                }
            }
            vec3 _1310 = normalize(_3724) * 1.08000004291534423828125;
            float _1336 = min(_816.lUniforms.mpCustomPerMesh.gScatteringParamsVec4.x, 0.3499999940395355224609375);
            int _2534 = _1372 ? 4 : 8;
            float _3729;
            if (_816.lUniforms.mpCustomPerMesh.gScatteringParamsVec4.y != 0.0)
            {
                vec3 _2549 = (_1310 - _1277) / vec3(float(_2534));
                float _2553 = length(_2549) * 0.5;
                float _3728;
                vec3 _4256;
                _4256 = _1277;
                _3728 = 0.0;
                float _2568;
                float _4282;
                int _3727 = 0;
                float _4257 = 0.0;
                for (; _3727 < _2534; _4257 = _2568, _4256 += _2549, _3728 = _4282, _3727++)
                {
                    float _2632 = length(_4256);
                    float _2643 = exp(-(((_2632 - 1.0) * 12.49999332427978515625) / _816.lUniforms.mpCustomPerMesh.gScatteringParamsVec4.y));
                    _2568 = _4257 + _2643;
                    if (abs(_2643) > 0.0003000000142492353916168212890625)
                    {
                        float _4258;
                        if (_3727 > 0)
                        {
                            _4258 = _2568 * _2553;
                        }
                        else
                        {
                            _4258 = _2568;
                        }
                        float _4283;
                        if (abs(exp(-_4258) * _2643) > 0.001000000047497451305389404296875)
                        {
                            vec3 _2657 = ((_4256 + _816.lUniforms.mpCustomPerMesh.gSunPositionVec4.xyz) - _4256) * vec3(0.0500000007450580596923828125);
                            float _2664 = 18.0336780548095703125 / _816.lUniforms.mpCustomPerMesh.gScatteringParamsVec4.y;
                            _4283 = _3728 + (_2643 * exp(((-((((((((((exp2((1.0 - _2632) * _2664) + (exp2((1.0 - length(_4256 + (_2657 * 1.0))) * _2664) * 2.0)) + (exp2((1.0 - length(_4256 + (_2657 * 2.0))) * _2664) * 2.0)) + (exp2((1.0 - length(_4256 + (_2657 * 3.0))) * _2664) * 3.0)) + (exp2((1.0 - length(_4256 + (_2657 * 5.0))) * _2664) * 4.0)) + (exp2((1.0 - length(_4256 + (_2657 * 7.0))) * _2664) * 6.0)) + (exp2((1.0 - length(_4256 + (_2657 * 11.0))) * _2664) * 8.0)) + (exp2((1.0 - length(_4256 + (_2657 * 15.0))) * _2664) * 9.0)) + (exp2((1.0 - length(_4256 + (_2657 * 20.0))) * _2664) * 5.0)) * (length(_2657) * 0.5)) + _4258)) * _816.lUniforms.mpCustomPerMesh.gScatteringParamsVec4.w) * 12.56637096405029296875));
                        }
                        else
                        {
                            _4283 = _3728;
                        }
                        _4282 = _4283;
                    }
                    else
                    {
                        _4282 = _3728;
                    }
                }
                _3729 = _3728 * _2553;
            }
            else
            {
                _3729 = 0.0;
            }
            vec3 _2626 = vec3(isnan(_3729) ? 0.0 : _3729);
            vec3 _3616 = _4396;
            _3616.x = pow(1.0, 2.2000000476837158203125);
            vec3 _1395 = _1310 - _1277;
            float _2878 = dot(normalize(_816.lUniforms.mpCustomPerMesh.gSunPositionVec4.xyz), _1395) / length(_1395);
            float _2882 = 1.0 + (_2878 * _2878);
            vec3 _2897 = ((_3616 * _816.lUniforms.mpCustomPerMesh.gHorizonColourVec4.w) * (_816.lUniforms.mpCustomPerMesh.gScatteringParamsVec4.w * (0.75 * _2882))) * _2626;
            float _2910 = _816.lUniforms.mpCustomPerMesh.gSkyUpperColourVec4.w * _816.lUniforms.mpCustomPerMesh.gSkyUpperColourVec4.w;
            float _1432 = _1336 * _816.lUniforms.mpCustomPerMesh.gSkyGradientSpeedVec4.x;
            float _1445 = _2897.x;
            float _1447 = _1445 * _816.lUniforms.mpCustomPerMesh.gScatteringParamsVec4.z;
            vec3 _3627 = _4396;
            _3627.x = smoothstep(min(0.100000001490116119384765625 + _1432, 0.449999988079071044921875), max(0.800000011920928955078125 - _1432, 0.4510000050067901611328125), _1447);
            float _1453 = _1336 * _816.lUniforms.mpCustomPerMesh.gSkyGradientSpeedVec4.y;
            vec3 _3632 = _3627;
            _3632.y = smoothstep(min(0.100000001490116119384765625 + _1453, 0.449999988079071044921875), max(0.800000011920928955078125 - _1453, 0.4510000050067901611328125), _1447);
            float _1471 = _1336 * _816.lUniforms.mpCustomPerMesh.gSkyGradientSpeedVec4.z;
            vec3 _3637 = _3632;
            _3637.z = smoothstep(min(0.100000001490116119384765625 + _1471, 0.449999988079071044921875), max(0.800000011920928955078125 - _1471, 0.4510000050067901611328125), _1447);
            _3935 = mix(mix(mix(mix(_816.lUniforms.mpCustomPerMesh.gSkyUpperColourVec4.xyz * _816.lUniforms.mpCustomPerMesh.gSkyColourVec4.w, _816.lUniforms.mpCustomPerMesh.gSkyColourVec4.xyz * _816.lUniforms.mpCustomPerMesh.gSkyColourVec4.w, clamp(_816.lUniforms.mpCustomPerMesh.gSkyGradientSpeedVec4.xyz * (max(_1445 - _816.lUniforms.mpCustomPerMesh.gSkyUpperParamsVec4.x, 0.0) * _816.lUniforms.mpCustomPerMesh.gSkyGradientSpeedVec4.w), vec3(0.0), vec3(1.0))), _816.lUniforms.mpCustomPerMesh.gSkySolarColourVec4.xyz * _816.lUniforms.mpCustomPerMesh.gSkyColourVec4.w, clamp((((_816.lUniforms.mpCustomPerMesh.gSunColourVec4.xyz * _816.lUniforms.mpCustomPerMesh.gSkySolarColourVec4.w) * (((1.5 * ((1.0 - _2910) / (2.0 + _2910))) * _2882) / pow((1.0 + _2910) - ((2.0 * _816.lUniforms.mpCustomPerMesh.gSkyUpperColourVec4.w) * _2878), 1.5))) * _2626) * _816.lUniforms.mpCustomPerMesh.gSkyGradientSpeedVec4.xyz, vec3(0.0), vec3(1.0))), _1270, clamp(_3637 * _816.lUniforms.mpCustomPerMesh.gSkyGradientSpeedVec4.xyz, vec3(0.0), vec3(1.0))), _1270, vec3(smoothstep(0.0, 0.20000000298023223876953125, -dot(_1280, normalize(_914)))));
            _3897 = 1.0 - smoothstep(0.100000001490116119384765625, 0.800000011920928955078125, _1445 * 2.2000000476837158203125);
        }
        else
        {
            _3935 = vec3(1.0, 0.0, 0.0);
            _3897 = 0.0;
        }
        bool _1554 = _1151 > 0.0;
        bool _1563;
        if (!_1554)
        {
            _1563 = _1257 && _933;
        }
        else
        {
            _1563 = _1554;
        }
        float _3900;
        vec3 _3944;
        if (_1563)
        {
            vec3 _1568 = normalize(_4408);
            vec3 _1576 = _1568 - (normalize(_3716) * 0.08000004291534423828125);
            int _2976 = _1598 ? 4 : 8;
            float _3847;
            if (_816.lUniforms.mpCustomPerMesh.gSpaceScatteringParamsVec4.y != 0.0)
            {
                vec3 _2991 = (_1568 - _1576) / vec3(float(_2976));
                float _2995 = length(_2991) * 0.5;
                float _3846;
                vec3 _4246;
                _4246 = _1576;
                _3846 = 0.0;
                float _3010;
                float _4311;
                int _3845 = 0;
                float _4247 = 0.0;
                for (; _3845 < _2976; _4247 = _3010, _4246 += _2991, _3846 = _4311, _3845++)
                {
                    float _3074 = length(_4246);
                    float _3085 = exp(-(((_3074 - 1.0) * 12.49999332427978515625) / _816.lUniforms.mpCustomPerMesh.gSpaceScatteringParamsVec4.y));
                    _3010 = _4247 + _3085;
                    if (abs(_3085) > 0.0003000000142492353916168212890625)
                    {
                        float _4248;
                        if (_3845 > 0)
                        {
                            _4248 = _3010 * _2995;
                        }
                        else
                        {
                            _4248 = _3010;
                        }
                        float _4312;
                        if (abs(exp(-_4248) * _3085) > 0.001000000047497451305389404296875)
                        {
                            vec3 _3099 = ((_4246 + _816.lUniforms.mpCustomPerMesh.gSunPositionVec4.xyz) - _4246) * vec3(0.0500000007450580596923828125);
                            float _3106 = 18.0336780548095703125 / _816.lUniforms.mpCustomPerMesh.gSpaceScatteringParamsVec4.y;
                            _4312 = _3846 + (_3085 * exp(((-((((((((((exp2((1.0 - _3074) * _3106) + (exp2((1.0 - length(_4246 + (_3099 * 1.0))) * _3106) * 2.0)) + (exp2((1.0 - length(_4246 + (_3099 * 2.0))) * _3106) * 2.0)) + (exp2((1.0 - length(_4246 + (_3099 * 3.0))) * _3106) * 3.0)) + (exp2((1.0 - length(_4246 + (_3099 * 5.0))) * _3106) * 4.0)) + (exp2((1.0 - length(_4246 + (_3099 * 7.0))) * _3106) * 6.0)) + (exp2((1.0 - length(_4246 + (_3099 * 11.0))) * _3106) * 8.0)) + (exp2((1.0 - length(_4246 + (_3099 * 15.0))) * _3106) * 9.0)) + (exp2((1.0 - length(_4246 + (_3099 * 20.0))) * _3106) * 5.0)) * (length(_3099) * 0.5)) + _4248)) * _816.lUniforms.mpCustomPerMesh.gSpaceScatteringParamsVec4.w) * 12.56637096405029296875));
                        }
                        else
                        {
                            _4312 = _3846;
                        }
                        _4311 = _4312;
                    }
                    else
                    {
                        _4311 = _3846;
                    }
                }
                _3847 = _3846 * _2995;
            }
            else
            {
                _3847 = 0.0;
            }
            vec3 _3642 = _4396;
            _3642.x = pow(1.0, 2.2000000476837158203125);
            vec3 _1619 = _1568 - _1576;
            float _3320 = dot(normalize(_816.lUniforms.mpCustomPerMesh.gSunPositionVec4.xyz), _1619) / length(_1619);
            vec3 _1645 = _3834 * mix(1.0, smoothstep(0.100000001490116119384765625, 0.800000011920928955078125, (((_3642 * _816.lUniforms.mpCustomPerMesh.gSpaceSkyColourVec4.w) * (_816.lUniforms.mpCustomPerMesh.gSpaceScatteringParamsVec4.w * (0.75 * (1.0 + (_3320 * _3320))))) * vec3(isnan(_3847) ? 0.0 : _3847)).x * _816.lUniforms.mpCustomPerMesh.gSpaceScatteringParamsVec4.z), _1223);
            _3944 = _1645;
            _3900 = min(_3897, (_1645.x * 0.20000000298023223876953125) + 0.00999999977648258209228515625);
        }
        else
        {
            _3944 = vec3(0.0);
            _3900 = _3897;
        }
        float _1662 = mix(_3900, _1169, _1211);
        float _1666 = mix(_3900, _1151, _1211);
        vec3 _1677 = mix(clamp(_3935, vec3(0.0), vec3(1.0)), clamp(_3944, vec3(0.0), vec3(1.0)), vec3(_1666));
        float _1716 = mix(_816.lUniforms.mpCustomPerMesh.gSpaceScatteringParamsVec4.x, 4.0, _1223) / _3699;
        vec3 _1726 = _3689 - _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
        float _1730 = 1.08000004291534423828125 * _816.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
        float _4028;
        vec3 _4029;
        vec3 _4032;
        for (;;)
        {
            vec3 _3359 = _914 - _1726;
            float _3360 = length(_3359);
            vec3 _3364 = normalize(_3359);
            float _3367 = dot(_914, _3364);
            float _3368 = 2.0 * _3367;
            float _3381 = (_3368 * _3368) - (4.0 * (dot(_914, _914) - (_1730 * _1730)));
            if ((_3381 >= 0.0) && (_3360 != 0.0))
            {
                float _3390 = sqrt(_3381);
                float _3392 = _3367 * (-2.0);
                vec3 _3405 = _914 + (_3364 * (0.5 * (_3392 - _3390)));
                vec3 _3410 = _914 + (_3364 * (0.5 * (_3392 + _3390)));
                bool _3421 = max(length(_3410 - _1726), length(_3410 - _914)) > _3360;
                float _4411 = _3421 ? 2.0 : 1.0;
                bool _3437 = max(length(_3405 - _1726), length(_3405 - _914)) > _3360;
                float _4027;
                if (_3437)
                {
                    _4027 = _4411 + 2.0;
                }
                else
                {
                    _4027 = _4411;
                }
                _4032 = mix(_3405, _1726, bvec3(_3437));
                _4029 = mix(_3410, _914, bvec3(_3421));
                _4028 = _4027;
                break;
            }
            _4032 = _1726;
            _4029 = _914;
            _4028 = 0.0;
            break;
        }
        float _4072;
        vec4 _4155;
        if ((_4028 > 0.0) || _925)
        {
            float _1751 = length(_4032 - _4029);
            float _1758 = _1751 * mix(_816.lUniforms.mpCustomPerMesh.gFogParamsVec4.x, _1716, _1196);
            float _1771 = _1751 * _816.lUniforms.mpCustomPerMesh.gFogParamsVec4.z;
            vec3 _1786 = mix(_816.lUniforms.mpCustomPerMesh.gFogColourVec4.xyz, _1677.xyz, vec3(clamp(1.0 - (1.0 / exp(_1771 * _1771)), 0.0, _816.lUniforms.mpCustomPerMesh.gFogParamsVec4.w)));
            vec4 _3654 = vec4(_1786.x, _1786.y, _1786.z, vec4(0.0).w);
            _3654.w = max(0.0, clamp(1.0 - (1.0 / exp(_1758 * _1758)), 0.0, mix(_816.lUniforms.mpCustomPerMesh.gFogParamsVec4.y, 1.0, _1666)));
            _4155 = _3654;
            _4072 = _925 ? 0.0 : _1662;
        }
        else
        {
            _4155 = vec4(0.0);
            _4072 = _1662;
        }
        vec4 _4162;
        if ((_4072 > 0.0) && _933)
        {
            float _1807 = _3699 * 1.08000004291534423828125;
            float _4095;
            vec3 _4096;
            vec3 _4099;
            for (;;)
            {
                vec3 _3464 = _1121 - _4408;
                float _3465 = length(_3464);
                vec3 _3469 = normalize(_3464);
                float _3472 = dot(_1121, _3469);
                float _3473 = 2.0 * _3472;
                float _3486 = (_3473 * _3473) - (4.0 * (dot(_1121, _1121) - (_1807 * _1807)));
                if ((_3486 >= 0.0) && (_3465 != 0.0))
                {
                    float _3495 = sqrt(_3486);
                    float _3497 = _3472 * (-2.0);
                    vec3 _3510 = _1121 + (_3469 * (0.5 * (_3497 - _3495)));
                    vec3 _3515 = _1121 + (_3469 * (0.5 * (_3497 + _3495)));
                    bool _3526 = max(length(_3515 - _4408), length(_3515 - _1121)) > _3465;
                    float _4416 = _3526 ? 2.0 : 1.0;
                    bool _3542 = max(length(_3510 - _4408), length(_3510 - _1121)) > _3465;
                    float _4094;
                    if (_3542)
                    {
                        _4094 = _4416 + 2.0;
                    }
                    else
                    {
                        _4094 = _4416;
                    }
                    _4099 = mix(_3510, _4408, bvec3(_3542));
                    _4096 = mix(_3515, _1121, bvec3(_3526));
                    _4095 = _4094;
                    break;
                }
                _4099 = _4408;
                _4096 = _1121;
                _4095 = 0.0;
                break;
            }
            vec4 _4163;
            if (_4095 > 0.0)
            {
                vec4 _4164;
                if (length(_1242) <= _1807)
                {
                    float _1840 = length(_4096 - _4099) * _1716;
                    vec4 _3657 = vec4(_1677.x, _1677.y, _1677.z, vec4(0.0).w);
                    _3657.w = max(0.0, 1.0 - clamp(1.0 / exp(_1840 * _1840), 0.0, 1.0));
                    _4164 = _3657;
                }
                else
                {
                    _4164 = vec4(0.0);
                }
                _4163 = _4164;
            }
            else
            {
                _4163 = vec4(0.0);
            }
            _4162 = _4163;
        }
        else
        {
            _4162 = vec4(0.0);
        }
        vec4 _1863 = mix(_4155, _4162, vec4(_4072));
        vec4 _4191;
        if (_933)
        {
            float _1896 = length(_1242 - _1121);
            float _1900 = _1896 * _816.lUniforms.mpCustomPerMesh.gHeightFogParamsVec4.x;
            float _1931 = _1896 * _816.lUniforms.mpCustomPerMesh.gHeightFogColourVec4.w;
            float _1949 = clamp(((1.0 - clamp((length(_1242) - (_3699 + _816.lUniforms.mpCustomPerMesh.gWaterFogVec4.x)) / (_816.lUniforms.mpCustomPerMesh.gHeightFogParamsVec4.z + 9.9999997473787516355514526367188e-05), 0.0, 1.0)) * _816.lUniforms.mpCustomPerMesh.gHeightFogParamsVec4.w) * (1.0 - clamp(1.0 / exp(_816.lUniforms.mpCustomPerMesh.gHeightFogParamsVec4.y + (_1900 * _1900)), 0.0, 1.0)), 0.0, (1.0 - _1196) * _1202);
            vec3 _1958 = mix(_1863.xyz, _816.lUniforms.mpCustomPerMesh.gHeightFogColourVec4.xyz * _816.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz, vec3(clamp(_1949 - (1.0 - clamp(1.0 / exp(_816.lUniforms.mpCustomPerMesh.gHeightFogParamsVec4.y + (_1931 * _1931)), 0.0, 1.0)), 0.0, 1.0)));
            vec4 _3660 = vec4(_1958.x, _1958.y, _1958.z, _1863.w);
            _3660.w = max(_1863.w, _1949);
            _4191 = _3660;
        }
        else
        {
            _4191 = _1863;
        }
        vec4 _4204;
        if (_933)
        {
            vec4 _4205;
            if (_1122 < (_3699 + _816.lUniforms.mpCustomPerMesh.gWaterFogVec4.x))
            {
                vec4 _3662 = _4191;
                _3662.w = 1.0 - (_1202 * (1.0 - clamp((_1132 - 2000.0) * 0.001000000047497451305389404296875, 0.0, 1.0)));
                _4205 = _3662;
            }
            else
            {
                _4205 = _4191;
            }
            _4204 = _4205;
        }
        else
        {
            _4204 = _4191;
        }
        vec4 _4245;
        if ((clamp((_1132 - _816.lUniforms.mpCustomPerMesh.gFogFadeHeights2Vec4.x) / _816.lUniforms.mpCustomPerMesh.gFogFadeHeights2Vec4.y, 0.0, 1.0) > 0.0) && _933)
        {
            float _4231;
            float _4239;
            if (length(_4408) < (_3699 * 1.08000004291534423828125))
            {
                _4239 = _816.lUniforms.mpCustomPerMesh.gSpaceFogParamsVec4.z;
                _4231 = clamp(1.0 - length(_4204.xyz), 0.0, 1.0);
            }
            else
            {
                _4239 = _816.lUniforms.mpCustomPerMesh.gSpaceFogParamsVec4.y;
                _4231 = _1196;
            }
            float _2036 = length(_3716);
            float _2043 = _2036 * mix(_816.lUniforms.mpCustomPerMesh.gFogParamsVec4.x, _816.lUniforms.mpCustomPerMesh.gSpaceFogParamsVec4.x, _4231);
            float _2059 = clamp(clamp(1.0 - (1.0 / exp(_2043 * _2043)), 0.0, 1.0) * (_4072 * _1223), 0.0, _4239);
            vec4 _4244;
            if (_2059 > 0.0)
            {
                vec3 _4240;
                for (;;)
                {
                    float _3576 = dot(normalize(normalize(_3716)), normalize(_816.lUniforms.mpCustomPerMesh.gSunPositionVec4.xyz));
                    if (_3576 > 0.0)
                    {
                        _4240 = _816.lUniforms.mpCustomPerMesh.gSpaceSkyColour1Vec4.xyz + ((_816.lUniforms.mpCustomPerMesh.gSpaceSkyColour2Vec4.xyz - _816.lUniforms.mpCustomPerMesh.gSpaceSkyColour1Vec4.xyz) * pow(_3576, _816.lUniforms.mpCustomPerMesh.gSpaceSkyColour2Vec4.w));
                        break;
                    }
                    else
                    {
                        _4240 = _816.lUniforms.mpCustomPerMesh.gSpaceSkyColour1Vec4.xyz + ((_816.lUniforms.mpCustomPerMesh.gSpaceSkyColour3Vec4.xyz - _816.lUniforms.mpCustomPerMesh.gSpaceSkyColour1Vec4.xyz) * pow(abs(_3576), _816.lUniforms.mpCustomPerMesh.gSpaceSkyColour2Vec4.w));
                        break;
                    }
                }
                float _2120 = _2036 * _816.lUniforms.mpCustomPerMesh.gSpaceFogColourVec4.w;
                float _2136 = _2036 * _816.lUniforms.mpCustomPerMesh.gSpaceFogColour2Vec4.w;
                vec3 _2156 = mix(_4204.xyz, mix(_816.lUniforms.mpCustomPerMesh.gSpaceFogColour2Vec4.xyz, mix(_816.lUniforms.mpCustomPerMesh.gSpaceFogColourVec4.xyz, clamp(_4240, vec3(0.0), vec3(1.0)), vec3(1.0 - clamp(1.0 / exp(_2120 * _2120), 0.0, 1.0))), vec3(1.0 - clamp(1.0 / exp(_2136 * _2136), 0.0, 1.0))), vec3(clamp(_2059, 0.0, 1.0)));
                _4244 = vec4(_2156.x, _2156.y, _2156.z, _4204.w);
            }
            else
            {
                _4244 = _4204;
            }
            vec4 _3665 = _4244;
            _3665.w = max(_4244.w, _2059);
            _4245 = _3665;
        }
        else
        {
            _4245 = _4204;
        }
        if (_4245.w == 0.0)
        {
            discard;
        }
        vec3 _2175 = _4245.xyz / vec3(_4245.w);
        out_color0 = vec4(_2175.x, _2175.y, _2175.z, _4245.w);
        break;
    }
}


