import re

file_path = "apps/erp/app/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Stop hiding the Satellite
content = content.replace("<SatelliteOrbit isHidden={isModalOpen} />", "<SatelliteOrbit isHidden={false} />")

# 2. Stop hiding the Earth
content = content.replace(
    "animate={{ opacity: isModalOpen ? 0 : 0.6, rotate: 360 }}",
    "animate={{ opacity: 0.6, rotate: 360 }}"
)

# 3. Stop hiding the watermark
content = content.replace(
    "animate={{ opacity: isModalOpen ? 0 : 0.07 }}",
    "animate={{ opacity: 0.07 }}"
)

# 4. Make modals more transparent so the universe shows through.
# Let's replace `bg-[#020617]/98 backdrop-blur-2xl` with `bg-[#020617]/40 backdrop-blur-md`
content = content.replace(
    "bg-[#020617]/98 backdrop-blur-2xl",
    "bg-[#020617]/40 backdrop-blur-md"
)

# Replace the password modal background too
content = content.replace(
    "bg-[#020617]/95 backdrop-blur-md",
    "bg-[#020617]/40 backdrop-blur-md"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated backgrounds successfully.")
