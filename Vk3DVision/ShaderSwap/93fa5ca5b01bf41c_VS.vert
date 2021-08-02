
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
    float gfFadeValue;
    float gfShaderVariantData;
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
} _51;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 0) out VertexBlock
{
    vec4 mScreenSpacePositionVec4;
} Out;

layout(location = 7) in vec4 mkLocalNormalVec4;

void main()
{
    vec4 _190 = mkLocalPositionVec4;
    _190.w = 1.0;
    vec4 _188 = _51.lUniforms.mpPerFrame.gViewProjectionMat4 * (_51.lUniforms.mpCommonPerMesh.gWorldMat4 * _190);
    vec4 _202;
    if (_51.lUniforms.mpCommonPerMesh.gfFadeValue < 1.0)
    {
        float _200;
        if (_51.lUniforms.mpCommonPerMesh.gfFadeValue < 0.0)
        {
            _200 = mix(0.004999999888241291046142578125, 0.039999999105930328369140625, _51.lUniforms.mpCommonPerMesh.gfFadeValue + 2.0);
        }
        else
        {
            _200 = mix(0.039999999105930328369140625, 0.004999999888241291046142578125, _51.lUniforms.mpCommonPerMesh.gfFadeValue);
        }
        vec4 _193 = _188;
        _193.z = _188.z + _200;
        _202 = _193;
    }
    else
    {
        _202 = _188;
    }
    vec4 _199 = _202;
    _199.z = 0.5 - (max(_202.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _199;
    gl_Position = _199;
}

