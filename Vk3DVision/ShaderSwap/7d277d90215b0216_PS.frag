#version 450
//SSR1
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
    vec4 gaProbePositionsVec4[8];
    vec4 gaProbeExtentsVec4[8];
    mat4 gaProbeMat4[8];
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
} _1893;

layout(set = 1, binding = 2) uniform sampler2D gBuffer2Map;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 3) uniform sampler2D gBuffer3Map;
layout(set = 1, binding = 4) uniform sampler2D gBuffer4Map;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 5) uniform sampler2D gBuffer5Map;
layout(set = 1, binding = 9) uniform samplerCube gProbe00Map;
layout(set = 1, binding = 10) uniform samplerCube gProbe01Map;
layout(set = 1, binding = 11) uniform samplerCube gProbe02Map;
layout(set = 1, binding = 12) uniform samplerCube gProbe03Map;
layout(set = 1, binding = 13) uniform samplerCube gProbe04Map;
layout(set = 1, binding = 14) uniform samplerCube gProbe05Map;
layout(set = 1, binding = 15) uniform samplerCube gProbe06Map;
layout(set = 1, binding = 16) uniform samplerCube gProbe07Map;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;
layout(location = 1) out vec4 out_color1;
layout(location = 2) out vec4 out_color2;

vec4 _4545;
vec3 _4550;
vec2 _4563;
uvec3 _4793;
float _4794;

void main()
{
    vec4 _1903 = texture(gBuffer2Map, In.mTexCoordsVec2);
    float _1906 = _1903.w;
    bool _1917 = ((int(_1906 * 3.0) << 8) & 256) == 0;
    bool _1924;
    if (!_1917)
    {
        _1924 = dFdx(_1906) != 0.0;
    }
    else
    {
        _1924 = _1917;
    }
    bool _1931;
    if (!_1924)
    {
        _1931 = dFdy(_1906) != 0.0;
    }
    else
    {
        _1931 = _1924;
    }
    if (_1931)
    {
        discard;
    }
    vec3 _1946 = normalize((_1903.xyz * 2.0) - vec3(1.0));
    vec3 _1950 = mat3(_1893.lUniforms.mpPerFrame.gViewMat4[0].xyz, _1893.lUniforms.mpPerFrame.gViewMat4[1].xyz, _1893.lUniforms.mpPerFrame.gViewMat4[2].xyz) * _1946;
    vec2 _2473 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
    vec4 _4415 = vec4(_2473.x, _2473.y, _4545.z, _4545.w);
    _4415.z = textureLod(gBufferMap, In.mTexCoordsVec2, 0.0).x;
    //
    vec4 _4417a = _4415;
    
    _4417a.x -= vk3d_params.stereo.x;
    
    _4417a.w = 1.0;
    vec4 _2481a = _1893.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _4417a;
    vec3 _2493a = (_2481a.xyz / vec3(_2481a.w)).xyz + _1893.lUniforms.mpPerFrame.gViewPositionVec3;
    //
    vec4 _4417 = _4415;
    _4417.w = 1.0;
    vec4 _2481 = _1893.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _4417;
    vec3 _2493 = (_2481.xyz / vec3(_2481.w)).xyz + _1893.lUniforms.mpPerFrame.gViewPositionVec3;
    // fix
    vec3 _2497 = _2493a.xyz;
    vec4 _1982 = _1893.lUniforms.mpPerFrame.gViewMat4 * vec4(_2493, 1.0);
    vec3 _1983 = _1982.xyz;
    vec3 _1987 = normalize(-_1983);
    vec4 _1999 = texture(gBuffer3Map, In.mTexCoordsVec2);
    float _2000 = _1999.y;
    float _2527 = _2000 * _2000;
    float _2612 = _1950.z;
    float _2615 = float((_2612 >= 0.0) ? 1 : (-1));
    float _2620 = (-1.0) / (_2615 + _2612);
    float _2622 = _1950.x;
    float _2624 = _1950.y;
    float _2627 = (_2622 * _2624) * _2620;
    mat3 _2676 = mat3(vec3(1.0 + (((_2615 * _2622) * _2622) * _2620), _2615 * _2627, (-_2615) * _2622), vec3(_2627, _2615 + ((_2624 * _2624) * _2620), -_2624), _1950);
    vec4 _4554;
    _4554 = _4545;
    bool _2565;
    vec4 _2822;
    bool _4551;
    vec4 _4553;
    int _4546 = 0;
    bool _4552 = false;
    for (;;)
    {
        if (_4546 < 8)
        {
            uvec3 _2703 = (uvec3(ivec3(ivec2(uvec2(floor(In.mTexCoordsVec2 * _1893.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy))), int(uint((_1893.lUniforms.mpPerFrame.giFrameIndex * 8) + _4546)))) * uvec3(1664525u)) + uvec3(1013904223u);
            uint _2705 = _2703.y;
            uint _2707 = _2703.z;
            uint _2711 = _2703.x + (_2705 * _2707);
            uint _2720 = _2705 + (_2707 * _2711);
            uint _2729 = _2707 + (_2711 * _2720);
            uint _2738 = _2711 + (_2720 * _2729);
            uvec3 _4448 = _4793;
            _4448.x = _2738;
            uvec3 _4453 = _4448;
            _4453.y = _2720 + (_2729 * _2738);
            vec2 _2693 = vec2((_4453 >> uvec3(16u)).xy) * vec2(1.52587890625e-05);
            float _2554 = mix(_2693.y, 0.0, mix(0.999499976634979248046875, 0.5, smoothstep(0.20000000298023223876953125, 1.0, pow(_2000, 0.75)) * mix(1.0, 0.0500000007450580596923828125, sqrt(texture(gBuffer4Map, In.mTexCoordsVec2).x))));
            float _2558 = _2527 * _2527;
            float _2771 = 6.283185482025146484375 * _2693.x;
            float _2782 = sqrt((1.0 - _2554) / (1.0 + ((_2558 - 1.0) * _2554)));
            float _2787 = sqrt(1.0 - (_2782 * _2782));
            float _2807 = (((_2782 * _2558) - _2782) * _2782) + 1.0;
            _2822 = vec4(_2787 * cos(_2771), _2787 * sin(_2771), _2782, (_2558 / ((3.1415927410125732421875 * _2807) * _2807)) * _2782);
            _2565 = dot(_2822.xyz, _1987 * _2676) > 0.0;
            if (_2565)
            {
                _4553 = _2822;
                _4551 = _2565;
                break;
            }
            _4546++;
            _4554 = _2822;
            _4552 = _2565;
            continue;
        }
        else
        {
            _4553 = _4554;
            _4551 = _4552;
            break;
        }
    }
    vec4 _4557;
    if (!_4551)
    {
        _4557 = vec4(0.0, 0.0, 1.0, 0.3183098733425140380859375 / _2527);
    }
    else
    {
        _4557 = _4553;
    }
    vec3 _2586 = _2676 * _4557.xyz;
    
    _2586.x -= vk3d_params.stereo.x * _2586.z; 
    
    vec3 _2847 = -_1987;
    vec3 _2849 = reflect(_2847, mix(_1987, _2586, vec3(clamp(pow(0.959999978542327880859375 + dot(_1987, _2586), 0.4749999940395355224609375), 0.0, 1.0))));
    float _2859 = smoothstep(0.0, 0.20000000298023223876953125, dot(_2847, _2849));
    bool _4642;
    vec2 _4646;
    if (_2859 > 0.0039215688593685626983642578125)
    {
        vec4 _2916 = _1893.lUniforms.mpPerFrame.gProjectionMat4 * vec4(_1982.xyz, 1.0);
        vec3 _2922 = _2916.xyz / vec3(_2916.w);
        vec4 _2924 = vec4(_2922.x, _2922.y, _2922.z, _2916.w);
        vec2 _2929 = (_2922.xy * 0.5) + vec2(0.5);
        vec2 _2940 = vec2(_2929.x, 1.0 - _2929.y);
        vec4 _2952 = _1893.lUniforms.mpPerFrame.gProjectionMat4 * vec4(_1983 + (_2849 * 10000000272564224.0), 1.0);
        vec3 _2958 = _2952.xyz / vec3(_2952.w);
        vec4 _2960 = vec4(_2958.x, _2958.y, _2958.z, _2952.w);
        vec2 _2965 = (_2958.xy * 0.5) + vec2(0.5);
        vec2 _2976 = vec2(_2965.x, 1.0 - _2965.y);
        vec2 _3027 = vec2(textureSize(gBufferMap, 0));
        float _3033 = 0.0024999999441206455230712890625 / max(_3027.x, _3027.y);
        vec3 _3155 = vec4(_2940.x, _2940.y, _2924.z, _2924.w).xyz;
        vec3 _3159 = vec4(_2976.x, _2976.y, _2960.z, _2960.w).xyz - _3155;
        vec3 _3165 = _3159 / vec3(abs(_3159.z));
        float _3167 = length(_3165);
        vec3 _3171 = _3165 / vec3(_3167);
        vec2 _3210 = vec2(textureSize(gBufferMap, 0));
        float _3214 = _3210.x;
        float _3215 = _3210.y;
        vec2 _3217 = _2940.xy * _3210;
        float _3239 = (_3033 + (1.0 / min(_3214, _3215))) * max(_3214, _3215);
        bool _3242 = _3171.x > 0.0;
        float _3243 = _3242 ? 1.0 : (-1.0);
        vec2 _4487 = _4563;
        _4487.x = _3239 * _3243;
        bool _3255 = _3171.y > 0.0;
        float _3256 = _3255 ? 1.0 : (-1.0);
        vec2 _4492 = _4487;
        _4492.y = _3239 * _3256;
        float _4564;
        if (_3242)
        {
            _4564 = ceil(_3217.x);
        }
        else
        {
            _4564 = floor(_3217.x);
        }
        vec2 _4497 = _4563;
        _4497.x = _4564;
        float _4571;
        if (_3255)
        {
            _4571 = ceil(_3217.y);
        }
        else
        {
            _4571 = floor(_3217.y);
        }
        vec2 _4502 = _4497;
        _4502.y = _4571;
        vec2 _3298 = _3171.xy;
        vec2 _3226 = ((_4502 + _4492) - _3217) / (_3210 * _3298);
        vec3 _4581;
        vec2 _4587;
        vec2 _4599;
        _4599 = _4563;
        _4587 = _4563;
        _4581 = _3155 + (_3171 * _3226[int(abs(_3226.x) > abs(_3226.y))]);
        int _3122;
        bool _3510;
        vec3 _4616;
        bool _4624;
        vec3 _4629;
        vec2 _4748;
        vec2 _4752;
        uint _4575 = 0u;
        int _4578 = 0;
        bool _4625 = true;
        bool _3051;
        for (;;)
        {
            _3051 = _4575 < 400u;
            if (_3051)
            {
                vec2 _3322 = vec2(textureSize(gBufferMap, _4578));
                vec2 _3329 = _4581.xy * _3322;
                float _3337 = float(_4578);
                vec4 _3338 = textureLod(gBufferMap, _4581.xy, _3337);
                float _3344 = _3338.x;
                bool _4583;
                vec3 _4584;
                if (_4581.z > _3344)
                {
                    vec3 _3081 = _4581 + ((_3171 * _3167) * (_4581.z - _3344));
                    vec2 _3351 = _3081.xy * _3322;
                    bool _3361 = int(floor(_3329.x)) != int(floor(_3351.x));
                    bool _3374;
                    if (!_3361)
                    {
                        _3374 = int(floor(_3329.y)) != int(floor(_3351.y));
                    }
                    else
                    {
                        _3374 = _3361;
                    }
                    _4584 = mix(_3081, _4581, bvec3(_3374));
                    _4583 = _3374;
                }
                else
                {
                    _4584 = _4581;
                    _4583 = _4581.z < (textureLod(gBuffer1Map, _4581.xy, _3337).x - (clamp(((_4581.z * _4581.z) * _4581.z) * 2048.0, 2.4999999368446879088878631591797e-05, 0.00025000001187436282634735107421875) * max(1.0, (_2527 * _2000) * 64.0)));
                }
                int _4615;
                if (_4583)
                {
                    float _3423 = _3033 * max(_3322.x, _3322.y);
                    vec2 _4517 = _4587;
                    _4517.x = _3423 * _3243;
                    vec2 _4522 = _4517;
                    _4522.y = _3423 * _3256;
                    float _4595;
                    if (_3242)
                    {
                        _4595 = ceil(_3329.x);
                    }
                    else
                    {
                        _4595 = floor(_3329.x);
                    }
                    vec2 _4527 = _4599;
                    _4527.x = _4595;
                    float _4607;
                    if (_3255)
                    {
                        _4607 = ceil(_3329.y);
                    }
                    else
                    {
                        _4607 = floor(_3329.y);
                    }
                    vec2 _4532 = _4527;
                    _4532.y = _4607;
                    vec2 _3473 = _4532 + _4522;
                    vec2 _3410 = (_3473 - (_4584.xy * _3322)) / (_3322 * _3298);
                    _4752 = _3473;
                    _4748 = _4522;
                    _4616 = _4584 + (_3171 * _3410[int(abs(_3410.x) > abs(_3410.y))]);
                    _4615 = _4578 + 2;
                }
                else
                {
                    _4752 = _4599;
                    _4748 = _4587;
                    _4616 = _4584;
                    _4615 = _4578;
                }
                _3122 = min(6, (_4615 - 1));
                bool _3504 = all(greaterThan(_4616.xy, vec2(0.0)));
                if (_3504)
                {
                    _3510 = all(lessThan(_4616.xy, vec2(1.0)));
                }
                else
                {
                    _3510 = _3504;
                }
                if ((_3122 < 0) || (!_3510))
                {
                    _4629 = _4616;
                    _4624 = _3510;
                    break;
                }
                _4599 = _4752;
                _4587 = _4748;
                _4581 = _4616;
                _4578 = _3122;
                _4575++;
                _4625 = _3510;
                continue;
            }
            else
            {
                _4629 = _4581;
                _4624 = _4625;
                break;
            }
        }
        _4646 = vec4(_4629.xy, _4794, 1.0).xy;
        _4642 = _4624 && _3051;
    }
    else
    {
        _4646 = vec2(0.0);
        _4642 = false;
    }
    float _4643;
    for (;;)
    {
        if (!_4642)
        {
            _4643 = 0.0;
            break;
        }
        if (_2000 < 0.20000000298023223876953125)
        {
            _4643 = 1.0;
            break;
        }
        _4643 = max(sqrt(_4557.w) * 0.666666686534881591796875, 0.0039215688593685626983642578125);
        break;
    }
    float _3566 = (_2859 * smoothstep(0.0, 0.3499999940395355224609375, 1.0 - (abs(_4646.x - 0.5) * 2.0))) * smoothstep(0.0, 0.3499999940395355224609375, 1.0 - (abs(_4646.y - 0.5) * 2.0));
    vec3 _4729;
    if (_3566 >= 0.0039215688593685626983642578125)
    {
        float _3657 = (2.0 / pow(_2527, 4.0)) + (-1.0);
        float _3633 = length((_4646 - In.mTexCoordsVec2) * _1893.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy);
        float _3637 = (2.0 * tan(mix(acos(pow(0.24400000274181365966796875, 1.0 / _3657)), 0.0, clamp((0.0009765625 / _3657) - 1.0, 0.0, 1.0)) * 0.5)) * _3633;
        _4729 = textureLod(gBuffer5Map, _4646, clamp((log(((_3637 * (sqrt((_3637 * _3637) + ((_3633 * _3633) * 4.0)) - _3637)) / (_3633 * 4.0)) + 1.0) * 1.5) + 0.699999988079071044921875, 0.0, 8.0)).xyz * 0.125;
    }
    else
    {
        _4729 = vec3(0.0);
    }
    vec3 _4728;
    if (_3566 < 1.0)
    {
        int _4648;
        vec3 _4649;
        vec3 _4669;
        vec3 _4689;
        _4689 = _4550;
        _4669 = _4550;
        _4649 = _4550;
        _4648 = -1;
        vec3 _3802;
        float _3805;
        bool _3815;
        bool _3816;
        vec3 _3846;
        vec3 _3852;
        bvec3 _4796;
        bool _3884;
        int _4647 = 0;
        float _4743 = uintBitsToFloat(0x7f800000u);
        for (; _4647 < 8; _3815 = _3805 < _4743, _3816 = _3884 && _3815, _4796 = bvec3(_3816), _4743 = _3816 ? _3805 : _4743, _4689 = mix(_4689, _3852, _4796), _4669 = mix(_4669, _3846, _4796), _4649 = mix(_4649, _3802, _4796), _4648 = _3816 ? _4647 : _4648, _4647++)
        {
            _3802 = mat3(_1893.lUniforms.mpCustomPerMesh.gaProbeMat4[_4647][0].xyz, _1893.lUniforms.mpCustomPerMesh.gaProbeMat4[_4647][1].xyz, _1893.lUniforms.mpCustomPerMesh.gaProbeMat4[_4647][2].xyz) * (_2497 - _1893.lUniforms.mpCustomPerMesh.gaProbePositionsVec4[_4647].xyz);
            _3805 = dot(_3802, _3802);
            _3846 = _1893.lUniforms.mpCustomPerMesh.gaProbeExtentsVec4[_4647].xyz * vec3(0.5);
            _3852 = _1893.lUniforms.mpCustomPerMesh.gaProbeExtentsVec4[_4647].xyz * vec3(-0.5);
            bool _3866 = (_3846.x - _3852.x) > 9.9999997473787516355514526367188e-05;
            bool _3875;
            if (_3866)
            {
                _3875 = all(greaterThan(_3802, _3852));
            }
            else
            {
                _3875 = _3866;
            }
            if (_3875)
            {
                _3884 = all(lessThan(_3802, _3846));
            }
            else
            {
                _3884 = _3875;
            }
        }
        vec3 _3830 = mat3(_1893.lUniforms.mpCustomPerMesh.gaProbeMat4[_4648][0].xyz, _1893.lUniforms.mpCustomPerMesh.gaProbeMat4[_4648][1].xyz, _1893.lUniforms.mpCustomPerMesh.gaProbeMat4[_4648][2].xyz) * reflect(normalize(_2497 - _1893.lUniforms.mpPerFrame.gViewPositionVec3), _1946);
        vec3 _4716;
        if (_4648 >= 0)
        {
            vec3 _3906 = vec3(1.0) / _3830;
            vec3 _3923 = max((_4689 - _4649) * _3906, (_4669 - _4649) * _3906);
            vec3 _3940 = (_4649 + (_3830 * min(min(_3923.x, _3923.y), _3923.z))) * vec3(-1.0, 1.0, -1.0);
            float _3988 = (2.0 / pow(_2527, 4.0)) + (-1.0);
            float _3964 = mix(0.0, 512.0, _2527);
            float _3968 = (2.0 * tan(mix(acos(pow(0.24400000274181365966796875, 1.0 / _3988)), 0.0, clamp((0.0009765625 / _3988) - 1.0, 0.0, 1.0)) * 0.5)) * _3964;
            float _3977 = clamp((log(((_3968 * (sqrt((_3968 * _3968) + ((_3964 * _3964) * 4.0)) - _3968)) / (_3964 * 4.0)) + 1.0) * 1.5) + 0.699999988079071044921875, 0.0, 7.0);
            vec3 _4713;
            if (_4648 < 4)
            {
                vec3 _4714;
                if (_4648 < 2)
                {
                    vec3 _4712;
                    if (_4648 == 0)
                    {
                        _4712 = textureLod(gProbe00Map, _3940, _3977).xyz;
                    }
                    else
                    {
                        _4712 = textureLod(gProbe01Map, _3940, _3977).xyz;
                    }
                    _4714 = _4712;
                }
                else
                {
                    vec3 _4711;
                    if (_4648 == 2)
                    {
                        _4711 = textureLod(gProbe02Map, _3940, _3977).xyz;
                    }
                    else
                    {
                        _4711 = textureLod(gProbe03Map, _3940, _3977).xyz;
                    }
                    _4714 = _4711;
                }
                _4713 = _4714;
            }
            else
            {
                vec3 _4715;
                if (_4648 < 6)
                {
                    vec3 _4710;
                    if (_4648 == 4)
                    {
                        _4710 = textureLod(gProbe04Map, _3940, _3977).xyz;
                    }
                    else
                    {
                        _4710 = textureLod(gProbe05Map, _3940, _3977).xyz;
                    }
                    _4715 = _4710;
                }
                else
                {
                    vec3 _4709;
                    if (_4648 == 6)
                    {
                        _4709 = textureLod(gProbe06Map, _3940, _3977).xyz;
                    }
                    else
                    {
                        _4709 = textureLod(gProbe07Map, _3940, _3977).xyz;
                    }
                    _4715 = _4709;
                }
                _4713 = _4715;
            }
            vec3 _4130 = min(abs(_4649 - _4689), abs(_4649 - _4669));
            float _4141 = clamp(min(min(_4130.x, _4130.y), _4130.z) * 0.125, 0.0, 1.0);
            _4716 = mix(vec3(0.0), _4713, vec3(_4141 * _4141)) * 1.0;
        }
        else
        {
            _4716 = vec3(0.0);
        }
        _4728 = mix(_4716 * 0.125, _4729, vec3(_3566));
    }
    else
    {
        _4728 = _4729;
    }
    out_color0 = vec4(max(_4728, vec3(0.0)), 0.0);
    out_color1 = vec4(_4646, 0.0, 0.0);
    out_color2 = vec4(_4643, 0.0, 0.0, 0.0);
}




















