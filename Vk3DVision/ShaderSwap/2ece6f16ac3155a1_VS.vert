
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
layout(location = 13) in vec4 mkTransformMat4R4;

mat4 _950;
mat3 _951;
vec4 _952;

void main()
{
    mat4 _881 = _950;
    _881[0] = mkTransformMat4R0;
    mat4 _883 = _881;
    _883[1] = mkTransformMat4R1;
    mat4 _885 = _883;
    _885[2] = mkTransformMat4R2;
    mat4 _887 = _885;
    _887[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _890 = _887;
    _890[0].w = 0.0;
    mat4 _892 = _890;
    _892[1].w = 0.0;
    mat4 _894 = _892;
    _894[2].w = 0.0;
    mat4 _896 = _894;
    _896[3].w = 1.0;
    mat4 _626 = _896 * _417.lUniforms.mpCommonPerMesh.gWorldMat4;
    vec3 _684 = _626[3].xyz;
    vec3 _687 = _626[1].xyz;
    vec3 _691 = normalize(_687);
    vec3 _695 = normalize(cross(_691, (-_417.lUniforms.mpCommonPerMesh.gLightDirectionVec4.xyz).xyz));
    vec3 _713 = normalize(mix(normalize(_417.lUniforms.mpPerFrame.gViewMat4[3].xyz - _684), normalize(cross(_695, _691)), vec3((_417.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x * _417.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x) * _417.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x)));
    mat3 _907 = _951;
    _907[2] = _713;
    mat3 _910 = _907;
    _910[0] = normalize(mix(cross(_691, _713), _695, vec3(_417.lUniforms.mpCustomPerMesh.gCustomParams01Vec4.x)));
    mat3 _912 = _910;
    _912[1] = _691;
    vec3 _730 = _912 * mkLocalPositionVec4.xyz;
    vec4 _914 = vec4(_730.x, _730.y, _730.z, _952.w);
    _914.w = 1.0;
    vec4 _736 = _626[0];
    vec4 _741 = _626[2];
    vec3 _792 = ((_914.xyz * vec3(length(_736), length(_687), length(_741))).xyz + _684).xyz + (((_736.xyz * mkTransformMat4R5.x) + (_741.xyz * mkTransformMat4R5.y)) * mkLocalPositionVec4.y);
    vec3 _803 = _792.xyz - _417.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    vec3 _824 = normalize(_417.lUniforms.mpPerFrame.gCameraMat4[3].xyz - _417.lUniforms.mpCommonPerMesh.gLightPositionVec4.xyz);
    vec3 _826 = normalize(_894[2].xyz);
    float _835 = acos(clamp(dot(-_824, _826), -1.0, 1.0)) * 57.295780181884765625;
    float _953;
    if (dot(normalize(cross(_826, _824)), _803 / vec3(length(_803))) >= 0.0)
    {
        _953 = 360.0 - _835;
    }
    else
    {
        _953 = _835;
    }
    vec2 _873 = vec2(((1.0 - mkTexCoordsVec4.x) * _417.lUniforms.mpCustomPerMaterial.gImposterDataVec4.y) + (floor((_953 * 0.00277799996547400951385498046875) * _417.lUniforms.mpCustomPerMaterial.gImposterDataVec4.x) * _417.lUniforms.mpCustomPerMaterial.gImposterDataVec4.y), 1.0 - mkTexCoordsVec4.y);
    Out.mTexCoordsVec4 = vec4(_873.x, _873.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _877 = _417.lUniforms.mpPerFrame.gViewProjectionMat4 * vec4(_792.x, _792.y, _792.z, _914.w);
    float _525 = _877.z;
    Out.mPixelZandW_mfFadeValueForInstance.x = (0.5 - (_525 * 0.5)) - ((_417.lUniforms.mpCustomPerMesh.gBboxDepthAndClips.z + (_417.lUniforms.mpCustomPerMesh.gBboxDepthAndClips.x / (_417.lUniforms.mpCustomPerMesh.gBboxDepthAndClips.w - _417.lUniforms.mpCustomPerMesh.gBboxDepthAndClips.z))) * 0.5);
    Out.mPixelZandW_mfFadeValueForInstance.y = _877.w;
    vec4 _949 = _877;
    _949.z = 0.5 - (max(_525, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _949;
    gl_Position = _949;
}

