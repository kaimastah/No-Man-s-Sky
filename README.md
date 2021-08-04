# No-Man-s-Sky
3D fix made with Helifax's Vk3DVision v3.0.1 driver https://3dsurroundgaming.com/Vk3DVision.html



___Supported 3D Modes

• Steam OpenVR

• HelixVision VR ( https://store.steampowered.com/app/1127310/HelixVision )

• nVidia 3D Vision

• SBS and TNB formats



___Required Settings

Run the game and set the following graphics options:

• Window Mode: Borderless

• Max FPS: 120 (if using nVidia 3D Vision)

• Motion Blur Amount: 0

• Terrain Tessellation: Standard

• Anti-Aliasing: Off or FXAA



___Installation

• Copy the contents of this fix to your No Man's Sky\Binaries folder ( e.g. C:\games\steam\steamapps\common\No Man's Sky\Binaries ) where NMS.exe is found.

• Vk3DVision.ini ( located in the Vk3DVision folder ) is configured for 3DVision DX11 mode. Change the Stereo3DViewMode setting according to your hardware.

• Run Vk3DVision.exe and start the game.



___Hotkeys

F1-F4: Convergence values

F5-F9: HUD depth values

F: Analysis visor depth key

F10: Toggle Vk3DVision menu

F12: Toggle FPS and statistics overlay


Check Vk3DVision.ini for more hotkeys.



___Important Notes

• This fix works only on Windows 10.

• Disable all active overlays ( Steam, MSI Afterburner, Discord, etc. ) if you experience low FPS.

• Disable Fullscreen Optimizations in the NMS.exe Properties if 3D gets interrupted by Windows notifications or popups.

• Modify hotkey parameters and other settings by opening the Vk3DVision menu in-game.

• Reflections have jittering artifacts on High and Ultra settings. Use Enhanced quality if this bothers you.

• For a better experience I recommend getting this mod: https://www.nexusmods.com/nomanssky/mods/757

• Some rare objects or effects may still be broken, so if you find a bug, take a screenshot using the in-game photo mode as this will show the planet or system coordinates. 


• 3D Vision mode using the default DX11 renderer (Stereo3DViewMode = 3DVision11):

	- Supports nVidia GPU drivers only up to v452.06.

	- Make sure you're not in exclusive fullscreen mode and 3D is turned off before changing graphics settings. The game will freeze otherwise.

	- Use Alt+Enter to switch to exclusive fullscreen mode and trigger 3D when needed.
	
	- On Windows 10 v1903 and higher, this mode may require the global driver hack to be enabled in 3D Fix Manager.

• 3D Vision mode using the DX9 renderer (Stereo3DViewMode = 3DVision):

	- Supports all nVidia GPU driver versions.
	
	- Tabbing out of the game and overlays are not supported.
