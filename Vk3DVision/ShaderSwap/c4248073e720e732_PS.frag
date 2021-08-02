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

vec4 _1352;

void main()
{
    if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 1.0)
    {
        vec3 _942 = floor(In.mWorldPositionVec3_mfSpare.xyz);
        vec3 _944 = fract(In.mWorldPositionVec3_mfSpare.xyz);
        vec4 _964 = textureLod(gFadeNoiseMap, (_942.xy + (vec2(37.0, 17.0) * _942.z)) + ((_944 * _944) * (vec3(3.0) - (_944 * 2.0))).xy, 0.0);
        float _965 = _964.x;
        if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 0.0)
        {
            if ((1.0 - _965) > (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x + 2.0))
            {
                discard;
            }
        }
        else
        {
            if (_965 > In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x)
            {
                discard;
            }
        }
    }
    vec2 _1006 = ((In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w)) * 0.5) + vec2(0.5);
    vec2 _1109 = (_1006 * 2.0) - vec2(1.0);
    vec4 _1322 = vec4(_1109.x, _1109.y, _1352.z, _1352.w);
    _1322.z = (((_529.lUniforms.mpPerFrame.gClipPlanesVec4.x * _529.lUniforms.mpPerFrame.gClipPlanesVec4.y) / (texture(gBufferMap, vec2(_1006.x, 1.0 - _1006.y)).x * _529.lUniforms.mpPerFrame.gClipPlanesVec4.y)) - _529.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_529.lUniforms.mpPerFrame.gClipPlanesVec4.y - _529.lUniforms.mpPerFrame.gClipPlanesVec4.x);
    
    _1322.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1322.z * 10);
    
    vec4 _1324 = _1322;
    _1324.w = 1.0;
    vec4 _1119 = _529.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1324;
    vec3 _1035 = (_529.lUniforms.mpCommonPerMesh.gInverseModelMat4 * vec4((_1119.xyz / vec3(_1119.w)).xyz + _529.lUniforms.mpPerFrame.gViewPositionVec3, 1.0)).xyz + vec3(0.5);
    float _1038 = 1.0 - _1035.y;
    vec3 _1328 = _1035;
    _1328.y = _1038;
    float _1041 = _1035.x;
    bool _1042 = _1041 < 0.0;
    bool _1049;
    if (!_1042)
    {
        _1049 = _1041 >= 1.0;
    }
    else
    {
        _1049 = _1042;
    }
    bool _1056;
    if (!_1049)
    {
        _1056 = _1038 < 0.0;
    }
    else
    {
        _1056 = _1049;
    }
    bool _1063;
    if (!_1056)
    {
        _1063 = _1038 >= 1.0;
    }
    else
    {
        _1063 = _1056;
    }
    bool _1070;
    if (!_1063)
    {
        _1070 = _1035.z < 0.0;
    }
    else
    {
        _1070 = _1063;
    }
    bool _1077;
    if (!_1070)
    {
        _1077 = _1035.z >= 1.0;
    }
    else
    {
        _1077 = _1070;
    }
    if (_1077)
    {
        discard;
    }
    vec4 _659 = texture(gDiffuseMap, _1328.xy);
    vec4 _665 = texture(gMasksMap, _1328.xy);
    float _671 = _659.w * _529.lUniforms.mpCustomPerMaterial.gMaterialColourVec4.w;
    if (_671 < 9.9999997473787516355514526367188e-05)
    {
        discard;
    }
    vec4 _1343 = _1352;
    _1343.x = 0.0;
    vec4 _1345 = _1343;
    _1345.y = clamp((1.0 - _665.y) * _529.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.x, 0.0, 1.0);
    vec4 _1347 = _1345;
    _1347.z = clamp(_529.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.z, 0.0, 1.0);
    vec4 _1349 = _1347;
    _1349.w = 0.0;
    out_color0 = vec4(_659.xyz, _671);
    out_color1 = vec4(0.0);
    out_color2 = vec4(0.0);
    out_color3 = _1349;
}


