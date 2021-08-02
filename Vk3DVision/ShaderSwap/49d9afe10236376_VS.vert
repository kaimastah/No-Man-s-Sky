#version 450
// parallax occlusion mapping
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
    vec4 gParallaxMapDataVec4;
    vec4 gLightPositionVec4;
    vec4 gLightDirectionVec4;
    vec4 gLightOriginVec4;
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
} _109;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;
layout(location = 0) out VertexBlock
{
    vec4 mTexCoordsVec4;
    vec4 mWorldPositionVec3_mfSpare;
    vec3 mTangentSpaceEyeVec3;
    vec3 mTangentSpaceLightDirVec3;
    vec3 mTangentMatRow1Vec3;
    vec3 mTangentMatRow2Vec3;
    vec3 mTangentMatRow3Vec3;
    vec4 mPrevScreenPosition;
    vec4 mScreenSpacePositionVec4;
    flat vec3 mfFadeValueForInstance_mfLodIndex_mfShearMotionLength;
} Out;

layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 8) in vec4 mkColourVec4;

void main()
{
    Out.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.y = 0.0;
    Out.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.x = _109.lUniforms.mpCommonPerMesh.gfFadeValue;
    Out.mWorldPositionVec3_mfSpare = vec4(0.0);
    vec4 _387 = _109.lUniforms.mpCommonPerMesh.gWorldMat4 * mkLocalPositionVec4;
    vec3 _158 = normalize((_109.lUniforms.mpCommonPerMesh.gWorldNormalMat4 * vec4(normalize(mkLocalNormalVec4.xyz), 1.0)).xyz);
    Out.mWorldPositionVec3_mfSpare = vec4(_387.x, _387.y, _387.z, Out.mWorldPositionVec3_mfSpare.w);
    Out.mWorldPositionVec3_mfSpare = vec4(_387.x, _387.y, _387.z, Out.mWorldPositionVec3_mfSpare.w);
    vec3 _409 = (_109.lUniforms.mpCommonPerMesh.gWorldNormalMat4 * vec4(normalize(mkTangentVec4.xyz), 1.0)).xyz;
    vec3 _203 = normalize(_409);
    Out.mTangentMatRow1Vec3 = _203;
    vec3 _208 = normalize(cross(_158, _409) * ((mkTangentVec4.w > 0.00999999977648258209228515625) ? 1.0 : (-1.0)));
    Out.mTangentMatRow2Vec3 = _208;
    vec3 _212 = normalize(_158);
    Out.mTangentMatRow3Vec3 = _212;
    mat3 _249 = transpose(mat3(_203, _208, _212));
    Out.mTangentSpaceLightDirVec3 = _249 * normalize(_109.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz);
    Out.mTangentSpaceEyeVec3 = _249 * normalize(_387.xyz - _109.lUniforms.mpPerFrame.gViewPositionVec3);
    
	float fov = dot(_109.lUniforms.mpPerFrame.gViewProjectionMat4[0].xyz, _109.lUniforms.mpPerFrame.gViewProjectionMat4[0].xyz);
    Out.mTangentSpaceEyeVec3.xyz += vk3d_params.stereo.x * vk3d_params.stereo.y * Out.mTangentSpaceLightDirVec3.xyz * _109.lUniforms.mpPerFrame.gViewProjectionMat4[0].xyz / fov;
    
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.x, mkTexCoordsVec4.y);
    vec4 _417 = _109.lUniforms.mpPerFrame.gViewProjectionMat4 * _387;
    Out.mScreenSpacePositionVec4 = _417;

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
Out.mScreenSpacePositionVec4.x += vk3d_params.stereo.x * (Out.mScreenSpacePositionVec4.w - vk3d_params.stereo.y); 
    Out.mPrevScreenPosition = _109.lUniforms.mpPerFrame.gPrevViewProjectionMat4 * (_109.lUniforms.mpCommonPerMesh.gWorldMotionMat4 * mkLocalPositionVec4);

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
Out.mPrevScreenPosition.x -= vk3d_params.stereo.x * (Out.mPrevScreenPosition.w - vk3d_params.stereo.y); 
    Out.mfFadeValueForInstance_mfLodIndex_mfShearMotionLength.z = 0.0;
    gl_Position = _417;

// Vk3DVision (http://3dsurroundgaming.com/) - Stereo Injection
gl_Position.x += vk3d_params.stereo.x * (gl_Position.w - vk3d_params.stereo.y); 
}



