
// Vk3DVision (http://3dsurroundgaming.com/) - Original Shader
#version 450

struct PerFrameUniforms
{
    mat4 gViewMat4;
    mat4 gViewProjectionMat4;
    vec3 gViewPositionVec3;
    float gfTime;
    vec4 gClipPlanesVec4;
    vec4 gTessSettingsVec4;
    vec4 gFrameBufferSizeVec4;
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
    vec4 gUserDataVec4;
};

struct CustomPerMaterialUniforms
{
    vec4 gWaterFogVec4;
    vec4 gSkyColourVec4;
    vec4 gHorizonColourVec4;
    vec4 gSunColourVec4;
    vec4 gWaterFogColourNearVec4;
    vec4 gWaterFogColourFarVec4;
    vec4 gTerrainEditEffectsVec4;
    vec4 gHeightFogParamsVec4;
    vec4 gHeightFogColourVec4;
    vec4 gSpaceHorizonColourVec4;
    vec4 gFogColourVec4;
    vec4 gFogParamsVec4;
    vec4 gScatteringParamsVec4;
    vec4 gSpaceSkyColour1Vec4;
    vec4 gSpaceSkyColour2Vec4;
    vec4 gSpaceSkyColour3Vec4;
    vec4 gSpaceSkyColourVec4;
    vec4 gFogFadeHeightsVec4;
    vec4 gSunPositionVec4;
    vec4 gSpaceScatteringParamsVec4;
    vec4 gTerrainDistancesVec4;
    vec4 gSkyUpperColourVec4;
    vec4 gMaterialParamsVec4;
    vec4 gaAverageColoursVec4[23];
    vec4 gaTerrainColoursVec4[23];
    vec4 gaSpecularValuesVec4[6];
    vec4 gAverageColour1Vec4;
    vec4 gAverageColour2Vec4;
    vec4 gDebugColourVec4;
    vec4 gHueOverlayParamsVec4;
    vec4 gSaturationOverlayParamsVec4;
    vec4 gValueOverlayParamsVec4;
    vec4 gTileBlendScalesVec4;
    vec4 gLightTopColourVec4;
};

struct CustomPerMeshUniforms
{
    vec4 gTerrainLodParamsVec4;
    vec4 gSparseTextureStatusVec4;
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
} _199;

layout(location = 0) in vec4 mkLocalPositionVec4;
layout(location = 7) in vec4 mkLocalNormalVec4;
layout(location = 5) in vec4 mkCustom1Vec4;
layout(location = 0) out VertexBlock
{
    vec4 mLocalPositionVec4;
    vec4 mTileVec4;
    vec4 mSmoothNormalVec3_mfDistForFade;
} Out;


vec3 _650;
vec4 _653;

void main()
{
    float _483 = 1.0 - abs(mkLocalNormalVec4.z);
    float _486 = abs(mkLocalNormalVec4.w);
    float _487 = _483 - _486;
    vec3 _597 = _650;
    _597.z = _487;
    vec3 _651;
    if (_487 >= 0.0)
    {
        _651 = vec3(mkLocalNormalVec4.z, mkLocalNormalVec4.w, _597.z);
    }
    else
    {
        vec3 _608 = _597;
        _608.x = (1.0 - _486) * ((mkLocalNormalVec4.z < 0.0) ? (-1.0) : 1.0);
        vec3 _612 = _608;
        _612.y = _483 * ((mkLocalNormalVec4.w < 0.0) ? (-1.0) : 1.0);
        _651 = _612;
    }
    vec3 _525 = normalize(_651);
    vec3 _208 = mkLocalPositionVec4.xyz + _199.lUniforms.mpCommonPerMesh.gWorldMat4[3].xyz;
    vec4 _614 = vec4(_208.x, _208.y, _208.z, _653.w);
    _614.w = 1.0;
    vec3 _223 = _199.lUniforms.mpPerFrame.gViewPositionVec3 - _614.xyz;
    float _227 = dot(_223, _223);
    vec4 _654;
    vec3 _655;
    if (_227 > 36000000.0)
    {
        vec3 _240 = normalize(_614.xyz - _199.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz);
        vec3 _264 = vec3(clamp((sqrt(_227) - 6000.0) * 0.00025000001187436282634735107421875, 0.0, 1.0));
        vec3 _265 = mix(_614.xyz, (_240 * (_199.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w - 1.0)) + _199.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz, _264);
        _655 = mix(_525, _240, _264);
        _654 = vec4(_265.x, _265.y, _265.z, _614.w);
    }
    else
    {
        _655 = _525;
        _654 = _614;
    }
    Out.mLocalPositionVec4 = vec4(mkLocalPositionVec4.x, mkLocalPositionVec4.y, mkLocalPositionVec4.z, Out.mLocalPositionVec4.w);
    Out.mLocalPositionVec4.w = 1.0;
    vec3 _531 = vec3(_199.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w);
    vec4 _546 = _199.lUniforms.mpPerFrame.gViewMat4 * vec4((normalize((_654.xyz / _531) - (_199.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz / _531)) * _199.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w) + _199.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz, _654.w);
    vec4 _623 = _546;
    _623.z = -_546.z;
    float _553 = length(_623.xyz);
    vec3 _558 = _623.xyz / vec3(_553);
    float _563 = _558.z + 1.0;
    vec4 _630 = vec4(_558.x, _558.y, _558.z, _623.w);
    _630.x = _558.x / _563;
    vec4 _634 = _630;
    _634.y = _558.y / _563;
    vec4 _642 = _634;
    _642.z = 1.0 - ((_553 - _199.lUniforms.mpPerFrame.gClipPlanesVec4.x) / (_199.lUniforms.mpPerFrame.gClipPlanesVec4.y - _199.lUniforms.mpPerFrame.gClipPlanesVec4.x));
    vec4 _644 = _642;
    _644.w = 1.0;
    float _328 = float(mkCustom1Vec4.w < 0.0);
    vec3 _656;
    float _658;
    if (_328 > 0.0)
    {
        vec3 _657;
        float _659;
        if (_199.lUniforms.mpCustomPerMaterial.gTerrainDistancesVec4.x > 500.0)
        {
            float _349 = clamp(((_199.lUniforms.mpCustomPerMaterial.gTerrainDistancesVec4.x - 700.0) * 0.004999999888241291046142578125) + 0.5, 0.0, 1.0);
            _659 = _349;
            _657 = mix(_655, normalize(_654.xyz - _199.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz), vec3(max(_349 - 0.100000001490116119384765625, 0.0)));
        }
        else
        {
            _659 = 0.0;
            _657 = _655;
        }
        _658 = _659;
        _656 = _657;
    }
    else
    {
        _658 = _328;
        _656 = _655;
    }
    Out.mSmoothNormalVec3_mfDistForFade = vec4(_656, _658);
    Out.mTileVec4.x = mkCustom1Vec4.x;
    Out.mTileVec4.y = mkCustom1Vec4.y;
    Out.mTileVec4.z = mkCustom1Vec4.z;
    Out.mTileVec4.w = mkCustom1Vec4.w;
    gl_Position = _644;
}

