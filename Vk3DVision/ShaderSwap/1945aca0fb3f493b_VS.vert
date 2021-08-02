
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
} _483;

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

mat4 _1029;
mat3 _1034;
vec3 _1047;

void main()
{
    vec4 _960 = mkLocalPositionVec4;
    _960.w = 1.0;
    mat4 _962 = _1029;
    _962[0] = mkTransformMat4R0;
    mat4 _964 = _962;
    _964[1] = mkTransformMat4R1;
    mat4 _966 = _964;
    _966[2] = mkTransformMat4R2;
    mat4 _968 = _966;
    _968[3] = mkTransformMat4R3;
    Out.mPixelZandW_mfFadeValueForInstance.z = mkTransformMat4R0.w;
    mat4 _971 = _968;
    _971[0].w = 0.0;
    mat4 _973 = _971;
    _973[1].w = 0.0;
    mat4 _975 = _973;
    _975[2].w = 0.0;
    mat4 _977 = _975;
    _977[3].w = 1.0;
    vec4 _628 = _977 * (_483.lUniforms.mpCommonPerMesh.gWorldMat4 * _960);
    vec3 _646 = vec3(_483.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w);
    vec3 _655 = normalize((_628.xyz / _646) - (_483.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz / _646));
    mat3 _1035;
    for (;;)
    {
        vec3 _672 = cross(vec3(0.0, 1.0, 0.0), _655);
        float _675 = _655.y;
        float _677 = length(_672);
        if (!(((_677 > 0.001000000047497451305389404296875) && (_675 < 0.999000012874603271484375)) && (_675 > (-0.999000012874603271484375))))
        {
            _1035 = mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0));
            break;
        }
        vec3 _692 = normalize(_672);
        float _696 = asin(clamp(_677, -1.0, 1.0));
        float _1030;
        if (_675 < 0.0)
        {
            _1030 = 3.141590118408203125 - _696;
        }
        else
        {
            _1030 = _696;
        }
        float _704 = cos(_1030);
        float _706 = 1.0 - _704;
        float _708 = sin(_1030);
        float _711 = _692.x;
        float _719 = _692.y;
        float _721 = _692.z;
        float _724 = (_719 * _721) * _706;
        float _728 = _721 * _708;
        float _740 = _719 * _708;
        mat3 _989 = _1034;
        _989[0] = vec3(_704 + ((_711 * _711) * _706), _724 + _728, ((_721 * _711) * _706) - _740);
        float _775 = _711 * _708;
        mat3 _999 = _989;
        _999[1] = vec3(((_711 * _719) * _706) - _728, _704 + ((_719 * _719) * _706), ((_721 * _719) * _706) + _775);
        mat3 _1009 = _999;
        _1009[2] = vec3(((_711 * _721) * _706) + _740, _724 - _775, _704 + ((_721 * _721) * _706));
        _1035 = _1009;
        break;
    }
    vec4 _511 = _628 - vec4(_483.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz, 0.0);
    float _834 = _483.lUniforms.mpPerFrame.gfTime + (((_511.x + _511.y) + _511.z) * 5.0);
    vec3 _841 = _511.xyz;
    float _860 = dot(_1035[0], _841) + dot(_1035[2], _841);
    float _863 = _483.lUniforms.mpPerFrame.gfTime + ((_860 + 11.0) * 0.4000000059604644775390625);
    float _868 = cos(_863 * 0.0471224971115589141845703125);
    vec3 _1018 = _1047;
    _1018.x = ((((_868 * _868) * cos(_863 * 0.141367495059967041015625)) * cos(_863 * 0.2356124818325042724609375)) * 0.4000000059604644775390625) + (sin(_834 * 0.973865032196044921875) * 0.02500000037252902984619140625);
    float _893 = _483.lUniforms.mpPerFrame.gfTime + ((_860 + 23.0) * 0.5);
    float _898 = cos(_893 * 0.0471224971115589141845703125);
    vec3 _1020 = _1018;
    _1020.y = ((((_898 * _898) * cos(_893 * 0.141367495059967041015625)) * cos(_893 * 0.2356124818325042724609375)) * 0.20000000298023223876953125) + (sin(_834 * 1.036695003509521484375) * 0.02500000037252902984619140625);
    float _923 = _483.lUniforms.mpPerFrame.gfTime + ((_860 + 31.0) * 0.4000000059604644775390625);
    float _928 = cos(_923 * 0.0471224971115589141845703125);
    vec3 _1022 = _1020;
    _1022.z = ((((_928 * _928) * cos(_923 * 0.141367495059967041015625)) * cos(_923 * 0.2356124818325042724609375)) * 0.4000000059604644775390625) + (sin(_834 * 0.911035001277923583984375) * 0.02500000037252902984619140625);
    Out.mTexCoordsVec4 = vec4(mkTexCoordsVec4.x, mkTexCoordsVec4.y, mkTexCoordsVec4.z, mkTexCoordsVec4.w);
    vec4 _958 = _483.lUniforms.mpPerFrame.gViewProjectionMat4 * (_628 + vec4(_1022 * clamp(dot(_1035[1], _841 - _977[3].xyz), -1.0, 1.0), 0.0));
    vec4 _1028 = _958;
    _1028.z = 0.5 - (max(_958.z, -1.0) * 0.5);
    Out.mScreenSpacePositionVec4 = _1028;
    gl_Position = _1028;
}

