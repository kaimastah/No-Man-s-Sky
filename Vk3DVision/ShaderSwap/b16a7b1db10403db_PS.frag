#version 450
// SSR enhanced
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

struct CustomPerMeshUniforms
{
    vec4 gCustomParamsVec4;
    vec4 gaProbePositionsVec4[8];
    vec4 gaProbeExtentsVec4[8];
    mat4 gaProbeMat4[8];
};

struct CommonPerMeshUniforms
{
    vec4 gPlanetPositionVec4;
    mat4 gWorldMat4;
    mat4 gWorldNormalMat4;
    float fdFadeValueDummy;
    float gfShaderVariantData;
    vec4 gLightPositionVec4;
    vec4 gLightDirectionVec4;
    vec4 gLightOriginVec4;
    vec4 gScanParamsPosVec4;
    vec4 gScanParamsCfg1Vec4;
    vec4 gScanParamsCfg2Vec4;
    vec4 gScanParamsCfg3Vec4;
    vec4 gScanColourVec4;
    mat4 gaShadowMat4[3];
    vec4 gLightColourVec4;
    vec4 gLightCustomParamsVec4;
    mat4 gWorldMotionMat4;
    mat4 gInverseModelMat4Dummy;
    vec4 gUserDataVec4;
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    CustomPerMeshUniforms mpCustomPerMesh;
    CommonPerMeshUniforms mpCommonPerMesh;
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
} _729;

layout(set = 1, binding = 0) uniform sampler2D gBufferMap;
layout(set = 1, binding = 1) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 2) uniform sampler2D gBuffer2Map;
layout(set = 1, binding = 3) uniform samplerCube gProbe00Map;
layout(set = 1, binding = 4) uniform samplerCube gProbe01Map;
layout(set = 1, binding = 5) uniform samplerCube gProbe02Map;
layout(set = 1, binding = 6) uniform samplerCube gProbe03Map;
layout(set = 1, binding = 7) uniform samplerCube gProbe04Map;
layout(set = 1, binding = 8) uniform samplerCube gProbe05Map;
layout(set = 1, binding = 9) uniform samplerCube gProbe06Map;
layout(set = 1, binding = 10) uniform samplerCube gProbe07Map;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _1683;
vec3 _1687;

void main()
{
    vec4 _701 = textureLod(gBuffer2Map, In.mTexCoordsVec2, 0.0);
    float _714 = _701.y;
    vec2 _1030 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
    vec4 _1671 = vec4(_1030.x, _1030.y, _1683.z, _1683.w);
    _1671.z = textureLod(gBufferMap, In.mTexCoordsVec2, 0.0).x;
    
    _1671.x -= vk3d_params.stereo.x;
    
    vec4 _1673 = _1671;
    _1673.w = 1.0;
    vec4 _1038 = _729.lUniforms.mpPerFrame.gInverseViewProjectionMat4 * _1673;
    vec3 _1054 = ((_1038.xyz / vec3(_1038.w)).xyz + _729.lUniforms.mpPerFrame.gViewPositionVec3).xyz;
    int _1685;
    vec3 _1686;
    vec3 _1688;
    vec3 _1689;
    _1689 = _1687;
    _1688 = _1687;
    _1686 = _1687;
    _1685 = -1;
    vec3 _1167;
    float _1170;
    bool _1180;
    bool _1181;
    vec3 _1211;
    vec3 _1217;
    bvec3 _1732;
    bool _1249;
    int _1684 = 0;
    float _1701 = uintBitsToFloat(0x7f800000u);
    for (; _1684 < 8; _1180 = _1170 < _1701, _1181 = _1249 && _1180, _1732 = bvec3(_1181), _1701 = _1181 ? _1170 : _1701, _1689 = mix(_1689, _1217, _1732), _1688 = mix(_1688, _1211, _1732), _1686 = mix(_1686, _1167, _1732), _1685 = _1181 ? _1684 : _1685, _1684++)
    {
        _1167 = mat3(_729.lUniforms.mpCustomPerMesh.gaProbeMat4[_1684][0].xyz, _729.lUniforms.mpCustomPerMesh.gaProbeMat4[_1684][1].xyz, _729.lUniforms.mpCustomPerMesh.gaProbeMat4[_1684][2].xyz) * (_1054 - _729.lUniforms.mpCustomPerMesh.gaProbePositionsVec4[_1684].xyz);
        _1170 = dot(_1167, _1167);
        _1211 = _729.lUniforms.mpCustomPerMesh.gaProbeExtentsVec4[_1684].xyz * vec3(0.5);
        _1217 = _729.lUniforms.mpCustomPerMesh.gaProbeExtentsVec4[_1684].xyz * vec3(-0.5);
        bool _1231 = (_1211.x - _1217.x) > 9.9999997473787516355514526367188e-05;
        bool _1240;
        if (_1231)
        {
            _1240 = all(greaterThan(_1167, _1217));
        }
        else
        {
            _1240 = _1231;
        }
        if (_1240)
        {
            _1249 = all(lessThan(_1167, _1211));
        }
        else
        {
            _1249 = _1240;
        }
    }
    vec3 _1195 = mat3(_729.lUniforms.mpCustomPerMesh.gaProbeMat4[_1685][0].xyz, _729.lUniforms.mpCustomPerMesh.gaProbeMat4[_1685][1].xyz, _729.lUniforms.mpCustomPerMesh.gaProbeMat4[_1685][2].xyz) * reflect(normalize(_1054 - _729.lUniforms.mpPerFrame.gViewPositionVec3), normalize((textureLod(gBuffer1Map, In.mTexCoordsVec2, 0.0).xyz * 2.0) - vec3(1.0)));
    vec3 _1697;
    if (_1685 >= 0)
    {
        vec3 _1271 = vec3(1.0) / _1195;
        vec3 _1288 = max((_1689 - _1686) * _1271, (_1688 - _1686) * _1271);
        vec3 _1305 = (_1686 + (_1195 * min(min(_1288.x, _1288.y), _1288.z))) * vec3(-1.0, 1.0, -1.0);
        float _1320 = _714 * _714;
        float _1353 = (2.0 / pow(_1320, 4.0)) + (-1.0);
        float _1329 = mix(0.0, 512.0, _1320);
        float _1333 = (2.0 * tan(mix(acos(pow(0.24400000274181365966796875, 1.0 / _1353)), 0.0, clamp((0.0009765625 / _1353) - 1.0, 0.0, 1.0)) * 0.5)) * _1329;
        float _1342 = clamp((log(((_1333 * (sqrt((_1333 * _1333) + ((_1329 * _1329) * 4.0)) - _1333)) / (_1329 * 4.0)) + 1.0) * 1.5) + 0.699999988079071044921875, 0.0, 7.0);
        vec3 _1694;
        if (_1685 < 4)
        {
            vec3 _1695;
            if (_1685 < 2)
            {
                vec3 _1693;
                if (_1685 == 0)
                {
                    _1693 = textureLod(gProbe00Map, _1305, _1342).xyz;
                }
                else
                {
                    _1693 = textureLod(gProbe01Map, _1305, _1342).xyz;
                }
                _1695 = _1693;
            }
            else
            {
                vec3 _1692;
                if (_1685 == 2)
                {
                    _1692 = textureLod(gProbe02Map, _1305, _1342).xyz;
                }
                else
                {
                    _1692 = textureLod(gProbe03Map, _1305, _1342).xyz;
                }
                _1695 = _1692;
            }
            _1694 = _1695;
        }
        else
        {
            vec3 _1696;
            if (_1685 < 6)
            {
                vec3 _1691;
                if (_1685 == 4)
                {
                    _1691 = textureLod(gProbe04Map, _1305, _1342).xyz;
                }
                else
                {
                    _1691 = textureLod(gProbe05Map, _1305, _1342).xyz;
                }
                _1696 = _1691;
            }
            else
            {
                vec3 _1690;
                if (_1685 == 6)
                {
                    _1690 = textureLod(gProbe06Map, _1305, _1342).xyz;
                }
                else
                {
                    _1690 = textureLod(gProbe07Map, _1305, _1342).xyz;
                }
                _1696 = _1690;
            }
            _1694 = _1696;
        }
        vec3 _1495 = min(abs(_1686 - _1689), abs(_1686 - _1688));
        float _1506 = clamp(min(min(_1495.x, _1495.y), _1495.z) * 0.125, 0.0, 1.0);
        _1697 = mix(vec3(0.0), _1694, vec3(_1506 * _1506)) * 1.0;
    }
    else
    {
        _1697 = vec3(0.0);
    }
    out_color0 = vec4(_1697 * 0.125, 1.0);
}


