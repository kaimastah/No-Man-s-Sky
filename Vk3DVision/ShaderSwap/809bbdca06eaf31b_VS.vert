
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

mat4 _1663;

void main()
{
    vec4 _1612 = mkLocalPositionVec4;
    _1612.w = 1.0;
    int _1526 = int(mkJointsVec4.x) * 3;
    mat4 _1615 = _1663;
    _1615[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1526];
    mat4 _1617 = _1615;
    _1617[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1526 + 1];
    mat4 _1619 = _1617;
    _1619[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1526 + 2];
    mat4 _1621 = _1619;
    _1621[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 _1464 = (_1612 * _1621) * mkWeightsVec4.x;
    vec4 _1665;
    if (mkWeightsVec4.y > 0.001000000047497451305389404296875)
    {
        int _1547 = int(mkJointsVec4.y) * 3;
        mat4 _1626 = _1663;
        _1626[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1547];
        mat4 _1628 = _1626;
        _1628[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1547 + 1];
        mat4 _1630 = _1628;
        _1630[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1547 + 2];
        mat4 _1632 = _1630;
        _1632[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1665 = _1464 + ((_1612 * _1632) * mkWeightsVec4.y);
    }
    else
    {
        _1665 = _1464;
    }
    vec4 _1668;
    if (mkWeightsVec4.z > 0.001000000047497451305389404296875)
    {
        int _1568 = int(mkJointsVec4.z) * 3;
        mat4 _1637 = _1663;
        _1637[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1568];
        mat4 _1639 = _1637;
        _1639[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1568 + 1];
        mat4 _1641 = _1639;
        _1641[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1568 + 2];
        mat4 _1643 = _1641;
        _1643[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1668 = _1665 + ((_1612 * _1643) * mkWeightsVec4.z);
    }
    else
    {
        _1668 = _1665;
    }
    vec4 _1669;
    if (mkWeightsVec4.w > 0.001000000047497451305389404296875)
    {
        int _1589 = int(mkJointsVec4.w) * 3;
        mat4 _1648 = _1663;
        _1648[0] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1589];
        mat4 _1650 = _1648;
        _1650[1] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1589 + 1];
        mat4 _1652 = _1650;
        _1652[2] = _62.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1589 + 2];
        mat4 _1654 = _1652;
        _1654[3] = vec4(0.0, 0.0, 0.0, 1.0);
        _1669 = _1668 + ((_1612 * _1654) * mkWeightsVec4.w);
    }
    else
    {
        _1669 = _1668;
    }
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _1610 = _62.lUniforms.mpPerFrame.gViewProjectionMat4 * (_62.lUniforms.mpCommonPerMesh.gWorldMat4 * (_1669 / vec4(max(_1669.w, 9.9999999747524270787835121154785e-07))));
    vec4 _1662 = _1610;
    _1662.z = 0.5 - (max(_1610.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _1662;
    gl_Position = _1662;
}

