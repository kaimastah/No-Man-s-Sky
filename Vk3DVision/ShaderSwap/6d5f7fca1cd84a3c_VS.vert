#version 450

invariant gl_Position;

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
    float fdFadeValueDummy;
    float gfShaderVariantData;
    vec4 gParallaxMapDataVec4;
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
    vec4 gAverageColour1Vec4;
    vec4 gAverageColour2Vec4;
    vec4 gRecolour1Vec4;
    vec4 gRecolour2Vec4;
    vec4 gSkyColourVec4;
    vec4 gHorizonColourVec4;
    vec4 gSunColourVec4;
    vec4 gWaterFogColourNearVec4;
    vec4 gWaterFogColourFarVec4;
    vec4 gWaterFogVec4;
    vec4 gHeightFogParamsVec4;
    vec4 gHeightFogColourVec4;
    vec4 gSpaceHorizonColourVec4;
    vec4 gFogColourVec4;
    vec4 gFogParamsVec4;
    vec4 gScatteringParamsVec4;
    vec4 gFogFadeHeightsVec4;
    vec4 gSpaceScatteringParamsVec4;
    vec4 gSkyUpperColourVec4;
    vec4 gLightTopColourVec4;
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
} _220;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;
layout(location = 9) in vec4 mkTransformMat4R0;
layout(location = 10) in vec4 mkTransformMat4R1;
layout(location = 11) in vec4 mkTransformMat4R2;
layout(location = 12) in vec4 mkTransformMat4R3;
layout(location = 0) out VertexBlock
{
    vec4 mTexCoordsVec4;
    vec4 mWorldPositionVec3_mfSpare;
    vec3 mTangentSpaceEyeVec3;
    vec3 mTangentSpaceLightDirVec3;
    flat mat3 mUpMatrixMat3;
    vec3 mTangentMatRow1Vec3;
    vec3 mTangentMatRow2Vec3;
    vec3 mTangentMatRow3Vec3;
    vec4 mScreenSpacePositionVec4;
    flat vec3 mfFadeValueForInstance_mfLodIndex_mfShearMotionLength;
} Out;

layout(location = 14) in vec4 mkTransformMat4R5;
layout(location = 13) in vec4 mkTransformMat4R4;
layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 8) in vec4 mkColourVec4;

mat4 _653;
mat3 _654;

void main()
{
    mat4 _612 = _653;
    _612[0] = mkTransformMat4R0;
    mat4 _614 = _612;
    _614[1] = mkTransformMat4R1;
    mat4 _616 = _614;
    _616[2] = mkTransformMat4R2;
    mat4 _618 = _616;
    _618[3] = mkTransformMat4R3;
    Out.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x = mkTransformMat4R0.w;
    mat4 _621 = _618;
    _621[0].w = 0.0;
    mat4 _623 = _621;
    _623[1].w = 0.0;
    mat4 _625 = _623;
    _625[2].w = 0.0;
    mat4 _627 = _625;
    _627[3].w = 1.0;
    Out.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.y = mkTransformMat4R4.w;
    Out.mWorldPositionVec3_mfSpare = vec4(0.0);
    vec4 _485 = _220.lUniforms.mpCommonPerMesh.gWorldMat4 * mkLocalPositionVec4;
    vec4 _488 = _627 * _485;
    mat4 _529 = mat4(vec4(normalize(vec3(mkTransformMat4R0.xyz)), 0.0), vec4(normalize(vec3(mkTransformMat4R1.xyz)), 0.0), vec4(normalize(vec3(mkTransformMat4R2.xyz)), 0.0), vec4(0.0, 0.0, 0.0, 1.0));
    vec3 _239 = normalize((_529 * vec4((_220.lUniforms.mpCommonPerMesh.gWorldNormalMat4 * vec4(normalize(mkLocalNormalVec4.xyz), 1.0)).xyz, 1.0)).xyz);
    Out.mWorldPositionVec3_mfSpare = vec4(_488.x, _488.y, _488.z, Out.mWorldPositionVec3_mfSpare.w);
    Out.mWorldPositionVec3_mfSpare = vec4(_488.x, _488.y, _488.z, Out.mWorldPositionVec3_mfSpare.w);
    vec3 _602 = (_529 * vec4((_220.lUniforms.mpCommonPerMesh.gWorldNormalMat4 * vec4(normalize(mkTangentVec4.xyz), 1.0)).xyz, 1.0)).xyz;
    vec3 _281 = normalize(_602);
    Out.mTangentMatRow1Vec3 = _281;
    vec3 _286 = normalize(cross(_239, _602) * ((mkTangentVec4.w > 0.00999999977648258209228515625) ? 1.0 : (-1.0)));
    Out.mTangentMatRow2Vec3 = _286;
    vec3 _290 = normalize(_239);
    Out.mTangentMatRow3Vec3 = _290;
    mat3 _326 = transpose(mat3(_281, _286, _290));
    Out.mTangentSpaceLightDirVec3 = _326 * normalize(_220.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz);
    Out.mTangentSpaceEyeVec3 = _326 * normalize(_488.xyz - _220.lUniforms.mpPerFrame.gViewPositionVec3);

float fov = dot(_220.lUniforms.mpPerFrame.gViewProjectionMat4[0].xyz, _220.lUniforms.mpPerFrame.gViewProjectionMat4[0].xyz);
Out.mTangentSpaceEyeVec3.xyz += vk3d_params.stereo.x * vk3d_params.stereo.y * Out.mTangentSpaceLightDirVec3.xyz * _220.lUniforms.mpPerFrame.gViewProjectionMat4[0].xyz / fov; 
    mat3 _648 = _654;
    _648[0] = _220.lUniforms.mpPerFrame.gInverseWorldUpMatVec4[0].xyz;
    mat3 _650 = _648;
    _650[1] = _220.lUniforms.mpPerFrame.gInverseWorldUpMatVec4[1].xyz;
    mat3 _652 = _650;
    _652[2] = _220.lUniforms.mpPerFrame.gInverseWorldUpMatVec4[2].xyz;
    Out.mUpMatrixMat3 = _652;
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.x, mkTexCoordsVec4.y);
    vec4 _610 = _220.lUniforms.mpPerFrame.gViewProjectionMat4 * _488;
    Out.mScreenSpacePositionVec4 = _610;

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
Out.mScreenSpacePositionVec4.x += vk3d_params.stereo.x * (Out.mScreenSpacePositionVec4.w - vk3d_params.stereo.y); 
    Out.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.z = 0.0;
    gl_Position = _610;

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
gl_Position.x += vk3d_params.stereo.x * (gl_Position.w - vk3d_params.stereo.y); 
}

