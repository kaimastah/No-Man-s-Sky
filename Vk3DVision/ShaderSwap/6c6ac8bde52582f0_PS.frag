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
} _529;

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

vec4 _1351;

void main()
{
    if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 1.0)
    {
        vec3 _941 = floor(In.mWorldPositionVec3_mfSpare.xyz);
        vec3 _943 = fract(In.mWorldPositionVec3_mfSpare.xyz);
        vec4 _963 = textureLod(gFadeNoiseMap, (_941.xy + (vec2(37.0, 17.0) * _941.z)) + ((_943 * _943) * (vec3(3.0) - (_943 * 2.0))).xy, 0.0);
        float _964 = _963.x;
        if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 0.0)
        {
            if ((1.0 - _964) > (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x + 2.0))
            {
                discard;
            }
        }
        else
        {
            if (_964 > In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x)
            {
                discard;
            }
        }
    }
    vec2 _1005 = ((In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w)) * 0.5) + vec2(0.5);
    vec2 _1108 = (_1005 * 2.0) - vec2(1.0);
    vec4 _1321 = vec4(_1108.x, _1108.y, _1351.z, _1351.w);
    _1321.z = (((_529.lUniforms.mpPerFrame.gClipPlanesVec4.x * _529.lUniforms.mpPerFrame.gClipPlanesVec4.y) / (texture(gBufferMap, vec2(_1005.x, 1.0 - _1005.y)).x * _529.lUniforms.mpPerFrame.gClipPlanesVec4.y)) - _529.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_529.lUniforms.mpPerFrame.gClipPlanesVec4.y - _529.lUniforms.mpPerFrame.gClipPlanesVec4.x);
    
    _1321.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1321.z * 10);
    
    vec4 _1323 = _1321;
    _1323.w = 1.0;
    vec4 _1118 = _529.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1323;
    vec3 _1034 = (_529.lUniforms.mpCommonPerMesh.gInverseModelMat4 * vec4((_1118.xyz / vec3(_1118.w)).xyz + _529.lUniforms.mpPerFrame.gViewPositionVec3, 1.0)).xyz + vec3(0.5);
    float _1037 = 1.0 - _1034.y;
    vec3 _1327 = _1034;
    _1327.y = _1037;
    float _1040 = _1034.x;
    bool _1041 = _1040 < 0.0;
    bool _1048;
    if (!_1041)
    {
        _1048 = _1040 >= 1.0;
    }
    else
    {
        _1048 = _1041;
    }
    bool _1055;
    if (!_1048)
    {
        _1055 = _1037 < 0.0;
    }
    else
    {
        _1055 = _1048;
    }
    bool _1062;
    if (!_1055)
    {
        _1062 = _1037 >= 1.0;
    }
    else
    {
        _1062 = _1055;
    }
    bool _1069;
    if (!_1062)
    {
        _1069 = _1034.z < 0.0;
    }
    else
    {
        _1069 = _1062;
    }
    bool _1076;
    if (!_1069)
    {
        _1076 = _1034.z >= 1.0;
    }
    else
    {
        _1076 = _1069;
    }
    if (_1076)
    {
        discard;
    }
    vec4 _659 = texture(gDiffuseMap, _1327.xy);
    vec4 _665 = texture(gMasksMap, _1327.xy);
    float _667 = _659.w;
    if (_667 < 0.449999988079071044921875)
    {
        discard;
    }
    vec4 _1342 = _1351;
    _1342.x = 0.0;
    vec4 _1344 = _1342;
    _1344.y = clamp((1.0 - _665.y) * _529.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.x, 0.0, 1.0);
    vec4 _1346 = _1344;
    _1346.z = clamp(_529.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.z, 0.0, 1.0);
    vec4 _1348 = _1346;
    _1348.w = 0.0;
    out_color0 = vec4(_659.xyz, smoothstep(0.449999988079071044921875, 0.800000011920928955078125, _667));
    out_color1 = vec4(0.0);
    out_color2 = vec4(0.0);
    out_color3 = _1348;
}


