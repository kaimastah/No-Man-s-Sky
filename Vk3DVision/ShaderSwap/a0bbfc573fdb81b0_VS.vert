
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
layout(location = 8) in vec4 mkColourVec4;

mat4 _1666;

void main()
{
    vec4 _1615 = mkLocalPositionVec4;
    _1615.w = 1.0;
    int _1529 = int(mkJointsVec4.x) * 3;
    mat4 _1618 = _1666;
    _1618[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1529];
    mat4 _1620 = _1618;
    _1620[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1529 + 1];
    mat4 _1622 = _1620;
    _1622[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1529 + 2];
    mat4 _1624 = _1622;
    _1624[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 _1467 = (_1615 * _1624) * mkWeightsVec4.x;
    vec4 _1668;
    if (mkWeightsVec4.y > 0.001000000047497451305389404296875)
    {
        int _1550 = int(mkJointsVec4.y) * 3;
        mat4 _1629 = _1666;
        _1629[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1550];
        mat4 _1631 = _1629;
        _1631[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1550 + 1];
        mat4 _1633 = _1631;
        _1633[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1550 + 2];
        mat4 _1635 = _1633;
        _1635[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1668 = _1467 + ((_1615 * _1635) * mkWeightsVec4.y);
    }
    else
    {
        _1668 = _1467;
    }
    vec4 _1671;
    if (mkWeightsVec4.z > 0.001000000047497451305389404296875)
    {
        int _1571 = int(mkJointsVec4.z) * 3;
        mat4 _1640 = _1666;
        _1640[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1571];
        mat4 _1642 = _1640;
        _1642[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1571 + 1];
        mat4 _1644 = _1642;
        _1644[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1571 + 2];
        mat4 _1646 = _1644;
        _1646[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1671 = _1668 + ((_1615 * _1646) * mkWeightsVec4.z);
    }
    else
    {
        _1671 = _1668;
    }
    vec4 _1672;
    if (mkWeightsVec4.w > 0.001000000047497451305389404296875)
    {
        int _1592 = int(mkJointsVec4.w) * 3;
        mat4 _1651 = _1666;
        _1651[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1592];
        mat4 _1653 = _1651;
        _1653[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1592 + 1];
        mat4 _1655 = _1653;
        _1655[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1592 + 2];
        mat4 _1657 = _1655;
        _1657[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1672 = _1671 + ((_1615 * _1657) * mkWeightsVec4.w);
    }
    else
    {
        _1672 = _1671;
    }
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _1613 = _62.lUniforms.mpPerFrame.gViewProjectionMat4 * (_62.lUniforms.mpCommonPerMesh.gWorldMat4 * (_1672 / vec4(max(_1672.w, 9.9999999747524270787835121154785e-07))));
    vec4 _1665 = _1613;
    _1665.z = 0.5 - (max(_1613.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _1665;
    gl_Position = _1665;
}

