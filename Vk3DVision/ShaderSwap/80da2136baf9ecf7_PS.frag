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

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
layout(set = 0, binding = 45, std140) uniform Vk3DParams
{
    vec4 stereo;
    vec4 custom_params;
} vk3d_params;

layout(set = 0, binding = 0, std140) uniform lUniforms_BLK
{
    UniformBuffer lUniforms;
} _696;

layout(set = 1, binding = 1) uniform sampler2DShadow gShadowMap;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _1931;

void main()
{
    float _2017;
    if (_696.lUniforms.mpCustomPerMesh.gLightShaftParamsVec4.y != 0.0)
    {
        vec2 _1231 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
        vec4 _1877 = vec4(_1231.x, _1231.y, _1931.z, _1931.w);
        _1877.z = 0.0;
        
        _1877.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y / (textureLod(gBufferMap, In.mTexCoordsVec2, 0.0).x * _696.lUniforms.mpPerFrame.gClipPlanesVec4.y)); 
        
        vec4 _1879 = _1877;
        _1879.w = 1.0;
        vec4 _1238 = _696.lUniforms.mpPerFrame.gInverseProjectionMat4 * _1879;
        mat4 _1882 = _696.lUniforms.mpPerFrame.gInverseViewMat4;
        _1882[3] = vec4(0.0, 0.0, 0.0, 1.0);
        vec3 _1260 = (_1882 * ((_1238 / vec4(abs(_1238.z))) * (textureLod(gBufferMap, In.mTexCoordsVec2, 0.0).x * _696.lUniforms.mpPerFrame.gClipPlanesVec4.y))).xyz;
        float _1132 = length(_1260);
        vec3 _1136 = _1260 / vec3(_1132);
        vec3 _1141 = _1136 * (_1132 * 0.0625);
        uvec2 _1274 = uvec2(In.mTexCoordsVec2 * _696.lUniforms.mpPerFrame.gFrameBufferSizeVec4.xy) & uvec2(3u);
        mat4 _1270 = mat4(vec4(0.0588235296308994293212890625, 0.529411792755126953125, 0.17647059261798858642578125, 0.64705884456634521484375), vec4(0.7647058963775634765625, 0.2941176593303680419921875, 0.88235294818878173828125, 0.4117647111415863037109375), vec4(0.23529411852359771728515625, 0.705882370471954345703125, 0.117647059261798858642578125, 0.588235318660736083984375), vec4(0.941176474094390869140625, 0.4705882370471954345703125, 0.823529422283172607421875, 0.3529411852359771728515625));
        float _1288 = 1.0 - _696.lUniforms.mpCustomPerMesh.gLightShaftParamsVec4.x;
        float _1304 = (_1288 * _1288) / (12.56637096405029296875 * pow((1.0 + (_696.lUniforms.mpCustomPerMesh.gLightShaftParamsVec4.x * _696.lUniforms.mpCustomPerMesh.gLightShaftParamsVec4.x)) - ((2.0 * _696.lUniforms.mpCustomPerMesh.gLightShaftParamsVec4.x) * dot(_1136, _696.lUniforms.mpCustomPerMesh.gSunPositionVec4.xyz)), 1.5));
        float _2018;
        if (_1304 > 0.0030000000260770320892333984375)
        {
            vec3 _1933;
            _1933 = (_696.lUniforms.mpPerFrame.gViewPositionVec3 + (_1141 * _1270[_1274.x][_1274.y])) + _1141;
            float _1186;
            float _1188;
            vec3 _1191;
            float _2015;
            float _2016;
            int _1932 = 1;
            float _1962 = 0.0;
            float _1979 = 0.0;
            for (;;)
            {
                if (_1932 < 15)
                {
                    float _1948;
                    for (;;)
                    {
                        vec4 _1335 = vec4(_1933, 1.0);
                        vec4 _1336 = _696.lUniforms.mpCommonPerMesh.gaShadowMat4[0] * _1335;
                        float _1339 = _1336.x;
                        float _1341 = _1336.y;
                        float _1345 = 1.0 - _696.lUniforms.mpPerFrame.gShadowSizeVec4.w;
                        bool _1346 = max(_1339, _1341) < _1345;
                        bool _1357;
                        if (_1346)
                        {
                            _1357 = min(_1339, _1341) > _696.lUniforms.mpPerFrame.gShadowSizeVec4.w;
                        }
                        else
                        {
                            _1357 = _1346;
                        }
                        bool _1363;
                        if (_1357)
                        {
                            _1363 = _1336.z < 1.0;
                        }
                        else
                        {
                            _1363 = _1357;
                        }
                        bool _1369;
                        if (_1363)
                        {
                            _1369 = _1336.z >= 0.0;
                        }
                        else
                        {
                            _1369 = _1363;
                        }
                        vec3 _1939;
                        if (!_1369)
                        {
                            vec4 _1380 = _696.lUniforms.mpCommonPerMesh.gaShadowMat4[1] * _1335;
                            float _1383 = _1380.x;
                            float _1385 = _1380.y;
                            bool _1390 = max(_1383, _1385) < _1345;
                            bool _1401;
                            if (_1390)
                            {
                                _1401 = min(_1383, _1385) > _696.lUniforms.mpPerFrame.gShadowSizeVec4.w;
                            }
                            else
                            {
                                _1401 = _1390;
                            }
                            bool _1407;
                            if (_1401)
                            {
                                _1407 = _1380.z < 1.0;
                            }
                            else
                            {
                                _1407 = _1401;
                            }
                            bool _1413;
                            if (_1407)
                            {
                                _1413 = _1380.z >= 0.0;
                            }
                            else
                            {
                                _1413 = _1407;
                            }
                            if (!_1413)
                            {
                                vec4 _1429 = _696.lUniforms.mpCommonPerMesh.gaShadowMat4[2] * _1335;
                                float _1432 = _1429.x;
                                float _1434 = _1429.y;
                                bool _1439 = max(_1432, _1434) < _1345;
                                bool _1450;
                                if (_1439)
                                {
                                    _1450 = min(_1432, _1434) > _696.lUniforms.mpPerFrame.gShadowSizeVec4.w;
                                }
                                else
                                {
                                    _1450 = _1439;
                                }
                                bool _1456;
                                if (_1450)
                                {
                                    _1456 = _1429.z < 1.0;
                                }
                                else
                                {
                                    _1456 = _1450;
                                }
                                bool _1462;
                                if (_1456)
                                {
                                    _1462 = _1429.z >= 0.0;
                                }
                                else
                                {
                                    _1462 = _1456;
                                }
                                if (!_1462)
                                {
                                    _1948 = 1.0;
                                    break;
                                }
                                else
                                {
                                    vec3 _1913 = _1429.xyz;
                                    _1913.x = (_1432 + 2.0) * 0.3333333432674407958984375;
                                    float _1505 = 1.0 - _1429.z;
                                    vec3 _1916 = _1913;
                                    _1916.z = _1505;
                                    _1948 = texture(gShadowMap, vec3(_1916.xy, _1505));
                                    break;
                                }
                            }
                            vec3 _1901 = _1380.xyz;
                            _1901.x = _1383 + 1.0;
                            _1939 = _1901;
                        }
                        else
                        {
                            _1939 = _1336.xyz;
                        }
                        vec3 _1921 = _1939;
                        _1921.x = _1939.x * 0.3333333432674407958984375;
                        float _1598 = 1.0 - _1939.z;
                        vec3 _1924 = _1921;
                        _1924.z = _1598;
                        vec2 _1624 = _1924.xy + vec2(_696.lUniforms.mpPerFrame.gShadowSizeVec4.z * (-0.16666667163372039794921875), 0.0);
                        vec2 _1638 = _1924.xy + vec2(_696.lUniforms.mpPerFrame.gShadowSizeVec4.z * 0.16666667163372039794921875, 0.0);
                        vec2 _1652 = _1924.xy + vec2(0.0, _696.lUniforms.mpPerFrame.gShadowSizeVec4.w * (-0.5));
                        vec2 _1666 = _1924.xy + vec2(0.0, 0.5 * _696.lUniforms.mpPerFrame.gShadowSizeVec4.w);
                        _1948 = ((((texture(gShadowMap, vec3(_1924.xy, _1598)) + texture(gShadowMap, vec3(vec3(_1624.x, _1624.y, _1924.z).xy, _1598))) + texture(gShadowMap, vec3(vec3(_1638.x, _1638.y, _1924.z).xy, _1598))) + texture(gShadowMap, vec3(vec3(_1652.x, _1652.y, _1924.z).xy, _1598))) + texture(gShadowMap, vec3(vec3(_1666.x, _1666.y, _1924.z).xy, _1598))) * 0.20000000298023223876953125;
                        break;
                    }
                    _1186 = _1962 + (_1304 * _1948);
                    _1188 = _1979 + 1.0;
                    _1191 = _1933 + _1141;
                    vec3 _1195 = _696.lUniforms.mpPerFrame.gViewPositionVec3 - _1191;
                    if (dot(_1195, _1195) > _696.lUniforms.mpPerFrame.gShadowFadeParamVec4.w)
                    {
                        _2016 = _1186;
                        _2015 = _1188;
                        break;
                    }
                    _1979 = _1188;
                    _1962 = _1186;
                    _1933 = _1191;
                    _1932++;
                    continue;
                }
                else
                {
                    _2016 = _1962;
                    _2015 = _1979;
                    break;
                }
            }
            _2018 = smoothstep(_696.lUniforms.mpCustomPerMesh.gLightShaftParamsVec4.z, _696.lUniforms.mpCustomPerMesh.gLightShaftParamsVec4.w, clamp(_2016 / max(9.9999997473787516355514526367188e-05, _2015), 0.0, 1.0) * _696.lUniforms.mpCustomPerMesh.gLightShaftParamsVec4.y);
        }
        else
        {
            _2018 = 0.0;
        }
        _2017 = _2018;
    }
    else
    {
        _2017 = 0.0;
    }
    out_color0 = vec4(_2017);
}


