// BuildScript.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from FINAL_FIX_AND_COMPLETION_SPRINT.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEditor;
using UnityEditor.SceneManagement;

public class BuildScript
{
    public static void BuildWebGL()
    {
        string[] scenes = {
            "Assets/Scenes/LoadingScene.unity",
            "Assets/Scenes/MainScene.unity",
            "Assets/Scenes/GameOverScene.unity",
            "Assets/Scenes/WinScene.unity"
        };
        
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions()
        {
            scenes = scenes,
            locationPathName = "Build/WebGL/index.html",
            target = BuildTarget.WebGL,
            options = BuildOptions.Development
        };
        
        BuildPipeline.BuildPlayer(buildPlayerOptions);
    }
}
