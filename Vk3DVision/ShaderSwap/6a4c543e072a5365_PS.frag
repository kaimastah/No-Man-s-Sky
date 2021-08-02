#version 450
// anomaly banner
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
    float gfFadeValue;
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
    vec4 gImposterDataVec4;
    vec4 gTileBlendScalesVec4;
    vec4 gHueOverlayParamsVec4;
    vec4 gSaturationOverlayParamsVec4;
    vec4 gValueOverlayParamsVec4;
    vec4 gTerrainColour1Vec4;
    vec4 gTerrainColour2Vec4;
    vec4 gMaterialParamsVec4;
    vec4 gMaterialColourVec4;
    vec4 gMaterialSFXVec4;
    vec4 gMaterialSFXColVec4;
    vec4 gSunPositionVec4;
    vec4 gAverageColour1Vec4;
    vec4 gAverageColour2Vec4;
    vec4 gRecolour1Vec4;
    vec4 gRecolour2Vec4;
    vec4 gSkyColourVec4;
    vec4 gHorizonColourVec4;
    vec4 gSunColourVec4;
    vec4 gWaterFogColourNearVec4;
    vec4 gWaterFogColourFarVec4;
    vec4 gWaterFogVec4;
    vec4 gHeightFogParamsVec4;
    vec4 gHeightFogColourVec4;
    vec4 gSpaceHorizonColourVec4;
    vec4 gFogColourVec4;
    vec4 gFogParamsVec4;
    vec4 gScatteringParamsVec4;
    vec4 gFogFadeHeightsVec4;
    vec4 gSpaceScatteringParamsVec4;
    vec4 gSkyUpperColourVec4;
    vec4 gLightTopColourVec4;
};

struct CustomPerMeshUniforms
{
    vec4 gUVScrollStepVec4;
    vec4 gCustomParams01Vec4;
    vec4 gCustomParams02Vec4;
    vec4 gObjectColourVec4;
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CommonPerMeshUniforms mpCommonPerMesh;
    CustomPerMaterialUniforms mpCustomPerMaterial;
    CustomPerMeshUniforms mpCustomPerMesh;
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
} _1576;

layout(set = 1, binding = 1) uniform sampler2D gCausticMap;
layout(set = 1, binding = 2) uniform sampler2D gCausticOffsetMap;
layout(set = 1, binding = 0) uniform sampler2D gDiffuseMap;

layout(location = 0) in VertexBlock
{
    vec4 mTexCoordsVec4;
    vec4 mWorldPositionVec3_mfSpare;
    vec4 mScreenSpacePositionVec4;
    flat vec3 mfFadeValueForInstance_mfLodIndex_mfShearMotionLength;
} In;

layout(location = 0) out vec4 out_color0;

vec3 _4084;

void main()
{

vec4 tex = In.mTexCoordsVec4;
tex.x += vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * vk3d_params.custom_params.w) * 0.5;

    vec4 _1541 = texture(gDiffuseMap, tex.xy);
    float _2121 = _1541.x;
    float _2138 = (_2121 < 0.0) ? (-1.0) : 1.0;
    float _2141 = _2121 * _2138;
    float _4018;
    if (_2141 > 1.0)
    {
        _4018 = pow(_2141, 2.400000095367431640625);
    }
    else
    {
        float _4019;
        if (_2141 > 0.0)
        {
            _4019 = pow(_2141, 2.2000000476837158203125);
        }
        else
        {
            _4019 = _2141;
        }
        _4018 = _4019;
    }
    vec3 _3924 = _4084;
    _3924.x = _4018 * _2138;
    float _2125 = _1541.y;
    float _2164 = (_2125 < 0.0) ? (-1.0) : 1.0;
    float _2167 = _2125 * _2164;
    float _4023;
    if (_2167 > 1.0)
    {
        _4023 = pow(_2167, 2.400000095367431640625);
    }
    else
    {
        float _4024;
        if (_2167 > 0.0)
        {
            _4024 = pow(_2167, 2.2000000476837158203125);
        }
        else
        {
            _4024 = _2167;
        }
        _4023 = _4024;
    }
    vec3 _3927 = _3924;
    _3927.y = _4023 * _2164;
    float _2129 = _1541.z;
    float _2190 = (_2129 < 0.0) ? (-1.0) : 1.0;
    float _2193 = _2129 * _2190;
    float _4027;
    if (_2193 > 1.0)
    {
        _4027 = pow(_2193, 2.400000095367431640625);
    }
    else
    {
        float _4028;
        if (_2193 > 0.0)
        {
            _4028 = pow(_2193, 2.2000000476837158203125);
        }
        else
        {
            _4028 = _2193;
        }
        _4027 = _4028;
    }
    vec3 _3930 = _3927;
    _3930.z = _4027 * _2190;
    vec4 _3933 = vec4(_3930.x, _3930.y, _3930.z, _1541.w);
    _3933.w = 1.0 - _1541.w;
    vec3 _2224 = _3933.xyz * mat3(vec3(0.7767217159271240234375, 0.1715466976165771484375, 0.0518387891352176666259765625), vec3(0.0330350138247013092041015625, 0.9576499462127685546875, 0.00929595343768596649169921875), vec3(0.01708533428609371185302734375, 0.072395719587802886962890625, 0.9103014469146728515625));
    vec4 _4045;
    if (_1576.lUniforms.mpCustomPerMaterial.gWaterFogVec4.x > 0.0)
    {
        vec3 _2290 = _1576.lUniforms.mpPerFrame.gViewPositionVec3 - _1576.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
        float _2291 = length(_2290);
        float _2294 = _2291 - _1576.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
        float _2298 = clamp((_2294 - 700.0) * 0.004999999888241291046142578125, 0.0, 1.0);
        vec3 _2313 = In.mWorldPositionVec3_mfSpare.xyz - _1576.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
        float _2325 = _1576.lUniforms.mpCustomPerMaterial.gWaterFogVec4.x + _1576.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
        vec3 _2327 = _2224.xyz;
        vec3 _2453 = normalize(_2313) * _2325;
        float _2456 = length(_2313);
        vec3 _4037;
        if ((_2325 - _2456) >= 0.0)
        {
            vec2 _2471 = vec2((_1576.lUniforms.mpPerFrame.gfTime * 0.014999999664723873138427734375) + 7.0, _1576.lUniforms.mpPerFrame.gfTime * (-0.014999999664723873138427734375));
            vec3 _2541 = pow(abs(vec3(0.0, 1.0, 0.0)), vec3(64.0));
            float _2574 = _2541.x;
            float _2578 = _2541.y;
            float _2583 = _2541.z;
            vec3 _2594 = vec3((_2574 + _2578) + _2583);
            vec3 _2595 = (((texture(gCausticOffsetMap, (_2313.yz * 0.00999999977648258209228515625) + _2471).xyz * _2574) + (texture(gCausticOffsetMap, (_2313.zx * 0.00999999977648258209228515625) + _2471).xyz * _2578)) + (texture(gCausticOffsetMap, (_2313.xy * 0.00999999977648258209228515625) + _2471).xyz * _2583)) / _2594;
            float _2476 = _2595.y;
            vec2 _2480 = vec2(_2476, 1.0 - _2476);
            vec2 _2490 = (_2480 * 0.0599999986588954925537109375) + vec2(_1576.lUniforms.mpPerFrame.gfTime * 0.0074999998323619365692138671875, (_1576.lUniforms.mpPerFrame.gfTime * 0.00624999962747097015380859375) + 7.0);
            vec2 _2608 = _2453.yz;
            vec2 _2614 = _2453.zx;
            vec2 _2620 = _2453.xy;
            vec2 _2510 = (_2480 * 0.0500000007450580596923828125) + vec2((_1576.lUniforms.mpPerFrame.gfTime * 0.004999999888241291046142578125) + 5.0, _1576.lUniforms.mpPerFrame.gfTime * (-0.00624999962747097015380859375));
            _4037 = _2327 * vec3(((((((texture(gCausticMap, (_2608 * 0.039999999105930328369140625) + _2490).xyz * _2574) + (texture(gCausticMap, (_2614 * 0.039999999105930328369140625) + _2490).xyz * _2578)) + (texture(gCausticMap, (_2620 * 0.039999999105930328369140625) + _2490).xyz * _2583)) / _2594).y + ((((texture(gCausticMap, (_2608 * 0.02999999932944774627685546875) + _2510).xyz * _2574) + (texture(gCausticMap, (_2614 * 0.02999999932944774627685546875) + _2510).xyz * _2578)) + (texture(gCausticMap, (_2620 * 0.02999999932944774627685546875) + _2510).xyz * _2583)) / _2594).y) * 1.2999999523162841796875) + 0.60000002384185791015625);
        }
        else
        {
            _4037 = _2327;
        }
        vec3 _2381 = mix(mix(_2327, _4037, vec3(1.0 - clamp(_2456 - (_2325 - 2.0), 0.0, 1.0))), _2327, vec3(max(_2298, clamp((length(_1576.lUniforms.mpPerFrame.gViewPositionVec3 - In.mWorldPositionVec3_mfSpare.xyz) - 200.0) * 0.00999999977648258209228515625, 0.0, 1.0)))).xyz;
        float _2815 = _1576.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _1576.lUniforms.mpCustomPerMaterial.gWaterFogVec4.x;
        bool _2816 = _2291 <= _2815;
        bool _2826;
        if (!_2816)
        {
            _2826 = _2456 <= _2815;
        }
        else
        {
            _2826 = _2816;
        }
        vec3 _4040;
        if (_2826)
        {
            float _2840 = length(_2313 - _2290);
            float _2843 = _2840 * _1576.lUniforms.mpCustomPerMaterial.gWaterFogVec4.y;
            float _2854 = _2840 * _1576.lUniforms.mpCustomPerMaterial.gWaterFogVec4.z;
            float _2865 = _2840 * _1576.lUniforms.mpCustomPerMaterial.gWaterFogVec4.w;
            float _4039;
            if (_2291 > _2815)
            {
                _4039 = 1.0 - clamp(_2456 - (_2815 - 1.0), 0.0, 1.0);
            }
            else
            {
                _4039 = 1.0;
            }
            _4040 = mix(mix(_2381, _2381 * _1576.lUniforms.mpCustomPerMaterial.gWaterFogColourNearVec4.xyz, vec3((_4039 * (1.0 - clamp((_2294 - 250.0) * 0.004999999888241291046142578125, 0.0, 1.0))) * (1.0 - clamp(1.0 / exp(_2865 * _2865), 1.0 - _1576.lUniforms.mpCustomPerMaterial.gWaterFogColourNearVec4.w, 1.0)))), mix(_1576.lUniforms.mpCustomPerMaterial.gWaterFogColourNearVec4.xyz, _1576.lUniforms.mpCustomPerMaterial.gWaterFogColourFarVec4.xyz, vec3(clamp(1.0 - clamp(1.0 / exp(_2854 * _2854), 0.0, 1.0), 0.0, 1.0))) * _1576.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz, vec3(clamp((_4039 * (1.0 - _2298)) * (1.0 - clamp(1.0 / exp(_2843 * _2843), 0.0, 1.0)), 0.0, 1.0)));
        }
        else
        {
            _4040 = _2381;
        }
        _4045 = vec4(_4040.x, _4040.y, _4040.z, _3933.w);
    }
    else
    {
        _4045 = vec4(_2224.x, _2224.y, _2224.z, _3933.w);
    }
    vec2 _2395 = ((In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w)) * 0.5) + vec2(0.5);
    vec3 _4049;
    for (;;)
    {
        if (_1576.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.w <= 0.0)
        {
            _4049 = _4045.xyz;
            break;
        }
        float _2965 = length(In.mWorldPositionVec3_mfSpare.xyz - _1576.lUniforms.mpCommonPerMesh.gScanParamsPosVec4.xyz);
        float _2967 = 2.0 / _2965;
        float _2970 = 1.0 / _1576.lUniforms.mpCommonPerMesh.gScanParamsPosVec4.w;
        float _2978 = ((_2965 * _1576.lUniforms.mpCommonPerMesh.gScanParamsPosVec4.w) * _2970) * _2967;
        float _2984 = (pow(_1576.lUniforms.mpCommonPerMesh.gScanParamsCfg2Vec4.w, 3.0) * _2970) * _2967;
        float _2988 = abs(_2984 - _2978);
        float _2996 = 1.0 - (_2988 * 6.0);
        float _2998 = clamp(_2996, -0.0, 1.0);
        float _3007 = smoothstep(0.0, 1.10000002384185791015625, pow(clamp(_2996 - ((_2978 - _2984) * 5.80000019073486328125), 0.0, 1.0), 8.0));
        float _3041 = clamp(sin((_2395.y * 1500.0) + (_1576.lUniforms.mpPerFrame.gfTime * 5.0)) * 0.800000011920928955078125, 0.0, 1.0);
        vec3 _3058 = mix(mix(_4045.xyz, mix(_1576.lUniforms.mpCommonPerMesh.gScanParamsCfg2Vec4.xyz, _1576.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.xyz, vec3(_2988 * 3.0)), vec3(_3007)), _1576.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.xyz, vec3(_3041 * _3007)) + (vec3(1.0) * (smoothstep(0.87999999523162841796875, 0.980000019073486328125, _2998 * _2998) * 5.0));
        _4049 = mix(mix(_4045.xyz, vec3(0.0), vec3((((1.0 - (((_3058.x * 0.300000011920928955078125) + (_3058.y * 0.589999973773956298828125)) + (_3058.z * 0.10999999940395355224609375))) * _3041) * _3007) * _1576.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.w)), _3058, vec3(0.89999997615814208984375 * _1576.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.w));
        break;
    }
    vec4 _4059;
    for (;;)
    {
        if (_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXColVec4.w <= 0.0)
        {
            _4059 = vec4(_4049.x, _4049.y, _4049.z, _4045.w);
            break;
        }
        float _3174 = abs(_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXVec4.y);
        int _3180 = int(_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXVec4.w);
        float _3184 = float(_3180 & 15) * 0.066666670143604278564453125;
        float _3192 = float(_3180 & 64) * 0.015625;
        float _3196 = float(_3180 & 128) * 0.0078125;
        float _3206 = _1576.lUniforms.mpPerFrame.gfTime * step(0.0, _1576.lUniforms.mpCustomPerMaterial.gMaterialSFXVec4.x);
        float _3209 = _3206 * 2.0;
        float _3215 = _3206 * 3.0;
        float _3237 = (0.4000000059604644775390625 * step(0.89999997615814208984375, sin(_3206 + (9.0 * cos(_3215))))) * ((sin(_3206) * sin(_3206 * 20.0)) + (0.5 + ((0.100000001490116119384765625 * sin(_3206 * 2000.0)) * cos(_3206))));
        float _3248 = ((length(In.mWorldPositionVec3_mfSpare.xyz - _1576.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz) - _1576.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w) * (1.0 - _3196)) + (In.mWorldPositionVec3_mfSpare.y * _3196);
        float _3259 = 1.0 - clamp(normalize(_1576.lUniforms.mpPerFrame.gViewPositionVec3 - In.mWorldPositionVec3_mfSpare.xyz).y, 0.0, 1.0);
        float _3266 = pow(_3259, ((sin(_3209) * 0.5) + 1.0) * abs(_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXVec4.z));
        vec3 _3276 = mix(vec3(1.0), _1576.lUniforms.mpCustomPerMaterial.gMaterialSFXColVec4.xyz, vec3(smoothstep(0.25, 1.0, 1.0 - _3266)));
        float _3325 = sin(_3206 * 3.63000011444091796875);
        float _3330 = clamp((sin(_3206 + _3325) * 0.5) + 0.5, 0.300000011920928955078125, 1.0);
        float _3339 = (sin(_3215 + _3325) * 0.5) + 0.5;
        float _3342 = _3248 + _3339;
        float _3349 = _3209 + _3184;
        float _3529 = sin((_3342 * 0.20000000298023223876953125) + _3349);
        float _3544 = clamp(1.0 / sin(((_3342 * 0.4000000059604644775390625) + (_3349 * 2.0)) + 3.1415998935699462890625), 0.0, 1.0);
        float _3546 = abs(_3529);
        float _3375 = clamp(_3339, 0.0, 1.0);
        float _3388 = _3248 + (((sin(_3209 + _3325) * 0.5) + 0.5) * 3.0);
        float _3395 = (_3206 * 8.0) + _3184;
        float _3617 = sin((_3388 * 0.60000002384185791015625) + _3395);
        float _3632 = clamp(1.0 / sin(((_3388 * 1.2000000476837158203125) + (_3395 * 2.0)) + 3.1415998935699462890625), 0.0, 1.0);
        float _3634 = abs(_3617);
        vec3 _3419 = (((mix(mix(_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXColVec4.xyz * abs(_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXVec4.x), _3276, vec3(max(_3266 - (_3237 * 0.60000002384185791015625), 0.0))), _3276, vec3((clamp(sin(((((_2395.y * _3174) + ((sin(_2395.x * 500.0) * 0.007000000216066837310791015625) * _3237)) + _3237) * 1500.0) + (_3206 * 5.0)) * 0.5, 0.0, 1.0) * pow(_3259, 0.449999988079071044921875)) * step(0.0, _3174))) + ((((_3276 * clamp(_3529 * (_3544 * clamp(pow(_3546, 1.0), 0.0, 1.0)), 0.0, 1.0)) * 0.800000011920928955078125) * _3330) * _3192)) + ((((vec3(0.800000011920928955078125, 0.800000011920928955078125, 1.0) * clamp(_3529 * (_3544 * clamp(pow(_3546, 50.0), 0.0, 1.0)), 0.0, 1.0)) * 0.800000011920928955078125) * _3330) * _3192)) + ((((_3276 * clamp(_3617 * (_3632 * clamp(pow(_3634, 2.0), 0.0, 1.0)), 0.0, 1.0)) * 0.100000001490116119384765625) * _3375) * _3192)) + ((((vec3(0.800000011920928955078125, 0.800000011920928955078125, 1.0) * clamp(_3617 * (_3632 * clamp(pow(_3634, 20.0), 0.0, 1.0)), 0.0, 1.0)) * 0.100000001490116119384765625) * _3375) * _3192);
        float _3454 = clamp(_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXColVec4.w * max(max(max(_3419.x, _3419.y), _3419.z), 0.4000000059604644775390625), 0.0, 1.0);
        vec3 _3457 = mix(_4049.xyz, clamp((_3419 * (0.949999988079071044921875 + (0.0500000007450580596923828125 * sin(110.0 * _3206)))) + vec3((_3266 * (float(_3180 & 65280) * 1.5318628356908448040485382080078e-05)) * 7.0), vec3(0.0), vec3(1.0)), vec3(_3454 * 0.89999997615814208984375));
        vec4 _3459 = vec4(_3457.x, _3457.y, _3457.z, _4045.w);
        vec4 _4055;
        if ((float(_3180 & 32) * 0.03125) > 0.0)
        {
            vec4 _4009 = _3459;
            _4009.w = _3454;
            _4055 = _4009;
        }
        else
        {
            _4055 = _3459;
        }
        vec4 _4058;
        if (_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXVec4.z < 0.0)
        {
            float _4057;
            if (_1576.lUniforms.mpCustomPerMaterial.gMaterialSFXVec4.y < 0.0)
            {
                _4057 = smoothstep(0.0500000007450580596923828125 + (_3375 * 0.300000011920928955078125), 0.699999988079071044921875, _3259);
            }
            else
            {
                _4057 = _3259;
            }
            vec4 _4017 = _4055;
            _4017.w = max(min(_3454, _4057), 0.0500000007450580596923828125);
            _4058 = _4017;
        }
        else
        {
            _4058 = _4055;
        }
        _4059 = _4058;
        break;
    }
    out_color0 = _4059;
}


