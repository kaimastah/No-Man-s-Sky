#version 450
// galaxy core
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

struct TracingFsFxAndFsMapUniforms
{
    vec4 gTraceOrigin;
    vec4 gTraceDir;
    vec4 gTracePDX;
    vec4 gTracePDY;
    vec4 gTraceScreenCenter;
    vec4 gGoalCenterDir;
    vec4 gGoalCenterPerpU;
    vec4 gGoalCenterPerpV;
    vec4 gAnoStreakConfig1;
    vec4 gAnoStreakConfig2;
    vec4 gAnoStreakConfig3;
    vec4 gGalacticScale;
    vec4 gInterest;
    vec4 gTiming;
    vec4 gScreen;
    vec4 gOriginSS;
    vec4 gSunCoreConfig;
    vec4 gSunCoreColour;
    vec4 gBGCellConfig;
    vec4 gBGColourScales;
    vec4 gBGColourConfig;
    vec4 gBGLensFlareColour;
    vec4 gBGLensFlareSpread;
    vec4 gNebulaeStepRange_AlphaPow;
    vec4 gCompositeControlBVCG;
    vec4 gNebulaeTraceConfig;
    vec4 gVignetteLensFlareConfig;
};

struct ColourPalettes
{
    vec4 gLargeAreaPrimaryLUT[10];
    vec4 gLargeAreaSecondaryLUT[10];
};

struct UniformBuffer
{
    PerFrameUniforms mpPerFrame;
    TracingFsFxAndFsMapUniforms mpGalaxyMapPerMesh;
    ColourPalettes mpColourPalettesPerMesh;
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
} _353;

layout(set = 1, binding = 0) uniform sampler2D gNebulaeMap;
layout(set = 1, binding = 1) uniform sampler2D gAtmosMap;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
} In;

layout(location = 0) out vec4 out_color0;

vec3 _1830;

void main()
{

vec2 tex = In.mTexCoordsVec2;
tex.x -= vk3d_params.stereo.x * 0.5;

    vec2 _1278 = vec2(tex.x, 1.0 - In.mTexCoordsVec2.y);
    bool _507 = _353.lUniforms.mpPerFrame.gFoVValuesVec4.z == 2.0;
    vec2 _1806;
    if (_507)
    {
        vec2 _1757 = _1278;
        _1757.x = (In.mTexCoordsVec2.x - _353.lUniforms.mpPerFrame.gVREyeInfoVec3.y) * _353.lUniforms.mpPerFrame.gVREyeInfoVec3.z;
        _1806 = _1757;
    }
    else
    {
        _1806 = _1278;
    }
    vec3 _1302 = normalize(((_353.lUniforms.mpGalaxyMapPerMesh.gTracePDX.xyz * (1.0 - _1806.x)) + _353.lUniforms.mpGalaxyMapPerMesh.gTraceScreenCenter.xyz) + (_353.lUniforms.mpGalaxyMapPerMesh.gTracePDY.xyz * (1.0 - _1806.y)));
    float _674 = clamp((_1302.z + 1.0) * 0.5, 0.0, 1.0);
    vec3 _700 = ((_353.lUniforms.mpGalaxyMapPerMesh.gGalacticScale.xyz * 100.0) + normalize(((_353.lUniforms.mpGalaxyMapPerMesh.gTracePDX.xyz * 0.5) + _353.lUniforms.mpGalaxyMapPerMesh.gTraceScreenCenter.xyz) + (_353.lUniforms.mpGalaxyMapPerMesh.gTracePDY.xyz * 0.5))) * _353.lUniforms.mpGalaxyMapPerMesh.gBGCellConfig.w;
    vec3 _1342 = floor(_700);
    vec3 _1345 = _700 - _1342;
    vec3 _1354 = _1342 - (floor(_1342 * 0.0144927538931369781494140625) * 69.0);
    vec3 _1360 = step(_1354, vec3(67.5)) * (_1354 + vec3(1.0));
    vec4 _1370 = vec4(_1354.xy, _1360.xy) + vec4(50.0, 161.0, 50.0, 161.0);
    vec4 _1373 = _1370 * _1370;
    vec4 _1378 = _1373.xzxz * _1373.yyww;
    vec2 _1388 = vec2(1.0) / (vec2(635.2987060546875) + (vec2(_1354.z, _1360.z) * 48.50038909912109375));
    vec3 _1415 = ((_1345 * _1345) * _1345) * ((_1345 * ((_1345 * 6.0) - vec3(15.0))) + vec3(10.0));
    vec4 _1435 = vec4(_1415.xy, vec2(1.0) - _1415.xy);
    float _1450 = clamp(dot(mix(fract(_1378 * _1388.xxxx), fract(_1378 * _1388.yyyy), vec4(_1415.z)), _1435.zxzx * _1435.wwyy), 0.0, 1.0) * 9.0;
    vec3 _760 = mix(_353.lUniforms.mpColourPalettesPerMesh.gLargeAreaPrimaryLUT[int(floor(_1450))].xyz, _353.lUniforms.mpColourPalettesPerMesh.gLargeAreaPrimaryLUT[int(ceil(_1450))].xyz, vec3(fract(_1450))) * _353.lUniforms.mpGalaxyMapPerMesh.gBGColourScales.x;
    float _792 = pow(clamp(1.0 - abs(dot(_1302, vec3(0.0, 1.0, ((_353.lUniforms.mpGalaxyMapPerMesh.gBGCellConfig.z * (-0.5)) + (0.25 * _353.lUniforms.mpGalaxyMapPerMesh.gBGCellConfig.z)) * clamp(0.89999997615814208984375 - _674, 0.0, 1.0)))), 0.0, 1.0), 4.0);
    float _1491 = dot(_353.lUniforms.mpGalaxyMapPerMesh.gGoalCenterPerpU.xyz, _1302);
    float _1494 = dot(_353.lUniforms.mpGalaxyMapPerMesh.gGoalCenterPerpV.xyz, _1302);
    float _1496 = clamp(dot(_353.lUniforms.mpGalaxyMapPerMesh.gGoalCenterDir.xyz, _1302), 0.0, 1.0);
    vec4 _1807;
    if (_507)
    {
        _1807 = vec4(0.0);
    }
    else
    {
        _1807 = textureLod(gNebulaeMap, In.mTexCoordsVec2, 0.0);
    }
    float _927 = 1.0 - _1807.w;
    vec4 _932 = (vec4(clamp(mix(vec3(0.5), mix(_760 * _353.lUniforms.mpGalaxyMapPerMesh.gBGColourScales.w, mix(_760 * _353.lUniforms.mpGalaxyMapPerMesh.gBGColourScales.y, _760 * _353.lUniforms.mpGalaxyMapPerMesh.gBGColourScales.z, vec3(_674)), vec3(_792 + ((0.0625 * ((_792 * _792) * _792)) * _353.lUniforms.mpGalaxyMapPerMesh.gBGColourConfig.x))), vec3(1.2999999523162841796875)), vec3(0.0), vec3(1.0)), 1.0) * _927) + _1807;
    vec3 _940 = _932.xyz + (textureLod(gAtmosMap, In.mTexCoordsVec2, 0.0).xyz * _353.lUniforms.mpGalaxyMapPerMesh.gBGColourConfig.z);
    vec4 _942 = vec4(_940.x, _940.y, _940.z, _932.w);
    bool _945 = _353.lUniforms.mpPerFrame.gFoVValuesVec4.z != 2.0;
    vec4 _1815;
    if (_945)
    {
        _1815 = mix(_942, _353.lUniforms.mpGalaxyMapPerMesh.gSunCoreColour, vec4(clamp(((1.0 / (length(vec2(-_1491, _1494)) * (mix(_353.lUniforms.mpGalaxyMapPerMesh.gSunCoreConfig.x, _353.lUniforms.mpGalaxyMapPerMesh.gSunCoreConfig.y, _353.lUniforms.mpGalaxyMapPerMesh.gInterest.z) * (1.5 - _353.lUniforms.mpGalaxyMapPerMesh.gGoalCenterDir.w)))) * (_353.lUniforms.mpGalaxyMapPerMesh.gSunCoreConfig.z * _1496)) * _927, 0.0, 1.0)));
    }
    else
    {
        _1815 = _942;
    }
    vec4 _1816;
    if (_945)
    {
        vec2 _1023 = vec2((_1806.x - 0.5) * (_353.lUniforms.mpGalaxyMapPerMesh.gScreen.z * _353.lUniforms.mpPerFrame.gVREyeInfoVec3.z), _1806.y - 0.5);
        vec2 _1030 = vec2(-_1491, _1494);
        vec2 _1508 = _1023 * (length(_1023) * mix(_353.lUniforms.mpGalaxyMapPerMesh.gVignetteLensFlareConfig.z, _353.lUniforms.mpGalaxyMapPerMesh.gVignetteLensFlareConfig.w, 1.0 - _1496));
        vec3 _1778 = _1830;
        _1778.x = 1.019999980926513671875 / (1.0 + (32.0 * pow(length(_1508 + (_1030 * _353.lUniforms.mpGalaxyMapPerMesh.gBGLensFlareSpread.x)), _353.lUniforms.mpGalaxyMapPerMesh.gBGLensFlareSpread.w)));
        vec3 _1782 = _1778;
        _1782.y = 0.939999997615814208984375 / (1.0 + (32.0 * pow(length(_1508 + (_1030 * _353.lUniforms.mpGalaxyMapPerMesh.gBGLensFlareSpread.y)), _353.lUniforms.mpGalaxyMapPerMesh.gBGLensFlareSpread.w)));
        vec3 _1786 = _1782;
        _1786.z = 0.89999997615814208984375 / (1.0 + (32.0 * pow(length(_1508 + (_1030 * _353.lUniforms.mpGalaxyMapPerMesh.gBGLensFlareSpread.z)), _353.lUniforms.mpGalaxyMapPerMesh.gBGLensFlareSpread.w)));
        vec3 _1051 = _1815.xyz + ((_353.lUniforms.mpGalaxyMapPerMesh.gBGLensFlareColour.xyz * (clamp(_1786, vec3(0.0), vec3(1.0)) * _1496)) * (_353.lUniforms.mpGalaxyMapPerMesh.gBGColourConfig.w + (_353.lUniforms.mpGalaxyMapPerMesh.gInterest.y * 0.300000011920928955078125)));
        _1816 = vec4(_1051.x, _1051.y, _1051.z, _1815.w);
    }
    else
    {
        _1816 = _1815;
    }
    vec3 _1572 = _1816.xyz * _353.lUniforms.mpGalaxyMapPerMesh.gCompositeControlBVCG.x;
    float _1577 = _1572.x;
    float _1579 = _1572.y;
    float _1581 = _1572.z;
    vec3 _1612 = mix(vec3(0.5), mix(vec3(dot(_1572, vec3(0.2125000059604644775390625, 0.7153999805450439453125, 0.07209999859333038330078125))), _1572, vec3(1.0 + (_353.lUniforms.mpGalaxyMapPerMesh.gCompositeControlBVCG.y * (1.0 - (sign(_353.lUniforms.mpGalaxyMapPerMesh.gCompositeControlBVCG.y) * (max(_1577, max(_1579, _1581)) - min(_1577, min(_1579, _1581)))))))), vec3(_353.lUniforms.mpGalaxyMapPerMesh.gCompositeControlBVCG.z));
    vec4 _1818;
    if (_945)
    {
        vec2 _1098 = abs(vec2(_1806.x - 0.5, _1806.y - 0.5) + _353.lUniforms.mpGalaxyMapPerMesh.gAnoStreakConfig1.xy);
        float _1124 = ((0.20000000298023223876953125 / ((_353.lUniforms.mpGalaxyMapPerMesh.gAnoStreakConfig2.w * _1098.x) + (_353.lUniforms.mpGalaxyMapPerMesh.gAnoStreakConfig1.w * _1098.y))) * _353.lUniforms.mpGalaxyMapPerMesh.gAnoStreakConfig1.z) * (1.0 - (_927 * 0.300000011920928955078125));
        vec3 _1142 = _1612.xyz + (mix(_353.lUniforms.mpGalaxyMapPerMesh.gAnoStreakConfig2.xyz, _353.lUniforms.mpGalaxyMapPerMesh.gAnoStreakConfig3.xyz, vec3(clamp(_1124, 0.0, 1.0))) * pow(_1124, _353.lUniforms.mpGalaxyMapPerMesh.gAnoStreakConfig3.w));
        _1818 = vec4(_1142.x, _1142.y, _1142.z, _1816.w);
    }
    else
    {
        _1818 = vec4(_1612.x, _1612.y, _1612.z, _1816.w);
    }
    vec2 _1630 = (_1806 - vec2(0.5)) * _353.lUniforms.mpGalaxyMapPerMesh.gVignetteLensFlareConfig.x;
    vec3 _1216 = mix(_1818.xyz, vec3(dot(vec3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625), _1818.xyz)), vec3(_353.lUniforms.mpGalaxyMapPerMesh.gCompositeControlBVCG.w)).xyz * clamp(cos(_1630.x * 3.1415927410125732421875) * cos(_1630.y * 3.1415927410125732421875), _353.lUniforms.mpGalaxyMapPerMesh.gVignetteLensFlareConfig.y, 1.0);
    out_color0 = clamp(vec4(_1216.x, _1216.y, _1216.z, _1818.w), vec4(0.0), vec4(1.0));
}


