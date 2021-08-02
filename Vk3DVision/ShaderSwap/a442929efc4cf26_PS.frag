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

layout(set = 0, binding = 0, std140) uniform lUniforms_BLK
{
    UniformBuffer lUniforms;
} _529;

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
layout(set = 0, binding = 45, std140) uniform Vk3DParams
{
    vec4 stereo;
    vec4 custom_params;
} vk3d_params;

layout(set = 1, binding = 1) uniform sampler2D gFadeNoiseMap;
layout(set = 1, binding = 2) uniform sampler2D gBufferMap;
layout(set = 1, binding = 0) uniform sampler2D gDiffuseMap;

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

vec4 _1342;

void main()
{
    if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 1.0)
    {
        vec3 _933 = floor(In.mWorldPositionVec3_mfSpare.xyz);
        vec3 _935 = fract(In.mWorldPositionVec3_mfSpare.xyz);
        vec4 _955 = textureLod(gFadeNoiseMap, (_933.xy + (vec2(37.0, 17.0) * _933.z)) + ((_935 * _935) * (vec3(3.0) - (_935 * 2.0))).xy, 0.0);
        float _956 = _955.x;
        if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 0.0)
        {
            if ((1.0 - _956) > (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x + 2.0))
            {
                discard;
            }
        }
        else
        {
            if (_956 > In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x)
            {
                discard;
            }
        }
    }
    vec2 _997 = ((In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w)) * 0.5) + vec2(0.5);
    vec2 _1100 = (_997 * 2.0) - vec2(1.0);
    vec4 _1313 = vec4(_1100.x, _1100.y, _1342.z, _1342.w);
    _1313.z = (((_529.lUniforms.mpPerFrame.gClipPlanesVec4.x * _529.lUniforms.mpPerFrame.gClipPlanesVec4.y) / (texture(gBufferMap, vec2(_997.x, 1.0 - _997.y)).x * _529.lUniforms.mpPerFrame.gClipPlanesVec4.y)) - _529.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_529.lUniforms.mpPerFrame.gClipPlanesVec4.y - _529.lUniforms.mpPerFrame.gClipPlanesVec4.x);
    
    _1313.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1313.z * 10); 
    
    vec4 _1315 = _1313;
    _1315.w = 1.0;
    vec4 _1110 = _529.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1315;
    vec3 _1026 = (_529.lUniforms.mpCommonPerMesh.gInverseModelMat4 * vec4((_1110.xyz / vec3(_1110.w)).xyz + _529.lUniforms.mpPerFrame.gViewPositionVec3, 1.0)).xyz + vec3(0.5);
    float _1029 = 1.0 - _1026.y;
    vec3 _1319 = _1026;
    _1319.y = _1029;
    float _1032 = _1026.x;
    bool _1033 = _1032 < 0.0;
    bool _1040;
    if (!_1033)
    {
        _1040 = _1032 >= 1.0;
    }
    else
    {
        _1040 = _1033;
    }
    bool _1047;
    if (!_1040)
    {
        _1047 = _1029 < 0.0;
    }
    else
    {
        _1047 = _1040;
    }
    bool _1054;
    if (!_1047)
    {
        _1054 = _1029 >= 1.0;
    }
    else
    {
        _1054 = _1047;
    }
    bool _1061;
    if (!_1054)
    {
        _1061 = _1026.z < 0.0;
    }
    else
    {
        _1061 = _1054;
    }
    bool _1068;
    if (!_1061)
    {
        _1068 = _1026.z >= 1.0;
    }
    else
    {
        _1068 = _1061;
    }
    if (_1068)
    {
        discard;
    }
    vec4 _659 = texture(gDiffuseMap, _1319.xy);
    float _665 = _659.w * _529.lUniforms.mpCustomPerMaterial.gMaterialColourVec4.w;
    if (_665 < 9.9999997473787516355514526367188e-05)
    {
        discard;
    }
    vec4 _1333 = _1342;
    _1333.x = 0.0;
    vec4 _1335 = _1333;
    _1335.y = clamp(_529.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.x, 0.0, 1.0);
    vec4 _1337 = _1335;
    _1337.z = clamp(_529.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.z, 0.0, 1.0);
    vec4 _1339 = _1337;
    _1339.w = 0.0;
    out_color0 = vec4(_659.xyz, _665);
    out_color1 = vec4(0.0);
    out_color2 = vec4(0.0);
    out_color3 = _1339;
}


