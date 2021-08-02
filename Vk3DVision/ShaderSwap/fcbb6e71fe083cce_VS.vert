
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
} _110;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 9) in vec4 mkTransformMat4R0;
layout(location = 10) in vec4 mkTransformMat4R1;
layout(location = 11) in vec4 mkTransformMat4R2;
layout(location = 12) in vec4 mkTransformMat4R3;
layout(location = 13) in vec4 mkTransformMat4R4;
layout(location = 14) in vec4 mkTransformMat4R5;
layout(location = 0) out VertexBlock
{
    vec4 mScreenSpacePositionVec4;
    vec4 mTexCoordsVec4;
    vec3 mPixelZandW_mfFadeValueForInstance;
} Out;

layout(location = 1) in vec4 mkTexCoordsVec4;
layout(location = 6) in vec4 mkWeightsVec4;
layout(location = 5) in vec4 mkJointsVec4;
layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 3) in vec4 mkTangentVec4;
layout(location = 8) in vec4 mkColourVec4;

mat4 _2686;
vec3 _2687;

void main()
{
    vec4 _2524 = mkLocalPositionVec4;
    _2524.w = 1.0;
    mat4 _2526 = _2686;
    _2526[0] = mkTransformMat4R0;
    mat4 _2528 = _2526;
    _2528[1] = mkTransformMat4R1;
    mat4 _2530 = _2528;
    _2530[2] = mkTransformMat4R2;
    mat4 _2532 = _2530;
    _2532[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _2538 = _2532;
    _2538[0].w = 0.0;
    mat4 _2540 = _2538;
    _2540[1].w = 0.0;
    mat4 _2542 = _2540;
    _2542[2].w = 0.0;
    mat4 _2544 = _2542;
    _2544[3].w = 1.0;
    int _1763 = int(mkJointsVec4.x) * 4;
    vec2 _1871 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1763].x)));
    vec3 _2549 = vec3(_1871.x, _1871.y, _2687.z);
    _2549.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1763].y;
    vec2 _1884 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1763].z)));
    vec3 _2554 = vec3(_1884.x, _1884.y, _2687.z);
    _2554.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1763].w;
    int _1784 = _1763 + 1;
    vec2 _1897 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1784].x)));
    vec3 _2559 = vec3(_1897.x, _1897.y, _2687.z);
    _2559.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1784].y;
    vec3 _1792 = ((_2549 * mkTransformMat4R1.w) + (_2554 * mkTransformMat4R2.w)) + (_2559 * mkTransformMat4R3.w);
    bool _1796 = abs(mkTransformMat4R4.x) > 0.0;
    vec3 _2688;
    if (_1796)
    {
        vec2 _1910 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1784].z)));
        vec3 _2565 = vec3(_1910.x, _1910.y, _2687.z);
        _2565.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1784].w;
        int _1812 = _1763 + 2;
        vec2 _1923 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1812].x)));
        vec3 _2570 = vec3(_1923.x, _1923.y, _2687.z);
        _2570.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1812].y;
        vec2 _1936 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1812].z)));
        vec3 _2575 = vec3(_1936.x, _1936.y, _2687.z);
        _2575.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1812].w;
        _2688 = ((_1792 + (_2565 * mkTransformMat4R4.x)) + (_2570 * mkTransformMat4R4.y)) + (_2575 * mkTransformMat4R4.z);
    }
    else
    {
        _2688 = _1792;
    }
    int _1834 = _1763 + 3;
    vec3 _2689;
    if (_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1834].w > 0.0)
    {
        vec2 _1861 = _2688.xz + (mkTransformMat4R5.xy + (mkTransformMat4R5.zw * (_2524.xz - _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1834].xz)));
        _2689 = vec3(_1861.x, _2688.y, _1861.y);
    }
    else
    {
        _2689 = _2688;
    }
    vec3 _1692 = _2524.xyz + (_2689 * mkWeightsVec4.x);
    vec3 _2742;
    if (mkWeightsVec4.y > 9.9999997473787516355514526367188e-05)
    {
        int _1955 = int(mkJointsVec4.y) * 4;
        vec2 _2063 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1955].x)));
        vec3 _2583 = vec3(_2063.x, _2063.y, _2687.z);
        _2583.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1955].y;
        vec2 _2076 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1955].z)));
        vec3 _2588 = vec3(_2076.x, _2076.y, _2687.z);
        _2588.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1955].w;
        int _1976 = _1955 + 1;
        vec2 _2089 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1976].x)));
        vec3 _2593 = vec3(_2089.x, _2089.y, _2687.z);
        _2593.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1976].y;
        vec3 _1984 = ((_2583 * mkTransformMat4R1.w) + (_2588 * mkTransformMat4R2.w)) + (_2593 * mkTransformMat4R3.w);
        vec3 _2704;
        if (_1796)
        {
            vec2 _2102 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1976].z)));
            vec3 _2599 = vec3(_2102.x, _2102.y, _2687.z);
            _2599.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_1976].w;
            int _2004 = _1955 + 2;
            vec2 _2115 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2004].x)));
            vec3 _2604 = vec3(_2115.x, _2115.y, _2687.z);
            _2604.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2004].y;
            vec2 _2128 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2004].z)));
            vec3 _2609 = vec3(_2128.x, _2128.y, _2687.z);
            _2609.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2004].w;
            _2704 = ((_1984 + (_2599 * mkTransformMat4R4.x)) + (_2604 * mkTransformMat4R4.y)) + (_2609 * mkTransformMat4R4.z);
        }
        else
        {
            _2704 = _1984;
        }
        int _2026 = _1955 + 3;
        vec3 _2705;
        if (_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2026].w > 0.0)
        {
            vec2 _2053 = _2704.xz + (mkTransformMat4R5.xy + (mkTransformMat4R5.zw * (_2524.xz - _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2026].xz)));
            _2705 = vec3(_2053.x, _2704.y, _2053.y);
        }
        else
        {
            _2705 = _2704;
        }
        _2742 = _1692 + (_2705 * mkWeightsVec4.y);
    }
    else
    {
        _2742 = _1692;
    }
    vec3 _2795;
    if (mkWeightsVec4.z > 9.9999997473787516355514526367188e-05)
    {
        int _2147 = int(mkJointsVec4.z) * 4;
        vec2 _2255 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2147].x)));
        vec3 _2617 = vec3(_2255.x, _2255.y, _2687.z);
        _2617.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2147].y;
        vec2 _2268 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2147].z)));
        vec3 _2622 = vec3(_2268.x, _2268.y, _2687.z);
        _2622.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2147].w;
        int _2168 = _2147 + 1;
        vec2 _2281 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2168].x)));
        vec3 _2627 = vec3(_2281.x, _2281.y, _2687.z);
        _2627.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2168].y;
        vec3 _2176 = ((_2617 * mkTransformMat4R1.w) + (_2622 * mkTransformMat4R2.w)) + (_2627 * mkTransformMat4R3.w);
        vec3 _2738;
        if (_1796)
        {
            vec2 _2294 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2168].z)));
            vec3 _2633 = vec3(_2294.x, _2294.y, _2687.z);
            _2633.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2168].w;
            int _2196 = _2147 + 2;
            vec2 _2307 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2196].x)));
            vec3 _2638 = vec3(_2307.x, _2307.y, _2687.z);
            _2638.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2196].y;
            vec2 _2320 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2196].z)));
            vec3 _2643 = vec3(_2320.x, _2320.y, _2687.z);
            _2643.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2196].w;
            _2738 = ((_2176 + (_2633 * mkTransformMat4R4.x)) + (_2638 * mkTransformMat4R4.y)) + (_2643 * mkTransformMat4R4.z);
        }
        else
        {
            _2738 = _2176;
        }
        int _2218 = _2147 + 3;
        vec3 _2739;
        if (_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2218].w > 0.0)
        {
            vec2 _2245 = _2738.xz + (mkTransformMat4R5.xy + (mkTransformMat4R5.zw * (_2524.xz - _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2218].xz)));
            _2739 = vec3(_2245.x, _2738.y, _2245.y);
        }
        else
        {
            _2739 = _2738;
        }
        _2795 = _2742 + (_2739 * mkWeightsVec4.z);
    }
    else
    {
        _2795 = _2742;
    }
    vec3 _2796;
    if (mkWeightsVec4.w > 9.9999997473787516355514526367188e-05)
    {
        int _2339 = int(mkJointsVec4.w) * 4;
        vec2 _2447 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2339].x)));
        vec3 _2651 = vec3(_2447.x, _2447.y, _2687.z);
        _2651.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2339].y;
        vec2 _2460 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2339].z)));
        vec3 _2656 = vec3(_2460.x, _2460.y, _2687.z);
        _2656.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2339].w;
        int _2360 = _2339 + 1;
        vec2 _2473 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2360].x)));
        vec3 _2661 = vec3(_2473.x, _2473.y, _2687.z);
        _2661.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2360].y;
        vec3 _2368 = ((_2651 * mkTransformMat4R1.w) + (_2656 * mkTransformMat4R2.w)) + (_2661 * mkTransformMat4R3.w);
        vec3 _2791;
        if (_1796)
        {
            vec2 _2486 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2360].z)));
            vec3 _2667 = vec3(_2486.x, _2486.y, _2687.z);
            _2667.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2360].w;
            int _2388 = _2339 + 2;
            vec2 _2499 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2388].x)));
            vec3 _2672 = vec3(_2499.x, _2499.y, _2687.z);
            _2672.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2388].y;
            vec2 _2512 = unpackHalf2x16(uint(floatBitsToInt(_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2388].z)));
            vec3 _2677 = vec3(_2512.x, _2512.y, _2687.z);
            _2677.z = _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2388].w;
            _2791 = ((_2368 + (_2667 * mkTransformMat4R4.x)) + (_2672 * mkTransformMat4R4.y)) + (_2677 * mkTransformMat4R4.z);
        }
        else
        {
            _2791 = _2368;
        }
        int _2410 = _2339 + 3;
        vec3 _2792;
        if (_110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2410].w > 0.0)
        {
            vec2 _2437 = _2791.xz + (mkTransformMat4R5.xy + (mkTransformMat4R5.zw * (_2524.xz - _110.lUniforms.mpCommonPerMesh.gaSkinMatrixRowsVec4[_2410].xz)));
            _2792 = vec3(_2437.x, _2791.y, _2437.y);
        }
        else
        {
            _2792 = _2791;
        }
        _2796 = _2795 + (_2792 * mkWeightsVec4.w);
    }
    else
    {
        _2796 = _2795;
    }
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _2522 = _110.lUniforms.mpPerFrame.gViewProjectionMat4 * (_2544 * (_110.lUniforms.mpCommonPerMesh.gWorldMat4 * vec4(_2796.x, _2796.y, _2796.z, _2524.w)));
    vec4 _2685 = _2522;
    _2685.z = 0.5 - (max(_2522.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _2685;
    gl_Position = _2685;
}

