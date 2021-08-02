#version 450

layout(constant_id = 0) const int gIsLowEnd = 0;
const bool _391 = (gIsLowEnd == 0);
const bool _842 = (gIsLowEnd == 0);

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

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
layout(set = 0, binding = 45, std140) uniform Vk3DParams
{
    vec4 stereo;
    vec4 custom_params;
} vk3d_params;

layout(set = 0, binding = 0, std140) uniform lUniforms_BLK
{
    UniformBuffer lUniforms;
} _1565;

layout(set = 1, binding = 4) uniform sampler2DShadow gShadowMap;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 2) uniform sampler2D gBuffer2Map;
layout(set = 1, binding = 3) uniform sampler2D gBuffer3Map;
layout(set = 1, binding = 5) uniform sampler2D gCloudShadowMap;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
    flat mat3 mUpMatrix;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _4665;
vec2 _4689;
vec2 _4821;

void main()
{
    vec4 _1528 = texture(gBuffer1Map, In.mTexCoordsVec2);
    float _4802;
    if (((int(texture(gBuffer2Map, In.mTexCoordsVec2).w * 3.0) << 8) & 512) != 0)
    {
        _4802 = 1.0 - texture(gBuffer3Map, In.mTexCoordsVec2).w;
    }
    else
    {
        _4802 = 1.0;
    }
    vec2 _2142 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
    vec4 _4491 = vec4(_2142.x, _2142.y, _4665.z, _4665.w);
    _4491.z = 0.0;
    
    _4491.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y / (_1528.x * _1565.lUniforms.mpPerFrame.gClipPlanesVec4.y));
    
    vec4 _4493 = _4491;
    _4493.w = 1.0;
    vec4 _2149 = _1565.lUniforms.mpPerFrame.gInverseProjectionMat4 * _4493;
    mat4 _4496 = _1565.lUniforms.mpPerFrame.gInverseViewMat4;
    _4496[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec3 _2167 = (_4496 * ((_2149 / vec4(abs(_2149.z))) * (_1528.x * _1565.lUniforms.mpPerFrame.gClipPlanesVec4.y))).xyz + _1565.lUniforms.mpPerFrame.gViewPositionVec3;
    float _4788;
    for (;;)
    {
        vec4 _2278 = vec4(_2167, 1.0);
        vec4 _2279 = _1565.lUniforms.mpCommonPerMesh.gaShadowMat4[0] * _2278;
        float _2282 = _2279.x;
        float _2284 = _2279.y;
        float _2288 = 1.0 - _1565.lUniforms.mpPerFrame.gShadowSizeVec4.w;
        bool _2289 = max(_2282, _2284) < _2288;
        bool _2300;
        if (_2289)
        {
            _2300 = min(_2282, _2284) > _1565.lUniforms.mpPerFrame.gShadowSizeVec4.w;
        }
        else
        {
            _2300 = _2289;
        }
        bool _2306;
        if (_2300)
        {
            _2306 = _2279.z < 1.0;
        }
        else
        {
            _2306 = _2300;
        }
        bool _2312;
        if (_2306)
        {
            _2312 = _2279.z >= 0.0;
        }
        else
        {
            _2312 = _2306;
        }
        vec3 _4675;
        float _4700;
        float _4707;
        float _4716;
        float _4780;
        if (!_2312)
        {
            vec4 _2323 = _1565.lUniforms.mpCommonPerMesh.gaShadowMat4[1] * _2278;
            float _2326 = _2323.x;
            float _2328 = _2323.y;
            bool _2333 = max(_2326, _2328) < _2288;
            bool _2344;
            if (_2333)
            {
                _2344 = min(_2326, _2328) > _1565.lUniforms.mpPerFrame.gShadowSizeVec4.w;
            }
            else
            {
                _2344 = _2333;
            }
            bool _2350;
            if (_2344)
            {
                _2350 = _2323.z < 1.0;
            }
            else
            {
                _2350 = _2344;
            }
            bool _2356;
            if (_2350)
            {
                _2356 = _2323.z >= 0.0;
            }
            else
            {
                _2356 = _2350;
            }
            bool _2357 = !_2356;
            vec3 _4677;
            float _4711;
            float _4784;
            if (_2357)
            {
                vec4 _2370 = _1565.lUniforms.mpCommonPerMesh.gaShadowMat4[2] * _2278;
                float _2373 = _2370.x;
                float _2375 = _2370.y;
                bool _2380 = max(_2373, _2375) < _2288;
                bool _2391;
                if (_2380)
                {
                    _2391 = min(_2373, _2375) > _1565.lUniforms.mpPerFrame.gShadowSizeVec4.w;
                }
                else
                {
                    _2391 = _2380;
                }
                bool _2397;
                if (_2391)
                {
                    _2397 = _2370.z < 1.0;
                }
                else
                {
                    _2397 = _2391;
                }
                bool _2403;
                if (_2397)
                {
                    _2403 = _2370.z >= 0.0;
                }
                else
                {
                    _2403 = _2397;
                }
                if (!_2403)
                {
                    _4788 = 1.0;
                    break;
                }
                _4784 = clamp((length(_1565.lUniforms.mpPerFrame.gViewPositionVec3 - _2167.xyz) - _1565.lUniforms.mpPerFrame.gShadowFadeParamVec4.x) * _1565.lUniforms.mpPerFrame.gShadowFadeParamVec4.y, 0.0, 1.0);
                _4711 = _1565.lUniforms.mpPerFrame.gShadowProjScaleVec3.z;
                _4677 = _2370.xyz;
            }
            else
            {
                _4784 = 0.0;
                _4711 = _1565.lUniforms.mpPerFrame.gShadowProjScaleVec3.y;
                _4677 = _2323.xyz;
            }
            _4780 = _4784;
            _4716 = _2357 ? 2.0 : 1.0;
            _4707 = _4711;
            _4700 = _2357 ? 0.0040000001899898052215576171875 : 0.0170000009238719940185546875;
            _4675 = _4677;
        }
        else
        {
            _4780 = 0.0;
            _4716 = 0.0;
            _4707 = _1565.lUniforms.mpPerFrame.gShadowProjScaleVec3.x;
            _4700 = 0.07999999821186065673828125;
            _4675 = _2279.xyz;
        }
        vec3 _2424 = dFdxFine(_4675);
        vec3 _2426 = dFdyFine(_4675);
        vec2 _4697;
        for (;;)
        {
            float _2472 = _2426.y;
            float _2474 = _2424.z;
            float _2477 = _2424.y;
            float _2479 = _2426.z;
            vec2 _4535 = _4689;
            _4535.x = (_2472 * _2474) - (_2477 * _2479);
            float _2484 = _2424.x;
            float _2489 = _2426.x;
            vec2 _4541 = _4535;
            _4541.y = (_2484 * _2479) - (_2489 * _2474);
            float _2505 = (_2484 * _2472) - (_2477 * _2489);
            if (_2505 == 0.0)
            {
                _4697 = vec2(0.0);
                break;
            }
            _4697 = _4541 * (1.0 / (sign(_2505) * max(abs(_2505), 9.9999999392252902907785028219223e-09)));
            break;
        }
        vec2 _2436 = _4697 * vec2(_1565.lUniforms.mpPerFrame.gShadowSizeVec4.zw);
        float _2448 = _4675.z - (dot(vec2(2.0), abs(_2436)) + (_4700 / _4707));
        float _4775;
        for (;;)
        {
            vec2 _4561 = _4821;
            _4561.x = _1565.lUniforms.mpPerFrame.gShadowSizeVec4.z;
            vec2 _4564 = _4561;
            _4564.y = _1565.lUniforms.mpPerFrame.gShadowSizeVec4.w;
            float _2794 = (_4675.x * _1565.lUniforms.mpPerFrame.gShadowSizeVec4.x) + 0.5;
            float _2795 = floor(_2794);
            vec2 _4567 = _4821;
            _4567.x = _2795;
            float _2799 = (_4675.y * _1565.lUniforms.mpPerFrame.gShadowSizeVec4.y) + 0.5;
            float _2800 = floor(_2799);
            vec2 _4570 = _4567;
            _4570.y = _2800;
            float _2807 = _2794 - _2795;
            float _2813 = _2799 - _2800;
            vec2 _2818 = (_4570 - vec2(0.5)) * _4564;
            if ((_391 && (_4716 == 0.0)) && true)
            {
                float _3098 = 5.0 * _2807;
                float _3099 = _3098 - 6.0;
                float _3101 = 11.0 * _2807;
                float _3102 = _3101 - 28.0;
                float _3106 = (-17.0) - _3101;
                float _3110 = (-1.0) - _3098;
                float _3112 = 4.0 * _2807;
                float _3116 = ((_3112 - 5.0) / _3099) - 3.0;
                float _3122 = ((_3112 - 16.0) / _3102) - 1.0;
                float _3129 = (((-5.0) - (7.0 * _2807)) / _3106) + 1.0;
                float _3134 = ((-_2807) / _3110) + 3.0;
                float _3136 = 5.0 * _2813;
                float _3137 = _3136 - 6.0;
                float _3139 = 11.0 * _2813;
                float _3140 = _3139 - 28.0;
                float _3144 = (-17.0) - _3139;
                float _3148 = (-1.0) - _3136;
                float _3150 = 4.0 * _2813;
                float _3154 = ((_3150 - 5.0) / _3137) - 3.0;
                float _3160 = ((_3150 - 16.0) / _3140) - 1.0;
                float _3167 = (((-5.0) - (7.0 * _2813)) / _3144) + 1.0;
                float _3172 = ((-_2813) / _3148) + 3.0;
                vec2 _3862 = vec2(_3116, _3154);
                vec2 _3865 = _2818 + (_3862 * _4564);
                float _3876 = clamp(1.0 - (_2448 + dot(_3862, _2436)), 0.0, 1.0);
                vec2 _3897 = vec2(_3122, _3154);
                vec2 _3900 = _2818 + (_3897 * _4564);
                float _3911 = clamp(1.0 - (_2448 + dot(_3897, _2436)), 0.0, 1.0);
                vec2 _3932 = vec2(_3129, _3154);
                vec2 _3935 = _2818 + (_3932 * _4564);
                float _3946 = clamp(1.0 - (_2448 + dot(_3932, _2436)), 0.0, 1.0);
                vec2 _3967 = vec2(_3134, _3154);
                vec2 _3970 = _2818 + (_3967 * _4564);
                float _3981 = clamp(1.0 - (_2448 + dot(_3967, _2436)), 0.0, 1.0);
                vec2 _4002 = vec2(_3116, _3160);
                vec2 _4005 = _2818 + (_4002 * _4564);
                float _4016 = clamp(1.0 - (_2448 + dot(_4002, _2436)), 0.0, 1.0);
                vec2 _4037 = vec2(_3122, _3160);
                vec2 _4040 = _2818 + (_4037 * _4564);
                float _4051 = clamp(1.0 - (_2448 + dot(_4037, _2436)), 0.0, 1.0);
                vec2 _4072 = vec2(_3129, _3160);
                vec2 _4075 = _2818 + (_4072 * _4564);
                float _4086 = clamp(1.0 - (_2448 + dot(_4072, _2436)), 0.0, 1.0);
                vec2 _4107 = vec2(_3134, _3160);
                vec2 _4110 = _2818 + (_4107 * _4564);
                float _4121 = clamp(1.0 - (_2448 + dot(_4107, _2436)), 0.0, 1.0);
                vec2 _4142 = vec2(_3116, _3167);
                vec2 _4145 = _2818 + (_4142 * _4564);
                float _4156 = clamp(1.0 - (_2448 + dot(_4142, _2436)), 0.0, 1.0);
                vec2 _4177 = vec2(_3122, _3167);
                vec2 _4180 = _2818 + (_4177 * _4564);
                float _4191 = clamp(1.0 - (_2448 + dot(_4177, _2436)), 0.0, 1.0);
                vec2 _4212 = vec2(_3129, _3167);
                vec2 _4215 = _2818 + (_4212 * _4564);
                float _4226 = clamp(1.0 - (_2448 + dot(_4212, _2436)), 0.0, 1.0);
                vec2 _4247 = vec2(_3134, _3167);
                vec2 _4250 = _2818 + (_4247 * _4564);
                float _4261 = clamp(1.0 - (_2448 + dot(_4247, _2436)), 0.0, 1.0);
                vec2 _4282 = vec2(_3116, _3172);
                vec2 _4285 = _2818 + (_4282 * _4564);
                float _4296 = clamp(1.0 - (_2448 + dot(_4282, _2436)), 0.0, 1.0);
                vec2 _4317 = vec2(_3122, _3172);
                vec2 _4320 = _2818 + (_4317 * _4564);
                float _4331 = clamp(1.0 - (_2448 + dot(_4317, _2436)), 0.0, 1.0);
                vec2 _4352 = vec2(_3129, _3172);
                vec2 _4355 = _2818 + (_4352 * _4564);
                float _4366 = clamp(1.0 - (_2448 + dot(_4352, _2436)), 0.0, 1.0);
                vec2 _4387 = vec2(_3134, _3172);
                vec2 _4390 = _2818 + (_4387 * _4564);
                float _4401 = clamp(1.0 - (_2448 + dot(_4387, _2436)), 0.0, 1.0);
                _4775 = (((((((((((((((((_3099 * _3137) * texture(gShadowMap, vec3(vec3((_3865.x + _4716) * 0.3333333432674407958984375, _3865.y, _3876).xy, _3876))) + ((_3102 * _3137) * texture(gShadowMap, vec3(vec3((_3900.x + _4716) * 0.3333333432674407958984375, _3900.y, _3911).xy, _3911)))) + ((_3106 * _3137) * texture(gShadowMap, vec3(vec3((_3935.x + _4716) * 0.3333333432674407958984375, _3935.y, _3946).xy, _3946)))) + ((_3110 * _3137) * texture(gShadowMap, vec3(vec3((_3970.x + _4716) * 0.3333333432674407958984375, _3970.y, _3981).xy, _3981)))) + ((_3099 * _3140) * texture(gShadowMap, vec3(vec3((_4005.x + _4716) * 0.3333333432674407958984375, _4005.y, _4016).xy, _4016)))) + ((_3102 * _3140) * texture(gShadowMap, vec3(vec3((_4040.x + _4716) * 0.3333333432674407958984375, _4040.y, _4051).xy, _4051)))) + ((_3106 * _3140) * texture(gShadowMap, vec3(vec3((_4075.x + _4716) * 0.3333333432674407958984375, _4075.y, _4086).xy, _4086)))) + ((_3110 * _3140) * texture(gShadowMap, vec3(vec3((_4110.x + _4716) * 0.3333333432674407958984375, _4110.y, _4121).xy, _4121)))) + ((_3099 * _3144) * texture(gShadowMap, vec3(vec3((_4145.x + _4716) * 0.3333333432674407958984375, _4145.y, _4156).xy, _4156)))) + ((_3102 * _3144) * texture(gShadowMap, vec3(vec3((_4180.x + _4716) * 0.3333333432674407958984375, _4180.y, _4191).xy, _4191)))) + ((_3106 * _3144) * texture(gShadowMap, vec3(vec3((_4215.x + _4716) * 0.3333333432674407958984375, _4215.y, _4226).xy, _4226)))) + ((_3110 * _3144) * texture(gShadowMap, vec3(vec3((_4250.x + _4716) * 0.3333333432674407958984375, _4250.y, _4261).xy, _4261)))) + ((_3099 * _3148) * texture(gShadowMap, vec3(vec3((_4285.x + _4716) * 0.3333333432674407958984375, _4285.y, _4296).xy, _4296)))) + ((_3102 * _3148) * texture(gShadowMap, vec3(vec3((_4320.x + _4716) * 0.3333333432674407958984375, _4320.y, _4331).xy, _4331)))) + ((_3106 * _3148) * texture(gShadowMap, vec3(vec3((_4355.x + _4716) * 0.3333333432674407958984375, _4355.y, _4366).xy, _4366)))) + ((_3110 * _3148) * texture(gShadowMap, vec3(vec3((_4390.x + _4716) * 0.3333333432674407958984375, _4390.y, _4401).xy, _4401)))) * 0.000369822490029036998748779296875;
                break;
            }
            else
            {
                if ((_842 && (_4716 == 1.0)) && true)
                {
                    float _2929 = 3.0 * _2807;
                    float _2930 = 4.0 - _2929;
                    float _2933 = 1.0 + _2929;
                    float _2939 = ((3.0 - (2.0 * _2807)) / _2930) - 2.0;
                    float _2943 = (3.0 + _2807) * 0.14285714924335479736328125;
                    float _2947 = (_2807 / _2933) + 2.0;
                    float _2949 = 3.0 * _2813;
                    float _2950 = 4.0 - _2949;
                    float _2953 = 1.0 + _2949;
                    float _2959 = ((3.0 - (2.0 * _2813)) / _2950) - 2.0;
                    float _2963 = (3.0 + _2813) * 0.14285714924335479736328125;
                    float _2967 = (_2813 / _2953) + 2.0;
                    vec2 _3547 = vec2(_2939, _2959);
                    vec2 _3550 = _2818 + (_3547 * _4564);
                    float _3561 = clamp(1.0 - (_2448 + dot(_3547, _2436)), 0.0, 1.0);
                    vec2 _3582 = vec2(_2943, _2959);
                    vec2 _3585 = _2818 + (_3582 * _4564);
                    float _3596 = clamp(1.0 - (_2448 + dot(_3582, _2436)), 0.0, 1.0);
                    vec2 _3617 = vec2(_2947, _2959);
                    vec2 _3620 = _2818 + (_3617 * _4564);
                    float _3631 = clamp(1.0 - (_2448 + dot(_3617, _2436)), 0.0, 1.0);
                    vec2 _3652 = vec2(_2939, _2963);
                    vec2 _3655 = _2818 + (_3652 * _4564);
                    float _3666 = clamp(1.0 - (_2448 + dot(_3652, _2436)), 0.0, 1.0);
                    vec2 _3687 = vec2(_2943, _2963);
                    vec2 _3690 = _2818 + (_3687 * _4564);
                    float _3701 = clamp(1.0 - (_2448 + dot(_3687, _2436)), 0.0, 1.0);
                    vec2 _3722 = vec2(_2947, _2963);
                    vec2 _3725 = _2818 + (_3722 * _4564);
                    float _3736 = clamp(1.0 - (_2448 + dot(_3722, _2436)), 0.0, 1.0);
                    vec2 _3757 = vec2(_2939, _2967);
                    vec2 _3760 = _2818 + (_3757 * _4564);
                    float _3771 = clamp(1.0 - (_2448 + dot(_3757, _2436)), 0.0, 1.0);
                    vec2 _3792 = vec2(_2943, _2967);
                    vec2 _3795 = _2818 + (_3792 * _4564);
                    float _3806 = clamp(1.0 - (_2448 + dot(_3792, _2436)), 0.0, 1.0);
                    vec2 _3827 = vec2(_2947, _2967);
                    vec2 _3830 = _2818 + (_3827 * _4564);
                    float _3841 = clamp(1.0 - (_2448 + dot(_3827, _2436)), 0.0, 1.0);
                    _4775 = ((((((((((_2930 * _2950) * texture(gShadowMap, vec3(vec3((_3550.x + _4716) * 0.3333333432674407958984375, _3550.y, _3561).xy, _3561))) + ((7.0 * _2950) * texture(gShadowMap, vec3(vec3((_3585.x + _4716) * 0.3333333432674407958984375, _3585.y, _3596).xy, _3596)))) + ((_2933 * _2950) * texture(gShadowMap, vec3(vec3((_3620.x + _4716) * 0.3333333432674407958984375, _3620.y, _3631).xy, _3631)))) + ((_2930 * 7.0) * texture(gShadowMap, vec3(vec3((_3655.x + _4716) * 0.3333333432674407958984375, _3655.y, _3666).xy, _3666)))) + (49.0 * texture(gShadowMap, vec3(vec3((_3690.x + _4716) * 0.3333333432674407958984375, _3690.y, _3701).xy, _3701)))) + ((_2933 * 7.0) * texture(gShadowMap, vec3(vec3((_3725.x + _4716) * 0.3333333432674407958984375, _3725.y, _3736).xy, _3736)))) + ((_2930 * _2953) * texture(gShadowMap, vec3(vec3((_3760.x + _4716) * 0.3333333432674407958984375, _3760.y, _3771).xy, _3771)))) + ((7.0 * _2953) * texture(gShadowMap, vec3(vec3((_3795.x + _4716) * 0.3333333432674407958984375, _3795.y, _3806).xy, _3806)))) + ((_2933 * _2953) * texture(gShadowMap, vec3(vec3((_3830.x + _4716) * 0.3333333432674407958984375, _3830.y, _3841).xy, _3841)))) * 0.0069444444961845874786376953125;
                    break;
                }
                else
                {
                    float _2838 = 2.0 * _2807;
                    float _2839 = 3.0 - _2838;
                    float _2842 = 1.0 + _2838;
                    float _2847 = ((2.0 - _2807) / _2839) - 1.0;
                    float _2851 = (_2807 / _2842) + 1.0;
                    float _2853 = 2.0 * _2813;
                    float _2854 = 3.0 - _2853;
                    float _2857 = 1.0 + _2853;
                    float _2862 = ((2.0 - _2813) / _2854) - 1.0;
                    float _2866 = (_2813 / _2857) + 1.0;
                    vec2 _2868 = _4564 * 0.5;
                    vec2 _3407 = vec2(_2847, _2862);
                    vec2 _3410 = _2818 + (_3407 * _2868);
                    float _3421 = clamp(1.0 - (_2448 + dot(_3407, _2436)), 0.0, 1.0);
                    vec2 _3442 = vec2(_2851, _2862);
                    vec2 _3445 = _2818 + (_3442 * _2868);
                    float _3456 = clamp(1.0 - (_2448 + dot(_3442, _2436)), 0.0, 1.0);
                    vec2 _3477 = vec2(_2847, _2866);
                    vec2 _3480 = _2818 + (_3477 * _2868);
                    float _3491 = clamp(1.0 - (_2448 + dot(_3477, _2436)), 0.0, 1.0);
                    vec2 _3512 = vec2(_2851, _2866);
                    vec2 _3515 = _2818 + (_3512 * _2868);
                    float _3526 = clamp(1.0 - (_2448 + dot(_3512, _2436)), 0.0, 1.0);
                    _4775 = (((((_2839 * _2854) * texture(gShadowMap, vec3(vec3((_3410.x + _4716) * 0.3333333432674407958984375, _3410.y, _3421).xy, _3421))) + ((_2842 * _2854) * texture(gShadowMap, vec3(vec3((_3445.x + _4716) * 0.3333333432674407958984375, _3445.y, _3456).xy, _3456)))) + ((_2839 * _2857) * texture(gShadowMap, vec3(vec3((_3480.x + _4716) * 0.3333333432674407958984375, _3480.y, _3491).xy, _3491)))) + ((_2842 * _2857) * texture(gShadowMap, vec3(vec3((_3515.x + _4716) * 0.3333333432674407958984375, _3515.y, _3526).xy, _3526)))) * 0.0625;
                    break;
                }
            }
        }
        _4788 = mix(_4775, 1.0, _4780);
        break;
    }
    out_color0 = vec4(texture(gBufferMap, In.mTexCoordsVec2).xyz * ((_4788 * _4802) * texture(gCloudShadowMap, In.mTexCoordsVec2).x), 1.0);
}


