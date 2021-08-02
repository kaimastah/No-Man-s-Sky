#version 450
// lighting on water
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
} _1024;

layout(set = 1, binding = 4) uniform sampler2D gFoamHeightMap;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 0) uniform sampler3D gNoiseMap;
layout(set = 1, binding = 3) uniform sampler2D gFoamMap;
layout(set = 1, binding = 2) uniform sampler2D gReflectionMap;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _3502;
vec3 _3548;

void main()
{
    vec3 _1035 = _1024.lUniforms.mpPerFrame.gViewPositionVec3 - _1024.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _1036 = length(_1035);
    if (clamp(((_1036 - _1024.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w) - 1000.0) * 0.00200000009499490261077880859375, 0.0, 1.0) >= 1.0)
    {
        discard;
    }
    vec2 _3416 = In.mTexCoordsVec2;
    _3416.x = (In.mTexCoordsVec2.x - _1024.lUniforms.mpPerFrame.gVREyeInfoVec3.y) * _1024.lUniforms.mpPerFrame.gVREyeInfoVec3.z;
    float _1930 = texture(gBuffer1Map, In.mTexCoordsVec2).x * _1024.lUniforms.mpPerFrame.gClipPlanesVec4.y;
    float _3657 = (_1930 >= (_1024.lUniforms.mpPerFrame.gClipPlanesVec4.y - 100.0)) ? 50000.0 : _1930;
    vec2 _1940 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
    float _1983 = _1024.lUniforms.mpPerFrame.gClipPlanesVec4.x * _1024.lUniforms.mpPerFrame.gClipPlanesVec4.y;
    float _1990 = _1024.lUniforms.mpPerFrame.gClipPlanesVec4.y - _1024.lUniforms.mpPerFrame.gClipPlanesVec4.x;
    vec4 _3424 = vec4(_1940.x, _1940.y, _3502.z, _3502.w);
    _3424.z = ((_1983 / _3657) - _1024.lUniforms.mpPerFrame.gClipPlanesVec4.x) / _1990;
    
    _3424.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _3424.z * 10);
    
    vec4 _3426 = _3424;
    _3426.w = 1.0;
    vec4 _1950 = _1024.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _3426;
    float _1144 = _1024.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _1024.lUniforms.mpCustomPerMaterial.gWaterFogVec4.x;
    vec3 _1156 = ((_1950.xyz / vec3(_1950.w)).xyz + _1024.lUniforms.mpPerFrame.gViewPositionVec3).xyz - _1024.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    vec3 _1172 = _1024.lUniforms.mpCustomPerMaterial.gWaterColourAddVec4.xyz * _1024.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz;
    float _3506;
    vec3 _3507;
    for (;;)
    {
        vec3 _2011 = _1035 - _1156;
        float _2012 = length(_2011);
        vec3 _2016 = normalize(_2011);
        float _2019 = dot(_1035, _2016);
        float _2020 = 2.0 * _2019;
        float _2033 = (_2020 * _2020) - (4.0 * (dot(_1035, _1035) - (_1144 * _1144)));
        if ((_2033 >= 0.0) && (_2012 != 0.0))
        {
            float _2042 = sqrt(_2033);
            float _2044 = _2019 * (-2.0);
            vec3 _2057 = _1035 + (_2016 * (0.5 * (_2044 - _2042)));
            vec3 _2062 = _1035 + (_2016 * (0.5 * (_2044 + _2042)));
            float _3658 = (max(length(_2062 - _1156), length(_2062 - _1035)) > _2012) ? 2.0 : 1.0;
            float _3505;
            if (max(length(_2057 - _1156), length(_2057 - _1035)) > _2012)
            {
                _3505 = _3658 + 2.0;
            }
            else
            {
                _3505 = _3658;
            }
            _3507 = _2062;
            _3506 = _3505;
            break;
        }
        _3507 = _1035;
        _3506 = 0.0;
        break;
    }
    if (_3506 == 0.0)
    {
        discard;
    }
    if (_3506 == 2.0)
    {
        discard;
    }
    vec3 _1214 = normalize(_3507);
    vec3 _1217 = _3507 - _1214;
    float _1221 = _1144 - _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x;
    vec3 _1228 = normalize(_1156 - _1035);
    vec3 _1258 = _1035 + (_1228 * 800.0);
    float _1263 = length(_1258) - _1221;
    float _1267 = _1263 - (_1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x);
    vec3 _3556;
    float _3557;
    if (_1267 > 0.0)
    {
        _3557 = 800.0;
        _3556 = _1217;
    }
    else
    {
        float _1290 = _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x * 0.5;
        int _3514;
        float _3515;
        float _3539;
        vec3 _3540;
        vec3 _3553;
        float _3554;
        float _3555;
        float _2236;
        for (;;)
        {
            _2236 = 1.0 - clamp((length(_1035 - _1258) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0);
            _3555 = _1290;
            _3554 = _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
            _3553 = _1258;
            _3515 = 0.0;
            _3514 = 0;
            for (; _3514 < 2; )
            {
                vec3 _2247 = vec3(_1024.lUniforms.mpPerFrame.gfTime);
                vec3 _2248 = _3553 + _2247;
                vec3 _2250 = _2248 * _3554;
                vec3 _2256 = _3553 - _2247;
                vec3 _2258 = _2256 * _3554;
                float _2267 = ((textureLod(gNoiseMap, _2250, 0.0).y + textureLod(gNoiseMap, _2258, 0.0).y) * 0.5) * _3555;
                _3555 *= (0.2199999988079071044921875 * _2236);
                _3554 *= _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z;
                _3553 = mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _3553;
                _3515 += _2267;
                _3514++;
                continue;
            }
            float _2286 = _1263 - _3515;
            if (_2286 > 0.0)
            {
                _3540 = _3548;
                _3539 = 800.0;
                break;
            }
            float _3518;
            vec3 _3536;
            _3536 = _1035;
            _3518 = 0.0;
            int _3517 = 0;
            float _3537 = _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
            float _3538 = _1290;
            for (; _3517 < 2; )
            {
                vec3 _2328 = vec3(_1024.lUniforms.mpPerFrame.gfTime);
                vec3 _2329 = _3536 + _2328;
                vec3 _2331 = _2329 * _3537;
                vec3 _2337 = _3536 - _2328;
                vec3 _2339 = _2337 * _3537;
                float _2348 = ((textureLod(gNoiseMap, _2331, 0.0).y + textureLod(gNoiseMap, _2339, 0.0).y) * 0.5) * _3538;
                _3538 *= (0.2199999988079071044921875 * (1.0 - clamp((length(_1035 - _1035) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0)));
                _3537 *= _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z;
                _3536 = mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _3536;
                _3518 += _2348;
                _3517++;
                continue;
            }
            float _3520;
            float _3522;
            float _3525;
            float _3526;
            vec3 _3549;
            _3526 = _2286;
            _3525 = (_1036 - _1221) - _3518;
            _3522 = 800.0;
            _3520 = 0.0;
            _3549 = _3548;
            float _2180;
            vec3 _2185;
            bool _2196;
            float _2448;
            float _3529;
            for (int _3519 = 0; _3519 < int(min(max(8.0 - log(max(0.0, _1267 + 800.0) * 0.319999992847442626953125), 1.0), 8.0)); _2448 = (length(_2185) - _1221) - _3529, _2196 = _2448 < 0.0, _3526 = _2196 ? _2448 : _3526, _3525 = _2196 ? _3525 : _2448, _3522 = _2196 ? _2180 : _3522, _3520 = _2196 ? _3520 : _2180, _3519++, _3549 = _2185)
            {
                _2180 = mix(_3520, _3522, _3525 / (_3525 - _3526));
                _2185 = _1035 + (_1228 * _2180);
                vec3 _3533;
                _3533 = _2185;
                _3529 = 0.0;
                int _3528 = 0;
                float _3534 = _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
                float _3535 = _1290;
                for (; _3528 < 2; )
                {
                    vec3 _2409 = vec3(_1024.lUniforms.mpPerFrame.gfTime);
                    vec3 _2410 = _3533 + _2409;
                    vec3 _2412 = _2410 * _3534;
                    vec3 _2418 = _3533 - _2409;
                    vec3 _2420 = _2418 * _3534;
                    float _2429 = ((textureLod(gNoiseMap, _2412, 0.0).y + textureLod(gNoiseMap, _2420, 0.0).y) * 0.5) * _3535;
                    _3535 *= (0.2199999988079071044921875 * (1.0 - clamp((length(_1035 - _2185) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0)));
                    _3534 *= _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z;
                    _3533 = mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _3533;
                    _3529 += _2429;
                    _3528++;
                    continue;
                }
            }
            _3540 = _3549;
            _3539 = mix(_3520, _3522, _3525 / (_3525 - _3526));
            break;
        }
        _3557 = _3539;
        _3556 = _3540;
    }
    vec3 _1312 = _3556 - _1035;
    float _1330 = smoothstep(0.0199999995529651641845703125, 0.119999997317790985107421875, abs(dot(_1214, -normalize(_1312))));
    float _1335 = 1.0 - ((1.0 - clamp((_3557 - 300.0) * 0.00200000009499490261077880859375, 0.0, 1.0)) * _1330);
    bool _1340 = (_3557 < 800.0) && (_1335 < 1.0);
    vec3 _3587;
    if (_1340)
    {
        float _1373 = max(dot(_1312, _1312) * (mix(0.100000001490116119384765625, _1024.lUniforms.mpCustomPerMaterial.gWaterSurfaceParamsVec4.x, clamp(((_1036 - _1144) - 20.0) * 0.00999999977648258209228515625, 0.0, 1.0)) * 0.001041666720993816852569580078125), _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.w);
        float _1375 = _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.x * 0.5;
        vec3 _2584 = _3556 * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2586 = vec3(_1024.lUniforms.mpPerFrame.gfTime * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y);
        vec3 _2609 = (mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _3556) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        float _2641 = (length(_3556) - _1221) - (((textureLod(gNoiseMap, _2584 + _2586, 0.0).y + textureLod(gNoiseMap, _2584 - _2586, 0.0).y) + (((textureLod(gNoiseMap, (_2609 + _2586) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y + textureLod(gNoiseMap, (_2609 - _2586) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y) * (1.0 - clamp((length(_1035 - _3556) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0))) * 0.2199999988079071044921875)) * _1375);
        vec3 _2506 = vec3(_3556.x + _1373, _3556.yz);
        vec3 _2669 = _2506 * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2694 = (mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2506) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _3432 = _3548;
        _3432.x = ((length(_2506) - _1221) - (((textureLod(gNoiseMap, _2669 + _2586, 0.0).y + textureLod(gNoiseMap, _2669 - _2586, 0.0).y) + (((textureLod(gNoiseMap, (_2694 + _2586) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y + textureLod(gNoiseMap, (_2694 - _2586) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y) * (1.0 - clamp((length(_1035 - _2506) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0))) * 0.2199999988079071044921875)) * _1375)) - _2641;
        vec3 _2525 = vec3(_3556.x, _3556.y + _1373, _3556.z);
        vec3 _2754 = _2525 * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2779 = (mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2525) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _3437 = _3432;
        _3437.y = ((length(_2525) - _1221) - (((textureLod(gNoiseMap, _2754 + _2586, 0.0).y + textureLod(gNoiseMap, _2754 - _2586, 0.0).y) + (((textureLod(gNoiseMap, (_2779 + _2586) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y + textureLod(gNoiseMap, (_2779 - _2586) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y) * (1.0 - clamp((length(_1035 - _2525) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0))) * 0.2199999988079071044921875)) * _1375)) - _2641;
        vec3 _2544 = vec3(_3556.xy, _3556.z + _1373);
        vec3 _2839 = _2544 * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _2864 = (mat3(vec3(0.0, 1.60000002384185791015625, 1.2000000476837158203125), vec3(-1.60000002384185791015625, 0.7200000286102294921875, -0.959999978542327880859375), vec3(-1.2000000476837158203125, -0.959999978542327880859375, 1.2799999713897705078125)) * _2544) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.y;
        vec3 _3442 = _3437;
        _3442.z = ((length(_2544) - _1221) - (((textureLod(gNoiseMap, _2839 + _2586, 0.0).y + textureLod(gNoiseMap, _2839 - _2586, 0.0).y) + (((textureLod(gNoiseMap, (_2864 + _2586) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y + textureLod(gNoiseMap, (_2864 - _2586) * _1024.lUniforms.mpCustomPerMaterial.gFresnelParamsVec4.z, 0.0).y) * (1.0 - clamp((length(_1035 - _2544) - 30.0) * 0.0199999995529651641845703125, 0.0, 1.0))) * 0.2199999988079071044921875)) * _1375)) - _2641;
        _3587 = normalize(_3442);
    }
    else
    {
        _3587 = _1214;
    }
    vec3 _1398 = normalize(-_1024.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz);
    vec3 _1402 = vec3(_1335);
    vec3 _1404 = normalize(mix(_3587, _1214, _1402));
    vec3 _1409 = mix(mix(_1217, _3556, bvec3(_1340)), _1217, _1402);
    float _1421 = dot((_1409 + _1024.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz) - _1024.lUniforms.mpPerFrame.gViewPositionVec3, -normalize(_1024.lUniforms.mpPerFrame.gCameraMat4[2].xyz));
    if (_1421 > _3657)
    {
        discard;
    }
    float _1443 = _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.x * 0.00999999977648258209228515625;
    vec2 _1452 = (_1024.lUniforms.mpCustomPerMaterial.gWindDirectionVec4.xy * _1024.lUniforms.mpPerFrame.gfTime) * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.z;
    vec2 _1453 = _1452 * 0.100000001490116119384765625;
    vec3 _2907 = pow(abs(_1404), vec3(64.0));
    vec2 _2909 = _1217.yz;
    vec2 _2915 = _1217.zx;
    vec2 _2921 = _1217.xy;
    float _2940 = _2907.x;
    float _2944 = _2907.y;
    float _2949 = _2907.z;
    float _2980 = pow(clamp(1.0 - dot(_1404, -_1228), 0.0, 1.0), _1024.lUniforms.mpCustomPerMaterial.gWaveScaleVec4.x) * _1024.lUniforms.mpCustomPerMaterial.gWaveScaleVec4.y;
    float _2992 = pow(max(dot(reflect(_1228, _1404), _1398), 0.0), 120.0) * 10.0;
    vec3 _3006 = mix((_1024.lUniforms.mpCustomPerMaterial.gWaterColourBaseVec4.xyz * _1024.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz) + ((_1172 * smoothstep(0.999000012874603271484375, 1.0, dot(_1404, _1398))) * 0.119999997317790985107421875), texture(gReflectionMap, (_3416 + ((vec2(((((texture(gFoamMap, (_2909 * _1443) + _1453).xyz * _2940) + (texture(gFoamMap, (_2915 * _1443) + _1453).xyz * _2944)) + (texture(gFoamMap, (_2921 * _1443) + _1453).xyz * _2949)) / vec3((_2940 + _2944) + _2949)).x) * 0.0599999986588954925537109375) - vec2(0.02999999932944774627685546875))) - (vec2(clamp((length(_1409 - _1217) - 1.0) * 0.0500000007450580596923828125, 0.0, 1.0)) * 0.0500000007450580596923828125)).xyz, vec3(_2980));
    float _3014 = clamp((_2980 + _2992) + _1024.lUniforms.mpCustomPerMaterial.gWaveScaleVec4.z, 0.0, 1.0);
    vec4 _3452 = vec4(_3006.x, _3006.y, _3006.z, _3502.w);
    _3452.w = _3014;
    vec3 _3042 = (_3452.xyz + (((_1172 * (length(_1409) - (0.60000002384185791015625 + _1221))) * 0.180000007152557373046875) * max(1.0 - (dot(_1312, _1312) * 0.001000000047497451305389404296875), 0.0))).xyz + vec3(_2992);
    vec4 _3044 = vec4(_3042.x, _3042.y, _3042.z, _3452.w);
    vec4 _3631;
    if (_1330 > 0.0)
    {
        vec3 _3056 = pow(abs(_1214), vec3(64.0));
        float _3089 = _3056.x;
        float _3093 = _3056.y;
        float _3098 = _3056.z;
        vec3 _3109 = vec3((_3089 + _3093) + _3098);
        vec2 _1561 = (vec2(((((texture(gFoamMap, (_2909 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.x) + _1452).xyz * _3089) + (texture(gFoamMap, (_2915 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.x) + _1452).xyz * _3093)) + (texture(gFoamMap, (_2921 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.x) + _1452).xyz * _3098)) / _3109).x) * 0.07999999821186065673828125) - vec2(0.039999999105930328369140625);
        vec2 _1562 = _3416 + _1561;
        vec2 _3463 = _1562;
        _3463.x = (_1562.x / _1024.lUniforms.mpPerFrame.gVREyeInfoVec3.z) + _1024.lUniforms.mpPerFrame.gVREyeInfoVec3.y;
        vec4 _1575 = texture(gBuffer1Map, _3463);
        vec2 _1592 = _3416 - _1561;
        vec2 _3470 = _1592;
        _3470.x = (_1592.x / _1024.lUniforms.mpPerFrame.gVREyeInfoVec3.z) + _1024.lUniforms.mpPerFrame.gVREyeInfoVec3.y;
        vec4 _1605 = texture(gBuffer1Map, _3470);
        float _1615 = min(_1575.x * _1024.lUniforms.mpPerFrame.gClipPlanesVec4.y, _1605.x * _1024.lUniforms.mpPerFrame.gClipPlanesVec4.y);
        float _1629 = ((clamp((max(_1615, _1421) - 5.0) * 0.5, 0.0, 1.0) * 0.800000011920928955078125) + 0.20000000298023223876953125) * _1330;
        vec4 _3632;
        if (_1629 > 0.0)
        {
            float _1644 = _3657 - _1421;
            float _3629;
            if (_1615 < _1421)
            {
                _3629 = 1.0 - clamp(_1644 * 0.125, 0.0, 1.0);
            }
            else
            {
                _3629 = 1.0 - clamp((_1615 - _1421) * 0.125, 0.0, 1.0);
            }
            vec2 _3167 = (_1024.lUniforms.mpCustomPerMaterial.gWindDirectionVec4.xy * _1024.lUniforms.mpPerFrame.gfTime) * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.z;
            vec2 _3173 = (_1024.lUniforms.mpCustomPerMaterial.gWindDirectionVec4.zw * _1024.lUniforms.mpPerFrame.gfTime) * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.w;
            float _3201 = 1.0 - ((((texture(gFoamHeightMap, (_2909 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.x) + _3167).xyz * _3089) + (texture(gFoamHeightMap, (_2915 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.x) + _3167).xyz * _3093)) + (texture(gFoamHeightMap, (_2921 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.x) + _3167).xyz * _3098)) / _3109).x;
            float _3205 = ((1.0 - ((((texture(gFoamHeightMap, (_2909 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.y) + _3173).xyz * _3089) + (texture(gFoamHeightMap, (_2915 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.y) + _3173).xyz * _3093)) + (texture(gFoamHeightMap, (_2921 * _1024.lUniforms.mpCustomPerMaterial.gFoamParamsVec4.y) + _3173).xyz * _3098)) / _3109).x) + _3201) * 0.5;
            vec3 _1762 = _3042.xyz + ((_1024.lUniforms.mpCustomPerMaterial.gFoamColourVec4 * min((smoothstep(clamp(_3205 - 0.1500000059604644775390625, 0.0, 1.0), _3205 + 0.1500000059604644775390625, _3629) + pow(_3629, 10.0)) * _3201, 1.0)).xyz * _1629).xyz;
            vec4 _3494 = vec4(_1762.x, _1762.y, _1762.z, _3452.w);
            _3494.w = min(_3014, min(pow(clamp(_1644, 0.0, 1.0), 10.0), 1.0));
            _3632 = _3494;
        }
        else
        {
            _3632 = _3044;
        }
        _3631 = _3632;
    }
    else
    {
        _3631 = _3044;
    }
    vec4 _1774 = clamp(_3631, vec4(0.0), vec4(1.0));
    vec4 _3636;
    if (_3657 >= 50000.0)
    {
        vec3 _1785 = mix(_1024.lUniforms.mpCustomPerMaterial.gWaterFogColourFarVec4.xyz * _1024.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz, _1774.xyz, vec3(_1774.w));
        vec4 _3497 = vec4(_1785.x, _1785.y, _1785.z, _1774.w);
        _3497.w = 1.0;
        _3636 = _3497;
    }
    else
    {
        _3636 = _1774;
    }
    gl_FragDepth = ((_1983 / _1421) - _1024.lUniforms.mpPerFrame.gClipPlanesVec4.x) / _1990;
    out_color0 = _3636;
}


