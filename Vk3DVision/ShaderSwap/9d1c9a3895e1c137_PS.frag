#version 450
// lighting underwater
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

struct CustomPerMaterialUniforms
{
    vec4 gMaterialParamsVec4;
    vec4 gWaveScaleVec4;
    vec4 gWaveSpeedVec4;
    vec4 gWindDirectionVec4;
    vec4 gWaterSurfaceParamsVec4;
    vec4 gFresnelParamsVec4;
    vec4 gFoamParamsVec4;
    vec4 gFoamColourVec4;
    vec4 gSkyUpperColourVec4;
    vec4 gSkyColourVec4;
    vec4 gHorizonColourVec4;
    vec4 gSunColourVec4;
    vec4 gWaterColourBaseVec4;
    vec4 gWaterColourAddVec4;
    vec4 gWaterFogColourNearVec4;
    vec4 gWaterFogColourFarVec4;
    vec4 gWaterFogVec4;
    vec4 gHeightFogParamsVec4;
    vec4 gHeightFogColourVec4;
    vec4 gSpaceHorizonColourVec4;
    vec4 gFogColourVec4;
    vec4 gFogParamsVec4;
    vec4 gScatteringParamsVec4;
    vec4 gSpaceSkyColour1Vec4;
    vec4 gSpaceSkyColour2Vec4;
    vec4 gSpaceSkyColour3Vec4;
    vec4 gSpaceSkyColourVec4;
    vec4 gFogFadeHeightsVec4;
    vec4 gSunPositionVec4;
    vec4 gSpaceScatteringParamsVec4;
    vec4 gLightTopColourVec4;
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CommonPerMeshUniforms mpCommonPerMesh;
    CustomPerMaterialUniforms mpCustomPerMaterial;
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
} _978;

layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 0) uniform sampler3D gNoiseMap;
layout(set = 1, binding = 3) uniform sampler2D gFoamMap;
layout(set = 1, binding = 2) uniform sampler2D gReflectionMap;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _2928;
vec3 _2974;

void main()
{
    vec3 _989 = _978.lUniforms.mpPerFrame.gViewPositionVec3 - _978.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _990 = length(_989);
    if (clamp(((_990 - _978.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w) - 1000.0) * 0.00200000009499490261077880859375, 0.0, 1.0) >= 1.0)
    {
        discard;
    }
    vec2 _2881 = In.mTexCoordsVec2;
    _2881.x = (In.mTexCoordsVec2.x - _978.lUniforms.mpPerFrame.gVREyeInfoVec3.y) * _978.lUniforms.mpPerFrame.gVREyeInfoVec3.z;
    float _1688 = texture(gBuffer1Map, In.mTexCoordsVec2).x * _978.lUniforms.mpPerFrame.gClipPlanesVec4.y;
    float _3073 = (_1688 >= (_978.lUniforms.mpPerFrame.gClipPlanesVec4.y - 100.0)) ? 50000.0 : _1688;
    vec2 _1698 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
    float _1741 = _978.lUniforms.mpPerFrame.gClipPlanesVec4.x * _978.lUniforms.mpPerFrame.gClipPlanesVec4.y;
    float _1748 = _978.lUniforms.mpPerFrame.gClipPlanesVec4.y - _978.lUniforms.mpPerFrame.gClipPlanesVec4.x;
    vec4 _2889 = vec4(_1698.x, _1698.y, _2928.z, _2928.w);
    _2889.z = ((_1741 / _3073) - _978.lUniforms.mpPerFrame.gClipPlanesVec4.x) / _1748;
    
    _2889.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _2889.z * 10);
    
    vec4 _2891 = _2889;
    _2891.w = 1.0;
    vec4 _1708 = _978.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2891;
    float _1099 = _978.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _978.lUniforms.mpCustomPerMaterial.gWaterFogVec4.x;
    vec3 _1111 = ((_1708.xyz / vec3(_1708.w)).xyz + _978.lUniforms.mpPerFrame.gViewPositionVec3).xyz - _978.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    vec3 _1127 = _978.lUniforms.mpCustomPerMaterial.gWaterColourAddVec4.xyz * _978.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz;
    vec3 _1134 = _978.lUniforms.mpCustomPerMaterial.gWaterFogColourFarVec4.xyz * _978.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz;
    float _2932;
    vec3 _2933;
    for (;;)
    {
        vec3 _1769 = _989 - _1111;
        float _1770 = length(_1769);
        vec3 _1774 = normalize(_1769);
        float _1777 = dot(_989, _1774);
        float _1778 = 2.0 * _1777;
        float _1791 = (_1778 * _1778) - (4.0 * (dot(_989, _989) - (_1099 * _1099)));
        if ((_1791 >= 0.0) && (_1770 != 0.0))
        {
            float _1800 = sqrt(_1791);
            float _1802 = _1777 * (-2.0);
            vec3 _1815 = _989 + (_1774 * (0.5 * (_1802 - _1800)));
            vec3 _1820 = _989 + (_1774 * (0.5 * (_1802 + _1800)));
            float _3074 = (max(length(_1820 - _1111), length(_1820 - _989)) > _1770) ? 2.0 : 1.0;
            float _2931;
            if (max(length(_1815 - _1111), length(_1815 - _989)) > _1770)
            {
                _2931 = _3074 + 2.0;
            }
            else
            {
                _2931 = _3074;
            }
            _2933 = _1815;
            _2932 = _2931;
            break;
        }
        _2933 = _1111;
        _2932 = 0.0;
        break;
    }
    if (_2932 == 0.0)
    {
        discard;
    }
    if (_2932 == 1.0)
    {
        discard;
    }
    if (_2932 == 3.0)
    {
        discard;
    }
    vec3 _1175 = normalize(_2933);
    vec3 _1178 = _2933 - _1175;
    float _1182 = _1099 - _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x;
    vec3 _1189 = normalize(_1111 - _989);
    vec3 _1220 = _989 + (_1189 * 800.0);
    float _1225 = length(_1220) - _1182;
    vec3 _2982;
    float _2983;
    if ((_1225 - (_978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x)) > 0.0)
    {
        _2983 = 800.0;
        _2982 = _1178;
    }
    else
    {
        int _2939;
        float _2940;
        float _2965;
        vec3 _2966;
        vec3 _2979;
        float _2980;
        float _2981;
        float _1985;
        for (;;)
        {
            _1985 = 1.0 - clamp((length(_989 - _1220) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0);
            _2981 = _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x;
            _2980 = _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
            _2979 = _1220;
            _2940 = 0.0;
            _2939 = 0;
            for (; _2939 < 3; )
            {
                vec3 _1996 = vec3(_978.lUniforms.mpPerFrame.gfTime);
                vec3 _1997 = _2979 + _1996;
                vec3 _1999 = _1997 * _2980;
                vec3 _2005 = _2979 - _1996;
                vec3 _2007 = _2005 * _2980;
                float _2016 = ((textureLod(gNoiseMap, _1999, 0.0).y + textureLod(gNoiseMap, _2007, 0.0).y) * 0.5) * _2981;
                _2981 *= (0.2199999988079071044921875 * _1985);
                _2980 *= _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z;
                _2979 = mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2979;
                _2940 += _2016;
                _2939++;
                continue;
            }
            float _2035 = _1225 - _2940;
            if (_2035 < 0.0)
            {
                _2966 = _2974;
                _2965 = 800.0;
                break;
            }
            float _2943;
            vec3 _2962;
            _2962 = _989;
            _2943 = 0.0;
            int _2942 = 0;
            float _2963 = _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
            float _2964 = _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x;
            for (; _2942 < 3; )
            {
                vec3 _2077 = vec3(_978.lUniforms.mpPerFrame.gfTime);
                vec3 _2078 = _2962 + _2077;
                vec3 _2080 = _2078 * _2963;
                vec3 _2086 = _2962 - _2077;
                vec3 _2088 = _2086 * _2963;
                float _2097 = ((textureLod(gNoiseMap, _2080, 0.0).y + textureLod(gNoiseMap, _2088, 0.0).y) * 0.5) * _2964;
                _2964 *= (0.2199999988079071044921875 * (1.0 - clamp((length(_989 - _989) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0)));
                _2963 *= _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z;
                _2962 = mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2962;
                _2943 += _2097;
                _2942++;
                continue;
            }
            float _2945;
            vec3 _2975;
            _2945 = 0.0;
            _2975 = _2974;
            float _1937;
            vec3 _1942;
            bool _1953;
            float _2197;
            float _2955;
            int _2944 = 0;
            float _2946 = 0.0;
            float _2948 = 800.0;
            float _2951 = (_990 - _1182) - _2943;
            float _2952 = _2035;
            for (; _2944 < 8; _2197 = (length(_1942) - _1182) - _2955, _1953 = _2197 >= 0.0, _2952 = _1953 ? _2197 : _2952, _2951 = _1953 ? _2951 : _2197, _2948 = _1953 ? _1937 : _2948, _2946 = _1953 ? _2946 : _1937, _2945 = _1937, _2944++, _2975 = _1942)
            {
                _1937 = mix(_2946, _2948, _2951 / (_2951 - _2952));
                _1942 = _989 + (_1189 * _1937);
                vec3 _2959;
                _2959 = _1942;
                _2955 = 0.0;
                int _2954 = 0;
                float _2960 = _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
                float _2961 = _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x;
                for (; _2954 < 3; )
                {
                    vec3 _2158 = vec3(_978.lUniforms.mpPerFrame.gfTime);
                    vec3 _2159 = _2959 + _2158;
                    vec3 _2161 = _2159 * _2960;
                    vec3 _2167 = _2959 - _2158;
                    vec3 _2169 = _2167 * _2960;
                    float _2178 = ((textureLod(gNoiseMap, _2161, 0.0).y + textureLod(gNoiseMap, _2169, 0.0).y) * 0.5) * _2961;
                    _2961 *= (0.2199999988079071044921875 * (1.0 - clamp((length(_989 - _1942) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0)));
                    _2960 *= _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z;
                    _2959 = mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2959;
                    _2955 += _2178;
                    _2954++;
                    continue;
                }
            }
            _2966 = _2975;
            _2965 = _2945;
            break;
        }
        _2983 = _2965;
        _2982 = _2966;
    }
    vec3 _1271 = _2982 - _989;
    float _1294 = 1.0 - ((1.0 - clamp((_2983 - 300.0) * 0.00200000009499490261077880859375, 0.0, 1.0)) * smoothstep(0.0199999995529651641845703125, 0.119999997317790985107421875, abs(dot(_1175, -normalize(_1271)))));
    bool _1299 = (_2983 < 800.0) && (_1294 < 1.0);
    vec3 _3013;
    if (_1299)
    {
        float _1332 = max(dot(_1271, _1271) * (mix(0.100000001490116119384765625, _978.lUniforms.mpCustomPerMaterial.gWaterSurfaceParamsVec4.x, clamp(((_990 - _1099) - 20.0) * 0.00999999977648258209228515625, 0.0, 1.0)) * 0.001041666720993816852569580078125), _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.w);
        float _1334 = _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x * 0.5;
        vec3 _2333 = _2982 * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2335 = vec3(_978.lUniforms.mpPerFrame.gfTime * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y);
        vec3 _2358 = (mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2982) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        float _2390 = (length(_2982) - _1182) - (((textureLod(gNoiseMap, _2333 + _2335, 0.0).y + textureLod(gNoiseMap, _2333 - _2335, 0.0).y) + (((textureLod(gNoiseMap, (_2358 + _2335) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y + textureLod(gNoiseMap, (_2358 - _2335) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y) * (1.0 - clamp((length(_989 - _2982) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0))) * 0.2199999988079071044921875)) * _1334);
        vec3 _2255 = vec3(_2982.x + _1332, _2982.yz);
        vec3 _2418 = _2255 * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2443 = (mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2255) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2897 = _2974;
        _2897.x = ((length(_2255) - _1182) - (((textureLod(gNoiseMap, _2418 + _2335, 0.0).y + textureLod(gNoiseMap, _2418 - _2335, 0.0).y) + (((textureLod(gNoiseMap, (_2443 + _2335) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y + textureLod(gNoiseMap, (_2443 - _2335) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y) * (1.0 - clamp((length(_989 - _2255) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0))) * 0.2199999988079071044921875)) * _1334)) - _2390;
        vec3 _2274 = vec3(_2982.x, _2982.y + _1332, _2982.z);
        vec3 _2503 = _2274 * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2528 = (mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2274) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2902 = _2897;
        _2902.y = ((length(_2274) - _1182) - (((textureLod(gNoiseMap, _2503 + _2335, 0.0).y + textureLod(gNoiseMap, _2503 - _2335, 0.0).y) + (((textureLod(gNoiseMap, (_2528 + _2335) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y + textureLod(gNoiseMap, (_2528 - _2335) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y) * (1.0 - clamp((length(_989 - _2274) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0))) * 0.2199999988079071044921875)) * _1334)) - _2390;
        vec3 _2293 = vec3(_2982.xy, _2982.z + _1332);
        vec3 _2588 = _2293 * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2613 = (mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2293) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2907 = _2902;
        _2907.z = ((length(_2293) - _1182) - (((textureLod(gNoiseMap, _2588 + _2335, 0.0).y + textureLod(gNoiseMap, _2588 - _2335, 0.0).y) + (((textureLod(gNoiseMap, (_2613 + _2335) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y + textureLod(gNoiseMap, (_2613 - _2335) * _978.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y) * (1.0 - clamp((length(_989 - _2293) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0))) * 0.2199999988079071044921875)) * _1334)) - _2390;
        _3013 = normalize(_2907);
    }
    else
    {
        _3013 = _1175;
    }
    vec3 _1362 = vec3(_1294);
    vec3 _1364 = normalize(mix(_3013, _1175, _1362));
    vec3 _1369 = mix(mix(_1178, _2982, bvec3(_1299)), _1178, _1362);
    float _1395 = _978.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.x * 0.00999999977648258209228515625;
    vec2 _1405 = ((_978.lUniforms.mpCustomPerMaterial.gWindDirectionVec4.xy * _978.lUniforms.mpPerFrame.gfTime) * _978.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.z) * 0.100000001490116119384765625;
    vec3 _2656 = pow(abs(_1364), vec3(64.0));
    float _2689 = _2656.x;
    float _2693 = _2656.y;
    float _2698 = _2656.z;
    vec3 _1468 = reflect(normalize(-_978.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz), _1175);
    vec3 _1471 = -_1364;
    float _2729 = pow(clamp(1.0 - dot(_1471, -_1189), 0.0, 1.0), _978.lUniforms.mpCustomPerMaterial.gWaveSpeedVec4.x) * _978.lUniforms.mpCustomPerMaterial.gWaveSpeedVec4.y;
    float _2741 = pow(max(dot(reflect(_1189, _1471), _1468), 0.0), 120.0) * 10.0;
    float _2815 = length(_1369 - _989);
    float _2818 = _2815 * _978.lUniforms.mpCustomPerMaterial.gWaterFogVec4.y;
    float _2826 = 1.0 - clamp(1.0 / exp(_2818 * _2818), 0.0, 1.0);
    float _2829 = _2815 * _978.lUniforms.mpCustomPerMaterial.gWaterFogVec4.z;
    vec3 _2850 = mix(((mix((_978.lUniforms.mpCustomPerMaterial.gWaterColourBaseVec4.xyz * _978.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz) + ((_1127 * smoothstep(0.999000012874603271484375, 1.0, dot(_1471, _1468))) * 0.119999997317790985107421875), texture(gReflectionMap, (_2881 + ((vec2(((((texture(gFoamMap, (_1178.yz * _1395) + _1405).xyz * _2689) + (texture(gFoamMap, (_1178.zx * _1395) + _1405).xyz * _2693)) + (texture(gFoamMap, (_1178.xy * _1395) + _1405).xyz * _2698)) / vec3((_2689 + _2693) + _2698)).x) * 0.20000000298023223876953125) - vec2(0.100000001490116119384765625))) - (vec2(clamp((length(_1369 - _1178) - 1.0) * 0.0500000007450580596923828125, 0.0, 1.0)) * 0.0500000007450580596923828125)).xyz, vec3(_2729)).xyz + (((_1127 * (length(_1369) - (0.60000002384185791015625 + _1182))) * 0.180000007152557373046875) * max(1.0 - (dot(_1271, _1271) * 0.001000000047497451305389404296875), 0.0))).xyz + vec3(_2741)).xyz, mix(_978.lUniforms.mpCustomPerMaterial.gWaterFogColourNearVec4.xyz * _978.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz, _1134, vec3(clamp(1.0 - clamp(1.0 / exp(_2829 * _2829), 0.0, 1.0), 0.0, 1.0))), vec3(clamp(_2826, 0.0, 1.0)));
    float _2858 = max(clamp((_2729 + _2741) + _978.lUniforms.mpCustomPerMaterial.gWaveSpeedVec4.z, 0.0, 1.0), clamp(_2826 * 2.0, 0.0, 1.0));
    vec4 _2920 = vec4(_2850.x, _2850.y, _2850.z, _2928.w);
    _2920.w = _2858;
    vec4 _3054;
    if (_3073 >= 50000.0)
    {
        vec3 _1541 = mix(_1134, _2920.xyz, vec3(_2858));
        vec4 _2923 = vec4(_1541.x, _1541.y, _1541.z, _2920.w);
        _2923.w = 1.0;
        _3054 = _2923;
    }
    else
    {
        _3054 = _2920;
    }
    gl_FragDepth = ((_1741 / dot((_1369 + _978.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz) - _978.lUniforms.mpPerFrame.gViewPositionVec3, -normalize(_978.lUniforms.mpPerFrame.gCameraMat4[2].xyz))) - _978.lUniforms.mpPerFrame.gClipPlanesVec4.x) / _1748;
    out_color0 = _3054;
}


