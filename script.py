import os


def write_directory_structure(root_dir, file):
    
   
    def write_structure(current_dir, indent=""):
        entries = sorted(os.listdir(current_dir))
        dirs = [
            entry
            for entry in entries
            if os.path.isdir(os.path.join(current_dir, entry))
        ]
        files = [
            entry
            for entry in entries
            if os.path.isfile(os.path.join(current_dir, entry))
        ]

        
        for i, entry in enumerate(files):
            if entry in (".gitignore", ".DS_Store"):
                continue 
            is_last = i == len(files) - 1 and not dirs
            if is_last:
                f.write(f"{indent}└── {entry}\n")
            else:
                f.write(f"{indent}├── {entry}\n")

       
        for i, entry in enumerate(dirs):
            if entry in ("node_modules", ".git"):
                continue 

            path = os.path.join(current_dir, entry)
            is_last = i == len(dirs) - 1
            if is_last:
                f.write(f"{indent}└── {entry}\n")
                next_indent = indent + "    "
            else:
                f.write(f"{indent}├── {entry}\n")
                next_indent = indent + "│   "
            write_structure(path, next_indent)

    with open(file, "w") as f:
        f.write(f"{root_dir}\n")
        write_structure(root_dir)


def write_js_files_contents(root_dir, file):
    

    def write_js_contents(current_dir):
        entries = sorted(os.listdir(current_dir))
        dirs = [
            entry
            for entry in entries
            if os.path.isdir(os.path.join(current_dir, entry))
        ]
        files = [
            entry
            for entry in entries
            if os.path.isfile(os.path.join(current_dir, entry))
        ]

       
        for entry in files:
            if entry.endswith((".jsx" , ".ejs")):
                path = os.path.join(current_dir, entry)
               
                relative_path = os.path.relpath(path, root_dir)
                with open(file, "a") as f:
                    f.write(f"{relative_path}\n")
                    f.write(f"// Content of {relative_path}:\n")
                    with open(path, "r") as js_file:
                        f.write(js_file.read() + "\n\n")

        
        for entry in dirs:
            if entry in ("node_modules", ".git"):
                continue  

            path = os.path.join(current_dir, entry)
            write_js_contents(path)

    with open(file, "w") as f:
        f.write(f"JavaScript files in {root_dir}:\n\n")
    write_js_contents(root_dir)


if __name__ == "__main__":

    folder_path = "./Frontend"
    directory_file = "directory_structure.txt"
    js_files_file = "js_files_contents.txt"

    write_directory_structure(folder_path, directory_file)
    print(f"Directory structure has been written to {directory_file}")

    write_js_files_contents(folder_path, js_files_file)
    print(f"JavaScript files contents have been written to {js_files_file}")
