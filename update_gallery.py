import os
import re

base_dir = '/home/javi/Escritorio/Ño/Fotos'

def get_images(subpath):
    dir_path = os.path.join(base_dir, subpath) if subpath else base_dir
    files = os.listdir(dir_path)
    images = []
    for f in files:
        if os.path.isfile(os.path.join(dir_path, f)) and f.lower().endswith(('.jpeg', '.jpg', '.png')):
            # skip image00023.jpeg if it's the one being moved
            if f == 'image00023.jpeg' and not subpath:
                continue
            images.append(f)
    return sorted(images)

amigos = get_images('Amigos')
viajes = get_images('viajes')
anios = get_images('')

# Add image00036.jpeg back to amigos since it was incorrectly in anios before, or just follow the dir structure
# the script follows the actual dir structure.

html_content = []

def generate_section(images, category, subpath):
    lines = []
    delay = 50
    for img in images:
        path = f"Fotos/{subpath}/{img}" if subpath else f"Fotos/{img}"
        lines.append(f'            <div class="gallery-item" data-category="{category}" data-aos="fade-up" data-aos-delay="{delay}">')
        lines.append(f'                <img src="{path}" alt="Momento {category}" loading="lazy">')
        lines.append(f'                <div class="gallery-overlay"><span class="gallery-zoom-icon">⤢</span></div>')
        lines.append(f'            </div>')
        delay += 30
        if delay > 500:
            delay = 50
    return "\n".join(lines)

amigos_html = generate_section(amigos, 'amigos', 'Amigos')
viajes_html = generate_section(viajes, 'viajes', 'viajes')
anios_html = generate_section(anios, 'anios', '')

full_inner_html = f"""
            <!-- AMIGOS -->
{amigos_html}

            <!-- VIAJES -->
{viajes_html}

            <!-- ESTOS AÑOS (fotos sueltas en la raíz de Fotos/) -->
{anios_html}
"""

with open('/home/javi/Escritorio/Ño/galeria.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'<div class="gallery-container">.*?</div>\s*</section>', re.DOTALL)
replacement = f'<div class="gallery-container">\n{full_inner_html}\n        </div>\n    </section>'

new_content = pattern.sub(replacement, content)

with open('/home/javi/Escritorio/Ño/galeria.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Gallery updated successfully.")
