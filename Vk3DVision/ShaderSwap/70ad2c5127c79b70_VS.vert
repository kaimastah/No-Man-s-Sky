
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
    vec4 gaSkinMatrixRowsVec4[225];
    vec4 gaPrevSkinMatrixRowsVec4[225];
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
} _62;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 6) in vec4 mkWeightsVec4;
layout(location = 5) in vec4 mkJointsVec4;
layout(location = 0) out VertexBlock
{
    vec4 mScreenSpacePositionVec4;
    vec4 mTexCoordsVec4;
} Out;

layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;

mat4 _1662;

void main()
{
    vec4 _1611 = mkLocalPositionVec4;
    _1611.w = 1.0;
    int _1525 = int(mkJointsVec4.x) * 3;
    mat4 _1614 = _1662;
    _1614[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1525];
    mat4 _1616 = _1614;
    _1616[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1525 + 1];
    mat4 _1618 = _1616;
    _1618[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1525 + 2];
    mat4 _1620 = _1618;
    _1620[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 _1463 = (_1611 * _1620) * mkWeightsVec4.x;
    vec4 _1664;
    if (mkWeightsVec4.y > 0.001000000047497451305389404296875)
    {
        int _1546 = int(mkJointsVec4.y) * 3;
        mat4 _1625 = _1662;
        _1625[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1546];
        mat4 _1627 = _1625;
        _1627[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1546 + 1];
        mat4 _1629 = _1627;
        _1629[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1546 + 2];
        mat4 _1631 = _1629;
        _1631[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1664 = _1463 + ((_1611 * _1631) * mkWeightsVec4.y);
    }
    else
    {
        _1664 = _1463;
    }
    vec4 _1667;
    if (mkWeightsVec4.z > 0.001000000047497451305389404296875)
    {
        int _1567 = int(mkJointsVec4.z) * 3;
        mat4 _1636 = _1662;
        _1636[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1567];
        mat4 _1638 = _1636;
        _1638[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1567 + 1];
        mat4 _1640 = _1638;
        _1640[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1567 + 2];
        mat4 _1642 = _1640;
        _1642[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1667 = _1664 + ((_1611 * _1642) * mkWeightsVec4.z);
    }
    else
    {
        _1667 = _1664;
    }
    vec4 _1668;
    if (mkWeightsVec4.w > 0.001000000047497451305389404296875)
    {
        int _1588 = int(mkJointsVec4.w) * 3;
        mat4 _1647 = _1662;
        _1647[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1588];
        mat4 _1649 = _1647;
        _1649[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1588 + 1];
        mat4 _1651 = _1649;
        _1651[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1588 + 2];
        mat4 _1653 = _1651;
        _1653[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1668 = _1667 + ((_1611 * _1653) * mkWeightsVec4.w);
    }
    else
    {
        _1668 = _1667;
    }
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _1609 = _62.lUniforms.mpPerFrame.gViewProjectionMat4 * (_62.lUniforms.mpCommonPerMesh.gWorldMat4 * (_1668 / vec4(max(_1668.w, 9.9999999747524270787835121154785e-07))));
    vec4 _1661 = _1609;
    _1661.z = 0.5 - (max(_1609.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _1661;
    gl_Position = _1661;
}

