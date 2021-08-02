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
} _2221;

layout(set = 1, binding = 5) uniform sampler2D gCausticMap;
layout(set = 1, binding = 6) uniform sampler2D gCausticOffsetMap;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 2) uniform sampler2D gBuffer2Map;
layout(set = 1, binding = 3) uniform sampler2D gBuffer3Map;
layout(set = 1, binding = 4) uniform sampler2D gBuffer4Map;
layout(set = 1, binding = 10) uniform sampler2D gDualPMapBack;
layout(set = 1, binding = 9) uniform sampler2D gDualPMapFront;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
    flat mat3 mUpMatrix;
} In;

layout(location = 0) out vec4 out_color0;
layout(location = 1) out vec4 out_color1;

vec4 _6019;
vec4 _6135;

void main()
{
    vec4 _2209 = texture(gBuffer1Map, In.mTexCoordsVec2);
    vec2 _3267 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
    vec4 _5849 = vec4(_3267.x, _3267.y, _6019.z, _6019.w);
    _5849.z = 0.0;
    
    _5849.x -= vk3d_params.stereo.x;
	
    vec4 _5851a = _5849;
    _5851a.w = 1.0;
    vec4 _3274a = _2221.lUniforms.mpPerFrame.gInverseProjectionMat4 * _5851a;
    mat4 _5854a = _2221.lUniforms.mpPerFrame.gInverseViewMat4;
    _5854a[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec3 _3292a = (_5854a * ((_3274a / vec4(abs(_3274a.z))) * (_2209.x * _2221.lUniforms.mpPerFrame.gClipPlanesVec4.y))).xyz + _2221.lUniforms.mpPerFrame.gViewPositionVec3;
    vec3 _3296spec = _3292a.xyz;
	
	_5849.x += vk3d_params.stereo.x * vk3d_params.stereo.y / (_2209.x * _2221.lUniforms.mpPerFrame.gClipPlanesVec4.y);
    
    vec4 _5851 = _5849;
    _5851.w = 1.0;
    vec4 _3274 = _2221.lUniforms.mpPerFrame.gInverseProjectionMat4 * _5851;
    mat4 _5854 = _2221.lUniforms.mpPerFrame.gInverseViewMat4;
    _5854[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec3 _3292 = (_5854 * ((_3274 / vec4(abs(_3274.z))) * (_2209.x * _2221.lUniforms.mpPerFrame.gClipPlanesVec4.y))).xyz + _2221.lUniforms.mpPerFrame.gViewPositionVec3;
    vec3 _3296 = _3292.xyz;
    vec3 _2283 = -_2221.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz;
    vec3 _2299 = (_2221.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz * _2221.lUniforms.mpCommonPerMesh.gLightColourVec4.w) * mat3(vec3(0.7767217159271240234375, 0.1715466976165771484375, 0.0518387891352176666259765625), vec3(0.0330350138247013092041015625, 0.9576499462127685546875, 0.00929595343768596649169921875), vec3(0.01708533428609371185302734375, 0.072395719587802886962890625, 0.9103014469146728515625));
    vec4 _2305 = texture(gBufferMap, In.mTexCoordsVec2);
    vec4 _2310 = texture(gBuffer2Map, In.mTexCoordsVec2);
    vec4 _2315 = texture(gBuffer3Map, In.mTexCoordsVec2);
    float _3387 = _2305.w;
    float _3391 = (_3387 * _3387) * 4.0;
    vec3 _3567 = (_2310.xyz * 2.0) - vec3(1.0);
    int _3398 = int(_2315.x * 255.0);
    float _3400 = _2315.y;
    float _3402 = _2315.z;
    vec3 _2367 = _2305.xyz * mat3(vec3(0.7767217159271240234375, 0.1715466976165771484375, 0.0518387891352176666259765625), vec3(0.0330350138247013092041015625, 0.9576499462127685546875, 0.00929595343768596649169921875), vec3(0.01708533428609371185302734375, 0.072395719587802886962890625, 0.9103014469146728515625));
    vec3 _6067;
    vec3 _6076;
    if ((_3398 & 8) != 0)
    {
        _6076 = vec3(0.0);
        _6067 = _2367 * 1.0;
    }
    else
    {
        vec4 _2387 = texture(gBuffer4Map, In.mTexCoordsVec2);
        float _6031;
        if (_2221.lUniforms.mpCustomPerMesh.gRainParametersVec4.x > 0.0)
        {
            vec3 _3572 = vec3(_2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w);
            float _2415 = dot(normalize((_3296spec / _3572) - (_2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz / _3572)), _3567);
            float _2421 = abs(_2415);
            _6031 = mix(_3400, 1.0 - (clamp((1.0 - _3400) * 3.0, 0.0, 1.0) * (1.0 - clamp((_2421 * _2421) * _2421, 0.0, (_2415 < 0.0) ? 1.0 : 0.699999988079071044921875))), _2221.lUniforms.mpCustomPerMesh.gRainParametersVec4.x);
        }
        else
        {
            _6031 = _3400;
        }
        vec3 _3811 = vec3(_2221.lUniforms.mpCommonPerMesh.gLightOriginVec4.w);
        float _3634 = dot(normalize((_3296spec / _3811) - (_2221.lUniforms.mpCommonPerMesh.gLightOriginVec4.xyz / _3811)), _3567);
        vec3 _3639 = normalize(_2221.lUniforms.mpPerFrame.gViewPositionVec3 - _3296spec);
        vec3 _3663 = _2367 * _3402;
        vec3 _3664 = _2367 - _3663;
        vec4 _3832 = (vec4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _6031) + vec4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
        float _3834 = _3832.x;
        vec2 _3852 = (vec2(-1.03999996185302734375, 1.03999996185302734375) * ((min(_3834 * _3834, exp2((-9.27999973297119140625) * clamp(dot(_3567, _3639), 0.0, 1.0))) * _3834) + _3832.y)) + _3832.zw;
        vec3 _3860 = ((vec3(0.039999999105930328369140625 - (0.039999999105930328369140625 * _3402)) + _3663) * _3852.x) + vec3(_3852.y);
        vec3 _3682 = reflect(-_3639, _3567);
        float _3877 = (pow(clamp(dot(_3639, _2221.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz), 0.0, 1.0), 4.0) + (((_3398 & 128) != 0) ? 0.25 : 0.0)) * _2315.w;
        vec3 _3714 = In.mUpMatrix * _3682;
        vec3 _3717 = In.mUpMatrix * _3567;
        float _3901 = _3714.z;
        vec2 _3905 = _3714.xy / vec2(1.0 + abs(_3901));
        float _3908 = 0.5 * _3905.x;
        vec2 _5903 = _3905;
        _5903.x = _3908 + 0.5;
        vec2 _5906 = _5903;
        _5906.y = ((-0.5) * _3905.y) + 0.5;
        float _3919 = float(_3901 > 0.0);
        vec2 _6039;
        if (_3919 > 0.0)
        {
            vec2 _5910 = _5906;
            _5910.x = 0.5 - _3908;
            _6039 = _5910;
        }
        else
        {
            _6039 = _5906;
        }
        float _3931 = float(int(min(_6031, 0.9900000095367431640625) * 7.0));
        float _3968 = _3717.z;
        vec2 _3972 = _3717.xy / vec2(1.0 + abs(_3968));
        float _3975 = 0.5 * _3972.x;
        vec2 _5914 = _3972;
        _5914.x = _3975 + 0.5;
        vec2 _5917 = _5914;
        _5917.y = ((-0.5) * _3972.y) + 0.5;
        float _3986 = float(_3968 > 0.0);
        vec2 _6040;
        if (_3986 > 0.0)
        {
            vec2 _5921 = _5917;
            _5921.x = 0.5 - _3975;
            _6040 = _5921;
        }
        else
        {
            _6040 = _5917;
        }
        vec3 _3762 = (_2221.lUniforms.mpCustomPerMesh.gLightTopColourVec4.xyz * mix(0.0, pow(clamp((_3634 + 1.0) * 0.5, 0.0, 1.0), 2.0), _2221.lUniforms.mpCustomPerMesh.gLightTopColourVec4.w)) + (mix(((textureLod(gDualPMapBack, _6040, 3.0) * _3986) + (textureLod(gDualPMapFront, _6040, 3.0) * (1.0 - _3986))).xyz, vec3(0.0), bvec3((_3398 & 32) != 0)) * mix(1.0, pow(clamp((1.0 - _3634) * 0.5, 0.0, 1.0), 4.0), _2221.lUniforms.mpCustomPerMesh.gLightTopColourVec4.w));
        vec2 _4022 = (vec2(0.721347510814666748046875, 0.25) * exp2(((-6.888868808746337890625) * _6031) + 6.888868808746337890625)) + vec2(0.3967411220073699951171875, 0.75);
        float _4026 = _4022.x;
        vec3 _3779 = _3664 + (_3860 * (_4022.y * exp2((_4026 * clamp(dot(_3682, _2283), 0.0, 1.0)) - _4026)));
        vec3 _3800 = vec3(mix(0.25, 1.0, _2387.x));
        _6076 = mix(vec3(0.0), ((_2299 * (clamp(dot(_3567, _2283), 0.0, 1.0) + (_3877 * 0.800000011920928955078125))) * _3779) + (((textureLod(gDualPMapBack, _6039, _3931) * _3919) + (textureLod(gDualPMapFront, _6039, _3931) * (1.0 - _3919))).xyz * _3860), _3800);
        _6067 = min(vec3(1.14999997615814208984375), mix((_3664 * _3762) * 0.5, ((_2299 * (_3877 * 0.20000000298023223876953125)) + (_3762 * (0.5 + (_6031 * 0.5)))) * _3779, _3800) * 1.0);
    }
    vec3 _6068;
    if ((_3398 & 64) != 0)
    {
        _6068 = _6067 + (_2367 * mix(_3391, _3391 * sqrt(_3391), clamp(_3391 - 1.0, 0.0, 1.0)));
    }
    else
    {
        _6068 = _6067;
    }
    vec3 _6110;
    vec3 _6111;
    if ((_3398 & 4) == 0)
    {
        vec4 _2655 = vec4(_6068, 1.0);
        vec4 _6089;
        vec3 _6091;
        if (_2221.lUniforms.mpCustomPerMesh.gWaterFogVec4.x > 0.0)
        {
            vec3 _4105 = _2221.lUniforms.mpPerFrame.gViewPositionVec3 - _2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
            float _4106 = length(_4105);
            float _4109 = _4106 - _2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
            float _4113 = clamp((_4109 - 700.0) * 0.004999999888241291046142578125, 0.0, 1.0);
            vec3 _4128 = _3296 - _2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
            float _4140 = _2221.lUniforms.mpCustomPerMesh.gWaterFogVec4.x + _2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w;
            vec3 _4142 = _2655.xyz;
            vec3 _4268 = normalize(_4128) * _4140;
            float _4271 = length(_4128);
            vec3 _6077;
            vec3 _6078;
            if ((_4140 - _4271) >= 0.0)
            {
                vec2 _4286 = vec2((_2221.lUniforms.mpPerFrame.gfTime * 0.014999999664723873138427734375) + 7.0, _2221.lUniforms.mpPerFrame.gfTime * (-0.014999999664723873138427734375));
                vec3 _4356 = pow(abs(_3567), vec3(64.0));
                float _4389 = _4356.x;
                float _4393 = _4356.y;
                float _4398 = _4356.z;
                vec3 _4409 = vec3((_4389 + _4393) + _4398);
                vec3 _4410 = (((texture(gCausticOffsetMap, (_4128.yz * 0.00999999977648258209228515625) + _4286).xyz * _4389) + (texture(gCausticOffsetMap, (_4128.zx * 0.00999999977648258209228515625) + _4286).xyz * _4393)) + (texture(gCausticOffsetMap, (_4128.xy * 0.00999999977648258209228515625) + _4286).xyz * _4398)) / _4409;
                float _4291 = _4410.y;
                vec2 _4295 = vec2(_4291, 1.0 - _4291);
                vec2 _4305 = (_4295 * 0.0599999986588954925537109375) + vec2(_2221.lUniforms.mpPerFrame.gfTime * 0.0074999998323619365692138671875, (_2221.lUniforms.mpPerFrame.gfTime * 0.00624999962747097015380859375) + 7.0);
                vec2 _4423 = _4268.yz;
                vec2 _4429 = _4268.zx;
                vec2 _4435 = _4268.xy;
                vec2 _4325 = (_4295 * 0.0500000007450580596923828125) + vec2((_2221.lUniforms.mpPerFrame.gfTime * 0.004999999888241291046142578125) + 5.0, _2221.lUniforms.mpPerFrame.gfTime * (-0.00624999962747097015380859375));
                vec3 _4336 = vec3(((((((texture(gCausticMap, (_4423 * 0.039999999105930328369140625) + _4305).xyz * _4389) + (texture(gCausticMap, (_4429 * 0.039999999105930328369140625) + _4305).xyz * _4393)) + (texture(gCausticMap, (_4435 * 0.039999999105930328369140625) + _4305).xyz * _4398)) / _4409).y + ((((texture(gCausticMap, (_4423 * 0.02999999932944774627685546875) + _4325).xyz * _4389) + (texture(gCausticMap, (_4429 * 0.02999999932944774627685546875) + _4325).xyz * _4393)) + (texture(gCausticMap, (_4435 * 0.02999999932944774627685546875) + _4325).xyz * _4398)) / _4409).y) * 1.2999999523162841796875) + 0.60000002384185791015625);
                _6078 = _6076 * _4336;
                _6077 = _4142 * _4336;
            }
            else
            {
                _6078 = _6076;
                _6077 = _4142;
            }
            vec3 _4176 = vec3(max(_4113, clamp((length(_2221.lUniforms.mpPerFrame.gViewPositionVec3 - _3296) - 200.0) * 0.00999999977648258209228515625, 0.0, 1.0)));
            vec3 _4177 = mix(mix(_4142, _6077, vec3(1.0 - clamp(_4271 - (_4140 - 2.0), 0.0, 1.0))), _4142, _4176);
            vec3 _4186 = mix(_6076, _6078, _4176);
            vec4 _6090;
            vec3 _6092;
            if ((_3398 & 16) == 0)
            {
                vec3 _4196 = _4177.xyz;
                float _4630 = _2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _2221.lUniforms.mpCustomPerMesh.gWaterFogVec4.x;
                bool _4631 = _4106 <= _4630;
                bool _4641;
                if (!_4631)
                {
                    _4641 = _4271 <= _4630;
                }
                else
                {
                    _4641 = _4631;
                }
                vec3 _6083;
                vec3 _6085;
                if (_4641)
                {
                    float _4655 = length(_4128 - _4105);
                    float _4658 = _4655 * _2221.lUniforms.mpCustomPerMesh.gWaterFogVec4.y;
                    float _4669 = _4655 * _2221.lUniforms.mpCustomPerMesh.gWaterFogVec4.z;
                    float _4680 = _4655 * _2221.lUniforms.mpCustomPerMesh.gWaterFogVec4.w;
                    float _6080;
                    if (_4106 > _4630)
                    {
                        _6080 = 1.0 - clamp(_4271 - (_4630 - 1.0), 0.0, 1.0);
                    }
                    else
                    {
                        _6080 = 1.0;
                    }
                    vec3 _4725 = vec3((_6080 * (1.0 - clamp((_4109 - 250.0) * 0.004999999888241291046142578125, 0.0, 1.0))) * (1.0 - clamp(1.0 / exp(_4680 * _4680), 1.0 - _2221.lUniforms.mpCustomPerMesh.gWaterFogColourNearVec4.w, 1.0)));
                    vec3 _4735 = vec3(clamp((_6080 * (1.0 - _4113)) * (1.0 - clamp(1.0 / exp(_4658 * _4658), 0.0, 1.0)), 0.0, 1.0));
                    _6085 = mix(mix(_4186, _4186 * _2221.lUniforms.mpCustomPerMesh.gWaterFogColourNearVec4.xyz, _4725), vec3(0.0), _4735);
                    _6083 = mix(mix(_4196, _4196 * _2221.lUniforms.mpCustomPerMesh.gWaterFogColourNearVec4.xyz, _4725), mix(_2221.lUniforms.mpCustomPerMesh.gWaterFogColourNearVec4.xyz, _2221.lUniforms.mpCustomPerMesh.gWaterFogColourFarVec4.xyz, vec3(clamp(1.0 - clamp(1.0 / exp(_4669 * _4669), 0.0, 1.0), 0.0, 1.0))) * _2221.lUniforms.mpCommonPerMesh.gLightColourVec4.xyz, _4735);
                }
                else
                {
                    _6085 = _4186;
                    _6083 = _4196;
                }
                _6092 = _6085;
                _6090 = vec4(_6083.x, _6083.y, _6083.z, _2655.w);
            }
            else
            {
                _6092 = _4186;
                _6090 = vec4(_4177.x, _4177.y, _4177.z, _2655.w);
            }
            _6091 = _6092;
            _6089 = _6090;
        }
        else
        {
            _6091 = _6076;
            _6089 = _2655;
        }
        vec2 _4210 = (vec4(In.mTexCoordsVec2, 1.0, 1.0).xy * 0.5) + vec2(0.5);
        vec3 _6096;
        vec3 _6097;
        for (;;)
        {
            if (_2221.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.w <= 0.0)
            {
                _6097 = _6091;
                _6096 = _6089.xyz;
                break;
            }
            float _4800 = length(_3296spec - _2221.lUniforms.mpCommonPerMesh.gScanParamsPosVec4.xyz);
            float _4802 = 2.0 / _4800;
            float _4805 = 1.0 / _2221.lUniforms.mpCommonPerMesh.gScanParamsPosVec4.w;
            float _4813 = ((_4800 * _2221.lUniforms.mpCommonPerMesh.gScanParamsPosVec4.w) * _4805) * _4802;
            float _4819 = (pow(_2221.lUniforms.mpCommonPerMesh.gScanParamsCfg2Vec4.w, 3.0) * _4805) * _4802;
            float _4823 = abs(_4819 - _4813);
            float _4831 = 1.0 - (_4823 * 6.0);
            float _4833 = clamp(_4831, -0.0, 1.0);
            float _4842 = smoothstep(0.0, 1.10000002384185791015625, pow(clamp(_4831 - ((_4813 - _4819) * 5.80000019073486328125), 0.0, 1.0), 8.0));
            vec3 _4862 = vec3(_4842);
            float _4876 = clamp(sin((_4210.y * 1500.0) + (_2221.lUniforms.mpPerFrame.gfTime * 5.0)) * 0.800000011920928955078125, 0.0, 1.0);
            vec3 _4882 = vec3(_4876 * _4842);
            vec3 _4893 = mix(mix(_6089.xyz, mix(_2221.lUniforms.mpCommonPerMesh.gScanParamsCfg2Vec4.xyz, _2221.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.xyz, vec3(_4823 * 3.0)), _4862), _2221.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.xyz, _4882) + (vec3(1.0) * (smoothstep(0.87999999523162841796875, 0.980000019073486328125, _4833 * _4833) * 5.0));
            vec3 _4925 = vec3(0.89999997615814208984375 * _2221.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.w);
            _6097 = mix(_6091, mix(mix(_6091, vec3(0.0), _4862), vec3(0.0), _4882), _4925);
            _6096 = mix(mix(_6089.xyz, vec3(0.0), vec3((((1.0 - (((_4893.x * 0.300000011920928955078125) + (_4893.y * 0.589999973773956298828125)) + (_4893.z * 0.10999999940395355224609375))) * _4876) * _4842) * _2221.lUniforms.mpCommonPerMesh.gScanParamsCfg1Vec4.w)), _4893, _4925);
            break;
        }
        vec4 _6107;
        vec3 _6108;
        for (;;)
        {
            if (_2221.lUniforms.mpCustomPerMesh.gMaterialSFXColVec4.w <= 0.0)
            {
                _6108 = _6097;
                _6107 = vec4(_6096.x, _6096.y, _6096.z, _6135.w);
                break;
            }
            float _5009 = abs(_2221.lUniforms.mpCustomPerMesh.gMaterialSFXVec4.y);
            int _5015 = int(_2221.lUniforms.mpCustomPerMesh.gMaterialSFXVec4.w);
            float _5019 = float(_5015 & 15) * 0.066666670143604278564453125;
            float _5027 = float(_5015 & 64) * 0.015625;
            float _5031 = float(_5015 & 128) * 0.0078125;
            float _5041 = _2221.lUniforms.mpPerFrame.gfTime * step(0.0, _2221.lUniforms.mpCustomPerMesh.gMaterialSFXVec4.x);
            float _5044 = _5041 * 2.0;
            float _5050 = _5041 * 3.0;
            float _5072 = (0.4000000059604644775390625 * step(0.89999997615814208984375, sin(_5041 + (9.0 * cos(_5050))))) * ((sin(_5041) * sin(_5041 * 20.0)) + (0.5 + ((0.100000001490116119384765625 * sin(_5041 * 2000.0)) * cos(_5041))));
            float _5083 = ((length(_3296spec - _2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz) - _2221.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w) * (1.0 - _5031)) + (_3292.y * _5031);
            float _5094 = 1.0 - clamp(dot(normalize(_2221.lUniforms.mpPerFrame.gViewPositionVec3 - _3296spec), _3567), 0.0, 1.0);
            float _5101 = pow(_5094, ((sin(_5044) * 0.5) + 1.0) * abs(_2221.lUniforms.mpCustomPerMesh.gMaterialSFXVec4.z));
            vec3 _5111 = mix(vec3(1.0), _2221.lUniforms.mpCustomPerMesh.gMaterialSFXColVec4.xyz, vec3(smoothstep(0.25, 1.0, 1.0 - _5101)));
            float _5160 = sin(_5041 * 3.63000011444091796875);
            float _5165 = clamp((sin(_5041 + _5160) * 0.5) + 0.5, 0.300000011920928955078125, 1.0);
            float _5174 = (sin(_5050 + _5160) * 0.5) + 0.5;
            float _5177 = _5083 + _5174;
            float _5184 = _5044 + _5019;
            float _5374 = sin((_5177 * 0.20000000298023223876953125) + _5184);
            float _5389 = clamp(1.0 / sin(((_5177 * 0.4000000059604644775390625) + (_5184 * 2.0)) + 3.1415998935699462890625), 0.0, 1.0);
            float _5391 = abs(_5374);
            float _5210 = clamp(_5174, 0.0, 1.0);
            float _5223 = _5083 + (((sin(_5044 + _5160) * 0.5) + 0.5) * 3.0);
            float _5230 = (_5041 * 8.0) + _5019;
            float _5462 = sin((_5223 * 0.60000002384185791015625) + _5230);
            float _5477 = clamp(1.0 / sin(((_5223 * 1.2000000476837158203125) + (_5230 * 2.0)) + 3.1415998935699462890625), 0.0, 1.0);
            float _5479 = abs(_5462);
            vec3 _5254 = (((mix(mix(_2221.lUniforms.mpCustomPerMesh.gMaterialSFXColVec4.xyz * abs(_2221.lUniforms.mpCustomPerMesh.gMaterialSFXVec4.x), _5111, vec3(max(_5101 - (_5072 * 0.60000002384185791015625), 0.0))), _5111, vec3((clamp(sin(((((_4210.y * _5009) + ((sin(_4210.x * 500.0) * 0.007000000216066837310791015625) * _5072)) + _5072) * 1500.0) + (_5041 * 5.0)) * 0.5, 0.0, 1.0) * pow(_5094, 0.449999988079071044921875)) * step(0.0, _5009))) + ((((_5111 * clamp(_5374 * (_5389 * clamp(pow(_5391, 1.0), 0.0, 1.0)), 0.0, 1.0)) * 0.800000011920928955078125) * _5165) * _5027)) + ((((vec3(0.800000011920928955078125, 0.800000011920928955078125, 1.0) * clamp(_5374 * (_5389 * clamp(pow(_5391, 50.0), 0.0, 1.0)), 0.0, 1.0)) * 0.800000011920928955078125) * _5165) * _5027)) + ((((_5111 * clamp(_5462 * (_5477 * clamp(pow(_5479, 2.0), 0.0, 1.0)), 0.0, 1.0)) * 0.100000001490116119384765625) * _5210) * _5027)) + ((((vec3(0.800000011920928955078125, 0.800000011920928955078125, 1.0) * clamp(_5462 * (_5477 * clamp(pow(_5479, 20.0), 0.0, 1.0)), 0.0, 1.0)) * 0.100000001490116119384765625) * _5210) * _5027);
            vec3 _5291 = vec3(clamp(_2221.lUniforms.mpCustomPerMesh.gMaterialSFXColVec4.w * max(max(max(_5254.x, _5254.y), _5254.z), 0.4000000059604644775390625), 0.0, 1.0) * 0.89999997615814208984375);
            vec3 _5292 = mix(_6096.xyz, clamp((_5254 * (0.949999988079071044921875 + (0.0500000007450580596923828125 * sin(110.0 * _5041)))) + vec3((_5101 * (float(_5015 & 65280) * 1.5318628356908448040485382080078e-05)) * 7.0), vec3(0.0), vec3(1.0)), _5291);
            _6108 = mix(_5292.xyz, vec3(0.0), _5291);
            _6107 = vec4(_5292.x, _5292.y, _5292.z, _6135.w);
            break;
        }
        _6111 = _6108;
        _6110 = _6107.xyz;
    }
    else
    {
        _6111 = _6076;
        _6110 = _6068;
    }
    out_color0 = vec4(_6110, 1.0);
    out_color1 = vec4(_6111, 1.0);
}



