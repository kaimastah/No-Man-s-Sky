#version 450

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
    vec4 gCloudColourExternalVec4;
    vec4 gCloudColourInternalVec4;
    vec4 gCloudRatioVec4;
    vec4 gCloudParamsVec4;
    vec4 gHueOverlayParamsVec4;
    vec4 gSaturationOverlayParamsVec4;
    vec4 gValueOverlayParamsVec4;
    vec4 gSunRayParams;
    vec4 gSunPositionVec4;
    vec4 gWindOffset;
    vec4 gCloudBaseColour;
    vec4 gCloudTopColour;
    vec4 gCloudHeightGradient1;
    vec4 gCloudHeightGradient2;
    vec4 gCloudHeightGradient3;
    vec4 gCoverageParamsVec4;
    vec4 gLightingParamsVec4;
    vec4 gLightConeParamsVec4;
    vec4 gLightScatteringParamsVec4;
    vec4 gAnimationParamsVec4;
    vec4 gModelingBaseParamsVec4;
    vec4 gModelingDetailParamsVec4;
    vec4 gOptimisationParamsVec4;
    vec4 gAtmosphereParamsVec4;
    vec4 gCloudSubFrameParamsVec4;
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
} _355;

layout(set = 1, binding = 0) uniform sampler2D gBuffer1Map;
layout(set = 1, binding = 1) uniform sampler2D gCoverage2D;

layout(location = 0) in VertexBlock
{
    vec2 mTexCoordsVec2;
    flat vec4 mUpVec3_mfCameraHeight;
    flat vec3 mCross1Vec3;
    flat vec3 mCross2Vec3;
} In;

layout(location = 0) out vec4 out_color0;

vec4 _934;

void main()
{
    vec2 _711 = (vec2(In.mTexCoordsVec2.x, 1.0 - In.mTexCoordsVec2.y) * 2.0) - vec2(1.0);
    vec4 _910 = vec4(_711.x, _711.y, _934.z, _934.w);
    _910.z = 0.0;
    
    _910.x -= vk3d_params.stereo.x * (1 - vk3d_params.stereo.y / (texture(gBuffer1Map, In.mTexCoordsVec2).x * _355.lUniforms.mpPerFrame.gClipPlanesVec4.y));
    
    vec4 _912 = _910;
    _912.w = 1.0;
    vec4 _718 = _355.lUniforms.mpPerFrame.gInverseProjectionMat4 * _912;
    mat4 _915 = _355.lUniforms.mpPerFrame.gInverseViewMat4;
    _915[3] = vec4(0.0, 0.0, 0.0, 1.0);
    vec3 _384 = ((_915 * ((_718 / vec4(abs(_718.z))) * (texture(gBuffer1Map, In.mTexCoordsVec2).x * _355.lUniforms.mpPerFrame.gClipPlanesVec4.y))).xyz + _355.lUniforms.mpPerFrame.gViewPositionVec3).xyz - _355.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _400 = _355.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _355.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.z;
    vec3 _419 = _355.lUniforms.mpPerFrame.gViewPositionVec3 - _355.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.xyz;
    float _436 = _355.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w + _355.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.y;
    vec3 _440 = _384 + normalize(_419);
    float _935;
    vec3 _936;
    for (;;)
    {
        vec3 _772 = normalize(_384 - _440);
        float _775 = dot(_384, _772);
        float _776 = 2.0 * _775;
        float _789 = (_776 * _776) - (4.0 * (dot(_384, _384) - (_436 * _436)));
        if (_789 >= 0.0)
        {
            _936 = _384 + (_772 * (0.5 * ((_775 * (-2.0)) - sqrt(_789))));
            _935 = 1.0;
            break;
        }
        _936 = _440;
        _935 = 0.0;
        break;
    }
    vec4 _940;
    if (_935 == 0.0)
    {
        _940 = vec4(1.0);
    }
    else
    {
        vec3 _467 = pow(abs(normalize(_936)), vec3(32.0));
        vec3 _478 = _467 / vec3((_467.x + _467.y) + _467.z);
        float _839 = _478.x;
        float _843 = _478.y;
        float _848 = _478.z;
        vec3 _503 = (_936 + ((((vec3(0.5, _355.lUniforms.mpCustomPerMesh.gWindOffset.yx) * _839) + (vec3(_355.lUniforms.mpCustomPerMesh.gWindOffset.y, 0.5, _355.lUniforms.mpCustomPerMesh.gWindOffset.x) * _843)) + (vec3(_355.lUniforms.mpCustomPerMesh.gWindOffset.xy, 0.5) * _848)) * (_355.lUniforms.mpCustomPerMesh.gAnimationParamsVec4.x * _355.lUniforms.mpPerFrame.gfTime))) * (1.0 / sqrt((_400 * _400) - (_355.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w * _355.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w)));
        vec2 _937;
        if (_839 > 0.0030000000260770320892333984375)
        {
            _937 = textureLod(gCoverage2D, _503.yz, 0.0).yz * _839;
        }
        else
        {
            _937 = vec2(0.0);
        }
        vec2 _938;
        if (_843 > 0.0030000000260770320892333984375)
        {
            _938 = _937 + (textureLod(gCoverage2D, _503.zx, 0.0).yz * _843);
        }
        else
        {
            _938 = _937;
        }
        vec2 _939;
        if (_848 > 0.0030000000260770320892333984375)
        {
            _939 = _938 + (textureLod(gCoverage2D, _503.xy, 0.0).yz * _848);
        }
        else
        {
            _939 = _938;
        }
        _940 = vec4(mix((1.0 - smoothstep(0.5, 1.0, _939.x)) * 0.5, 1.0, smoothstep(_355.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.w * 4.0, _355.lUniforms.mpCustomPerMesh.gAtmosphereParamsVec4.w * 5.0, length(_419) - _355.lUniforms.mpCommonPerMesh.gPlanetPositionVec4.w)));
    }
    out_color0 = clamp(_940, vec4(0.0), vec4(1.0));
}


