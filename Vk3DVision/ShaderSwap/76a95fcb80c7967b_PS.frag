#version 450
//specs
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

layout(set = 0, binding = 0, std140) uniform lUniforms_BLK
{
    UniformBuffer lUniforms;
} _664;

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
layout(set = 0, binding = 45, std140) uniform Vk3DParams
{
    vec4 stereo;
    vec4 custom_params;
} vk3d_params;

layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 9) uniform sampler2DArray gLightCookiesMap;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 2) uniform sampler2D gBuffer2Map;
layout(set = 1, binding = 3) uniform sampler2D gBuffer3Map;
layout(set = 1, binding = 4) uniform sampler2D gBuffer4Map;

layout(location = 0) in VertexBlock
{
    vec4 mScreenSpacePositionVec4;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _2329;

void main()
{
    vec2 _643 = In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w);
    vec2 _1745 = (vec2(_643.x, 1.0 - _643.y) * 2.0) - vec2(1.0);
    vec4 _2285 = vec4(_1745.x, _1745.y, _2329.z, _2329.w);
    _2285.z = (((_664.lUniforms.mpPerFrame.gClipPlanesVec4.x * _664.lUniforms.mpPerFrame.gClipPlanesVec4.y) / (texture(gBuffer1Map, _643).x * _664.lUniforms.mpPerFrame.gClipPlanesVec4.y)) - _664.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_664.lUniforms.mpPerFrame.gClipPlanesVec4.y - _664.lUniforms.mpPerFrame.gClipPlanesVec4.x);
    
    _2285.x -= vk3d_params.stereo.x;
	
    vec4 _2287a = _2285;
    _2287a.w = 1.0;
    vec4 _1755a = _664.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2287a;
    vec3 _1771a = (_1755a.xyz / vec3(_1755a.w)).xyz;
    vec3 _724a = _664.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * _664.lUniforms.mpCommonPerMesh.gLightColourVec4.w;
    vec3 _747spec = _664.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz - _1771a;
	
	_2285.x += vk3d_params.stereo.x * vk3d_params.stereo.y * _2285.z * 10;
    
    vec4 _2287 = _2285;
    _2287.w = 1.0;
    vec4 _1755 = _664.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _2287;
    vec3 _1771 = (_1755.xyz / vec3(_1755.w)).xyz;
    vec3 _724 = _664.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * _664.lUniforms.mpCommonPerMesh.gLightColourVec4.w;
    vec3 _747 = _664.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.xyz - _1771;
    float _2332;
    if (_664.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.w == 2.0)
    {
        float _761 = _664.lUniforms.mpCommonPerMesh.gLightColourVec4.w / max(1.0, dot(_747, _747));
        if (_761 <= 0.052631579339504241943359375)
        {
            discard;
        }
        _2332 = _761;
    }
    else
    {
        float _2333;
        if (_664.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.w == 1.0)
        {
            float _786 = min(inversesqrt(dot(_747spec, _747spec)), 1.0) * _664.lUniforms.mpCommonPerMesh.gLightColourVec4.w;
            if (_786 <= 0.052631579339504241943359375)
            {
                discard;
            }
            _2333 = _786;
        }
        else
        {
            float _2334;
            if (_664.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.w == 0.0)
            {
                _2334 = _664.lUniforms.mpCommonPerMesh.gLightColourVec4.w;
            }
            else
            {
                float _2335;
                if (_664.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.w == 1.5)
                {
                    float _813 = inversesqrt(dot(_747spec, _747spec));
                    float _822 = min(_813 * sqrt(_813), 1.0) * _664.lUniforms.mpCommonPerMesh.gLightColourVec4.w;
                    if (_822 <= 0.052631579339504241943359375)
                    {
                        discard;
                    }
                    _2335 = _822;
                }
                else
                {
                    float _2336;
                    if (_664.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.w == 3.0)
                    {
                        float _841 = dot(_747spec, _747spec);
                        float _850 = min(inversesqrt(_841) / _841, 1.0) * _664.lUniforms.mpCommonPerMesh.gLightColourVec4.w;
                        if (_850 <= 0.052631579339504241943359375)
                        {
                            discard;
                        }
                        _2336 = _850;
                    }
                    else
                    {
                        float _874 = min(1.0 / pow(dot(_747spec, _747spec), 0.5 * _664.lUniforms.mpCommonPerMesh.gSpotlightPositionVec4.w), 1.0) * _664.lUniforms.mpCommonPerMesh.gLightColourVec4.w;
                        if (_874 <= 0.052631579339504241943359375)
                        {
                            discard;
                        }
                        _2336 = _874;
                    }
                    _2335 = _2336;
                }
                _2334 = _2335;
            }
            _2333 = _2334;
        }
        _2332 = _2333;
    }
    vec3 _886 = normalize(_747);
    float _2342;
    vec3 _2351;
    if (_664.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w > (-2.0))
    {
        vec3 _900 = -_886;
        float _911 = _2332 * clamp((dot(_664.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz, _900) - _664.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w) * 5.0, 0.0, 1.0);
        if (_911 <= 0.052631579339504241943359375)
        {
            discard;
        }
        vec3 _2352;
        if (_664.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.w >= 0.0)
        {
            _2352 = _724 * texture(gLightCookiesMap, vec3((vec2(dot(_900, cross(_664.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.xyz, _664.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.xyz)), -dot(_900, _664.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.xyz)) / vec2(abs(sin(acos(_664.lUniforms.mpCommonPerMesh.gSpotlightDirectionVec4.w))) * 2.0)) + vec2(0.5), _664.lUniforms.mpCommonPerMesh.gSpotlightUpVec4.w)).x;
        }
        else
        {
            _2352 = _724;
        }
        _2351 = _2352;
        _2342 = _911;
    }
    else
    {
        _2351 = _724;
        _2342 = _2332;
    }
    float _984 = max((_2342 - 0.0500000007450580596923828125) * 1.0526316165924072265625, 0.0);
    vec3 _989 = _1771a + _664.lUniforms.mpPerFrame.gViewPositionVec3;
    vec4 _1010 = texture(gBufferMap, _643);
    vec4 _1015 = texture(gBuffer2Map, _643);
    vec4 _1020 = texture(gBuffer3Map, _643);
    float _1819 = _1010.w;
    float _1823 = (_1819 * _1819) * 4.0;
    vec3 _1999 = (_1015.xyz * 2.0) - vec3(1.0);
    int _1830 = int(_1020.x * 255.0);
    float _1832 = _1020.y;
    float _1834 = _1020.z;
    vec3 _1073 = _1010.xyz * mat3(vec3(0.7767217159271240234375, 0.1715466976165771484375, 0.0518387891352176666259765625), vec3(0.0330350138247013092041015625, 0.9576499462127685546875, 0.00929595343768596649169921875), vec3(0.01708533428609371185302734375, 0.072395719587802886962890625, 0.9103014469146728515625));
    vec3 _2405;
    if ((_1830 & 8) != 0)
    {
        _2405 = _1073 * _984;
    }
    else
    {
        vec4 _1089 = texture(gBuffer4Map, _643);
        float _2380;
        if (_664.lUniforms.mpCustomPerMesh.gRainParametersVec4.x > 0.0)
        {
            vec3 _2004 = vec3(_664.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w);
            float _1118 = dot(normalize((_989 / _2004) - (_664.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz / _2004)), _1999);
            float _1125 = abs(_1118);
            _2380 = mix(_1832, 1.0 - (clamp((1.0 - _1832) * 3.0, 0.0, 1.0) * (1.0 - clamp((_1125 * _1125) * _1125, 0.0, (_1118 < 0.0) ? 1.0 : 0.699999988079071044921875))), _664.lUniforms.mpCustomPerMesh.gRainParametersVec4.x);
        }
        else
        {
            _2380 = _1832;
        }
        vec3 _2056 = normalize(_664.lUniforms.mpPerFrame.gViewPositionVec3 - _989);
        vec3 _2070 = _1073 * _1834;
        vec4 _2169 = (vec4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _2380) + vec4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
        float _2171 = _2169.x;
        vec2 _2189 = (vec2(-1.03999996185302734375, 1.03999996185302734375) * ((min(_2171 * _2171, exp2((-9.27999973297119140625) * clamp(dot(_1999, _2056), 0.0, 1.0))) * _2171) + _2169.y)) + _2169.zw;
        vec2 _2225 = (vec2(0.721347510814666748046875, 0.25) * exp2(((-6.888868808746337890625) * _2380) + 6.888868808746337890625)) + vec2(0.3967411220073699951171875, 0.75);
        float _2229 = _2225.x;
        _2405 = min(vec3(1.14999997615814208984375), mix(vec3(0.0), ((_2351 * mat3(vec3(0.7767217159271240234375, 0.1715466976165771484375, 0.0518387891352176666259765625), vec3(0.0330350138247013092041015625, 0.9576499462127685546875, 0.00929595343768596649169921875), vec3(0.01708533428609371185302734375, 0.072395719587802886962890625, 0.9103014469146728515625))) * (clamp(dot(_1999, _886), 0.0, 1.0) + ((pow(clamp(dot(_2056, -_886), 0.0, 1.0), 4.0) + (((_1830 & 128) != 0) ? 0.25 : 0.0)) * _1020.w))) * ((_1073 - _2070) + ((((vec3(0.039999999105930328369140625 - (0.039999999105930328369140625 * _1834)) + _2070) * _2189.x) + vec3(_2189.y)) * (_2225.y * exp2((_2229 * clamp(dot(reflect(-_2056, _1999), _886), 0.0, 1.0)) - _2229)))), vec3(mix(0.61000001430511474609375, 1.0, _1089.x))) * _984);
    }
    vec3 _2406;
    if ((_1830 & 64) != 0)
    {
        _2406 = _2405 + (_1073 * mix(_1823, _1823 * sqrt(_1823), clamp(_1823 - 1.0, 0.0, 1.0)));
    }
    else
    {
        _2406 = _2405;
    }
    out_color0 = vec4(_2406, 1.0);
}


