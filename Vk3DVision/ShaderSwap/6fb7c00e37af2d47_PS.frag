#version 450
// meteor lighting maybe
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
} _531;

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

vec4 _1433;

void main()
{
    if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 1.0)
    {
        vec3 _1024 = floor(In.mWorldPositionVec3_mfSpare.xyz);
        vec3 _1026 = fract(In.mWorldPositionVec3_mfSpare.xyz);
        vec4 _1046 = textureLod(gFadeNoiseMap, (_1024.xy + (vec2(37.0, 17.0) * _1024.z)) + ((_1026 * _1026) * (vec3(3.0) - (_1026 * 2.0))).xy, 0.0);
        float _1047 = _1046.x;
        if (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x < 0.0)
        {
            if ((1.0 - _1047) > (In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x + 2.0))
            {
                discard;
            }
        }
        else
        {
            if (_1047 > In.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x)
            {
                discard;
            }
        }
    }
    vec2 _1088 = ((In.mScreenSpacePositionVec4.xy / vec2(In.mScreenSpacePositionVec4.w)) * 0.5) + vec2(0.5);
    vec2 _1191 = (_1088 * 2.0) - vec2(1.0);
    vec4 _1404 = vec4(_1191.x, _1191.y, _1433.z, _1433.w);
    _1404.z = (((_531.lUniforms.mpPerFrame.gClipPlanesVec4.x * _531.lUniforms.mpPerFrame.gClipPlanesVec4.y) / (texture(gBufferMap, vec2(_1088.x, 1.0 - _1088.y)).x * _531.lUniforms.mpPerFrame.gClipPlanesVec4.y)) - _531.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_531.lUniforms.mpPerFrame.gClipPlanesVec4.y - _531.lUniforms.mpPerFrame.gClipPlanesVec4.x);
    
    _1404.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y * _1404.z * 10); 
    
    vec4 _1406 = _1404;
    _1406.w = 1.0;
    vec4 _1201 = _531.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1406;
    vec3 _1117 = (_531.lUniforms.mpCommonPerMesh.gInverseModelMat4 * vec4((_1201.xyz / vec3(_1201.w)).xyz + _531.lUniforms.mpPerFrame.gViewPositionVec3, 1.0)).xyz + vec3(0.5);
    float _1120 = 1.0 - _1117.y;
    vec3 _1410 = _1117;
    _1410.y = _1120;
    float _1123 = _1117.x;
    bool _1124 = _1123 < 0.0;
    bool _1131;
    if (!_1124)
    {
        _1131 = _1123 >= 1.0;
    }
    else
    {
        _1131 = _1124;
    }
    bool _1138;
    if (!_1131)
    {
        _1138 = _1120 < 0.0;
    }
    else
    {
        _1138 = _1131;
    }
    bool _1145;
    if (!_1138)
    {
        _1145 = _1120 >= 1.0;
    }
    else
    {
        _1145 = _1138;
    }
    bool _1152;
    if (!_1145)
    {
        _1152 = _1117.z < 0.0;
    }
    else
    {
        _1152 = _1145;
    }
    bool _1159;
    if (!_1152)
    {
        _1159 = _1117.z >= 1.0;
    }
    else
    {
        _1159 = _1152;
    }
    if (_1159)
    {
        discard;
    }
    vec4 _661 = texture(gDiffuseMap, _1410.xy);
    float _667 = _661.w * _531.lUniforms.mpCustomPerMaterial.gMaterialColourVec4.w;
    if (_667 < 9.9999997473787516355514526367188e-05)
    {
        discard;
    }
    vec4 _1424 = _1433;
    _1424.x = 0.0;
    vec4 _1426 = _1424;
    _1426.y = clamp(_531.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.x, 0.0, 1.0);
    vec4 _1428 = _1426;
    _1428.z = clamp(_531.lUniforms.mpCustomPerMaterial.gMaterialParamsVec4.z, 0.0, 1.0);
    vec4 _1430 = _1428;
    _1430.w = 0.0;
    out_color0 = vec4(_661.xyz, _667);
    out_color1 = vec4(0.0);
    out_color2 = vec4(0.0);
    out_color3 = _1430;
}


