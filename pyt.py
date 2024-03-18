import os
from bs4 import BeautifulSoup

# Specify the directory containing your HTML files
directory = 'E:\\apdemo\\aptphani.github.io\\canvases'
# Specify the output file path
output_file = 'extracted_scripts.txt'

def extract_scripts(directory, output_file):
    with open(output_file, 'w') as output:
        # Iterate over each file in the directory
        for filename in os.listdir(directory):
            if filename.endswith('.html'):
                filepath = os.path.join(directory, filename)
                with open(filepath, 'r') as file:
                    soup = BeautifulSoup(file, 'html.parser')
                    scripts = soup.find_all('script')
                    # Write the filename as a comment before the scripts
                    output.write(f"//// {filename}\n")
                    for script in scripts:
                        # Check if the script tag contains JavaScript code
                        if script.string:
                            output.write(f"<script>\n{script.string}\n</script>\n")
                    output.write("\n")

if __name__ == "__main__":
    extract_scripts(directory, output_file)
    print(f"Scripts extracted to {output_file}")
