#version 450
//taa
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
    vec4 gDoFParamsVec4;
    vec4 gHDRParamsVec4;
    vec4 gHBAOParamsVec4;
    vec4 gThresholdParamsVec4;
    vec4 gCustomParamsVec4;
    vec4 gBlurParamsVec4;
    vec4 gColourLUTParamsVec4;
    vec4 gColourLUTStrengthsVec4;
    vec4 gTextureSizeMipLevelVec4;
    vec4 gSkyUpperParamsVec4;
    vec4 gLightShaftColourBottomVec4;
    vec4 gLightShaftColourTopVec4;
    vec4 gHDRParams2Vec4;
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
} _201;

layout(set = 1, binding = 2) uniform sampler2D gBuffer2Map;
layout(set = 1, binding = 3) uniform sampler2D gBuffer4Map;
layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 4) uniform sampler2D gBuffer5Map;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;
layout(location = 1) out vec4 out_color1;
layout(location = 2) out vec4 out_color2;

void main()
{
    vec4 _1109 = texture(gBuffer2Map, In.mTexCoordsVec2);
    
    _1109.x += vk3d_params.stereo.x * 10000000;
    
    vec3 _215 = _1109.xyz;
    vec2 _217 = _1109.xy;
    vec4 _225 = textureLod(gBuffer4Map, In.mTexCoordsVec2, 0.0);
    bool _232 = abs(_225.x - 0.5) < 0.449999988079071044921875;
    bool _241;
    if (_232)
    {
        _241 = abs(_225.y - 0.5) < 0.449999988079071044921875;
    }
    else
    {
        _241 = _232;
    }
    float _251 = _1109.z;
    bool _252 = _251 >= 0.5;
    vec3 _1381;
    if (_252)
    {
        vec3 _1326 = _215;
        _1326.z = _251 - 0.5;
        _1381 = _1326;
    }
    else
    {
        _1381 = _215;
    }
    vec2 _278 = _1381.xy - vec2(0.5);
    float _283 = dot(_278, _278);
    vec2 _1385;
    vec2 _1406;
    bool _1434;
    _1434 = (_283 > 0.23499999940395355224609375) ? true : (_252 ? true : ((_201.lUniforms.mpPerFrame.gTaaSettingsVec4.x < 0.0) ? true : false));
    _1406 = _217;
    _1385 = _217;
    float _1475;
    float _1479;
    vec2 _1485;
    vec2 _1495;
    bool _1505;
    for (float _1384 = -1.0, _1476 = _283, _1480 = _283; _1384 <= 1.0; _1434 = _1505, _1406 = _1495, _1385 = _1485, _1384 += 1.0, _1480 = _1479, _1476 = _1475)
    {
        _1479 = _1480;
        _1475 = _1476;
        _1505 = _1434;
        _1495 = _1406;
        _1485 = _1385;
        vec2 _1486;
        vec2 _1496;
        bool _1506;
        float _1519;
        float _1522;
        for (float _1472 = -1.0; _1472 <= 1.0; _1479 = _1522, _1475 = _1519, _1472 += 1.0, _1505 = _1506, _1495 = _1496, _1485 = _1486)
        {
            if ((_1472 != 0.0) || (_1384 != 0.0))
            {
                vec4 _1113 = texture(gBuffer2Map, In.mTexCoordsVec2 + (vec2(_1472, _1384) * _201.lUniforms.mpPerFrame.gFrameBufferSizeVec4.zw));
                vec2 _336 = _1113.xy;
                vec2 _338 = _336 - vec2(0.5);
                float _343 = dot(_338, _338);
                bool _351 = _343 >= _1475;
                bool _359 = _343 < _1479;
                _1522 = _359 ? _343 : _1479;
                _1519 = _351 ? _343 : _1475;
                _1506 = (_1113.z >= 0.5) ? true : _1505;
                _1496 = mix(_1495, _336, bvec2(_359));
                _1486 = mix(_1485, _336, bvec2(_351));
            }
            else
            {
                _1522 = _1479;
                _1519 = _1475;
                _1506 = _1505;
                _1496 = _1495;
                _1486 = _1485;
            }
        }
    }
    vec3 _378 = clamp(textureLod(gBufferMap, In.mTexCoordsVec2 + vec2(_201.lUniforms.mpPerFrame.gDeJitterVec3.x, -_201.lUniforms.mpPerFrame.gDeJitterVec3.y), 0.0).xyz, vec3(0.0), vec3(1024.0));
    vec3 _1128 = _378 / vec3(1.0 + ((0.25 * (_378.x + _378.z)) + (0.5 * _378.y)));
    vec3 _388 = clamp(textureLod(gBufferMap, In.mTexCoordsVec2, 0.0).xyz, vec3(0.0), vec3(1024.0));
    vec3 _1143 = _388 / vec3(1.0 + ((0.25 * (_388.x + _388.z)) + (0.5 * _388.y)));
    vec2 _1148 = (_1385 - vec2(0.5)) * 2.0;
    vec2 _398 = In.mTexCoordsVec2 + _1148;
    float _403 = length(_1148) * 1000.0;
    float _406 = _398.x;
    bool _410 = clamp(_406, 0.0, 1.0) == _406;
    bool _419;
    if (_410)
    {
        float _414 = _398.y;
        _419 = clamp(_414, 0.0, 1.0) == _414;
    }
    else
    {
        _419 = _410;
    }
    vec3 _1391;
    if (_419 && (_403 < 128.0))
    {
        _1391 = mix(textureLod(gBuffer1Map, _398, 0.0).xyz, _1143, vec3(clamp(0.015625 * (_403 - 64.0), 0.0, 1.0)));
    }
    else
    {
        _1391 = _1143;
    }
    vec3 _452 = _1143 - _1391;
    vec3 _456 = _1128 - _1391;
    bool _469;
    if (_241)
    {
        _469 = (dot(_452, _452) + dot(_456, _456)) > 0.0009765625;
    }
    else
    {
        _469 = _241;
    }
    vec3 _1456;
    vec3 _1457;
    if (_469)
    {
        vec4 _481 = textureLod(gBuffer5Map, _398, 0.0);
        vec2 _1153 = (_481.xy - vec2(0.5)) * 2.0;
        vec3 _499 = mix(_1391, _1143, vec3(clamp(0.015625 * ((length(_1153) * 1000.0) - 64.0), 0.0, 1.0)));
        float _1443;
        if (_481.z != 1.0)
        {
            vec2 _1158 = (_481.zw - vec2(0.5)) * 2.0;
            vec2 _1163 = (_1406 - vec2(0.5)) * 2.0;
            bool _517 = !((_1381.z >= 0.25) ? true : false);
            bool _524;
            if (_517)
            {
                _524 = _201.lUniforms.mpPerFrame.gFoVValuesVec4.z == 1.0;
            }
            else
            {
                _524 = _517;
            }
            float _1453;
            if (_524)
            {
                _1453 = clamp(max(max(length(_1158 - _1148), length(_1153 - _1163)), max(length(_1158 - _1163), length(_1153 - _1148))) * 1000.0, 0.0, 1.0);
            }
            else
            {
                _1453 = 1.0;
            }
            _1443 = _1453;
        }
        else
        {
            _1443 = 1.0;
        }
        float _553 = _201.lUniforms.mpPerFrame.gFrameBufferSizeVec4.z * _201.lUniforms.mpPerFrame.gTaaSettingsVec4.z;
        float _559 = _201.lUniforms.mpPerFrame.gFrameBufferSizeVec4.w * _201.lUniforms.mpPerFrame.gTaaSettingsVec4.z;
        float _576 = -_553;
        float _578 = -_559;
        vec3 _585 = clamp(textureLod(gBufferMap, In.mTexCoordsVec2 + vec2(_576, _578), 0.0).xyz, vec3(0.0), vec3(1024.0));
        vec3 _1178 = _585 / vec3(1.0 + ((0.25 * (_585.x + _585.z)) + (0.5 * _585.y)));
        vec3 _617 = clamp(textureLod(gBufferMap, In.mTexCoordsVec2 + vec2(_553, _578), 0.0).xyz, vec3(0.0), vec3(1024.0));
        vec3 _1193 = _617 / vec3(1.0 + ((0.25 * (_617.x + _617.z)) + (0.5 * _617.y)));
        vec3 _651 = clamp(textureLod(gBufferMap, In.mTexCoordsVec2 + vec2(_576, _559), 0.0).xyz, vec3(0.0), vec3(1024.0));
        vec3 _1208 = _651 / vec3(1.0 + ((0.25 * (_651.x + _651.z)) + (0.5 * _651.y)));
        vec3 _684 = clamp(textureLod(gBufferMap, In.mTexCoordsVec2 + vec2(_553, _559), 0.0).xyz, vec3(0.0), vec3(1024.0));
        vec3 _1223 = _684 / vec3(1.0 + ((0.25 * (_684.x + _684.z)) + (0.5 * _684.y)));
        vec3 _702 = max(max(max(_1178, _1193), _1208), _1223);
        vec3 _705 = min(min(min(_1178, _1193), _1208), _1223);
        float _717 = abs(((((-((0.25 * (_1143.x + _1143.z)) + (0.5 * _1143.y))) + (((0.25 * (_1178.x + _1178.z)) + (0.5 * _1178.y)) * 0.25)) + (((0.25 * (_1193.x + _1193.z)) + (0.5 * _1193.y)) * 0.25)) + (((0.25 * (_1208.x + _1208.z)) + (0.5 * _1208.y)) * 0.25)) + (((0.25 * (_1223.x + _1223.z)) + (0.5 * _1223.y)) * 0.25));
        float _724 = 1.0 - clamp(1.0 / mix(_201.lUniforms.mpPerFrame.gMBlurSettingsVec4.x, _201.lUniforms.mpPerFrame.gMBlurSettingsVec4.y, _717 * 10.0), 0.0, 1.0);
        float _1455;
        if (_201.lUniforms.mpPerFrame.gFoVValuesVec4.z == 1.0)
        {
            _1455 = mix(_201.lUniforms.mpPerFrame.gTaaSettingsVec4.w, _201.lUniforms.mpPerFrame.gMBlurSettingsVec4.w, _724);
        }
        else
        {
            _1455 = mix(_201.lUniforms.mpPerFrame.gTaaSettingsVec4.w, _201.lUniforms.mpPerFrame.gTaaSettingsVec4.y, _724);
        }
        vec3 _1240 = (_702 + _705) * 0.5;
        vec3 _1247 = _1128 - _1240;
        vec3 _1252 = abs(((_702 - _705) * 0.5) / _1247);
        vec3 _765 = min(_1128, _705);
        vec3 _769 = max(_1128, _702);
        vec3 _1277 = (_769 + _765) * 0.5;
        vec3 _1284 = _499 - _1277;
        vec3 _1289 = abs(((_769 - _765) * 0.5) / _1284);
        vec3 _1303 = _1277 + (_1284 * clamp(min(_1289.x, min(_1289.y, _1289.z)), 0.0, 1.0));
        _1457 = mix(_499, mix(_1240 + (_1247 * clamp(min(_1252.x, min(_1252.y, _1252.z)), 0.0, 1.0)), _1303, vec3(1.0 - clamp(1.0 / mix(_201.lUniforms.mpPerFrame.gMBlurSettingsVec4.x, _201.lUniforms.mpPerFrame.gMBlurSettingsVec4.y, _717), 0.0, 1.0))), vec3(_1434 ? 1.0 : _1443));
        _1456 = mix(_1143, mix(_499, _1303, vec3(clamp(_1443 * 2.0, 0.0, 1.0))), vec3(_1455));
    }
    else
    {
        _1457 = _1128;
        _1456 = _1128;
    }
    out_color0 = vec4(_1457 / vec3(1.0 - ((0.25 * (_1457.x + _1457.z)) + (0.5 * _1457.y))), 1.0);
    out_color1 = vec4(max(vec3(0.0), min(vec3(10000.0), _1456)), 1.0);
    if (_1434)
    {
        out_color2 = vec4(_1385, 1.0, 1.0);
    }
    else
    {
        out_color2 = vec4(_1385, _1406);
    }
}


