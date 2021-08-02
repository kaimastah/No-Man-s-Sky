
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
} _417;

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
layout(location = 8) in vec4 mkColourVec4;
layout(location = 13) in vec4 mkTransformMat4R4;

mat4 _951;
mat3 _952;
vec4 _953;

void main()
{
    mat4 _882 = _951;
    _882[0] = mkTransformMat4R0;
    mat4 _884 = _882;
    _884[1] = mkTransformMat4R1;
    mat4 _886 = _884;
    _886[2] = mkTransformMat4R2;
    mat4 _888 = _886;
    _888[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _891 = _888;
    _891[0].w = 0.0;
    mat4 _893 = _891;
    _893[1].w = 0.0;
    mat4 _895 = _893;
    _895[2].w = 0.0;
    mat4 _897 = _895;
    _897[3].w = 1.0;
    mat4 _627 = _897 * _417.lUniforms.mpCommonPerMesh.gWorldMat4;
    vec3 _685 = _627[3].xyz;
    vec3 _688 = _627[1].xyz;
    vec3 _692 = normalize(_688);
    vec3 _696 = normalize(cross(_692, (-_417.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz).xyz));
    vec3 _714 = normalize(mix(normalize(_417.lUniforms.mpPerFrame.gViewMat4[3].xyz - _685), normalize(cross(_696, _692)), vec3((_417.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x * _417.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x) * _417.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x)));
    mat3 _908 = _952;
    _908[2] = _714;
    mat3 _911 = _908;
    _911[0] = normalize(mix(cross(_692, _714), _696, vec3(_417.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x)));
    mat3 _913 = _911;
    _913[1] = _692;
    vec3 _731 = _913 * mkLocalPositionVec4.xyz;
    vec4 _915 = vec4(_731.x, _731.y, _731.z, _953.w);
    _915.w = 1.0;
    vec4 _737 = _627[0];
    vec4 _742 = _627[2];
    vec3 _793 = ((_915.xyz * vec3(length(_737), length(_688), length(_742))).xyz + _685).xyz + (((_737.xyz * mkTransformMat4R5.x) + (_742.xyz * mkTransformMat4R5.y)) * mkLocalPositionVec4.y);
    vec3 _804 = _793.xyz - _417.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    vec3 _825 = normalize(_417.lUniforms.mpPerFrame.gCameraMat4[3].xyz - _417.lUniforms.mpCommonPerMesh.gLightPositionVec4.xyz);
    vec3 _827 = normalize(_895[2].xyz);
    float _836 = acos(clamp(dot(-_825, _827), -1.0, 1.0)) * 57.295780181884765625;
    float _954;
    if (dot(normalize(cross(_827, _825)), _804 / vec3(length(_804))) >= 0.0)
    {
        _954 = 360.0 - _836;
    }
    else
    {
        _954 = _836;
    }
    vec2 _874 = vec2(((1.0 - mkTexCoordsVec4.x) * _417.lUniforms.mpCustomPerMaterial.gImposterDataVec4.y) + (floor((_954 * 0.00277799996547400951385498046875) * _417.lUniforms.mpCustomPerMaterial.gImposterDataVec4.x) * _417.lUniforms.mpCustomPerMaterial.gImposterDataVec4.y), 1.0 - mkTexCoordsVec4.y);
    Out.mTexCoordsVec4 = vec4(_874.x, _874.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _878 = _417.lUniforms.mpPerFrame.gViewProjectionMat4 * vec4(_793.x, _793.y, _793.z, _915.w);
    float _525 = _878.z;
    Out.mPixelZandW_mfFadeValueForInstance.x = (0.5 - (_525 * 0.5)) - ((_417.lUniforms.mpCustomPerMesh.gBboxDepthAndClips.z + (_417.lUniforms.mpCustomPerMesh.gBboxDepthAndClips.x / (_417.lUniforms.mpCustomPerMesh.gBboxDepthAndClips.w - _417.lUniforms.mpCustomPerMesh.gBboxDepthAndClips.z))) * 0.5);
    Out.mPixelZandW_mfFadeValueForInstance.y = _878.w;
    vec4 _950 = _878;
    _950.z = 0.5 - (max(_525, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _950;
    gl_Position = _950;
}

