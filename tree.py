import os

# Paths/folders to ignore
IGNORE_PATHS = {
    "node_modules",
    ".next",
    ".git",
    "dist",
    "build",
    "__pycache__",
    ".redux",
    "venv",
    "components/ui"
}

def should_ignore(relative_path):
    # Normalize path separators
    normalized = relative_path.replace("\\", "/")
    return normalized in IGNORE_PATHS

def print_structure(path='.', prefix=''):
    try:
        items = sorted(os.listdir(path))

        visible_items = []

        for item in items:
            full_path = os.path.join(path, item)

            # Get relative path from root
            relative_path = os.path.relpath(full_path, '.')

            if not should_ignore(relative_path):
                visible_items.append(item)

        for i, item in enumerate(visible_items):
            full_path = os.path.join(path, item)
            is_last = i == len(visible_items) - 1

            connector = "└── " if is_last else "├── "
            print(prefix + connector + item)

            if os.path.isdir(full_path):
                extension = "    " if is_last else "│   "
                print_structure(full_path, prefix + extension)

    except PermissionError:
        print(prefix + "└── [Permission Denied]")

# Run for current folder
print_structure()