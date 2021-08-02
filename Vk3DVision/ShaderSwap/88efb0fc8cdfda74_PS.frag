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
} _656;

layout(set = 1, binding = 2) uniform sampler2D gFadeNoiseMap;
layout(set = 1, binding = 3) uniform sampler2D gBufferMap;
layout(set = 1, binding = 0) uniform sampler2D gDiffuseMap;
layout(set = 1, binding = 1) uniform sampler2D gNormalMap;

layout(location = 0) in VertexBlock
{
    vec4 mTexCoordsVec4;
    vec4 mWorldPositionVec3_mfSpare;
    vec3 mTangentMatRow1Vec3;
    vec3 mTangentMatRow2Vec3;
    vec3 mTangentMatRow3Vec3;
    vec4 mScreenSpacePositionVec4;
    flat vec3 mfFadeValueForInstance_mfLodIndex_mfShearMotionLength;
} In;

layout(location = 0) out vec4 out_color0;
layout(location = 1) out vec4 out_color1;
layout(location = 2) out vec4 out_color2;
layout(location = 3) out vec4 out_color3;

vec4 _1635;

void main()
{
    if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 1.0)
    {
        vec3 _1100 = floor(In.mWorldPositionVec3_mfSpare.xyz);
        vec3 _1102 = fract(In.mWorldPositionVec3_mfSpare.xyz);
        vec4 _1122 = textureLod(gFadeNoiseMap, (_1100.xy + (vec2(37.0, 17.0) * _1100.z)) + ((_1102 * _1102) * (vec3(3.0) - (_1102 * 2.0))).xy, 0.0);
        float _1123 = _1122.x;
        if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 0.0)
        {
            if ((1.0 - _1123) > (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x + 2.0))
            {
                discard;
            }
        }
        else
        {
            if (_1123 > In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x)
            {
                discard;
            }
        }
    }
    vec2 _1164 = ((In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w)) * 0.5) + vec2(0.5);
    vec2 _1267 = (_1164 * 2.0) - vec2(1.0);
    vec4 _1593 = vec4(_1267.x, _1267.y, _1635.z, _1635.w);
    _1593.z = (((_656.lUniforms.mpPerFrame.gClipPlanesVec4.x * _656.lUniforms.mpPerFrame.gClipPlanesVec4.y) / (texture(gBufferMap, vec2(_1164.x, 1.0 - _1164.y)).x * _656.lUniforms.mpPerFrame.gClipPlanesVec4.y)) - _656.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_656.lUniforms.mpPerFrame.gClipPlanesVec4.y - _656.lUniforms.mpPerFrame.gClipPlanesVec4.x);
    
    _1593.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1593.z * 10);
    
    vec4 _1595 = _1593;
    _1595.w = 1.0;
    vec4 _1277 = _656.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1595;
    vec3 _1289 = (_1277.xyz / vec3(_1277.w)).xyz + _656.lUniforms.mpPerFrame.gViewPositionVec3;
    vec3 _1293 = _1289.xyz;
    vec3 _1193 = (_656.lUniforms.mpCommonPerMesh.gInverseModelMat4 * vec4(_1289, 1.0)).xyz + vec3(0.5);
    float _1196 = 1.0 - _1193.y;
    vec3 _1599 = _1193;
    _1599.y = _1196;
    float _1199 = _1193.x;
    bool _1200 = _1199 < 0.0;
    bool _1207;
    if (!_1200)
    {
        _1207 = _1199 >= 1.0;
    }
    else
    {
        _1207 = _1200;
    }
    bool _1214;
    if (!_1207)
    {
        _1214 = _1196 < 0.0;
    }
    else
    {
        _1214 = _1207;
    }
    bool _1221;
    if (!_1214)
    {
        _1221 = _1196 >= 1.0;
    }
    else
    {
        _1221 = _1214;
    }
    bool _1228;
    if (!_1221)
    {
        _1228 = _1193.z < 0.0;
    }
    else
    {
        _1228 = _1221;
    }
    bool _1235;
    if (!_1228)
    {
        _1235 = _1193.z >= 1.0;
    }
    else
    {
        _1235 = _1228;
    }
    if (_1235)
    {
        discard;
    }
    vec4 _786 = texture(gDiffuseMap, _1599.xy);
    float _792 = _786.w * _656.lUniforms.mpCustomPerMaterial.gMaterialColourVec4.w;
    if (_792 < 9.9999997473787516355514526367188e-05)
    {
        discard;
    }
    vec4 _1323 = (texture(gNormalMap, _1599.xy) * 1.9921875) - vec4(1.0);
    float _1325 = _1323.x;
    float _1327 = _1323.y;
    vec3 _1365 = normalize(cross(-dFdy(_1293), dFdx(_1293)));
    vec3 _1370 = -normalize(_656.lUniforms.mpPerFrame.gViewPositionVec3 - _1293);
    vec2 _1376 = dFdx(_1599.xy);
    vec2 _1378 = dFdy(_1599.xy);
    vec3 _1381 = cross(dFdy(_1370), _1365);
    vec3 _1384 = cross(_1365, dFdx(_1370));
    vec3 _1393 = (_1381 * _1376.x) + (_1384 * _1378.x);
    vec3 _1402 = (_1381 * _1376.y) + (_1384 * _1378.y);
    float _1410 = inversesqrt(max(dot(_1393, _1393), dot(_1402, _1402)));
    vec4 _1625 = _1635;
    _1625.x = 0.0;
    vec4 _1627 = _1625;
    _1627.y = clamp(_656.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.x, 0.0, 1.0);
    vec4 _1629 = _1627;
    _1629.z = clamp(_656.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.z, 0.0, 1.0);
    vec4 _1631 = _1629;
    _1631.w = 0.0;
    out_color0 = vec4(_786.xyz, _792);
    out_color1 = vec4(0.0);
    out_color2 = vec4((normalize(mat3(_1393 * _1410, _1402 * _1410, -_1365) * vec3(_1325, _1327, sqrt(max((1.0 - (_1325 * _1325)) - (_1327 * _1327), 0.0)))) * 0.5) + vec3(0.5), _792);
    out_color3 = _1631;
}


