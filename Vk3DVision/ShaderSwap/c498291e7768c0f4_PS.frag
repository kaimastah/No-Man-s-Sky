#version 450
// decals
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
    vec4 gLightColourVec4;
    vec4 gLightCustomParamsVec4;
    mat4 gWorldMotionMat4;
    mat4 gInverseModelMat4;
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
} _602;

layout(set = 1, binding = 2) uniform sampler2D gFadeNoiseMap;
layout(set = 1, binding = 3) uniform sampler2D gBufferMap;
layout(set = 1, binding = 0) uniform sampler2D gDiffuseMap;
layout(set = 1, binding = 1) uniform sampler2D gMasksMap;

layout(location = 0) in VertexBlock
{
    vec4 mTexCoordsVec4;
    vec4 mWorldPositionVec3_mfSpare;
    vec3 mTangentSpaceNormalVec3;
    vec4 mScreenSpacePositionVec4;
    flat vec3 mfFadeValueForInstance_mfLodIndex_mfShearMotionLength;
} In;

layout(location = 0) out vec4 out_color0;
layout(location = 1) out vec4 out_color1;
layout(location = 2) out vec4 out_color2;
layout(location = 3) out vec4 out_color3;

vec4 _1739;
vec3 _1871;

void main()
{
    if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 1.0)
    {
        vec3 _1074 = floor(In.mWorldPositionVec3_mfSpare.xyz);
        vec3 _1076 = fract(In.mWorldPositionVec3_mfSpare.xyz);
        vec4 _1096 = textureLod(gFadeNoiseMap, (_1074.xy + (vec2(37.0, 17.0) * _1074.z)) + ((_1076 * _1076) * (vec3(3.0) - (_1076 * 2.0))).xy, 0.0);
        float _1097 = _1096.x;
        if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 0.0)
        {
            if ((1.0 - _1097) > (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x + 2.0))
            {
                discard;
            }
        }
        else
        {
            if (_1097 > In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x)
            {
                discard;
            }
        }
    }
    vec2 _1138 = ((In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w)) * 0.5) + vec2(0.5);
    vec2 _1241 = (_1138 * 2.0) - vec2(1.0);
    vec4 _1679 = vec4(_1241.x, _1241.y, _1739.z, _1739.w);
    _1679.z = (((_602.lUniforms.mpPerFrame.gClipPlanesVec4.x * _602.lUniforms.mpPerFrame.gClipPlanesVec4.y) / (texture(gBufferMap, vec2(_1138.x, 1.0 - _1138.y)).x * _602.lUniforms.mpPerFrame.gClipPlanesVec4.y)) - _602.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_602.lUniforms.mpPerFrame.gClipPlanesVec4.y - _602.lUniforms.mpPerFrame.gClipPlanesVec4.x);
    
    _1679.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1679.z * 10);
    
    vec4 _1681 = _1679;
    _1681.w = 1.0;
    vec4 _1251 = _602.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1681;
    vec3 _1167 = (_602.lUniforms.mpCommonPerMesh.gInverseModelMat4 * vec4((_1251.xyz / vec3(_1251.w)).xyz + _602.lUniforms.mpPerFrame.gViewPositionVec3, 1.0)).xyz + vec3(0.5);
    float _1170 = 1.0 - _1167.y;
    vec3 _1685 = _1167;
    _1685.y = _1170;
    float _1173 = _1167.x;
    bool _1174 = _1173 < 0.0;
    bool _1181;
    if (!_1174)
    {
        _1181 = _1173 >= 1.0;
    }
    else
    {
        _1181 = _1174;
    }
    bool _1188;
    if (!_1181)
    {
        _1188 = _1170 < 0.0;
    }
    else
    {
        _1188 = _1181;
    }
    bool _1195;
    if (!_1188)
    {
        _1195 = _1170 >= 1.0;
    }
    else
    {
        _1195 = _1188;
    }
    bool _1202;
    if (!_1195)
    {
        _1202 = _1167.z < 0.0;
    }
    else
    {
        _1202 = _1195;
    }
    bool _1209;
    if (!_1202)
    {
        _1209 = _1167.z >= 1.0;
    }
    else
    {
        _1209 = _1202;
    }
    if (_1209)
    {
        discard;
    }
    vec4 _732 = texture(gDiffuseMap, _1685.xy);
    vec4 _738 = texture(gMasksMap, _1685.xy);
    float _741 = _738.z;
    int _1294 = int(_602.lUniforms.mpCommonPerMesh.gUserDataVec4.x);
    float _1297 = float(_1294 & 255) * 0.0039215688593685626983642578125;
    float _1303 = float((_1294 >> 8) & 255) * 0.0039215688593685626983642578125;
    int _1305 = int(_602.lUniforms.mpCommonPerMesh.gUserDataVec4.y);
    float _1308 = float(_1305 & 255) * 0.0039215688593685626983642578125;
    float _1314 = float((_1305 >> 8) & 255) * 0.0039215688593685626983642578125;
    int _1316 = int(_602.lUniforms.mpCommonPerMesh.gUserDataVec4.z);
    float _1319 = float(_1316 & 255) * 0.0039215688593685626983642578125;
    float _1325 = float((_1316 >> 8) & 255) * 0.0039215688593685626983642578125;
    float _1349 = (_1303 < 0.0) ? (-1.0) : 1.0;
    float _1352 = _1303 * _1349;
    float _1741;
    if (_1352 > 1.0)
    {
        _1741 = pow(_1352, 2.400000095367431640625);
    }
    else
    {
        float _1742;
        if (_1352 > 0.0)
        {
            _1742 = pow(_1352, 2.2000000476837158203125);
        }
        else
        {
            _1742 = _1352;
        }
        _1741 = _1742;
    }
    vec3 _1707 = _1871;
    _1707.x = _1741 * _1349;
    float _1375 = (_1314 < 0.0) ? (-1.0) : 1.0;
    float _1378 = _1314 * _1375;
    float _1753;
    if (_1378 > 1.0)
    {
        _1753 = pow(_1378, 2.400000095367431640625);
    }
    else
    {
        float _1754;
        if (_1378 > 0.0)
        {
            _1754 = pow(_1378, 2.2000000476837158203125);
        }
        else
        {
            _1754 = _1378;
        }
        _1753 = _1754;
    }
    vec3 _1710 = _1707;
    _1710.y = _1753 * _1375;
    float _1401 = (_1325 < 0.0) ? (-1.0) : 1.0;
    float _1404 = _1325 * _1401;
    float _1757;
    if (_1404 > 1.0)
    {
        _1757 = pow(_1404, 2.400000095367431640625);
    }
    else
    {
        float _1758;
        if (_1404 > 0.0)
        {
            _1758 = pow(_1404, 2.2000000476837158203125);
        }
        else
        {
            _1758 = _1404;
        }
        _1757 = _1758;
    }
    vec3 _1713 = _1710;
    _1713.z = _1757 * _1401;
    float _1445 = (_1297 < 0.0) ? (-1.0) : 1.0;
    float _1448 = _1297 * _1445;
    float _1767;
    if (_1448 > 1.0)
    {
        _1767 = pow(_1448, 2.400000095367431640625);
    }
    else
    {
        float _1768;
        if (_1448 > 0.0)
        {
            _1768 = pow(_1448, 2.2000000476837158203125);
        }
        else
        {
            _1768 = _1448;
        }
        _1767 = _1768;
    }
    vec3 _1716 = _1871;
    _1716.x = _1767 * _1445;
    float _1471 = (_1308 < 0.0) ? (-1.0) : 1.0;
    float _1474 = _1308 * _1471;
    float _1784;
    if (_1474 > 1.0)
    {
        _1784 = pow(_1474, 2.400000095367431640625);
    }
    else
    {
        float _1785;
        if (_1474 > 0.0)
        {
            _1785 = pow(_1474, 2.2000000476837158203125);
        }
        else
        {
            _1785 = _1474;
        }
        _1784 = _1785;
    }
    vec3 _1719 = _1716;
    _1719.y = _1784 * _1471;
    float _1497 = (_1319 < 0.0) ? (-1.0) : 1.0;
    float _1500 = _1319 * _1497;
    float _1788;
    if (_1500 > 1.0)
    {
        _1788 = pow(_1500, 2.400000095367431640625);
    }
    else
    {
        float _1789;
        if (_1500 > 0.0)
        {
            _1789 = pow(_1500, 2.2000000476837158203125);
        }
        else
        {
            _1789 = _1500;
        }
        _1788 = _1789;
    }
    vec3 _1722 = _1719;
    _1722.z = _1788 * _1497;
    vec4 _1810;
    if (_741 > 0.25)
    {
        vec4 _1811;
        if (_741 < 0.75)
        {
            vec3 _794 = _732.xyz * _1722;
            _1811 = vec4(_794.x, _794.y, _794.z, _732.w);
        }
        else
        {
            vec3 _801 = _732.xyz * _1713;
            _1811 = vec4(_801.x, _801.y, _801.z, _732.w);
        }
        _1810 = _1811;
    }
    else
    {
        _1810 = _732;
    }
    float _808 = _1810.w * _602.lUniforms.mpCustomPerMaterial.gMaterialColourVec4.w;
    if (_808 < 9.9999997473787516355514526367188e-05)
    {
        discard;
    }
    vec4 _1730 = _1739;
    _1730.x = 0.0;
    vec4 _1732 = _1730;
    _1732.y = clamp(_602.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.x, 0.0, 1.0);
    vec4 _1734 = _1732;
    _1734.z = clamp(_602.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.z, 0.0, 1.0);
    vec4 _1736 = _1734;
    _1736.w = 0.0;
    out_color0 = vec4(_1810.xyz, _808);
    out_color1 = vec4(0.0);
    out_color2 = vec4(0.0);
    out_color3 = _1736;
}


