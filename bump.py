import json

with open('manifest.json', 'r') as f:
    manifest = json.load(f)

old_version = manifest['version']
parts = old_version.split('.')
parts[-1] = str(int(parts[-1]) + 1)
new_version = '.'.join(parts)

manifest['version'] = new_version
manifest['version_name'] = new_version

with open('manifest.json', 'w') as f:
    json.dump(manifest, f, indent=4)

print(f"Bumped {old_version} to {new_version}")
