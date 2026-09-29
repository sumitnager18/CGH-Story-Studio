# CGH Media Suite — Rebuild Roadmap V1

## Objective

Turn the five prototype repositories into a coherent local-first media production suite:

- CGH Story Studio — story/project/timeline/editor shell
- Nagar Voice Studio — production-grade voice workspace
- Hindi Text-to-Speech Converter — focused Hindi TTS utility
- CGH Local LipSync Studio — local neural lip-sync engine
- Text-to-Audio — Android/mobile companion

## Architecture rule

**One shared media-core contract, multiple focused applications.**

The suite must distinguish:
1. Available and verified
2. Available but unverified
3. Configured but unavailable
4. Simulated/demo behavior

No UI may claim hardware acceleration, model availability, or successful inference solely from a target profile.

## Shared core responsibilities

- Project/media metadata
- Audio normalization and waveform extraction
- Pronunciation dictionaries
- Voice/job models
- Local job queue and cancellation
- Capability discovery
- Model registry and engine adapters
- File/cache/output management
- FFmpeg command abstraction
- Health/diagnostics
- Deterministic JSON schemas
- Export/import

## CGH Story Studio target

Keep the existing domain-engine structure, but finish the boundary between UI and engine layer.

Required hardening:
- timeline/scene source-of-truth invariants
- atomic scene-duration reflow
- interaction preview without persistence on every pointer event
- deterministic audio source slicing
- real media import metadata
- explicit provider adapters
- real export pipeline behind capability detection
- automated type/build validation

## Nagar Voice Studio target

Promote it to the primary voice-production application.

Required capabilities:
- provider-agnostic TTS interface
- local worker protocol
- Gemini provider adapter
- voice library with provenance/status
- pronunciation dictionary hierarchy
- text segmentation/chunk queue
- preview/A-B comparison
- audio post-processing
- waveform inspection
- WAV/MP3 export
- project/session persistence

Voice replication/design must expose actual provider state and never imply a reference voice is officially reproduced without authorized provider capability.

## Hindi TTS target

Make it a small reliable utility instead of a parallel architecture.

Required capabilities:
- Hindi/Hinglish text normalization
- chunking
- pronunciation overrides
- real provider request
- WAV output
- deterministic duration/sample-rate metadata
- retries with bounded backoff
- clear configuration diagnostics
- exportable audio

## Local LipSync target

Treat Wav2Lip ONNX as the primary verified path when the runtime and model are actually available.

Required capabilities:
- capability probe
- engine registry
- real DirectML detection
- model checksum/size validation
- face detection
- audio preprocessing
- neural inference
- frame rendering
- FFmpeg mux/export
- genuine animation verification
- progress/cancellation
- cleanup and resumability

MuseTalk remains an adapter only until a complete real inference implementation is present and verified.

## Android target

Text-to-Audio becomes the mobile client/companion rather than a separate engine.

The Android app should consume a local/network TTS service through a documented API while retaining an offline-capable architecture for future local engines.

## Delivery principles

- Build and verify one vertical slice at a time.
- Prefer local-first operation.
- Cloud providers are adapters, not architectural dependencies.
- Never invent model/provider IDs.
- Never encode a target machine as a detected machine.
- Keep prototype/demo code isolated from production paths.
- Every completed feature must have a validation path.

## Initial implementation order

1. Shared contracts and capability model
2. Local voice worker protocol
3. Harden Nagar Voice Studio
4. Reuse the voice/audio core in Hindi TTS
5. Harden lip-sync capability detection and verified Wav2Lip path
6. Connect Story Studio audio/voice/lipsync adapters
7. Upgrade Android companion
8. Add packaging, installers, diagnostics and release documentation
