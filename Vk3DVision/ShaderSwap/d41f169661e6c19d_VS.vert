
// Vk3DVision (http://3dsurroundgaming.com/) - Original Shader
#version 450

struct PerFrameUniforms
{
    mat4 gViewMat4;
    mat4 gViewProjectionMat4;
    mat4 gCameraMat4;
    vec3 gViewPositionVec3;
    float gfTime;
    vec4 gFrameBufferSizeVec4;
};

struct CommonPerMeshUniforms
{
    vec4 gPlanetPositionVec4;
    mat4 gWorldMat4;
    float fdFadeValueDummy;
    float gfShaderVariantData;
    vec4 gLightPositionVec4;
    vec4 gLightDirectionVec4;
    vec4 gLightOriginVec4;
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
};

struct CustomPerMeshUniforms
{
    vec4 gUVScrollStepVec4;
    vec4 gCustomParams01Vec4;
    vec4 gBboxDepthAndClips;
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
} _406;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 9) in vec4 mkTransformMat4R0;
layout(location = 10) in vec4 mkTransformMat4R1;
layout(location = 11) in vec4 mkTransformMat4R2;
layout(location = 12) in vec4 mkTransformMat4R3;
layout(location = 14) in vec4 mkTransformMat4R5;
layout(location = 0) out VertexBlock
{
    vec4 mScreenSpacePositionVec4;
    vec4 mTexCoordsVec4;
    vec3 mPixelZandW_mfFadeValueForInstance;
} Out;

layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;
layout(location = 13) in vec4 mkTransformMat4R4;

mat4 _970;
vec4 _971;
mat3 _972;
vec2 _975;

void main()
{
    vec4 _887 = mkLocalPositionVec4;
    _887.w = 1.0;
    mat4 _889 = _970;
    _889[0] = mkTransformMat4R0;
    mat4 _891 = _889;
    _891[1] = mkTransformMat4R1;
    mat4 _893 = _891;
    _893[2] = mkTransformMat4R2;
    mat4 _895 = _893;
    _895[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _898 = _895;
    _898[0].w = 0.0;
    mat4 _900 = _898;
    _900[1].w = 0.0;
    mat4 _902 = _900;
    _902[2].w = 0.0;
    mat4 _904 = _902;
    _904[3].w = 1.0;
    vec3 _415 = -_406.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz;
    float _690 = mkTexCoordsVec4.x - 0.5;
    float _701 = _690 * length(_406.lUniforms.mpCommonPerMesh.gWorldMat4[0].xyz);
    vec2 _913 = _975;
    _913.x = _701;
    float _709 = (0.5 - mkTexCoordsVec4.y) * length(_406.lUniforms.mpCommonPerMesh.gWorldMat4[1].xyz);
    vec2 _917 = _913;
    _917.y = _709;
    vec4 _713 = _406.lUniforms.mpCommonPerMesh.gWorldMat4 * _887;
    vec4 _734 = _904 * vec4(_713.xy - _917, _713.z, 1.0);
    mat4 _922 = _904;
    _922[3] = _734;
    vec3 _775 = normalize(_900[1].xyz);
    vec3 _779 = normalize(cross(_775, _415.xyz));
    vec3 _797 = normalize(mix(normalize(_406.lUniforms.mpPerFrame.gViewMat4[3].xyz - _734.xyz), normalize(cross(_779, _775)), vec3((_406.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x * _406.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x) * _406.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x)));
    mat3 _929 = _972;
    _929[2] = _797;
    mat3 _932 = _929;
    _932[0] = normalize(mix(cross(_775, _797), _779, vec3(_406.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x)));
    mat3 _934 = _932;
    _934[1] = _775;
    vec3 _814 = _934 * vec4(_701, _709, 0.0, 1.0).xyz;
    vec4 _936 = vec4(_814.x, _814.y, _814.z, _971.w);
    _936.w = 1.0;
    mat4 _881 = inverse(_922);
    mat4 _939 = _881;
    _939[0] = normalize(_881[0]);
    mat4 _942 = _939;
    _942[1] = normalize(_881[1]);
    mat4 _945 = _942;
    _945[2] = normalize(_881[2]);
    mat4 _947 = _945;
    _947[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 _655 = _922 * vec4((_947 * _936).xyz, 1.0);
    vec3 _455 = _655.xyz + (_415 * (-2.0));
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec2 _477 = (_904[3].xz - _406.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xz) + (mkLocalPositionVec4.xz - vec2(_690, 0.0));
    float _487 = (_477.x * 0.125) + (_477.y * 10.0);
    vec4 _957 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    _957.x = (mkTexCoordsVec4.x / _406.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z) + (floor(mod(_487, _406.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z)) / _406.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.z);
    vec4 _963 = _957;
    _963.y = (mkTexCoordsVec4.y / _406.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w) + (floor(mod(_487, _406.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w)) / _406.lUniforms.mpCustomPerMesh.gUVScrollStepVec4.w);
    Out.mTexCoordsVec4 = _963;
    vec4 _885 = _406.lUniforms.mpPerFrame.gViewProjectionMat4 * vec4(_455.x, _455.y, _455.z, _655.w);
    vec4 _969 = _885;
    _969.z = 0.5 - (max(_885.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _969;
    gl_Position = _969;
}

