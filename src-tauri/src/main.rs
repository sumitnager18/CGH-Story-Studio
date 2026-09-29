#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use std::{fs, path::PathBuf, process::Command};
use tauri::Manager;

#[derive(Serialize)]
struct ComponentStatus {
    id: String,
    installed: bool,
    path: Option<String>,
    version: Option<String>,
}

fn find_executable(names: &[&str]) -> Option<PathBuf> {
    for name in names {
        if let Ok(output) = Command::new(name).arg("-version").output() {
            if output.status.success() || !output.stdout.is_empty() || !output.stderr.is_empty() {
                return Some(PathBuf::from(name));
            }
        }
    }
    None
}

#[tauri::command]
fn get_component_status(app: tauri::AppHandle) -> Vec<ComponentStatus> {
    let mut result = Vec::new();

    let app_data = app.path().app_data_dir().ok();
    let managed_ffmpeg = app_data
        .as_ref()
        .map(|p| p.join("components").join("ffmpeg").join("ffmpeg.exe"));

    let ffmpeg = managed_ffmpeg
        .filter(|p| p.exists())
        .or_else(|| find_executable(&["ffmpeg"]));

    let version = ffmpeg.as_ref().and_then(|path| {
        Command::new(path)
            .arg("-version")
            .output()
            .ok()
            .and_then(|o| {
                let text = String::from_utf8_lossy(&o.stdout).to_string();
                text.lines().next().map(|s| s.to_string())
            })
    });

    result.push(ComponentStatus {
        id: "ffmpeg".into(),
        installed: ffmpeg.is_some(),
        path: ffmpeg.map(|p| p.to_string_lossy().to_string()),
        version,
    });

    result
}

#[tauri::command]
fn prepare_component_directory(app: tauri::AppHandle, component: String) -> Result<String, String> {
    let root = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("components")
        .join(component);

    fs::create_dir_all(&root).map_err(|e| e.to_string())?;
    Ok(root.to_string_lossy().to_string())
}

#[tauri::command]
fn app_data_directory(app: tauri::AppHandle) -> Result<String, String> {
    Ok(app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .to_string_lossy()
        .to_string())
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_component_status,
            prepare_component_directory,
            app_data_directory
        ])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_title("CGH Story Studio");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running CGH Story Studio");
}

fn main() {
    run();
}
