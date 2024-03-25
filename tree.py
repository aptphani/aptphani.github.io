import os

def generate_dir_tree(startpath='.'):
    """Generates a directory tree starting from the given directory path."""
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f'{subindent}{f}')

if __name__ == '__main__':
    print("Generating directory tree for the current directory...\n")
    generate_dir_tree()
