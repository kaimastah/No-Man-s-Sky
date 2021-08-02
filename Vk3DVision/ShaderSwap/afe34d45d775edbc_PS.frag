#version 450
// clouds
const vec3 _1069[6] = vec3[](vec3(0.0), vec3(-0.07909999787807464599609375, -0.08980000019073486328125, -0.9927999973297119140625), vec3(-0.041000001132488250732421875, 1.7544000148773193359375, -0.959399998188018798828125), vec3(1.30050003528594970703125, -0.0155999995768070220947265625, -2.7035999298095703125), vec3(-3.42759990692138671875, 0.27079999446868896484375, -2.0443999767303466796875), vec3(4.016499996185302734375, -2.632999897003173828125, 1.3910000324249267578125));

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
    vec4 gCloudColourExternalVec4;
    vec4 gCloudColourInternalVec4;
    vec4 gCloudRatioVec4;
    vec4 gCloudParamsVec4;
    vec4 gHueOverlayParamsVec4;
    vec4 gSaturationOverlayParamsVec4;
    vec4 gValueOverlayParamsVec4;
    vec4 gSunRayParams;
    vec4 gSunPositionVec4;
    vec4 gWindOffset;
    vec4 gCloudBaseColour;
    vec4 gCloudTopColour;
    vec4 gCloudHeightGradient1;
    vec4 gCloudHeightGradient2;
    vec4 gCloudHeightGradient3;
    vec4 gCoverageParamsVec4;
    vec4 gLightingParamsVec4;
    vec4 gLightConeParamsVec4;
    vec4 gLightScatteringParamsVec4;
    vec4 gAnimationParamsVec4;
    vec4 gModelingBaseParamsVec4;
    vec4 gModelingDetailParamsVec4;
    vec4 gOptimisationParamsVec4;
    vec4 gAtmosphereParamsVec4;
    vec4 gCloudSubFrameParamsVec4;
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
} _1786;

layout(set = 1, binding = 1) uniform sampler2D gCoverage2D;
layout(set = 1, binding = 4) uniform sampler3D gPerlin3D;
layout(set = 1, binding = 3) uniform sampler2D gCurl2D;
layout(set = 1, binding = 5) uniform sampler3D gDetail3D;
layout(set = 1, binding = 2) uniform sampler2D gCloudsHigh2D;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;
layout(location = 1) out vec4 out_color1;

vec4 _6013;

void main()
{
    for (;;)
    {
        int _1800 = int(_1786.lUniforms.mpCustomPerMesh.gCoverageParamsVec4.x);
        float _1847 = _1786.lUniforms.mpCustomPerMesh.gAnimationParamsVec4.x * _1786.lUniforms.mpPerFrame.gfTime;
        float _1913 = _1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.y;
        float _1930 = _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.z - _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.y;
        float _1937 = _1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.z;
        float _1943 = _1937 * _1937;
        float _1948 = _1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w * _1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
        float _1957 = (1.0 / _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.z) * _1786.lUniforms.mpCustomPerMesh.gModelingBaseParamsVec4.x;
        float _1961 = 1.0 / sqrt(_1943 - _1948);
        vec3 _1971 = _1786.lUniforms.mpPerFrame.gViewPositionVec3 - _1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
        if (_1786.lUniforms.mpPerFrame.gFoVValuesVec4.z == 2.0)
        {
            if (textureLod(gBufferMap, In.mTexCoordsVec2, 0.0).x < 2.0000099354433586995583027601242e-08)
            {
                out_color0 = vec4(0.0);
                out_color1 = vec4(0.0);
                break;
            }
        }
        vec4 _2607 = _1786.lUniforms.mpPerFrame.gInverseProjectionMat4 * vec4((In.mTexCoordsVec2.x * 2.0) - 1.0, ((1.0 - In.mTexCoordsVec2.y) * 2.0) - 1.0, 0.0, 1.0);
        
        _2607.x -= vk3d_params.stereo.x * _1786.lUniforms.mpPerFrame.gInverseProjectionMat4[0].x;
        
        mat4 _5122 = _1786.lUniforms.mpPerFrame.gInverseViewMat4;
        _5122[3] = vec4(0.0, 0.0, 0.0, 1.0);
        vec3 _2620 = normalize((_5122 * (_2607 / vec4(_2607.w))).xyz);
        float _2037 = length(_1971);
        float _2039 = _2037 - _1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
        vec3 _2042 = normalize(_1971);
        vec3 _2047 = _2042 * (_1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _2039);
        vec3 _2638;
        float _2642;
        float _2645;
        float _2652;
        float _5243;
        vec3 _5244;
        vec3 _5245;
        for (;;)
        {
            _2638 = _2047 + _2620;
            _2642 = dot(_2047, -_2620);
            _2645 = dot(_2047, _2047);
            _2652 = _2642 * _2642;
            float _2654 = _2652 - (_2645 - (_1913 * _1913));
            if (_2654 >= 0.0)
            {
                float _2660 = sqrt(_2654);
                float _2662 = -_2642;
                _5245 = _2047 - (_2620 * (_2662 - _2660));
                _5244 = _2047 - (_2620 * (_2662 + _2660));
                _5243 = 1.0;
                break;
            }
            _5245 = _2638;
            _5244 = _2047;
            _5243 = 0.0;
            break;
        }
        float _5248;
        vec3 _5249;
        vec3 _5250;
        for (;;)
        {
            float _2712 = _2652 - (_2645 - _1943);
            if (_2712 >= 0.0)
            {
                float _2718 = sqrt(_2712);
                float _2720 = -_2642;
                _5250 = _2047 - (_2620 * (_2720 - _2718));
                _5249 = _2047 - (_2620 * (_2720 + _2718));
                _5248 = 1.0;
                break;
            }
            _5250 = _2638;
            _5249 = _2047;
            _5248 = 0.0;
            break;
        }
        float _2090 = _1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.w;
        float _5253;
        vec3 _5254;
        vec3 _5255;
        for (;;)
        {
            float _2770 = _2652 - (_2645 - (_2090 * _2090));
            if (_2770 >= 0.0)
            {
                float _2776 = sqrt(_2770);
                float _2778 = -_2642;
                _5255 = _2047 - (_2620 * (_2778 - _2776));
                _5254 = _2047 - (_2620 * (_2778 + _2776));
                _5253 = 1.0;
                break;
            }
            _5255 = _2638;
            _5254 = _2047;
            _5253 = 0.0;
            break;
        }
        bool _2105 = _2039 < _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.y;
        bool _5272;
        vec3 _5290;
        vec3 _5295;
        vec3 _5300;
        bool _5320;
        float _5813;
        if (_2105)
        {
            _5813 = dot(_1971 - _5245, _1786.lUniforms.mpPerFrame.gCameraMat4[2].xyz);
            _5320 = false;
            _5300 = _5255;
            _5295 = _5250;
            _5290 = _5245;
            _5272 = (_5243 == 0.0) ? true : false;
        }
        else
        {
            bool _2126 = _2039 > _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.z;
            vec3 _5296;
            vec3 _5301;
            bool _5329;
            float _5814;
            if (_2126)
            {
                bool _2130 = _5248 == 0.0;
                bool _2140;
                if (!_2130)
                {
                    _2140 = dot(_5249 - _2047, _2620) < 0.0;
                }
                else
                {
                    _2140 = _2130;
                }
                bool _2145 = _2039 > _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.w;
                if (_2145)
                {
                    bool _2149 = _5253 == 0.0;
                    bool _2159;
                    if (!_2149)
                    {
                        _2159 = dot(_5254 - _2047, _2620) < 0.0;
                    }
                    else
                    {
                        _2159 = _2149;
                    }
                    if (_2159)
                    {
                        out_color0 = vec4(0.0);
                        out_color1 = vec4(1.0);
                        break;
                    }
                }
                bool _2165 = _5243 == 0.0;
                float _5816;
                if (_2165)
                {
                    _5816 = _1786.lUniforms.mpPerFrame.gClipPlanesVec4.y - 100.0;
                }
                else
                {
                    _5816 = dot(_1971 - _5244, _1786.lUniforms.mpPerFrame.gCameraMat4[2].xyz);
                }
                _5814 = _5816;
                _5329 = _2140 ? true : false;
                _5301 = mix(_5255, _5254, bvec3(_2145));
                _5296 = mix(_5244, _5250, bvec3(_2165));
            }
            else
            {
                bool _2191 = _5243 == 0.0;
                bool _2201;
                if (!_2191)
                {
                    _2201 = dot(_5244 - _2047, _2620) < 0.0;
                }
                else
                {
                    _2201 = _2191;
                }
                _5814 = 0.0;
                _5329 = false;
                _5301 = _5255;
                _5296 = mix(_5244, _5250, bvec3(_2201));
            }
            _5813 = _5814;
            _5320 = _5329;
            _5300 = _5301;
            _5295 = _5296;
            _5290 = mix(_2047, _5249, bvec3(_2126));
            _5272 = false;
        }
        bool _6025 = _2105 ? true : false;
        float _2218 = float(_1800);
        float _2225 = 2560.0 / _2218;
        vec4 _5808;
        if (_5272)
        {
            _5808 = vec4(0.0);
        }
        else
        {
            vec3 _2244 = pow(abs(normalize(_5290)), vec3(32.0));
            vec3 _2255 = _2244 / vec3((_2244.x + _2244.y) + _2244.z);
            float _2271 = dot(_2620, _2042);
            float _2275 = sqrt((_2037 * _2037) - _1948) / _2037;
            float _2277 = -_2275;
            float _2817 = _2255.x;
            float _2821 = _2255.y;
            float _2826 = _2255.z;
            vec3 _2828 = ((vec3(0.5, _1786.lUniforms.mpCustomPerMesh.gWindOffset.yx) * _2817) + (vec3(_1786.lUniforms.mpCustomPerMesh.gWindOffset.y, 0.5, _1786.lUniforms.mpCustomPerMesh.gWindOffset.x) * _2821)) + (vec3(_1786.lUniforms.mpCustomPerMesh.gWindOffset.xy, 0.5) * _2826);
            uvec2 _2835 = uvec2(In.mTexCoordsVec2 * _1786.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy) & uvec2(3u);
            mat4 _2831 = mat4(vec4(0.0588235296308994293212890625, 0.529411792755126953125, 0.17647059261798858642578125, 0.64705884456634521484375), vec4(0.7647058963775634765625, 0.2941176593303680419921875, 0.88235294818878173828125, 0.4117647111415863037109375), vec4(0.23529411852359771728515625, 0.705882370471954345703125, 0.117647059261798858642578125, 0.588235318660736083984375), vec4(0.941176474094390869140625, 0.4705882370471954345703125, 0.823529422283172607421875, 0.3529411852359771728515625));
            vec3 _2331 = _5290 + ((_2620 * _2225) * _2831[_2835.x][_2835.y]);
            bool _2919 = _2271 > _2277;
            float _5697;
            if (_2919)
            {
                vec3 _2924 = abs(normalize(_5300));
                vec3 _2935 = _2924 / vec3((_2924.x + _2924.y) + _2924.z);
                float _3298 = _2935.x;
                float _3302 = _2935.y;
                float _3307 = _2935.z;
                vec3 _2945 = (((vec3(0.5, _1786.lUniforms.mpCustomPerMesh.gWindOffset.wz) * _3298) + (vec3(_1786.lUniforms.mpCustomPerMesh.gWindOffset.w, 0.5, _1786.lUniforms.mpCustomPerMesh.gWindOffset.z) * _3302)) + (vec3(_1786.lUniforms.mpCustomPerMesh.gWindOffset.zw, 0.5) * _3307)) * _1847;
                vec3 _2952 = ((_5300 + (_2945 * 0.5)) * _1961) * 1.0;
                bool _3317 = _3298 > 0.0030000000260770320892333984375;
                vec2 _5338;
                if (_3317)
                {
                    _5338 = textureLod(gCoverage2D, _2952.yz, 0.0).yz * _3298;
                }
                else
                {
                    _5338 = vec2(0.0);
                }
                bool _3333 = _3302 > 0.0030000000260770320892333984375;
                vec2 _5339;
                if (_3333)
                {
                    _5339 = _5338 + (textureLod(gCoverage2D, _2952.zx, 0.0).yz * _3302);
                }
                else
                {
                    _5339 = _5338;
                }
                bool _3349 = _3307 > 0.0030000000260770320892333984375;
                vec2 _5340;
                if (_3349)
                {
                    _5340 = _5339 + (textureLod(gCoverage2D, _2952.xy, 0.0).yz * _3307);
                }
                else
                {
                    _5340 = _5339;
                }
                vec3 _2966 = ((_5300 + _2945) * _1961) * 4.0;
                vec4 _5341;
                if (_3317)
                {
                    _5341 = textureLod(gCloudsHigh2D, _2966.yz, 0.0) * _3298;
                }
                else
                {
                    _5341 = vec4(0.0);
                }
                vec4 _5342;
                if (_3333)
                {
                    _5342 = _5341 + (textureLod(gCloudsHigh2D, _2966.zx, 0.0) * _3302);
                }
                else
                {
                    _5342 = _5341;
                }
                vec4 _5343;
                if (_3349)
                {
                    _5343 = _5342 + (textureLod(gCloudsHigh2D, _2966.xy, 0.0) * _3307);
                }
                else
                {
                    _5343 = _5342;
                }
                float _3424 = clamp((_5343.x - _5340.x) / (1.0 - _5340.x), 0.0, 1.0);
                _5697 = max(_3424 * _3424, 0.00999999977648258209228515625);
            }
            else
            {
                _5697 = 0.0;
            }
            bool _2979 = !_6025;
            vec4 _5806;
            if ((!_2979) ? _2919 : _2979)
            {
                vec4 _5802;
                if (!_5320)
                {
                    float _3001 = dot(_2620, _1786.lUniforms.mpCustomPerMesh.gSunPositionVec4.xyz);
                    vec4 _5354;
                    _5354 = vec4(0.0);
                    vec4 _5686;
                    float _5867;
                    bool _5870;
                    float _5922;
                    float _5971;
                    int _5973;
                    int _5344 = 0;
                    float _5353 = 0.0;
                    bool _5364 = false;
                    float _5446 = 0.0;
                    float _5584 = -1.0;
                    int _5598 = 0;
                    for (; _5344 < _1800; _5598 = _5973, _5584 = _5971, _5446 = _5922, _5364 = _5870, _5354 = clamp(_5686, vec4(0.0), vec4(1.0)), _5353 = _5867, _5344++)
                    {
                        float _3019 = max(log(_5353 * 0.0199999995529651641845703125), 0.0) + 1.0;
                        vec3 _3026 = _2331 + ((_2620 * _5353) * _3019);
                        bool _3029 = _5354.w > 0.9900000095367431640625;
                        bool _3038;
                        if (!_3029)
                        {
                            _3038 = length(_5295 - _2331) <= (_3019 * _5353);
                        }
                        else
                        {
                            _3038 = _3029;
                        }
                        if (_3038)
                        {
                            break;
                        }
                        vec3 _3494;
                        float _3565;
                        bool _3594;
                        bool _3610;
                        bool _3626;
                        float _3653;
                        float _5413;
                        for (;;)
                        {
                            _3565 = clamp((length(_3026) - _1913) / _1930, 0.0, 1.0);
                            _3494 = _2828 * _1847;
                            vec3 _3496 = (_3026 + ((_2828 * _3565) * 500.0)) + _3494;
                            vec3 _3574 = _3496 * _1961;
                            _3594 = _2817 > 0.0030000000260770320892333984375;
                            vec2 _5396;
                            if (_3594)
                            {
                                _5396 = textureLod(gCoverage2D, _3574.yz, 0.0).yz * _2817;
                            }
                            else
                            {
                                _5396 = vec2(0.0);
                            }
                            _3610 = _2821 > 0.0030000000260770320892333984375;
                            vec2 _5397;
                            if (_3610)
                            {
                                _5397 = _5396 + (textureLod(gCoverage2D, _3574.zx, 0.0).yz * _2821);
                            }
                            else
                            {
                                _5397 = _5396;
                            }
                            _3626 = _2826 > 0.0030000000260770320892333984375;
                            vec2 _5398;
                            if (_3626)
                            {
                                _5398 = _5397 + (textureLod(gCoverage2D, _3574.xy, 0.0).yz * _2826);
                            }
                            else
                            {
                                _5398 = _5397;
                            }
                            _3653 = mix(1.0, 0.5, _1786.lUniforms.mpCustomPerMesh.gModelingBaseParamsVec4.w) - 1.0;
                            float _3514 = smoothstep(0.25, 1.0, pow(clamp(_1786.lUniforms.mpCustomPerMesh.gAnimationParamsVec4.z + _5398.x, 0.0, 1.0) * _1786.lUniforms.mpCustomPerMesh.gAnimationParamsVec4.y, 1.0 + (clamp((_3565 - 0.699999988079071044921875) * 9.9999980926513671875, 0.0, 1.0) * _3653)));
                            if (_3514 <= 0.0)
                            {
                                _5413 = 0.0;
                                break;
                            }
                            vec4 _3530 = textureLod(gPerlin3D, _3496 * _1957, _5364 ? 0.0 : 10.0);
                            float _3533 = _3530.y;
                            bool _3743 = _5398.y < 0.5;
                            float _5405;
                            if (_3743)
                            {
                                _5405 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient1.x, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.x, _5398.y * 2.0);
                            }
                            else
                            {
                                _5405 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.x, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient3.x, (_5398.y - 0.5) * 2.0);
                            }
                            float _5406;
                            if (_3743)
                            {
                                _5406 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient1.y, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.y, _5398.y * 2.0);
                            }
                            else
                            {
                                _5406 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.y, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient3.y, (_5398.y - 0.5) * 2.0);
                            }
                            float _5407;
                            if (_3743)
                            {
                                _5407 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient1.z, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.z, _5398.y * 2.0);
                            }
                            else
                            {
                                _5407 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.z, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient3.z, (_5398.y - 0.5) * 2.0);
                            }
                            float _5408;
                            if (_3743)
                            {
                                _5408 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient1.w, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.w, _5398.y * 2.0);
                            }
                            else
                            {
                                _5408 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.w, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient3.w, (_5398.y - 0.5) * 2.0);
                            }
                            _5413 = clamp(((clamp((_3530.w - (_3533 - 1.0)) / (2.0 - _3533), 0.0, 1.0) * (pow(clamp((_3565 - _5405) / (_5406 - _5405), 0.0, 1.0), 0.5) - (1.0 - pow(1.0 - clamp((_3565 - _5407) / (_5408 - _5407), 0.0, 1.0), 0.5)))) - (1.0 - _3514)) / _3514, 0.0, 1.0);
                            break;
                        }
                        if (!_5364)
                        {
                            bool _3057 = _5413 <= 0.0;
                            float _5868;
                            float _5923;
                            if (_3057)
                            {
                                _5923 = _5446;
                                _5868 = _5353 + _2225;
                            }
                            else
                            {
                                float _3069 = 1280.0 / _2218;
                                _5923 = _3069;
                                _5868 = _5353 - _3069;
                            }
                            _5973 = _5598;
                            _5971 = _5584;
                            _5922 = _5923;
                            _5870 = _3057 ? _5364 : true;
                            _5867 = _5868;
                            _5686 = _5354;
                        }
                        else
                        {
                            vec3 _3899 = (_3026 * _1957) * _1786.lUniforms.mpCustomPerMesh.gModelingDetailParamsVec4.w;
                            vec4 _5428;
                            if (_3594)
                            {
                                _5428 = textureLod(gCurl2D, _3899.yz, 0.0) * _2817;
                            }
                            else
                            {
                                _5428 = vec4(0.0);
                            }
                            vec4 _5429;
                            if (_3610)
                            {
                                _5429 = _5428 + (textureLod(gCurl2D, _3899.zx, 0.0) * _2821);
                            }
                            else
                            {
                                _5429 = _5428;
                            }
                            vec4 _5430;
                            if (_3626)
                            {
                                _5430 = _5429 + (textureLod(gCurl2D, _3899.xy, 0.0) * _2826);
                            }
                            else
                            {
                                _5430 = _5429;
                            }
                            vec3 _3913 = _3026 + ((_5430.xyz * (1.0 - _3565)) * _1786.lUniforms.mpCustomPerMesh.gModelingDetailParamsVec4.z);
                            vec4 _3924 = textureLod(gDetail3D, (_3913 * _1957) * _1786.lUniforms.mpCustomPerMesh.gModelingDetailParamsVec4.x, 0.0);
                            float _3925 = _3924.y;
                            float _3944 = mix(_3925, 1.0 - _3925, clamp(clamp((length(_3913) - _1913) / _1930, 0.0, 1.0) * 10.0, 0.0, 1.0)) * _1786.lUniforms.mpCustomPerMesh.gModelingDetailParamsVec4.y;
                            float _3085 = clamp((_5413 - _3944) / (1.0 - _3944), 0.0, 1.0) * _1786.lUniforms.mpCustomPerMesh.gModelingBaseParamsVec4.y;
                            float _5603;
                            float _5621;
                            vec4 _5689;
                            bool _5873;
                            int _5976;
                            if (_3085 <= _1786.lUniforms.mpCustomPerMesh.gModelingBaseParamsVec4.z)
                            {
                                float _5604;
                                float _5622;
                                bool _5874;
                                int _5977;
                                if (_5446 > 0.0)
                                {
                                    float _5605;
                                    float _5623;
                                    if (_5446 <= (80.0 / _2218))
                                    {
                                        _5623 = _5353 + _5446;
                                        _5605 = 0.0;
                                    }
                                    else
                                    {
                                        float _3110 = _5446 * 0.5;
                                        _5623 = _5353 + _3110;
                                        _5605 = _3110;
                                    }
                                    _5977 = _5598;
                                    _5874 = _5364;
                                    _5622 = _5623;
                                    _5604 = _5605;
                                }
                                else
                                {
                                    bool _5879;
                                    int _5979;
                                    if (_5584 <= _1786.lUniforms.mpCustomPerMesh.gModelingBaseParamsVec4.z)
                                    {
                                        int _3121 = _5598 + 1;
                                        bool _3123 = _3121 > 10;
                                        _5979 = _3123 ? 0 : _3121;
                                        _5879 = _3123 ? false : _5364;
                                    }
                                    else
                                    {
                                        _5979 = _5598;
                                        _5879 = _5364;
                                    }
                                    _5977 = _5979;
                                    _5874 = _5879;
                                    _5622 = _5353;
                                    _5604 = _5446;
                                }
                                _5976 = _5977;
                                _5873 = _5874;
                                _5689 = _5354;
                                _5621 = _5622;
                                _5603 = _5604;
                            }
                            else
                            {
                                float _5464;
                                float _5627;
                                if (_5446 > 0.0)
                                {
                                    float _5465;
                                    float _5628;
                                    if (_5446 <= (80.0 / _2218))
                                    {
                                        _5628 = _5353;
                                        _5465 = 0.0;
                                    }
                                    else
                                    {
                                        float _3139 = _5446 * 0.5;
                                        _5628 = _5353 - _3139;
                                        _5465 = _3139;
                                    }
                                    _5627 = _5628;
                                    _5464 = _5465;
                                }
                                else
                                {
                                    _5627 = _5353;
                                    _5464 = _5446;
                                }
                                vec4 _5694;
                                if (_5464 == 0.0)
                                {
                                    float _5467;
                                    vec3 _5540;
                                    _5540 = _3026;
                                    _5467 = 0.0;
                                    vec3 _4057;
                                    float _5556;
                                    for (int _5466 = 0; _5466 < 6; _5540 = _4057, _5467 += _5556, _5466++)
                                    {
                                        _4057 = _5540 + (vec3(_1786.lUniforms.mpCustomPerMesh.gLightConeParamsVec4.x, _1786.lUniforms.mpCustomPerMesh.gLightConeParamsVec4.y, _1786.lUniforms.mpCustomPerMesh.gLightConeParamsVec4.z) + (_1069[_5466] * _1786.lUniforms.mpCustomPerMesh.gLightConeParamsVec4.w));
                                        for (;;)
                                        {
                                            float _4214 = clamp((length(_4057) - _1913) / _1930, 0.0, 1.0);
                                            vec3 _4137 = (_4057 + ((_2828 * _4214) * 500.0)) + _3494;
                                            vec3 _4223 = _4137 * _1961;
                                            vec2 _5542;
                                            if (_3594)
                                            {
                                                _5542 = textureLod(gCoverage2D, _4223.yz, 0.0).yz * _2817;
                                            }
                                            else
                                            {
                                                _5542 = vec2(0.0);
                                            }
                                            vec2 _5543;
                                            if (_3610)
                                            {
                                                _5543 = _5542 + (textureLod(gCoverage2D, _4223.zx, 0.0).yz * _2821);
                                            }
                                            else
                                            {
                                                _5543 = _5542;
                                            }
                                            vec2 _5544;
                                            if (_3626)
                                            {
                                                _5544 = _5543 + (textureLod(gCoverage2D, _4223.xy, 0.0).yz * _2826);
                                            }
                                            else
                                            {
                                                _5544 = _5543;
                                            }
                                            float _4233 = clamp(_1786.lUniforms.mpCustomPerMesh.gAnimationParamsVec4.z + _5544.x, 0.0, 1.0);
                                            if (_4233 < 0.0030000000260770320892333984375)
                                            {
                                                _5556 = 0.0;
                                                break;
                                            }
                                            float _4160 = smoothstep(0.25, 1.0, pow(_4233 * _1786.lUniforms.mpCustomPerMesh.gAnimationParamsVec4.y, 1.0 + (clamp((_4214 - 0.699999988079071044921875) * 9.9999980926513671875, 0.0, 1.0) * _3653)));
                                            vec4 _4172 = textureLod(gPerlin3D, _4137 * _1957, float(_5466));
                                            float _4175 = _4172.y;
                                            bool _4392 = _5544.y < 0.5;
                                            float _5548;
                                            if (_4392)
                                            {
                                                _5548 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient1.x, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.x, _5544.y * 2.0);
                                            }
                                            else
                                            {
                                                _5548 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.x, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient3.x, (_5544.y - 0.5) * 2.0);
                                            }
                                            float _5549;
                                            if (_4392)
                                            {
                                                _5549 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient1.y, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.y, _5544.y * 2.0);
                                            }
                                            else
                                            {
                                                _5549 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.y, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient3.y, (_5544.y - 0.5) * 2.0);
                                            }
                                            float _5550;
                                            if (_4392)
                                            {
                                                _5550 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient1.z, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.z, _5544.y * 2.0);
                                            }
                                            else
                                            {
                                                _5550 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.z, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient3.z, (_5544.y - 0.5) * 2.0);
                                            }
                                            float _5551;
                                            if (_4392)
                                            {
                                                _5551 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient1.w, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.w, _5544.y * 2.0);
                                            }
                                            else
                                            {
                                                _5551 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient2.w, _1786.lUniforms.mpCustomPerMesh.gCloudHeightGradient3.w, (_5544.y - 0.5) * 2.0);
                                            }
                                            float _4189 = clamp((_4172.w - (_4175 - 1.0)) / (2.0 - _4175), 0.0, 1.0) * (pow(clamp((_4214 - _5548) / (_5549 - _5548), 0.0, 1.0), 0.5) - (1.0 - pow(1.0 - clamp((_4214 - _5550) / (_5551 - _5550), 0.0, 1.0), 0.5)));
                                            if (_4189 <= 0.0)
                                            {
                                                _5556 = 0.0;
                                                break;
                                            }
                                            _5556 = clamp((_4189 - (1.0 - _4160)) / _4160, 0.0, 1.0) * _1786.lUniforms.mpCustomPerMesh.gModelingBaseParamsVec4.y;
                                            break;
                                        }
                                    }
                                    float _4556 = -_5467;
                                    bool _4655 = _3001 < _1786.lUniforms.mpCustomPerMesh.gLightingParamsVec4.z;
                                    float _6027 = _4655 ? _1786.lUniforms.mpCustomPerMesh.gLightScatteringParamsVec4.z : _1786.lUniforms.mpCustomPerMesh.gLightScatteringParamsVec4.y;
                                    float _4716 = _6027 * _6027;
                                    float _4729 = (1.0 - _4716) / (12.56637096405029296875 * pow((1.0 + _4716) - ((2.0 * _6027) * _3001), 1.5));
                                    float _5472;
                                    if (_4655)
                                    {
                                        _5472 = _1786.lUniforms.mpCustomPerMesh.gLightScatteringParamsVec4.w * _4729;
                                    }
                                    else
                                    {
                                        _5472 = _4729;
                                    }
                                    float _4685 = exp(_4556 * _1786.lUniforms.mpCustomPerMesh.gLightScatteringParamsVec4.x);
                                    float _4687 = pow(_4685, 0.25);
                                    float _4688 = _4687 * 0.699999988079071044921875;
                                    vec3 _4599 = (((_1786.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * ((((0.0500000007450580596923828125 + pow(_3085, 0.5 + (clamp((_3565 - 0.300000011920928955078125) * 1.8181817531585693359375, 0.0, 1.0) * 1.5))) * pow(0.100000001490116119384765625 + (clamp((_3565 - 0.070000000298023223876953125) * 14.28571414947509765625, 0.0, 1.0) * 0.89999997615814208984375), 0.800000011920928955078125)) * max(_4688 + (clamp((_3001 - 0.699999988079071044921875) * 3.3333332538604736328125, 0.0, 1.0) * ((_4687 * 0.17499999701976776123046875) - _4688)), _4685)) * _5472)) * _1786.lUniforms.mpCustomPerMesh.gLightingParamsVec4.x) + (mix(_1786.lUniforms.mpCustomPerMesh.gCloudBaseColour.xyz, _1786.lUniforms.mpCustomPerMesh.gCloudTopColour.xyz, vec3(pow(_3565, 0.5) * exp(_4556 * _1786.lUniforms.mpCustomPerMesh.gCoverageParamsVec4.w))) * _1786.lUniforms.mpCustomPerMesh.gLightingParamsVec4.y)).xyz * _3085;
                                    vec4 _5229 = vec4(_4599.x, _4599.y, _4599.z, _6013.w);
                                    _5229.w = _3085;
                                    _5694 = (_5229 * (1.0 - _5354.w)) + _5354;
                                }
                                else
                                {
                                    _5694 = _5354;
                                }
                                _5976 = _5598;
                                _5873 = _5364;
                                _5689 = _5694;
                                _5621 = _5627;
                                _5603 = _5464;
                            }
                            float _5869;
                            if (_5603 == 0.0)
                            {
                                _5869 = _5621 + (512.0 / _2218);
                            }
                            else
                            {
                                _5869 = _5621;
                            }
                            _5973 = _5976;
                            _5971 = _3085;
                            _5922 = _5603;
                            _5870 = _5873;
                            _5867 = _5869;
                            _5686 = _5689;
                        }
                    }
                    _5802 = _5354;
                }
                else
                {
                    _5802 = vec4(0.0);
                }
                vec4 _5804;
                if (_5697 >= 0.00999999977648258209228515625)
                {
                    vec3 _3198 = vec3(_5697);
                    vec3 _3199 = mix(_1786.lUniforms.mpCustomPerMesh.gCloudTopColour.xyz, _1786.lUniforms.mpCustomPerMesh.gCloudBaseColour.xyz, _3198);
                    vec4 _5232 = vec4(_3199.x, _3199.y, _3199.z, _6013.w);
                    _5232.w = _5697;
                    vec3 _3216 = clamp((_5232.xyz / _3198).xyz, vec3(0.0), vec3(1.0));
                    vec4 _3218 = vec4(_3216.x, _3216.y, _3216.z, _5232.w);
                    vec4 _5805;
                    if (_2039 > _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.w)
                    {
                        _5805 = (_3218 * _5697) + (_5802 * (1.0 - _5697));
                    }
                    else
                    {
                        _5805 = (_5802 * _5802.w) + (_3218 * (1.0 - _5802.w));
                    }
                    _5804 = _5805;
                }
                else
                {
                    _5804 = _5802;
                }
                vec4 _5807;
                if (_6025)
                {
                    _5807 = _5804 * (_1786.lUniforms.mpCustomPerMesh.gOptimisationParamsVec4.z + (smoothstep(_2277, _2277 + ((_2275 + 1.0) * mix(_1786.lUniforms.mpCustomPerMesh.gOptimisationParamsVec4.w, 0.0, clamp(_2039 / _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.z, 0.0, 1.0))), _2271) * (1.0 - _1786.lUniforms.mpCustomPerMesh.gOptimisationParamsVec4.z)));
                }
                else
                {
                    _5807 = _5804;
                }
                _5806 = _5807;
            }
            else
            {
                _5806 = vec4(0.0);
            }
            vec4 _3275 = clamp(_5806, vec4(0.0), vec4(1.0));
            float _2419 = _3275.w * (1.0 - smoothstep(_1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.w * 4.0, _1786.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.w * 5.0, _2039));
            vec4 _5240 = _3275;
            _5240.w = _2419;
            vec3 _2443 = (_5240.xyz * _2419).xyz * ((dot(normalize(_1786.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz), -_1786.lUniforms.mpCustomPerMesh.gSunPositionVec4.xyz) * 0.3499999940395355224609375) + 0.64999997615814208984375);
            _5808 = vec4(_2443.x, _2443.y, _2443.z, _5240.w);
        }
        out_color0 = _5808;
        out_color1 = vec4(max(_5272 ? 0.0 : _5813, 40.0) * _1786.lUniforms.mpPerFrame.gClipPlanesVec4.w);
        break;
    }
}


