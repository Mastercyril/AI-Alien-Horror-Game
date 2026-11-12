// QGenesisUnityBridge.cs
// Destiny's World: The Ancient One — Unity ⇄ 13th Chamber Q Genesis bridge.
//
// Follows the handoff trail from the AI collaboration sprint: this is the
// "INTEGRATE INTO UNITY" step plus the live-game-studio hook. It connects the
// Unity Editor to the local Q Genesis bridge (bridge/server.js, port 8777 —
// the same port the 13thchamberinc.puter.site Quantum Bridge pings).
//
// What it does inside Unity:
//   1. Window ▸ Q Genesis ▸ Game Builder
//   2. "Generate Content" — Her generates NPCs, locations, dialogue and a
//      story branch for your prompt; export them as JSON into the project.
//   3. "Apply Graphics Preset" — one click installs a high-level URP look:
//      bloom, vignette, teal horror color grading, chromatic aberration,
//      film grain, exponential fog, ambient/key light and flickering
//      practical lights. Presets: teal-horror, moonlit-ward, red-alert.
//
// Requirements: Unity 2021.3+ with the Universal Render Pipeline (URP).
// Start the bridge first:  node bridge/server.js

#if UNITY_EDITOR
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEditor;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;
using UnityEngine.SceneManagement;

namespace QGenesis
{
    public class QGenesisUnityBridge : EditorWindow
    {
        private const string BridgeUrl = "http://localhost:8777";
        private static readonly HttpClient Http = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };

        private string prompt = "A psychological horror ward where the alien learns the player's habits each night.";
        private int presetIndex = 0;
        private string[] presetNames = { "teal-horror", "moonlit-ward", "red-alert" };
        private string status = "Bridge not checked.";
        private string lastContentJson;
        private Vector2 scroll;

        [MenuItem("Window/Q Genesis/Game Builder")]
        public static void Open()
        {
            var w = GetWindow<QGenesisUnityBridge>("Q Genesis Bridge");
            w.minSize = new Vector2(420, 520);
        }

        private async void OnEnable()
        {
            status = await PingBridge();
        }

        private static async Task<string> PingBridge()
        {
            try
            {
                using (var req = new HttpRequestMessage(HttpMethod.Get, BridgeUrl + "/health"))
                {
                    var res = await Http.SendAsync(req);
                    return res.IsSuccessStatusCode
                        ? "Bridge connected (localhost:8777)."
                        : "Bridge responded " + (int)res.StatusCode + ".";
                }
            }
            catch
            {
                return "Bridge offline. Run:  node bridge/server.js";
            }
        }

        private async void GenerateContent()
        {
            try
            {
                var payload = "{\"prompt\":" + JsonUtility-ish(prompt) + "}";
                using (var content = new StringContent(payload, Encoding.UTF8, "application/json"))
                {
                    var res = await Http.PostAsync(BridgeUrl + "/generate", content);
                    lastContentJson = await res.Content.ReadAsStringAsync();
                }

                var dir = "Assets/GeneratedContent";
                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
                var path = dir + "/qgenesis-content-" + DateTime.Now.ToString("yyyyMMdd-HHmm") + ".json";
                File.WriteAllText(path, lastContentJson);
                AssetDatabase.Refresh();
                status = "Generated " + Path.GetFileName(path) + " — import as NPC/location/dialogue data.";
                Repaint();
            }
            catch (Exception e)
            {
                status = "Generate failed: " + e.Message + " (is the bridge running?)";
                Repaint();
            }
        }

        private static string JsonUtility-ish(string s) // minimal JSON string escape
        {
            return "\"" + s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n") + "\"";
        }

        private async void ApplyPreset()
        {
            var style = presetNames[presetIndex];
            try
            {
                using (var req = new HttpRequestMessage(HttpMethod.Get, BridgeUrl + "/graphics-preset?style=" + style))
                {
                    var res = await Http.SendAsync(req);
                    var json = await res.Content.ReadAsStringAsync();
                    var preset = JsonUtility.FromJson<GraphicsPreset>(json);
                    ApplyGraphicsPreset(preset);
                    status = "Applied preset '" + preset.name + "'. Volume + lights + fog configured.";
                }
            }
            catch (Exception e)
            {
                status = "Preset failed: " + e.Message + " (is the bridge running?)";
            }
            Repaint();
        }

        private void OnGUI()
        {
            EditorGUILayout.LabelField("Q Genesis ⇄ Unity Bridge", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox(status, MessageType.Info);

            EditorGUILayout.Space();
            EditorGUILayout.LabelField("Game Design Prompt");
            prompt = EditorGUILayout.TextArea(prompt, GUILayout.MinHeight(64));

            if (GUILayout.Button("Generate Content (NPCs, Locations, Dialogue)"))
            {
                GenerateContent();
            }

            EditorGUILayout.Space();
            presetIndex = EditorGUILayout.Popup("Graphics Preset", presetIndex, presetNames);
            if (GUILayout.Button("Apply High-Level Graphics Preset (URP)"))
            {
                ApplyPreset();
            }

            EditorGUILayout.Space();
            if (!string.IsNullOrEmpty(lastContentJson))
            {
                EditorGUILayout.LabelField("Last Generated Content");
                scroll = EditorGUILayout.BeginScrollView(scroll, GUILayout.ExpandHeight(true));
                EditorGUILayout.TextArea(lastContentJson, GUILayout.ExpandHeight(true));
                EditorGUILayout.EndScrollView();
            }

            EditorGUILayout.Space();
            EditorGUILayout.HelpBox(
                "Start the bridge in a terminal at the repo root:\n" +
                "    node bridge/server.js\n" +
                "Then generate content or apply presets here. The same bridge serves the " +
                "13thchamberinc.puter.site Quantum Bridge (port 8777).",
                MessageType.None);
        }

        // ───────────────────────── graphics preset ─────────────────────────

        [Serializable]
        private class GraphicsPreset
        {
            public string name;
            public float exposure = 1.05f;
            public BloomData bloom;
            public VignetteData vignette;
            public ColorGradeData colorGrading;
            public float chromaticAberration = 0.28f;
            public FilmGrainData filmGrain;
            public FogData fog;
            public string ambient = "#132225";
            public KeyLightData keyLight;
            public FlickerData flickerLights;

            [Serializable] public class BloomData { public float intensity, threshold, scatter; }
            [Serializable] public class VignetteData { public float intensity, smoothness, roundness; }
            [Serializable] public class ColorGradeData
            {
                public float[] shadows, midtones, highlights; public float saturation;
            }
            [Serializable] public class FilmGrainData { public float intensity; public int size; }
            [Serializable] public class FogData { public string color; public float density; }
            [Serializable] public class KeyLightData { public string color; public float intensity; }
            [Serializable] public class FlickerData { public string color; public float intensity; public int count; }
        }

        private static void ApplyGraphicsPreset(GraphicsPreset p)
        {
            var volumeGo = GameObject.Find("QGenesisVolume");
            if (volumeGo == null)
            {
                volumeGo = new GameObject("QGenesisVolume");
                volumeGo.AddComponent<Volume>();
                Undo.RegisterCreatedObjectUndo(volumeGo, "Q Genesis Volume");
            }
            var volume = volumeGo.GetComponent<Volume>();
            volume.isGlobal = true;
            var profile = volume.profile;
            if (profile == null) volume.profile = profile = ScriptableObject.CreateInstance<VolumeProfile>();

            // Bloom
            var bloom = profile.Has<Bloom>() ? profile.Get<Bloom>() : profile.Add<Bloom>(true);
            bloom.intensity.Override(p.bloom.intensity);
            bloom.threshold.Override(p.bloom.threshold);
            bloom.scatter.Override(p.bloom.scatter);

            // Vignette
            var vig = profile.Has<Vignette>() ? profile.Get<Vignette>() : profile.Add<Vignette>(true);
            vig.intensity.Override(p.vignette.intensity);
            vig.smoothness.Override(p.vignette.smoothness);
            vig.roundness.Override(p.vignette.roundness);

            // Chromatic aberration
            var ca = profile.Has<ChromaticAberration>() ? profile.Get<ChromaticAberration>() : profile.Add<ChromaticAberration>(true);
            ca.intensity.Override(p.chromaticAberration);

            // Film grain
            var grain = profile.Has<FilmGrain>() ? profile.Get<FilmGrain>() : profile.Add<FilmGrain>(true);
            grain.intensity.Override(p.filmGrain.intensity);
            grain.size.Override((FilmGrainLookup)sizeOf(p.filmGrain.size));

            // Color grading
            var grade = profile.Has<ColorAdjustments>() ? profile.Get<ColorAdjustments>() : profile.Add<ColorAdjustments>(true);
            grade.postExposure.Override(p.exposure);
            grade.saturation.Override(p.colorGrading.saturation);
            var lift = new Vector4(
                p.colorGrading.shadows[0] * 0.5f + 1f,
                p.colorGrading.shadows[1] * 0.5f + 1f,
                p.colorGrading.shadows[2] * 0.5f + 1f, 0f);
            var gain = new Vector4(
                p.colorGrading.highlights[0] * 0.5f + 1f,
                p.colorGrading.highlights[1] * 0.5f + 1f,
                p.colorGrading.highlights[2] * 0.5f + 1f, 0f);
            grade.colorFilter.Override(Color.white);
            bloom.tint.Override(new Color(0.85f, 0.95f, 1f));
            if (liftLift(grade, lift)) { }
            if (gainGain(grade, gain)) { }
            AssetDatabase.SaveAssets();

            // Fog + lighting
            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.ExponentialSquared;
            RenderSettings.fogColor = FromHex(p.fog.color);
            RenderSettings.fogDensity = p.fog.density;
            RenderSettings.ambientLight = FromHex(p.ambient);

            var sun = GameObject.Find("QGenesisKeyLight");
            if (sun == null)
            {
                sun = new GameObject("QGenesisKeyLight");
                var l = sun.AddComponent<Light>();
                l.type = LightType.Directional;
                Undo.RegisterCreatedObjectUndo(sun, "Q Genesis Key Light");
            }
            var light = sun.GetComponent<Light>();
            light.color = FromHex(p.keyLight.color);
            light.intensity = p.keyLight.intensity;
            light.shadows = LightShadows.Soft;

            // Flickering practicals
            var holder = GameObject.Find("QGenesisFlickers");
            if (holder == null) holder = new GameObject("QGenesisFlickers");
            for (int i = holder.transform.childCount - 1; i >= 0; i--)
                DestroyImmediate(holder.transform.GetChild(i).gameObject);
            for (int i = 0; i < p.flickerLights.count; i++)
            {
                var f = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                Object.DestroyImmediate(f.GetComponent<Collider>());
                f.name = "FlickerLight" + i;
                f.transform.SetParent(holder.transform, false);
                f.transform.position = new Vector3(
                    Mathf.Lerp(-8f, 8f, (i % 4) / 3f), 2.9f, Mathf.Lerp(-8f, 8f, i / (float)Mathf.Max(1, p.flickerLights.count - 1)));
                var mat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
                mat.SetColor("_BaseColor", FromHex(p.flickerLights.color));
                f.GetComponent<MeshRenderer>().sharedMaterial = mat;
                var l = f.AddComponent<Light>();
                l.type = LightType.Point;
                l.color = FromHex(p.flickerLights.color);
                l.intensity = p.flickerLights.intensity;
                l.range = 12f;
                f.AddComponent<QGenesisFlicker>();
            }

            EditorUtility.SetDirty(profile);
            EditorSceneManager.MarkSceneDirty(SceneManager.GetActiveScene());
        }

        private static bool liftLift(ColorAdjustments g, Vector4 v) { g.colorFilter.Override(new Color(v.x, v.y, v.z, 1f)); return true; }
        private static bool gainGain(ColorAdjustments g, Vector4 v) { g.colorFilter.Override(new Color(v.x, v.y, v.z, 1f)); return true; }
        private static FilmGrainLookup sizeOf(int s) { return s <= 1 ? FilmGrainLookup.Medium : FilmGrainLookup.Large; }

        private static Color FromHex(string hex)
        {
            if (hex.StartsWith("#")) hex = hex.Substring(1);
            return ColorFromRgb(Convert.ToInt32(hex, 16));
        }
        private static Color ColorFromRgb(int rgb)
        {
            return new Color(((rgb >> 16) & 0xFF) / 255f, ((rgb >> 8) & 0xFF) / 255f, (rgb & 0xFF) / 255f);
        }
    }

    /// Flickering practical light — drives the "dead evacuation" mood.
    public class QGenesisFlicker : MonoBehaviour
    {
        private Light l;
        private float baseIntensity;
        private float nextFlicker;
        private System.Random rand = new System.Random();

        private void Start()
        {
            l = GetComponent<Light>();
            baseIntensity = l.intensity;
        }

        private void Update()
        {
            if (Time.time > nextFlicker)
            {
                double roll = rand.NextDouble();
                l.intensity = roll < 0.08 ? 0f : baseIntensity * (0.7f + (float)rand.NextDouble() * 0.5f);
                nextFlicker = Time.time + (float)(roll < 0.08 ? 0.04 : rand.NextDouble() * 0.35);
            }
        }
    }
}
#endif
